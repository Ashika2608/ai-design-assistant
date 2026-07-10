import os
import io
import uuid
import urllib.parse
import requests
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "generated")
os.makedirs(STATIC_DIR, exist_ok=True)

POLLINATIONS_BASE = "https://image.pollinations.ai/prompt/"


def _fetch_background(prompt: str, width: int, height: int):
    """
    Fetch a real, free, photorealistic background image from Pollinations AI
    (no API key needed) sized to the target canvas. Falls back to None on
    any failure so the renderer can still produce a solid-color design.
    """
    try:
        encoded = urllib.parse.quote(prompt)
        url = f"{POLLINATIONS_BASE}{encoded}?width={width}&height={height}&nologo=true"
        response = requests.get(url, timeout=25)
        response.raise_for_status()
        bg = Image.open(io.BytesIO(response.content)).convert("RGB")
        bg = bg.resize((width, height))
        return bg
    except Exception:
        return None

# Canvas size per design type (width, height)
CANVAS_SIZES = {
    "poster": (1080, 1350),
    "instagram_post": (1080, 1080),
    "business_card": (1050, 600),
    "thumbnail": (1280, 720),
}

FONT_DIR = os.path.join(os.path.dirname(__file__), "fonts")


def _load_font(size: int):
    """
    Tries to load a bundled TTF; falls back to PIL's default bitmap font
    if no TTF is present. Drop .ttf files into app/services/fonts/ for
    better typography (see README).
    """
    candidates = [
        os.path.join(FONT_DIR, "Poppins-Bold.ttf"),
        os.path.join(FONT_DIR, "Poppins-Regular.ttf"),
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()


def _hex_to_rgb(hex_color: str):
    hex_color = hex_color.lstrip("#")
    if len(hex_color) != 6:
        return (30, 30, 30)
    return tuple(int(hex_color[i:i + 2], 16) for i in range(0, 6, 2))


def render_design(spec: dict, design_type: str) -> str:
    """
    Renders the AI-generated design spec into an actual PNG file.
    Returns the relative path (served as a static file) to the image.
    """
    width, height = CANVAS_SIZES.get(design_type, (1080, 1080))

    bg_color = _hex_to_rgb(spec.get("background_color", "#131020"))
    primary = _hex_to_rgb(spec.get("primary_color", "#4F46E5"))
    accent = _hex_to_rgb(spec.get("accent_color", "#F59E0B"))
    text_color = _hex_to_rgb(spec.get("text_color", "#FFFFFF"))
    layout = spec.get("layout", "centered")
    bg_prompt = spec.get("background_image_prompt", "")

    fetched_bg = _fetch_background(bg_prompt, width, height) if bg_prompt else None

    if fetched_bg:
        img = fetched_bg
        # Darken slightly so white/light text stays readable over any photo
        img = ImageEnhance.Brightness(img).enhance(0.75)
        draw = ImageDraw.Draw(img, "RGBA")
        # Semi-transparent color wash ties the photo to the AI-chosen palette
        draw.rectangle([0, 0, width, height], fill=(*primary, 60))
    else:
        # Fallback: solid-color design (used if Pollinations is unreachable)
        img = Image.new("RGB", (width, height), color=bg_color)
        draw = ImageDraw.Draw(img)
        if layout == "split":
            draw.rectangle([0, 0, width // 3, height], fill=primary)
        elif layout == "top-heavy":
            draw.rectangle([0, 0, width, height // 4], fill=primary)
        else:
            draw.ellipse([-width * 0.2, -height * 0.2, width * 0.5, height * 0.4], fill=primary)

    draw.rectangle([0, height - 40, width, height], fill=accent)

    headline = spec.get("headline", "Your Headline")
    subheadline = spec.get("subheadline", "")

    headline_font = _load_font(max(48, width // 14))
    sub_font = _load_font(max(24, width // 32))

    padding = int(width * 0.08)
    text_area_width = width - 2 * padding

    def wrap_text(text, font, max_width):
        words = text.split()
        lines, current = [], ""
        for w in words:
            trial = (current + " " + w).strip()
            bbox = draw.textbbox((0, 0), trial, font=font)
            if bbox[2] - bbox[0] <= max_width or not current:
                current = trial
            else:
                lines.append(current)
                current = w
        if current:
            lines.append(current)
        return lines

    headline_lines = wrap_text(headline, headline_font, text_area_width)
    sub_lines = wrap_text(subheadline, sub_font, text_area_width) if subheadline else []

    total_text_height = len(headline_lines) * (headline_font.size + 12) + len(sub_lines) * (sub_font.size + 8)
    y = (height - total_text_height) // 2 if layout == "centered" else height // 2

    for line in headline_lines:
        bbox = draw.textbbox((0, 0), line, font=headline_font)
        line_w = bbox[2] - bbox[0]
        x = padding if layout in ("left-aligned", "split") else (width - line_w) // 2
        draw.text((x, y), line, font=headline_font, fill=text_color)
        y += headline_font.size + 12

    y += 10
    for line in sub_lines:
        bbox = draw.textbbox((0, 0), line, font=sub_font)
        line_w = bbox[2] - bbox[0]
        x = padding if layout in ("left-aligned", "split") else (width - line_w) // 2
        draw.text((x, y), line, font=sub_font, fill=text_color)
        y += sub_font.size + 8

    filename = f"{design_type}_{uuid.uuid4().hex[:10]}.png"
    filepath = os.path.join(STATIC_DIR, filename)
    img.save(filepath, "PNG")

    return f"/static/generated/{filename}"
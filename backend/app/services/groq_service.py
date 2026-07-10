import json
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


def _chat(system: str, user: str, json_mode: bool = False) -> str:
    kwargs = {}
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}

    response = client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.7,
        **kwargs,
    )
    return response.choices[0].message.content


def enhance_prompt(raw_prompt: str, design_type: str) -> str:
    """Turn a short user prompt into a detailed creative brief."""
    system = (
        "You are a professional graphic design creative director. "
        "Expand short design requests into a rich, specific creative brief "
        "(mood, color direction, style, subject matter). Reply in 2-3 sentences, plain text only."
    )
    user = f"Design type: {design_type}\nUser prompt: {raw_prompt}"
    return _chat(system, user).strip()


def generate_design_spec(enhanced_prompt: str, design_type: str) -> dict:
    """
    Ask the LLM to return a structured JSON design spec that the
    Pillow renderer can turn into an actual image. This keeps the AI's
    job as 'reasoning over structured design decisions', not raw pixels.
    """
    system = (
        "You are a design system that outputs ONLY valid JSON (no markdown, no extra text). "
        "Given a creative brief, output a JSON object with exactly these keys:\n"
        "{\n"
        '  "headline": string (max 6 words),\n'
        '  "subheadline": string (max 12 words),\n'
        '  "primary_color": "#RRGGBB",\n'
        '  "secondary_color": "#RRGGBB",\n'
        '  "accent_color": "#RRGGBB",\n'
        '  "background_color": "#RRGGBB",\n'
        '  "text_color": "#RRGGBB",\n'
        '  "font_style": one of ["bold-sans","elegant-serif","playful-rounded","minimal-modern"],\n'
        '  "layout": one of ["centered","left-aligned","top-heavy","split"],\n'
        '  "background_image_prompt": string (a vivid, photorealistic scene description '
        'for an image-generation model - e.g. "modern city skyline at sunset, blue tones, '
        'cinematic lighting" - max 20 words, no text/words/letters in the description)\n'
        "}"
    )
    user = f"Design type: {design_type}\nCreative brief: {enhanced_prompt}"
    raw = _chat(system, user, json_mode=True)
    return json.loads(raw)


def chat_reply(message: str) -> str:
    system = (
        "You are a helpful AI design assistant chatbot inside a graphic design app. "
        "You give concise, practical advice on colors, fonts, layout, branding, "
        "marketing copy, captions and hashtags. Keep replies short and actionable."
    )
    return _chat(system, message).strip()
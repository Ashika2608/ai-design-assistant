from fastapi import APIRouter

router = APIRouter(prefix="/api/templates", tags=["Templates"])

# Curated static templates - no DB needed, keeps scope tight.
TEMPLATES = [
    {"id": 1, "name": "Modern Tech Poster", "design_type": "poster",
     "prompt": "A modern technology poster with blue gradient and futuristic feel"},
    {"id": 2, "name": "Cafe Promo Post", "design_type": "instagram_post",
     "prompt": "A warm coffee shop promotional post with brown and cream tones"},
    {"id": 3, "name": "Minimal Business Card", "design_type": "business_card",
     "prompt": "A minimal corporate business card with navy blue and gold accents"},
    {"id": 4, "name": "Gaming YouTube Thumbnail", "design_type": "thumbnail",
     "prompt": "A bold high-energy gaming YouTube thumbnail with neon colors"},
    {"id": 5, "name": "Fitness Motivation Poster", "design_type": "poster",
     "prompt": "An energetic fitness motivation poster with red and black theme"},
    {"id": 6, "name": "Wedding Invitation Post", "design_type": "instagram_post",
     "prompt": "An elegant wedding invitation post with soft pink and gold"},
]


@router.get("")
def list_templates():
    return TEMPLATES

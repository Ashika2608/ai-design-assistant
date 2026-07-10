import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Design, User
from app.schemas import DesignGenerateRequest, DesignOut
from app.auth.utils import get_current_user
from app.services import groq_service, image_renderer

router = APIRouter(prefix="/api/design", tags=["Design"])

VALID_TYPES = {"poster", "instagram_post", "business_card", "thumbnail"}


@router.post("/generate", response_model=DesignOut)
def generate_design(
    payload: DesignGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.design_type not in VALID_TYPES:
        raise HTTPException(status_code=400, detail=f"design_type must be one of {VALID_TYPES}")

    # 1. Enhance the raw prompt into a detailed creative brief
    enhanced = groq_service.enhance_prompt(payload.prompt, payload.design_type)

    # 2. Ask the LLM to reason about the design and return structured JSON
    spec = groq_service.generate_design_spec(enhanced, payload.design_type)

    # 3. Render the structured spec into an actual PNG
    image_path = image_renderer.render_design(spec, payload.design_type)

    design = Design(
        user_id=current_user.id,
        design_type=payload.design_type,
        prompt=payload.prompt,
        enhanced_prompt=enhanced,
        spec_json=json.dumps(spec),
        image_path=image_path,
    )
    db.add(design)
    db.commit()
    db.refresh(design)
    return design


@router.get("/list", response_model=list[DesignOut])
def list_designs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Design)
        .filter(Design.user_id == current_user.id)
        .order_by(Design.created_at.desc())
        .all()
    )


@router.get("/{design_id}", response_model=DesignOut)
def get_design(
    design_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    design = (
        db.query(Design)
        .filter(Design.id == design_id, Design.user_id == current_user.id)
        .first()
    )
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    return design


@router.delete("/{design_id}")
def delete_design(
    design_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    design = (
        db.query(Design)
        .filter(Design.id == design_id, Design.user_id == current_user.id)
        .first()
    )
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    db.delete(design)
    db.commit()
    return {"message": "Design deleted"}

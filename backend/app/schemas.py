from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


# ---------- Auth ----------
class RegisterRequest(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain an uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain a number")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    full_name: str
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Design ----------
class DesignGenerateRequest(BaseModel):
    prompt: str
    design_type: str  # poster | instagram_post | business_card | thumbnail


class DesignOut(BaseModel):
    id: int
    design_type: str
    prompt: str
    enhanced_prompt: Optional[str]
    image_path: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Chat ----------
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str

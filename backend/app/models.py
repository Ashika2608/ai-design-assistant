from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    username = Column(String(60), unique=True, nullable=False, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    designs = relationship("Design", back_populates="owner", cascade="all, delete-orphan")


class Design(Base):
    __tablename__ = "designs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    design_type = Column(String(50), nullable=False)   # poster, instagram_post, business_card, thumbnail
    prompt = Column(Text, nullable=False)
    enhanced_prompt = Column(Text, nullable=True)
    spec_json = Column(Text, nullable=True)            # raw AI-generated design spec (colors, fonts, layout, copy)
    image_path = Column(String(255), nullable=False)   # relative path/url to rendered PNG
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="designs")

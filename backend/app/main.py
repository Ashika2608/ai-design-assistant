import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.auth.routes import router as auth_router
from app.routers.design import router as design_router
from app.routers.chat import router as chat_router
from app.routers.templates import router as templates_router

# Create tables on startup (fine for a portfolio project; use Alembic for real migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Design Assistant API",
    description="AI-powered graphic design assistant - Groq generates a structured "
                 "design spec, Pillow renders it into a real image.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://ai-design-assistant-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(auth_router)
app.include_router(design_router)
app.include_router(chat_router)
app.include_router(templates_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}

# AI Design Assistant

Full-stack AI-powered graphic design generator. Users describe a design in
plain English; the app enhances the prompt, uses Groq (Llama 3.3) to reason
about colors/fonts/layout as **structured JSON**, then **renders a real PNG**
with Pillow — no external image-generation API needed.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router + Axios
- **Backend:** FastAPI + SQLAlchemy + JWT Auth (python-jose + passlib)
- **Database:** MySQL
- **AI:** Groq API (Llama 3.3)
- **Image rendering:** Pillow (Python Imaging Library)

## Architecture (the key interview point)

```
User Prompt
   |
   v
React sends prompt -> FastAPI /api/design/generate
   |
   v
Groq enhances prompt into a creative brief
   |
   v
Groq returns a STRUCTURED JSON spec
   (headline, subheadline, colors, font style, layout)
   |
   v
Pillow renders that spec into an actual PNG
   |
   v
Image saved to /static/generated, metadata + path saved to MySQL
   |
   v
React shows preview + download link
```

**Why this design matters for interviews:** the AI's job is constrained to
producing structured *decisions* (like StackLens AI's "analyze findings, not
raw code" pattern), while a deterministic renderer (Pillow) turns those
decisions into pixels. This avoids the cost/complexity/opacity of a diffusion
image-generation API, keeps the AI's output auditable and debuggable, and
is something you can fully explain end-to-end in a technical round.

## Features Implemented

- JWT auth (register/login, show/hide password, forgot-password UI)
- AI Design Generator (poster, Instagram post, business card, YouTube thumbnail)
- Prompt Enhancer (short prompt -> detailed creative brief)
- AI Chat Assistant (colors/fonts/layout/caption/branding advice)
- Curated Templates (one-click prefill into the generator)
- My Designs (list, download, delete) backed by MySQL
- Dashboard with basic stats
- Dark/Light mode
- Protected routes + JWT-secured API

## Deliberately NOT included (say this proactively in interviews as "roadmap")

- Admin panel, Cloudinary cloud storage, real-time drag-drop canvas editor,
  background removal, layer management, undo/redo, notifications system.
  These add real value but need far more time than a single portfolio
  project justifies — mentioning them as a clear, thought-out roadmap shows
  scoping judgment, which interviewers respect more than an unfinished
  mega-feature list.

## Setup

### 1. Database
```sql
CREATE DATABASE ai_design_assistant;
```

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env        # then fill in DB password + GROQ_API_KEY
uvicorn app.main:app --reload --port 8000
```
API docs available at `http://localhost:8000/docs`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`.

### 4. (Optional) Better typography
Drop `Poppins-Bold.ttf` and `Poppins-Regular.ttf` (Google Fonts, free) into
`backend/app/services/fonts/` for nicer rendered text. Without them, Pillow
falls back to its default bitmap font — still works, just plainer.

## Folder Structure

```
ai-design-assistant/
├── backend/
│   ├── app/
│   │   ├── auth/          # JWT + password hashing + routes
│   │   ├── routers/       # design, chat, templates endpoints
│   │   ├── services/      # groq_service.py, image_renderer.py
│   │   ├── static/generated/  # rendered PNGs
│   │   ├── models.py      # User, Design (SQLAlchemy)
│   │   ├── schemas.py      # Pydantic request/response models
│   │   ├── database.py
│   │   ├── config.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── pages/          # Login, Register, Dashboard, DesignGenerator...
        ├── components/     # Sidebar, ProtectedRoute
        ├── context/        # AuthContext
        └── services/       # api.js (axios + JWT interceptor)
```

## Resume line

Built a full-stack AI design assistant (React, FastAPI, MySQL, Groq/Llama 3.3)
that converts natural-language prompts into structured design specifications
and renders them into downloadable images via a custom Pillow-based rendering
engine, with JWT auth and a MySQL-backed design history.

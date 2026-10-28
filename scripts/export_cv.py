"""Export canonical CV facts from ~/cv/cv_render.py into src/data/cv.json.

The CV renderer is the single source of truth; this script only selects and
reshapes. The AI/ML Engineer variant (~/cv/build_variants.py) is copied unchanged for download.
"""
import json
import re
import shutil
import sys
from pathlib import Path

CV_DIR = Path.home() / "cv"
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(CV_DIR))
import cv_render as cv  # noqa: E402

TAG = re.compile(r"<[^>]+>")


def clean(s):
    return TAG.sub("", s).replace("&amp;", "&").replace("’", "'").strip()


def bullet(s):
    """'<b>Label:</b> text' -> {label, text}."""
    m = re.match(r"<b>(.*?):</b>\s*(.*)", s)
    if m:
        return {"label": clean(m.group(1)), "text": clean(m.group(2))}
    return {"label": "", "text": clean(s)}


USTYLE_FULLTIME = ["production_software_ml", "llm_vlm", "production_genai_platforms",
                   "fullstack_web", "local_llm_ops", "ml_monitoring", "ecommerce"]
USTYLE_THESIS = ["vto_research_past", "body_seg"]

data = {
    "name": cv.NAME,
    "title": cv.DEFAULT_TITLE,
    "summary": clean(cv.DEFAULT_SUMMARY),
    "location": "Torino, Italy",
    "email": "amirrezarahimi771@gmail.com",
    "linkedin": "https://www.linkedin.com/in/amirrezarahimi771",
    "github": "https://github.com/rezar771",
    "experience": [
        {"role": "Full-Stack AI Engineer", "org": "Ustyle S.r.l.", "location": "Torino, Italy",
         "dates": "Jan 2026 – Present", "current": True,
         "bullets": [bullet(cv.USTYLE_BULLETS[k]) for k in USTYLE_FULLTIME]},
        {"role": "AI & Computer Vision Engineer (Thesis Intern)", "org": "Ustyle S.r.l.",
         "location": "Torino, Italy", "dates": "Sep 2025 – Jan 2026",
         "bullets": [bullet(cv.USTYLE_BULLETS[k]) for k in USTYLE_THESIS]},
        {"role": "Robotics Team Lead", "org": "Salam High School", "location": "Tehran, Iran",
         "dates": "Jul 2019 – Nov 2021",
         "bullets": [bullet(b) for b in cv.ROBOTICS_BULLETS]},
    ],
    "education": [
        {"degree": "MSc Computer Engineering — Artificial Intelligence", "school": "Politecnico di Torino",
         "location": "Torino, Italy", "dates": "Graduated July 2026",
         "note": "Thesis: Pose Transfer and Layer-Aware Virtual Try-On for Multi-Garment Outfit Generation"},
        {"degree": "BSc Computer Engineering", "school": "Islamic Azad University, Science and Research Branch",
         "location": "Tehran, Iran", "dates": "2018 – 2022",
         "note": "GPA 16.63 / 20 (last two years 18.03 / 20)"},
    ],
    "publication": {
        "title": "SemEval 2026 Task 1: MWAHAHA — Models Write Automatic Humor And Humans Annotate",
        "venue": "SemEval 2026 · ACL Anthology",
        "role": "Co-author",
        "text": "Shared-task paper on computational humor generation with LLMs, part of the first SemEval task dedicated to humor generation.",
        "url": "https://aclanthology.org/2026.semeval-1.372",
    },
    "skills": {k: {"label": v[0], "items": [s.strip() for s in v[1].split(",")]}
               for k, v in cv.SKILLS.items() if k in cv.SKILLS_DEFAULT + ["agentic_engineering", "fullstack_web"]},
    "projects": {k: {"name": clean(n), "bullets": [clean(b) for b in bs]} for k, (n, bs) in cv.PROJECTS.items()},
    "languages": [
        {"name": "English", "level": "Professional"},
        {"name": "Italian", "level": "Elementary (A2)"},
        {"name": "Persian", "level": "Native"},
    ],
}

(ROOT / "src/data/cv.json").write_text(json.dumps(data, indent=2, ensure_ascii=False))
shutil.copy(CV_DIR / "Amirreza_Rahimi_CV_AI_ML_Engineer.pdf", ROOT / "public/Amirreza_Rahimi_CV.pdf")
print("wrote src/data/cv.json and public/Amirreza_Rahimi_CV.pdf")

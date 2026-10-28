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


USTYLE_FULLTIME = ["production_software_ml", "llm_vlm_past", "production_genai_platforms_past",
                   "fullstack_web", "local_llm_ops", "ml_monitoring", "ecommerce_past"]
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
         "dates": "Jan 2026 – Oct 2026",
         "bullets": [bullet(cv.USTYLE_BULLETS[k]) for k in USTYLE_FULLTIME]},
        {"role": "AI & Computer Vision Engineer (Thesis Intern)", "org": "Ustyle S.r.l.",
         "location": "Torino, Italy", "dates": "Sep 2025 – Jan 2026",
         "bullets": [bullet(cv.USTYLE_BULLETS[k]) for k in USTYLE_THESIS]},
        {"role": "Robotics Team Lead", "org": "Salam High School", "location": "Tehran, Iran",
         "dates": "Jul 2019 – Nov 2021",
         "bullets": [bullet(b) for b in cv.ROBOTICS_BULLETS]},
    ],
    # Education, research, honors and the full citation come from the academic CV
    # (~/PHD2027/Amirreza_Rahimi_Academic_CV_Demo_2027.pdf); cv_render.py has no fields for them.
    "education": [
        {"degree": "MSc Computer Engineering — Artificial Intelligence", "school": "Politecnico di Torino",
         "location": "Torino, Italy", "dates": "Graduated July 2026",
         "notes": ["Thesis: Pose Transfer and Layer-Aware Virtual Try-On for Multi-Garment Outfit Generation.",
                   "Supervisor: Prof. Filippo Gabriele Pratticò."]},
        {"degree": "BSc Computer Engineering", "school": "Islamic Azad University, Science and Research Branch",
         "location": "Tehran, Iran", "dates": "2018 – 2022",
         "notes": ["GPA 16.63 / 20; final two years 18.03 / 20.",
                   "Final project: Lightweight Autonomous Soccer-Player Robot."]},
    ],
    "research": [
        {"title": "Pose Transfer and Layer-Aware Virtual Try-On for Multi-Garment Outfit Generation",
         "kind": "MSc thesis", "dates": "2025 – 2026", "url": "/projects/virtual-try-on",
         "bullets": ["Developed a multi-garment virtual try-on pipeline supporting pose transfer and garment layering.",
                     "Integrated diffusion-based generation, VLM-assisted analysis, body segmentation and synthetic-data workflows.",
                     "Studied how complex visual outputs can be made inspectable and useful in fashion e-commerce systems."],
         "note": "Supervisor: Prof. Filippo Gabriele Pratticò"},
        {"title": "Computational Humor Generation with Large Language Models",
         "kind": "SemEval 2026 · Task 1: MWAHAHA", "dates": "2025 – 2026",
         "url": "https://aclanthology.org/2026.semeval-1.372",
         "bullets": ["Co-developed the MINDS system for Subtask A using Llama 3.1, Gemma 2 and Qwen 2.5.",
                     "Evaluated retrieval-augmented generation and synthetic Direct Preference Optimization with round-robin LLM judging.",
                     "Contributed to the shared-task paper and the team's second-place result."]},
        {"title": "Lightweight Autonomous Soccer-Player Robot",
         "kind": "BSc final project", "dates": "2022", "url": "",
         "bullets": ["Designed an autonomous mobile robot integrating onboard perception, motion planning and embedded control.",
                     "Implemented real-time computer vision for ball, field-boundary and opponent detection, linked to robot actions."]},
    ],
    "honors": [
        {"year": "2026", "place": "2nd place", "text": "SemEval 2026 Task 1: MWAHAHA, shared task on automatic humor generation"},
        {"year": "2018", "place": "Top 2%", "text": "Iran's National University Entrance Exam"},
        {"year": "2017", "place": "1st place", "text": "International RoboCup IranOpen, Junior Soccer Big Field"},
        {"year": "2017", "place": "7th place", "text": "International RoboCup IranOpen, Junior Soccer Individual"},
        {"year": "2016", "place": "2nd place", "text": "International RoboCup IranOpen, Junior Soccer Individual"},
    ],
    "publication": {
        "title": "MINDS at SemEval-2026 Task 1: Enhancing Humor Generation through RAG and Synthetic DPO Alignment",
        "authors": "Sina Eskandari, Seyed Amirreza Mousavi, Amirreza Rahimi, Mona Pouresmaeil, Marcello Vitaggio, "
                   "Claudio Savelli, Riccardo Coppola, Flavio Giobergia",
        "venue": "Proceedings of the 20th International Workshop on Semantic Evaluation (SemEval-2026), ACL, pp. 2967–2971",
        "doi": "10.18653/v1/2026.semeval-1.372",
        "text": "Our system for the first SemEval task on humor generation: retrieval-augmented generation plus synthetic DPO alignment across Llama 3.1, Gemma 2 and Qwen 2.5. Ranked 2nd.",
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

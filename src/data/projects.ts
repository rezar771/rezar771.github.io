// Site-only project metadata. Facts come from each project's README / design doc
// and from ~/cv/cv_render.py (via cv.json); nothing here should go beyond them.

export type Tag = 'Computer Vision' | 'LLM & Agents' | 'Generative AI' | 'Machine Learning' | 'Web';

export interface Metric { value: string; label: string }
export interface Bar { label: string; value: number; highlight?: boolean }
export interface Chart { title: string; caption: string; max: number; unit?: string; bars: Bar[] }
export interface Media {
  cover?: string;
  video?: string;
  poster?: string;
  portrait?: boolean;
  gallery?: { src: string; alt: string }[];
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  context: string;
  tags: Tag[];
  featured?: boolean;
  accent: string;
  summary: string;
  problem: string;
  highlights: string[];
  pipeline: string[];
  metrics: Metric[];
  stack: string[];
  chart?: Chart;
  media: Media;
  links: { label: string; url: string }[];
}

const gh = (repo: string) => ({ label: 'GitHub', url: `https://github.com/rezar771/${repo}` });

export const projects: Project[] = [
  {
    slug: 'virtual-try-on',
    title: 'Pose Transfer & Layer-Aware Virtual Try-On',
    tagline: 'Re-pose a model photo and compose multi-garment outfits — without repainting the garment.',
    year: '2026',
    context: "Master's thesis · Politecnico di Torino × Ustyle",
    tags: ['Generative AI', 'Computer Vision'],
    featured: true,
    accent: '#a78bfa',
    summary:
      'A licensable, production-deployed system that turns one front-facing catalogue photo into new poses and complete layered outfits. Photographing each garment once replaces an O(N×M×P) photo shoot with O(N+M) acquisition.',
    problem:
      'The generative step that re-poses a person tends to repaint fabric, prints and trims — exactly what a shopper inspects. And because the images are sold, research-only weights (LEFFA, FLUX-Kontext) cannot ship: the question is the best pixels among components that can legally be sold.',
    highlights: [
      'Licensing-aware ablation of four model families; selected Qwen-Image-Edit-2511 (~20B-parameter MMDiT, Apache-2.0) for native in-context conditioning that preserves high-frequency prints.',
      'LoRA fine-tuning on 2,000 VLM-curated catalogue pairs (bi-directional → 4,000), with five recipe changes: cosine LR, uniform timestep weighting, conservative adapter scale, multi-epoch, clean t=0 source latents.',
      'FP8 (e4m3) weight-only quantization cut the transformer from ~40 GB to ~20 GB — training on one L40S, inference on a 24 GB RTX 3090 at ~$0.014 per image.',
      'Layer-aware composition: MediaPipe keypoints → SegFormer masks → SAM 2 refinement → LaMa inpainting, z-ordered trousers → shirt → jacket, with a VLM quality gate.',
      'Blind human preference study (24 participants) reproduced the automated VLM ranking exactly (Spearman ρ = 1.0).',
    ],
    pipeline: ['Front photo', 'VLM curation', 'Qwen-Image-Edit + LoRA', 'FP8 inference', 'VLM + human gate', 'New pose / outfit'],
    metrics: [
      { value: '9.17/10', label: 'VLM score, unseen shops' },
      { value: '53%', label: 'win share vs baselines' },
      { value: 'ρ = 1.0', label: 'human ↔ VLM ranking' },
      { value: '$0.014', label: 'per generated image' },
    ],
    stack: ['PyTorch', 'Diffusion Models', 'LoRA / PEFT', 'VLMs', 'SAM 2', 'SegFormer', 'MediaPipe', 'AWS'],
    chart: {
      title: 'Overall score by checkpoint',
      caption: 'Automated VLM screen, mean over the held-out set of unseen client shops (0–10).',
      max: 10,
      bars: [
        { label: 'Zero-shot', value: 7.77 },
        { label: 'Epoch 1', value: 8.55 },
        { label: 'Epoch 2', value: 8.88 },
        { label: 'Epoch 3 (shipped)', value: 9.17, highlight: true },
      ],
    },
    media: {},
    links: [],
  },
  {
    slug: 'signalscope',
    title: 'SignalScope',
    tagline: 'Ask whether two real-world phenomena are related — an agent picks the data and tests it honestly.',
    year: '2026',
    context: 'InspectionDrone technical assessment',
    tags: ['LLM & Agents', 'Machine Learning'],
    featured: true,
    accent: '#38bdf8',
    summary:
      'An LLM agent with tool calling chooses open datasets (weather, air quality, electricity, FX, Wikipedia interest), aligns them, runs autocorrelation-aware statistics, forecasts, and shows every step in a live execution log.',
    problem:
      'The naive pipeline — two API calls, one Pearson r, an LLM paragraph — finds "significant" correlations between unrelated random walks 75.7% of the time and lets the model invent numbers.',
    highlights: [
      'The LLM decides what to fetch; code decides how — dates, validation, every number. Summaries are checked against computed values and replaced by a deterministic one if they fail.',
      'Autocorrelation-adjusted p-values, a differenced-series trend check and multiple-testing-corrected lag scan: 0% false strong/moderate evidence on 300 unrelated pairs.',
      'Latency cut from 68 s to ~6 s per question; ~1,250 LLM tokens per question.',
      'Request coalescing and shared caches: ten simultaneous users asking the same new question needed 2 LLM calls in total.',
      'Automatic fallback from a free cloud model to local Llama 3.2 on rate limits or invalid output.',
    ],
    pipeline: ['Question', 'LLM planner', 'Guarded tools · 4 APIs', 'Align + provenance', 'Lag-aware stats', 'Verified summary'],
    metrics: [
      { value: 'r = 0.81', label: 'Rome sunshine ↔ IT solar' },
      { value: '68 s → 6 s', label: 'per question' },
      { value: '0%', label: 'false positives vs 75.7% naive' },
      { value: '2', label: 'LLM calls for 10 users' },
    ],
    stack: ['Python', 'LLM tool calling', 'Ollama', 'Streamlit', 'Plotly', 'Statistics', 'Docker', 'Pytest'],
    chart: {
      title: 'False "significant" findings on unrelated data',
      caption: '300 pairs of independent random walks. Lower is better.',
      max: 100,
      unit: '%',
      bars: [
        { label: 'Naive Pearson test', value: 75.7 },
        { label: 'SignalScope', value: 0, highlight: true },
      ],
    },
    media: {
      cover: '/media/signalscope-result.webp',
      gallery: [
        { src: '/media/signalscope-result.webp', alt: 'SignalScope result with verdict, statistics, charts and execution log' },
        { src: '/media/signalscope-start.webp', alt: 'SignalScope start screen with example questions' },
      ],
    },
    links: [gh('signalscope')],
  },
  {
    slug: 'grounded-crm-assistant',
    title: 'Grounded CRM Assistant',
    tagline: 'A local RAG assistant over company CRM data that cites every claim and refuses rather than guesses.',
    year: '2026',
    context: 'Shipped to two medium-sized companies',
    tags: ['LLM & Agents'],
    featured: true,
    accent: '#34d399',
    summary:
      'Answers natural-language questions about customers, tickets, emails, meetings and policy documents. Runs fully local on Ollama, with a CLI and a Streamlit UI over the same pipeline.',
    problem:
      'CRM data is small, heavily joined and adversarial: near-duplicate company names, records that contradict each other, and free text that can carry injected instructions.',
    highlights: [
      'Entity resolution as the differentiating layer — resolves "Apex" or "Alpha Trading" to the right account before retrieval.',
      'Hybrid retrieval: BM25 + optional FAISS dense lane, fused with Reciprocal Rank Fusion and reranked with Maximal Marginal Relevance.',
      'Grounded citations, conflict detection between sources, and refusal of unsupported questions.',
      'Prompt-injection detection, untrusted-content isolation and PII-aware tracing.',
      'Ingests CSV / JSON / TXT / ZIP sources; 70 passing Pytest tests. AWS Bedrock mode fully designed behind an existing provider seam.',
    ],
    pipeline: ['CSV · JSON · ZIP', 'Validate + normalize', 'Entity resolution', 'BM25 + FAISS → RRF → MMR', 'Grounded LLM', 'Cited answer / refusal'],
    metrics: [
      { value: '2', label: 'companies using it' },
      { value: '70', label: 'passing tests' },
      { value: '100%', label: 'local inference' },
      { value: '3', label: 'retrieval stages' },
    ],
    stack: ['Python', 'RAG', 'Ollama', 'BM25', 'FAISS', 'Sentence Transformers', 'SQLite', 'Streamlit', 'Pytest'],
    media: {
      cover: '/media/crm-cover.webp',
      gallery: [
        { src: '/media/crm-cover.webp', alt: 'Cited answer to an SLA question, grounded in two sources, generated locally in 6 seconds' },
        { src: '/media/crm-refusal.webp', alt: 'The assistant refuses a revenue question the dataset cannot answer' },
      ],
    },
    links: [gh('grounded-crm-assistant')],
  },
  {
    slug: 'weldguard',
    title: 'WeldGuard',
    tagline: 'Multimodal weld-defect detection from thermal video, audio and sensor data.',
    year: '2026',
    context: 'Industrial ML platform',
    tags: ['Computer Vision', 'Machine Learning'],
    featured: true,
    accent: '#fb923c',
    summary:
      'Fuses thermal imaging, welding audio and sensor readings to classify welds into a good class and six defect types, with real-time inference from a webcam, phone camera or video file.',
    problem:
      'Manual weld inspection is slow, and single-modality models break when the welding setup changes.',
    highlights: [
      'Hierarchical classifier: binary defect/good, then multiclass defect type, with coherence correction so both stages agree.',
      'XGBoost ensembles with isotonic probability calibration; 190 multimodal features when sensor data is present.',
      'Config-invariant features (pixel ratios, relative measures) to generalize across welding setups.',
      'Trail analysis of the solidified bead for shape and cooling uniformity.',
      '10-page Streamlit dashboard with Plotly and a Claude-powered assistant that explains defects in metallurgical terms.',
    ],
    pipeline: ['Thermal video', 'Audio', 'Sensors', 'Feature fusion · 190', 'Binary → multiclass', 'Calibrated verdict'],
    metrics: [
      { value: '7', label: 'weld classes' },
      { value: '3', label: 'fused modalities' },
      { value: '190', label: 'engineered features' },
      { value: '10', label: 'dashboard pages' },
    ],
    stack: ['Python', 'XGBoost', 'OpenCV', 'Audio DSP', 'Scikit-learn', 'Streamlit', 'Plotly', 'Claude API'],
    media: { cover: '/media/weld-cover.webp', video: '/media/weld-loop.mp4', poster: '/media/weld-loop-poster.webp' },
    links: [gh('WeldGuard'), { label: 'Deep pipeline', url: 'https://github.com/rezar771/MultiModal-Weld-Analysis' }],
  },
  {
    slug: 'road-anomaly',
    title: 'Road Anomaly & OOD Detection',
    tagline: 'Spot unknown obstacles on the road — things no detector was trained on.',
    year: '2026',
    context: 'Real-time computer vision',
    tags: ['Computer Vision'],
    featured: true,
    accent: '#f472b6',
    summary:
      'Two pipelines side by side: SegFormer fine-tuned on Cityscapes with post-hoc anomaly scoring for unknown obstacles, and YOLOv8n for 80 known classes. Images, video or live webcam — fully local.',
    problem:
      'Closed-set detectors silently miss anything outside their training classes; a lost cargo box or an unusual animal is invisible to them.',
    highlights: [
      'Post-hoc Energy / MaxLogit scoring restricted to the drivable area — no fine-tuning needed.',
      'Fast (SegFormer-B0, ~14 MB) and accurate (SegFormer-B4, ~244 MB) modes.',
      'Validated on SegmentMeIfYouCan and Fishyscapes subsets (RoadAnomaly21, RoadObstacle21, FS Lost&Found).',
      'Gradio UI with image, video and live-webcam modes; auto-selects CUDA, MPS or CPU.',
    ],
    pipeline: ['Frame', 'SegFormer', 'Drivable-area mask', 'MaxLogit / Energy', 'Smooth + threshold', 'Obstacle boxes'],
    metrics: [
      { value: '14 MB', label: 'fast model' },
      { value: '2', label: 'complementary pipelines' },
      { value: '5', label: 'OOD benchmarks' },
      { value: '0', label: 'external API calls' },
    ],
    stack: ['PyTorch', 'SegFormer', 'YOLOv8', 'Hugging Face', 'OpenCV', 'Gradio'],
    media: {
      cover: '/media/road-out-5.webp',
      video: '/media/road-loop.mp4',
      poster: '/media/road-loop-poster.webp',
      gallery: [
        { src: '/media/road-out-5.webp', alt: 'Pheasant on the road flagged as unknown obstacle' },
        { src: '/media/road-out-1.webp', alt: 'Unknown obstacles detected on a country road' },
        { src: '/media/road-out-2.webp', alt: 'Dog on the road with anomaly boxes' },
        { src: '/media/road-out-3.webp', alt: 'Small debris detected on a gravel road' },
        { src: '/media/road-out-6.webp', alt: 'Obstacle detection on an asphalt road' },
      ],
    },
    links: [gh('road-anomaly')],
  },
  {
    slug: 'anomaly-segmentation',
    title: 'Real-Time Anomaly Segmentation',
    tagline: 'Pixel-level out-of-distribution detection with ERFNet, benchmarked across five scoring methods.',
    year: '2025',
    context: 'Machine Learning course project · PoliTo',
    tags: ['Computer Vision', 'Machine Learning'],
    accent: '#facc15',
    summary:
      'Trained ERFNet for semantic segmentation on Cityscapes and evaluated anomaly scoring on several OOD benchmarks, then wrapped it in a real-time Gradio workbench for images, datasets, video and webcam.',
    problem: 'Segmentation networks are confidently wrong on objects they have never seen.',
    highlights: [
      'Mahalanobis distance over PCA-reduced encoder features as an anomaly score.',
      'Benchmarked against MSP, MaxLogit, Max Entropy, standardized MaxLogit and void-class training.',
      'Per-class confidence gate that cleans the anomaly map without losing recall.',
      '~150–200 ms per 512×1024 frame on Apple Silicon (MPS), ~7 FPS live webcam.',
    ],
    pipeline: ['Image', 'ERFNet encoder', 'Decoder logits', 'OOD score', 'Class gate + blur', 'Anomaly heatmap'],
    metrics: [
      { value: '0.807', label: 'AUROC · MaxLogit' },
      { value: '17%', label: 'FPR @ 60% recall' },
      { value: '5', label: 'scoring methods' },
      { value: '~7 FPS', label: 'live webcam' },
    ],
    stack: ['PyTorch', 'ERFNet', 'Scikit-learn', 'PCA', 'OpenCV', 'Gradio'],
    chart: {
      title: 'AUROC on RoadAnomaly21',
      caption: 'All 10 images, per-class gate at 3σ. Higher is better.',
      max: 1,
      bars: [
        { label: 'MaxLogit', value: 0.807, highlight: true },
        { label: 'Entropy', value: 0.74 },
        { label: 'MSP', value: 0.73 },
        { label: 'Mahalanobis', value: 0.68 },
        { label: 'SML', value: 0.65 },
      ],
    },
    media: {},
    links: [gh('AnomalySegmentation_CourseProjectBaseCode')],
  },
  {
    slug: 'agenticmail',
    title: 'agenticMail',
    tagline: 'A privacy-first Gmail agent you drive from Telegram — powered by a local Llama 3.2.',
    year: '2026',
    context: 'Agentic AI · open source',
    tags: ['LLM & Agents'],
    featured: true,
    accent: '#8b5cf6',
    summary:
      'Read, summarize, search, compose and reply to email from a Telegram chat. All inference runs on-device through Ollama: no API costs and no mail leaves the machine.',
    problem: 'Email assistants usually ship your inbox to a cloud LLM.',
    highlights: [
      'Natural-language intent routing — "brief of the last 3 emails from Alice today".',
      'Hybrid rule + LLM importance scoring: fast triage, model only for nuance.',
      'Context-aware replies and threaded drafts; never auto-sends — every outgoing mail is reviewed.',
      'Bi-directional image and document attachments between Telegram and Gmail.',
    ],
    pipeline: ['Telegram', 'Intent router', 'Llama 3.2 · Ollama', 'Gmail tools', 'Draft review', 'Send'],
    metrics: [
      { value: '3B', label: 'local model' },
      { value: '0', label: 'external LLM calls' },
      { value: '100%', label: 'human-approved sends' },
    ],
    stack: ['Python', 'Ollama', 'Llama 3.2', 'Gmail API', 'OAuth2', 'Telegram Bot API'],
    media: { cover: '/media/mail-cover.webp', video: '/media/mail-loop.mp4', poster: '/media/mail-loop-poster.webp', portrait: true },
    links: [gh('AgenticMail')],
  },
  {
    slug: 'sensor-agent',
    title: 'Sensor Data Analysis Agent',
    tagline: 'Chat with industrial sensor data — feature importance, time series and FFT, explained by a local LLM.',
    year: '2026',
    context: 'RAG agent prototype',
    tags: ['LLM & Agents', 'Machine Learning'],
    accent: '#22d3ee',
    summary:
      'A RAG-powered assistant over sensor datasets: ask a question, and it runs the analysis (feature importance, time-series and frequency analysis) and answers with charts, using Llama 3.2 via Ollama.',
    problem: 'Engineers want answers from sensor logs without writing analysis code for every question.',
    highlights: [
      'Retrieval over dataset context plus analysis tools the model can call.',
      'Feature-importance ranking, time-series views and FFT analysis rendered in the chat.',
      'Local Llama 3.2 inference through Ollama.',
    ],
    pipeline: ['Question', 'Retrieve context', 'Pick analysis', 'Run FI / FFT', 'Chart', 'Answer'],
    metrics: [],
    stack: ['Python', 'RAG', 'Ollama', 'Llama 3.2', 'Pandas', 'NumPy'],
    media: { cover: '/media/sensor-cover.webp', video: '/media/sensor-loop.mp4', poster: '/media/sensor-loop-poster.webp' },
    links: [],
  },
  {
    slug: 'hex-vlm',
    title: 'hex-vlm',
    tagline: 'A tiny vision-language model, built from scratch, that reads hex from an image and answers in decimal.',
    year: '2026',
    context: 'From-scratch model',
    tags: ['Generative AI', 'Computer Vision'],
    accent: '#60a5fa',
    summary:
      'Synthetic dataset with YOLO character labels, a from-scratch PyTorch encoder-decoder trained with supervised fine-tuning, served with FastAPI in Docker.',
    problem: 'Understanding VLMs end to end — data, architecture, training and serving — by building a small one.',
    highlights: [
      'Synthetic image generator with YOLO-format character labels.',
      'From-scratch vision encoder + text decoder in PyTorch, trained with SFT.',
      'FastAPI inference service packaged with Docker.',
    ],
    pipeline: ['Synthetic images', 'Vision encoder', 'Text decoder', 'SFT', 'FastAPI', 'Docker'],
    metrics: [],
    stack: ['PyTorch', 'Transformers', 'YOLO', 'FastAPI', 'Docker'],
    media: {},
    links: [gh('hex-vlm')],
  },
  {
    slug: 'nettochiaro',
    title: 'NettoChiaro',
    tagline: 'A transparent Italian net-salary calculator with a full tax and contribution breakdown.',
    year: '2026',
    context: 'Web app',
    tags: ['Web'],
    accent: '#4ade80',
    summary: 'Estimates annual and monthly take-home pay from gross salary (RAL) with a detailed breakdown.',
    problem: 'Italian payslips are opaque; most calculators hide how the number is computed.',
    highlights: ['Step-by-step tax and contribution breakdown.', 'Tested calculation core with Vitest.'],
    pipeline: [],
    metrics: [],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vitest'],
    media: {},
    links: [gh('nettochiaro')],
  },
];

export const otherWork = [
  { title: 'Autonomous soccer robot', text: 'On-board vision for ball, field and opponent detection; C++ control and custom PCBs. Led the team.', url: '' },
  { title: 'BiSeNet', text: 'Real-time semantic segmentation implementation, including BiSeNetV2.', url: 'https://github.com/rezar771/BiSeNet' },
  { title: 'Pac-Man on LPC1768', text: 'Embedded C game on the LandTiger board: game logic, display and input.', url: 'https://github.com/rezar771/PacManGame' },
  { title: 'EzElectronics', text: 'Full simulation of an online electronics shop in TypeScript.', url: 'https://github.com/rezar771/Ezelectronics' },
  { title: 'MemeGame', text: 'React memory game with interactive UI and game logic.', url: 'https://github.com/rezar771/MemeGame' },
];

export const tags: Tag[] = ['Computer Vision', 'LLM & Agents', 'Generative AI', 'Machine Learning', 'Web'];

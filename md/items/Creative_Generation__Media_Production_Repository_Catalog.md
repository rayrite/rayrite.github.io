# Creative Generation & Media Production Repository Catalog

> **Scope.** This catalog is curated exclusively from the supplied `repo_showcase_merged.json` dataset. It covers 2D image and 3D generation, video, music and sound, TTS/STT, talking avatars and lip sync, character continuity, storyboarding, text-to-scene workflows, lighting, VFX, and production infrastructure. Repository metadata and star counts are source snapshots rather than live assessments. [1]

## Wide-Research Method

The source dataset was scanned through **ten independent workstreams running in parallel**: image generation, 3D, video, music/audio, speech, avatars, character consistency, storyboarding, lighting/VFX, and media-model operations. The outputs were deduplicated and filtered for a primary-purpose creative-generation or production role. [1]

| Parallel workstream | Primary coverage |
| --- | --- |
| 2D image generation, diffusion & editing | Independent metadata scan and reconciliation into the shared catalog. |
| 3D generation, reconstruction & assets | Independent metadata scan and reconciliation into the shared catalog. |
| Video generation, motion & control | Independent metadata scan and reconciliation into the shared catalog. |
| Music, sound & audio generation | Independent metadata scan and reconciliation into the shared catalog. |
| TTS, STT, dubbing & voice conversion | Independent metadata scan and reconciliation into the shared catalog. |
| Live avatars, facial animation & lip sync | Independent metadata scan and reconciliation into the shared catalog. |
| Character consistency & human-centric generation | Independent metadata scan and reconciliation into the shared catalog. |
| Storyboarding, text-to-scene & previsualization | Independent metadata scan and reconciliation into the shared catalog. |
| Lighting, rendering, VFX & post-production | Independent metadata scan and reconciliation into the shared catalog. |
| Media ML training, workflows & serving | Independent metadata scan and reconciliation into the shared catalog. |

## Consent, Rights & Representation Boundary

> This catalog supports **authorized and consent-based** creative production. The avatar, lip-sync, TTS, and voice-conversion sections are for applications involving voices, faces, and likenesses you own or are authorized to use. It excludes repositories whose primary purpose is face swapping, deepfake production, impersonation, non-consensual media, or celebrity face/voice cloning. Review model, training-data, music, image, and asset licenses before use. [1]

## Creative-Production Lifecycle Map

| Production stage | Catalog categories |
| --- | --- |
| **Ideate and plan** | Storyboarding, text-to-scene, previsualization, character continuity |
| **Create visual assets** | 2D diffusion/editing, 3D generation/reconstruction, lighting/rendering |
| **Animate and perform** | Video generation/motion, live avatars, facial animation, lip sync |
| **Create sound and speech** | Music/audio generation, TTS/STT, dubbing, consent-based voice workflows |
| **Finish and operate** | VFX/post-production, model training/fine-tuning, workflows, and serving |

## Curation Summary

The source dataset contains **6,327 unique repositories**. The ten parallel workstreams surfaced 417 candidates; primary-purpose and consent-aware filtering retained **134 repositories** in the final catalog. [1]

## Coverage at a Glance

| Category | Repositories | Primary value |
| --- | ---: | --- |
| 2D image generation, diffusion & editing | 31 | Text-to-image and diffusion models, visual synthesis, editing, inpainting, control, and image-production interfaces. |
| 3D generation, reconstruction & assets | 7 | Text/image-to-3D, reconstruction, meshes, point clouds, neural rendering, Gaussian splatting, NeRF, and asset pipelines. |
| Video generation, motion & control | 23 | Text/image-to-video, diffusion video models, motion control, frame interpolation, video editing, and restoration. |
| Music, sound & audio generation | 3 | Text-to-music, audio synthesis, sound design, music modeling, music production, and generative audio tools. |
| TTS, STT, dubbing & voice conversion | 59 | Speech recognition, transcription, TTS, dubbing, voice conversion, speech synthesis, and audio-language workflows. |
| Live avatars, facial animation & lip sync | 3 | Talking avatars, talking heads, live portrait systems, facial animation, lip sync, and consent-based digital-human tooling. |
| Character consistency & human-centric generation | 2 | Reference-driven character continuity, identity preservation, controlled human-image generation, and narrative character tooling. |
| Storyboarding, text-to-scene & previsualization | 2 | Storyboards, screenplay/text-to-scene workflows, shot planning, previsualization, and narrative-scene development. |
| Lighting, rendering, VFX & post-production | 3 | Physically based lighting, ray/path tracing, rendering, VFX, compositing, color work, and post-production systems. |
| Media ML training, workflows & serving | 1 | Media-model training and fine-tuning, workflow orchestration, creative pipelines, and production-serving infrastructure. |

## Complete Categorized Catalog

Entries are ordered by metadata confidence and then by the source star snapshot. A repository may support multiple media-production stages; it appears under the clearest primary role to keep the catalog browsable. [1]

### 2D image generation, diffusion & editing

Text-to-image and diffusion models, visual synthesis, editing, inpainting, control, and image-production interfaces.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) | Stable Diffusion web UI | Python | 164,550 |
| [ComfyUI](https://github.com/Comfy-Org/ComfyUI) | ComfyUI is a powerful, modular AI engine designed for visual content creation, offering a node-based graph interface that lets users build and customi | Python | 128,126 |
| [stable-diffusion-webui-forge](https://github.com/lllyasviel/stable-diffusion-webui-forge) | Stable Diffusion WebUI Forge is a platform built on top of Stable Diffusion WebUI designed to streamline development, optimize resource management, ac | Python | 12,963 |
| [Stable-Diffusion CPP](https://github.com/leejet/stable-diffusion.cpp) | Stable-Diffusion CPP is a high-performance, pure C/C++ implementation designed for running various diffusion models, including Stable Diffusion, FLUX, | C++ | 5,776 |
| [PromptEnhancer](https://github.com/Hunyuan-PromptEnhancer/PromptEnhancer) | PromptEnhancer is a prompt-rewriting utility designed to refine input prompts into clearer, more structured instructions for advanced image generation | Python | 3,666 |
| [ComfyUI-TeaCache](https://github.com/welltop-cn/ComfyUI-TeaCache) | ComfyUI-TeaCache integrates the training-free TeaCache (Timestep Embedding Aware Cache) acceleration method into ComfyUI, enabling faster inference fo | Python | 1,090 |
| [Boogu-Image](https://github.com/boogu-project/Boogu-Image) | Boogu-Image-0.1 is an Apache-2.0 open-source unified image generation and editing model family that aims to deliver near-closed-source performance whi | Python | 877 |
| [krea-2](https://github.com/krea-ai/krea-2) | Krea 2 is an open-source image generation model from Krea AI focused on creative and stylistic exploration, currently the top-rated text-to-image mode | Python | 700 |
| [MrFlow](https://github.com/Xingyu-Zheng/MrFlow) | MrFlow is a training-free staged sampling method that accelerates pretrained flow-matching text-to-image diffusion models by shifting most denoising w | Python | 281 |
| [Fooocus](https://github.com/lllyasviel/Fooocus) | Focus on prompting and generating | Python | 52,356 |
| [ComfyUI Manager](https://github.com/Comfy-Org/ComfyUI-Manager) | ComfyUI Manager is a Python-based extension designed to significantly enhance the usability of the ComfyUI workflow. This tool provides comprehensive | Python | 14,277 |
| [Sana](https://github.com/NVlabs/Sana) | SANA: Efficient High-Resolution Image Synthesis with Linear Diffusion Transformer | Python | 8,780 |
| [StableSwarmUI](https://github.com/Stability-AI/StableSwarmUI) | StableSwarmUI, A Modular Stable Diffusion Web-User-Interface, with an emphasis on making powertools easily accessible, high performance, and extensibi | C# | 4,944 |
| [HunyuanImage-3.0](https://github.com/Tencent-Hunyuan/HunyuanImage-3.0) | HunyuanImage-3.0 is a powerful native multimodal model designed for advanced image generation tasks. This repository provides open-source access to th | Python | 3,001 |
| [JiT](https://github.com/LTH14/JiT) | provides a PyTorch and GPU re-implementation of the Just image Transformer (JiT) diffusion model, originally detailed in the arXiv paper. JiT is desig | Python | 2,258 |
| [FLUX.2](https://github.com/black-forest-labs/flux2) | FLUX.2 is the official inference repository for the FLUX.2 family of open-weight models developed by Black Forest Labs, focusing on state-of-the-art i | Python | 2,151 |
| [USO](https://github.com/bytedance/USO) | USO is a unified framework designed for style-driven and subject-driven image generation through disentangled and reward learning. The research addres | Python | 1,219 |
| [Lucy Edit - ComfyUI](https://github.com/DecartAI/Lucy-Edit-ComfyUI) | Lucy Edit is a video editing model designed to perform instruction-guided edits on videos using simple free-text prompts. It leverages advanced diffus | Python | 735 |
| [ComfyUI-OpenClaw](https://github.com/rookiestar28/ComfyUI-OpenClaw) | Your own personal AIGC Factory. Any picture. Any reel. The Comfy way. ©️ | Python | 557 |
| [restai](https://github.com/apocas/restai) | RESTai is an AIaaS (AI as a Service) open-source platform. Built on top of LlamaIndex & Langchain. Supports any public LLM supported by LlamaIndex and | Python | 512 |
| [Veo 3 & Nano Banana QuickStart](https://github.com/google-gemini/veo-3-nano-banana-gemini-api-quickstart) | is a Next.js quickstart designed for building a unified interface to interact with Google's advanced generative AI models via the Gemini API. It provi | TypeScript | 318 |
| [FIBO](https://github.com/Bria-AI/FIBO) | FIBO is a state-of-the-art, open-source text-to-image model designed for controllable and predictable image generation. It is uniquely trained on long | Python | 313 |
| [diffusion-gpt](https://github.com/ash80/diffusion-gpt) | provides an annotated implementation of a character-level discrete diffusion model for text generation, inspired by Andrej Karpathy’s baby GPT. It ada | Jupyter Notebook | 253 |
| [CoTyle](https://github.com/Kwai-Kolors/CoTyle) | CoTyle is an open-source framework for unlocking code-to-style image generation by introducing a discrete style space. The core innovation is the conc | Python | 158 |
| [Z-Image-Turbo](https://github.com/Aaryan-Kapoor/z-image-turbo) | Z-Image-Turbo is a professional web interface designed for lightning-fast text-to-image generation using the Tongyi-MAI Z-Image-Turbo model, which fea | JavaScript | 128 |
| [Imagemage](https://github.com/quinnypig/imagemage) | Imagemage is a focused command-line interface (CLI) tool written in Go that provides direct access to the Google Gemini Image API. It was developed to | Go | 112 |
| [ComfyEz](https://github.com/amirrezasalimi/comfyEz) | ComfyEz is a feature-rich web interface built in TypeScript that provides a streamlined experience for interacting with a local ComfyUI instance. It a | TypeScript | 76 |
| [Fooocus-fixed-crash](https://github.com/Nass-works/Fooocus-fixed-crash) | Focus on prompting and generating | Python | 70 |
| [Flux2.c](https://github.com/antirez/flux2.c) | Flux2.c implements Iris, a high-performance C inference pipeline for generating images from text prompts using open-weights diffusion transformer mode | — | 0 |
| [ComfyUI-Manager](https://github.com/ltdrdata/ComfyUI-Manager) | ComfyUI-Manager is an extension designed to enhance the usability of ComfyUI. It offers management functions to install, remove, disable, and enable v | — | 0 |
| [ComfyUI](https://github.com/comfyanonymous/ComfyUI) | The most powerful and modular diffusion model GUI, api and backend with a graph/nodes interface. | — | 0 |

### 3D generation, reconstruction & assets

Text/image-to-3D, reconstruction, meshes, point clouds, neural rendering, Gaussian splatting, NeRF, and asset pipelines.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [HunyuanWorld-Voyager](https://github.com/Tencent-Hunyuan/HunyuanWorld-Voyager) | HunyuanWorld-Voyager is a novel video diffusion framework designed for interactive 3D world generation and reconstruction. It functions as an interact | Python | 1,539 |
| [FastGS](https://github.com/fastgs/FastGS) | FastGS is a general acceleration framework designed to significantly speed up the training of 3D Gaussian Splatting models. It achieves state-of-the-a | Python | 981 |
| [FlashWorld](https://github.com/imlixinyang/FlashWorld) | FlashWorld is a framework designed for high-quality 3D scene generation within seconds, making complex scene creation highly accessible. It leverages | Python | 756 |
| [TRELLIS.2](https://github.com/microsoft/TRELLIS.2) | Native and Compact Structured Latents for 3D Generation | Python | 10,670 |
| [InstantMesh](https://github.com/TencentARC/InstantMesh) | InstantMesh: Efficient 3D Mesh Generation from a Single Image with Sparse-view Large Reconstruction Models | Python | 4,499 |
| [Three.js-Object-Sculptor-Codex-Plugin](https://github.com/vinhhien112/Three.js-Object-Sculptor-Codex-Plugin) | Three.js Object Sculptor is a Codex plugin that converts an attached object image into a code-only, animation-ready procedural Three.js model, rather | Python | 1,533 |
| [MILo](https://github.com/Anttwo/MILo) | MILo is a novel framework for detailed and efficient surface reconstruction by integrating mesh extraction directly into the optimization of 3D Gaussi | Python | 425 |

### Video generation, motion & control

Text/image-to-video, diffusion video models, motion control, frame interpolation, video editing, and restoration.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Wan2.2](https://github.com/Wan-Video/Wan2.2) | Wan2.2 is an advanced, open-source large-scale video generative model designed for high-quality video creation. It introduces an effective Mixture-of- | Python | 15,328 |
| [LTX-Video](https://github.com/Lightricks/LTX-Video) | LTX-Video is the official repository for a DiT-based video generation model designed to produce high-fidelity, synchronized audio and video in a singl | Python | 10,033 |
| [InfiniteTalk](https://github.com/MeiGen-AI/InfiniteTalk) | InfiniteTalk is a novel framework designed for unlimited-length talking video generation, supporting both image-to-video and video-to-video synthesis. | Python | 6,076 |
| [TurboDiffusion](https://github.com/thu-ml/TurboDiffusion) | TurboDiffusion is a framework designed to accelerate the end-to-end generation of video using diffusion models by a factor of 100 to 200. It achieves | Python | 3,459 |
| [LongCat-Video](https://github.com/meituan-longcat/LongCat-Video) | LongCat-Video is a foundational video generation model with 13.6B parameters, designed to handle diverse video tasks including Text-to-Video, Image-to | Python | 2,264 |
| [LTX Desktop](https://github.com/Lightricks/LTX-Desktop) | LTX Desktop is an open-source desktop application built in TypeScript for generating videos using LTX models. It provides comprehensive features inclu | TypeScript | 1,392 |
| [StoryMem](https://github.com/Kevin-thu/StoryMem) | StoryMem is an official Python-based framework designed for multi-shot long video storytelling with integrated memory. It enables the generation of ap | Python | 719 |
| [SteadyDancer](https://github.com/MCG-NJU/SteadyDancer) | SteadyDancer is a robust animation framework based on the Image-to-Video paradigm, designed for harmonizing and coherently animating human images. It | Python | 607 |
| [Causal-Forcing](https://github.com/thu-ml/Causal-Forcing) | Causal Forcing is an official codebase implementing Autoregressive Diffusion Distillation for high-quality, real-time interactive video generation. Th | Python | 569 |
| [Wan2GP](https://github.com/deepbeepmeep/Wan2GP) | A fast AI Video Generator for the GPU Poor. Supports Wan 2.1/2.2, LTX-2, Qwen Image, Hunyuan Video, LTX Video and Flux. | Python | 8,697 |
| [Stable Video Infinity](https://github.com/vita-epfl/Stable-Video-Infinity) | Stable Video Infinity (SVI) is a framework designed for generating infinite-length videos through an innovative error recycling mechanism. This work l | Python | 2,347 |
| [MoCha](https://github.com/Orange-3DV-Team/MoCha) | MoCha is a novel framework designed for end-to-end video character replacement without requiring explicit structural guidance. It addresses the limita | Python | 693 |
| [HoloCine](https://github.com/yihao-meng/HoloCine) | HoloCine is an open-source text-to-video model designed for the holistic generation of cinematic multi-shot long video narratives. The core innovation | Python | 664 |
| [rCM](https://github.com/NVlabs/rcm) | rCM introduces a novel framework for scaling up continuous-time consistency distillation methods, such as sCM and MeanFlow, to large-scale video diffu | Python | 610 |
| [Seedance 2.0](https://github.com/Emily2040/seedance-2.0) | Seedance 2.0 is a comprehensive production pipeline designed for quad-modal AI filmmaking, enabling users to generate and direct cinematic AI videos. | — | 516 |
| [Video-As-Prompt](https://github.com/bytedance/Video-As-Prompt) | The Video-As-Prompt (VAP) repository introduces a unified method for semantic control in video generation, framed as in-context generation. VAP levera | Python | 415 |
| [Wan-Alpha](https://github.com/WeChatCV/Wan-Alpha) | Wan-Alpha is a text-to-video generation model designed to produce high-quality video output with accurate alpha channel transparency. The core innovat | Python | 358 |
| [AccVideo](https://github.com/aejion/AccVideo) | Official code for AccVideo: Accelerating Video Diffusion Model with Synthetic Dataset | Python | 287 |
| [AI-auto-generate-video](https://github.com/huytranvan2010/AI-auto-generate-video) | AI-auto-generate-video converts a Vietnamese article or text file into a polished 9:16 short video with a single command, eliminating manual editing. | HTML | 234 |
| [MAGI-2 Preview](https://github.com/SandAI-org/MAGI-2-preview) | MAGI-2 Preview is a unified audio-video generation model from Sand.ai that tackles the high cost of scaling video synthesis. It uses a 114B-parameter | — | 0 |
| [HunyuanVideo](https://github.com/Tencent/HunyuanVideo) | HunyuanVideo: A Systematic Framework For Large Video Generation Model | — | 0 |
| [Finger Frame AI](https://github.com/sophiamyang/finger-frame-effect-ai) | Finger Frame AI transforms uploaded two-hand finger-frame gesture videos into AI-animated worlds where the finger frame acts as a window into a restyl | — | 0 |
| [ComfyUI-Spectrum-MiniMax-H3](https://github.com/xmarre/ComfyUI-Spectrum-MiniMax-H3) | ComfyUI-Spectrum-MiniMax-H3 is a custom ComfyUI node that accelerates the native MiniMax H3 audio-video model by fitting a Chebyshev ridge model to po | — | 0 |

### Music, sound & audio generation

Text-to-music, audio synthesis, sound design, music modeling, music production, and generative audio tools.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Higgs Audio V2](https://github.com/boson-ai/higgs-audio) | Higgs Audio is a powerful text-audio foundation model developed by Boson AI, pretrained on over 10 million hours of audio and text data. It is designe | Python | 8,020 |
| [Gemini API Cookbook](https://github.com/google-gemini/cookbook) | The Gemini API Cookbook is a resource providing structured, hands-on tutorials and practical examples for utilizing the Gemini API. Organized into Qui | Jupyter Notebook | 17,034 |
| [stable-audio-tools](https://github.com/Stability-AI/stable-audio-tools) | Generative models for conditional audio generation | Python | 3,842 |

### TTS, STT, dubbing & voice conversion

Speech recognition, transcription, TTS, dubbing, voice conversion, speech synthesis, and audio-language workflows.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [faster-whisper](https://github.com/SYSTRAN/faster-whisper) | Faster Whisper transcription with CTranslate2 | Python | 24,961 |
| [Speech To Speech](https://github.com/huggingface/speech-to-speech) | Speech To Speech is an open-source Python library from Hugging Face that enables developers to build low-latency, fully local voice agents using a mod | Python | 9,908 |
| [MuseTalk](https://github.com/TMElyralab/MuseTalk) | MuseTalk is a real-time, high-quality lip-syncing model designed for high-fidelity video dubbing. It operates by modifying unseen faces within the lat | Python | 5,608 |
| [dsnote](https://github.com/mkiol/dsnote) | Speech Note is a Linux desktop and Sailfish OS application designed for note-taking, reading, and translating across multiple languages. It addresses | C++ | 1,557 |
| [audio.cpp](https://github.com/0xShug0/audio.cpp) | audio.cpp is a pure C++ audio inference framework built on the ggml tensor library, designed to eliminate the complex Python and Conda dependency chai | C++ | 1,055 |
| [whisper](https://github.com/openai/whisper) | Robust Speech Recognition via Large-Scale Weak Supervision | Python | 107,473 |
| [LocalAI](https://github.com/mudler/LocalAI) | :robot: The free, Open Source alternative to OpenAI, Claude and others. Self-hosted and local-first. Drop-in replacement for OpenAI, running on consum | Go | 48,534 |
| [TTS](https://github.com/coqui-ai/TTS) | 🐸💬 - a deep learning toolkit for Text-to-Speech, battle-tested in research and production | Python | 45,908 |
| [bark](https://github.com/suno-ai/bark) | 🔊 Text-Prompted Generative Audio Model | Jupyter Notebook | 39,239 |
| [OpenVoice](https://github.com/myshell-ai/OpenVoice) | Instant voice cloning by MyShell. | Python | 37,150 |
| [Fish Speech](https://github.com/fishaudio/fish-speech) | Brand new TTS solution | Python | 32,237 |
| [Handy](https://github.com/cjpais/Handy) | Handy is a free, open-source, and extensible desktop application designed for privacy-focused, offline speech-to-text transcription. Built primarily i | Rust | 28,285 |
| [meetily](https://github.com/Zackriya-Solutions/meetily) | Meetily is a privacy-first AI meeting assistant that captures, transcribes, and summarizes meetings entirely on local infrastructure, eliminating the | Rust | 27,711 |
| [Chatterbox TTS](https://github.com/resemble-ai/chatterbox) | SoTA open-source TTS | Python | 26,024 |
| [whisperX](https://github.com/m-bain/whisperX) | WhisperX: Automatic Speech Recognition with Word-level Timestamps (& Diarization) | Python | 23,614 |
| [pyvideotrans](https://github.com/jianchang512/pyvideotrans) | Translate the video from one language to another and add dubbing. 将视频从一种语言翻译为另一种语言，并添加配音 | Python | 18,708 |
| [Video](https://github.com/Huanshere/VideoLingo) | Netflix-level subtitle cutting, translation, alignment, and even dubbing - one-click fully automated AI video subtitle team \| Netflix级字幕切割、翻译、对齐、甚至加上配 | Python | 17,590 |
| [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx) | Speech-to-text, text-to-speech, and speaker recognition using next-gen Kaldi with onnxruntime without Internet connection. Support embedded systems, A | C++ | 14,221 |
| [WhisperLiveKit](https://github.com/QuentinFuxa/WhisperLiveKit) | Real-time & local speech-to-text server. | Python | 10,614 |
| [RealtimeSTT](https://github.com/KoljaB/RealtimeSTT) | A robust, efficient, low-latency speech-to-text library with advanced voice activity detection, wake word activation and instant transcription. | Python | 10,058 |
| [KrillinAI](https://github.com/krillinai/KrillinAI) | KrillinAI is an end-to-end AI solution designed for video translation and dubbing, powered by Large Language Models (LLMs). This tool enables users to | Go | 9,862 |
| [ElevenLabs](https://github.com/debpalash/OmniVoice-Studio) | OmniVoice Studio is the open-source ElevenLabs alternative for local voice cloning, design, dubbing, and dictation. It is a desktop app that runs mode | Python | 9,365 |
| [FluidVoice](https://github.com/altic-dev/FluidVoice) | FluidVoice is an open-source macOS dictation app that delivers fast, fully on-device voice-to-text transcription as a privacy-focused alternative to p | Swift | 9,207 |
| [Moonshine Voice](https://github.com/moonshine-ai/moonshine) | Moonshine Voice is an open-source AI toolkit designed for developers building real-time voice applications, offering low-latency speech-to-text, text- | C | 7,787 |
| [vibe](https://github.com/thewh1teagle/vibe) | Vibe is a cross-platform desktop application that provides fully offline audio and video transcription, addressing privacy concerns by ensuring no use | TypeScript | 6,975 |
| [StyleTTS2](https://github.com/yl4579/StyleTTS2) | StyleTTS 2: Towards Human-Level Text-to-Speech through Style Diffusion and Adversarial Training with Large Speech Language Models | Python | 6,330 |
| [VoiceInk](https://github.com/Beingpax/VoiceInk) | VoiceInk is a native macOS voice-to-text application that provides fast, offline transcription with claimed 99% accuracy using local AI models, positi | Swift | 5,739 |
| [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) | Dockerized FastAPI wrapper for Kokoro-82M text-to-speech model w/multiplatform CPU, AMD, NVIDIA GPU PyTorch support, handling, and auto-stitching | Python | 5,341 |
| [openwhispr](https://github.com/OpenWhispr/openwhispr) | OpenWhispr is an open-source, privacy-first voice-to-text dictation desktop app that serves as a free alternative to WisprFlow and Granola. Users pres | JavaScript | 5,073 |
| [epicenter](https://github.com/EpicenterHQ/epicenter) | Epicenter is a monorepo of open-source, local-first apps designed to keep user data on the owner's machine as plain Markdown and SQLite files, ensurin | TypeScript | 4,730 |
| [Pocket TTS](https://github.com/kyutai-labs/pocket-tts) | Pocket TTS is a lightweight Text-to-Speech application designed for efficient operation directly on CPUs, eliminating the need for specialized GPUs or | Python | 4,002 |
| [LuxTTS](https://github.com/ysharma3501/LuxTTS) | LuxTTS is a lightweight, high-quality text-to-speech model based on zipvoice, designed for advanced voice cloning and realistic audio generation. It i | Python | 3,691 |
| [quill](https://github.com/digimata/quill) | Quill is an ultra-minimalist, fully local macOS meeting recorder and transcriber that captures microphone and system audio as two separate tracks from | Swift | 3,330 |
| [Wispr](https://github.com/zachlatta/freeflow) | FreeFlow is a free and open-source application developed in Swift, offering an alternative to commercial transcription tools like Wispr Flow and Super | Swift | 2,333 |
| [Dot](https://github.com/alexpinel/Dot) | Text-To-Speech, RAG, and LLMs. All local! | JavaScript | 1,911 |
| [nerd-dictation](https://github.com/ideasman42/nerd-dictation) | Nerd Dictation is a lightweight, offline speech-to-text utility for desktop Linux that leverages the VOSK-API to transcribe spoken words into text wit | Python | 1,908 |
| [claude-real-video](https://github.com/HUANGCHIHHUNGLeo/claude-real-video) | claude-real-video solves the problem of letting LLMs actually *see* video content rather than just reading transcripts. It extracts scene-aware keyfra | Python | 1,908 |
| [py-gpt](https://github.com/szczyglis-dev/py-gpt) | Desktop AI Assistant powered by GPT-4, GPT-4 Vision, GPT-3.5, DALL-E 3, Langchain, Llama-index, chat, vision, voice control, image generation and anal | Python | 1,882 |
| [TypeWhisper for Mac](https://github.com/TypeWhisper/typewhisper-mac) | Local speech-to-text for macOS on-device AI, fully private, optional cloud | Swift | 1,526 |
| [CrisperWhisper](https://github.com/nyrahealth/CrisperWhisper) | Verbatim Automatic Speech Recognition with improved word-level timestamps and filler detection | Python | 1,322 |
| [Amical](https://github.com/amicalhq/amical) | Amical is an open-source, local-first AI dictation application designed to provide fast and accurate speech-to-text functionality. It leverages powerf | TypeScript | 1,146 |
| [hyprwhspr](https://github.com/goodroot/hyprwhspr) | hyprwhspr is a native Linux speech-to-text dictation tool that delivers fast, private, system-wide voice input with a customizable toggle hotkey for i | Python | 1,122 |
| [Dia2](https://github.com/nari-labs/dia2) | Dia2 is a streaming dialogue Text-to-Speech (TTS) model developed by Nari Labs, designed to generate conversational audio in real-time. Unlike traditi | Python | 1,114 |
| [voxtype](https://github.com/peteonrails/voxtype) | Voxtype is a voice-to-text dictation tool for Linux that uses push-to-talk (default hotkey: ScrollLock) to transcribe speech and inject the result at | Rust | 1,030 |
| [TheWhisper](https://github.com/TheStageAI/TheWhisper) | TheWhisper repository provides optimized, high-performance speech-to-text inference solutions based on Whisper models, focusing on streaming and on-de | Python | 824 |
| [shuo](https://github.com/NickTikhonov/shuo) | Shuo is a Python-based voice agent framework designed for sub-500ms latency phone agent orchestration. It provides a complete pipeline for real-time v | Python | 636 |
| [Audar-ASR-V1](https://github.com/AudarAI/Audar-ASR-V1) | Audar-ASR-V1 is a family of Arabic-first generative speech-recognition models from AudarAI that frames transcription as audio-conditioned next-token p | Python | 561 |
| [rescript](https://github.com/wassgha/rescript) | Rescript is an open-source, transcript-based media editor that lets users cut video and audio by editing text — deleting words in an automatically gen | TypeScript | 474 |
| [yap](https://github.com/FrigadeHQ/yap) | Yap is a free, open-source voice dictation app for macOS that transcribes speech entirely on-device using Apple's new SpeechAnalyzer and SpeechTranscr | Swift | 312 |
| [Watch Skill](https://github.com/oxbshw/watch-skill) | Watch Skill is a local-first video intelligence layer that gives AI agents the ability to watch, remember, and verify video content—from YouTube clips | Python | 247 |
| [Audio8_TTS](https://github.com/Audio8-AI/Audio8_TTS) | Audio8_TTS is a compact 0.6B-parameter multilingual text-to-speech model that delivers state-of-the-art quality with zero-shot voice cloning, addressi | Python | 206 |
| [qwen-scribe](https://github.com/VladUZH/qwen-scribe) | Qwen Scribe is a private, on-device transcription and system-wide dictation tool for Apple Silicon Macs, powered by Qwen3-ASR running via mlx-qwen3-as | Python | 157 |
| [Vocal-Agent](https://github.com/tarun7r/Vocal-Agent) | A cutting-edge Cascading voice assistant combining real-time speech recognition, AI reasoning, and neural text-to-speech capabilities. | Python | 138 |
| [renfield](https://github.com/ebongard/renfield) | Renfield is a self-hosted, fully offline AI assistant designed for users who want a privacy-respecting alternative to cloud-based smart assistants. It | Python | 30 |
| [whisper.cpp](https://github.com/ggerganov/whisper.cpp) | Port of OpenAI's Whisper model in C/C++ | — | 0 |
| [pi-transcribe](https://github.com/earendil-works/pi-transcribe) | pi-transcribe is a local speech-to-text dictation extension for the Pi coding agent that lets users dictate text directly into the editor via a config | — | 0 |
| [diction](https://github.com/omachala/diction) | Diction is an iOS keyboard that brings full, system-wide voice dictation to any app, rather than confining speech-to-text to a separate recorder. It c | — | 0 |
| [Chirp](https://github.com/Whamp/chirp) | Chirp is a local-first dictation application for Windows that utilizes the ParakeetV3 Speech-to-Text (STT) model for fast and reliable transcription. | — | 0 |
| [antonai](https://github.com/akazwz/antonai) | a LLMs/AI chat platform build and design for Cloudflare worker AI. It is localfirst. with many features like function calling, image to text, text to | — | 0 |

### Live avatars, facial animation & lip sync

Talking avatars, talking heads, live portrait systems, facial animation, lip sync, and consent-based digital-human tooling.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [SadTalker](https://github.com/OpenTalker/SadTalker) | [CVPR 2023] SadTalker：Learning Realistic 3D Motion Coefficients for Stylized Audio-Driven Single Image Talking Face Animation | Python | 14,019 |
| [V-Express](https://github.com/tencent-ailab/V-Express) | V-Express aims to generate a talking head video under the control of a reference image, an audio, and a sequence of V-Kps images. | Python | 2,358 |
| [Talking Head (3D)](https://github.com/met4citizen/TalkingHead) | Talking Head (3D) is a JavaScript class designed for real-time lip-sync synchronization using full-body 3D avatars. It provides the foundational techn | JavaScript | 1,174 |

### Character consistency & human-centric generation

Reference-driven character continuity, identity preservation, controlled human-image generation, and narrative character tooling.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Qwen-Image](https://github.com/QwenLM/Qwen-Image) | Qwen-Image is a powerful image generation foundation model capable of complex text rendering and precise image editing. | Python | 8,247 |
| [champ](https://github.com/fudan-generative-vision/champ) | Champ: Controllable and Consistent Human Image Animation with 3D Parametric Guidance | Python | 4,261 |

### Storyboarding, text-to-scene & previsualization

Storyboards, screenplay/text-to-scene workflows, shot planning, previsualization, and narrative-scene development.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [marketing-studio](https://github.com/ucsandman/marketing-studio) | Marketing Studio is an agent-driven Claude Code skill that turns a single `/marketing` command into a full marketing asset suite for any product. Solv | JavaScript | 202 |
| [DramaBench](https://github.com/IIIIQIIII/DramaBench) | DramaBench is a comprehensive, six-dimensional evaluation framework designed to assess the capabilities of large language models in drama script conti | HTML | 84 |

### Lighting, rendering, VFX & post-production

Physically based lighting, ray/path tracing, rendering, VFX, compositing, color work, and post-production systems.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [eterna-image2image-skill](https://github.com/Cuimao777/eterna-image2image-skill) | An experimental bilingual Codex skill that brings ETERNA-inspired cinematic color grading and compositional discipline to image-to-image generation wo | — | 167 |
| [OpticalModeler](https://github.com/k-telux/OpticalModeler) | OpticalModeler is an evidence-gated Agent Skill that converts 2D photonics schematics into physically auditable 3D optical tables inside Blender. It t | Python | 211 |
| [travel-photo-abstraction](https://github.com/Evianis/travel-photo-abstraction) | Travel Photo Abstraction is a Codex skill that transforms travel or everyday photographs into sparse editorial abstractions by systematically analyzin | — | 0 |

### Media ML training, workflows & serving

Media-model training and fine-tuning, workflow orchestration, creative pipelines, and production-serving infrastructure.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [FramePack](https://github.com/lllyasviel/FramePack) | Lets make video diffusion practical! | Python | 17,213 |

## Use Notes

This catalog is for technical discovery, not a clearance, security assessment, rights review, or production-readiness decision. Before adoption, assess current maintenance, model and dataset terms, commercial-use rights, output provenance, likeness/voice consent mechanisms, watermarking or disclosure requirements, hardware needs, and compatibility with the target production workflow. [1]

*Stars are the counts recorded in the attached dataset, not live GitHub values.*

## References

[1]: repo_showcase_merged.json (user-supplied repository dataset, analyzed August 19, 2026)

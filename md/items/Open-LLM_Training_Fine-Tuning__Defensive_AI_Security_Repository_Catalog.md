# Open-LLM Training, Fine-Tuning & Defensive AI Security Repository Catalog

> **Scope.** This catalog is curated exclusively from the supplied `repo_showcase_merged.json` dataset. It covers training open models, fine-tuning and alignment, data preparation, inference and serving, evaluation, RAG/agents, MLOps, and defensive prompt-injection testing. Repository metadata and star counts are source snapshots rather than live assessments. [1]

## Wide-Research Method

The source dataset was scanned through **eight independent workstreams running in parallel**: open models/training, fine-tuning/alignment, datasets/tokenization, inference/serving, evaluation/observability, defensive prompt-injection testing, RAG/agent systems, and MLOps/governance. Their results were reconciled, deduplicated, and filtered for a primary-purpose open-LLM or defensive-AI role. [1]

| Parallel workstream | Primary coverage |
| --- | --- |
| Open models, distributed training & compute | Independent metadata scan and reconciliation into the shared catalog. |
| Fine-tuning, alignment & synthetic data | Independent metadata scan and reconciliation into the shared catalog. |
| Datasets, tokenization & data curation | Independent metadata scan and reconciliation into the shared catalog. |
| Inference, quantization & serving | Independent metadata scan and reconciliation into the shared catalog. |
| Evaluation, benchmarks & LLM observability | Independent metadata scan and reconciliation into the shared catalog. |
| Defensive prompt-injection testing & guardrails | Independent metadata scan and reconciliation into the shared catalog. |
| RAG, retrieval, memory & agent systems | Independent metadata scan and reconciliation into the shared catalog. |
| MLOps, deployment & governance | Independent metadata scan and reconciliation into the shared catalog. |

## Defensive Security Boundary

> The prompt-injection and red-teaming section is limited to **defensive testing, vulnerability scanning, guardrails, tool-integrity checks, policy enforcement, and safe evaluation**. It excludes repositories focused on credential theft, malware, exploitation, access-control bypass, evasion, prompt leakage, or jailbreak generation. This catalog does not include attack payloads or operational evasion instructions. [1]

## LLM Lifecycle Map

| Lifecycle stage | Catalog categories |
| --- | --- |
| **Build and adapt** | Open-model training; fine-tuning/PEFT/alignment; datasets and tokenization |
| **Serve efficiently** | Inference, quantization, GPU efficiency, and serving |
| **Measure and improve** | Evaluation, benchmarks, observability, and experimentation |
| **Protect applications** | Prompt-injection defense, guardrails, defensive red teaming, and tool integrity |
| **Build AI products** | RAG, retrieval, memory, agents, MLOps, deployment, and governance |

## Curation Summary

The source dataset contains **6,327 unique repositories**. The eight parallel workstreams surfaced 777 candidates; primary-purpose and defensive-safety filtering retained **199 repositories** for the final catalog. [1]

## Coverage at a Glance

| Category | Repositories | Primary value |
| --- | ---: | --- |
| Open models, pretraining & distributed training | 18 | Open-model training, pretraining, distributed execution, and training-framework foundations. |
| Fine-tuning, PEFT, alignment & synthetic data | 17 | Fine-tuning workflows, PEFT/LoRA, alignment and preference optimization, distillation, and synthetic-data tooling. |
| Datasets, tokenization, curation & labeling | 7 | Training data, corpora, tokenization, labeling, deduplication, curation, and preparation capabilities. |
| GPU efficiency, inference, quantization & serving | 81 | Inference runtimes, quantization, serving, compilation, GPU efficiency, and deployment performance tools. |
| LLM evaluation, benchmarking & observability | 4 | Model and agent evaluation, benchmarks, tracing, monitoring, cost analysis, and experimentation. |
| Prompt-injection defense, guardrails & defensive red teaming | 8 | Defensive scanners, guardrails, safety testing, tool-integrity checks, and controlled red-teaming frameworks for protecting LLM and agent applications. |
| RAG, retrieval, memory & agent systems | 58 | Retrieval systems, vector databases, GraphRAG, memory layers, agent frameworks, and tool-enabled application infrastructure. |
| MLOps, model deployment, governance & experimentation | 6 | Model lifecycle, experiment tracking, deployment, governance, LLMOps, and production ML platforms. |

## Complete Categorized Catalog

Entries are ordered by metadata confidence and then by the source star snapshot. Several projects span multiple lifecycle stages; each appears under the clearest primary role to keep the catalog browsable. [1]

### Open models, pretraining & distributed training

Open-model training, pretraining, distributed execution, and training-framework foundations.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [nanochat](https://github.com/karpathy/nanochat) | nanochat is a minimal, experimental harness designed to simplify the process of training Large Language Models (LLMs). It provides an end-to-end frame | Python | 52,099 |
| [stable-diffusion-webui-forge](https://github.com/lllyasviel/stable-diffusion-webui-forge) | Stable Diffusion WebUI Forge is a platform built on top of Stable Diffusion WebUI designed to streamline development, optimize resource management, ac | Python | 12,963 |
| [DeepSpec](https://github.com/deepseek-ai/DeepSpec) | DeepSpec is a full-stack open-source codebase for training and evaluating draft models used in speculative decoding, a technique that accelerates LLM | Python | 6,830 |
| [slime](https://github.com/THUDM/slime) | Slime is an LLM post-training framework designed for Reinforcement Learning (RL) scaling, providing high-performance training and flexible data genera | Python | 5,360 |
| [torchtitan](https://github.com/pytorch/torchtitan) | `torchtitan` is a PyTorch native platform designed to facilitate rapid experimentation and large-scale training of generative AI models. It serves as | Python | 5,244 |
| [Dexbotic](https://github.com/Dexmal/dexbotic) | Dexbotic is an open-source Vision-Language-Action (VLA) development toolbox built on PyTorch, designed to facilitate embodied intelligence research. I | Python | 918 |
| [EGGROLL in C](https://github.com/d0rc/egg.c) | EGGROLL in C is a minimalist, dependency-free implementation of the EGGROLL algorithm family, designed for hardware-optimized training of language mod | Cuda | 344 |
| [TouchNet](https://github.com/xingchensong/TouchNet) | TouchNet is a native PyTorch library designed for large-scale multimodal Large Language Model (M-LLM) training involving both text and audio data. It | Python | 230 |
| [FlowBlock](https://github.com/Red-EAD/FlowBlock) | FlowBlock is a training-free, parallel decoding framework designed to accelerate block-wise diffusion language models (dLLMs) such as LLaDA-2.x, which | Python | 118 |
| [airllm](https://github.com/lyogavin/airllm) | AirLLM is a Python library that slashes the VRAM needed to run massive language models by decomposing them into per-layer (or per-expert, for sparse M | — | 0 |
| [axolotl](https://github.com/axolotl-ai-cloud/axolotl) | Axolotl, open-source framework for fine-tuning large language models. Axolotl is an open-source framework that streamlines post-training and fine-tuni | Python | 12,291 |
| [Liger-Kernel](https://github.com/linkedin/Liger-Kernel) | Efficient Triton Kernels for LLM Training | Python | 6,569 |
| [SimpleTuner](https://github.com/bghira/SimpleTuner) | A general fine-tuning kit geared toward diffusion models. | Python | 2,900 |
| [hivemind](https://github.com/learning-at-home/hivemind) | Decentralized deep learning in PyTorch. Built to train models on thousands of volunteers across the world. | Python | 2,514 |
| [HY-Motion](https://github.com/Tencent-Hunyuan/HY-Motion-1.0) | HY-Motion 1.0 is a text-to-3D human motion generation model designed to create skeleton-based 3D character animations from simple text prompts. It lev | Python | 2,282 |
| [LingBot-VLA](https://github.com/Robbyant/lingbot-vla) | LingBot-VLA is a pragmatic Vision-Language-Action (VLA) foundation model designed for embodied AI applications. It leverages large-scale pre-training | Python | 1,071 |
| [evo-memory](https://github.com/SakanaAI/evo-memory) | Code to train and evaluate Neural Attention Memory Models to obtain universally-applicable memory systems for transformers. | Python | 361 |
| [verl](https://github.com/volcengine/verl) | verl is a flexible, efficient, and production-ready Reinforcement Learning (RL) training library specifically designed for Large Language Models (LLMs | — | 0 |

### Fine-tuning, PEFT, alignment & synthetic data

Fine-tuning workflows, PEFT/LoRA, alignment and preference optimization, distillation, and synthetic-data tooling.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [openscience](https://github.com/synthetic-sciences/openscience) | OpenScience is an open-source AI workbench that automates the end-to-end scientific research loop—from literature review and hypothesis generation thr | TypeScript | 3,008 |
| [TabFM](https://github.com/google-research/tabfm) | TabFM is a pretrained tabular foundation model from Google Research that enables zero-shot classification and regression on tabular datasets without r | Python | 2,279 |
| [UnifoLM-WMA-0](https://github.com/unitreerobotics/unifolm-world-model-action) | UnifoLM-WMA-0 is an open-source World-Model-Action (WMA) framework developed by Unitree for general-purpose robot learning across various embodiments. | Python | 970 |
| [GPT‑OSS Recipes](https://github.com/huggingface/gpt-oss-recipes) | provides a collection of scripts and Jupyter Notebooks designed to demonstrate advanced optimization and fine-tuning techniques for OpenAI's GPT-OSS m | Jupyter Notebook | 503 |
| [MrFlow](https://github.com/Xingyu-Zheng/MrFlow) | MrFlow is a training-free staged sampling method that accelerates pretrained flow-matching text-to-image diffusion models by shifting most denoising w | Python | 281 |
| [lora-speedrun](https://github.com/Saivineeth147/lora-speedrun) | LoRA Speedrun is an open benchmarking arena that challenges practitioners to fine-tune models as fast as possible under strict, frozen conditions: fix | Python | 144 |
| [Unsloth-MLX](https://github.com/ARahim3/unsloth-mlx) | , `mlx-tune`, bridges the gap between the Unsloth fine-tuning experience and Apple's native MLX framework for Mac users. It provides an Unsloth-compat | — | 0 |
| [Soup CLI](https://github.com/trysoup.dev/soup-cli) | Soup CLI is a developer tool that makes it practical to fine-tune large language models on consumer-grade GPUs. It exposes a simple command-line inter | — | 0 |
| [unsloth](https://github.com/unslothai/unsloth) | Unsloth addresses both. Custom Triton kernels and mathematical optimizations cut training time in half while reducing VRAM usage by up to 70% | Python | 67,475 |
| [Easy Dataset](https://github.com/ConardLi/easy-dataset) | Easy Dataset is a powerful JavaScript tool designed for efficiently creating high-quality datasets essential for Large Language Model (LLM) fine-tunin | JavaScript | 13,981 |
| [Oumi](https://github.com/oumi-ai/oumi) | Oumi is an end-to-end platform designed for building, fine-tuning, evaluating, and deploying state-of-the-art foundation models. It provides comprehen | Python | 9,186 |
| [reasoning-from-scratch](https://github.com/rasbt/reasoning-from-scratch) | Implement a reasoning LLM in PyTorch from scratch, step by step | Jupyter Notebook | 5,000 |
| [MetaClaw](https://github.com/aiming-lab/MetaClaw) | MetaClaw is an agent framework designed to allow AI agents to learn and evolve through continuous interaction, inspired by biological learning process | Python | 3,433 |
| [Isaac Sim](https://github.com/isaac-sim/IsaacSim) | NVIDIA Isaac Sim is an open-source simulation platform built on NVIDIA Omniverse, designed for developing, testing, and training AI-driven robots in r | Python | 3,030 |
| [Rex-Omni](https://github.com/IDEA-Research/Rex-Omni) | Rex-Omni is a 3-billion parameter Multimodal Large Language Model (MLLM) designed to redefine object detection and visual perception tasks. It approac | Jupyter Notebook | 1,307 |
| [krea-2](https://github.com/krea-ai/krea-2) | Krea 2 is an open-source image generation model from Krea AI focused on creative and stylistic exploration, currently the top-rated text-to-image mode | Python | 700 |
| [mira](https://github.com/mira-wm/mira) | MIRA is a real-time world model of Rocket League, implemented as a 5-billion-parameter latent diffusion model that generates video frame-by-frame from | Python | 473 |

### Datasets, tokenization, curation & labeling

Training data, corpora, tokenization, labeling, deduplication, curation, and preparation capabilities.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Gigatoken](https://github.com/marcelroed/gigatoken) | Gigatoken is a high-performance tokenizer for language models that achieves roughly 1000x faster encoding throughput than HuggingFace Tokenizers, reac | Rust | 3,846 |
| [Rustbpe](https://github.com/karpathy/rustbpe) | Rustbpe is a lightweight Rust library designed to provide an efficient implementation for training GPT-style Byte Pair Encoding (BPE) tokenizers. It a | Rust | 433 |
| [jacobian-lens](https://github.com/anthropics/jacobian-lens) | `jlens` is a reference Python implementation of the Jacobian lens, an interpretability tool that linearly transports residual-stream activations from | Python | 1,654 |
| [HiVG](https://github.com/ximinng/HiVG) | Hierarchical SVG Tokenization: Learning Compact Visual Programs for Scalable Vector Graphics Modeling | Python | 703 |
| [Dreamer 4 in PyTorch](https://github.com/nicklashansen/dreamer4) | offers an unofficial PyTorch implementation of the Dreamer 4 world model, adapted for multi-task DMControl with continuous actions. It serves as a sta | Python | 278 |
| [Tokenizer Visualizer](https://github.com/rom1504/tokenizer-ui) | Tokenizer Visualizer is a web-based tool designed to visualize how various tokenizers split text and multimodal inputs into discrete tokens. It suppor | HTML | 49 |
| [deident-wasm](https://github.com/ikuV/deident-wasm) | Deident-Wasm is a privacy transformation engine for structured datasets that performs pseudonymization and risk-assessed anonymization on CSV, JSONL, | — | 0 |

### GPU efficiency, inference, quantization & serving

Inference runtimes, quantization, serving, compilation, GPU efficiency, and deployment performance tools.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | llama.cpp is a high-performance C/C++ implementation designed to enable efficient Large Language Model (LLM) inference across various hardware platfor | C++ | 104,613 |
| [Speech To Speech](https://github.com/huggingface/speech-to-speech) | Speech To Speech is an open-source Python library from Hugging Face that enables developers to build low-latency, fully local voice agents using a mod | Python | 9,908 |
| [Dolphin](https://github.com/bytedance/Dolphin) | Dolphin is an enhanced universal document parsing model designed to seamlessly handle diverse document types, including both digital and photographed | Python | 8,899 |
| [bitsandbytes](https://github.com/bitsandbytes-foundation/bitsandbytes) | bitsandbytes makes large language models more accessible via k-bit quantization techniques for PyTorch, enabling researchers and developers to run lar | Python | 8,377 |
| [ollm](https://github.com/Mega4alik/ollm) | oLLM is a lightweight Python library that enables large-context LLM inference on consumer-grade hardware, allowing models like gpt-oss-20B, qwen3-next | Python | 2,780 |
| [HPC-Ops](https://github.com/Tencent/hpc-ops) | HPC-Ops is a production-grade, high-performance C++ library designed for LLM inference, developed by the Tencent Hunyuan AI Infra team. It provides de | C++ | 828 |
| [Audar-ASR-V1](https://github.com/AudarAI/Audar-ASR-V1) | Audar-ASR-V1 is a family of Arabic-first generative speech-recognition models from AudarAI that frames transcription as audio-conditioned next-token p | Python | 561 |
| [QeRL](https://github.com/NVlabs/QeRL) | QeRL is a novel framework that enables efficient Reinforcement Learning (RL) for large language models (LLMs) by integrating quantization and adaptati | Python | 499 |
| [Dressage](https://github.com/Accio-Lab/Dressage) | Dressage is an agentic reinforcement learning framework that trains LLM agents to use real tools—such as code editors, shell commands, and retrieval A | Python | 476 |
| [Unsloth Zoo](https://github.com/unslothai/unsloth-zoo) | Unsloth Zoo provides a collection of utilities and free notebooks designed to facilitate efficient fine-tuning of large language models. It leverages | Python | 298 |
| [SmallClaw](https://github.com/XposeMarket/SmallClaw) | SmallClaw is a local-first AI agent framework designed to run powerful AI agents on local hardware, supporting both local-only and hybrid cloud setups | TypeScript | 234 |
| [cactus-hybrid](https://github.com/cactus-compute/cactus-hybrid) | Cactus Hybrid addresses the accuracy gap of small on-device language models by post-training them with internal confidence probes that emit a 0–1 reli | Shell | 224 |
| [Audio8_TTS](https://github.com/Audio8-AI/Audio8_TTS) | Audio8_TTS is a compact 0.6B-parameter multilingual text-to-speech model that delivers state-of-the-art quality with zero-shot voice cloning, addressi | Python | 206 |
| [gallama](https://github.com/remichu-ai/gallama) | gallama is an opinionated Python library that provides an LLM inference API service backend optimized for local agentic tasks, focusing on model servi | Python | 137 |
| [freecodecamp-multi-agent-ai-system](https://github.com/sandeepmb/freecodecamp-multi-agent-ai-system) | A production-grade, fully local multi-agent AI system that demonstrates how to orchestrate specialized agents for personalized learning without relyin | Python | 112 |
| [reame](https://github.com/swellweb/reame) | Reame is a lean, CPU-first LLM inference server built on llama.cpp, designed to run useful models on cheap or free-tier hardware such as shared vCPUs | C++ | 102 |
| [Soup](https://github.com/MakazhanAlpamys/Soup) | Soup is a Python CLI tool that simplifies LLM fine-tuning and post-training by replacing complex infrastructure with a single YAML config and one-comm | — | 0 |
| [ollama](https://github.com/ollama/ollama) | Get up and running with Llama 3, Mistral, Gemma, and other large language models. | Go | 178,806 |
| [open-webui](https://github.com/open-webui/open-webui) | User-friendly WebUI for LLMs (Formerly Ollama WebUI) | Python | 149,050 |
| [vLLM](https://github.com/vllm-project/vllm) | vLLM is a high-throughput and memory-efficient library designed for serving and inferencing Large Language Models (LLMs). It achieves superior perform | Python | 77,202 |
| [VoxCPM2](https://github.com/OpenBMB/VoxCPM) | VoxCPM2: Tokenizer-Free TTS for Multilingual Speech Generation, Creative Voice Design, and True-to-Life Cloning | Python | 35,776 |
| [Deepagents](https://github.com/langchain-ai/deepagents) | The batteries-included agent harness. | Python | 27,862 |
| [meetily](https://github.com/Zackriya-Solutions/meetily) | Meetily is a privacy-first AI meeting assistant that captures, transcribes, and summarizes meetings entirely on local infrastructure, eliminating the | Rust | 27,711 |
| [DeepSeek-OCR](https://github.com/deepseek-ai/DeepSeek-OCR) | DeepSeek-OCR is a project focused on Contexts Optical Compression, investigating the relationship between vision encoders and Large Language Models fr | Python | 22,847 |
| [openui](https://github.com/wandb/openui) | OpenUI let's you describe UI using your imagination, then see it rendered live. | TypeScript | 22,507 |
| [GPT-OSS](https://github.com/openai/gpt-oss) | The GPT-OSS repository provides two open-weight language models, `gpt-oss-120b` and `gpt-oss-20b`, developed by OpenAI for powerful reasoning and agen | Python | 20,018 |
| [ktransformers](https://github.com/kvcache-ai/ktransformers) | KTransformers is a flexible Python framework designed for optimizing the inference and fine-tuning of Large Language Models (LLMs) using heterogeneous | Python | 19,124 |
| [ggml](https://github.com/ggml-org/ggml) | ggml is a low-level, cross-platform C++ tensor library designed for machine learning applications. It provides essential functionalities for tensor al | C++ | 14,463 |
| [TensorRT](https://github.com/NVIDIA/TensorRT) | NVIDIA® TensorRT™ is an SDK for high-performance deep learning inference on NVIDIA GPUs. This repository contains the open source components of Tensor | C++ | 13,257 |
| [TinyZero](https://github.com/Jiayi-Pan/TinyZero) | TinyZero is a project that reproduces the DeepSeek R1-Zero methodology for countdown and multiplication tasks using Reinforcement Learning (RL). The g | Python | 13,053 |
| [Nano-vLLM](https://github.com/GeeeekExplorer/nano-vllm) | Nano-vLLM is a lightweight, custom implementation of the vLLM framework designed for efficient large language model inference. Built from scratch in P | Python | 12,979 |
| [Local Deep Research](https://github.com/LearningCircuit/local-deep-research) | Local Deep Research achieves ~95% on SimpleQA benchmark (tested with GPT-4.1-mini). Supports local and cloud LLMs (Ollama, Google, Anthropic, ...). Se | Python | 8,934 |
| [open-codesign](https://github.com/OpenCoworkAI/open-codesign) | Open-source Claude Design alternative. One-click import your Claude Code / Codex API key. Prompt → prototype / slides / PDF. Multi-model (Claude, GPT, | TypeScript | 6,993 |
| [NVIDIA Dynamo](https://github.com/ai-dynamo/dynamo) | Dynamo is an open-source, datacenter-scale inference stack built in Rust, designed to orchestrate distributed inference serving. It functions as an or | Rust | 6,581 |
| [TurboQuant+](https://github.com/TheTom/turboquant_plus) | is an experimental workspace focused on implementing and researching TurboQuant techniques for KV cache compression within the `llama.cpp` framework. | Python | 6,335 |
| [Stable-Diffusion CPP](https://github.com/leejet/stable-diffusion.cpp) | Stable-Diffusion CPP is a high-performance, pure C/C++ implementation designed for running various diffusion models, including Stable Diffusion, FLUX, | C++ | 5,776 |
| [semantic-router](https://github.com/vllm-project/semantic-router) | Intelligent Mixture-of-Models Router for Efficient LLM Inference | Go | 5,172 |
| [llm-compressor](https://github.com/vllm-project/llm-compressor) | Transformers-compatible library for applying various compression algorithms to LLMs for optimized deployment with vLLM | Python | 3,689 |
| [torchchat](https://github.com/pytorch/torchchat) | Run PyTorch LLMs locally on servers, desktop and mobile | Python | 3,615 |
| [Gollama](https://github.com/sammcj/gollama) | Gollama is a command-line tool written in Go designed to manage Ollama models on macOS and Linux systems. It provides a Text User Interface (TUI) for | Go | 1,762 |
| [WASTE](https://github.com/sqliteai/waste) | WASTE is an embeddable C inference engine designed to run frontier-scale mixture-of-experts models like the 2.78-trillion-parameter Kimi K3 on consume | C | 1,717 |
| [local-llm](https://github.com/jamesob/local-llm) | A hands-on guide to running state-of-the-art large language models locally without depending on cloud providers like OpenAI or Anthropic, with hardwar | Shell | 1,697 |
| [club-3090](https://github.com/noonghunna/club-3090) | Community recipes for serving LLMs on RTX 3090/4090/5090 CUDA gpus. Multi-engine (vLLM, llama.cpp, ik_llama) and model-agnostic. Currently shipping Qw | Python | 1,504 |
| [lingbot-world-v2](https://github.com/Robbyant/lingbot-world-v2) | LingBot-World 2.0 (LingBot-World-Infinity) is an interactive world modeling system by the Robbyant Team that generates infinite, real-time video strea | Python | 1,445 |
| [SpikingBrain](https://github.com/BICLab/SpikingBrain-7B) | SpikingBrain is a family of Large Models inspired by biological brain mechanisms, integrating spike encoding, hybrid efficient attention, and Mixture- | Python | 1,308 |
| [Databricks AI Dev Kit](https://github.com/databricks-solutions/ai-dev-kit) | The Databricks AI Dev Kit is a toolkit designed to enhance AI-driven development and "vibe coding" directly on the Databricks platform. It provides tr | Python | 1,257 |
| [Mysti](https://github.com/DeepMyst/Mysti) | Mysti is an agentic AI coding team designed to enhance development workflows within Visual Studio Code. It facilitates collaborative coding by leverag | TypeScript | 1,037 |
| [GOModel](https://github.com/ENTERPILOT/GOModel) | AI gateway written in Go. Lightweight unified OpenAI-compatible API for OpenAI, Anthropic, Gemini, Groq, xAI & Ollama. LiteLLM alternative with observ | Go | 971 |
| [Clodex](https://github.com/mereyabdenbekuly-ctrl/clodex-ide) | CLODEx is an open-source, local-first agentic IDE designed for long-running, verifiable autonomous software development rather than single-message cha | TypeScript | 861 |
| [tiny-vllm](https://github.com/jmaczan/tiny-vllm) | Build your own high performance LLM inference engine in C++ and CUDA - a smaller version of vLLM | C++ | 816 |
| [SiliconScope](https://github.com/kennss/SiliconScope) | SiliconScope is a native SwiftUI system monitor for Apple Silicon Macs that runs without sudo, exposing metrics that Activity Monitor and terminal-bas | Swift | 807 |
| [rvLLM](https://github.com/m0at/rvllm) | rvLLM: High-performance LLM inference in Rust. Drop-in vLLM replacement. | Rust | 754 |
| [Pythia](https://github.com/jangles-byte/Pythia) | PYTHIA is a local, keyless oracle that fuses 40+ live global data feeds—news, conflict, disasters, markets, cyber threats, climate signals, and regula | TypeScript | 619 |
| [labs-OO-Agents](https://github.com/NVIDIA-NeMo/labs-OO-Agents) | NVIDIA Object Oriented Agents (NOOA) is a model-agnostic Python framework that unifies agent construction around native Python classes, replacing the | Python | 618 |
| [deltafin](https://github.com/gavamedia/deltafin) | Deltafin is a research project that runs the full 2.8-trillion-parameter Kimi K3 Mixture-of-Experts model on a single local workstation, despite the m | Python | 567 |
| [vllm-turboquant](https://github.com/mitkox/vllm-turboquant) | implements vLLM TurboQuant, an extension of the vLLM library designed for highly optimized LLM serving. It focuses on extending vLLM's experimental Tu | Python | 534 |
| [SmartResume](https://github.com/alibaba/SmartResume) | SmartResume is an intelligent, layout-aware system designed for parsing resumes from various formats, including PDF, images, and Office documents. It | Python | 354 |
| [brainapi2.git](https://github.com/Lumen-Labs/brainapi2) | BrainAPI is a knowledge graph–powered AI memory layer that transforms unstructured text into a structured, queryable graph through a swarm of speciali | Python | 296 |
| [ray-finance](https://github.com/cdinnison/ray-finance) | An open-source AI financial advisor that learns your situation and gets smarter every conversation. | TypeScript | 295 |
| [ada](https://github.com/Nlouis38/ada) | ADA (Advanced Design Assistant) is a voice- and text-driven AI assistant specialized in STEM fields, offering real-time conversational support for eng | Python | 275 |
| [pixel-art-fixer](https://github.com/Retro-Diffusion/pixel-art-fixer) | Pixel Art Fixer converts fake "pixel art" — images that merely look like pixel art but contain off-grid cells, non-integer scales, anti-aliased mush, | Python | 251 |
| [Watch Skill](https://github.com/oxbshw/watch-skill) | Watch Skill is a local-first video intelligence layer that gives AI agents the ability to watch, remember, and verify video content—from YouTube clips | Python | 247 |
| [FinePDFs](https://github.com/huggingface/finepdfs) | provides the end-to-end code and pipelines for processing the FinePDFs dataset. It orchestrates the complex workflow required to filter, extract, OCR, | Python | 181 |
| [NIGHTRUN](https://github.com/hardrave/NIGHTRUN) | NIGHTRUN is a Rust-based, bare-metal LLM runtime that boots from USB (x86_64 UEFI) or microSD (Raspberry Pi 5) and serves a quantized model directly o | Rust | 167 |
| [macos-laguna-s2.1](https://github.com/tanishq-dubey/macos-laguna-s2.1) | A reproducible benchmarking harness for evaluating Poolside's Laguna S 2.1 model across MLX and GGUF quantizations on Apple Silicon, capturing task sc | Python | 151 |
| [llm-interface](https://github.com/samestrin/llm-interface) | A simple NPM interface for seamlessly interacting with 36 Large Language Model (LLM) providers, including OpenAI, Anthropic, Google Gemini, Cohere, Hu | JavaScript | 124 |
| [Getbased](https://github.com/elkimek/get-based) | Getbased is an open-source, browser-based health intelligence dashboard that helps individuals aggregate and interpret their personal biological data | JavaScript | 111 |
| [Lexicon](https://github.com/AashishH15/Lexicon) | Lexicon is a local-first, open-source writing assistant that serves as a privacy-focused alternative to cloud-based editors like Grammarly. It solves | JavaScript | 83 |
| [llm-gateway](https://github.com/openziti/llm-gateway) | Zero trust LLM gateway. OpenAI-compatible proxy with semantic routing and load balancing across OpenAI, Anthropic, Ollama, vLLM, and any compatible ba | Go | 69 |
| [AI-Agents-from-Scratch-using-Ollama](https://github.com/AIAnytime/AI-Agents-from-Scratch-using-Ollama) | AI Agents from Scratch using Ollama Local LLMs. | Python | 62 |
| [modelship](https://github.com/alez007/modelship) | ModelShip packs everything into a single unified inference server. One clean OpenAI compatible API for your entire AI stack | Python | 37 |
| [renfield](https://github.com/ebongard/renfield) | Renfield is a self-hosted, fully offline AI assistant designed for users who want a privacy-respecting alternative to cloud-based smart assistants. It | Python | 30 |
| [Ollama-LiteLLM](https://github.com/AIAnytime/Ollama-LiteLLM) | Ollama LiteLLM for Local LLM and LLM Routing. | Jupyter Notebook | 1 |
| [youtube-summarizer-llama3](https://github.com/casedone/youtube-summarizer-llama3) | Build YouTube Summarizer using Ollama, Llama 3, LangChain, and Gradio | — | 0 |
| [Ollamadore-64](https://github.com/shokuninstudio/Ollamadore-64) | Ollamadore 64 is a private ultra lightweight frontend for Ollama that weighs well under 64 kilobytes on disk. | — | 0 |
| [OllamaDeepSeekLocalInstallation](https://github.com/HouseOfLogicGH/OllamaDeepSeekLocalInstallation) | A step-by-step guide for installing and running DeepSeek AI models locally using Ollama, the open-source platform for serving large language models. T | Shell | 0 |
| [Ollama docker-compose](https://github.com/notthebee/1dfc5a82d13dd2bb6589a1e4747e03cf) |  | — | 0 |
| [ContextOS](https://github.com/joshimohanlalit1303-ctrl/ContextOS) | Memory-as-a-Service for AI Agents & LLMs. Add persistent memory, pgvector-based semantic search, and automatic semantic deduplication with 3 simple RE | TypeScript | 0 |
| [Claw Compactor](https://github.com/aeromomo/claw-compactor) | Claw Compactor is an open-source LLM token compression engine built around a 14-stage Fusion Pipeline. This architecture chains specialized compressor | — | 0 |
| [claudish-to-english](https://github.com/gvzdv/claudish-to-english) | claudish-to-english is a Claude Code plugin that displays a plain-English rewrite of each assistant message alongside Claude's original response, addr | — | 0 |
| [bw24](https://github.com/avifenesh/bw24) | BW24 is a from-scratch LLM inference engine written in Rust and CUDA, tuned for a single RTX 5090 laptop GPU. It explores how much performance can be | — | 0 |

### LLM evaluation, benchmarking & observability

Model and agent evaluation, benchmarks, tracing, monitoring, cost analysis, and experimentation.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [langfuse](https://github.com/langfuse/langfuse) | Langfuse is an open-source observability and analytics platform built for developers shipping LLM applications. It provides tracing, evaluation, promp | TypeScript | 32,262 |
| [helicone](https://github.com/Helicone/helicone) | 🧊 Open source LLM observability platform. One line of code to monitor, evaluate, and experiment. YC W23 🍓 | TypeScript | 6,077 |
| [tokencost](https://github.com/AgentOps-AI/tokencost) | Easy token price estimates for 400+ LLMs | Python | 2,003 |
| [AgentStack](https://github.com/AgentOps-AI/agentstack) | The fastest way to build robust AI agents | — | 0 |

### Prompt-injection defense, guardrails & defensive red teaming

Defensive scanners, guardrails, safety testing, tool-integrity checks, and controlled red-teaming frameworks for protecting LLM and agent applications.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [garak](https://github.com/NVIDIA/garak) | Garak is an open-source LLM vulnerability scanner and Generative AI Red-teaming & Assessment Kit designed to probe Large Language Models for weaknesse | HTML | 7,561 |
| [Promptfoo](https://github.com/promptfoo/promptfoo) | Test your prompts, agents, and RAGs. Red teaming/pentesting/vulnerability scanning for AI. Compare performance of GPT, Claude, Gemini, DeepSeek, and m | TypeScript | 22,650 |
| [IronClaw](https://github.com/nearai/ironclaw) | IronClaw is a Rust-based, OpenClaw inspired AI assistant focused on providing a secure and private experience. It is built on the principle that user | Rust | 11,851 |
| [Skill Scanner](https://github.com/cisco-ai-defense/skill-scanner) | Skill Scanner is a security tool designed to detect threats within AI Agent Skills, focusing on prompt injection, data exfiltration, and malicious cod | Python | 1,784 |
| [ClawSec](https://github.com/prompt-security/clawsec) | ClawSec is a comprehensive security skill suite designed to protect AI agent platforms, including OpenClaw and NanoClaw. It provides a unified system | JavaScript | 905 |
| [toolport](https://github.com/tsouth89/toolport) | Local-first MCP gateway. One port for every tool and every AI client: lazy discovery (~90% token savings), tool integrity + quarantine, secrets in the | Rust | 175 |
| [mcptoon](https://github.com/activeing123/mcptoon) | mcptoon is a lightweight CLI that lets AI agents use many MCP servers without loading their full tool schemas into the context window. It acts as an i | — | 0 |
| [MCP Checkpoint](https://github.com/aira-security/mcp-checkpoint) | MCP Armor is a comprehensive security scanner designed for the Model Context Protocol (MCP). It automatically discovers and analyzes MCP servers integ | — | 0 |

### RAG, retrieval, memory & agent systems

Retrieval systems, vector databases, GraphRAG, memory layers, agent frameworks, and tool-enabled application infrastructure.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Elasticsearch](https://github.com/elastic/elasticsearch) | Elasticsearch is a distributed search and analytics engine designed as a scalable data store and vector database optimized for high-speed relevance on | Java | 77,630 |
| [Milvus](https://github.com/milvus-io/milvus) | Milvus is a high-performance, cloud-native vector database engineered for scalable Approximate Nearest Neighbor (ANN) search. It efficiently organizes | Go | 43,850 |
| [qdrant](https://github.com/qdrant/qdrant) | Qdrant - High-performance, massive-scale Vector Database and Vector Search Engine for the next generation of AI. Also available in the cloud https://c | Rust | 34,029 |
| [Foundations-of-LLMs](https://github.com/ZJU-LLMs/Foundations-of-LLMs) | hosts "Foundations-of-LLMs," a comprehensive book designed to systematically teach the foundational knowledge and cutting-edge techniques of Large Lan | — | 16,059 |
| [chat-langchain](https://github.com/langchain-ai/chat-langchain) | Chat LangChain is a production-ready documentation assistant that answers questions about LangChain, LangGraph, and LangSmith, built as a Managed Deep | TypeScript | 6,436 |
| [langgraph-swarm-py](https://github.com/langchain-ai/langgraph-swarm-py) | For your multi-agent needs | Python | 1,554 |
| [restai](https://github.com/apocas/restai) | RESTai is an AIaaS (AI as a Service) open-source platform. Built on top of LlamaIndex & Langchain. Supports any public LLM supported by LlamaIndex and | Python | 512 |
| [ZAPI](https://github.com/adoptai/zapi) | ZAPI is an open-source Python library developed by Adopt AI designed to facilitate the creation of AI Agent tools through automated API discovery. It | Python | 471 |
| [GraphRAG-with-Llama-3.1](https://github.com/Coding-Crashkurse/GraphRAG-with-Llama-3.1) | A streamlined implementation of Graph Retrieval-Augmented Generation (GraphRAG) leveraging Meta's Llama 3.1 large language model for enhanced question | Jupyter Notebook | 239 |
| [graybox](https://github.com/Aaryanverma/graybox) | Gray Box is a local-first, long-term memory tool that captures unstructured notes and quietly transforms them into a cross-linked, queryable Markdown | Python | 155 |
| [langgraph-studio](https://github.com/langchain-ai/langgraph-studio) | Desktop app for prototyping and debugging LangGraph applications locally. | — | 0 |
| [ragflow](https://github.com/infiniflow/ragflow) | RAGFlow is an open-source RAG (Retrieval-Augmented Generation) engine based on deep document understanding. | Go | 88,680 |
| [LightRAG](https://github.com/HKUDS/LightRAG) | "LightRAG: Simple and Fast Retrieval-Augmented Generation" | Python | 38,932 |
| [graphrag](https://github.com/microsoft/graphrag) | A modular graph-based Retrieval-Augmented Generation (RAG) system | Python | 35,543 |
| [gemini-fullstack-langgraph-quickstart](https://github.com/google-gemini/gemini-fullstack-langgraph-quickstart) | Get started with building Fullstack Agents using Gemini 2.5 and LangGraph | Jupyter Notebook | 18,304 |
| [LangChain.js](https://github.com/langchain-ai/langchainjs) | LangChain.js is a framework designed for building sophisticated, LLM-powered applications by providing a standard interface for chaining together inte | TypeScript | 17,516 |
| [Agent Lightning](https://github.com/microsoft/agent-lightning) | Agent Lightning is a framework designed to optimize and train AI agents, serving as the absolute trainer for agentic AI systems. It enables users to o | Python | 16,937 |
| [OpenWiki](https://github.com/langchain-ai/openwiki) | OpenWiki is a CLI that uses an autonomous documentation agent to generate and maintain a linked Markdown wiki for a codebase or personal knowledge bas | TypeScript | 13,780 |
| [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) | A framework for building, orchestrating and deploying AI agents and multi-agent workflows with support for Python and .NET. | Python | 12,857 |
| [Open Deep Research](https://github.com/langchain-ai/open_deep_research) | Open Deep Research is a fully open-source, configurable deep research agent that performs on par with leading commercial alternatives, currently ranki | Python | 12,631 |
| [open-swe](https://github.com/langchain-ai/open-swe) | An Open-Source Asynchronous Coding Agent | Python | 10,572 |
| [Zvec](https://github.com/alibaba/zvec) | Zvec is a lightweight, high-performance, in-process vector database designed for embedding directly into applications. Built upon Alibaba's battle-tes | C++ | 9,435 |
| [Local Deep Researcher](https://github.com/langchain-ai/local-deep-researcher) | Fully local web research and report writing assistant | Python | 9,303 |
| [Call Center AI](https://github.com/microsoft/call-center-ai) | Call Center AI is an AI-powered solution leveraging Azure and OpenAI GPT models to manage sophisticated customer interactions. It enables sending outb | Python | 6,441 |
| [agentops](https://github.com/AgentOps-AI/agentops) | Python SDK for agent monitoring, LLM cost tracking, benchmarking, and more. Integrates with most LLMs and agent frameworks like CrewAI, Langchain, and | Python | 5,779 |
| [genai-stack](https://github.com/docker/genai-stack) | Langchain + Docker + Neo4j + Ollama | Python | 5,390 |
| [cognita](https://github.com/truefoundry/cognita) | RAG (Retrieval Augmented Generation) Framework for building modular, open source applications for production by TrueFoundry | Python | 4,415 |
| [GenerativeAIExamples](https://github.com/NVIDIA/GenerativeAIExamples) | Generative AI reference workflows optimized for accelerated infrastructure and microservice architecture. | Jupyter Notebook | 4,150 |
| [MemMachine](https://github.com/MemMachine/MemMachine) | MemMachine is an open-source, universal memory layer designed for managing the state of AI agents and LLM-powered applications. It provides a scalable | Python | 4,129 |
| [nano-graphrag](https://github.com/gusye1234/nano-graphrag) | A simple, easy-to-hack GraphRAG implementation | Python | 3,967 |
| [graphrag-accelerator](https://github.com/Azure-Samples/graphrag-accelerator) | One-click deploy of a Knowledge Graph powered RAG (GraphRAG) in Azure | Python | 2,409 |
| [LLMStack](https://github.com/trypromptly/LLMStack) | No-code multi-agent framework to build LLM Agents, workflows and applications with your data | Python | 2,309 |
| [open-agent-platform](https://github.com/langchain-ai/open-agent-platform) | An open-source, no-code agent building platform. | TypeScript | 1,902 |
| [py-gpt](https://github.com/szczyglis-dev/py-gpt) | Desktop AI Assistant powered by GPT-4, GPT-4 Vision, GPT-3.5, DALL-E 3, Langchain, Llama-index, chat, vision, voice control, image generation and anal | Python | 1,882 |
| [memory-os](https://github.com/ClaudioDrews/memory-os) | A 7-layer memory operating system for Hermes Agent — persistent memory with Qdrant, structured facts, fabric recall, auto-curated wiki, and surgical c | Python | 1,203 |
| [rag_api](https://github.com/danny-avila/rag_api) | ID-based RAG FastAPI: Integration with Langchain and PostgreSQL/pgvector | Python | 885 |
| [pandaprobe](https://github.com/chirpz-ai/pandaprobe) | open source agent engineering platform: traces, evals, and metrics to debug and improve your AI agents. Integrates with LangGraph, CrewAI, Claude Agen | Python | 754 |
| [OpenTag](https://github.com/CopilotKit/OpenTag) | OpenTag is an open-source on-call triage assistant that operates natively within Slack and Microsoft Teams, helping support and engineering teams rapi | TypeScript | 723 |
| [langchain-ask-pdf](https://github.com/alejandro-ao/langchain-ask-pdf) | An AI-app that allows you to upload a PDF and ask questions about it. It uses OpenAI's LLMs to generate a response. | Python | 635 |
| [Graph-R1](https://github.com/LHRLAB/Graph-R1) | Graph-R1: Towards Agentic GraphRAG Framework via End-to-end Reinforcement Learning | Python | 590 |
| [Antfly](https://github.com/antflydb/antfly) | Antfly is a distributed, multimodal search engine built on Raft consensus, designed to handle complex data retrieval across text, images, audio, and v | Go | 334 |
| [LangChain](https://github.com/langchain-ai/langchain-aws) | provides a monorepo that integrates LangChain and LangGraph components with various Amazon Web Services (AWS) offerings. Its primary goal is to enable | Python | 317 |
| [home-generative-agent](https://github.com/goruck/home-generative-agent) | A home assistant generative agent integration based on langchain and langgraph | Python | 283 |
| [Jarvis AI Agent](https://github.com/Xthebuilder/JRVS) | JRVS is a local-first AI agent framework designed for developers requiring explicit control and predictable behavior when working with local language | Python | 236 |
| [MinerU-HTML](https://github.com/opendatalab/MinerU-HTML) | MinerU-HTML is an advanced Python tool designed for extracting clean main content from complex web page HTML using Small Language Models (SLMs). It in | Python | 235 |
| [PDF-Brain](https://github.com/joelhooks/pdf-brain) | PDF-Brain is a local, agent-first knowledge base designed to unify and semantically search information from both PDF and Markdown files. It establishe | TypeScript | 223 |
| [pgContext](https://github.com/Evokoa/pgContext) | pgContext is a PostgreSQL 17 and 18 extension that transforms Postgres into a full AI search engine, combining dense vector search, metadata-filtered | Rust | 179 |
| [SmartRAG](https://github.com/itanishqshelar/SmartRAG) | SmartRAG is a privacy-first, multimodal Retrieval-Augmented Generation (RAG) system designed for intelligent conversations with diverse data types. It | Python | 109 |
| [n8n-and-code-rag](https://github.com/Getting-Automated/n8n-and-code-rag) | A production-ready Retrieval-Augmented Generation (RAG) framework that addresses the high cost and privacy concerns of commercial RAG services by enab | Python | 48 |
| [AIAgentsBootcamp](https://github.com/pragatidev/AIAgentsBootcamp) | Build and deploy powerful AI agents using LangChain, Langflow, and GPT-4 – from beginner to advanced. | Jupyter Notebook | 33 |
| [news-dashboard](https://github.com/lihor-hub/news-dashboard) | News Dashboard is a self-hosted, technical-focused RSS reader and news triage platform that consolidates curated feeds from Python, AI/LLM, agents, cl | Python | 22 |
| [agentic-operator-core](https://github.com/Clawdlinux/agentic-operator-core) | Clawdlinux Operator provides in-cluster governance for AI agents running on Kubernetes, addressing the regulated operations questions platform teams f | Go | 22 |
| [Project-WebSage](https://github.com/AIAnytime/Project-WebSage) | WebSage is an AI Engine that extracts content from any URL, generates summaries, and enables interaction using AI models. Choose between Closed Source | Python | 15 |
| [TencentDB-Agent-Memory](https://github.com/TencentCloud/TencentDB-Agent-Memory) | TencentDB Agent Memory is an open-source framework that helps AI agents retain, organize, and reuse experience across sessions and projects, reducing | — | 0 |
| [research-rabbit](https://github.com/langchain-ai/research-rabbit) | Fully local web research and report writing assistant | — | 0 |
| [NyRAG](https://github.com/abhishekkrthakur/NyRAG) | NyRAG is a tool designed for building Retrieval-Augmented Generation (RAG) applications by integrating data processing, hybrid search, and conversatio | — | 0 |
| [HarnessRouter](https://github.com/harnessrouter.ai/harnessrouter) | HarnessRouter is an AI agent orchestration layer that sits between agents and the underlying model harnesses to route work to the most appropriate run | — | 0 |
| [Embabel Agent Framework](https://github.com/embabel/embabel-agent) | Embabel Agent Framework is a JVM-based framework for building agentic flows that seamlessly blend LLM-prompted interactions with conventional code and | — | 0 |

### MLOps, model deployment, governance & experimentation

Model lifecycle, experiment tracking, deployment, governance, LLMOps, and production ML platforms.

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [ray](https://github.com/ray-project/ray) | Ray is an AI compute engine. Ray consists of a core distributed runtime and a set of AI Libraries for accelerating ML workloads. | Python | 43,537 |
| [mlflow](https://github.com/mlflow/mlflow) | Open source platform for the machine learning lifecycle | Python | 27,550 |
| [mlops-zoomcamp](https://github.com/DataTalksClub/mlops-zoomcamp) | Free MLOps course from DataTalks.Club | Jupyter Notebook | 15,130 |
| [Agent Starter Pack](https://github.com/GoogleCloudPlatform/agent-starter-pack) | The Agent Starter Pack is a Python package designed to accelerate the deployment of production-ready Generative AI agents on Google Cloud. It provides | Python | 6,275 |
| [frugon](https://github.com/Rodiun/frugon) | Frugon is a free, open-source CLI tool that analyzes LLM call logs locally to identify where spending can be reduced by routing calls to cheaper model | Python | 201 |
| [Darwin](https://github.com/ds-horizon/darwin) | Darwin is an enterprise-grade, end-to-end machine learning platform designed to manage production-scale AI/ML workloads. It provides a unified ecosyst | — | 0 |

## Use Notes

This catalog supports technical discovery, not a model-risk assessment, security certification, license review, privacy assessment, or production-readiness decision. Before adopting a project, review its current documentation, model and dataset licenses, hardware requirements, data-handling terms, safety and evaluation methodology, deployment model, maintenance activity, and compatibility with the intended system. Only conduct red-team testing on systems you own or are explicitly authorized to assess. [1]

*Stars are the counts recorded in the attached dataset, not live GitHub values.*

## References

[1]: repo_showcase_merged.json (user-supplied repository dataset, analyzed August 19, 2026)

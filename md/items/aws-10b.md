# AWS Certified AI Practitioner (AIF-C01) Comprehensive Study Guide 2026

## Table of Contents
1. [Exam Overview](#exam-overview)
2. [Exam Domains & Weights](#exam-domains--weights)
3. [High-Frequency Topics](#high-frequency-topics)
4. [Practice Questions - Ordering (20 Questions)](#practice-questions---ordering)
5. [Practice Questions - Matching (20 Questions)](#practice-questions---matching)
6. [Practice Questions - Scenario-Based (20 Questions)](#practice-questions---scenario-based)
7. [Exam-Taking Strategies](#exam-taking-strategies)
8. [Recommended Resources](#recommended-resources)

---

## Exam Overview

| Attribute | Details |
|-----------|---------|
| **Exam Code** | AIF-C01 |
| **Format** | 65 questions (50 scored, 15 unscored) |
| **Time Limit** | 90-120 minutes |
| **Passing Score** | 700/1000 |
| **Cost** | $75 USD |
| **Validity** | 3 years |
| **Question Types** | Multiple choice, multiple response, ordering, matching |

---

## Exam Domains & Weights

| Domain | Weight | Key Topics |
|--------|--------|------------|
| **Domain 1: Fundamentals of AI and ML** | 20% | AI/ML concepts, machine learning types, neural networks, deep learning |
| **Domain 2: Fundamentals of Generative AI** | 24% | Foundation models, transformers, diffusion models, prompt engineering |
| **Domain 3: Applications of Foundation Models** | 28% | Amazon Bedrock, RAG, fine-tuning, model evaluation, agents |
| **Domain 4: Responsible AI** | 14% | Fairness, bias, transparency, safety, governance |
| **Domain 5: Security, Compliance & Governance** | 14% | Data privacy, encryption, shared responsibility, compliance |

---

## High-Frequency Topics

### Amazon Bedrock (Highest Priority)
- Foundation models (Claude, Llama, Titan, Jurassic, Command)
- Knowledge Bases for RAG
- Agents for multi-step tasks
- Guardrails for responsible AI
- Fine-tuning capabilities
- Model evaluation
- Inference parameters (temperature, top-p, top-k, max tokens)

### Prompt Engineering
- Zero-shot prompting
- Few-shot prompting
- Chain-of-thought prompting
- System prompts vs user prompts
- Prompt templates
- Context window management

### AWS AI Services
- Amazon Rekognition (image/video analysis)
- Amazon Comprehend (NLP, sentiment analysis)
- Amazon Textract (document processing)
- Amazon Polly (text-to-speech)
- Amazon Lex (chatbots)
- Amazon Transcribe (speech-to-text)
- Amazon Kendra (enterprise search)
- Amazon Personalize (recommendations)
- Amazon SageMaker (ML platform)

### RAG (Retrieval-Augmented Generation)
- Vector embeddings
- Vector stores (OpenSearch, Pinecone, pgvector)
- Chunking strategies
- Similarity search
- Context injection

### Evaluation Metrics
- BLEU, ROUGE, BERTScore (text generation)
- Precision, Recall, F1 (classification)
- RMSE, MAE (regression)
- Human evaluation
- Benchmark datasets

### Responsible AI
- Fairness dimensions (demographic parity, equalized odds)
- Bias detection (Amazon SageMaker Clarify)
- Explainability (SHAP, LIME)
- Safety and robustness
- Privacy (differential privacy, PII protection)

### MLOps
- Model monitoring
- Data drift detection
- Model retraining pipelines
- SageMaker Model Monitor
- SageMaker Pipelines

---

## Practice Questions - Ordering

### Ordering Question 1: ML Pipeline Stages
**Question:** Arrange the following machine learning pipeline stages in the correct order:

Options:
1. Feature engineering
2. Model deployment
3. Data collection
4. Model training
5. Problem formulation
6. Model evaluation

**Correct Order:** 5 -> 3 -> 1 -> 4 -> 6 -> 2

**Explanation:** The standard ML pipeline follows this sequence: First, define the problem (5). Then collect relevant data (3). Next, engineer features from raw data (1). Train the model on prepared data (4). Evaluate model performance (6). Finally, deploy to production (2).

**Domain:** Domain 1: Fundamentals of AI and ML

**Why wrong answers are wrong:** Any sequence that places training before feature engineering, evaluation before training, or deployment before evaluation violates the logical dependencies of the ML workflow.

---

### Ordering Question 2: RAG Implementation Steps
**Question:** Arrange the following steps for implementing a RAG solution on Amazon Bedrock:

Options:
1. Create vector store
2. Load documents
3. Query foundation model
4. Retrieve relevant chunks
5. Generate embeddings
6. Store embeddings

**Correct Order:** 2 -> 5 -> 6 -> 1 -> 4 -> 3

**Explanation:** RAG workflow: First load documents (2), then generate embeddings (5), store them in vector store (6), create the vector store (1), retrieve relevant chunks during query (4), and finally query the foundation model with context (3).

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Embeddings must be generated before storage, retrieval happens before querying the model, and documents must be loaded before embeddings can be generated.

---

### Ordering Question 3: Transformer Architecture Data Flow
**Question:** Arrange the following components in the order data flows through a transformer encoder:

Options:
1. Multi-head attention
2. Feed-forward network
3. Input embeddings
4. Layer normalization
5. Positional encoding

**Correct Order:** 3 -> 5 -> 1 -> 4 -> 2 -> 4

**Explanation:** Data flows: Input embeddings (3) -> Positional encoding (5) -> Multi-head attention (1) -> Layer normalization (4) -> Feed-forward network (2) -> Final layer normalization (4).

**Domain:** Domain 2: Fundamentals of Generative AI

**Why wrong answers are wrong:** Positional encoding must follow embeddings, attention comes before feed-forward, and normalization appears twice in the encoder block.

---

### Ordering Question 4: Fine-Tuning Workflow
**Question:** Arrange the following steps for fine-tuning a foundation model on Amazon Bedrock:

Options:
1. Prepare training data
2. Select base model
3. Evaluate fine-tuned model
4. Create custom model
5. Deploy custom model
6. Configure hyperparameters

**Correct Order:** 2 -> 1 -> 6 -> 4 -> 3 -> 5

**Explanation:** Fine-tuning workflow: Select base model (2), prepare training data (1), configure hyperparameters (6), create custom model (4), evaluate performance (3), then deploy (5).

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Base model must be selected before data preparation, evaluation must happen before deployment, and hyperparameters are configured before creating the custom model.

---

### Ordering Question 5: Responsible AI Development Lifecycle
**Question:** Arrange the following steps in the responsible AI development lifecycle:

Options:
1. Define fairness metrics
2. Deploy with monitoring
3. Identify stakeholders
4. Conduct bias testing
5. Document model cards
6. Establish governance policies

**Correct Order:** 3 -> 6 -> 1 -> 4 -> 5 -> 2

**Explanation:** Responsible AI lifecycle: Identify stakeholders (3), establish governance (6), define fairness metrics (1), conduct bias testing (4), document model cards (5), deploy with monitoring (2).

**Domain:** Domain 4: Responsible AI

**Why wrong answers are wrong:** Governance must be established before testing, metrics must be defined before testing, and documentation comes before deployment.

---

### Ordering Question 6: Prompt Engineering Iteration
**Question:** Arrange the following steps for iterative prompt engineering:

Options:
1. Analyze outputs
2. Deploy to production
3. Design initial prompt
4. Test with sample inputs
5. Refine based on results
6. Evaluate against criteria

**Correct Order:** 3 -> 4 -> 1 -> 6 -> 5 -> 2

**Explanation:** Prompt engineering iteration: Design initial prompt (3), test with samples (4), analyze outputs (1), evaluate against criteria (6), refine based on results (5), deploy to production (2).

**Domain:** Domain 2: Fundamentals of Generative AI

**Why wrong answers are wrong:** Analysis must follow testing, evaluation comes before refinement, and deployment is the final step.

---

### Ordering Question 7: Security Implementation Layers
**Question:** Arrange the following security layers from most external to most internal:

Options:
1. Application layer authentication
2. Network security groups
3. Data encryption at rest
4. IAM role permissions
5. VPC isolation
6. Data masking

**Correct Order:** 2 -> 5 -> 4 -> 1 -> 6 -> 3

**Explanation:** Security layers (external to internal): Network security groups (2), VPC isolation (5), IAM permissions (4), application authentication (1), data masking (6), encryption at rest (3).

**Domain:** Domain 5: Security, Compliance & Governance

**Why wrong answers are wrong:** Network controls are outermost, IAM is before application layer, and encryption is the innermost protection.

---

### Ordering Question 8: MLOps Model Monitoring Lifecycle
**Question:** Arrange the following MLOps monitoring activities in operational order:

Options:
1. Set up alerts
2. Collect baseline metrics
3. Detect data drift
4. Schedule retraining
5. Trigger investigation
6. Define monitoring scope

**Correct Order:** 6 -> 2 -> 1 -> 3 -> 5 -> 4

**Explanation:** Monitoring lifecycle: Define scope (6), collect baselines (2), set up alerts (1), detect drift (3), trigger investigation (5), schedule retraining (4).

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Baselines must be collected before drift detection, alerts must be set before drift detection, and retraining is the response to drift.

---

### Ordering Question 9: Data Preparation Pipeline
**Question:** Arrange the following data preparation steps in proper order:

Options:
1. Handle missing values
2. Feature scaling
3. Data validation
4. Data ingestion
5. Outlier treatment
6. Feature encoding

**Correct Order:** 4 -> 3 -> 1 -> 5 -> 6 -> 2

**Explanation:** Data preparation: Ingest data (4), validate quality (3), handle missing values (1), treat outliers (5), encode categorical features (6), scale numerical features (2).

**Domain:** Domain 1: Fundamentals of AI and ML

**Why wrong answers are wrong:** Validation follows ingestion, cleaning happens before encoding/scaling, and scaling is typically last.

---

### Ordering Question 10: LLM Inference Parameters Priority
**Question:** Arrange the following inference parameters by their typical adjustment priority for response creativity:

Options:
1. Temperature
2. Top-p (nucleus sampling)
3. Max tokens
4. Top-k
5. Stop sequences

**Correct Order:** 3 -> 1 -> 2 -> 4 -> 5

**Explanation:** Priority order: Max tokens (3) defines output length first, Temperature (1) controls randomness, Top-p (2) refines sampling, Top-k (4) limits token choices, Stop sequences (5) are last.

**Domain:** Domain 2: Fundamentals of Generative AI

**Why wrong answers are wrong:** Max tokens is foundational, temperature is the primary creativity control, and stop sequences are least important for creativity.

---

### Ordering Question 11: SageMaker Model Deployment Steps
**Question:** Arrange the following steps for deploying a model on Amazon SageMaker:

Options:
1. Create endpoint configuration
2. Upload model artifacts
3. Create SageMaker model
4. Deploy endpoint
5. Test endpoint
6. Configure auto-scaling

**Correct Order:** 2 -> 3 -> 1 -> 4 -> 5 -> 6

**Explanation:** Deployment workflow: Upload model artifacts (2), create SageMaker model (3), create endpoint config (1), deploy endpoint (4), test endpoint (5), configure auto-scaling (6).

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Model artifacts must be uploaded before model creation, endpoint config precedes deployment, and testing comes before production scaling.

---

### Ordering Question 12: Knowledge Base Creation Steps
**Question:** Arrange the following steps for creating an Amazon Bedrock Knowledge Base:

Options:
1. Choose vector store
2. Configure data source
3. Set embedding model
4. Create knowledge base
5. Sync data source
6. Test retrieval

**Correct Order:** 1 -> 3 -> 2 -> 4 -> 5 -> 6

**Explanation:** Knowledge base creation: Choose vector store (1), set embedding model (3), configure data source (2), create knowledge base (4), sync data (5), test retrieval (6).

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Vector store selection precedes embedding model, data source configuration happens before creation, and testing is final.

---

### Ordering Question 13: Bias Detection Workflow
**Question:** Arrange the following steps for conducting bias detection with Amazon SageMaker Clarify:

Options:
1. Define sensitive attributes
2. Configure analysis job
3. Run Clarify processing
4. Review bias report
5. Define fairness metrics
6. Take remediation actions

**Correct Order:** 1 -> 5 -> 2 -> 3 -> 4 -> 6

**Explanation:** Bias detection: Define sensitive attributes (1), define fairness metrics (5), configure analysis job (2), run processing (3), review report (4), take remediation actions (6).

**Domain:** Domain 4: Responsible AI

**Why wrong answers are wrong:** Sensitive attributes must be defined before metrics, job configuration precedes running, and remediation follows analysis.

---

### Ordering Question 14: Document Processing with Textract
**Question:** Arrange the following steps for processing documents with Amazon Textract:

Options:
1. Upload document to S3
2. Call Textract API
3. Receive JSON response
4. Parse structured data
5. Extract key-value pairs
6. Store processed results

**Correct Order:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

**Explanation:** Textract workflow: Upload to S3 (1), call API (2), receive response (3), parse data (4), extract key-values (5), store results (6).

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Document must be in S3 before API call, parsing follows receiving response, and storage is final.

---

### Ordering Question 15: Transfer Learning Stages
**Question:** Arrange the following stages of transfer learning implementation:

Options:
1. Select pre-trained model
2. Freeze base layers
3. Add custom layers
4. Train on new dataset
5. Fine-tune selected layers
6. Evaluate on test set

**Correct Order:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

**Explanation:** Transfer learning: Select pre-trained model (1), freeze base layers (2), add custom layers (3), train on new data (4), fine-tune selected layers (5), evaluate (6).

**Domain:** Domain 1: Fundamentals of AI and ML

**Why wrong answers are wrong:** Base layers are frozen before adding custom layers, training precedes fine-tuning, and evaluation is last.

---

### Ordering Question 16: Multi-Modal Model Data Processing
**Question:** Arrange the following data processing steps for a multi-modal model:

Options:
1. Text tokenization
2. Image resizing
3. Text embedding generation
4. Image normalization
5. Feature fusion
6. Multi-modal alignment

**Correct Order:** 2 -> 4 -> 1 -> 3 -> 6 -> 5

**Explanation:** Multi-modal processing: Image resizing (2), image normalization (4), text tokenization (1), text embedding (3), multi-modal alignment (6), feature fusion (5).

**Domain:** Domain 2: Fundamentals of Generative AI

**Why wrong answers are wrong:** Image preprocessing is separate from text, embeddings follow tokenization, and alignment precedes fusion.

---

### Ordering Question 17: Generative AI Project Lifecycle
**Question:** Arrange the following phases of a generative AI project:

Options:
1. Proof of concept
2. Production deployment
3. Requirements gathering
4. Model selection
5. Prompt engineering
6. Performance optimization

**Correct Order:** 3 -> 4 -> 1 -> 5 -> 6 -> 2

**Explanation:** Project lifecycle: Requirements gathering (3), model selection (4), proof of concept (1), prompt engineering (5), performance optimization (6), production deployment (2).

**Domain:** Domain 2: Fundamentals of Generative AI

**Why wrong answers are wrong:** Requirements come first, POC precedes prompt engineering, optimization comes before production.

---

### Ordering Question 18: Security Incident Response
**Question:** Arrange the following security incident response steps:

Options:
1. Identify incident
2. Contain threat
3. Eradicate cause
4. Recover systems
5. Post-incident analysis
6. Notify stakeholders

**Correct Order:** 1 -> 2 -> 3 -> 4 -> 6 -> 5

**Explanation:** Incident response: Identify (1), contain (2), eradicate (3), recover (4), notify stakeholders (6), post-incident analysis (5).

**Domain:** Domain 5: Security, Compliance & Governance

**Why wrong answers are wrong:** Identification is first, containment precedes eradication, and analysis is last after notification.

---

### Ordering Question 19: Vector Database Operations
**Question:** Arrange the following vector database operations for RAG:

Options:
1. Create index
2. Insert vectors
3. Define schema
4. Query with vector
5. Calculate similarity
6. Return top-k results

**Correct Order:** 3 -> 1 -> 2 -> 4 -> 5 -> 6

**Explanation:** Vector DB operations: Define schema (3), create index (1), insert vectors (2), query with vector (4), calculate similarity (5), return top-k (6).

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Schema definition is first, indexing precedes insertion, similarity calculation precedes returning results.

---

### Ordering Question 20: ML Model Evaluation Hierarchy
**Question:** Arrange the following evaluation approaches from simplest to most comprehensive:

Options:
1. Holdout validation
2. Cross-validation
3. Bootstrap sampling
4. Train-test split
5. Time-series split
6. Nested cross-validation

**Correct Order:** 4 -> 1 -> 2 -> 5 -> 3 -> 6

**Explanation:** Evaluation hierarchy: Train-test split (4), holdout validation (1), cross-validation (2), time-series split (5), bootstrap sampling (3), nested cross-validation (6).

**Domain:** Domain 1: Fundamentals of AI and ML

**Why wrong answers are wrong:** Train-test is simplest, nested CV is most complex, time-series is for temporal data.

---

## Practice Questions - Matching

### Matching Question 1: AWS AI Services to Use Cases
**Question:** Match each AWS AI service with its primary use case.

**Column A (Service):**
1. Amazon Rekognition
2. Amazon Comprehend
3. Amazon Textract
4. Amazon Polly
5. Amazon Lex
6. Amazon Transcribe

**Column B (Use Case):**
A. Extract text and data from scanned documents
B. Build conversational interfaces and chatbots
C. Convert text to lifelike speech
D. Analyze images and videos for objects, faces, scenes
E. Convert speech to text
F. Natural language processing and sentiment analysis

**Correct Matches:**
1-D, 2-F, 3-A, 4-C, 5-B, 6-E

**Explanation:** 
- Rekognition (1) is for image/video analysis (D)
- Comprehend (2) is for NLP and sentiment (F)
- Textract (3) extracts text from documents (A)
- Polly (4) is text-to-speech (C)
- Lex (5) builds chatbots (B)
- Transcribe (6) is speech-to-text (E)

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Each service has a distinct primary purpose. Confusing them would mean misunderstanding their core capabilities.

---

### Matching Question 2: Inference Parameters to Effects
**Question:** Match each inference parameter with its primary effect on model output.

**Column A (Parameter):**
1. Temperature
2. Top-p (nucleus sampling)
3. Top-k
4. Max tokens
5. Stop sequences

**Column B (Effect):**
A. Limits the number of tokens the model can generate
B. Controls randomness; higher values = more creative/diverse
C. Stops generation when specific sequences appear
D. Considers only the top probability tokens until cumulative probability reaches threshold
E. Considers only the top k most likely tokens

**Correct Matches:**
1-B, 2-D, 3-E, 4-A, 5-C

**Explanation:**
- Temperature (1) controls randomness (B)
- Top-p (2) uses nucleus sampling (D)
- Top-k (3) limits to k tokens (E)
- Max tokens (4) limits output length (A)
- Stop sequences (5) halt generation (C)

**Domain:** Domain 2: Fundamentals of Generative AI

**Why wrong answers are wrong:** Each parameter has a distinct function. Temperature is not about length, max tokens is not about creativity.

---

### Matching Question 3: ML Types to Descriptions
**Question:** Match each machine learning type with its description.

**Column A (ML Type):**
1. Supervised learning
2. Unsupervised learning
3. Reinforcement learning
4. Semi-supervised learning
5. Self-supervised learning

**Column B (Description):**
A. Agent learns by interacting with environment and receiving rewards
B. Learns from labeled training data with input-output pairs
C. Learns from unlabeled data to find patterns and structures
D. Uses mostly unlabeled data with some labeled examples
E. Creates labels from the data itself without human annotation

**Correct Matches:**
1-B, 2-C, 3-A, 4-D, 5-E

**Explanation:**
- Supervised (1) uses labeled data (B)
- Unsupervised (2) finds patterns in unlabeled data (C)
- Reinforcement (3) uses environment interaction (A)
- Semi-supervised (4) combines labeled and unlabeled (D)
- Self-supervised (5) generates labels from data (E)

**Domain:** Domain 1: Fundamentals of AI and ML

**Why wrong answers are wrong:** Each type has distinct data requirements and learning approaches.

---

### Matching Question 4: Evaluation Metrics to Use Cases
**Question:** Match each evaluation metric with its primary use case.

**Column A (Metric):**
1. BLEU
2. ROUGE
3. BERTScore
4. Precision
5. Recall
6. F1 Score

**Column B (Use Case):**
A. Evaluate text summarization quality
B. Evaluate machine translation quality
C. Evaluate text generation using semantic similarity
D. Minimize false positives in classification
E. Minimize false negatives in classification
F. Balance precision and recall

**Correct Matches:**
1-B, 2-A, 3-C, 4-D, 5-E, 6-F

**Explanation:**
- BLEU (1) for translation (B)
- ROUGE (2) for summarization (A)
- BERTScore (3) for semantic similarity (C)
- Precision (4) minimizes false positives (D)
- Recall (5) minimizes false negatives (E)
- F1 (6) balances both (F)

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Each metric is designed for specific evaluation scenarios.

---

### Matching Question 5: Responsible AI Principles to Implementations
**Question:** Match each responsible AI principle with its implementation.

**Column A (Principle):**
1. Fairness
2. Transparency
3. Safety
4. Privacy
5. Robustness

**Column B (Implementation):**
A. Differential privacy and PII protection
B. Model cards and explainability tools
C. Bias detection and mitigation
D. Adversarial testing and fault tolerance
E. Content filtering and guardrails

**Correct Matches:**
1-C, 2-B, 3-E, 4-A, 5-D

**Explanation:**
- Fairness (1) via bias detection (C)
- Transparency (2) via model cards (B)
- Safety (3) via guardrails (E)
- Privacy (4) via differential privacy (A)
- Robustness (5) via adversarial testing (D)

**Domain:** Domain 4: Responsible AI

**Why wrong answers are wrong:** Each principle has specific implementation approaches.

---

### Matching Question 6: Bedrock Foundation Models to Strengths
**Question:** Match each Amazon Bedrock foundation model with its primary strength.

**Column A (Model):**
1. Amazon Titan
2. Claude (Anthropic)
3. Llama (Meta)
4. Jurassic (AI21 Labs)
5. Command (Cohere)

**Column B (Strength):**
A. Long context window and reasoning
B. Open-source, cost-effective for various tasks
C. Text generation and classification
D. Instruction following and safety
E. Enterprise-grade text generation

**Correct Matches:**
1-D, 2-A, 3-B, 4-C, 5-E

**Explanation:**
- Titan (1) for instruction following (D)
- Claude (2) for long context (A)
- Llama (3) open-source and cost-effective (B)
- Jurassic (4) for text generation (C)
- Command (5) for enterprise use (E)

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Each model has distinct strengths optimized for different use cases.

---

### Matching Question 7: Vector Store Options to Characteristics
**Question:** Match each vector store option with its characteristic.

**Column A (Vector Store):**
1. Amazon OpenSearch Serverless
2. Pinecone
3. Amazon Aurora pgvector
4. Amazon Kendra
5. Redis Enterprise Cloud

**Column B (Characteristic):**
A. Managed vector search with enterprise features
B. Cloud-native, serverless vector database
C. Vector extension for PostgreSQL
D. Enterprise search with ML-powered relevance
E. In-memory vector store for low latency

**Correct Matches:**
1-A, 2-B, 3-C, 4-D, 5-E

**Explanation:**
- OpenSearch (1) is managed with enterprise features (A)
- Pinecone (2) is cloud-native serverless (B)
- Aurora pgvector (3) is PostgreSQL extension (C)
- Kendra (4) is enterprise search (D)
- Redis (5) is in-memory low latency (E)

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Each vector store has distinct architectural characteristics.

---

### Matching Question 8: Prompt Engineering Techniques to Applications
**Question:** Match each prompt engineering technique with its application.

**Column A (Technique):**
1. Zero-shot prompting
2. Few-shot prompting
3. Chain-of-thought prompting
4. System prompting
5. Role-based prompting

**Column B (Application):**
A. Provide examples to guide model behavior
B. No examples provided, rely on pre-trained knowledge
C. Step-by-step reasoning to improve accuracy
D. Set overall context and constraints
E. Define persona for consistent tone/style

**Correct Matches:**
1-B, 2-A, 3-C, 4-D, 5-E

**Explanation:**
- Zero-shot (1) uses no examples (B)
- Few-shot (2) provides examples (A)
- Chain-of-thought (3) uses step-by-step (C)
- System (4) sets context (D)
- Role-based (5) defines persona (E)

**Domain:** Domain 2: Fundamentals of Generative AI

**Why wrong answers are wrong:** Each technique has a specific purpose and application.

---

### Matching Question 9: MLOps Components to Functions
**Question:** Match each MLOps component with its function.

**Column A (Component):**
1. Amazon SageMaker Model Monitor
2. Amazon SageMaker Pipelines
3. Amazon SageMaker Clarify
4. Amazon SageMaker Model Registry
5. Amazon SageMaker Feature Store

**Column B (Function):**
A. Detect bias and explain model predictions
B. Orchestrate end-to-end ML workflows
C. Monitor model quality and data drift in production
D. Manage model versions and lineage
E. Store, share, and reuse features across teams

**Correct Matches:**
1-C, 2-B, 3-A, 4-D, 5-E

**Explanation:**
- Model Monitor (1) for production monitoring (C)
- Pipelines (2) for workflow orchestration (B)
- Clarify (3) for bias detection (A)
- Model Registry (4) for version management (D)
- Feature Store (5) for feature sharing (E)

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Each component has a distinct function in the MLOps lifecycle.

---

### Matching Question 10: Security Controls to Layers
**Question:** Match each security control with the layer it primarily protects.

**Column A (Control):**
1. IAM roles and policies
2. VPC security groups
3. AWS KMS encryption
4. AWS WAF
5. AWS CloudTrail

**Column B (Layer):**
A. Application layer
B. Data layer
C. Identity and access layer
D. Network layer
E. Audit and compliance layer

**Correct Matches:**
1-C, 2-D, 3-B, 4-A, 5-E

**Explanation:**
- IAM (1) for identity layer (C)
- Security groups (2) for network layer (D)
- KMS (3) for data layer (B)
- WAF (4) for application layer (A)
- CloudTrail (5) for audit layer (E)

**Domain:** Domain 5: Security, Compliance & Governance

**Why wrong answers are wrong:** Each security control operates at a specific layer of the security stack.

---

### Matching Question 11: Neural Network Components to Functions
**Question:** Match each neural network component with its function.

**Column A (Component):**
1. Neuron
2. Activation function
3. Loss function
4. Optimizer
5. Backpropagation

**Column B (Function):**
A. Calculate the error between prediction and actual
B. Basic unit that receives input and produces output
C. Introduce non-linearity to the model
D. Update weights to minimize loss
E. Algorithm to calculate gradients for weight updates

**Correct Matches:**
1-B, 2-C, 3-A, 4-D, 5-E

**Explanation:**
- Neuron (1) is the basic unit (B)
- Activation (2) introduces non-linearity (C)
- Loss (3) calculates error (A)
- Optimizer (4) updates weights (D)
- Backpropagation (5) calculates gradients (E)

**Domain:** Domain 1: Fundamentals of AI and ML

**Why wrong answers are wrong:** Each component has a specific mathematical function.

---

### Matching Question 12: Data Drift Types to Descriptions
**Question:** Match each data drift type with its description.

**Column A (Drift Type):**
1. Data drift (covariate shift)
2. Concept drift
3. Label drift
4. Feature drift

**Column B (Description):**
A. Distribution of features changes over time
B. Relationship between features and labels changes
C. Distribution of labels changes
D. Specific feature distributions change independently

**Correct Matches:**
1-A, 2-B, 3-C, 4-D

**Explanation:**
- Data drift (1) is feature distribution change (A)
- Concept drift (2) is feature-label relationship change (B)
- Label drift (3) is label distribution change (C)
- Feature drift (4) is specific feature changes (D)

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Each drift type has a distinct definition and impact.

---

### Matching Question 13: Transformer Architecture Components
**Question:** Match each transformer component with its description.

**Column A (Component):**
1. Self-attention mechanism
2. Multi-head attention
3. Positional encoding
4. Layer normalization
5. Feed-forward network

**Column B (Description):**
A. Parallel attention heads capturing different relationships
B. Allows tokens to attend to all other tokens in sequence
C. Adds position information to token embeddings
D. Stabilizes and accelerates training
E. Non-linear transformation of attended representations

**Correct Matches:**
1-B, 2-A, 3-C, 4-D, 5-E

**Explanation:**
- Self-attention (1) allows token-to-token attention (B)
- Multi-head (2) uses parallel heads (A)
- Positional encoding (3) adds position info (C)
- Layer norm (4) stabilizes training (D)
- Feed-forward (5) is non-linear transformation (E)

**Domain:** Domain 2: Fundamentals of Generative AI

**Why wrong answers are wrong:** Each component has a specific architectural purpose.

---

### Matching Question 14: AWS AI Service Features to Services
**Question:** Match each feature with the AWS AI service that provides it.

**Column A (Feature):**
1. Real-time face detection
2. Custom entity recognition
3. Document table extraction
4. Neural text-to-speech
5. Automatic speech recognition

**Column B (Service):**
A. Amazon Rekognition
B. Amazon Comprehend
C. Amazon Textract
D. Amazon Polly
E. Amazon Transcribe

**Correct Matches:**
1-A, 2-B, 3-C, 4-D, 5-E

**Explanation:**
- Face detection (1) by Rekognition (A)
- Custom entities (2) by Comprehend (B)
- Table extraction (3) by Textract (C)
- Neural TTS (4) by Polly (D)
- Speech recognition (5) by Transcribe (E)

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Each feature is specific to a particular service.

---

### Matching Question 15: Fine-Tuning Strategies to Use Cases
**Question:** Match each fine-tuning strategy with its use case.

**Column A (Strategy):**
1. Full fine-tuning
2. Parameter-efficient fine-tuning (PEFT)
3. Instruction fine-tuning
4. Domain adaptation
5. Task-specific fine-tuning

**Column B (Use Case):**
A. Update all model parameters for maximum performance
B. Update only a small subset of parameters to save resources
C. Train model to follow specific instructions
D. Adapt model to a specific industry domain
E. Optimize model for a single specific task

**Correct Matches:**
1-A, 2-B, 3-C, 4-D, 5-E

**Explanation:**
- Full fine-tuning (1) updates all parameters (A)
- PEFT (2) updates subset for efficiency (B)
- Instruction (3) for following instructions (C)
- Domain adaptation (4) for industry domains (D)
- Task-specific (5) for single tasks (E)

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Each strategy serves a different resource and performance trade-off.

---

### Matching Question 16: LLM Evaluation Approaches to Methods
**Question:** Match each evaluation approach with its method.

**Column A (Approach):**
1. Automatic evaluation
2. Human evaluation
3. Benchmark evaluation
4. A/B testing
5. Red teaming

**Column B (Method):**
A. Compare model outputs to reference using metrics
B. Human judges rate quality, relevance, safety
C. Test on standardized datasets with established metrics
D. Compare two model versions with real users
E. Adversarial testing to find vulnerabilities

**Correct Matches:**
1-A, 2-B, 3-C, 4-D, 5-E

**Explanation:**
- Automatic (1) uses metrics comparison (A)
- Human (2) uses human judges (B)
- Benchmark (3) uses standardized datasets (C)
- A/B testing (4) compares with real users (D)
- Red teaming (5) is adversarial testing (E)

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Each approach has a distinct methodology.

---

### Matching Question 17: Data Privacy Techniques to Descriptions
**Question:** Match each data privacy technique with its description.

**Column A (Technique):**
1. Differential privacy
2. Data anonymization
3. Tokenization
4. Encryption at rest
5. PII detection and masking

**Column B (Description):**
A. Replace sensitive data with non-sensitive tokens
B. Add statistical noise to query results to protect individuals
C. Remove or generalize identifying information
D. Encrypt data when stored
E. Identify and redact personally identifiable information

**Correct Matches:**
1-B, 2-C, 3-A, 4-D, 5-E

**Explanation:**
- Differential privacy (1) adds noise (B)
- Anonymization (2) removes identifiers (C)
- Tokenization (3) replaces with tokens (A)
- Encryption at rest (4) encrypts stored data (D)
- PII masking (5) redacts PII (E)

**Domain:** Domain 5: Security, Compliance & Governance

**Why wrong answers are wrong:** Each technique has a distinct mechanism for protecting privacy.

---

### Matching Question 18: Model Deployment Patterns to Characteristics
**Question:** Match each deployment pattern with its characteristic.

**Column A (Pattern):**
1. Real-time inference
2. Batch inference
3. Asynchronous inference
4. Multi-model endpoints
5. Edge deployment

**Column B (Characteristic):**
A. Low latency for individual predictions
B. Process large datasets on schedule
C. Queue-based for large payloads
D. Host multiple models on single endpoint
E. Deploy model to edge devices

**Correct Matches:**
1-A, 2-B, 3-C, 4-D, 5-E

**Explanation:**
- Real-time (1) for low latency (A)
- Batch (2) for scheduled large datasets (B)
- Asynchronous (3) queue-based (C)
- Multi-model (4) multiple models on one endpoint (D)
- Edge (5) deploy to devices (E)

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:** Each pattern serves different latency, throughput, and infrastructure requirements.

---

### Matching Question 19: Prompt Injection Types to Descriptions
**Question:** Match each prompt injection type with its description.

**Column A (Type):**
1. Direct prompt injection
2. Indirect prompt injection
3. Jailbreaking
4. Prompt leaking
5. Training data extraction

**Column B (Description):**
A. Attacker embeds malicious instructions in external data
B. Attacker directly inputs malicious instructions
C. Convincing model to ignore safety guidelines
D. Tricking model into revealing parts of its system prompt
E. Extracting training data through carefully crafted prompts

**Correct Matches:**
1-B, 2-A, 3-C, 4-D, 5-E

**Explanation:**
- Direct (1) is direct malicious input (B)
- Indirect (2) embeds in external data (A)
- Jailbreaking (3) bypasses safety (C)
- Prompt leaking (4) reveals system prompt (D)
- Data extraction (5) extracts training data (E)

**Domain:** Domain 5: Security, Compliance & Governance

**Why wrong answers are wrong:** Each type has a distinct attack vector and methodology.

---

### Matching Question 20: AWS Compliance Frameworks to Focus Areas
**Question:** Match each compliance framework with its focus area.

**Column A (Framework):**
1. GDPR
2. HIPAA
3. SOC 2
4. ISO 27001
5. PCI DSS

**Column B (Focus Area):**
A. Healthcare data protection
B. Payment card data security
C. Data privacy for EU residents
D. General security management
E. Service organization controls

**Correct Matches:**
1-C, 2-A, 3-E, 4-D, 5-B

**Explanation:**
- GDPR (1) is EU privacy (C)
- HIPAA (2) is healthcare (A)
- SOC 2 (3) is service org controls (E)
- ISO 27001 (4) is security management (D)
- PCI DSS (5) is payment card security (B)

**Domain:** Domain 5: Security, Compliance & Governance

**Why wrong answers are wrong:** Each framework has a specific scope and regulatory focus.

---

## Practice Questions - Scenario-Based

### Scenario Question 1: Customer Service Chatbot
**Scenario:** A retail company wants to build a customer service chatbot that can handle order inquiries, process returns, and provide product recommendations. The chatbot needs to understand customer intent, access order history from a database, and generate natural responses.

**Question:** Which combination of AWS services would be most appropriate for this solution?

A. Amazon Lex + Amazon Kendra + Amazon Personalize + Amazon Bedrock

B. Amazon Transcribe + Amazon Polly + Amazon Comprehend + SageMaker

C. Amazon Rekognition + Amazon Textract + Amazon Lex + DynamoDB

D. Amazon Connect + Amazon QuickSight + Amazon EMR + Amazon Athena

**Correct Answer:** A

**Explanation:** Amazon Lex provides the conversational interface, Amazon Kendra enables intelligent search across order history documents, Amazon Personalize generates product recommendations, and Amazon Bedrock provides the foundation model for natural response generation. This combination addresses all requirements: intent understanding, database access, and natural language generation.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B focuses on speech services and general ML, not conversational AI
- C focuses on image/document processing, not chatbot functionality
- D focuses on analytics and BI, not conversational interfaces

---

### Scenario Question 2: Document Processing Pipeline
**Scenario:** A financial services company needs to process thousands of loan application documents daily. The documents contain various forms, tables, and handwritten notes. They need to extract structured data, identify key fields (income, employment, credit score), and flag potentially fraudulent applications.

**Question:** Which AWS service combination would best address these requirements?

A. Amazon Textract + Amazon Comprehend + Amazon Fraud Detector

B. Amazon Rekognition + Amazon SageMaker + Amazon Kinesis

C. Amazon Athena + Amazon QuickSight + Amazon Redshift

D. Amazon EMR + Apache Spark + Amazon S3

**Correct Answer:** A

**Explanation:** Amazon Textract extracts text and structured data from documents including tables and forms. Amazon Comprehend performs NLP analysis to identify entities like income and employment. Amazon Fraud Detector analyzes the extracted data to flag suspicious applications. This combination specifically addresses document processing, entity extraction, and fraud detection.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B focuses on image processing and streaming, not document processing
- C is for analytics and BI, not document extraction
- D is for big data processing, not document-specific extraction

---

### Scenario Question 3: Multilingual Content Creation
**Scenario:** A global marketing team needs to create content in 12 languages. They want to generate blog posts, social media content, and product descriptions while maintaining brand voice and tone consistency across all languages.

**Question:** Which approach using Amazon Bedrock would be most effective?

A. Use Amazon Translate for all content generation

B. Use a single foundation model with language-specific system prompts and few-shot examples

C. Train 12 separate custom models for each language

D. Use Amazon Polly to generate spoken content in all languages

**Correct Answer:** B

**Explanation:** Using a single foundation model (like Claude or Titan) with language-specific system prompts and few-shot examples allows maintaining consistent brand voice across languages. System prompts can define brand guidelines, while few-shot examples in each language demonstrate the desired tone. This is more efficient and consistent than training separate models.

**Domain:** Domain 2: Fundamentals of Generative AI

**Why wrong answers are wrong:**
- A is for translation, not content generation
- C is unnecessarily expensive and complex
- D is for text-to-speech, not content creation

---

### Scenario Question 4: Bias Detection in Hiring Model
**Scenario:** An HR department has developed a machine learning model to screen resumes and rank candidates. They want to ensure the model doesn't discriminate based on gender or ethnicity. They need to analyze the model's predictions across different demographic groups.

**Question:** Which AWS service and approach should they use?

A. Amazon SageMaker Clarify with bias detection analysis

B. Amazon Rekognition with face analysis

C. Amazon Comprehend with sentiment analysis

D. Amazon Athena with SQL queries on candidate data

**Correct Answer:** A

**Explanation:** Amazon SageMaker Clarify provides built-in bias detection capabilities that can analyze model predictions across different demographic groups. It can measure metrics like disparate impact, demographic parity, and equalized odds to identify potential bias in hiring decisions. Clarify also provides explainability features to understand model decisions.

**Domain:** Domain 4: Responsible AI

**Why wrong answers are wrong:**
- B is for image analysis, not model bias detection
- C is for text sentiment, not bias analysis
- D is for data querying, not bias measurement

---

### Scenario Question 5: RAG Implementation for Financial Reports
**Scenario:** A financial analyst team needs to build a system that can answer questions about 10 years of annual reports and SEC filings. The system needs to provide accurate, source-cited answers and handle complex queries about financial trends and comparisons.

**Question:** Which architecture would be most appropriate using Amazon Bedrock?

A. Direct prompting of a foundation model with the full documents in context

B. Amazon Bedrock Knowledge Bases with OpenSearch Serverless vector store

C. Amazon Kendra with custom ranking algorithms

D. Amazon Redshift with SQL queries on structured data

**Correct Answer:** B

**Explanation:** Amazon Bedrock Knowledge Bases with OpenSearch Serverless provides a complete RAG solution. It handles document chunking, embedding generation, vector storage, and retrieval-augmented generation. The Knowledge Bases feature automatically manages the RAG pipeline and provides source attribution for answers, which is critical for financial compliance.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- A would exceed context window limits
- C is enterprise search, not optimized for LLM RAG
- D is for structured data, not document Q&A

---

### Scenario Question 6: Real-Time Fraud Detection
**Scenario:** A payment processing company needs to detect fraudulent transactions in real-time. They need to analyze transaction patterns, device fingerprints, and behavioral biometrics to make sub-second decisions on transaction approval.

**Question:** Which AWS service combination would best meet these requirements?

A. Amazon Fraud Detector + Amazon Kinesis + Amazon DynamoDB

B. Amazon Rekognition + Amazon SageMaker + Amazon S3

C. Amazon Textract + Amazon Comprehend + Amazon Redshift

D. Amazon Personalize + Amazon Kendra + Amazon OpenSearch

**Correct Answer:** A

**Explanation:** Amazon Fraud Detector is purpose-built for real-time fraud detection with sub-second latency. Amazon Kinesis ingests real-time transaction streams, and Amazon DynamoDB provides low-latency storage for rules and model outputs. This combination is optimized for real-time decision-making at scale.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B focuses on image processing and general ML
- C focuses on document processing and analytics
- D focuses on recommendations and search

---

### Scenario Question 7: Image Moderation for Social Platform
**Scenario:** A social media platform needs to automatically moderate user-uploaded images to detect inappropriate content (violence, adult content, hate symbols). They need to process millions of images daily with high accuracy and minimal false positives.

**Question:** Which AWS service and configuration would be most appropriate?

A. Amazon Rekognition with content moderation API and custom moderation thresholds

B. Amazon SageMaker with custom image classification model

C. Amazon Comprehend with custom entity recognition

D. Amazon Textract with document analysis

**Correct Answer:** A

**Explanation:** Amazon Rekognition's content moderation API is specifically designed for detecting inappropriate content in images. It provides pre-trained models for various content categories and allows custom moderation thresholds to balance detection accuracy with false positive rates. It can process millions of images at scale with high throughput.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B requires building and training a custom model
- C is for text, not images
- D is for document text extraction

---

### Scenario Question 8: Voice-Based Customer Service
**Scenario:** A bank wants to implement a voice-based customer service system that can handle natural language conversations, understand customer queries about account balances and transactions, and provide spoken responses.

**Question:** Which AWS services should they use?

A. Amazon Connect + Amazon Lex + Amazon Polly + Amazon Transcribe

B. Amazon Alexa for Business + Amazon Echo devices

C. Amazon Chime + Amazon WorkSpaces + Amazon AppStream

D. Amazon Sumerian + Amazon GameLift + Amazon Lumberyard

**Correct Answer:** A

**Explanation:** Amazon Connect provides the contact center infrastructure, Amazon Lex powers the conversational AI, Amazon Transcribe converts customer speech to text, and Amazon Polly converts the bot's responses to natural-sounding speech. This combination creates a complete voice-based customer service solution.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B requires specific hardware and is for general voice assistance
- C is for virtual desktops and streaming
- D is for game development

---

### Scenario Question 9: Personalized Learning Platform
**Scenario:** An EdTech company wants to build a personalized learning platform that adapts content difficulty based on student performance, recommends learning resources, and generates personalized practice questions.

**Question:** Which AWS services would be most appropriate?

A. Amazon Personalize + Amazon Bedrock + Amazon Kendra

B. Amazon Rekognition + Amazon Textract + Amazon Comprehend

C. Amazon EMR + Amazon Redshift + Amazon QuickSight

D. Amazon Translate + Amazon Polly + Amazon Transcribe

**Correct Answer:** A

**Explanation:** Amazon Personalize creates personalized recommendations for learning resources based on student behavior. Amazon Bedrock can generate personalized practice questions adapted to the student's level. Amazon Kendra can provide intelligent search across educational content. This combination addresses personalization, content generation, and content discovery.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B focuses on image/document processing
- C focuses on analytics and BI
- D focuses on translation and speech services

---

### Scenario Question 10: Supply Chain Demand Forecasting
**Scenario:** A retail company needs to forecast product demand across 500 stores for the next 90 days. They need to account for seasonality, promotions, holidays, and external factors like weather.

**Question:** Which AWS service would be most appropriate for this time-series forecasting?

A. Amazon Forecast with related time series and item metadata

B. Amazon SageMaker with custom deep learning model

C. Amazon Redshift with SQL forecasting functions

D. Amazon Athena with time-series queries

**Correct Answer:** A

**Explanation:** Amazon Forecast is a fully managed service specifically designed for time-series forecasting. It automatically handles seasonality, trends, and can incorporate related time series (weather, promotions) and item metadata (store characteristics). It uses multiple algorithms and automatically selects the best model for each time series.

**Domain:** Domain 1: Fundamentals of AI and ML

**Why wrong answers are wrong:**
- B requires building and maintaining custom models
- C and D are database services, not forecasting tools

---

### Scenario Question 11: Medical Image Analysis
**Scenario:** A hospital wants to analyze medical images (X-rays, MRIs) to assist radiologists in detecting anomalies. They need high accuracy, explainability for clinical decisions, and compliance with healthcare regulations.

**Question:** Which AWS service and approach should they use?

A. Amazon SageMaker with custom medical imaging models and SageMaker Clarify for explainability

B. Amazon Rekognition with general object detection

C. Amazon Textract with document analysis

D. Amazon Comprehend with medical entity detection

**Correct Answer:** A

**Explanation:** Amazon SageMaker allows building custom medical imaging models with high accuracy. SageMaker Clarify provides model explainability, which is critical for clinical decision support. SageMaker also supports healthcare compliance requirements (HIPAA) and provides audit trails for model predictions.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B is not designed for medical imaging
- C is for document text, not medical images
- D is for text, not images

---

### Scenario Question 12: Code Generation Assistant
**Scenario:** A software development team wants to implement an AI assistant that can generate code snippets, explain existing code, and help with debugging. They need support for multiple programming languages and frameworks.

**Question:** Which Amazon Bedrock foundation model would be most appropriate?

A. Claude (Anthropic) for code generation and explanation

B. Amazon Titan for general text generation

C. Jurassic (AI21 Labs) for long-form text

D. Stable Diffusion for image generation

**Correct Answer:** A

**Explanation:** Claude (Anthropic) is particularly strong at code generation, code explanation, and technical tasks. It has been trained on extensive code repositories and can handle multiple programming languages. Its long context window is also beneficial for understanding large codebases.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B is general purpose, not specialized for code
- C is focused on text generation, not code
- D is for images, not code

---

### Scenario Question 13: PII Data Protection
**Scenario:** A company processes customer feedback forms and needs to automatically detect and redact personally identifiable information (PII) before storing the data in their data lake for analysis.

**Question:** Which AWS service combination would best address this requirement?

A. Amazon Comprehend PII detection + AWS Lambda + Amazon S3

B. Amazon Rekognition + Amazon SageMaker + Amazon Kinesis

C. Amazon Macie + Amazon Glue + Amazon Athena

D. Amazon GuardDuty + Amazon Inspector + Amazon CloudTrail

**Correct Answer:** A

**Explanation:** Amazon Comprehend's PII detection API automatically identifies PII entities (names, addresses, phone numbers, etc.) in text. AWS Lambda can orchestrate the redaction process, and Amazon S3 stores the processed data. This combination provides automated PII detection and redaction for text data.

**Domain:** Domain 5: Security, Compliance & Governance

**Why wrong answers are wrong:**
- B focuses on image processing and streaming
- C is for data cataloging and analytics
- D is for security monitoring, not PII detection

---

### Scenario Question 14: Real-Time Recommendation System
**Scenario:** An e-commerce platform wants to provide real-time product recommendations based on user browsing behavior, purchase history, and current cart contents. They need to update recommendations within milliseconds.

**Question:** Which AWS architecture would best meet these requirements?

A. Amazon Personalize with real-time interactions + Amazon ElastiCache

B. Amazon Redshift with materialized views + Amazon QuickSight

C. Amazon EMR with Spark MLlib + Amazon S3

D. Amazon Athena with federated queries + Amazon Glue

**Correct Answer:** A

**Explanation:** Amazon Personalize provides real-time recommendations based on user interactions. It can update recommendations within milliseconds as users browse. Amazon ElastiCache can cache frequently accessed item metadata for low-latency retrieval. This combination is optimized for real-time personalization.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B is for analytics and BI, not real-time recommendations
- C is for batch processing, not real-time
- D is for data querying, not recommendations

---

### Scenario Question 15: Video Content Analysis
**Scenario:** A media company wants to analyze video content to automatically generate metadata, detect scenes, recognize celebrities, and flag inappropriate content. They need to process hours of video content efficiently.

**Question:** Which AWS services should they use?

A. Amazon Rekognition Video + Amazon S3 + AWS Step Functions

B. Amazon Textract + Amazon Comprehend + Amazon Kendra

C. Amazon Transcribe + Amazon Polly + Amazon Lex

D. Amazon Kinesis Video Streams + Amazon SageMaker + Amazon EMR

**Correct Answer:** A

**Explanation:** Amazon Rekognition Video is specifically designed for video analysis, including scene detection, celebrity recognition, and content moderation. Amazon S3 stores the video files, and AWS Step Functions orchestrates the analysis workflow. This combination is purpose-built for video content analysis at scale.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B focuses on document and text processing
- C focuses on speech and conversation
- D is more complex and requires custom model development

---

### Scenario Question 16: Conversational Search for Documentation
**Scenario:** A software company wants to implement a conversational search interface for their technical documentation. Users should be able to ask questions in natural language and get accurate answers with citations to source documents.

**Question:** Which Amazon Bedrock feature would be most appropriate?

A. Amazon Bedrock Knowledge Bases with source attribution

B. Amazon Bedrock Agents with action groups

C. Amazon Bedrock Guardrails with content filters

D. Amazon Bedrock fine-tuning with custom data

**Correct Answer:** A

**Explanation:** Amazon Bedrock Knowledge Bases is specifically designed for RAG (Retrieval-Augmented Generation) applications. It automatically chunks documents, creates embeddings, retrieves relevant content, and generates answers with source attribution. This is exactly what is needed for conversational search with citations.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B is for agent-based task execution
- C is for content filtering and safety
- D is for model customization, not search

---

### Scenario Question 17: Multi-Language Customer Support
**Scenario:** A global company needs to provide customer support in 20 languages. They want to route customer queries to appropriate agents, understand sentiment, and provide automated responses when possible.

**Question:** Which AWS services combination would be most effective?

A. Amazon Connect + Amazon Lex + Amazon Translate + Amazon Comprehend

B. Amazon Translate + Amazon Polly + Amazon Transcribe

C. Amazon Rekognition + Amazon Textract + Amazon Kendra

D. Amazon Personalize + Amazon Forecast + Amazon QuickSight

**Correct Answer:** A

**Explanation:** Amazon Connect provides the contact center infrastructure. Amazon Lex handles conversational AI in multiple languages. Amazon Translate translates between languages when needed. Amazon Comprehend analyzes sentiment in customer queries. This combination provides a complete multi-language customer support solution.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B is for translation and speech, not customer support routing
- C is for image/document processing
- D is for recommendations and analytics

---

### Scenario Question 18: Anomaly Detection in IoT Sensors
**Scenario:** A manufacturing company has thousands of IoT sensors monitoring equipment. They need to detect anomalies in sensor data to predict equipment failures before they occur.

**Question:** Which AWS services would be most appropriate?

A. Amazon Lookout for Equipment + AWS IoT Core + Amazon Timestream

B. Amazon Rekognition + Amazon Kinesis + Amazon S3

C. Amazon Textract + Amazon Comprehend + Amazon Kendra

D. Amazon Personalize + Amazon Forecast + Amazon Athena

**Correct Answer:** A

**Explanation:** Amazon Lookout for Equipment is specifically designed for industrial equipment anomaly detection. AWS IoT Core ingests sensor data from devices, and Amazon Timestream stores time-series sensor data. This combination is purpose-built for industrial IoT anomaly detection.

**Domain:** Domain 1: Fundamentals of AI and ML

**Why wrong answers are wrong:**
- B focuses on image processing and streaming
- C focuses on document and text processing
- D focuses on recommendations and forecasting

---

### Scenario Question 19: Content Summarization at Scale
**Scenario:** A news aggregator needs to automatically summarize thousands of articles daily across multiple categories. They need coherent, accurate summaries that capture key information.

**Question:** Which approach using Amazon Bedrock would be most effective?

A. Use a foundation model with summarization prompts and batch processing

B. Use Amazon Comprehend key phrase extraction

C. Use Amazon Textract for document analysis

D. Use Amazon Kendra for semantic search

**Correct Answer:** A

**Explanation:** Using a foundation model like Claude or Titan with well-crafted summarization prompts can generate coherent, accurate summaries. Batch processing allows handling thousands of articles efficiently. The model can be instructed to focus on key information and maintain coherence.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B extracts key phrases, not coherent summaries
- C is for document text extraction
- D is for search, not summarization

---

### Scenario Question 20: Model Monitoring in Production
**Scenario:** A company has deployed an ML model for credit scoring. They need to monitor model performance, detect data drift, and ensure the model remains fair across different demographic groups.

**Question:** Which AWS services and features should they use?

A. Amazon SageMaker Model Monitor + SageMaker Clarify + CloudWatch alarms

B. Amazon CloudWatch + AWS X-Ray + AWS CloudTrail

C. Amazon GuardDuty + Amazon Inspector + Amazon Macie

D. Amazon Athena + Amazon QuickSight + Amazon Redshift

**Correct Answer:** A

**Explanation:** Amazon SageMaker Model Monitor tracks model quality and detects data drift in production. SageMaker Clarify monitors bias across demographic groups. CloudWatch alarms notify when issues are detected. This combination provides comprehensive model monitoring for performance, drift, and fairness.

**Domain:** Domain 3: Applications of Foundation Models

**Why wrong answers are wrong:**
- B is for application monitoring, not ML model monitoring
- C is for security monitoring
- D is for analytics and BI

---

## Exam-Taking Strategies

### Before the Exam

1. **Focus on High-Weight Domains**
   - Domain 3 (Applications of Foundation Models - 28%) and Domain 2 (Fundamentals of Generative AI - 24%) account for over half the exam
   - Prioritize understanding Amazon Bedrock, prompt engineering, and RAG

2. **Hands-On Practice**
   - Use AWS Free Tier to experiment with Amazon Bedrock, SageMaker, and AI services
   - Complete the Cloud Quest "Generative AI" badge on Skill Builder
   - Practice with the AWS Console to understand service capabilities

3. **Understand Service Boundaries**
   - Know what each service does AND what it doesn't do
   - Be able to distinguish between similar services (e.g., Comprehend vs. Kendra)

### During the Exam

1. **Time Management**
   - 65 questions in 90-120 minutes = ~1.4 minutes per question
   - Don't spend too long on any single question
   - Mark difficult questions for review and return to them

2. **Question Analysis**
   - Read the question carefully - identify the key requirement
   - Eliminate obviously wrong answers first
   - For scenario questions, identify the specific problem being solved
   - Look for "most appropriate" or "best fit" language

3. **Watch for Keywords**
   - "Cost-effective" -> Consider managed services over custom solutions
   - "Real-time" -> Look for low-latency services
   - "Fully managed" -> AWS managed service over self-managed
   - "Compliance" -> Security, encryption, audit features

4. **Answer Patterns**
   - If unsure, look for the most specific answer
   - Avoid answers that require multiple unrelated services
   - Look for AWS-native solutions first

### Key Concepts to Memorize

1. **Exam Weights**: Domain 3 (28%) > Domain 2 (24%) > Domain 1 (20%) > Domain 4 (14%) = Domain 5 (14%)

2. **Amazon Bedrock Features**:
   - Foundation models: Amazon Titan, Claude, Llama, Jurassic, Command, Stable Diffusion
   - Knowledge Bases for RAG
   - Agents for multi-step tasks
   - Guardrails for responsible AI

3. **Inference Parameters**:
   - Temperature (0-1): Higher = more creative/random
   - Top-p: Nucleus sampling
   - Top-k: Limit to top k tokens
   - Max tokens: Output length limit

4. **Responsible AI Dimensions**: Fairness, Transparency, Safety, Privacy, Robustness

5. **Shared Responsibility Model**: AWS secures the cloud, customer secures in the cloud

---

## Recommended Resources

### Official AWS Resources
- [AWS Certified AI Practitioner Exam Guide](https://d1.awsstatic.com/training-and-certification/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf)
- [AWS Skill Builder - AI Practitioner Learning Path](https://explore.skillbuilder.aws/learn/learning-plans)
- [AWS Free Tier](https://aws.amazon.com/free/) - Hands-on practice
- [AWS Well-Architected Machine Learning Lens](https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/welcome.html)

### Practice Exams and Questions
- AWS Skill Builder Official Practice Question Set
- Whizlabs AWS AI Practitioner Practice Tests
- Tutorials Dojo Practice Exams
- ExamTopics Community Questions

### Documentation Deep Dives
- Amazon Bedrock User Guide
- Amazon SageMaker Developer Guide
- AWS AI Services Documentation
- AWS Responsible AI Documentation

---

## Quick Reference: Key Service Capabilities

| Service | Primary Use | Key Features |
|---------|-------------|--------------|
| Amazon Bedrock | Foundation models | Knowledge Bases, Agents, Guardrails, Fine-tuning |
| Amazon SageMaker | ML platform | Training, deployment, monitoring, Clarify, Pipelines |
| Amazon Rekognition | Image/video analysis | Object detection, face analysis, content moderation |
| Amazon Comprehend | NLP | Sentiment analysis, entity detection, PII detection |
| Amazon Textract | Document processing | OCR, forms, tables, handwriting |
| Amazon Polly | Text-to-speech | Neural voices, standard voices, SSML support |
| Amazon Lex | Chatbots | Intent recognition, slot filling, multi-turn dialogs |
| Amazon Transcribe | Speech-to-text | Real-time, batch, custom vocabularies |
| Amazon Kendra | Enterprise search | ML-powered relevance, natural language queries |
| Amazon Personalize | Recommendations | Real-time, batch, similar items, personalized ranking |
| Amazon Forecast | Time-series forecasting | Multiple algorithms, automatic model selection |
| Amazon Fraud Detector | Fraud detection | Real-time, batch, custom models |
| Amazon Lookout for Equipment | Industrial anomaly detection | IoT sensor data, predictive maintenance |

---

**Good luck on your AWS Certified AI Practitioner exam!** [ROCKET]

*This study guide was created based on the latest exam content as of 2026. Always refer to the official AWS documentation for the most current information.*

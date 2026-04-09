# AWS Certified AI Practitioner (AIF-C01) -- Deep Study Guide

> **Exam Code:** AIF-C01 | **Questions:** 65 (50 scored + 15 unscored) | **Time:** 120 min | **Passing Score:** 700/1000 | **Cost:** ~$150 USD
> 
> **Question Formats:** Multiple choice, Multiple response, Ordering/Sequencing, Matching

---

## Table of Contents

1. [Exam Domain Breakdown](#1-exam-domain-breakdown)
2. [Most Prevalent Topics & Concepts](#2-most-prevalent-topics--concepts)
3. [Section A -- Ordering Questions (20)](#3-section-a--ordering-questions)
4. [Section B -- Matching Questions (20)](#4-section-b--matching-questions)
5. [Section C -- Scenario-Based Questions (20)](#5-section-c--scenario-based-questions)
6. [Rapid-Review Cheat Sheet](#6-rapid-review-cheat-sheet)

---

## 1. Exam Domain Breakdown

| Domain       | Topic                                                 | Weight  |
| ------------ | ----------------------------------------------------- | ------- |
| **Domain 1** | Fundamentals of AI and ML                             | **20%** |
| **Domain 2** | Fundamentals of Generative AI                         | **24%** |
| **Domain 3** | Applications of Foundation Models                     | **28%** |
| **Domain 4** | Guidelines for Responsible AI                         | **14%** |
| **Domain 5** | Security, Compliance, and Governance for AI Solutions | **14%** |

**Key takeaway:** Domains 2 + 3 together account for **52%** of the exam. Master Generative AI and Foundation Model applications first.

---

## 2. Most Prevalent Topics & Concepts

### Tier 1 -- Highest Frequency (test-defining)

| Topic                                                                                                       | Why It Matters                                                           |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Amazon Bedrock** (Knowledge Bases, Agents, Guardrails, Custom Models, Provisioned Throughput)             | The single most-tested service. Know every sub-feature.                  |
| **Prompt Engineering** (zero-shot, few-shot, chain-of-thought, negative prompts, temperature, top-p, top-k) | Heavily tested across Domains 2 and 3. Know when each technique applies. |
| **RAG vs Fine-Tuning vs Prompt Engineering** decision framework                                             | Classic scenario question -- know the trade-offs cold.                    |
| **Foundation Model selection** (which model for which task -- text, image, embeddings, code)                 | Tested via matching and scenario questions.                              |
| **Responsible AI** (bias, fairness, transparency, explainability, toxicity)                                 | Cross-cuts Domains 4 and 5. SageMaker Clarify is the key service.        |

### Tier 2 -- High Frequency

| Topic                                                                                                | Why It Matters                                 |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **ML Pipeline** (data prep -> train -> evaluate -> deploy -> monitor)                                    | Ordering questions love this.                  |
| **Evaluation Metrics** (BLEU, ROUGE, BERTScore, F1, RMSE, accuracy, AUC-ROC)                         | Matching questions pair metrics to task types. |
| **Amazon SageMaker** (Canvas, JumpStart, Clarify, Model Monitor)                                     | Know the no-code/low-code capabilities.        |
| **Amazon Q** (Business vs Developer editions, plugins, data source connectors)                       | Growing exam presence.                         |
| **Security & Governance** (IAM for Bedrock, VPC endpoints, KMS encryption, CloudTrail, data privacy) | Domain 5 staple.                               |
| **Prompt injection / jailbreak risks**                                                               | Domain 4 and 5 cross-over.                     |

### Tier 3 -- Moderate Frequency

| Topic                                                                                             | Why It Matters                                        |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Types of ML** (supervised, unsupervised, reinforcement learning)                                | Domain 1 basics.                                      |
| **Vector stores & embeddings** (OpenSearch, Pinecone, chunking strategies)                        | RAG infrastructure.                                   |
| **Model customization** (fine-tuning vs continued pre-training in Bedrock)                        | Know the difference.                                  |
| **Amazon Comprehend, Rekognition, Transcribe, Polly, Translate, Kendra, Personalize**             | Traditional AI services appear in matching questions. |
| **Cost optimization** (Provisioned Throughput vs On-Demand, model size selection, Spot instances) | Scenario questions touch on this.                     |
| **Data drift and model drift**                                                                    | Model Monitor and retraining triggers.                |

---

## 3. Section A -- Ordering Questions

> **Format:** Arrange the items in the correct sequence. Drag and drop or select in order.

---

### Ordering Q1

**Arrange the typical machine learning pipeline stages in correct order:**

1. Define the business problem and success metrics
2. Collect and prepare the data
3. Select and train a model
4. Evaluate model performance against metrics
5. Deploy the model to production
6. Monitor the model for data drift and degradation

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q2

**Arrange the steps to implement a RAG (Retrieval-Augmented Generation) solution using Amazon Bedrock Knowledge Bases:**

1. Create an S3 bucket and upload your documents
2. Create a Knowledge Base in Amazon Bedrock and connect the data source
3. Configure chunking strategy and embedding model
4. Select a vector store (e.g., Amazon OpenSearch Serverless)
5. Sync the data source to ingest and vectorize documents
6. Query the Knowledge Base through a foundation model

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q3

**Order the steps to fine-tune a foundation model in Amazon Bedrock:**

1. Prepare a high-quality JSONL training dataset
2. Upload the training data to Amazon S3
3. Create a custom model job in Amazon Bedrock
4. Select the base model to customize (e.g., Amazon Titan, Claude)
5. Configure hyperparameters (epochs, learning rate, batch size)
6. Review the training metrics and deploy the custom model

**Answer:** 1 -> 2 -> 4 -> 3 -> 5 -> 6

---

### Ordering Q4

**Arrange the hierarchy of AI/ML concepts from broadest to most specific:**

1. Artificial Intelligence
2. Machine Learning
3. Deep Learning
4. Foundation Models
5. Large Language Models

**Answer:** 1 -> 2 -> 3 -> 4 -> 5

---

### Ordering Q5

**Order the steps to configure Guardrails for Amazon Bedrock:**

1. Define the guardrail name and description
2. Configure content filters (hate, insults, sexual, violence) with severity thresholds
3. Add denied topics to block specific subject areas
4. Configure word filters and sensitive information filters (PII redaction)
5. Associate the guardrail with a foundation model or agent
6. Test the guardrail with sample prompts and review blocked outputs

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q6

**Arrange the steps for responsible bias detection using SageMaker Clarify, in order:**

1. Define the sensitive attributes (e.g., age, gender, race)
2. Run pre-training bias analysis on the dataset
3. Train the model
4. Run post-training bias analysis on model predictions
5. Review SHAP values for feature attribution explainability
6. Document findings and implement mitigations

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q7

**Order the steps to create and deploy an Amazon Bedrock Agent:**

1. Create an agent and select a foundation model
2. Provide the agent with an instruction that defines its persona and purpose
3. Create action groups that define the APIs/tools the agent can call
4. (Optional) Attach a Knowledge Base for RAG capabilities
5. Configure the agent's orchestration and Lambda function for tool execution
6. Test the agent in the console, then create an alias for production deployment

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q8

**Order the evolution of NLP approaches from earliest to most recent:**

1. Rule-based systems (regex, grammar rules)
2. Statistical NLP (n-grams, TF-IDF)
3. Traditional neural networks (RNNs, LSTMs)
4. Attention mechanism and Transformer architecture
5. Pre-trained foundation models (BERT, GPT)
6. Instruction-tuned and RLHF-aligned models

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q9

**Arrange the steps for model evaluation on Amazon Bedrock, in order:**

1. Define the evaluation task (e.g., text generation, summarization, Q&A)
2. Prepare an evaluation dataset with prompts and reference outputs
3. Select the models to compare (e.g., Titan vs Claude vs third-party)
4. Choose evaluation metrics (BLEU, ROUGE, BERTScore, accuracy)
5. Configure whether to use human evaluators, automatic metrics, or both
6. Review evaluation results and select the best-performing model

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q10

**Order the steps to secure an Amazon Bedrock deployment according to AWS best practices:**

1. Create a VPC endpoint (AWS PrivateLink) for private connectivity
2. Configure IAM policies with least-privilege permissions (e.g., `bedrock:InvokeModel`)
3. Enable KMS encryption with customer-managed keys for data at rest
4. Configure guardrails to filter harmful content and protect against prompt injection
5. Enable AWS CloudTrail logging for all Bedrock API calls
6. Set up Amazon CloudWatch alarms for anomalous usage patterns

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q11

**Order the data preparation steps for an ML project, from raw data to training-ready:**

1. Collect raw data from source systems
2. Perform exploratory data analysis (EDA) to understand distributions
3. Handle missing values and outliers
4. Engineer and select relevant features
5. Split data into training, validation, and test sets
6. Normalize/standardize features and encode categorical variables

**Answer:** 1 -> 2 -> 3 -> 6 -> 4 -> 5

---

### Ordering Q12

**Arrange the prompt engineering techniques from simplest to most complex:**

1. Zero-shot prompting (no examples)
2. One-shot prompting (single example)
3. Few-shot prompting (multiple examples)
4. Chain-of-thought prompting (reasoning steps)
5. Self-consistency (multiple reasoning paths)
6. Tree-of-thought (branching exploration)

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q13

**Order the lifecycle of an AI solution from ideation to production governance:**

1. Identify the business use case and define success criteria
2. Assess data availability, quality, and regulatory constraints
3. Select the appropriate AI/ML approach (prompt engineering, RAG, fine-tuning, or custom training)
4. Build and iterate on a prototype
5. Evaluate against responsible AI guidelines (bias, fairness, transparency)
6. Deploy to production with monitoring, guardrails, and governance controls

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q14

**Order the Transformer architecture processing steps for text input:**

1. Tokenize the input text into tokens
2. Convert tokens to token embeddings + positional encodings
3. Pass through multi-head self-attention layers
4. Apply feed-forward neural networks to each position
5. Apply layer normalization and residual connections
6. Output probability distribution over the vocabulary for next-token prediction

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q15

**Order the steps for Amazon Q Business setup:**

1. Create an Amazon Q Business application
2. Connect data sources (S3, SharePoint, Confluence, Salesforce, etc.)
3. Configure data source sync schedules
4. Set up user access and permissions (respects existing enterprise access controls)
5. Create and deploy a customizable web experience
6. Monitor usage, relevance feedback, and content quality

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q16

**Order the typical model drift detection and remediation flow:**

1. Establish a baseline using SageMaker Model Monitor on the initial training data
2. Deploy the model to a SageMaker endpoint with monitoring enabled
3. Capture incoming inference requests and predictions
4. Compare live data distributions against the baseline
5. Trigger an alert when statistical drift exceeds the defined threshold
6. Initiate model retraining or data pipeline review

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q17

**Order the steps to set up Amazon SageMaker Canvas for no-code ML:**

1. Open SageMaker Canvas from the AWS console
2. Import a dataset from S3 or upload a local file
3. Select the target column for prediction
4. Choose model type (AutoPredict or manual configuration)
5. Review model performance metrics and feature importance
6. Generate predictions via point-and-click interface or batch export

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q18

**Order the process for creating embeddings and performing semantic search:**

1. Collect the document corpus
2. Chunk documents into segments
3. Generate vector embeddings for each chunk using an embedding model
4. Store embeddings in a vector store (e.g., OpenSearch Serverless)
5. Embed the user's query using the same embedding model
6. Perform similarity search (cosine similarity) and return top-k results

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

### Ordering Q19

**Order the levels of AI automation from lowest to highest:**

1. Human-only (no AI)
2. Human-in-the-loop (AI suggests, human approves)
3. Human-on-the-loop (AI acts, human supervises and can intervene)
4. Fully autonomous AI (AI acts independently within defined guardrails)

**Answer:** 1 -> 2 -> 3 -> 4

---

### Ordering Q20

**Order the steps for implementing responsible AI in an enterprise, from policy to practice:**

1. Establish organizational AI principles and ethical guidelines
2. Conduct an impact assessment for the proposed AI use case
3. Implement technical safeguards (bias detection, content filtering, guardrails)
4. Perform human review of model outputs before production release
5. Set up continuous monitoring for bias drift and performance degradation
6. Publish transparency reports and maintain audit trails

**Answer:** 1 -> 2 -> 3 -> 4 -> 5 -> 6

---

## 4. Section B -- Matching Questions

> **Format:** Match each item in Column A with the correct item in Column B.

---

### Matching Q1 -- AWS AI Services to Use Cases

| Column A (Service)    | Column B (Use Case)                         |
| --------------------- | ------------------------------------------- |
| 1. Amazon Comprehend  | A. Convert speech audio to text             |
| 2. Amazon Rekognition | B. Detect key phrases and sentiment in text |
| 3. Amazon Transcribe  | C. Analyze images and detect objects/faces  |
| 4. Amazon Polly       | D. Generate personalized recommendations    |
| 5. Amazon Personalize | E. Convert text to lifelike speech          |

**Answer:** 1->B, 2->C, 3->A, 4->E, 5->D

---

### Matching Q2 -- Prompt Engineering Techniques

| Column A (Technique)   | Column B (Description)                            |
| ---------------------- | ------------------------------------------------- |
| 1. Zero-shot prompting | A. Provide several labeled examples in the prompt |
| 2. One-shot prompting  | B. Ask the model to "think step by step"          |
| 3. Few-shot prompting  | C. Give a single example of the desired output    |
| 4. Chain-of-thought    | D. Give no examples, just the instruction         |
| 5. Negative prompting  | E. Specify what the model should NOT do or output |

**Answer:** 1->D, 2->C, 3->A, 4->B, 5->E

---

### Matching Q3 -- Evaluation Metrics to Task Types

| Column A (Metric) | Column B (Task Type)                                             |
| ----------------- | ---------------------------------------------------------------- |
| 1. BLEU           | A. Regression -- measures prediction error magnitude              |
| 2. ROUGE          | B. Classification -- harmonic mean of precision and recall        |
| 3. F1 Score       | C. Text generation -- measures n-gram precision against reference |
| 4. RMSE           | D. Text summarization -- measures recall of reference content     |
| 5. BERTScore      | E. Semantic similarity -- uses contextual embeddings              |

**Answer:** 1->C, 2->D, 3->B, 4->A, 5->E

---

### Matching Q4 -- ML Types to Definitions

| Column A (Type)             | Column B (Definition)                                           |
| --------------------------- | --------------------------------------------------------------- |
| 1. Supervised learning      | A. Agent learns through rewards and penalties in an environment |
| 2. Unsupervised learning    | B. Model learns from labeled input-output pairs                 |
| 3. Reinforcement learning   | C. Model learns through both labeled and unlabeled data         |
| 4. Semi-supervised learning | D. Model finds patterns in data without labels                  |
| 5. Self-supervised learning | E. Model generates its own labels from the input data structure |

**Answer:** 1->B, 2->D, 3->A, 4->C, 5->E

---

### Matching Q5 -- Bedrock Features to Descriptions

| Column A (Feature)        | Column B (Description)                               |
| ------------------------- | ---------------------------------------------------- |
| 1. Knowledge Bases        | A. Multi-step task orchestration with tool/API calls |
| 2. Agents                 | B. Content filtering, denied topics, PII redaction   |
| 3. Guardrails             | C. RAG -- connect FMs to proprietary data sources     |
| 4. Custom Models          | D. Dedicated capacity for predictable workloads      |
| 5. Provisioned Throughput | E. Fine-tune or continue pre-training a base model   |

**Answer:** 1->C, 2->A, 3->B, 4->E, 5->D

---

### Matching Q6 -- LLM Parameters to Effects

| Column A (Parameter)        | Column B (Effect)                                                          |
| --------------------------- | -------------------------------------------------------------------------- |
| 1. Temperature              | A. Limits the number of highest-probability tokens considered              |
| 2. Top-p (nucleus sampling) | B. Caps the maximum number of tokens in the output                         |
| 3. Top-k                    | C. Controls randomness; higher = more creative, lower = more deterministic |
| 4. Max tokens               | D. Samples from tokens whose cumulative probability is below threshold     |
| 5. Stop sequences           | E. Defines strings that cause the model to stop generating                 |

**Answer:** 1->C, 2->D, 3->A, 4->B, 5->E

---

### Matching Q7 -- Vector Stores to Characteristics

| Column A (Vector Store)         | Column B (Characteristic)                                                    |
| ------------------------------- | ---------------------------------------------------------------------------- |
| 1. Amazon OpenSearch Serverless | A. Fully managed, native AWS integration, supports vector search collections |
| 2. Pinecone                     | B. Open-source, self-hosted or managed, supports HNSW indexing               |
| 3. Redis (with RediSearch)      | C. Purpose-built managed vector database with metadata filtering             |
| 4. pgvector (RDS PostgreSQL)    | D. In-memory store with vector similarity search extension                   |
| 5. Weaviate                     | E. Extension for PostgreSQL, good if you already use RDS                     |

**Answer:** 1->A, 2->C, 3->D, 4->E, 5->B

---

### Matching Q8 -- Security Controls to Purposes

| Column A (Control)                 | Column B (Purpose)                                           |
| ---------------------------------- | ------------------------------------------------------------ |
| 1. AWS PrivateLink (VPC endpoints) | A. Log all API calls for auditing and compliance             |
| 2. IAM policies                    | B. Encrypt data using customer-managed keys                  |
| 3. AWS KMS                         | C. Access AI services without traversing the public internet |
| 4. AWS CloudTrail                  | D. Define least-privilege access to AI services              |
| 5. Amazon Macie                    | E. Discover and protect sensitive data (PII) in S3           |

**Answer:** 1->C, 2->D, 3->B, 4->A, 5->E

---

### Matching Q9 -- SageMaker Components to Functions

| Column A (Component)       | Column B (Function)                                             |
| -------------------------- | --------------------------------------------------------------- |
| 1. SageMaker Canvas        | A. Pre-trained models and foundation models ready to deploy     |
| 2. SageMaker JumpStart     | B. No-code ML interface for business analysts                   |
| 3. SageMaker Clarify       | C. Detect bias and explain model predictions (SHAP values)      |
| 4. SageMaker Model Monitor | D. Track data drift and model quality degradation in production |
| 5. SageMaker Ground Truth  | E. Label training data with human annotators or auto-labeling   |

**Answer:** 1->B, 2->A, 3->C, 4->D, 5->E

---

### Matching Q10 -- Foundation Model Families to Specializations

| Column A (Model Family)           | Column B (Specialization / Origin)                     |
| --------------------------------- | ------------------------------------------------------ |
| 1. Amazon Titan                   | A. Anthropic -- known for safety and helpfulness        |
| 2. Claude (via Bedrock)           | B. Meta -- open-weight, strong general performance      |
| 3. Llama (via Bedrock)            | C. AI21 Labs -- enterprise text generation and analysis |
| 4. Jurassic (via Bedrock)         | D. AWS proprietary -- text, image, and embedding models |
| 5. Stable Diffusion (via Bedrock) | E. Stability AI -- image generation from text prompts   |

**Answer:** 1->D, 2->A, 3->B, 4->C, 5->E

---

### Matching Q11 -- Responsible AI Principles to Definitions

| Column A (Principle) | Column B (Definition)                                                |
| -------------------- | -------------------------------------------------------------------- |
| 1. Fairness          | A. Ability to understand and explain how a model makes decisions     |
| 2. Explainability    | B. Ensuring model outcomes do not systematically disadvantage groups |
| 3. Transparency      | C. Clear disclosure about how AI systems operate and use data        |
| 4. Privacy           | D. Protecting personal data and respecting data subject rights       |
| 5. Robustness        | E. System performs reliably and safely under varied conditions       |

**Answer:** 1->B, 2->A, 3->C, 4->D, 5->E

---

### Matching Q12 -- Data Splitting Terms to Purposes

| Column A (Term)      | Column B (Purpose)                                                       |
| -------------------- | ------------------------------------------------------------------------ |
| 1. Training set      | A. Final unbiased evaluation of model performance                        |
| 2. Validation set    | B. Data the model learns from directly -- adjusts weights                 |
| 3. Test set          | C. Tuning hyperparameters and preventing overfitting                     |
| 4. Cross-validation  | D. Rotating through multiple train/validate splits for robust evaluation |
| 5. Pre-training data | E. Large unlabeled corpora used to train a foundation model              |

**Answer:** 1->B, 2->C, 3->A, 4->D, 5->E

---

### Matching Q13 -- Types of Bias to Descriptions

| Column A (Bias Type) | Column B (Description)                                                     |
| -------------------- | -------------------------------------------------------------------------- |
| 1. Selection bias    | A. Training data does not represent the real-world population              |
| 2. Confirmation bias | B. Model perpetuates or amplifies existing societal stereotypes            |
| 3. Measurement bias  | C. Data is systematically skewed due to how it was collected or filtered   |
| 4. Recall bias       | D. Inaccurate or inconsistent data labels due to subjective human judgment |
| 5. Algorithmic bias  | E. Favoring information that confirms pre-existing beliefs in outputs      |

**Answer:** 1->C, 2->E, 3->A, 4->D, 5->B

---

### Matching Q14 -- RAG Components to Functions

| Column A (Component) | Column B (Function)                                                            |
| -------------------- | ------------------------------------------------------------------------------ |
| 1. Document chunking | A. Split documents into manageable pieces for embedding                        |
| 2. Embedding model   | B. Convert text chunks and queries into numerical vectors                      |
| 3. Vector store      | C. Store and index embeddings for fast similarity search                       |
| 4. Retriever         | D. Find the most relevant chunks given a query embedding                       |
| 5. Augmented prompt  | E. Combine retrieved context with the user's question before passing to the FM |

**Answer:** 1->A, 2->B, 3->C, 4->D, 5->E

---

### Matching Q15 -- Amazon Q Editions to Capabilities

| Column A (Edition)          | Column B (Primary Capability)                                               |
| --------------------------- | --------------------------------------------------------------------------- |
| 1. Amazon Q Business        | A. AI-powered enterprise search, summarization, and action execution        |
| 2. Amazon Q Developer       | B. Code generation, security scanning, and AWS best-practice guidance       |
| 3. Amazon Q in QuickSight   | C. Natural language queries and dashboard generation for BI                 |
| 4. Amazon Q in Connect      | D. Real-time agent assistance and recommended responses for contact centers |
| 5. Amazon Q in Supply Chain | E. Supply chain insights, risk analysis, and demand forecasting             |

**Answer:** 1->A, 2->B, 3->C, 4->D, 5->E

---

### Matching Q16 -- Tokenization Concepts to Definitions

| Column A (Concept)              | Column B (Definition)                                               |
| ------------------------------- | ------------------------------------------------------------------- |
| 1. Token                        | A. A sub-word unit, word, or character that an LLM processes        |
| 2. Token limit / context window | B. Maximum number of tokens a model can process in a single request |
| 3. Tokenization                 | C. The process of converting text into a sequence of tokens         |
| 4. Padding                      | D. Adding tokens to equalize sequence lengths in a batch            |
| 5. Special tokens               | E. Tokens like [CLS], [SEP], [PAD] that serve structural purposes   |

**Answer:** 1->A, 2->B, 3->C, 4->D, 5->E

---

### Matching Q17 -- ML Problem Types to Examples

| Column A (Problem Type)       | Column B (Example)                                              |
| ----------------------------- | --------------------------------------------------------------- |
| 1. Binary classification      | A. Predict house prices based on features                       |
| 2. Multi-class classification | B. Identify whether an email is spam or not spam                |
| 3. Regression                 | C. Group customers into segments based on behavior              |
| 4. Clustering                 | D. Categorize support tickets as billing, technical, or general |
| 5. Anomaly detection          | E. Flag unusual credit card transactions                        |

**Answer:** 1->B, 2->D, 3->A, 4->C, 5->E

---

### Matching Q18 -- AWS Compliance Resources to Uses

| Column A (Resource)  | Column B (Use)                                                     |
| -------------------- | ------------------------------------------------------------------ |
| 1. AWS Artifact      | A. Access compliance reports and agreements (SOC, ISO, HIPAA)      |
| 2. AWS Config        | B. Track configuration changes and evaluate compliance rules       |
| 3. AWS Audit Manager | C. Continuously audit AWS usage to collect evidence for compliance |
| 4. AWS CloudTrail    | D. Record API call history for governance and forensic analysis    |
| 5. Amazon Inspector  | E. Automated vulnerability scanning for workloads                  |

**Answer:** 1->A, 2->B, 3->C, 4->D, 5->E

---

### Matching Q19 -- Generative AI Concepts to Definitions

| Column A (Concept)   | Column B (Definition)                                                               |
| -------------------- | ----------------------------------------------------------------------------------- |
| 1. Hallucination     | A. Model generates plausible but factually incorrect information                    |
| 2. Overfitting       | B. Model memorizes training data and performs poorly on new data                    |
| 3. Underfitting      | C. Model is too simple to capture underlying patterns                               |
| 4. Transfer learning | D. Applying knowledge from one task to a related task                               |
| 5. RLHF              | E. Training technique using human feedback to align model behavior with preferences |

**Answer:** 1->A, 2->B, 3->C, 4->D, 5->E

---

### Matching Q20 -- Bedrock Model Operations to Descriptions

| Column A (Operation)      | Column B (Description)                                            |
| ------------------------- | ----------------------------------------------------------------- |
| 1. On-Demand inference    | A. Pay per request with no upfront commitment                     |
| 2. Provisioned Throughput | B. Dedicated capacity for predictable, high-volume workloads      |
| 3. Fine-tuning            | C. Further train a model on labeled data for a specific task      |
| 4. Continued pre-training | D. Train a model on large unlabeled domain-specific data          |
| 5. Model evaluation       | E. Compare model performance using automatic and/or human metrics |

**Answer:** 1->A, 2->B, 3->C, 4->D, 5->E

---

## 5. Section C -- Scenario-Based Questions

> **Format:** Read the scenario and select the best answer (or answers for multi-response).

---

### Scenario Q1

**A retail company wants to build a chatbot that answers customer questions about products using their product catalog, which updates daily. The chatbot must provide accurate, up-to-date responses with source citations.**

Which approach is MOST appropriate?

- A) Fine-tune a foundation model on the product catalog
- B) Use prompt engineering with the product catalog pasted into each prompt
- C) Implement RAG using Amazon Bedrock Knowledge Bases connected to the product data source
- D) Train a custom ML model from scratch using SageMaker

**Answer: C**
**Why:** RAG is ideal when data changes frequently and you need source attribution. Fine-tuning would require retraining every time the catalog updates. The catalog is too large to paste into prompts.

---

### Scenario Q2

**A healthcare company needs to use an AI service to extract medical conditions from patient records. The data must remain HIPAA-compliant and must NOT be used to train third-party models.**

Which TWO actions should they take?

- A) Use Amazon Comprehend Medical with HIPAA eligibility
- B) Verify the service terms to ensure data is not used for model training
- C) Use a public third-party LLM API for cost savings
- D) Store patient records in a public S3 bucket for easy access
- E) Disable CloudTrail logging to reduce overhead

**Answer: A, B**
**Why:** Amazon Comprehend Medical is HIPAA-eligible. You must always verify service terms to ensure data isn't used for third-party model training. Never use public APIs for PHI, never store in public S3, and never disable audit logging.

---

### Scenario Q3

**A marketing team uses an LLM on Amazon Bedrock to generate product descriptions. The outputs are too generic and don't match the company's brand voice. The team has 50 examples of ideal product descriptions.**

What is the MOST cost-effective first step?

- A) Fine-tune the model with the 50 examples
- B) Use few-shot prompting with the 50 examples included in the prompt
- C) Train a custom model from scratch
- D) Purchase Provisioned Throughput

**Answer: B**
**Why:** With only 50 examples, few-shot prompting is the fastest and cheapest approach. You include a few of the best examples directly in the prompt to demonstrate the desired brand voice. Fine-tuning requires hundreds to thousands of examples to be effective.

---

### Scenario Q4

**A financial services company uses a model to approve loan applications. Regulators require the company to explain WHY an applicant was denied.**

Which AWS service should they use?

- A) Amazon GuardDuty
- B) Amazon SageMaker Clarify
- C) AWS CloudTrail
- D) Amazon Bedrock Guardrails

**Answer: B**
**Why:** SageMaker Clarify provides model explainability through SHAP values, showing which features contributed to each prediction. GuardDuty is for threat detection, CloudTrail is for API auditing, and Bedrock Guardrails are for content filtering -- not model explainability.

---

### Scenario Q5

**A company has 10,000 labeled customer support conversations and wants an AI system that can respond in their exact support style and terminology. They need consistent, low-latency responses.**

Which approach is BEST?

- A) Use zero-shot prompting with a general-purpose LLM
- B) Implement RAG with the support conversations as a knowledge base
- C) Fine-tune a foundation model on the labeled support conversations
- D) Use Amazon Comprehend for sentiment analysis

**Answer: C**
**Why:** With 10,000 high-quality labeled examples, fine-tuning is appropriate. The company needs the model to adopt their specific style and terminology consistently, which fine-tuning achieves better than RAG (which retrieves but doesn't change model behavior). RAG is better for knowledge/facts, fine-tuning is better for style/format.

---

### Scenario Q6

**A company wants to prevent their Bedrock-powered chatbot from discussing competitors' products and from generating content that contains hate speech or violence.**

Which TWO Bedrock features should they configure?

- A) Provisioned Throughput
- B) Guardrails -- denied topics
- C) Guardrails -- content filters
- D) Knowledge Bases
- E) Agents

**Answer: B, C**
**Why:** Denied topics block competitor discussions, and content filters set severity thresholds for hate, insults, sexual content, and violence. These are both Guardrails features.

---

### Scenario Q7

**An insurance company's AI model for pricing premiums shows higher rates for a specific demographic group despite similar risk profiles. The data scientists need to detect this bias before deployment.**

Which approach should they use?

- A) Pre-training bias detection with SageMaker Clarify
- B) Increase the model's temperature parameter
- C) Use Amazon Rekognition to analyze the training data
- D) Add more training data and redeploy without analysis

**Answer: A**
**Why:** SageMaker Clarify's pre-training bias analysis examines the dataset for imbalances and distribution skew across demographic groups. This should be done before training. Simply adding more data without analysis won't identify the specific bias.

---

### Scenario Q8

**A global enterprise wants to deploy Amazon Q Business to allow employees to search across internal documents stored in SharePoint, Confluence, and S3. The solution must respect existing document-level access permissions.**

What should the solutions architect ensure?

- A) Copy all documents to a single S3 bucket and remove access controls
- B) Configure Amazon Q Business with each data source and enable access control enforcement
- C) Use Amazon Kendra instead, as Q Business doesn't support access controls
- D) Grant all users admin access to ensure no documents are missed

**Answer: B**
**Why:** Amazon Q Business respects existing enterprise access controls when configured with the appropriate data source connectors. Users only see results from documents they already have permission to access.

---

### Scenario Q9

**A startup is building an AI application that needs to generate images from text descriptions. They want to use Amazon Bedrock and need to choose the right model.**

Which model family should they select?

- A) Amazon Titan Text
- B) Anthropic Claude
- C) Stability AI (Stable Diffusion)
- D) Amazon Titan Embeddings

**Answer: C**
**Why:** Stability AI's Stable Diffusion models are image generation models available through Amazon Bedrock. Titan Text and Claude are text models. Titan Embeddings generates vector representations of text, not images.

---

### Scenario Q10

**A company needs to compare the performance of three different foundation models for a text summarization task. They want to measure how well the summaries capture the key information from the source documents.**

Which metric is MOST appropriate?

- A) RMSE
- B) F1 Score
- C) ROUGE
- D) BLEU

**Answer: C**
**Why:** ROUGE (Recall-Oriented Understudy for Gisting Evaluation) measures how much of the reference content appears in the generated summary -- it is recall-focused, which is ideal for summarization tasks. BLEU is precision-focused and better for translation. F1 is for classification. RMSE is for regression.

---

### Scenario Q11

**A company's chatbot built on Amazon Bedrock has been receiving prompt injection attacks where users try to manipulate the model into revealing system instructions and generating harmful content.**

Which TWO actions should they take?

- A) Configure Guardrails for Amazon Bedrock with content filters and denied topics
- B) Increase the model's temperature to 1.0
- C) Implement input validation and sanitization in the application layer
- D) Remove all system prompts
- E) Switch to a smaller, less capable model

**Answer: A, C**
**Why:** Guardrails provide defense-in-depth against prompt injection. Input validation at the application layer adds a first line of defense. Removing system prompts or switching to weaker models doesn't solve the injection problem and may break functionality.

---

### Scenario Q12

**A media company processes thousands of video files daily and needs to automatically generate subtitles, detect inappropriate content in frames, and translate subtitles into 10 languages.**

Which combination of AWS AI services should they use?

- A) Amazon Transcribe + Amazon Rekognition + Amazon Translate
- B) Amazon Polly + Amazon Comprehend + Amazon Kendra
- C) Amazon SageMaker + Amazon Bedrock + Amazon Q
- D) Amazon Personalize + Amazon Monitron + Amazon Lookout

**Answer: A**
**Why:** Transcribe converts speech to text (subtitles), Rekognition analyzes video frames for inappropriate content, and Translate converts text between languages.

---

### Scenario Q13

**A data scientist at a manufacturing company has built a predictive maintenance model. After deploying to production, the model's accuracy has been declining over the past three months. The training data was from the previous year.**

What is the MOST likely cause?

- A) The model was overfit during training
- B) Data drift -- the operational conditions have changed since the training period
- C) The SageMaker endpoint is misconfigured
- D) The evaluation metrics were calculated incorrectly

**Answer: B**
**Why:** Gradual performance decline in production is the hallmark of data drift -- the statistical properties of the live data have diverged from the training data. This is why SageMaker Model Monitor exists: to detect drift and trigger alerts.

---

### Scenario Q14

**A company wants to use Amazon Bedrock but has a strict policy that no data can traverse the public internet. All API calls must remain within their VPC.**

What should they configure?

- A) A NAT Gateway in the public subnet
- B) AWS PrivateLink VPC endpoint for Amazon Bedrock
- C) A VPN connection to AWS
- D) An internet gateway with security group rules

**Answer: B**
**Why:** AWS PrivateLink creates VPC endpoints that allow private connectivity to AWS services without going over the public internet. This is the standard pattern for compliance requirements that mandate no public internet traversal.

---

### Scenario Q15

**A company is evaluating whether to use prompt engineering, RAG, or fine-tuning for their use case. Their requirements are:**

- **They need the model to answer questions about internal HR policies**
- **The policies change monthly**
- **They need citations showing which policy document the answer came from**
- **They have limited ML expertise and want the fastest time-to-value**

Which approach should they choose?

- A) Fine-tuning -- to embed the policies into the model
- B) RAG with Amazon Bedrock Knowledge Bases -- to retrieve from the policy documents
- C) Prompt engineering -- by including all policies in the system prompt
- D) Build a custom NLP model in SageMaker

**Answer: B**
**Why:** RAG is ideal here because: (1) policies change monthly -- RAG doesn't require retraining, just re-syncing the data source; (2) citations are a natural byproduct of RAG; (3) Bedrock Knowledge Bases provide a managed, low-expertise path.

---

### Scenario Q16

**A legal firm needs an AI assistant that can: (1) search through case law databases, (2) draft legal documents in the firm's style, (3) schedule meetings by interfacing with their calendar system.**

Which Amazon Bedrock features should they combine?

- A) Knowledge Bases only
- B) Agents with Knowledge Bases and action groups
- C) Fine-tuning only
- D) Guardrails only

**Answer: B**
**Why:** Knowledge Bases handle the search through case law (RAG). Agents provide the orchestration to draft documents AND call calendar APIs via action groups. This requires the multi-step planning capability that Agents provide.

---

### Scenario Q17

**A company is using an LLM and wants to ensure the output is deterministic -- the same input should always produce the same output for their automated report generation pipeline.**

What parameter setting should they use?

- A) Temperature = 1.0
- B) Temperature = 0.0
- C) Top-p = 0.5
- D) Top-k = 50

**Answer: B**
**Why:** Setting temperature to 0 makes the model select the highest-probability token at each step, producing deterministic outputs. Temperature = 1.0 introduces randomness. Top-p and Top-k add sampling variety but don't guarantee determinism.

---

### Scenario Q18

**A retail company wants to build a product recommendation engine. They have historical purchase data, browsing behavior, and customer profiles. They want a fully managed solution with minimal ML expertise required.**

Which service should they use?

- A) Amazon SageMaker Canvas
- B) Amazon Personalize
- C) Amazon Bedrock with a fine-tuned model
- D) Amazon Comprehend

**Answer: B**
**Why:** Amazon Personalize is a fully managed recommendation engine that takes user interaction data and generates personalized recommendations. It requires no ML expertise. Canvas is more general-purpose and requires more configuration. Bedrock would be overkill for this well-defined use case.

---

### Scenario Q19

**A company has deployed a model in production and wants to detect if the model's predictions are becoming biased against a specific age group over time.**

Which TWO capabilities should they enable?

- A) SageMaker Model Monitor -- Bias Drift Monitor
- B) Amazon GuardDuty -- threat detection
- C) SageMaker Clarify -- ongoing bias monitoring on the endpoint
- D) AWS Config -- configuration compliance rules
- E) Amazon Inspector -- vulnerability scanning

**Answer: A, C**
**Why:** SageMaker Model Monitor's Bias Drift Monitor continuously checks for changes in bias metrics over time. SageMaker Clarify provides the underlying bias detection capabilities that Model Monitor uses. Together they provide continuous bias monitoring in production.

---

### Scenario Q20

**A startup wants to use generative AI but is concerned about cost. They need to process 1 million text documents per month for embedding generation. They want to minimize cost while maintaining acceptable latency.**

Which combination of approaches is MOST cost-effective?

- A) Use the largest available model for best quality regardless of cost
- B) Use Amazon Titan Embeddings model (smaller, purpose-built for embeddings) with On-Demand pricing
- C) Purchase maximum Provisioned Throughput for all models
- D) Fine-tune a large model to generate embeddings faster

**Answer: B**
**Why:** Amazon Titan Embeddings is purpose-built for generating embeddings at lower cost and with lower latency than using a large generative model. On-Demand pricing means you only pay for what you use. Purpose-built embedding models are far more cost-effective than general-purpose LLMs for this task.

---

## 6. Rapid-Review Cheat Sheet

### Decision Framework: RAG vs Fine-Tuning vs Prompt Engineering

| Criterion                 | Prompt Engineering             | RAG                 | Fine-Tuning                               |
| ------------------------- | ------------------------------ | ------------------- | ----------------------------------------- |
| **Speed to implement**    | Minutes                        | Hours-Days          | Days-Weeks                                |
| **Cost**                  | Lowest                         | Low-Medium          | High                                      |
| **Private/current data**  | No (limited by context window) | Yes                 | Only at training time                     |
| **Custom style/tone**     | Moderate                       | Low                 | High                                      |
| **Citations/sources**     | No                             | Yes                 | No                                        |
| **Data freshness**        | N/A                            | Real-time (re-sync) | Requires retraining                       |
| **Data volume needed**    | A few examples                 | Any                 | Hundreds to thousands of labeled examples |
| **ML expertise required** | None                           | Low                 | Medium-High                               |

### Key AWS Services Quick Reference

| Service                    | Purpose                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Amazon Bedrock**         | Access foundation models via API -- Knowledge Bases, Agents, Guardrails, Custom Models                         |
| **Amazon SageMaker**       | Build, train, and deploy ML models -- Canvas (no-code), JumpStart (pre-trained), Clarify (bias), Model Monitor |
| **Amazon Q Business**      | Enterprise AI assistant -- search, summarize, and act on company data                                          |
| **Amazon Q Developer**     | AI coding assistant -- code generation, security scanning, AWS guidance                                        |
| **Amazon Titan**           | AWS's own foundation models -- text, image, and embeddings                                                     |
| **Amazon Comprehend**      | NLP -- sentiment, key phrases, entities, language detection                                                    |
| **Amazon Rekognition**     | Image and video analysis -- objects, faces, text, content moderation                                           |
| **Amazon Transcribe**      | Speech-to-text                                                                                                |
| **Amazon Polly**           | Text-to-speech                                                                                                |
| **Amazon Translate**       | Language translation                                                                                          |
| **Amazon Kendra**          | Intelligent enterprise search                                                                                 |
| **Amazon Personalize**     | Personalized recommendations                                                                                  |
| **SageMaker Clarify**      | Bias detection and model explainability (SHAP)                                                                |
| **SageMaker Ground Truth** | Data labeling service                                                                                         |
| **Guardrails for Bedrock** | Content filtering, denied topics, PII redaction                                                               |

### LLM Parameters Cheat Sheet

| Parameter       | Low Value              | High Value            |
| --------------- | ---------------------- | --------------------- |
| **Temperature** | Deterministic, focused | Creative, random      |
| **Top-p**       | Considers fewer tokens | Considers more tokens |
| **Top-k**       | Narrows selection      | Broadens selection    |
| **Max tokens**  | Shorter responses      | Longer responses      |

### Evaluation Metrics Quick Reference

| Metric         | Task Type                     | Measures                           | Direction       |
| -------------- | ----------------------------- | ---------------------------------- | --------------- |
| **BLEU**       | Text generation / Translation | N-gram precision                   | Higher = better |
| **ROUGE**      | Text summarization            | Recall of reference content        | Higher = better |
| **BERTScore**  | Semantic similarity           | Cosine similarity of embeddings    | Higher = better |
| **F1 Score**   | Classification                | Balance of precision & recall      | Higher = better |
| **RMSE**       | Regression                    | Prediction error magnitude         | Lower = better  |
| **Accuracy**   | Classification                | Correct predictions / total        | Higher = better |
| **AUC-ROC**    | Binary classification         | Trade-off between TPR and FPR      | Higher = better |
| **Perplexity** | Language modeling             | How well model predicts next token | Lower = better  |

---

> **Sources & Further Reading:**
> 
> - [AWS Certified AI Practitioner -- Official Exam Page](https://aws.amazon.com/certification/certified-ai-practitioner/)
> - [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
> - [Amazon SageMaker Documentation](https://docs.aws.amazon.com/sagemaker/)
> - [AWS Responsible AI](https://aws.amazon.com/ai/responsible-ai/)
> - [AWS Skill Builder -- AIF-C01 Learning Plan](https://skillbuilder.aws/)
> - [AIF-C01 Official Exam Guide (PDF)](https://d1.awsstatic.com/training-and-certification/docs-ai-practitioner/AIF-C01_exam-guide.pdf)

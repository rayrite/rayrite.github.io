# AWS Certified AI Practitioner (AIF-C01) Exam Study Guide

**Focus:** Ordering, Matching, and Scenario-Based Questions  
**Date:** April 08, 2026  
**Exam Code:** AIF-C01  

---

## **1. Executive Summary & Exam Strategy**

The **AWS Certified AI Practitioner (AIF-C01)** is a foundational certification designed for business leaders, product managers, data analysts, and IT professionals who need to understand AI, Machine Learning (ML), and Generative AI concepts on AWS. Unlike engineering-focused exams, this test validates your ability to:

1. **Identify** appropriate AWS AI/ML services for specific business problems.
2. **Understand** the ML lifecycle and MLOps best practices.
3. **Apply** Responsible AI principles and governance frameworks.
4. **Differentiate** between managed services (e.g., Bedrock) and customizable platforms (e.g., SageMaker).

### **Key Question Types to Master**

* **Ordering:** Tests your knowledge of workflows (e.g., ML lifecycle steps, pipeline execution order).
* **Matching:** Tests your ability to associate services with their primary use cases or capabilities.
* **Scenario-Based:** Tests your decision-making skills in real-world business contexts (e.g., "Which service minimizes operational overhead for X?").

---

## **2. Core Concepts & Service Differentiation**

### **Amazon Bedrock vs. Amazon SageMaker AI**

This is the most critical comparison on the exam.

| Feature              | Amazon Bedrock                                                       | Amazon SageMaker AI                                                       |
|:-------------------- |:-------------------------------------------------------------------- |:------------------------------------------------------------------------- |
| **Primary Function** | Accessing/using pre-trained Foundation Models (FMs) for GenAI tasks. | Building, training, and deploying custom ML models from scratch.          |
| **User Expertise**   | Low/No ML expertise required. Serverless.                            | Requires Data Science/ML Engineering expertise.                           |
| **Customization**    | Limited to Prompt Engineering, Fine-Tuning, and RAG.                 | Full control over architecture, hyperparameters, and training data.       |
| **Infrastructure**   | Fully Managed (Serverless). No GPU management.                       | Managed but requires instance selection (or Serverless Inference option). |
| **Best For**         | Chatbots, Content Generation, Summarization, Semantic Search.        | Predictive Analytics, Custom Computer Vision, Specialized NLP.            |

### **Specialized AI Services Cheat Sheet**

* **Amazon Rekognition:** Image/Video analysis (Object detection, Face recognition). *Custom Labels* for custom object detection.
* **Amazon Textract:** OCR for documents (Extracts text, forms, tables from PDFs/Images).
* **Amazon Comprehend:** NLP for text analysis (Sentiment, Entities, Key Phrases). *Comprehend Medical* for clinical data.
* **Amazon Lex:** Build conversational interfaces (Chatbots/Voice bots). Uses ASR and NLU.
* **Amazon Polly:** Text-to-Speech (Converts text to lifelike audio).
* **Amazon Translate:** Neural Machine Translation.
* **Amazon Personalize:** Real-time personalized recommendations.
* **Amazon Kendra:** Intelligent Enterprise Search (Natural language search over unstructured data).
* **Amazon Q Business:** Generative AI-powered assistant for enterprise data (Connects to structured/unstructured sources).

---

## **3. Practice Questions: Ordering (20 Questions)**

*Instructions: Arrange the steps in the correct chronological order.*

### **Q1: The Machine Learning Lifecycle**

**Steps:**

1. Train and Tune
2. Deploy and Monitor
3. Data Preparation
4. Inference

> **Correct Order:** 3 -> 1 -> 2 -> 4  
> **Explanation:** You must prepare data first, then train/tune the model, deploy it to an endpoint, and finally perform inference (predictions).

### **Q2: SageMaker MLOps Pipeline Execution**

**Steps:**

1. Register Model
2. Evaluate Model
3. Train Model
4. Create Pipeline Definition

> **Correct Order:** 4 -> 3 -> 2 -> 1  
> **Explanation:** Define the pipeline DAG first. Then execute: Train -> Evaluate -> Register (if successful).

### **Q3: Automated Model Approval Workflow**

**Steps:**

1. Trigger Approval Process
2. Deploy Model to Production
3. Evaluate Model Quality
4. Register New Model Version

> **Correct Order:** 4 -> 3 -> 1 -> 2  
> **Explanation:** Register the model -> Auto-evaluate metrics -> Trigger human approval -> Deploy upon approval.

### **Q4: Building a GenAI App with Bedrock**

**Steps:**

1. Choose a Foundation Model (FM)
2. Define the Prompt
3. Invoke the Bedrock API
4. Integrate with Application Logic

> **Correct Order:** 1 -> 2 -> 3 -> 4  
> **Explanation:** Select FM -> Craft Prompt -> Call API -> Handle Response in App.

### **Q5: Responsible AI Risk Management**

**Steps:**

1. Assess Risk
2. Establish Governance Framework
3. Implement Mitigations
4. Identify Stakeholders

> **Correct Order:** 2 -> 4 -> 1 -> 3  
> **Explanation:** Set Framework -> Identify Who is affected -> Assess Risks -> Implement Controls.

### **Q6: IDP with Bedrock Data Automation**

**Steps:**

1. Store Documents in Amazon S3
2. Call Bedrock Data Automation API
3. Process Documents
4. Retrieve Structured Output

> **Correct Order:** 1 -> 2 -> 3 -> 4  
> **Explanation:** Data in S3 -> Trigger API -> Service Processes -> Return JSON/Structured Data.

### **Q7: Configuring Deterministic GenAI Output**

**Steps:**

1. Set `top_p` to a high value (e.g., 0.9)
2. Set `temperature` to a low value (e.g., 0.1)
3. Send the request to the model
4. Construct the prompt with context

> **Correct Order:** 4 -> 1 -> 2 -> 3  
> **Explanation:** Prompt first. Then set parameters (High top_p restricts token pool; Low temp reduces randomness). Then send.

### **Q8: Rekognition Custom Labels Workflow**

**Steps:**

1. Create a Project and Dataset
2. Label Your Images
3. Train a Model
4. Deploy the Model

> **Correct Order:** 1 -> 2 -> 3 -> 4  
> **Explanation:** Setup -> Label Data (Ground Truth) -> Train -> Deploy Endpoint.

### **Q9: RAG Pipeline Sequence**

**Steps:**

1. Ingest and Embed Documents
2. Query Vector Database
3. Generate Response with LLM
4. Retrieve Relevant Context

> **Correct Order:** 1 -> 4 -> 2 -> 3  
> **Correction/Refinement:** Actually, the flow is: 1 (Ingest) -> User Query -> 4 (Retrieve Context from DB) -> 2 (Wait, Querying IS retrieving). Let's refine:  
> **Refined Steps:** 1. Ingest/Embed -> 2. User Query -> 3. Retrieve Context (Vector Search) -> 4. Augment Prompt & Generate.  
> **Based on provided options:** 1 -> 4 (Retrieve) -> 2 (Query/Match logic) -> 3 (Generate). *Note: In exam, look for: Ingest -> Retrieve -> Augment -> Generate.*

### **Q10: SageMaker Pipeline Management**

**Steps:**

1. View Pipeline Execution Details
2. Stop the Pipeline
3. Run the Pipeline
4. Define the Pipeline Steps

> **Correct Order:** 4 -> 3 -> 1 -> 2  
> **Explanation:** Define -> Run -> Monitor (View) -> Stop (if needed).

### **Q11: S3 Encryption for ML Data**

**Steps:**

1. Go to Amazon S3 Console
2. Select Target Bucket
3. Navigate to Properties/Encryption Tab
4. Enable Server-Side Encryption

> **Correct Order:** 1 -> 2 -> 3 -> 4

### **Q12: SageMaker Multi-Model Endpoint (MME)**

**Steps:**

1. Package Models into Archive
2. Create MME Configuration
3. Configure Model Loading Script
4. Deploy Models to S3

> **Correct Order:** 4 -> 1 -> 3 -> 2  
> **Explanation:** Models to S3 -> Zip them -> Write Loader Script -> Create Endpoint Config.

### **Q13: Web App Integration with Bedrock**

**Steps:**

1. Develop Backend Logic (Lambda)
2. Authenticate with Bedrock (IAM)
3. Design Frontend UI
4. Make API Call to Bedrock

> **Correct Order:** 3 -> 1 -> 2 -> 4  
> **Explanation:** UI -> Backend -> Auth -> API Call.

### **Q14: Cross-Account MLOps**

**Steps:**

1. Share Model Groups
2. Set Up Cross-Account IAM Roles
3. Deploy in Target Account
4. Train in Source Account

> **Correct Order:** 2 -> 4 -> 1 -> 3  
> **Explanation:** Permissions first -> Train -> Share Registry Entry -> Deploy in Target.

### **Q15: SageMaker Canvas Workflow**

**Steps:**

1. Connect to Data Source
2. Cleanse/Transform Data
3. Train Model (AutoML)
4. Deploy Model

> **Correct Order:** 1 -> 2 -> 3 -> 4

### **Q16: Textract Document Analysis**

**Steps:**

1. Upload Document to S3
2. Pre-process (if needed)
3. Call Textract API
4. Analyze JSON Results

> **Correct Order:** 1 -> 2 -> 3 -> 4

### **Q17: Bedrock Knowledge Bases Setup**

**Steps:**

1. Prepare and Ingest Data
2. Create Knowledge Base
3. Configure Vector Store
4. Query Knowledge Base

> **Correct Order:** 3 -> 1 -> 2 -> 4  
> **Explanation:** Setup Vector DB -> Ingest Data -> Create KB Link -> Query.

### **Q18: Rekognition Facial Recognition**

**Steps:**

1. Create Collection
2. Index Faces (Register Users)
3. Detect Faces in Test Image
4. Compare/Search Collection

> **Correct Order:** 1 -> 2 -> 3 -> 4

### **Q19: Comprehend Sentiment Analysis**

**Steps:**

1. Provide Text Input
2. Call Comprehend API
3. Receive Sentiment Score
4. Interpret Result

> **Correct Order:** 1 -> 2 -> 3 -> 4

### **Q20: Polly Text-to-Speech**

**Steps:**

1. Prepare Input Text
2. Choose Voice/Format
3. Call Polly API
4. Play/Save Audio

> **Correct Order:** 1 -> 2 -> 3 -> 4

---

## **4. Practice Questions: Matching (20 Questions)**

*Instructions: Match the Service (Left) with its Primary Use Case/Capability (Right).*

### **Set 1: Core Services**

| Service                | Match | Capability                                |
|:---------------------- |:-----:|:----------------------------------------- |
| 1. Amazon Bedrock      | **B** | A. Fine-tuning custom models from scratch |
| 2. Amazon SageMaker AI | **A** | B. Accessing pre-trained FMs for GenAI    |
| 3. Amazon Rekognition  | **D** | C. Extracting tables from PDFs            |
| 4. Amazon Textract     | **C** | D. Object/Face detection in images        |

### **Set 2: Capabilities**

| Service                | Match | Capability                                |
|:---------------------- |:-----:|:----------------------------------------- |
| 1. SageMaker Pipelines | **B** | A. Serverless FM access                   |
| 2. Bedrock Guardrails  | **C** | B. Orchestrating ML workflows             |
| 3. Amazon Lex          | **D** | C. Content filtering/Safety               |
| 4. Amazon Comprehend   | **E** | D. Conversational Interfaces (Chatbots)   |
| *(Extra)*              | **E** | E. NLP Text Analysis (Sentiment/Entities) |

### **Set 3: Characteristics**

| Service                           | Match | Characteristic                                         |
|:--------------------------------- |:-----:|:------------------------------------------------------ |
| 1. SageMaker Serverless Inference | **B** | A. Fully managed FM portfolio                          |
| 2. Amazon Bedrock                 | **A** | B. Auto-scaling for traditional ML models              |
| 3. Rekognition Custom Labels      | **C** | C. Custom CV models without infra mgmt                 |
| 4. Amazon Q Business              | **D** | D. Enterprise chatbot for structured/unstructured data |

### **Set 4: GenAI Workflow Roles**

| Service                     | Match | Role                                 |
|:--------------------------- |:-----:|:------------------------------------ |
| 1. Amazon OpenSearch        | **A** | A. Vector Store for Semantic Search  |
| 2. Amazon S3                | **C** | B. Model Registry                    |
| 3. DynamoDB                 | **D** | C. Object Storage for Data/Artifacts |
| 4. SageMaker Model Registry | **B** | D. NoSQL DB for App State            |

### **Set 5: Specific Use Cases**

| Service                       | Match | Use Case                             |
|:----------------------------- |:-----:|:------------------------------------ |
| 1. Amazon Personalize         | **B** | A. Text-to-Image Generation          |
| 2. Stable Diffusion (Bedrock) | **A** | B. Real-time Product Recommendations |
| 3. Amazon Polly               | **C** | C. Text-to-Speech                    |
| 4. Amazon Translate           | **D** | D. Language Translation              |

### **Set 6: Data Prep & Search**

| Service                  | Match | Function                          |
|:------------------------ |:-----:|:--------------------------------- |
| 1. AWS Glue DataBrew     | **A** | A. Visual Data Cleaning           |
| 2. AWS Glue              | **B** | B. ETL Service                    |
| 3. Amazon Fraud Detector | **C** | C. Real-time Fraud Identification |
| 4. Amazon Kendra         | **D** | D. Intelligent Enterprise Search  |

### **Set 7: MLOps Tools**

| Service                    | Match | Function                             |
|:-------------------------- |:-----:|:------------------------------------ |
| 1. SageMaker Projects      | **C** | A. End-to-End Pipeline Orchestration |
| 2. SageMaker Debugger      | **B** | B. Debugging Training Issues         |
| 3. SageMaker Data Wrangler | **D** | C. CI/CD Templates for MLOps         |
| 4. SageMaker Pipelines     | **A** | D. Visual Data Prep                  |

### **Set 8: Specialized AI**

| Service               | Match | Function                         |
|:--------------------- |:-----:|:-------------------------------- |
| 1. Amazon A2I         | **A** | A. Human-in-the-Loop Review      |
| 2. Amazon Textract    | **B** | B. Handwriting/Form Extraction   |
| 3. Comprehend Medical | **C** | C. Clinical Entity Extraction    |
| 4. Rekognition Video  | **D** | D. Activity Recognition in Video |

### **Set 9: Marketplaces & Dev Tools**

| Service                | Match | Function                          |
|:---------------------- |:-----:|:--------------------------------- |
| 1. Bedrock Marketplace | **A** | A. Discover 3rd Party FMs         |
| 2. SageMaker JumpStart | **B** | B. Pre-trained Models & Notebooks |
| 3. Amazon Q Developer  | **C** | C. AI Coding Companion            |
| 4. Amazon Neptune      | **D** | D. Graph Database                 |

### **Set 10: Data Analytics**

| Service              | Match | Function                      |
|:-------------------- |:-----:|:----------------------------- |
| 1. AWS Data Exchange | **A** | A. 3rd Party Data Marketplace |
| 2. Amazon QuickSight | **B** | B. BI Dashboards              |
| 3. Amazon Redshift   | **C** | C. Data Warehouse             |
| 4. Amazon Athena     | **D** | D. SQL Query on S3            |

---

## **5. Practice Questions: Scenario-Based (20 Questions)**

### **Q1: Customer Support Chatbot**

**Scenario:** A company wants a chatbot to answer FAQs using internal docs. The team has limited ML experience.
**Answer:** **Amazon Lex** (for conversation flow) + **Amazon Bedrock/Kendra** (for knowledge retrieval). If forced to choose one for the *interface*, it's Lex. If choosing the *intelligence*, it's Bedrock. *Exam Tip:* Lex is the standard for building the bot interface.

### **Q2: Marketing Copy Generator**

**Scenario:** Marketing team needs to generate email subject lines quickly. No infrastructure management desired.
**Answer:** **Amazon Bedrock**. It provides serverless access to FMs like Claude or Titan for text generation.

### **Q3: Financial Report Assistant Safety**

**Scenario:** A bank builds an AI assistant for employees. They need to prevent biased or inappropriate outputs.
**Answer:** **Amazon Bedrock Guardrails**. This feature specifically filters content and enforces safety policies.

### **Q4: Invoice Processing Automation**

**Scenario:** Process hundreds of PDF invoices daily. High accuracy, low maintenance.
**Answer:** **Amazon Bedrock Data Automation** (or **Amazon Textract** if structured forms are simple). Bedrock Data Automation is the newer, recommended "low code" IDP solution.

### **Q5: Custom Drug Discovery Model**

**Scenario:** R&D team needs full control over model architecture and training on proprietary data using PyTorch.
**Answer:** **Amazon SageMaker AI**. It allows custom code, framework selection, and deep customization.

### **Q6: Real-Time Sales Forecasting**

**Scenario:** Retailer needs real-time predictions for inventory. Standard time-series model. Cost-effective deployment.
**Answer:** **Amazon SageMaker Serverless Inference**. It scales automatically and charges only for compute time used.

### **Q7: Internal "Search Everything" Tool**

**Scenario:** Employees need to query both SQL databases and SharePoint documents using natural language.
**Answer:** **Amazon Q Business**. It connects to diverse data sources (structured and unstructured) and provides a unified conversational search interface.

### **Q8: Reverse Image Search**

**Scenario:** Photography site wants users to upload an image and find visually similar ones.
**Answer:** **Amazon Bedrock (Titan Multimodal Embeddings)** + **Amazon OpenSearch Serverless**. Convert images to vectors, store in OpenSearch, and perform similarity search.

### **Q9: Agentic AI Workflow Orchestration**

**Scenario:** Automate a multi-step AI workflow (Scrape -> Summarize -> Email). Needs version control and repeatability.
**Answer:** **Amazon SageMaker Pipelines** (for ML-heavy workflows) or **AWS Step Functions** (for general orchestration). In the context of AIF-C01, SageMaker Pipelines is often highlighted for MLOps.

### **Q10: Bias Detection in Hiring Algorithm**

**Scenario:** HR uses an ML model to screen resumes. They need to ensure no gender bias.
**Answer:** **Amazon SageMaker Clarify**. It detects bias in data and models during pre-training and post-training.

### **Q11: Multilingual Customer Feedback Analysis**

**Scenario:** Global company receives feedback in 10 languages. Needs sentiment analysis in English.
**Answer:** **Amazon Translate** (to translate to English) + **Amazon Comprehend** (to analyze sentiment).

### **Q12: Video Content Moderation**

**Scenario:** Social platform needs to detect unsafe content in uploaded videos automatically.
**Answer:** **Amazon Rekognition Video**. It can detect unsafe content, faces, and labels in video streams.

### **Q13: Low-Code ML for Business Analysts**

**Scenario:** Business analysts want to build churn prediction models without writing code.
**Answer:** **Amazon SageMaker Canvas**. It provides a visual, no-code interface for building ML models.

### **Q14: Secure Key Management for AI**

**Scenario:** Ensure encryption keys for ML data in S3 are managed securely and rotated automatically.
**Answer:** **AWS KMS (Key Management Service)**. Integrates with S3 for server-side encryption.

### **Q15: Real-Time Fraud Detection**

**Scenario:** E-commerce site needs to flag fraudulent transactions in milliseconds.
**Answer:** **Amazon Fraud Detector**. Purpose-built ML service for fraud detection.

### **Q16: Extracting Data from Handwritten Forms**

**Scenario:** Hospital needs to digitize old patient records with handwritten notes.
**Answer:** **Amazon Textract**. It has specialized capabilities for handwriting recognition.

### **Q17: Personalized Product Recommendations**

**Scenario:** E-commerce site wants "Customers who bought this also bought..." features.
**Answer:** **Amazon Personalize**. Managed service for real-time personalization.

### **Q18: Monitoring Model Drift**

**Scenario:** Deployed model's accuracy is dropping over time. Need to detect data drift.
**Answer:** **Amazon SageMaker Model Monitor**. It continuously monitors data quality and drift.

### **Q19: Generating Images from Text**

**Scenario:** Ad agency wants to create unique banner images from text descriptions.
**Answer:** **Amazon Bedrock** (using Stable Diffusion or Titan Image Generator models).

### **Q20: Compliance Auditing for AI**

**Scenario:** Financial firm needs to audit AI decisions for regulatory compliance.
**Answer:** **AWS Audit Manager** + **Amazon Bedrock Guardrails** (for logging and filtering). Audit Manager helps collect evidence of compliance.

---

## **6. Final Exam Tips**

1. **Read Carefully:** Look for keywords like "Lowest Operational Overhead" (points to Bedrock/Serverless), "Full Control" (points to SageMaker), "Real-time" (points to Endpoints/Personalize), and "Batch" (points to Batch Transform/Glue).
2. **Responsible AI is Key:** Expect 10-15% of questions on Bias, Fairness, Security, and Guardrails. Know what **SageMaker Clarify** and **Bedrock Guardrails** do.
3. **Know the Lifecycle:** Be able to recite the order: Data Prep -> Train -> Evaluate -> Deploy -> Monitor.
4. **Service Boundaries:** Don't confuse **Lex** (Chatbot builder) with **Bedrock** (LLM provider). Don't confuse **Textract** (OCR) with **Comprehend** (NLP).

*Good luck with your AIF-C01 exam!*
# AWS Certified AI Practitioner AIF-C01 Study Guide

*Ordering, Matching & Scenario Questions*

## Exam overview and structure

The AWS Certified AI Practitioner (AIF-C01) exam validates a candidate's ability to understand AI,
machine learning (ML) and generative AI concepts, and to determine appropriate AWS services for
common use cases. The exam guide describes several question formats - multiple choice, multiple
response, ordering, matching and case study (scenario) questions 1. Ordering questions present 3-5
actions that must be placed in the correct sequence; matching questions require aligning responses
to prompts; and case-study questions provide a scenario with two or more questions. The exam
includes 50 scored questions (plus 15 unscored) and uses a scaled score between 100-1 000 with a
passing score of 700 2.

### Domain weightings

| Domain                                  | Weighting | Key capabilities                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------- | ---------:| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 - Fundamentals of AI and ML           | 20 %      | Understand AI/ML terms (models, deep learning, neural networks, computer vision, NLP, data types); compare supervised, unsupervised and reinforcement learning; recognise use cases and ML techniques (regression, classification, clustering); describe the ML pipeline and sources of models.                                                                                                                                                                                      |
| 2 - Fundamentals of Generative AI       | 24 %      | Explain generative AI concepts (tokens, embeddings, transformer-based LLMs, foundation models); identify use cases (content generation, translation, chatbots, recommendation engines); understand foundation model lifecycles and factors influencing model selection; explain advantages and limitations of generative AI.                                                                                                                                                         |
| 3 - Applications of Foundation Models   | 28 %      | Describe design considerations when selecting pre-trained models (cost, latency, modality, multilingual support, model size); understand inference parameters (temperature, input/ output length); explain retrieval-augmented generation (RAG) and vector stores; identify AWS services for storage (OpenSearch Service, Aurora, Neptune); describe prompt-engineering techniques (chain-of-thought, zero-shot, few-shot); explain fine-tuning and evaluation of foundation models. |
| 4 - Guidelines for Responsible AI       | 14 %      | Identify bias, fairness, inclusivity, robustness and safety concerns; understand tools like Amazon Bedrock Guardrails to filter harmful content and perform contextual grounding; describe principles of transparent and explainable models (e.g., Model Cards, human-centred design).                                                                                                                                                                                               |
| 5 - Security, Compliance and Governance | 14 %      | Identify AWS services for securing AI systems (IAM, encryption, Macie, PrivateLink); understand data lineage and cataloguing; describe best practices for secure data engineering and privacy (encryption at rest and in transit, access control); recognise governance and compliance standards (ISO, SOC) and supporting AWS services like AWS Config, Amazon Inspector and Audit Manager.                                                                                         |

## Key exam insights

- Depth of knowledge - candidates should prepare for deeper coverage than other foundational certifications. An account from a beta test-taker notes that the exam tests AI/ML concepts that have nothing to do with AWS services, such as over- or under-fitting and understanding how inference parameters like temperature affect output 11. Simply memorising services is insufficient.
- Generative AI emphasis - because the exam's focus is on generative AI, AI/ML and related AWS tools, it's essential to understand generative AI concepts, prompt engineering and foundation models 12. Knowledge of services like Amazon Bedrock, SageMaker, Comprehend, Transcribe and related ML lifecycle concepts is required 13.
- Hands-on understanding - practice labs, challenge labs and sandboxes help candidates understand AWS services and the ML workflow. Hands-on activities complement theoretical study and build confidence for scenario-based questions 14.

## Prevalent topics and concepts likely to appear

1. AI/ML fundamentals: definitions of AI, ML, deep learning, neural networks; differences between supervised, unsupervised and reinforcement learning; types of inferencing (batch vs real-time); data types (labeled vs unlabeled, structured vs unstructured) 15.
2. ML development lifecycle and MLOps: data collection, exploratory data analysis, preprocessing, feature engineering, model training, hyperparameter tuning, evaluation, deployment and monitoring 16. Understand model performance metrics such as accuracy, F1 score, Area Under the Curve (AUC), and the business metrics that evaluate ROI 17.
3. Generative AI basics: tokens, embeddings, foundation models, prompt engineering, diffusion models and multi-modal models 18. Understand advantages (adaptability, responsiveness) and disadvantages (hallucinations, nondeterminism) of generative AI 19.
4. Foundation model lifecycle and RAG: selection criteria (cost, latency, modality, multilingual support); customizing models via pre-training, fine-tuning and in-context learning; retrieval-augmented generation (RAG) that couples foundation models with external knowledge bases 6. RAG improves accuracy by retrieving relevant information and combining it with generative outputs 20.
5. Prompt engineering techniques: chain-of-thought prompting encourages intermediate reasoning steps, improving complex reasoning 21. Zero-shot chain-of-thought uses "Let's think step by step" to elicit reasoning 22. Few-shot prompting and prompt templates help control context and achieve more predictable outputs.
6. Amazon Bedrock and foundation models: Bedrock provides serverless access to foundation models via a unified API and automatically scales based on demand 23. It allows organisations to select models from providers such as Amazon Titan, Anthropic Claude, AI21 Labs, Cohere, Meta Llama and Stability AI 24. Fine-tuning and RAG improve customization and accuracy 25.
7. Responsible AI and Bedrock Guardrails: Guardrails inspect inputs and outputs, blocking harmful content and enforcing policies. They include content filters (hate speech, insults, violence), denied topics, word filters and PII redaction; contextual grounding checks ensure responses are grounded in source material 8.
8. Security and governance: AWS IAM, encryption, Macie, Guardrails; data lineage and cataloging; compliance frameworks (ISO, SOC); governance frameworks like the Generative AI Security Scoping Matrix 10.
9. Evaluation metrics: metrics like ROUGE, BLEU and BERTScore are used for evaluating text summarization or translation. ROUGE measures overlap of n-grams, longest common sequences and skip-bigrams between a generated summary and reference 26. BLEU measures n-gram precision with a brevity penalty to avoid rewarding overly short outputs 27. BERTScore leverages contextual embeddings to compute semantic similarity and aggregates precision, recall and F1 scores 28.

## Sample ordering questions 20

### 1 - ML development lifecycle

**Task:** Order these steps in a typical ML development lifecycle:

- Feature engineering
- Data collection
- Model deployment
- Model training
- Monitoring & feedback

**Correct order:** Data collection -> Feature engineering -> Model training -> Model deployment -> Monitoring & feedback.

**Explanation:** Data must be collected and prepared before feature engineering. The engineered features feed into training. After training, you deploy the model and monitor its performance; feedback may prompt re-training 16.

### 2 - Foundation model lifecycle

**Task:** Arrange these stages in the lifecycle of a foundation model:

- Fine-tuning on domain-specific data
- Feedback and iteration
- Pre-training on large datasets
- Deployment into production
- Data selection and curation

**Correct order:** Data selection & curation -> Pre-training -> Fine-tuning -> Deployment -> Feedback & iteration 29.

**Explanation:** Start with collecting and cleaning a broad dataset, pre-train the model, fine-tune it for a specific domain, deploy to production, then collect feedback for further refinement.

### 3 - Generative AI application design with Amazon Bedrock

**Task:** Put these actions in order when designing a generative AI application using Amazon Bedrock:

- Integrate the Bedrock API into your application
- Choose an appropriate foundation model (e.g., Amazon Titan, Anthropic Claude)
- Configure guardrails and safety policies
- Test and evaluate responses
- Design your prompt and user experience

**Correct order:** Choose a model -> Design prompt & user experience -> Configure guardrails -> Integrate Bedrock API -> Test and evaluate.

**Explanation:** Select a model first so you can tailor the prompt and UX. Setting up guardrails early ensures safety. Integration and testing occur after design choices are made 23 8.

### 4 - Retrieval-Augmented Generation (RAG)

**Task:** Order the steps involved in a RAG pipeline:

- Retrieve relevant documents from a vector store
- Generate a response using the foundation model
- Embed the user query into vector space
- Combine retrieved documents with the query context
- Index domain documents into a vector database

**Correct order:** Index domain documents -> Embed the user query -> Retrieve relevant documents -> Combine retrieved documents with query -> Generate response 20.

**Explanation:** The vector database must be built ahead of time. When a query arrives, it is embedded and used to retrieve related documents; the context is appended to the query before generating a response.

### 5 - Prompt engineering workflow

**Task:** Sequence these actions for creating an effective prompt:

- Experiment with few-shot or zero-shot examples
- Identify the task and desired output format
- Iterate by adjusting instructions and temperature settings
- Provide context and negative prompts (if needed)

**Correct order:** Identify task & desired output -> Provide context & negative prompts -> Experiment with few-shot/zero-shot examples -> Iterate by adjusting instructions and parameters 30.

**Explanation:** Define the task first, then supply necessary context. Use prompting techniques and iterate to refine clarity and quality.

### 6 - Model evaluation process

**Task:** Arrange these steps when evaluating a foundation model:

- Select an evaluation metric (e.g., ROUGE, BLEU, BERTScore)
- Run the model on a benchmark dataset
- Compare model outputs to reference answers
- Analyze results and decide on improvements
- Define success criteria and business metrics

**Correct order:** Define success criteria & business metrics -> Select an evaluation metric -> Run the model on benchmark data -> Compare outputs to references -> Analyze results and decide improvements 31.

**Explanation:** Determine what "good" looks like and choose appropriate metrics. After evaluation, analyze the results to identify weaknesses and plan improvements.

### 7 - Data pipeline for supervised learning

**Task:** Order the steps for preparing data for a supervised learning model:

- Label the data
- Split the dataset into training, validation and test sets
- Perform exploratory data analysis (EDA)
- Handle missing values and outliers
- Engineer features and normalize values

**Correct order:** Perform EDA -> Handle missing values & outliers -> Label the data -> Engineer features & normalize -> Split into train/validation/test sets.

**Explanation:** EDA helps you understand the data before cleaning and labeling. Once features are engineered, data can be split for training and evaluation.

### 8 - Responsible AI risk assessment

**Task:** Sequence the following activities when assessing risks for a generative AI solution:

- Identify potential biases and fairness concerns
- Evaluate regulatory and compliance requirements
- Perform a data diversity and inclusivity check
- Design mitigation strategies and guardrails
- Document findings and accountability procedures

**Correct order:** Identify biases & fairness concerns -> Perform diversity & inclusivity checks -> Evaluate regulatory requirements -> Design mitigation strategies & guardrails -> Document findings & procedures 32.

**Explanation:** Begin with potential harms, assess data diversity, align with regulations, implement mitigations (e.g., guardrails), then document.

### 9 - Using Amazon Bedrock Guardrails

**Task:** Put the steps in order to apply Bedrock Guardrails:

- Create a guardrail configuration (define content filters, denied topics, word filters, PII redaction)
- Apply the guardrail to your foundation model invocations
- Monitor guardrail events and violations
- Define contextual grounding checks for RAG
- Adjust guardrail settings based on feedback

**Correct order:** Create a guardrail configuration -> Define contextual grounding checks -> Apply the guardrail to model invocations -> Monitor guardrail events -> Adjust settings based on feedback 8.

**Explanation:** You must design the guardrail first (filters, denied topics, PII settings) and set up grounding checks. Apply it to model calls, monitor its effectiveness and adjust as needed.

### 10 - Selecting an AWS AI service

**Task:** Arrange the steps to choose the most appropriate AWS AI service for a given use case:

- Define the business problem and desired outcome
- Identify data types and volume
- Determine latency, cost and scalability requirements
- Evaluate relevant AWS AI services (e.g., Comprehend, Lex, Bedrock, SageMaker)
- Prototype and test the selected service

**Correct order:** Define the business problem -> Identify data types & volume -> Determine latency, cost & scalability needs -> Evaluate AWS services -> Prototype & test.

**Explanation:** Start with the problem and data characteristics; then consider requirements; evaluate candidate services; finally, prototype and test to validate fit.

### 11 - Fine-tuning a foundation model

**Task:** Order the steps for fine-tuning a pre-trained foundation model:

- Collect domain-specific data and ensure it is representative
- Preprocess and label the data
- Select the base model and fine-tuning strategy (instruction tuning, RLHF, etc.)
- Train the model on the prepared dataset
- Evaluate performance and adjust hyperparameters

**Correct order:** Collect domain-specific data -> Preprocess & label -> Select the base model & fine-tuning strategy -> Train the model -> Evaluate and adjust.

**Explanation:** Data quality and preprocessing come first; then choose the base model and training approach; after training, evaluate and tune hyperparameters 33.

### 12 - MLOps deployment pipeline

**Task:** Arrange the actions for deploying an ML model using MLOps principles:

- Package the model and its dependencies into a container
- Automate CI/CD pipelines for model builds and tests
- Deploy the container to a scalable environment (ECS/EKS)
- Monitor performance and trigger retraining when necessary
- Version control code, data and model artefacts

**Correct order:** Version control code/data/models -> Package the model -> Automate CI/CD pipelines -> Deploy to a scalable environment -> Monitor & trigger retraining.

**Explanation:** Versioning underpins reproducibility. Packaging, automation and deployment follow. Monitoring closes the loop for continuous improvement.

### 13 - Evaluating generative AI risks

**Task:** Order the steps when assessing generative AI output risks:

- Check for hallucinations and factual errors
- Evaluate privacy and PII exposure
- Assess alignment with brand safety policies
- Solicit human review and feedback

**Correct order:** Assess brand safety alignment -> Evaluate privacy & PII exposure -> Check for hallucinations/factual errors -> Solicit human review.

**Explanation:** Safety and compliance come first. After addressing PII exposure, analyze hallucinations; human review finalizes the risk assessment.

### 14 - Handling data governance for AI

**Task:** Sequence the steps in an AI data governance program:

- Establish data lineage and cataloguing
- Define data retention and deletion policies
- Implement access controls and encryption
- Monitor data usage and compliance
- Conduct periodic audits and reviews

**Correct order:** Establish data lineage & cataloguing -> Define retention & deletion policies -> Implement access controls & encryption -> Monitor usage & compliance -> Conduct periodic audits & reviews 34.

**Explanation:** A governance program begins with understanding where data comes from (lineage), sets retention rules, applies security controls, monitors usage and regularly audits compliance.

### 15 - Deploying a conversational bot with Amazon Lex

**Task:** Put these steps in order when building a voice bot using Amazon Lex:

- Define intents and sample utterances
- Configure slot types and validation prompts
- Write AWS Lambda functions for fulfilment logic
- Build and test the bot in the Lex console
- Integrate the bot with an application or contact centre

**Correct order:** Define intents & sample utterances -> Configure slot types & validation -> Write fulfilment logic -> Build & test in Lex console -> Integrate with the application.

**Explanation:** You must design the conversational flow (intents/slots) before writing backend logic. After testing, integrate the bot into your environment.

### 16 - Creating a forecasting solution with Amazon Forecast

**Task:** Arrange the steps:

- Import historical time-series data into Amazon Forecast
- Define the dataset group and schema (target time series, item metadata, related time series)
- Choose a predictor (AutoML or Custom algorithm)
- Train the predictor and generate forecasts
- Evaluate accuracy and deploy the model

**Correct order:** Define dataset group & schema -> Import historical data -> Choose a predictor -> Train & generate forecasts -> Evaluate accuracy & deploy.

**Explanation:** Set up the dataset group first, then load data. Choose an algorithm or let AutoML decide. After training, evaluate and deploy.

### 17 - Implementing sentiment analysis with Amazon Comprehend

**Task:** Sequence these actions:

- Configure an IAM role with appropriate permissions
- Prepare and upload text data to Amazon S3
- Create a custom classifier or use the built-in sentiment detection API
- Call the Comprehend API to analyze the text
- Interpret results and build visualizations

**Correct order:** Configure IAM role -> Prepare & upload data -> Create classifier or choose built-in API -> Call Comprehend API -> Interpret results & visualize.

**Explanation:** Security and data preparation must precede using Comprehend. After classification, interpret results for business insights.

### 18 - Protecting AI systems with IAM and encryption

**Task:** Put these actions in order:

- Define IAM policies and roles for least-privilege access
- Enable server-side encryption for storage (Amazon S3, databases)
- Enforce encryption in transit using TLS/HTTPS
- Monitor access logs and audit trails
- Rotate keys and credentials regularly

**Correct order:** Define IAM policies & roles -> Enable encryption at rest -> Enforce encryption in transit -> Monitor access logs & audit trails -> Rotate keys & credentials.

**Explanation:** Start with least-privilege access control, then implement encryption at rest and in transit. Monitoring and key rotation are ongoing tasks for secure operations 35.

### 19 - Evaluating generative AI models with metrics

**Task:** Sequence the evaluation steps:

- Collect a set of reference texts for your task
- Generate candidate outputs using the model
- Compute ROUGE scores to measure n-gram overlap 26
- Compute BLEU scores for n-gram precision with brevity penalty 27
- Compute BERTScore to evaluate semantic similarity 36
- Compare the metrics and interpret strengths & weaknesses

**Correct order:** Collect reference texts -> Generate candidate outputs -> Compute ROUGE scores -> Compute BLEU scores -> Compute BERTScore -> Compare metrics and interpret.

**Explanation:** Start with reference data and candidate outputs. Evaluate using different metrics - ROUGE for recall and fluency, BLEU for precision, BERTScore for semantic similarity - then compare results.

### 20 - Building a recommendation system with Amazon Personalize

**Task:** Arrange the steps:

- Prepare interaction, user and item datasets and import them into Personalize
- Create a dataset group and schemas
- Choose a recipe (HRNN, SIMS, User Personalization)
- Train the model and create a solution version
- Create a campaign and integrate the API in your application

**Correct order:** Create dataset group & schemas -> Prepare & import datasets -> Choose a recipe -> Train & create solution version -> Create campaign & integrate API.

**Explanation:** Define the dataset group structure first, then import data. Selecting a recipe informs training; after training you deploy a campaign and integrate it into your application.

## Sample matching questions 20

Each matching question consists of prompts in the left column and responses to be matched from the right column.

### 1 - AI concept definitions

| Prompt                 | Response to match                                                               |
| ---------------------- | ------------------------------------------------------------------------------- |
| AI                     | a) Algorithms that learn patterns from data and make predictions                |
| Machine learning       | b) An umbrella term for systems that perform tasks requiring human intelligence |
| Deep learning          | c) A subset of ML using neural networks with many layers                        |
| Reinforcement learning | d) An ML paradigm where an agent learns from rewards and punishments            |

**Matches:** Correct matches: AI -> b; Machine learning -> a; Deep learning -> c; Reinforcement learning -> d.

### 2 - AWS AI services and typical use cases

| Prompt             | Response to match                                                  |
| ------------------ | ------------------------------------------------------------------ |
| Amazon Comprehend  | a) Sentiment analysis and entity recognition for text              |
| Amazon Lex         | b) Voice and chat chatbots with natural-language understanding     |
| Amazon Rekognition | c) Image and video analysis (object detection, facial recognition) |
| Amazon Textract    | d) Extracting text and tables from documents                       |
| Amazon Personalize | e) Recommendation engines using collaborative filtering            |

**Matches:** Comprehend -> a; Lex -> b; Rekognition -> c; Textract -> d; Personalize -> e.

### 3 - Generative AI model providers in Amazon Bedrock

| Prompt             | Response to match                                                          |
| ------------------ | -------------------------------------------------------------------------- |
| Amazon Titan       | a) Multilingual text generation and comprehension models from AI21 Labs    |
| Anthropic Claude   | b) Amazon's own family of foundation models optimized for various tasks    |
| AI21 Labs Jurassic | c) Advanced conversational models known for safety and reliability         |
| Cohere Command     | d) Models specialised in summarisation, classification and text generation |
| Stability AI       | e) Image generation models for creative and commercial uses                |

**Matches:** Amazon Titan -> b; Anthropic Claude -> c; AI21 Labs Jurassic -> a; Cohere Command -> d; Stability AI -> e.

### 4 - Evaluation metrics

| Prompt                     | Response to match                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| ROUGE                      | a) Measures n-gram overlap and longest common subsequences in summaries                      |
| BLEU                       | b) Computes n-gram precision with a brevity penalty; widely used for machine translation     |
| BERTScore                  | c) Uses contextual embeddings from transformer models to measure semantic similarity         |
| F1 score                   | d) Harmonic mean of precision and recall                                                     |
| AUC (Area Under ROC curve) | e) Measures the probability that a model ranks a positive example higher than a negative one |

**Matches:** ROUGE -> a; BLEU -> b; BERTScore -> c; F1 score -> d; AUC -> e.

### 5 - MLOps components

| Prompt                                                 | Response to match                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------------- |
| Version control                                        | a) Monitors model behaviour and triggers alerts when drift is detected    |
| Continuous integration / continuous deployment (CI/CD) | b) Stores and tracks changes to code, data and models                     |
| Containerisation                                       | c) Packages models and dependencies into portable artefacts               |
| Model registry                                         | d) Repository for storing, versioning and approving models for deployment |
| Model monitor                                          | e) Automates building, testing and deployment of ML code and models       |

**Matches:** Version control -> b; CI/CD -> e; Containerisation -> c; Model registry -> d; Model monitor -> a.

### 6 - Prompt engineering techniques

| Prompt                 | Response to match                                                   |
| ---------------------- | ------------------------------------------------------------------- |
| Zero-shot prompting    | a) Model is given only the task description; no examples            |
| Few-shot prompting     | b) Model is given a task description and multiple examples          |
| Chain-of-thought (CoT) | c) Prompts encourage intermediate reasoning steps for complex tasks |
| Negative prompting     | d) Specifies what the model should avoid saying                     |
| Prompt templates       | e) Reusable structures with slots for variables and instructions    |

**Matches:** Zero-shot -> a; Few-shot -> b; Chain-of-thought -> c; Negative prompting -> d; Prompt templates -> e.

### 7 - Guardrails features

| Prompt                        | Response to match                                                       |
| ----------------------------- | ----------------------------------------------------------------------- |
| Content filters               | a) Detect and redact personally identifiable information (PII)          |
| Denied topics                 | b) Block harmful content categories like hate speech and violence       |
| Word filters                  | c) Define subjects that a model should refuse to discuss                |
| Sensitive information filters | d) Block specific words or phrases for brand protection                 |
| Contextual grounding checks   | e) Ensure responses align with source material to reduce hallucinations |

**Matches:** Content filters -> b; Denied topics -> c; Word filters -> d; Sensitive information filters -> a; Contextual grounding checks -> e.

### 8 - Types of learning

| Prompt                   | Response to match                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| Supervised learning      | a) Learning without labeled data; goal is to find hidden structure                             |
| Unsupervised learning    | b) Learning with labeled data; objective is to map inputs to outputs                           |
| Reinforcement learning   | c) Learning via rewards and punishments in an environment                                      |
| Self-supervised learning | d) Learning by predicting part of the input from other parts (e.g., masked language modelling) |
| Transfer learning        | e) Reusing knowledge from one domain to improve performance in another                         |

**Matches:** Supervised -> b; Unsupervised -> a; Reinforcement -> c; Self-supervised -> d; Transfer learning -> e.

### 9 - Foundation model customization approaches

| Prompt                                            | Response to match                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------------------- |
| Pre-training                                      | a) Training on a large general corpus to learn broad representations              |
| Fine-tuning                                       | b) Updating model weights on a smaller, domain-specific dataset                   |
| In-context learning                               | c) Providing examples within the prompt to guide the model without weight updates |
| Retrieval-augmented generation (RAG)              | d) Combining external documents with model input for up-to-date answers           |
| Reinforcement learning from human feedback (RLHF) | e) Optimizing models using reward signals derived from human preferences          |

**Matches:** Pre-training -> a; Fine-tuning -> b; In-context learning -> c; RAG -> d; RLHF -> e.

### 10 - Model evaluation metrics by usage

| Prompt                    | Response to match                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| Accuracy                  | a) Fraction of correct predictions (for classification)                                  |
| Precision                 | b) TP / (TP + FP); how many predicted positives are actually positive                    |
| Recall                    | c) TP / (TP + FN); how many actual positives were captured                               |
| F1 score                  | d) Harmonic mean of precision and recall (2 x Precision x Recall / (Precision + Recall)) |
| Mean Absolute Error (MAE) | e) Average absolute difference between predicted and actual values (for regression)      |

**Matches:** Accuracy -> a; Precision -> b; Recall -> c; F1 score -> d; MAE -> e.

### 11 - Data types and examples

| Prompt            | Response to match                             |
| ----------------- | --------------------------------------------- |
| Structured data   | a) Audio recordings of customer support calls |
| Unstructured data | b) Images and videos                          |
| Time-series data  | c) Sensor readings recorded over time         |
| Tabular data      | d) Sales transactions in a relational table   |
| Text data         | e) Customer reviews and social media posts    |

**Matches:** Structured data -> d; Unstructured -> b; Time-series -> c; Tabular -> d (structured & tabular overlap; here tabular is separate) but to avoid duplication we assign: Structured data -> d; Unstructured -> b; Time-series -> c; Tabular data -> d; Text data -> e.

### 12 - AWS services for security and governance

| Prompt              | Response to match                                                            |
| ------------------- | ---------------------------------------------------------------------------- |
| AWS IAM             | a) Identity and access management for defining roles and policies            |
| AWS Config          | b) Monitors and records configuration changes to AWS resources               |
| Amazon Inspector    | c) Automated vulnerability assessment for EC2, ECR and Lambda                |
| AWS Macie           | d) Discovering and classifying sensitive data stored in Amazon S3            |
| AWS Trusted Advisor | e) Provides best-practice recommendations for cost, security and performance |

**Matches:** IAM -> a; Config -> b; Inspector -> c; Macie -> d; Trusted Advisor -> e.

### 13 - Foundation model inference parameters

| Prompt                   | Response to match                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Temperature              | a) Controls randomness in generated responses; lower values produce more deterministic output |
| Max tokens               | b) Limits the length of the generated output                                                  |
| Top-k sampling           | c) Restricts sampling to the k most-likely next tokens                                        |
| Top-p (nucleus) sampling | d) Restricts sampling to the smallest set of tokens whose cumulative probability exceeds p    |
| Stop sequence            | e) Defines where generation should stop when certain patterns are detected                    |

**Matches:** Temperature -> a; Max tokens -> b; Top-k sampling -> c; Top-p sampling -> d; Stop sequence -> e.

### 14 - Responsible AI characteristics

| Prompt       | Response to match                                                      |
| ------------ | ---------------------------------------------------------------------- |
| Fairness     | a) The model performs equally well across different demographic groups |
| Bias         | b) Systematic error favouring certain groups or outcomes               |
| Inclusivity  | c) Data sets include diverse populations and viewpoints                |
| Robustness   | d) Model resilience to adversarial inputs or perturbations             |
| Transparency | e) Ability to explain how the model makes decisions (explainability)   |

**Matches:** Fairness -> a; Bias -> b; Inclusivity -> c; Robustness -> d; Transparency -> e.

### 15 - Security best practices

| Prompt                 | Response to match                                                             |
| ---------------------- | ----------------------------------------------------------------------------- |
| Encryption at rest     | a) Securing data while it is stored (e.g., server-side encryption in S3, EBS) |
| Encryption in transit  | b) Securing data while it is moving between systems (e.g., TLS)               |
| Least privilege        | c) Granting only the permissions necessary to perform a task                  |
| Key rotation           | d) Regularly changing cryptographic keys and credentials                      |
| Logging and monitoring | e) Capturing and analysing access and activity logs                           |

**Matches:** Encryption at rest -> a; Encryption in transit -> b; Least privilege -> c; Key rotation -> d; Logging and monitoring -> e.

### 16 - Types of inferencing

| Prompt              | Response to match                                                      |
| ------------------- | ---------------------------------------------------------------------- |
| Batch inference     | a) Model processes a large dataset on a schedule (e.g., nightly)       |
| Real-time inference | b) Model returns predictions immediately on user request               |
| Streaming inference | c) Model processes data continuously as it arrives                     |
| Edge inference      | d) Running models on local devices with limited connectivity           |
| Hybrid inference    | e) Combining local (edge) and cloud inference for latency and accuracy |

**Matches:** Batch -> a; Real-time -> b; Streaming -> c; Edge -> d; Hybrid -> e.

### 17 - Generative AI limitations and risks

| Prompt                      | Response to match                                                         |
| --------------------------- | ------------------------------------------------------------------------- |
| Hallucinations              | a) Model confidently produces inaccurate or invented information          |
| Nondeterminism              | b) Same prompt can yield different outputs due to sampling                |
| Interpretability challenges | c) Difficulty in understanding why the model produced a particular output |
| Bias amplification          | d) Model outputs reinforce stereotypes present in training data           |
| Prompt injection            | e) Malicious instructions embedded in input to manipulate model behaviour |

**Matches:** Hallucinations -> a; Nondeterminism -> b; Interpretability challenges -> c; Bias amplification -> d; Prompt injection -> e.

### 18 - AWS AI use cases

| Prompt                | Response to match                                             |
| --------------------- | ------------------------------------------------------------- |
| Amazon Kendra         | a) Intelligent search across enterprise documents             |
| Amazon Forecast       | b) Time-series forecasting for demand or resource planning    |
| Amazon Fraud Detector | c) Detecting fraudulent activities using ML                   |
| Amazon HealthLake     | d) Storing and analyzing healthcare data with ML capabilities |
| Amazon Q              | e) Conversational assistant for coding and AWS questions      |

**Matches:** Kendra -> a; Forecast -> b; Fraud Detector -> c; HealthLake -> d; Amazon Q -> e.

### 19 - Data pre-processing techniques

| Prompt           | Response to match                                                                 |
| ---------------- | --------------------------------------------------------------------------------- |
| Standardization  | a) Transforming features to have zero mean and unit variance                      |
| Normalization    | b) Scaling features to a specified range (e.g., 0 to 1)                           |
| One-hot encoding | c) Converting categorical variables into binary vectors                           |
| Imputation       | d) Filling missing values using statistical methods or algorithms                 |
| Outlier removal  | e) Detecting and eliminating data points that deviate significantly from the rest |

**Matches:** Standardization -> a; Normalization -> b; One-hot encoding -> c; Imputation -> d; Outlier removal -> e.

### 20 - Model tuning techniques

| Prompt                | Response to match                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Hyperparameter tuning | a) Systematically exploring combinations of hyperparameters (learning rate, batch size) to improve performance |
| Early stopping        | b) Stopping training when performance on a validation set stops improving to avoid overfitting                 |
| Cross-validation      | c) Splitting data into multiple folds to evaluate model stability                                              |
| Regularization        | d) Adding penalties (L1, L2, dropout) to reduce overfitting                                                    |
| Ensembling            | e) Combining predictions from multiple models to improve accuracy                                              |

**Matches:** Hyperparameter tuning -> a; Early stopping -> b; Cross-validation -> c; Regularization -> d; Ensembling -> e.

## Sample scenario-based questions 20

These questions provide a scenario and multiple possible approaches. The correct answer is shown in bold followed by an explanation.

### 1 - Selecting a generative AI service

**Scenario:** A media company wants to build a generative content engine that can produce short marketing posts in multiple languages. They need easy access to different foundation models, safety controls to prevent harmful content and a serverless deployment to avoid managing infrastructure. Which AWS service meets these requirements?

**Options:**

1. Use Amazon SageMaker to train a custom GPT-style model from scratch.
2. Use Amazon Bedrock to access models like Anthropic Claude and apply Bedrock Guardrails.
3. Use Amazon Comprehend for text generation.
4. Use Amazon Lex integrated with AWS Lambda to generate posts.

**Answer:** Option 2. Amazon Bedrock with Guardrails. Bedrock provides serverless access to multiple foundation models and includes guardrails for content filtering 23 8. SageMaker requires building and hosting models; Comprehend and Lex are not designed for generative multi-language content.

### 2 - Identifying model overfitting

**Scenario:** A data scientist trains an image-classification model and achieves 99 % accuracy on the training data but only 70 % on unseen test data. Which issue does this likely indicate, and what can be done to address it?

**Options:**

1. Underfitting; decrease model complexity.
2. Overfitting; apply regularization techniques and collect more diverse training data.
3. Data leakage; remove the leaked features.
4. Class imbalance; oversample the minority class.

**Answer:** Option 2. Overfitting and apply regularization. The large gap between training and test accuracy suggests overfitting. Techniques such as regularization, dropout and adding more diverse data help improve generalisation 17.

### 3 - Choosing an evaluation metric

**Scenario:** A research team is evaluating a generative summarization model and wants to measure how much of the reference summary is captured by the generated summary. Which metric should they emphasise?

**Options:**

1. BLEU
2. ROUGE
3. BERTScore
4. F1 score

**Answer:** Option 2. ROUGE. ROUGE measures n-gram overlap and longest common subsequences between generated and reference summaries 26, focusing on recall (how much of the reference content is recovered).

### 4 - Controlling randomness in a generative model

**Scenario:** During prompt testing, a user finds that the model sometimes produces creative but irrelevant responses. They want more deterministic outputs while still allowing some variation. Which inference parameter should they adjust?

**Options:**

1. Increase the maximum tokens
2. Lower the temperature
3. Increase top-k value
4. Add more few-shot examples

**Answer:** Option 2. Lower the temperature. Temperature controls randomness; lower values make outputs more deterministic.

### 5 - Recognising when AI/ML is not appropriate

**Scenario:** A retail company wants to use AI to predict the exact sales numbers for each product next month. The dataset is extremely small and past sales show unpredictable spikes due to unmeasured marketing campaigns. Why might AI/ML not be appropriate here?

**Options:**

1. Because the problem requires classification rather than regression.
2. Because the dataset lacks enough historical patterns; simpler forecasting methods or expert judgment might be more appropriate.
3. Because AWS does not provide forecasting services for retail.
4. Because AI cannot handle sales data with noise.

**Answer:** Option 2. Insufficient data and unpredictable external factors. AI/ML works best when historical data contains patterns. In cases with little data and external unknown factors, simple heuristics or expert judgment may outperform ML 38.

### 6 - Addressing bias in a training dataset

**Scenario:** An insurance company trains a model to predict claim fraud. After deployment, they discover that the model disproportionately flags claims from a specific demographic group. What is an appropriate first step in addressing this issue?

**Options:**

1. Collect more data from the affected group and perform a fairness evaluation.
2. Increase the model temperature to make predictions more random.
3. Remove all claims from the affected group.
4. Deploy Amazon Bedrock Guardrails.

**Answer:** Option 1. Collect more diverse data and evaluate fairness. Responsible AI requires identifying bias, assessing data diversity, and implementing mitigation strategies 32. Randomness or removal is not appropriate.

### 7 - Selecting a generative AI model for summarisation

**Scenario:** A legal firm wants to summarise lengthy contracts in plain language. They require a model fine-tuned for summarisation tasks with high accuracy and support for English only. Which Bedrock model provider should they consider?

**Options:**

1. Stability AI
2. AI21 Labs Jurassic
3. Cohere Command
4. Anthropic Claude

**Answer:** Option 3. Cohere Command. Cohere's models are specialised in summarisation, classification and text generation 24. Stability AI focuses on images; AI21 Labs models are multilingual; Anthropic Claude is a conversational assistant.

### 8 - Applying retrieval-augmented generation

**Scenario:** A knowledge-management team wants to integrate their proprietary document repository with a chatbot so that responses reference internal documents. What architecture should they implement?

**Options:**

1. Use a pre-trained LLM without any external context.
2. Use retrieval-augmented generation: embed user queries, search a vector database and provide retrieved documents to the LLM.
3. Fine-tune the model on all documents and avoid external retrieval.
4. Use only keyword search and return documents without generative responses.

**Answer:** Option 2. Retrieval-augmented generation. RAG combines retrieval from a vector database with generation for more accurate and up-to-date answers 20.

### 9 - Choosing a foundation model based on cost and latency

**Scenario:** A mobile app needs to provide on-device text summarization with minimal latency and cannot rely on continuous internet access. Which approach is most suitable?

**Options:**

1. Use Amazon Bedrock with a large model hosted in the cloud.
2. Use a lightweight open-source model deployed on the device (edge inference) and periodically update it.
3. Use Amazon SageMaker for real-time inference.
4. Use Amazon Lex integrated with Amazon Polly.

**Answer:** Option 2. Deploy a lightweight model locally. Edge inference reduces latency and dependence on network connectivity 39. Cloud-hosted models may cause latency and connectivity issues for mobile devices.

### 10 - Handling prompt injection attacks

**Scenario:** A developer integrates a large language model into an application that answers customer questions. They discover that users can craft prompts to bypass instructions and get the model to reveal sensitive information. What should be done?

**Options:**

1. Increase the model temperature to reduce coherence.
2. Ignore the issue because only a few users exploit it.
3. Implement input sanitisation and guardrails to detect and block prompt injection patterns, and use context-control techniques.
4. Switch to a smaller model that is less capable.

**Answer:** Option 3. Apply guardrails and sanitise inputs. Prompt injection is a security risk; using Bedrock Guardrails and input validation helps mitigate it 8. Temperature adjustments or model size changes will not fix the attack.

### 11 - Deciding between pre-trained and custom models

**Scenario:** A start-up needs to classify email support tickets as "billing", "technical" or "general". They have a small dataset (~300 labelled examples) and limited ML expertise. Which approach is most cost-effective?

**Options:**

1. Build and train a custom transformer from scratch using Amazon SageMaker.
2. Use Amazon Bedrock and fine-tune a foundation model.
3. Use Amazon Comprehend Custom Classifier (managed service) with the labelled dataset.
4. Hire a data science team to develop an in-house model.

**Answer:** Option 3. Use Amazon Comprehend Custom Classifier. For small labelled datasets and limited expertise, Comprehend provides an easy-to-use managed service and avoids the cost of building models from scratch. Fine-tuning a large foundation model for a simple classification task may be unnecessary.

### 12 - Selecting a vector database

**Scenario:** You are building a RAG application and need to store embeddings for millions of documents with low latency. Which AWS service is suitable?

**Options:**

1. Amazon S3
2. Amazon OpenSearch Service with k-NN plugin
3. Amazon RDS for PostgreSQL without extensions
4. Amazon SageMaker Feature Store

**Answer:** Option 2. Amazon OpenSearch Service with k-NN plugin. OpenSearch supports vector search through the k-nearest neighbour (k-NN) plugin 40. S3 is object storage; RDS lacks vector similarity search; Feature Store is for ML features rather than embedding search.

### 13 - Evaluating prompt quality

**Scenario:** While testing prompts for summarising articles, a team notices inconsistent output quality across articles. They suspect their prompts are too generic. How can they improve consistency?

**Options:**

1. Use more negative prompts to restrict output.
2. Include explicit instructions and context about the desired tone and length; experiment with few-shot examples and chain-of-thought to provide structure.
3. Increase temperature to encourage creativity.
4. Use shorter prompts to reduce complexity.

**Answer:** Option 2. Provide explicit instructions and examples. Prompt engineering best practices include adding context, tone and desired output length, and using techniques like chain-of-thought and few-shot prompting 30. Simply adding negative prompts or raising temperature may not improve consistency.

### 14 - Identifying when to use RLHF

**Scenario:** A company wants its chatbot to reflect their brand voice and follow policies. They have collected examples of desirable and undesirable responses. Which model customization method is appropriate?

**Options:**

1. Pre-training
2. In-context learning
3. Reinforcement learning from human feedback (RLHF)
4. Retrieval-augmented generation

**Answer:** Option 3. RLHF. RLHF uses human preferences to adjust model outputs, aligning them with brand values and policies 41.

### 15 - Handling unstructured data

**Scenario:** You have a dataset of scanned invoices and want to extract key fields (invoice number, date, total). Which AWS service will reduce manual effort?

**Options:**

1. Amazon Textract
2. Amazon OpenSearch Service
3. Amazon Kendra
4. Amazon SageMaker Clarify

**Answer:** Option 1. Amazon Textract. Textract extracts text, forms and tables from scanned documents, making it ideal for invoice processing 42.

### 16 - Managing data lineage and cataloguing

**Scenario:** An organisation wants to track the origin and transformation of data used in ML models to meet compliance requirements. Which AWS service should they use?

**Options:**

1. Amazon CloudWatch
2. AWS Lake Formation combined with AWS Glue Data Catalog
3. Amazon Lex
4. AWS Amplify

**Answer:** Option 2. Lake Formation and Glue Data Catalog. Lake Formation and Glue provide data cataloging and lineage features, enabling governance and compliance 43.

### 17 - Selecting evaluation metrics for translation

**Scenario:** A translation team compares two machine translation systems and wants to measure how closely the outputs match professional translations. Which metrics should they use together to capture precision and semantic similarity?

**Options:**

1. BLEU and BERTScore
2. ROUGE and MAE
3. AUC and F1 score
4. MAE and accuracy

**Answer:** Option 1. BLEU and BERTScore. BLEU measures n-gram precision with brevity penalty 27, while BERTScore captures semantic similarity using contextual embeddings 36.

### 18 - Designing a safe chatbot

**Scenario:** A bank wants to deploy a virtual assistant for customer account inquiries. The assistant must not share personal data and must refuse requests for private information. Which combination of AWS features should they use?

**Options:**

1. Amazon Lex integrated with Amazon Transcribe
2. Amazon Bedrock with Guardrails, plus IAM policies and encryption
3. Amazon Comprehend and QuickSight
4. Amazon Kendra alone

**Answer:** Option 2. Bedrock with Guardrails and IAM/encryption. Bedrock's guardrails can filter harmful content and redact PII 44, while IAM policies and encryption enforce data protection. Lex and Transcribe alone lack content filtering; Comprehend and QuickSight are not conversational services.

### 19 - Balancing cost and model size

**Scenario:** A start-up is deciding between using a large foundation model that produces high-quality outputs but is expensive and a smaller model that is cheaper and faster but slightly less accurate. What should they consider?

**Options:**

1. Always choose the largest model for the best performance.
2. Evaluate the business value of improved accuracy versus cost and latency; for some tasks, a smaller model may meet requirements and reduce technical debt.
3. Always choose the cheapest model regardless of accuracy.
4. Use both models and alternate between them randomly.

**Answer:** Option 2. Evaluate value vs cost and latency. The exam emphasises understanding cost trade-offs of AWS generative AI services, including responsiveness, availability and pricing 45. Selecting the most cost-effective solution while minimizing technical debt is important.

### 20 - Interpreting BERTScore improvements

**Scenario:** You test two versions of your summarization model. Model A has ROUGE-L 0.37 and BLEU 0.25, while Model B has ROUGE-L 0.36, BLEU 0.24 but BERTScore improves from 0.83 to 0.88. How should you interpret these results?

**Options:**

1. Model B is worse because ROUGE and BLEU decreased.
2. The increase in BERTScore suggests improved semantic quality even if lexical overlap slightly decreased; use human evaluation to confirm if the summaries are better.
3. Both models are equal because the scores are similar.
4. Model A is better because two metrics improved.

**Answer:** Option 2. Consider the semantic improvement. BERTScore captures semantic similarity beyond n-gram overlap 36. Slight decreases in ROUGE/BLEU may indicate phrasing changes rather than quality loss. Human judgement should validate whether the higher BERTScore correlates with better summaries.

## Final notes

Use this study guide to prepare for ordering, matching and scenario-based questions. Practice by
creating your own prompts and running experiments in AWS services. Remember that the exam not only
tests recognition of AWS services but also assesses conceptual understanding of AI/ML, generative AI
principles, responsible AI practices and security.

## Sources

- **AWS Certified AI Practitioner (AIF-C01) Exam Guide** -- `https://d1.awsstatic.com/training-and-certification/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf`
- **8 44 How to Use Amazon Bedrock Guardrails for Safe AI** -- `https://oneuptime.com/blog/post/2026-02-12-amazon-bedrock-guardrails-safe-ai/view`
- **11 Experience of AWS AI Practitioner Beta training and exam | by Mark Ross | Medium** -- `https://markrosscloud.medium.com/experience-of-aws-ai-practitioner-beta-training-and-exam-e0d72c0fda49`
- **12 13 14 How to Pass the AWS AI Practitioner Exam on Your First Try?** -- `https://www.whizlabs.com/blog/how-to-pass-the-aws-ai-practitioner-exam/`
- **20 23 24 25 Amazon Bedrock Explained: The Engine Behind Generative AI and Amnic's FinOps Agents |**
- **Amnic** -- `https://amnic.com/blogs/amazon-bedrock`
- **21 22 Chain-of-Thought Prompting | Prompt Engineering Guide** -- `https://www.promptingguide.ai/techniques/cot`
- **26 An intro to ROUGE, and how to use it to evaluate summaries** -- `https://www.freecodecamp.org/news/what-is-rouge-and-how-it-works-for-evaluation-of-summaries-e059fb8ac840/`
- **27 What Is the BLEU Metric? | Galileo** -- `https://galileo.ai/blog/bleu-metric-ai-evaluation`
- **28 36 BERTScore in AI: Enhancing Text Evaluation** -- `https://galileo.ai/blog/bert-score-explained-guide`

# AWS Certified AI Practitioner (AIF-C01) Study Guide - Ordering, Matching, and Scenario Questions

## Overview

The AWS Certified AI Practitioner (AIF-C01) exam validates foundational knowledge of AI, machine learning (ML), and generative AI (GenAI) on AWS, with an emphasis on practical business applications of foundation models and responsible AI practices. The official exam guide defines five domains that span core AI concepts, generative AI fundamentals, applications of foundation models, responsible AI, and security, compliance, and governance for AI solutions.[^1][^2][^3]

This guide focuses specifically on ordering, matching, and scenario-style questions, which require you to understand workflows, map services to use cases, and reason about realistic business situations rather than memorize isolated facts.[^4][^5]

## Exam Structure and Question Types

According to the official exam guide, AIF-C01 uses multiple choice, multiple response, ordering, and matching question formats. Ordering questions present 3-5 steps to complete a task, and you must pick the correct steps and arrange them in the right sequence; matching questions require pairing 3-7 prompts (for example, use cases) with the correct responses (for example, AWS services).[^2][^4]

The scored portion of the exam consists of 50 questions, with additional unscored items that do not affect your result, and scores are reported on a scale from 100 to 1000 with 700 as the passing score.[^6][^2]

## Domain Weights and Topic Prevalence

The official exam guide and multiple study resources agree on the following domain weights for AIF-C01.[^7][^3][^2]

| Domain | Description | Weight |
|--------|-------------|--------|
| Domain 1 | Fundamentals of AI and ML | 20%[^2] |
| Domain 2 | Fundamentals of Generative AI | 24%[^2] |
| Domain 3 | Applications of Foundation Models | 28%[^2] |
| Domain 4 | Guidelines for Responsible AI | 14%[^2] |
| Domain 5 | Security, Compliance, and Governance for AI Solutions | 14%[^2] |

Several exam guides highlight Domain 3 (Applications of Foundation Models) as the single largest area at 28%, meaning you should expect a heavy emphasis on how to use foundation models with services like Amazon Bedrock and Amazon SageMaker in real-world scenarios. Domains 2, 4, and 5 collectively emphasize generative AI concepts, responsible AI, and governance, so the exam tends to reward candidates who understand both technical capabilities and risk controls around GenAI solutions.[^3][^6][^7]

### Most Prevalent Concepts Likely to Be Tested

Based on the official content outline and specialist study paths, the following topics are especially likely to appear in ordering, matching, and scenario-based questions.[^6][^2][^3]

- **Core AI/ML Fundamentals (Domain 1)**: Definitions of AI, ML, deep learning, and NLP; differences between supervised, unsupervised, and reinforcement learning; common use cases like classification, regression, clustering, and recommendation.[^2][^6]
- **ML Lifecycle Basics (Domain 1)**: High-level pipeline stages such as data collection, preparation, model training, evaluation, deployment, and monitoring, often with references to Amazon SageMaker as a managed solution.[^3][^6]
- **Generative AI Foundations (Domain 2)**: What foundation models are, how tokens and context windows work, basics of embeddings, prompt engineering concepts (temperature, top-k, system vs. user prompts), and typical hallucination risks.[^7][^6]
- **Applications of Foundation Models (Domain 3)**: Selecting and using pre-trained models through Amazon Bedrock, retrieval-augmented generation (RAG) patterns, knowledge bases, and high-level configuration of agents and workflows.[^6][^7]
- **Customization and Fine-Tuning (Domain 3)**: When to use pre-trained models, prompt engineering, fine-tuning, instruction tuning, and domain adaptation versus building models from scratch.[^3][^6]
- **Responsible and Ethical AI (Domain 4)**: Fairness, inclusivity, safety, accuracy, transparency, and environmental considerations, along with tools such as Guardrails for Amazon Bedrock and Amazon SageMaker Clarify for bias and content risk control.[^6][^3]
- **Security and Governance (Domain 5)**: Shared responsibility model, IAM, encryption at rest and in transit, data lineage, model cards, logging and monitoring, and use of services like Amazon Macie and AWS CloudTrail in AI contexts.[^3][^6]

Many high-quality practice materials emphasize that the exam is highly scenario-driven, expecting you to pick the best-fit service or design pattern given constraints such as data type, latency, governance, and risk.[^8][^5][^9]

## How Ordering and Matching Questions Are Used

Ordering questions commonly test whether you know the correct sequence of high-level steps in an ML or GenAI workflow, such as preparing data, configuring a foundation model, and deploying an application. Matching questions frequently require you to map AI use cases--for example, image analysis, text summarization, conversational interfaces, or document classification--to the right AWS AI/ML services like Amazon Rekognition, Amazon Comprehend, Amazon Lex, Amazon Bedrock, or Amazon SageMaker.[^10][^4][^2][^3]

Scenario-based multiple-choice and multiple-response questions tend to blend these skills by asking you to choose an architecture, service, or risk mitigation approach that best fits a realistic story about a business, data type, and constraints.[^11][^8]

## Study Strategies for These Question Types

- **For ordering questions**, learn the canonical order of ML and GenAI workflows (for example, data collection -> preparation -> training -> evaluation -> deployment -> monitoring) and the typical order of steps in patterns like RAG (indexing data, configuring the model, and wiring the application).[^2][^6]
- **For matching questions**, build a mental catalog of "use case -> service" mappings (for example, speech-to-text -> Amazon Transcribe, image and video analysis -> Amazon Rekognition, text classification and entity extraction -> Amazon Comprehend, chatbots -> Amazon Lex, multi-model GenAI applications -> Amazon Bedrock).[^10][^3]
- **For scenario-based questions**, practice identifying the key constraint (such as latency, data sensitivity, need for grounding, or regulatory requirements) and then eliminating answers that violate that constraint, as many practice exams highlight this as a core exam skill.[^12][^8]

The following sections provide 60 practice questions--20 ordering, 20 matching, and 20 scenario-based--crafted to reflect the style and content of the AIF-C01 exam while remaining original and not drawn from real exam items.[^9][^8]

***

## Practice Ordering Questions (20)

Each question asks you to place steps in the correct order. In the real exam, you would drag and drop; here, answers are given as sequences like **B -> D -> A -> C**.

### Question O1 - ML Lifecycle on AWS

You are describing a typical high-level ML lifecycle to a business stakeholder using AWS services.
Arrange the following steps in the correct order.

A. Deploy the trained model to an endpoint for inference.

B. Collect and explore relevant training data.

C. Monitor model performance and retrain as needed.

D. Train and evaluate the model.

**Answer:** B -> D -> A -> C.[^2][^6]

### Question O2 - Building a Text Summarization App with Amazon Bedrock

A product team wants to build a text summarization feature using a foundation model via Amazon Bedrock.
Order the high-level steps.

A. Configure a foundation model and prompt in Amazon Bedrock for summarization.

B. Collect and prepare representative sample documents to test the summarizer.

C. Integrate the Bedrock invocation into the application using the AWS SDK.

D. Evaluate summarization quality with stakeholders and adjust prompt settings.

**Answer:** B -> A -> C -> D.[^7][^6]

### Question O3 - Retrieval-Augmented Generation (RAG) with Bedrock Knowledge Bases

A legal firm wants a chatbot that can answer questions based on internal case documents using retrieval-augmented generation.
Arrange the steps.

A. Configure a knowledge base in Amazon Bedrock and connect it to the vector store.

B. Ingest and index the firm's documents into a vector database or knowledge base.

C. Build the chatbot application that sends user queries to the Bedrock model with retrieval.

D. Select an appropriate foundation model in Amazon Bedrock for question answering.

**Answer:** B -> D -> A -> C.[^7][^6]

### Question O4 - Responsible AI Review for a New GenAI Feature

Your team is preparing to launch a generative AI feature that drafts marketing emails.
Order the activities to align with responsible AI practices.

A. Run bias and safety evaluations using tools like Guardrails for Amazon Bedrock.

B. Define responsible AI principles such as fairness, inclusivity, and safety for the project.

C. Monitor live outputs and user feedback to detect harmful or biased content.

D. Implement technical controls such as content filters and guardrails in the application.

**Answer:** B -> A -> D -> C.[^6][^3]

### Question O5 - Securing an AI Data Pipeline on AWS

A company is designing an AI pipeline to process sensitive customer data.
Put the security-focused steps in order.

A. Configure IAM roles and least-privilege policies for data access and model invocation.

B. Identify and classify the sensitivity of data used for training and inference.

C. Enable encryption at rest and in transit for data stores and model endpoints.

D. Set up logging and monitoring (for example, AWS CloudTrail and Amazon CloudWatch) for access and inference activity.

**Answer:** B -> A -> C -> D.[^3][^6]

### Question O6 - Using Amazon SageMaker for a Custom Model

Your team decides to build a custom ML model in Amazon SageMaker rather than only using pre-trained foundation models.
Arrange the high-level steps.

A. Prepare and store training data in Amazon S3.

B. Configure and run a SageMaker training job.

C. Create a SageMaker endpoint for real-time inference.

D. Monitor model performance and update the model as needed.

**Answer:** A -> B -> C -> D.[^6][^3]

### Question O7 - Prompt Engineering Iteration

A team is iterating on prompts to improve a generative AI model's output quality.
Order the activities.

A. Adjust prompt instructions, temperature, and other parameters.

B. Define success criteria and evaluation examples for the model outputs.

C. Collect feedback on model outputs from domain experts.

D. Run experiments with the model and compare outputs against criteria.

**Answer:** B -> A -> D -> C.[^7][^6]

### Question O8 - Applying Transfer Learning

A company wants to adapt a pre-trained model to a niche domain rather than train from scratch.
Arrange the following steps for a transfer learning approach.

A. Collect and label domain-specific training data.

B. Select an appropriate pre-trained model or foundation model.

C. Fine-tune the model on the domain-specific dataset.

D. Evaluate the fine-tuned model against domain-specific metrics.

**Answer:** B -> A -> C -> D.[^3][^6]

### Question O9 - Data Preparation for ML

Order the standard data preparation steps before model training.

A. Clean and transform raw data (handle missing values, normalize, etc.).

B. Split data into training, validation, and test sets.

C. Identify and gather data from relevant sources.

D. Perform exploratory data analysis to understand distributions and issues.

**Answer:** C -> D -> A -> B.[^2][^6]

### Question O10 - Implementing AI Governance

An organization is formalizing AI governance.
Place these steps in a logical sequence.

A. Define AI policies covering data usage, model lifecycle, and risk management.

B. Establish governance roles and responsibilities (for example, AI risk committee).

C. Implement technical and process controls to enforce policies.

D. Periodically review governance effectiveness and update policies.

**Answer:** A -> B -> C -> D.[^6][^3]

### Question O11 - Setting Up Agents for Amazon Bedrock

A support team wants to use agents for Amazon Bedrock to orchestrate multi-step workflows.
Order the steps.

A. Define the tasks and tools (APIs) the agent should be able to call.

B. Configure the agent in Amazon Bedrock, including the foundation model and tool schema.

C. Integrate the agent endpoint into the support application.

D. Test and refine the agent's behavior with real-world scenarios.

**Answer:** A -> B -> C -> D.[^8][^7]

### Question O12 - Handling Model Drift

A model's performance has degraded over time.
Arrange the response steps.

A. Analyze monitoring metrics and alerts to confirm drift.

B. Collect newer representative data reflecting current conditions.

C. Retrain or fine-tune the model with the updated data.

D. Redeploy the updated model and continue monitoring.

**Answer:** A -> B -> C -> D.[^3][^6]

### Question O13 - Designing a Chatbot with Guardrails

A bank is building a customer-facing chatbot using a foundation model.
Order the activities focusing on safety.

A. Identify sensitive topics and unacceptable model behaviors.

B. Configure Guardrails for Amazon Bedrock with safety and content filters.

C. Integrate guardrail-protected model calls into the chatbot flow.

D. Run red-team tests and refine guardrail policies.

**Answer:** A -> B -> C -> D.[^6][^3]

### Question O14 - Establishing Data Lineage for AI

An enterprise wants better visibility into which datasets feed each model.
Order these steps.

A. Catalog datasets and their owners.

B. Implement data lineage tracking using AWS tools and metadata (for example, Glue Data Catalog and model cards).

C. Link training jobs and models to their input datasets.

D. Use lineage information in governance reviews and audits.

**Answer:** A -> B -> C -> D.[^3][^6]

### Question O15 - Building a Simple RAG Prototype

A startup wants a quick RAG prototype for internal FAQs.
Arrange the steps.

A. Load FAQ documents into a knowledge base or vector store.

B. Choose a suitable foundation model for question answering.

C. Implement a simple web UI that sends questions to the RAG backend.

D. Configure the RAG backend to retrieve relevant passages and call the model.

**Answer:** A -> B -> D -> C.[^7][^6]

### Question O16 - Evaluating an AI Use Case

A business is considering AI for a new process.
Order the evaluation steps.

A. Identify the problem, desired outcomes, and success metrics.

B. Assess data availability, quality, and constraints.

C. Determine whether AI/ML is appropriate compared to rule-based automation.

D. Estimate cost, timeline, and risks for an AI solution.

**Answer:** A -> B -> C -> D.[^1][^6]

### Question O17 - Handling Sensitive Training Data

A healthcare provider wants to use de-identified patient notes for ML.
Arrange the steps.

A. Apply de-identification and pseudonymization techniques.

B. Classify data according to sensitivity and regulatory requirements.

C. Configure encryption and access controls in AWS.

D. Limit training and inference to approved environments and roles.

**Answer:** B -> A -> C -> D.[^6][^3]

### Question O18 - Monitoring a Deployed Foundation-Model App

A generative AI content assistant has been deployed.
Order the monitoring activities.

A. Track operational metrics such as latency, throughput, and errors.

B. Collect samples of generated content for quality and safety review.

C. Implement alerts for anomalous behavior or unexpected spikes in usage.

D. Periodically retrain or adjust prompts based on feedback.

**Answer:** A -> C -> B -> D.[^7][^6]

### Question O19 - Choosing Between Pre-Trained and Custom Models

A team is deciding whether to use a pre-trained foundation model or build a custom model.
Place the analysis steps in order.

A. Define the task requirements, accuracy needs, and constraints.

B. Evaluate existing pre-trained and foundation models against sample data.

C. Estimate effort and cost of custom model development.

D. Decide on pre-trained, fine-tuned, or fully custom model strategy.

**Answer:** A -> B -> C -> D.[^3][^6]

### Question O20 - Incident Response for Harmful Outputs

An internal user reports harmful content generated by a prototype.
Order the response actions.

A. Pause or restrict access to the prototype if necessary.

B. Capture logs and examples of the harmful outputs.

C. Analyze root causes (prompt, configuration, training data, or model limits).

D. Update guardrails, prompts, or model configuration and re-test.

**Answer:** A -> B -> C -> D.[^6][^3]

***

## Practice Matching Questions (20)

Each matching question provides prompts (1-N) and options (A-E). In the real exam you would drag each prompt to its matching option.

### Question M1 - Use Case to AWS Service

Match each use case to the most appropriate AWS AI/ML service.

1. Convert recorded customer support calls into searchable text.

2. Detect inappropriate images uploaded by users.

3. Extract entities and key phrases from large volumes of customer feedback text.

4. Build a natural-language chatbot for customer self-service.

Options:

A. Amazon Comprehend

B. Amazon Rekognition

C. Amazon Lex

D. Amazon Transcribe

**Answer:** 1-D, 2-B, 3-A, 4-C.[^10][^3]

### Question M2 - Learning Type to Description

Match the type of learning to its description.

1. Supervised learning

2. Unsupervised learning

3. Reinforcement learning

4. Self-supervised or foundation-model pre-training

Options:

A. Learns from labeled examples of inputs and desired outputs.

B. Learns patterns and structure from unlabeled data.

C. Learns by interacting with an environment and receiving rewards or penalties.

D. Learns general representations from large unlabeled datasets, later adapted to specific tasks.

**Answer:** 1-A, 2-B, 3-C, 4-D.[^2][^6]

### Question M3 - Domain to Primary Focus

Match each AIF-C01 domain to its primary focus.

1. Domain 1

2. Domain 2

3. Domain 3

4. Domain 4

5. Domain 5

Options:

A. Fundamentals of AI and ML

B. Fundamentals of Generative AI

C. Applications of Foundation Models

D. Guidelines for Responsible AI

E. Security, Compliance, and Governance for AI Solutions

**Answer:** 1-A, 2-B, 3-C, 4-D, 5-E.[^2][^3]

### Question M4 - Foundation-Model Concept to Definition

1. Token

2. Context window

3. Temperature

4. Embedding

Options:

A. Numerical representation of text used to measure similarity.

B. Smallest unit of text processed by a model (for example, subword or word piece).

C. The maximum amount of text the model can consider at once.

D. Parameter that controls randomness in generated outputs.

**Answer:** 1-B, 2-C, 3-D, 4-A.[^7][^6]

### Question M5 - Responsible AI Principle to Example

1. Fairness

2. Safety

3. Transparency and explainability

4. Inclusivity

Options:

A. Ensuring AI does not systematically disadvantage a protected group.

B. Providing users with understandable reasons for AI decisions.

C. Preventing AI from generating harmful or violent content.

D. Designing AI to work well for diverse languages, abilities, and cultures.

**Answer:** 1-A, 2-C, 3-B, 4-D.[^3][^6]

### Question M6 - Data Type to Example

1. Structured data

2. Unstructured text

3. Image data

4. Audio data

Options:

A. Customer support tickets stored as raw text.

B. Transaction records stored in a relational database.

C. Product photos uploaded to an e-commerce site.

D. Recorded customer calls in a contact center.

**Answer:** 1-B, 2-A, 3-C, 4-D.[^2][^6]

### Question M7 - Governance Concept to Description

1. Data lineage

2. Model card

3. Access control

4. Encryption in transit

Options:

A. Documentation of a model's intended use, limitations, and training data sources.

B. Tracking where data comes from and how it flows through systems.

C. Restricting which identities can access data or invoke models.

D. Protecting data as it moves across networks using protocols such as TLS.

**Answer:** 1-B, 2-A, 3-C, 4-D.[^6][^3]

### Question M8 - Use Case to GenAI Design Pattern

1. Answer questions grounded in internal policy documents.

2. Generate marketing copy in a brand voice using short prompts.

3. Build a domain-specialized model for medical summarization.

4. Automate multi-step workflows involving APIs and tools.

Options:

A. Prompt engineering with style guidelines only.

B. Retrieval-augmented generation (RAG) with knowledge bases.

C. Fine-tuning or domain adaptation of a foundation model.

D. Agents that orchestrate tools with a foundation model.

**Answer:** 1-B, 2-A, 3-C, 4-D.[^7][^6]

### Question M9 - AWS Service to Primary Role in AI

1. Amazon SageMaker

2. Amazon Bedrock

3. Amazon Rekognition

4. Amazon Comprehend

Options:

A. Managed ML platform for building, training, and deploying custom models.

B. Generative AI service providing access to multiple foundation models via API.

C. Image and video analysis for detection, recognition, and moderation.

D. NLP service for classification, entity extraction, and topic modeling.

**Answer:** 1-A, 2-B, 3-C, 4-D.[^10][^3]

### Question M10 - Threat to Mitigation

1. Data exfiltration from prompts.

2. Prompt injection.

3. Exposure of sensitive training data.

4. Unauthorized model access.

Options:

A. Enforce IAM least-privilege policies and scoped roles.

B. Filter inputs and outputs, and constrain tools accessible to the model.

C. Use guardrails and content filters to block sensitive information in outputs.

D. Apply data-masking and de-identification before training.

**Answer:** 1-C, 2-B, 3-D, 4-A.[^3][^6]

### Question M11 - Metric to Interpretation

1. Accuracy

2. Precision

3. Recall

4. F1 score

Options:

A. Proportion of all predictions that are correct overall.

B. How many predicted positives are truly positive.

C. How many actual positives were correctly found.

D. Harmonic mean of precision and recall.

**Answer:** 1-A, 2-B, 3-C, 4-D.[^6][^3]

### Question M12 - Foundation-Model Customization to Description

1. Zero-shot prompting

2. Few-shot prompting

3. Fine-tuning

4. Instruction tuning

Options:

A. Providing task instructions without examples.

B. Training a model further on large labeled datasets for a domain.

C. Providing a small number of input-output examples in the prompt.

D. Training a model on instruction-response pairs to follow natural-language directions.

**Answer:** 1-A, 2-C, 3-B, 4-D.[^7][^6]

### Question M13 - Shared Responsibility Aspect to AWS vs. Customer

1. Physical security of data centers

2. Network and hypervisor security

3. Configuration of IAM roles and policies

4. Proper classification of training data

Options:

A. AWS responsibility

B. Customer responsibility

**Answer:** 1-A, 2-A, 3-B, 4-B.[^3][^6]

### Question M14 - Dataset Issue to Impact

1. Label noise

2. Class imbalance

3. Data leakage

4. Poor representativeness

Options:

A. Model overestimates performance due to information from the future or test set.

B. Model is biased and performs poorly on under-represented groups.

C. Model struggles to learn because labels contain many errors.

D. Model favors majority class and under-detects minority cases.

**Answer:** 1-C, 2-D, 3-A, 4-B.[^6][^3]

### Question M15 - Monitoring Tool to Purpose

1. Amazon CloudWatch

2. AWS CloudTrail

3. Amazon SageMaker Model Monitor

4. Amazon Macie

Options:

A. Detecting sensitive data in S3 and monitoring its access.

B. Tracking logs and metrics for infrastructure and applications.

C. Monitoring and analyzing API calls across AWS accounts.

D. Monitoring data and model quality in deployed ML endpoints.

**Answer:** 1-B, 2-C, 3-D, 4-A.[^3][^6]

### Question M16 - Generative AI Risk to Example

1. Hallucination

2. Bias

3. Privacy leakage

4. Overreliance on AI

Options:

A. Model fabricates facts that are not present in inputs or training data.

B. Model produces outputs that disadvantage a specific demographic group.

C. Model reveals sensitive or proprietary information from training data.

D. Users accept AI outputs without validation, causing bad decisions.

**Answer:** 1-A, 2-B, 3-C, 4-D.[^6][^3]

### Question M17 - Bedrock Component to Function

1. Foundation model

2. Guardrails for Amazon Bedrock

3. Knowledge base

4. Agent

Options:

A. Configurable component that orchestrates multi-step tasks and API calls.

B. Safety and content-filtering controls for generative AI applications.

C. Pre-trained model hosted and managed by AWS partners or Amazon.

D. Retrieval layer that stores and serves domain-specific knowledge to models.

**Answer:** 1-C, 2-B, 3-D, 4-A.[^7][^6]

### Question M18 - Business Metric to AI Context

1. Return on investment (ROI)

2. Cost per prediction

3. Customer satisfaction score (CSAT)

4. Time to value

Options:

A. Measures whether the financial benefits of an AI solution exceed its cost.

B. Measures how much it costs to serve each inference.

C. Measures users' perceived quality of interactions with AI systems.

D. Measures how quickly an AI solution starts delivering business impact.

**Answer:** 1-A, 2-B, 3-C, 4-D.[^13][^6]

### Question M19 - Role to Responsibility in AI Projects

1. Data scientist / ML engineer

2. Product owner

3. Security engineer

4. Compliance officer

Options:

A. Defines business requirements and acceptance criteria for AI features.

B. Designs, trains, and evaluates models.

C. Ensures controls, policies, and regulations are followed.

D. Implements IAM, encryption, and security monitoring.

**Answer:** 1-B, 2-A, 3-D, 4-C.[^1][^6]

### Question M20 - Evaluation Technique to Purpose

1. A/B testing

2. Human-in-the-loop review

3. Red-teaming

4. Offline benchmark evaluation

Options:

A. Compare two AI variants in production to see which performs better.

B. Have experts review and approve or correct AI outputs.

C. Intentionally probe systems for vulnerabilities and harmful behaviors.

D. Test models on curated datasets before deployment.

**Answer:** 1-A, 2-B, 3-C, 4-D.[^3][^6]

***

## Practice Scenario-Based Questions (20)

Each scenario is written in a style similar to the exam: pick the best answer based on the business context, data, and constraints.

### Question S1 - Choosing a Service for Document Classification

A retail company wants to automatically categorize thousands of customer feedback emails into topics like "delivery issues," "product quality," and "billing questions" without building a custom model from scratch.
Which AWS service is the best fit?

A. Amazon Rekognition

B. Amazon Comprehend

C. Amazon Transcribe

D. Amazon Bedrock

**Answer:** B. Amazon Comprehend provides managed NLP capabilities including topic modeling and text classification without requiring you to train a model.[^10][^3]

### Question S2 - When to Use Foundation Models

A startup wants to generate product descriptions in multiple languages with a consistent tone of voice.
They have limited ML expertise and want to minimize time-to-market.
What is the most appropriate approach?

A. Build a custom sequence-to-sequence model in Amazon SageMaker from scratch.

B. Use Amazon Rekognition with a custom label project.

C. Use Amazon Bedrock with prompt engineering on a text-generation foundation model.

D. Use Amazon Comprehend to detect entities and sentiment.

**Answer:** C. Amazon Bedrock allows teams to access pre-trained foundation models for text generation and apply prompt engineering to control style and tone, avoiding custom training.[^10][^6]

### Question S3 - Applying RAG for Policy Questions

An HR department wants an internal assistant that can answer questions such as "What is our parental leave policy in Germany?" based strictly on internal policy PDFs stored in Amazon S3.
They want answers grounded in the documents rather than generic web knowledge.
Which approach is most suitable?

A. Use a foundation model with no access to internal data.

B. Fine-tune a foundation model using synthetic policy Q&A pairs only.

C. Implement retrieval-augmented generation with an Amazon Bedrock knowledge base backed by the policy documents.

D. Use Amazon Rekognition to analyze PDF images.

**Answer:** C. RAG with an Amazon Bedrock knowledge base retrieves relevant policy passages and passes them to a foundation model so answers are grounded in the organization's actual documents.[^7][^6]

### Question S4 - Responsible AI and Harmful Content

A media company is launching a generative content tool that suggests article headlines.
During testing, the tool occasionally generates offensive or discriminatory headlines.
What is the most appropriate next step?

A. Ignore the outputs because the tool is only used internally.

B. Add Guardrails for Amazon Bedrock or similar safety filters and refine prompts to reduce harmful content.

C. Disable logging so that users cannot see problematic generations.

D. Increase the model temperature to produce more diverse outputs.

**Answer:** B. Responsible AI guidelines call for proactively reducing harmful content using safety tools such as Guardrails for Amazon Bedrock and better prompts, even in internal settings.[^6][^3]

### Question S5 - Data Sensitivity and Foundation Models

A healthcare analytics team wants to summarize de-identified patient notes using a foundation model.
They must minimize the risk of exposing any residual sensitive information.
Which combination of actions is most aligned with AI security and privacy best practices?

A. Send raw notes directly to any public foundation model endpoint.

B. Apply de-identification, use a regionally hosted foundation model via Amazon Bedrock, and restrict access with IAM and encryption.

C. Store all data unencrypted in Amazon S3 for easier processing.

D. Avoid any logging or monitoring of model usage.

**Answer:** B. De-identification combined with regionally hosted managed models, strong IAM, and encryption follows Domain 5 guidance on security, compliance, and governance for AI solutions.[^3][^6]

### Question S6 - ML vs. Rule-Based Automation

A logistics company decides whether to use AI for routing delivery trucks.
The routes depend on complex patterns in historical traffic and delivery times, and manually defined rules have become hard to maintain.
What is the best recommendation?

A. Keep adding more if/else rules to the existing system.

B. Use a supervised learning model that predicts delivery time or route efficiency based on historical data.

C. Use unsupervised clustering to group routes without labels and apply them directly.

D. Use Amazon Comprehend to analyze route descriptions.

**Answer:** B. Supervised learning on historical data can capture complex relationships and outperform brittle rule-based systems for this type of prediction.[^2][^6]

### Question S7 - Evaluating Hallucination Risk

A finance team is piloting a GenAI assistant to explain corporate financial statements.
Sometimes the assistant invents numbers not present in uploaded documents.
What risk is this, and what is an appropriate mitigation?

A. Bias; mitigate by collecting more diverse training data only.

B. Hallucination; mitigate by grounding responses through retrieval from the actual financial documents and instructing the model not to fabricate.

C. Privacy leakage; mitigate by turning off logging.

D. Class imbalance; mitigate by resampling datasets.

**Answer:** B. The model is hallucinating by fabricating unsupported information; RAG-style grounding and clearer instructions can reduce this behavior.[^7][^6]

### Question S8 - Domain 3 Emphasis

An exam candidate asks which domain is most heavily weighted on the AIF-C01 exam so they can prioritize scenario practice on applied GenAI.
What is the correct answer?

A. Domain 1: Fundamentals of AI and ML

B. Domain 2: Fundamentals of Generative AI

C. Domain 3: Applications of Foundation Models

D. Domain 4: Guidelines for Responsible AI

**Answer:** C. Domain 3 has the highest weighting at 28% of scored content, so applied foundation-model scenarios are particularly important for exam preparation.[^2][^7]

### Question S9 - Choosing Between Pre-Trained and Custom Models

A small marketing agency needs an AI system that classifies incoming leads as "high," "medium," or "low" quality.
They have limited ML expertise and a small labeled dataset of past leads.
Which approach is most appropriate?

A. Train a complex deep learning model from scratch with millions of parameters.

B. Use a foundation model via Amazon Bedrock with prompt engineering to classify leads based on textual descriptions.

C. Ignore ML and assign leads randomly.

D. Build a fully unsupervised clustering system and manually map clusters to lead quality.

**Answer:** B. Using a foundation model with prompt engineering reduces the need for extensive ML expertise and labeled data while still delivering useful classification based on text descriptions.[^7][^6]

### Question S10 - Shared Responsibility for AI Security

A company is using Amazon Bedrock to build a GenAI chatbot that accesses internal knowledge bases.
Which task clearly falls under the customer's responsibility in the shared responsibility model?

A. Securing the physical data centers where Bedrock runs.

B. Patching the underlying hypervisor.

C. Configuring IAM policies and network controls that restrict who can call the chatbot and what data it can access.

D. Ensuring that AWS staff follow internal HR policies.

**Answer:** C. AWS manages physical and infrastructure security, while customers are responsible for IAM, network configuration, and data-access controls for their AI applications.[^6][^3]

### Question S11 - Monitoring GenAI Quality Over Time

A customer-support GenAI assistant initially performs well but gradually produces less accurate answers as the company's product catalog evolves.
What is the best explanation and response?

A. This is normal and cannot be addressed.

B. Model drift due to changing underlying data; collect updated examples, retrain or adjust prompts, and monitor quality metrics.

C. Latency issues; move the model to another Region.

D. IAM misconfiguration; tighten permissions.

**Answer:** B. As the business changes, models and prompts can become outdated, requiring updated data, retraining or prompt adjustments, and ongoing monitoring.[^3][^6]

### Question S12 - Choosing an Evaluation Metric

A bank uses an AI model to flag potentially fraudulent credit-card transactions.
False negatives (missed fraud) are much more expensive than false positives.
Which metric is most critical?

A. Accuracy only.

B. Precision only.

C. Recall (sensitivity) for the fraud class.

D. Runtime latency.

**Answer:** C. High recall ensures that most true fraud cases are caught, which is crucial when missing fraud is very costly.[^6][^3]

### Question S13 - Using Agents for Multi-Step Tasks

An insurance company wants an AI assistant that can gather information from several internal APIs, calculate a quote, and then draft an explanation for the customer.
The workflows involve multiple steps and external tools.
Which AWS capability is the best fit?

A. A single text-generation call to Amazon Bedrock with no tool integration.

B. Agents for Amazon Bedrock that orchestrate multi-step workflows and tools.

C. Amazon Rekognition.

D. AWS CloudTrail.

**Answer:** B. Agents for Amazon Bedrock are designed to orchestrate multi-step workflows, calling tools and APIs on behalf of foundation models.[^8][^6]

### Question S14 - Handling Regulated Data

A financial-services company operates in a heavily regulated industry and wants to use GenAI to assist analysts.
They are concerned about sending data outside their chosen AWS Region.
Which approach best addresses this concern?

A. Use a regionally hosted foundation model in Amazon Bedrock that keeps data within the selected Region and does not use customer data to train the underlying model.

B. Send data to any public internet API.

C. Disable encryption for simpler debugging.

D. Share data with third-party vendors over email.

**Answer:** A. Domain 5 emphasizes using regionally hosted managed services, ensuring data residency and that customer data is not used to train base models for regulated workloads.[^3][^6]

### Question S15 - Deciding If AI Is Appropriate

A small business owner wants to predict daily revenue but has only two weeks of historical data and many missing entries.
What is the most appropriate guidance?

A. Immediately train a complex ML model and deploy to production.

B. Explain that more consistent data collection is needed before ML can provide reliable predictions and suggest starting with basic reporting.

C. Use AI anyway because models can learn from almost no data.

D. Use Amazon Rekognition on the data.

**Answer:** B. Domain 1 stresses that AI/ML solutions require sufficient, good-quality data; with very limited and noisy data, it is better to improve data collection first.[^2][^6]

### Question S16 - Matching Use Case to Domain Emphasis

An exam candidate wants to focus on scenarios about prompt engineering, RAG, and foundation-model customization.
Which domain primarily covers these topics?

A. Domain 1

B. Domain 2

C. Domain 3

D. Domain 5

**Answer:** C. Domain 3, Applications of Foundation Models, emphasizes design, configuration, and application of foundation models, including prompt engineering and RAG.[^2][^6]

### Question S17 - Bias Detection in an AI Hiring Tool

A company uses an AI system to screen job applications and is concerned it may be biased against candidates from certain schools.
Which action is most appropriate?

A. Ignore the concern because the model is accurate overall.

B. Use tools like Amazon SageMaker Clarify to analyze model predictions for bias and adjust the model or data based on findings.

C. Turn off monitoring to reduce visible evidence of bias.

D. Increase temperature in the generation step.

**Answer:** B. Domain 4 highlights the importance of detecting and mitigating bias using tools such as Amazon SageMaker Clarify and adjusting models and datasets accordingly.[^6][^3]

### Question S18 - Selecting an AWS Service for Images

A social network wants to automatically flag user-uploaded profile pictures that contain explicit content.
Which AWS service is most appropriate?

A. Amazon Comprehend

B. Amazon Rekognition

C. Amazon Transcribe

D. Amazon Bedrock

**Answer:** B. Amazon Rekognition provides image and video moderation capabilities to detect explicit or inappropriate content.[^10][^3]

### Question S19 - Cost Considerations for GenAI

A startup is concerned about the cost of using a foundation model for a chat application.
They expect high traffic but can tolerate slightly higher latency.
Which approach best aligns with cost optimization principles?

A. Always use the largest, most capable model regardless of cost.

B. Select a smaller or more cost-efficient foundation model in Amazon Bedrock, use rate limiting, and batch less time-sensitive requests.

C. Disable monitoring to reduce cost.

D. Duplicate all prompts to improve accuracy.

**Answer:** B. Selecting appropriately sized models and applying controls such as rate limiting aligns with best practices for balancing performance and cost in GenAI solutions.[^13][^6]

### Question S20 - Interpreting Domain Weights for Study Planning

A learner has only a short time to prepare for the exam and wants to allocate study time roughly proportional to domain weights.
Which allocation makes the most sense?

A. Spend most time on Domain 1 and ignore Domain 3.

B. Focus heavily on Domain 3 and Domain 2 while still covering Domains 1, 4, and 5.

C. Study all domains equally regardless of weighting.

D. Only study security topics.

**Answer:** B. Since Domain 3 (28%) and Domain 2 (24%) together represent over half of the scored content, focusing on them while still covering the remaining domains reflects the official domain weighting.[^2][^7]

---

## References

1. [AWS Certified AI Practitioner (AIF-C01)](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html) - This certification focuses on practical business applications of AI. The exam also validates a candi...

2. [[PDF] AWS Certified AI Practitioner - Exam Guide (AIF-C01)](https://docs.aws.amazon.com/pdfs/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.pdf) - The AWS Certified AI Practitioner (AIF-C01) exam is designed for individuals who want to demonstrate...

3. [AWS Certified AI Practitioner Exam - AIF-C01 Study Path Exam Guide](https://tutorialsdojo.com/aws-certified-ai-practitioner-aif-c01-exam-guide/) - AWS Certified AI Practitioner AIF-C01 Exam Domains ; Domain 1: Fundamentals of AI and ML, 20% ; Doma...

4. [AWS Certified AI Practitioner (AIF-C01) - AWS Certificationdocs.aws.amazon.com > ... > AWS Certified AI Practitioner (AIF-C01)](https://docs.aws.amazon.com/aws-certification/latest/examguides/ai-practitioner-01.html) - Information about the AWS Certified AI Practitioner exam

5. [AIF-C01 Overview -- Format, Domains & Who Should Take It | Mastery](https://masteryexamprep.com/exams/aws/aif-c01/overview/) - Domain breakdown (weights)S. . Domain 1: Fundamentals of AI and ML -- 20% . Domain 2: Fundamentals of ...

6. [AWS Certified AI Practitioner Exam - AIF-C01 Study Path Exam Guide](https://www.linkedin.com/pulse/aws-certified-ai-practitioner-exam-aif-c01-study-path-jon-bonso-icfpc) - The official AWS Certified AI Practitioner AIF-C01 exam guide outlines key exam domains, topics, and...

7. [AI Practitioner Exam Guide - aws - DEV Community](https://dev.to/aws-builders/ai-practitioner-exam-guide-5dfj) - Exam Domains and Weighting. The exam is divided into five main content domains. While Generative AI ...

8. [35 Tough AWS AI Practitioner Sample Questions and Answers](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/20-Tough-AWS-AI-Practitioner-Certification-Exam-Questions-and-Answers) - Want to get AWS AI Practitioner certified? Avoid the braindumps and exam dumps. Learn the honest way...

9. [Free Practice Questions for AWS Certified AI Practitioner](https://digitalcloud.training/aws-ai-practitioner-free-practice-questions/) - Test your knowledge with free Practice Questions for the AWS Certified AI Practitioner! Free Practic...

10. [The Battle Map: Exam Domains and Weightings | ShShell.com](https://www.shshell.com/blog/aws-ai-module-1-lesson-2-domains) - A strategic breakdown of the five key domains of the AIF-C01 exam. Learn where to focus your study t...

11. [AWS Certified AI Practitioner (AIF-C01) Domain 3, 20 Scenario-Based Questions for your Exam Prep](https://www.youtube.com/watch?v=5VD6cZBFaYM) - You'll see each question first and have 20 seconds to answer before the solution appears on screen -...

12. [AWS Certified AI Practitioner (AIF-C01) | 20 REAL Scenario Questions Explained](https://www.youtube.com/watch?v=Vvr3j7wNpFs) - [ROCKET] Preparing for the AWS Certified AI Practitioner (AIF-C01) exam?
 These 20 scenario-based question...

13. [How to Pass the AWS AI Practitioner AIF-C01 Exam on Your First Try](https://www.examcollection.com/blog/how-to-pass-the-aws-ai-practitioner-aif-c01-exam-on-your-first-try/) - The AIF-C01 exam is structured to evaluate knowledge across five key domains, each contributing a sp...


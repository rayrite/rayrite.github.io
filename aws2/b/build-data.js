/**
 * Build script: Extracts data from index[opus].html, augments with
 * AIF-C01 and SAA-C03 entries, writes v2/data/services.js and v2/data/notes.js.
 *
 * Run: node v2/build-data.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index[opus].html'), 'utf-8');

// ── Extract JS literal (array or object) using bracket-depth counting ──
function extractLiteral(text, marker) {
    const idx = text.indexOf(marker);
    if (idx === -1) throw new Error('Marker not found: ' + marker);

    const openChar = marker.trim().slice(-1);          // '[' or '{'
    const closeChar = openChar === '[' ? ']' : '}';

    let depth = 1, i = idx + marker.length;
    let inStr = false, strCh = '';

    while (i < text.length && depth > 0) {
        const ch = text[i];
        if (inStr) {
            if (ch === '\\') { i += 2; continue; }
            if (ch === strCh) inStr = false;
        } else {
            if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strCh = ch; }
            else if (ch === openChar) depth++;
            else if (ch === closeChar) depth--;
        }
        i++;
    }
    return text.substring(idx + marker.length - 1, i);
}

// eslint-disable-next-line no-eval
const awsServices = eval(extractLiteral(html, 'const awsServices = ['));
const notesData   = eval('(' + extractLiteral(html, 'const notesData = {') + ')');

console.log(`Extracted ${awsServices.length} services, ${Object.keys(notesData).length} notes`);

// ── Exam-overlap sets ──
const SAA = new Set([
    'Amazon API Gateway','Amazon Athena','Amazon Aurora','Amazon CloudFront',
    'Amazon CloudWatch','Amazon Cognito','Amazon Data Firehose','Amazon DocumentDB (with MongoDB compatibility)',
    'Amazon DynamoDB','Amazon EC2','Amazon EC2 Auto Scaling','Amazon EC2 Image Builder',
    'Amazon ElastiCache','Amazon Elastic Block Store','Amazon Elastic Container Registry',
    'Amazon Elastic Container Service','Amazon Elastic File System',
    'Amazon Elastic Kubernetes Service','Amazon EMR',
    'Amazon EventBridge','Amazon FSx for Lustre','Amazon FSx for NetApp ONTAP',
    'Amazon FSx for Windows File Server','Amazon GuardDuty','Amazon Inspector',
    'Amazon Keyspaces (for Apache Cassandra)','Amazon Kinesis','Amazon Kinesis Data Streams',
    'Amazon Macie','Amazon MemoryDB','Amazon MQ','Amazon Neptune','Amazon OpenSearch Service',
    'Amazon Redshift','Amazon Redshift Serverless','Amazon Relational Database Service',
    'Amazon Route 53','Amazon SageMaker AI','Amazon Security Lake',
    'Amazon Simple Notification Service','Amazon Simple Queue Service',
    'Amazon Simple Storage Service','Amazon Simple Workflow Service',
    'Amazon Timestream','Amazon VPC','Amazon VPC Lattice',
    'AWS App Runner','AWS Auto Scaling','AWS Backup','AWS Batch',
    'AWS Certificate Manager','AWS CloudFormation','AWS CloudTrail',
    'AWS CodePipeline','AWS Compute Optimizer','AWS Config',
    'AWS Control Tower','AWS Cost Explorer','AWS Budgets',
    'AWS Database Migration Service','AWS DataSync','AWS Direct Connect',
    'AWS Elastic Beanstalk','AWS Elastic Disaster Recovery','AWS Fargate',
    'AWS Firewall Manager','AWS Global Accelerator','AWS Glue',
    'AWS Identity and Access Management','AWS IAM Identity Center',
    'AWS Key Management Service','AWS Lambda','AWS Network Firewall',
    'AWS Organizations','AWS Outposts','AWS PrivateLink',
    'AWS Resource Access Manager','AWS Secrets Manager','AWS Security Hub',
    'AWS Shield','AWS Snow Family','AWS Step Functions',
    'AWS Storage Gateway','AWS Systems Manager','AWS Transit Gateway',
    'AWS Trusted Advisor','AWS VPN','AWS WAF','AWS Wavelength',
    'AWS X-Ray','Elastic Load Balancing','OpsWorks','QuickSight',
    'Savings Plans'
]);

const AIF = new Set([
    'Amazon Augmented AI','Amazon Bedrock','Amazon CodeGuru','Amazon Comprehend',
    'Amazon Comprehend Medical','Amazon DevOps Guru','Amazon Forecast',
    'Amazon Fraud Detector','Amazon Kendra','Amazon Lex','Amazon Personalize',
    'Amazon Polly','Amazon Q','Amazon Q Developer','Amazon PartyRock',
    'Amazon Rekognition','Amazon SageMaker AI','Amazon Textract',
    'Amazon Transcribe','Amazon Translate',
    'AWS DeepComposer','AWS DeepRacer','AWS HealthLake','AWS HealthScribe',
    'AWS Panorama','Amazon Simple Storage Service','AWS Lambda',
    'AWS Identity and Access Management'
]);

// ── Augment existing entries ──
awsServices.forEach(s => {
    s.source = 'existing';
    s.examTags = ['CLF-C02'];
    if (SAA.has(s.name)) s.examTags.push('SAA-C03');
    if (AIF.has(s.name)) s.examTags.push('AIF-C01');
});

// ── New AIF-C01 entries ──
const newAIF = [
    { name:"Supervised Learning", description:"A type of machine learning where the model is trained on labeled data — input-output pairs — so it can learn to predict the correct output for new inputs. Common examples include classification and regression tasks.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/machine-learning/latest/dg/training-ml-models.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Unsupervised Learning", description:"A type of machine learning where the model is trained on unlabeled data and must find patterns and structure on its own. Common techniques include clustering, dimensionality reduction, and anomaly detection.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/machine-learning/latest/dg/training-ml-models.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Reinforcement Learning", description:"A type of machine learning where an agent learns to make decisions by taking actions in an environment and receiving rewards or penalties. The agent aims to maximize cumulative reward over time.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/machine-learning/latest/dg/training-ml-models.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Neural Networks & Deep Learning", description:"Neural networks are computing systems inspired by the brain's structure, consisting of layers of interconnected nodes. Deep learning uses neural networks with many layers to learn complex patterns from large amounts of data.", category:"AI/ML Concepts", url:"https://aws.amazon.com/what-is/deep-learning/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Large Language Models (LLMs)", description:"A type of foundation model trained on massive text datasets that can understand and generate human language. LLMs power chatbots, code generation, summarization, and other generative AI applications.", category:"AI/ML Concepts", url:"https://aws.amazon.com/what-is/large-language-model/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Foundation Models (FMs)", description:"Large AI models pre-trained on broad datasets that can be adapted (fine-tuned) to a wide range of downstream tasks. They form the foundation for generative AI applications and are available through services like Amazon Bedrock.", category:"AI/ML Concepts", url:"https://aws.amazon.com/what-is/foundation-models/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Transfer Learning", description:"A machine learning technique where a model trained on one task is repurposed for a different but related task. This allows leveraging existing learned representations to achieve good performance with less training data.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/machine-learning/latest/dg/training-ml-models.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Fine-Tuning", description:"The process of taking a pre-trained model and further training it on a smaller, task-specific dataset. Fine-tuning adapts a foundation model's capabilities to a particular domain or use case while retaining its general knowledge.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/bedrock/latest/userguide/custom-models.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Inference", description:"The process of using a trained machine learning model to generate predictions or outputs from new input data. Inference is the deployment-time counterpart to training.", category:"AI/ML Concepts", url:"https://aws.amazon.com/what-is/ml-inference/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Overfitting & Underfitting", description:"Overfitting occurs when a model learns the training data too well (including noise), performing poorly on new data. Underfitting occurs when a model is too simple to capture the underlying patterns.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/machine-learning/latest/dg/model-fit-underfitting-vs-overfitting.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Bias & Fairness in AI", description:"Bias in AI refers to systematic errors in model outputs that can lead to unfair treatment of certain groups. Responsible AI practices include identifying, measuring, and mitigating bias using tools like Amazon SageMaker Clarify.", category:"AI/ML Concepts", url:"https://aws.amazon.com/machine-learning/responsible-ai/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Hallucinations (AI)", description:"When a generative AI model produces outputs that sound plausible but are factually incorrect or fabricated. Mitigation strategies include Retrieval Augmented Generation (RAG), grounding, and guardrails.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/bedrock/latest/userguide/kb-test-config.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Prompt Engineering", description:"The practice of designing and refining input prompts to guide a generative AI model toward producing desired outputs. Techniques include zero-shot, few-shot, chain-of-thought prompting, and system prompts.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering-guidelines.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Retrieval Augmented Generation (RAG)", description:"A technique that enhances generative AI responses by retrieving relevant information from external knowledge sources before generating an answer. RAG reduces hallucinations and keeps responses grounded in factual data. Amazon Bedrock Knowledge Bases implements RAG.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/bedrock/latest/userguide/kb-test-config.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Responsible AI", description:"A framework of principles for developing and deploying AI systems that are fair, transparent, explainable, robust, and privacy-preserving. AWS supports responsible AI through SageMaker Clarify, Bedrock Guardrails, and model cards.", category:"AI/ML Concepts", url:"https://aws.amazon.com/machine-learning/responsible-ai/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Tokens & Tokenization", description:"Tokens are the basic units of text that language models process — typically words, subwords, or characters. Tokenization is the process of breaking text into tokens. Token count affects model cost, context window limits, and processing speed.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Embeddings", description:"Numerical vector representations of data (text, images, etc.) that capture semantic meaning. Similar items have similar embeddings, enabling semantic search, recommendations, and clustering.", category:"AI/ML Concepts", url:"https://aws.amazon.com/what-is/embeddings-in-machine-learning/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Temperature (GenAI)", description:"A parameter that controls the randomness of a generative AI model's output. Lower temperature (e.g., 0) produces more deterministic, focused responses; higher temperature (e.g., 1) produces more creative, varied outputs.", category:"AI/ML Concepts", url:"https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Generative AI", description:"A category of artificial intelligence that can create new content — including text, images, code, audio, and video — based on patterns learned from training data. Powered by foundation models and large language models.", category:"AI/ML Concepts", url:"https://aws.amazon.com/generative-ai/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Diffusion Models", description:"A class of generative AI models that learn to create data by reversing a gradual noising process. They are particularly effective for image generation, used in Amazon Titan Image Generator and Stable Diffusion on Bedrock.", category:"AI/ML Concepts", url:"https://aws.amazon.com/what-is/diffusion-model/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Transformers", description:"A neural network architecture that uses self-attention mechanisms to process sequential data in parallel, enabling much faster training. Transformers are the foundation of modern LLMs like GPT, Claude, and Amazon Titan.", category:"AI/ML Concepts", url:"https://aws.amazon.com/what-is/transformers-in-artificial-intelligence/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Amazon Bedrock Knowledge Bases", description:"A fully managed RAG capability in Amazon Bedrock. It connects foundation models to your data sources (S3, web pages, databases) so models can generate responses grounded in your organization's information.", category:"Machine Learning", url:"https://aws.amazon.com/bedrock/knowledge-bases/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Amazon Bedrock Agents", description:"Enables you to build AI agents that can plan and execute multi-step tasks by orchestrating foundation models with your company's systems and data. Agents can call APIs, query databases, and take actions on behalf of users.", category:"Machine Learning", url:"https://aws.amazon.com/bedrock/agents/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Amazon Bedrock Guardrails", description:"Implements safeguards for generative AI applications built on Amazon Bedrock. You can configure content filters, denied topics, word filters, and PII redaction to ensure model responses align with responsible AI policies.", category:"Machine Learning", url:"https://aws.amazon.com/bedrock/guardrails/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Amazon Titan Models", description:"A family of foundation models built by AWS, available through Amazon Bedrock. Includes Titan Text (language), Titan Embeddings (semantic search), Titan Image Generator, and Titan Multimodal Embeddings.", category:"Machine Learning", url:"https://aws.amazon.com/bedrock/titan/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Amazon SageMaker Canvas", description:"A visual, no-code machine learning capability of SageMaker that enables business analysts to generate accurate ML predictions without writing code or requiring ML expertise.", category:"Machine Learning", url:"https://aws.amazon.com/sagemaker/canvas/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Amazon SageMaker JumpStart", description:"Provides pre-trained, open-source models and solution templates for common ML tasks. Accelerates ML development by offering one-click deployment of foundation models including Llama, Falcon, and Stable Diffusion.", category:"Machine Learning", url:"https://aws.amazon.com/sagemaker/jumpstart/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Amazon SageMaker Ground Truth", description:"Helps you build highly accurate training datasets for machine learning by offering easy access to public and private human labelers, with built-in workflows and automatic labeling.", category:"Machine Learning", url:"https://aws.amazon.com/sagemaker/groundtruth/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Amazon SageMaker Clarify", description:"Provides tools to detect potential bias in data and models, and to explain model predictions. It supports responsible AI by generating explainability reports and bias metrics.", category:"Machine Learning", url:"https://aws.amazon.com/sagemaker/clarify/", examTags:["AIF-C01"], source:"aif-c01" },
    { name:"Amazon SageMaker Pipelines", description:"The first purpose-built CI/CD service for machine learning. Helps you automate ML workflows including data preparation, model training, evaluation, and deployment.", category:"Machine Learning", url:"https://aws.amazon.com/sagemaker/pipelines/", examTags:["AIF-C01"], source:"aif-c01" },
];

// ── New SAA-C03 entries ──
const newSAA = [
    { name:"AWS Well-Architected Framework", description:"A set of best practices organized into six pillars — Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability — for building secure, high-performing, resilient, and efficient infrastructure.", category:"Architecture Concepts", url:"https://aws.amazon.com/architecture/well-architected/", examTags:["SAA-C03","CLF-C02"], source:"saa-c03" },
    { name:"High Availability vs Fault Tolerance", description:"High Availability (HA) minimizes downtime using redundancy across AZs for quick recovery. Fault Tolerance ensures zero downtime — the system continues seamlessly even when components fail.", category:"Architecture Concepts", url:"https://docs.aws.amazon.com/whitepapers/latest/real-time-communication-on-aws/high-availability-and-scalability-on-aws.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"Disaster Recovery Strategies", description:"Four DR strategies with increasing cost and speed: Backup & Restore (cheapest, slowest RTO), Pilot Light (minimal core running), Warm Standby (scaled-down functional copy), Multi-Site Active/Active (near-zero RTO/RPO).", category:"Architecture Concepts", url:"https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"RPO & RTO", description:"Recovery Point Objective (RPO) is the maximum acceptable data loss measured in time. Recovery Time Objective (RTO) is the maximum acceptable downtime after a disaster. Lower values require more expensive DR strategies.", category:"Architecture Concepts", url:"https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"Horizontal vs Vertical Scaling", description:"Vertical scaling (scale up) adds more power to an existing instance. Horizontal scaling (scale out) adds more instances. Horizontal scaling provides better availability and is the preferred cloud-native approach.", category:"Architecture Concepts", url:"https://docs.aws.amazon.com/whitepapers/latest/real-time-communication-on-aws/high-availability-and-scalability-on-aws.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"Loose Coupling", description:"Components interact through well-defined interfaces (queues, events, APIs) rather than direct dependencies. Improves resilience, scalability, and independent deployability using SQS, SNS, and EventBridge.", category:"Architecture Concepts", url:"https://docs.aws.amazon.com/wellarchitected/latest/framework/rel-prevent-interaction-failure.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"Serverless Architecture", description:"Build and run applications without managing servers. Key AWS serverless services: Lambda (compute), API Gateway (APIs), DynamoDB (database), S3 (storage), Step Functions (orchestration), EventBridge (events).", category:"Architecture Concepts", url:"https://aws.amazon.com/serverless/", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"Event-Driven Architecture", description:"Components communicate through events (state changes) rather than direct calls. Producers emit events to a central bus (EventBridge/SNS), consumers react to subscribed events, enabling loose coupling and scalability.", category:"Architecture Concepts", url:"https://aws.amazon.com/event-driven-architecture/", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"S3 Storage Classes", description:"S3 Standard (frequent), S3 Intelligent-Tiering (auto-tier), S3 Standard-IA & One Zone-IA (infrequent), S3 Glacier Instant/Flexible/Deep Archive (archival). Lifecycle policies automate transitions between classes.", category:"Architecture Concepts", url:"https://aws.amazon.com/s3/storage-classes/", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"EC2 Purchasing Options", description:"On-Demand (no commitment), Reserved Instances (1-3yr, up to 72% off), Savings Plans (flexible commitment), Spot Instances (up to 90% off, interruptible), Dedicated Hosts (physical server), Dedicated Instances.", category:"Architecture Concepts", url:"https://aws.amazon.com/ec2/pricing/", examTags:["SAA-C03","CLF-C02"], source:"saa-c03" },
    { name:"EC2 Placement Groups", description:"Cluster (low latency, single AZ), Spread (max 7/AZ, isolated hardware), Partition (large distributed workloads like HDFS/Cassandra). Controls how instances are placed on underlying hardware.", category:"Architecture Concepts", url:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"EBS Volume Types", description:"SSD: gp3/gp2 (General Purpose), io2/io1 (Provisioned IOPS). HDD: st1 (Throughput Optimized), sc1 (Cold). Only gp and io volumes can be boot volumes.", category:"Architecture Concepts", url:"https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"ELB Types (ALB/NLB/GLB)", description:"ALB: Layer 7 (HTTP/HTTPS), path/host routing. NLB: Layer 4 (TCP/UDP), extreme performance. GLB: Layer 3, for third-party appliances (firewalls, IDS/IPS).", category:"Architecture Concepts", url:"https://aws.amazon.com/elasticloadbalancing/features/", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"DynamoDB Accelerator (DAX)", description:"Fully managed in-memory cache for DynamoDB delivering up to 10x read performance. API-compatible with DynamoDB, requiring minimal code changes. Ideal for read-heavy, latency-sensitive workloads.", category:"Database", url:"https://aws.amazon.com/dynamodb/dax/", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"Aurora Serverless", description:"An on-demand, auto-scaling Aurora configuration that starts, stops, and scales capacity automatically. Ideal for infrequent, intermittent, or unpredictable workloads. Pay per ACU-second.", category:"Database", url:"https://aws.amazon.com/rds/aurora/serverless/", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"Aurora Global Database", description:"Spans up to 5 AWS Regions with replication lag typically under 1 second. Provides RPO of 1 second and RTO under 1 minute for cross-region failover. Ideal for globally distributed applications and DR.", category:"Database", url:"https://aws.amazon.com/rds/aurora/global-database/", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"S3 Replication (CRR/SRR)", description:"Cross-Region Replication (CRR) copies objects across Regions for compliance and latency. Same-Region Replication (SRR) copies within a Region for log aggregation. Both require versioning.", category:"Architecture Concepts", url:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"VPC Peering", description:"A networking connection between two VPCs using private IPs. Non-transitive (A↔B and B↔C ≠ A↔C). Does not support overlapping CIDR blocks. Works cross-account and cross-region.", category:"Networking & Content Delivery", url:"https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"VPC Endpoints", description:"Private connections from VPC to AWS services without internet. Interface Endpoints use PrivateLink (ENI). Gateway Endpoints are for S3 and DynamoDB only (free, route-table based).", category:"Networking & Content Delivery", url:"https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"NAT Gateway", description:"Managed NAT enabling private subnet instances to reach the internet (outbound only). Deployed in a public subnet, highly available within an AZ. Prevents inbound internet connections.", category:"Networking & Content Delivery", url:"https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"Internet Gateway", description:"A horizontally scaled, redundant VPC component for VPC-to-internet communication. Supports IPv4/IPv6. Performs NAT for instances with public IPv4 addresses.", category:"Networking & Content Delivery", url:"https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"Route 53 Routing Policies", description:"Simple, Weighted (% split), Latency-based (nearest region), Failover (active-passive), Geolocation (user location), Geoproximity (distance + bias), Multi-value answer (multiple healthy records).", category:"Architecture Concepts", url:"https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"AWS Security Token Service (STS)", description:"Provides temporary, limited-privilege credentials for IAM users or federated users. Used to assume IAM Roles across accounts, implement identity federation, and grant short-lived access.", category:"Security, Identity, & Compliance", url:"https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"Amazon Data Lifecycle Manager", description:"Automates creation, retention, and deletion of EBS snapshots and AMIs. Define lifecycle policies with schedules and retention rules for automated backup management.", category:"Storage", url:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-lifecycle.html", examTags:["SAA-C03"], source:"saa-c03" },
    { name:"AWS Pricing Calculator", description:"A free web-based tool for estimating AWS costs before deployment. Model solutions by configuring services and explore pricing without committing resources.", category:"Cloud Financial Management", url:"https://calculator.aws/", examTags:["SAA-C03","CLF-C02"], source:"saa-c03" },
];

// ── Merge and sort ──
const allServices = [...awsServices, ...newAIF, ...newSAA];

function sortKey(name) {
    if (name.startsWith('Amazon ')) return name.substring(7);
    if (name.startsWith('AWS '))    return name.substring(4);
    return name;
}
allServices.sort((a, b) => sortKey(a.name).localeCompare(sortKey(b.name)));

// ── Write services.js ──
fs.writeFileSync(
    path.join(__dirname, 'data', 'services.js'),
    'window.awsServices = ' + JSON.stringify(allServices, null, 2) + ';\n'
);

// ── Augment notesData with new entries ──
const newNotes = {
    // AIF-C01 concepts
    "Supervised Learning":              { keywords:["Labeled data","Classification","Regression","Training data","Input-output pairs","Prediction"], detailsHTML:"" },
    "Unsupervised Learning":            { keywords:["Unlabeled data","Clustering","Dimensionality reduction","Anomaly detection","Pattern discovery","K-means"], detailsHTML:"" },
    "Reinforcement Learning":           { keywords:["Agent","Environment","Reward","Policy","Actions","Exploration","Exploitation","DeepRacer"], detailsHTML:"" },
    "Neural Networks & Deep Learning":  { keywords:["Layers","Neurons","Weights","Activation function","Backpropagation","CNN","RNN","Deep learning"], detailsHTML:"" },
    "Large Language Models (LLMs)":     { keywords:["Text generation","Natural language","GPT","Claude","Titan","Chatbot","Foundation model","Pre-trained"], detailsHTML:"" },
    "Foundation Models (FMs)":          { keywords:["Pre-trained","General purpose","Fine-tuning","Bedrock","Titan","Adapt","Broad dataset","Base model"], detailsHTML:"" },
    "Transfer Learning":                { keywords:["Pre-trained model","Reuse","Adapt","New task","Feature extraction","Domain adaptation"], detailsHTML:"" },
    "Fine-Tuning":                      { keywords:["Customize","Domain-specific","Task-specific","Training data","Adapt model","Custom model","Bedrock"], detailsHTML:"" },
    "Inference":                        { keywords:["Prediction","Deploy","Endpoint","Real-time","Batch","Model serving","Production"], detailsHTML:"" },
    "Overfitting & Underfitting":       { keywords:["Generalization","Training error","Validation","Regularization","Model complexity","Bias-variance tradeoff"], detailsHTML:"" },
    "Bias & Fairness in AI":            { keywords:["Discrimination","Ethical AI","Fairness metrics","SageMaker Clarify","Protected attributes","Disparate impact"], detailsHTML:"" },
    "Hallucinations (AI)":              { keywords:["Fabricated","Incorrect output","Grounding","RAG","Guardrails","Factual accuracy","Mitigation"], detailsHTML:"" },
    "Prompt Engineering":               { keywords:["Zero-shot","Few-shot","Chain-of-thought","System prompt","Context window","Instructions","Examples"], detailsHTML:"" },
    "Retrieval Augmented Generation (RAG)": { keywords:["Knowledge base","External data","Grounding","Reduce hallucinations","Vector search","Embeddings","Bedrock Knowledge Bases"], detailsHTML:"" },
    "Responsible AI":                   { keywords:["Fairness","Transparency","Explainability","Privacy","Safety","Governance","Guardrails","Ethics"], detailsHTML:"" },
    "Tokens & Tokenization":            { keywords:["Words","Subwords","Context window","Token limit","Cost per token","Input tokens","Output tokens"], detailsHTML:"" },
    "Embeddings":                       { keywords:["Vector","Semantic similarity","Vector database","Semantic search","Representation","Titan Embeddings"], detailsHTML:"" },
    "Temperature (GenAI)":              { keywords:["Randomness","Creativity","Deterministic","Top-p","Sampling","Model parameters"], detailsHTML:"" },
    "Generative AI":                    { keywords:["Create content","Text generation","Image generation","Code generation","Foundation models","LLM","Bedrock"], detailsHTML:"" },
    "Diffusion Models":                 { keywords:["Image generation","Noise","Denoising","Stable Diffusion","Titan Image Generator","Art"], detailsHTML:"" },
    "Transformers":                     { keywords:["Self-attention","Parallel processing","Architecture","GPT","BERT","Encoder","Decoder"], detailsHTML:"" },
    "Amazon Bedrock Knowledge Bases":   { keywords:["RAG","Retrieval Augmented Generation","Data sources","S3","Vector store","Grounding","Enterprise data"], detailsHTML:"" },
    "Amazon Bedrock Agents":            { keywords:["Multi-step tasks","Orchestration","API calls","Action groups","Planning","Autonomous"], detailsHTML:"" },
    "Amazon Bedrock Guardrails":        { keywords:["Content filtering","Denied topics","PII redaction","Safety","Responsible AI","Word filters"], detailsHTML:"" },
    "Amazon Titan Models":              { keywords:["AWS foundation model","Titan Text","Titan Embeddings","Titan Image","Multimodal","Bedrock"], detailsHTML:"" },
    "Amazon SageMaker Canvas":          { keywords:["No-code ML","Visual","Business analyst","AutoML","Predictions","Point and click"], detailsHTML:"" },
    "Amazon SageMaker JumpStart":       { keywords:["Pre-trained models","One-click deploy","Open source","Llama","Stable Diffusion","Solution templates"], detailsHTML:"" },
    "Amazon SageMaker Ground Truth":    { keywords:["Data labeling","Training data","Human labelers","Annotation","Active learning","Crowdsourcing"], detailsHTML:"" },
    "Amazon SageMaker Clarify":         { keywords:["Bias detection","Explainability","SHAP values","Fairness","Model interpretability","Feature importance"], detailsHTML:"" },
    "Amazon SageMaker Pipelines":       { keywords:["ML workflow","CI/CD for ML","Automation","MLOps","Training pipeline","Model registry"], detailsHTML:"" },
    // SAA-C03 concepts
    "AWS Well-Architected Framework":   { keywords:["Six pillars","Best practices","Operational Excellence","Security","Reliability","Performance Efficiency","Cost Optimization","Sustainability"], detailsHTML:"" },
    "High Availability vs Fault Tolerance": { keywords:["Redundancy","Multi-AZ","Zero downtime","Failover","Recovery","Uptime","SLA"], detailsHTML:"" },
    "Disaster Recovery Strategies":     { keywords:["Backup and Restore","Pilot Light","Warm Standby","Multi-Site","Active-Active","RTO","RPO","Cost vs speed"], detailsHTML:"" },
    "RPO & RTO":                        { keywords:["Recovery Point Objective","Recovery Time Objective","Data loss","Downtime","Business continuity","DR strategy"], detailsHTML:"" },
    "Horizontal vs Vertical Scaling":   { keywords:["Scale out","Scale up","Add instances","Add resources","Auto Scaling","Elasticity","Cloud-native"], detailsHTML:"" },
    "Loose Coupling":                   { keywords:["Decoupling","SQS","SNS","EventBridge","API Gateway","Resilience","Independent components","Queue"], detailsHTML:"" },
    "Serverless Architecture":          { keywords:["Lambda","API Gateway","DynamoDB","S3","No servers","Pay per use","Auto-scaling","Step Functions"], detailsHTML:"" },
    "Event-Driven Architecture":        { keywords:["Events","Producers","Consumers","EventBridge","SNS","Decoupling","Async","Reactive"], detailsHTML:"" },
    "S3 Storage Classes":               { keywords:["Standard","Standard-IA","One Zone-IA","Intelligent-Tiering","Glacier Instant","Glacier Flexible","Deep Archive","Lifecycle"], detailsHTML:"" },
    "EC2 Purchasing Options":           { keywords:["On-Demand","Reserved Instance","Savings Plans","Spot Instance","Dedicated Host","Dedicated Instance","Capacity Reservation"], detailsHTML:"" },
    "EC2 Placement Groups":             { keywords:["Cluster","Spread","Partition","Low latency","High throughput","Fault isolation","Single AZ","HPC"], detailsHTML:"" },
    "EBS Volume Types":                 { keywords:["gp3","gp2","io2","io1","st1","sc1","IOPS","Throughput","SSD","HDD","Boot volume"], detailsHTML:"" },
    "ELB Types (ALB/NLB/GLB)":          { keywords:["Application Load Balancer","Network Load Balancer","Gateway Load Balancer","Layer 7","Layer 4","Layer 3","Path-based routing"], detailsHTML:"" },
    "DynamoDB Accelerator (DAX)":       { keywords:["In-memory cache","Microsecond latency","Read performance","DynamoDB","API-compatible","Write-through"], detailsHTML:"" },
    "Aurora Serverless":                { keywords:["Auto-scaling","On-demand","ACU","Intermittent workloads","Pay per use","Start and stop","Unpredictable"], detailsHTML:"" },
    "Aurora Global Database":           { keywords:["Cross-region","Replication","Sub-second lag","Disaster recovery","Fast failover","RTO under 1 minute","5 regions"], detailsHTML:"" },
    "S3 Replication (CRR/SRR)":         { keywords:["Cross-Region Replication","Same-Region Replication","Versioning","Compliance","Latency","Backup"], detailsHTML:"" },
    "VPC Peering":                      { keywords:["Connect VPCs","Non-transitive","Private IP","No overlapping CIDR","Cross-account","Cross-region"], detailsHTML:"" },
    "VPC Endpoints":                    { keywords:["Interface Endpoint","Gateway Endpoint","PrivateLink","S3","DynamoDB","Private access","No internet"], detailsHTML:"" },
    "NAT Gateway":                      { keywords:["Private subnet","Outbound internet","One-way","Public subnet","Managed","High availability","No inbound"], detailsHTML:"" },
    "Internet Gateway":                 { keywords:["Public internet","VPC","IPv4","IPv6","Horizontal scaling","Redundant","Public subnet"], detailsHTML:"" },
    "Route 53 Routing Policies":        { keywords:["Simple","Weighted","Latency","Failover","Geolocation","Geoproximity","Multi-value","Health checks"], detailsHTML:"" },
    "AWS Security Token Service (STS)": { keywords:["Temporary credentials","AssumeRole","Federation","Cross-account","Identity provider","Short-lived"], detailsHTML:"" },
    "Amazon Data Lifecycle Manager":    { keywords:["Automate snapshots","EBS backup","Retention","Lifecycle policy","Schedule","AMI management"], detailsHTML:"" },
    "AWS Pricing Calculator":           { keywords:["Cost estimate","Planning","What will it cost","Budget","Free tool","Before deployment"], detailsHTML:"" },
};

const allNotes = { ...notesData, ...newNotes };

// ── Write notes.js ──
fs.writeFileSync(
    path.join(__dirname, 'data', 'notes.js'),
    'window.notesData = ' + JSON.stringify(allNotes, null, 2) + ';\n'
);

// ── Summary ──
console.log('\n=== Build Complete ===');
console.log(`Services: ${allServices.length} total  (${awsServices.length} existing + ${newAIF.length} AIF-C01 + ${newSAA.length} SAA-C03)`);
console.log(`Notes:    ${Object.keys(allNotes).length} total  (${Object.keys(notesData).length} existing + ${Object.keys(newNotes).length} new)`);
console.log('Files written:');
console.log('  v2/data/services.js');
console.log('  v2/data/notes.js');

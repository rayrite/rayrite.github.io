# AWS CLF-C02 Practice Scenarios & Questions

## Domain 1: Cloud Concepts (24%)

### Scenario 1: E-commerce Migration
**Business Context:** A traditional retail company runs their e-commerce website on physical servers in their data center. During Black Friday, their website crashes due to traffic spikes, and they're looking to migrate to AWS.

**Question:** What are the PRIMARY benefits this company would gain by migrating their e-commerce platform to AWS? (Select TWO)

A) Elimination of all operational responsibilities  
B) Ability to scale resources automatically during traffic spikes  
C) Guaranteed 100% uptime for their applications  
D) Pay-as-you-go pricing model to optimize costs  
E) Automatic compliance with all industry regulations

**Answer:** B and D
**Explanation:** Elasticity (auto-scaling) and pay-as-you-go pricing are core AWS benefits. Option A is wrong because customers still have operational responsibilities. Option C is wrong because AWS doesn't guarantee 100% uptime. Option E is wrong because compliance is a shared responsibility.

---

### Scenario 2: Startup Architecture Decision
**Business Context:** A startup is building a new mobile app and needs to choose between building their own data center or using AWS Cloud.

**Question:** According to the AWS Cloud Adoption Framework (CAF), which perspective would PRIMARILY focus on ensuring the startup has the right skills and change management processes for cloud adoption?

A) Business Perspective  
B) People Perspective  
C) Platform Perspective  
D) Security Perspective

**Answer:** B
**Explanation:** The People Perspective specifically focuses on skills development and organizational change management needed for successful cloud adoption.

---

## Domain 2: Security and Compliance (30%)

### Scenario 3: Healthcare Data Platform
**Business Context:** A healthcare company is moving patient data to AWS and needs to ensure HIPAA compliance. They're concerned about who is responsible for what security aspects.

**Question:** Under the AWS Shared Responsibility Model, which of the following security tasks is the CUSTOMER'S responsibility?

A) Physical security of AWS data centers  
B) Encryption of data at rest in Amazon S3  
C) Patching the underlying hypervisor software  
D) Network infrastructure security between Availability Zones

**Answer:** B
**Explanation:** Data encryption is always the customer's responsibility ("security IN the cloud"). AWS handles physical security, hypervisor patching, and network infrastructure ("security OF the cloud").

---

### Scenario 4: Financial Services Security
**Business Context:** A bank wants to implement multi-layered security for their online banking application hosted on AWS.

**Question:** The bank needs to control access to AWS resources based on user roles and permissions. Which AWS service should they use?

A) Amazon GuardDuty  
B) AWS WAF  
C) AWS IAM  
D) Amazon Macie

**Answer:** C
**Explanation:** IAM (Identity and Access Management) controls user access and permissions. GuardDuty is for threat detection, WAF is for web application protection, and Macie is for data discovery and protection.

---

### Scenario 5: Multi-Service Security Setup
**Business Context:** A company wants to protect their web application from common attacks, detect malicious activity, and discover sensitive data in their S3 buckets.

**Question:** Which combination of AWS services would address ALL of these security requirements? (Select THREE)

A) AWS WAF  
B) Amazon GuardDuty  
C) Amazon Macie  
D) AWS Shield Standard  
E) AWS Config  
F) Amazon Inspector

**Answer:** A, B, C
**Explanation:** AWS WAF protects web applications from attacks, GuardDuty detects malicious activity, and Macie discovers and protects sensitive data in S3. Shield Standard provides DDoS protection but wasn't specifically requested.

---

## Domain 3: Cloud Technology and Services (34%)

### Scenario 6: Compute Options Decision
**Business Context:** A company has three different workloads: (1) A web server that runs 24/7 with predictable traffic, (2) A data processing job that can be interrupted, and (3) A new application they want to test for a few hours.

**Question:** What is the MOST cost-effective EC2 pricing model for each workload?

A) Reserved Instances for all three workloads  
B) On-Demand for web server, Spot for data processing, On-Demand for testing  
C) Reserved for web server, Spot for data processing, On-Demand for testing  
D) Spot Instances for all three workloads

**Answer:** C
**Explanation:** Reserved Instances provide the best discount for predictable 24/7 workloads. Spot Instances offer up to 90% savings for fault-tolerant jobs. On-Demand is best for short-term, unpredictable workloads like testing.

---

### Scenario 7: Database Selection
**Business Context:** A gaming company needs three different database solutions: (1) Player profiles with complex relationships, (2) Real-time leaderboards requiring microsecond latency, and (3) Historical game analytics for business intelligence.

**Question:** Which AWS database services would be MOST appropriate for each use case?

A) RDS for profiles, ElastiCache for leaderboards, Redshift for analytics  
B) DynamoDB for all three use cases  
C) RDS for all three use cases  
D) DocumentDB for profiles, RDS for leaderboards, DynamoDB for analytics

**Answer:** A
**Explanation:** RDS is ideal for relational data (player profiles), ElastiCache provides in-memory caching for real-time applications, and Redshift is designed for data warehousing and analytics.

---

### Scenario 8: Global Application Architecture
**Business Context:** A media streaming company wants to deliver video content to users worldwide with minimal latency. They store their content in S3 buckets in the US East region.

**Question:** Which AWS service would BEST help reduce latency for global users accessing this content?

A) Amazon Route 53  
B) Amazon CloudFront  
C) AWS Direct Connect  
D) Elastic Load Balancing

**Answer:** B
**Explanation:** CloudFront is AWS's CDN service that caches content at edge locations worldwide, reducing latency for global users. Route 53 is DNS, Direct Connect is for dedicated connections, and ELB distributes traffic but doesn't cache content.

---

### Scenario 9: Storage Requirements
**Business Context:** A company has different storage needs: (1) Frequently accessed website images, (2) Monthly financial reports that need quick access, (3) 7-year compliance archives rarely accessed, and (4) Shared file system for EC2 instances.

**Question:** What is the MOST cost-effective storage solution for each requirement?

A) S3 Standard for all use cases  
B) S3 Standard, S3 Standard-IA, S3 Glacier Deep Archive, EFS  
C) EBS for all use cases  
D) S3 Standard, S3 Standard, S3 Glacier, EBS

**Answer:** B
**Explanation:** S3 Standard for frequent access, Standard-IA for infrequent but quick access, Glacier Deep Archive for long-term archives, and EFS for shared file systems across EC2 instances.

---

### Scenario 10: Serverless Architecture
**Business Context:** A startup wants to build a serverless image processing application where users upload photos, and the system automatically resizes them and stores thumbnails.

**Question:** Which combination of AWS services would create a fully serverless solution? (Select THREE)

A) Amazon S3  
B) AWS Lambda  
C) Amazon EC2  
D) Amazon API Gateway  
E) Amazon RDS  
F) Amazon DynamoDB

**Answer:** A, B, D (Alternative: A, B, F)
**Explanation:** S3 for storage, Lambda for serverless compute, API Gateway for serverless API management. DynamoDB could replace API Gateway if metadata storage is needed. EC2 and RDS require server management.

---

## Domain 4: Billing, Pricing and Support (12%)

### Scenario 11: Cost Management Strategy
**Business Context:** A rapidly growing startup is seeing their AWS costs increase monthly and wants to implement cost management practices before their next funding round.

**Question:** Which AWS tools would help them monitor, analyze, and control their costs? (Select THREE)

A) AWS Cost Explorer  
B) AWS Budgets  
C) AWS CloudTrail  
D) AWS Trusted Advisor  
E) Amazon CloudWatch  
F) AWS Config

**Answer:** A, B, D
**Explanation:** Cost Explorer analyzes spending patterns, Budgets sets cost alerts, and Trusted Advisor provides cost optimization recommendations. CloudTrail is for API logging, CloudWatch for monitoring, and Config for compliance.

---

### Scenario 12: Support Plan Selection
**Business Context:** A financial services company is running mission-critical applications on AWS. They need 24/7 support, dedicated technical guidance, and help with architecture reviews.

**Question:** Which AWS Support plan would BEST meet their requirements?

A) Basic Support  
B) Developer Support  
C) Business Support  
D) Enterprise Support

**Answer:** D
**Explanation:** Enterprise Support provides 24/7 support, a dedicated Technical Account Manager (TAM), architecture reviews, and concierge support - all needed for mission-critical applications.

---

### Scenario 13: Cost Estimation
**Business Context:** An architect needs to estimate costs for a new project before presenting to management. The project involves EC2 instances, RDS databases, and S3 storage with specific usage patterns.

**Question:** Which AWS tool should they use to create detailed cost estimates for this project?

A) AWS Cost Explorer  
B) AWS Pricing Calculator  
C) AWS Budgets  
D) AWS Cost and Usage Reports

**Answer:** B
**Explanation:** AWS Pricing Calculator is designed for estimating costs before deployment. Cost Explorer analyzes existing costs, Budgets sets spending limits, and Cost/Usage Reports provide detailed billing information.

---

## Advanced Multi-Domain Scenarios

### Scenario 14: Enterprise Migration Strategy
**Business Context:** A large enterprise with 500+ applications wants to migrate to AWS. They need a structured approach, compliance management, centralized billing, and governance across multiple AWS accounts.

**Question:** Which combination of AWS services and frameworks would support their enterprise migration strategy? (Select THREE)

A) AWS Cloud Adoption Framework (CAF)  
B) AWS Organizations  
C) AWS Control Tower  
D) AWS Migration Hub  
E) AWS Direct Connect  
F) Amazon WorkSpaces

**Answer:** A, B, C
**Explanation:** CAF provides migration strategy framework, Organizations enables centralized management of multiple accounts, and Control Tower provides governance and compliance guardrails.

---

### Scenario 15: Disaster Recovery Planning
**Business Context:** A company runs critical applications in the US East region and needs a disaster recovery solution that can recover within 4 hours with minimal data loss.

**Question:** What is the MOST cost-effective disaster recovery strategy using AWS global infrastructure?

A) Replicate everything to multiple regions simultaneously  
B) Use pilot light approach with critical components in another region  
C) Backup data to S3 and restore when needed  
D) Use multiple Availability Zones in the same region only

**Answer:** B
**Explanation:** Pilot light maintains minimal resources in another region for quick scaling during disaster - more cost-effective than full replication but faster than backup/restore. Using only one region doesn't protect against regional disasters.

---

### Scenario 16: Compliance and Governance
**Business Context:** A healthcare organization needs to ensure their AWS environment meets HIPAA compliance, track all API calls for auditing, and monitor configuration changes across all resources.

**Question:** Which AWS services would help them meet these compliance requirements? (Select THREE)

A) AWS CloudTrail  
B) AWS Config  
C) Amazon Inspector  
D) AWS Artifact  
E) Amazon GuardDuty  
F) AWS Systems Manager

**Answer:** A, B, D
**Explanation:** CloudTrail logs all API calls for auditing, Config monitors configuration changes, and Artifact provides access to compliance reports including HIPAA. Inspector is for security assessments, GuardDuty for threat detection.

---

## Scenario-Based Study Tips

### **How to Approach These Questions:**

1. **Identify the Business Need:** What problem is the company trying to solve?
2. **Map to AWS Services:** Which services directly address this need?
3. **Consider Constraints:** Cost, performance, compliance, time requirements
4. **Apply Best Practices:** Security, reliability, cost optimization
5. **Eliminate Obviously Wrong Answers:** Use process of elimination

### **Common Question Patterns:**

- **"Which service should you use for..."** → Service selection based on use case
- **"What is the most cost-effective..."** → Compare pricing models
- **"Which combination of services..."** → Multiple services working together
- **"Under the shared responsibility model..."** → AWS vs. customer responsibilities
- **"Which AWS Support plan..."** → Support level requirements

### **Key Success Strategies:**

- **Think Simple:** Don't overthink solutions
- **Focus on Primary Purpose:** Each service has a main use case
- **Understand Service Relationships:** How services work together
- **Remember Business Value:** Why would a company choose this solution?
- **Practice Elimination:** Rule out wrong answers systematically

---

**Next Steps:** Try answering these scenarios, then review the explanations. Focus extra study time on any domains where you struggled. Remember, the real exam will have similar scenario-based questions that test your understanding of when and why to use specific AWS services.
Here is a comprehensive study guide for the AWS Certified Solutions Architect â€“ Associate (SAA-C03) exam. It is organized by the official exam domains, highlighting the essential services, concepts, and architectural principles you need to master.

***

# AWS Certified Solutions Architect â€“ Associate (SAA-C03) Study Guide

## í ½í»¡ï¸ Domain 1: Design Secure Architectures (30%)
*Focus on securing data at rest and in transit, controlling access, and protecting AWS infrastructure.*

### Identity and Access Management (IAM)
* **Users, Groups, & Roles:** Understand the difference between them. Roles are for services (EC2, Lambda) or cross-account access; do not use long-term access keys when roles can be used.
* **Policies:** JSON documents defining permissions. Understand the principle of least privilege.
* **IAM Identity Center (formerly AWS SSO):** Centralized management for multiple AWS accounts and business applications.
* **AWS Organizations & SCPs (Service Control Policies):** Used to apply boundaries across an entire organization or specific OUs (Organizational Units). They override IAM policies (e.g., if an SCP denies access, an Allow in IAM is ignored).

### Securing Infrastructure & Networking
* **VPC Security:**
    * **Security Groups (SGs):** Stateful, operate at the instance level. All rules are evaluated.
    * **Network ACLs (NACLs):** Stateless, operate at the subnet level. Rules are evaluated in order of rule number.
* **AWS WAF (Web Application Firewall):** Protects web applications from common exploits (SQL injection, cross-site scripting). Used with CloudFront, ALB, API Gateway.
* **AWS Shield:** Protects against DDoS attacks. Shield Standard is free; Shield Advanced provides enhanced protection and cost-protection for scaling during an attack.
* **AWS Network Firewall:** Managed firewall service for your VPC to deploy stateful network traffic inspection.

### Data Protection (At Rest & In Transit)
* **AWS KMS (Key Management Service):** Manages symmetric and asymmetric encryption keys. Understand CMKs (Customer Managed Keys) vs. AWS Managed Keys.
* **AWS CloudHSM:** Cloud-based hardware security module. Use when you need *exclusive* control over your encryption keys to meet regulatory compliance.
* **AWS Secrets Manager:** Automatically rotates, manages, and retrieves database credentials, API keys, and other secrets. (Better than Parameter Store for automated rotation).
* **AWS Certificate Manager (ACM):** Provisions, manages, and deploys public and private SSL/TLS certificates for use with AWS services (ALB, CloudFront).
* **Amazon Macie:** Uses machine learning to discover, classify, and protect sensitive data (like PII) stored in Amazon S3.

***

## í ¼í¿—ï¸ Domain 2: Design Resilient Architectures (26%)
*Focus on multi-tier architectures, disaster recovery, fault tolerance, and high availability (HA).*

### Core Networking (Amazon VPC)
* **Subnets:** Public (has a route to an IGW) vs. Private (no route to an IGW).
* **Internet Gateway (IGW):** Allows instances in a public subnet to connect to the internet.
* **NAT Gateway / NAT Instance:** Placed in a *public* subnet to allow instances in a *private* subnet to initiate outbound IPv4 internet traffic (e.g., for updates) while preventing inbound connections.
* **VPC Peering:** Connects two VPCs using AWS's private network. It is not transitive (A->B, B->C does not mean A->C).
* **AWS Transit Gateway:** A central hub that simplifies VPC peering and VPN connections across thousands of VPCs and on-premises networks.
* **VPC Endpoints (PrivateLink):** Allows you to privately connect your VPC to supported AWS services (like S3 or DynamoDB) without requiring an IGW, NAT device, or public IP. (Gateway Endpoints for S3/DynamoDB; Interface Endpoints for others).

### High Availability & Scalability
* **Amazon Route 53:** Highly available DNS service. Know the routing policies: Simple, Weighted, Latency, Failover, Geolocation, Geoproximity, and Multivalue Answer.
* **Elastic Load Balancing (ELB):**
    * **Application Load Balancer (ALB):** Layer 7 (HTTP/HTTPS), routes traffic based on URL path, host, or HTTP headers.
    * **Network Load Balancer (NLB):** Layer 4 (TCP/UDP), ultra-high performance, uses static IP addresses.
* **Auto Scaling Groups (ASG):** Automatically adjusts the number of EC2 instances based on demand. Understand scaling policies (Target tracking, Step scaling, Simple scaling).

### Disaster Recovery (DR) Strategies
* **Backup and Restore:** Lowest cost, highest RTO/RPO (Recovery Time/Point Objective).
* **Pilot Light:** Minimal version of an environment is always running in the cloud (e.g., critical databases).
* **Warm Standby:** A scaled-down version of a fully functional environment is always running.
* **Multi-Site Active/Active:** Zero downtime, lowest RTO/RPO, highest cost. Traffic is routed to multiple regions simultaneously.

***

## í ½íº€ Domain 3: Design High-Performing Architectures (24%)
*Focus on selecting the right compute, storage, networking, and database solutions to maximize performance.*

### Compute Services
* **Amazon EC2:** Virtual servers. Understand instance families (Compute optimized, Memory optimized, Storage optimized).
* **AWS Lambda:** Serverless compute. Runs code in response to events without provisioning servers. Maximum execution time is 15 minutes.
* **Amazon ECS & EKS:** Container orchestration services. ECS is AWS-native; EKS is managed Kubernetes. Use AWS Fargate to run containers without managing the underlying EC2 instances.

### Storage Services
* **Amazon S3 (Simple Storage Service):** Object storage. Understand S3 storage classes (Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant/Flexible/Deep Archive) and lifecycle policies.
* **Amazon EBS (Elastic Block Store):** Block storage attached to a single EC2 instance. Know the volume types: gp2/gp3 (general purpose SSD), io1/io2 (provisioned IOPS SSD for high performance/databases), st1 (throughput optimized HDD), sc1 (cold HDD).
* **Amazon EFS (Elastic File System):** Managed NFS file system that can be mounted by *multiple* EC2 instances simultaneously across different AZs. Linux only.
* **Amazon FSx:** Fully managed third-party file systems.
    * *FSx for Windows File Server:* For Windows workloads via SMB.
    * *FSx for Lustre:* High-performance computing (HPC), machine learning, and video processing.

### Databases
* **Amazon RDS:** Managed relational databases (MySQL, PostgreSQL, Oracle, SQL Server, MariaDB). Supports Multi-AZ deployments (for DR) and Read Replicas (for scaling read performance).
* **Amazon Aurora:** High-performance, MySQL/PostgreSQL-compatible relational database. Scales automatically and replicates 6 copies of your data across 3 AZs.
* **Amazon DynamoDB:** Fully managed, highly scalable NoSQL key-value database. Millisecond latency. Use DynamoDB Accelerator (DAX) for microsecond caching.
* **Amazon ElastiCache:** Managed Redis or Memcached. Used to cache frequently queried data to relieve database load.
* **Amazon Redshift:** Petabyte-scale data warehouse. Used for OLAP (Online Analytical Processing) and complex querying.

### Application Integration & Caching
* **Amazon CloudFront:** Global Content Delivery Network (CDN). Caches static and dynamic content at edge locations to reduce latency.
* **Amazon SQS (Simple Queue Service):** Fully managed message queuing service to decouple microservices. Standard (best effort ordering) vs. FIFO (strict ordering).
* **Amazon SNS (Simple Notification Service):** Pub/sub messaging service. Sends messages to multiple subscribers (email, SMS, SQS, Lambda).
* **Amazon Kinesis:** For ingesting and analyzing real-time streaming data (video, IoT telemetry, application logs).

***

## í ½í²° Domain 4: Design Cost-Optimized Architectures (20%)
*Focus on understanding AWS pricing models and selecting the most cost-effective solutions.*

### EC2 Pricing Models
* **On-Demand:** Pay by the second. Most flexible, highest cost. Best for short-term, spiky, or unpredictable workloads.
* **Reserved Instances (RIs) / Savings Plans:** Commit to 1 or 3 years for a massive discount. Best for steady-state, predictable workloads.
* **Spot Instances:** Bid on unused EC2 capacity at up to 90% off. AWS can terminate them with a 2-minute warning. Best for fault-tolerant, flexible workloads (batch processing, optional tasks).

### Storage Cost Optimization
* **S3 Lifecycle Policies:** Automatically transition objects to cheaper storage classes (e.g., Standard to Standard-IA to Glacier) after a set number of days.
* **S3 Intelligent-Tiering:** Automatically moves data to the most cost-effective access tier based on actual access patterns, without operational overhead or retrieval fees.
* **EBS Volumes:** Delete unattached EBS volumes and outdated EBS snapshots to save money.

### Data Transfer Costs
* **General Rule:** Data moving *into* AWS is generally free. Data moving *out of* AWS (to the internet) incurs charges.
* **Region-to-Region:** Data transfer between AWS regions costs money.
* **AZ-to-AZ:** Data transfer between Availability Zones within the same region costs money.
* **CloudFront:** Using CloudFront is often cheaper for distributing content globally than serving it directly out of S3 or EC2 because data transfer from AWS origins to CloudFront edge locations is free.

### Cost Management Tools
* **AWS Cost Explorer:** Visualize, understand, and manage your AWS costs and usage over time.
* **AWS Budgets:** Set custom budgets that alert you when your costs or usage exceed (or are forecasted to exceed) your budgeted amount.
* **AWS Compute Optimizer:** Recommends optimal AWS compute resources (EC2, EBS, Lambda) to reduce costs and improve performance using machine learning.

**Steps to build and push the image to the ECR**

1️⃣ Create ECR Repository (AWS)
AWS Console → Amazon ECR → Repositories → Create repository
Fill:
Visibility: Private
Repository name: demo/lfb
Region: ap-south-1

2️⃣ Create GitHub OIDC Identity Provider (AWS IAM)
IAM → Identity providers → Add provider
⚠️ This is NOT the EKS OIDC provider.
Fill exactly:
Field	Value
Provider type	OpenID Connect
Provider URL	https://token.actions.githubusercontent.com
Audience	sts.amazonaws.com
Click Add provider
✅ Result:
arn:aws:iam::202279973546:oidc-provider/token.actions.githubusercontent.com

3️⃣ Create IAM Role for GitHub Actions
Console steps
IAM → Roles → Create role
Trusted entity
Select Web identity
Identity provider: token.actions.githubusercontent.com
Audience: sts.amazonaws.com
Click Next

4️⃣ Configure Trust Policy (VERY IMPORTANT)
Edit Trust relationships → Replace with:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::202279973546:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:Lokeshv1209/open-id-connect-with-aws:*"
        }
      }
    }
  ]
}

5️⃣ Attach ECR Permissions to the Role
Attach AWS managed policy:
AmazonEC2ContainerRegistryPowerUser
This allows:
Login to ECR
Push images
Pull images
✅ Your role now:
GitHubActions-ECR-Push

6️⃣ Verify Role Exists
IAM → Roles → GitHubActions-ECR-Push
You should see:
Trusted entity: GitHub OIDC provider
Permissions: ECR PowerUser









**Steps to run the image stored in the ECR in the ECS**

Running an ECS Fargate Task for Testing (Run Task – Detailed Steps)
Goal: Run a container image from ECR on AWS ECS Fargate for testing using a public IP

0️⃣ Prerequisites (already completed)
Docker image pushed to Amazon ECR
ECS Cluster created
ECS Task Definition created
Internet Gateway attached to VPC
Route table updated with 0.0.0.0/0 → IGW
Security group allows inbound traffic on app port (5000)
App listens on 0.0.0.0:5000

1️⃣ Create / Update Task Definition
ECS → Task Definitions → Create new revision
Task settings
Launch type: Fargate
OS/Architecture: Linux / x86_64
CPU: 1 vCPU
Memory: 3 GiB
Network mode: awsvpc
Container definition
Field	Value
Container name	lfb
Image	202279973546.dkr.ecr.ap-south-1.amazonaws.com/demo/lfb:<tag>
Port mappings	5000 / TCP
Essential	✅
Environment variables	PORT=5000, HOST=0.0.0.0 pass it in the Dockerfile
IAM roles
Task execution role: ecsTaskExecutionRole
Task role: None
Save → New revision created

2️⃣ Run Task (Testing Mode)
Go to:
ECS → Task definitions → open-id-connect-with-aws:<revision> → Run task

3️⃣ Run Task Configuration (IMPORTANT)
Task details
Task definition: open-id-connect-with-aws
Revision: Latest
Desired tasks: 1
Environment
Launch type: FARGATE
Cluster: open-id-connect-with-aws
Networking (CRITICAL)
Setting	Value
VPC	Default VPC
Subnet	Public subnet
Security group	Allows TCP 5000
Auto-assign public IP	ENABLED
IAM
Task execution role: ecsTaskExecutionRole
Task role: (empty)
Container overrides
❌ Do NOT override command
❌ No echo hello world
Platform version
LATEST
Click Create

4️⃣ Verify Task Status
Go to:
ECS → Clusters → open-id-connect-with-aws → Tasks
Expected:
Status: RUNNING

5️⃣ Access the Application
Open the running task
Copy Public IP
Access in browser:
http://<public-ip>:5000
✅ Application loads successfully

6️⃣ Why this Worked (Key Points)
Task runs in awsvpc mode
ENI attached directly to the task
Public IP + IGW route allows internet access
App listens on 0.0.0.0
Container port matches app port

7️⃣ Common Errors You Avoided (Good Job)
Mistake	Result
No IGW route	Image pull fails
App bound to localhost	Connection refused
Wrong container port	App unreachable
Command override	Task exits
No public IP	Cannot access




**Steps to deploy app into eks using the service load balancer**
EKS Production Setup — Phase 1 (Foundation)

Create a production-ready EKS cluster with:
Custom VPC
Public + private subnets
NAT + IGW
EKS cluster
Node group
ECR integration
App deployment

Region used: us-east-1

🧱 1. Create VPC
CIDR: 10.0.0.0/16
Go: VPC → Create VPC → VPC only
Name: eks-vpc

🌐 2. Create Subnets
Create 4 subnets:

Public subnets
10.0.1.0/24  (AZ-a)
10.0.3.0/24  (AZ-b)

Private subnets
10.0.2.0/24  (AZ-a)
10.0.4.0/24  (AZ-b)

Why 2 AZ?
Production HA.

🌍 3. Internet Gateway
Create IGW:
eks-igw
Attach to VPC.

📡 4. Public Route Table
Create: eks-public-rt
Add route: 0.0.0.0/0 → IGW
Associate: public subnets

🔐 5. NAT Gateway
Create in public subnet: eks-nat
Allocate Elastic IP.
Wait until: Available

🧭 6. Private Route Table
Create: eks-private-rt
Add route: 0.0.0.0/0 → NAT
Associate: 
private subnets

🏷 7. Tag Subnets for EKS
Public subnets
kubernetes.io/cluster/eks-cluster-oidc = shared
kubernetes.io/role/elb = 1

Private subnets
kubernetes.io/cluster/eks-cluster-oidc = shared
kubernetes.io/role/internal-elb = 1

This allows:
Load balancers
Node networking

🔑 8. IAM Roles
Cluster role () (we can reuseif we already have this: AmazonEKSAutoClusterRole for any new cluster in same account.)
Name: AmazonEKSAutoClusterRole
Policies: AmazonEKSClusterPolicy

Node role
Name: eksNodeRole
Policies: 
AmazonEKSWorkerNodePolicy
AmazonEKS_CNI_Policy
AmazonEC2ContainerRegistryReadOnly

☸️ 9. Create EKS Cluster
Type: Custom configuration
Cluster name: eks-cluster-oidc
Region: us-east-1
Select: VPC
all 4 subnets
public + private endpoint
Wait until:
Status: Active

🖥 10. Create Node Group
Name: eks-ng-oidc
Instance: t3.medium
Nodes: 
min: 1
desired: 2
max: 2

Subnets: PRIVATE subnets only
Wait until: Active
Check: kubectl get nodes

📦 11. Create ECR Repo
Region: us-east-1
Repo: demo/lfb

🔐 12. GitHub OIDC for ECR
IAM role: GitHubActions-ECR-Push
Policy: AmazonEC2ContainerRegistryFullAccess
Used by GitHub to push images.

🚀 13. Deploy App (Manual Validation)
Deployment:

kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

Service type: LoadBalancer

This auto creates AWS LB.

Traffic flow:

Internet
 → AWS ELB
 → NodePort
 → Pod
 → Container:5000

🧪 Validation Commands
Check nodes: kubectl get nodes
Check pods: kubectl get pods
Check svc: kubectl get svc
Check logs: kubectl logs -l app=lfb

🟢 Phase-1 Completed
You now have:
Production VPC
Secure private nodes
NAT networking
ECR integration
EKS cluster
Running app

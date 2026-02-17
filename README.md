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


**Steps to deploy app into EKS + CI/CD (Production-grade OIDC deployment) using the service load balancer**
This phase covers:

EKS cluster deployment
Node group creation
Private networking
ECR integration
GitHub OIDC authentication
CI/CD pipeline (build + deploy)
Automatic rollout to cluster

🧭 Architecture
GitHub push
   ↓
GitHub Actions
   ↓ OIDC
AWS IAM Role
   ↓
ECR (image push)
   ↓
EKS cluster
   ↓
Kubernetes deployment
   ↓
ALB LoadBalancer → Internet

🏗 1. Create ECR repository
Region: same as EKS cluster (important)
Example: us-east-1
Repository name: demo/lfb
Full URI: 202279973546.dkr.ecr.us-east-1.amazonaws.com/demo/lfb

🔐 2. Create GitHub OIDC provider (AWS)
AWS Console → IAM → Identity Providers → Add provider
Provider type: OpenID Connect
URL: https://token.actions.githubusercontent.com
Audience: sts.amazonaws.com

🔑 3. IAM role for GitHub → ECR push
Create role: GitHubActions-ECR-Push
Trusted entity: Web identity
Provider: token.actions.githubusercontent.com
Condition:
"StringLike": {
  "token.actions.githubusercontent.com:sub": "repo:Lokeshv1209/open-id-connect-with-aws:*"
}
Attach policies: AmazonEC2ContainerRegistryFullAccess

🔑 4. IAM role for GitHub → EKS deploy
Create role: GitHubActions-EKS-Autodeploy
Attach policies: AmazonEKSClusterPolicy, AmazonEC2ContainerRegistryReadOnly
Trust policy:
{
 "Effect": "Allow",
 "Principal": {
   "Federated": "arn:aws:iam::202279973546:oidc-provider/token.actions.githubusercontent.com"
 },
 "Action": "sts:AssumeRoleWithWebIdentity",
 "Condition": {
   "StringLike": {
     "token.actions.githubusercontent.com:sub": "repo:Lokeshv1209/open-id-connect-with-aws:*"
   }
 }
}

🔐 5. Grant role access to EKS (NEW METHOD)
EKS → Cluster → Access → Create access entry
IAM principal: GitHubActions-EKS-Autodeploy
Attach policy: AmazonEKSAdminPolicy
Scope: Cluster
This replaces old aws-auth configmap.

🐳 6. GitHub build and deploy pipeline (CI/CD)
.github/workflows/buildAndDeploy.yaml
name: Build and Deploy to EKS

on:
  push:
    branches:
      - "*"           # build for all branches (good for testing PRs)
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: demo/lfb
  AWS_ACCOUNT_ID: 202279973546
  CLUSTER_NAME: eks-cluster-oidc

jobs:

---------------- BUILD ----------------
  build:
    runs-on: ubuntu-latest
    outputs:
      image_uri: ${{ steps.build.outputs.image_uri }}
      image_tag: ${{ steps.meta.outputs.tag }}

    steps:
      - uses: actions/checkout@v4

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::202279973546:role/GitHubActions-ECR-Push
          aws-region: ${{ env.AWS_REGION }}

      - uses: aws-actions/amazon-ecr-login@v2

      - name: Generate SHA tag
        id: meta
        run: echo "tag=${GITHUB_SHA::8}" >> "$GITHUB_OUTPUT"

      - name: Build & push image
        id: build
        run: |
          IMAGE_TAG="${{ steps.meta.outputs.tag }}"
          IMAGE_URI="${{ env.AWS_ACCOUNT_ID }}.dkr.ecr.${{ env.AWS_REGION }}.amazonaws.com/${{ env.ECR_REPOSITORY }}:${IMAGE_TAG}"

          docker build -t "$IMAGE_URI" .
          docker push "$IMAGE_URI"

          echo "image_uri=$IMAGE_URI" >> "$GITHUB_OUTPUT"

---------------- DEPLOY ----------------
  deploy:
    runs-on: ubuntu-latest
    needs: build

    steps:
      - uses: actions/checkout@v4

      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::202279973546:role/GitHubActions-EKS-Autodeploy
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig \
            --region $AWS_REGION \
            --name $CLUSTER_NAME

      - name: Deploy exact image
        run: |
          IMAGE_URI="${{ needs.build.outputs.image_uri }}"

          kubectl set image deployment/lfb \
            lfb=$IMAGE_URI \
            --record

          kubectl rollout status deployment/lfb

📦 8. Kubernetes deployment

k8s/deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: lfb
spec:
  replicas: 2
  selector:
    matchLabels:
      app: lfb
  template:
    metadata:
      labels:
        app: lfb
    spec:
      containers:
      - name: lfb
        image: 202279973546.dkr.ecr.us-east-1.amazonaws.com/demo/lfb:PLACEHOLDER_TAG
        ports:
        - containerPort: 5000

🌐 9. Service

k8s/service.yaml

apiVersion: v1
kind: Service
metadata:
  name: lfb-service
spec:
  type: LoadBalancer
  selector:
    app: lfb
  ports:
    - port: 80
      targetPort: 5000


AWS automatically creates ELB.

🔁 Deployment flow
git push main
   ↓
GitHub build image
   ↓
Push to ECR
   ↓
GitHub deploy job
   ↓
kubectl set image
   ↓
rolling update

🧪 Test commands
kubectl get pods
kubectl get svc
kubectl describe pod

🔐 Security achieved

✔ No AWS access keys
✔ OIDC authentication
✔ IAM role trust
✔ private nodes
✔ NAT outbound only
✔ rolling updates
✔ commit SHA versioning


**Rollout**

Check current Pods
kubectl get pods

Example output:
lfb-57455d8d99-5rtlh   1/1   Running   0   22m
lfb-57455d8d99-rslgr   1/1   Running   0   23m

2️⃣ Check current image
kubectl get deployment lfb -o=jsonpath='{.spec.template.spec.containers[*].image}'

Output:
202279973546.dkr.ecr.us-east-1.amazonaws.com/demo/lfb:83b5fcb2

3️⃣ View rollout history
kubectl rollout history deployment lfb

Example:
REVISION  CHANGE-CAUSE
1         <none>
...
7         kubectl set image ...:01ab46a6 --record=true
8         kubectl set image ...:83b5fcb2 --record=true

4️⃣ Rollback to a previous revision
Rollback to Revision 7 (image 01ab46a6):
kubectl rollout undo deployment lfb --to-revision=7

Check rollout status: kubectl rollout status deployment lfb

Confirm the image: kubectl get deployment lfb -o=jsonpath='{.spec.template.spec.containers[*].image}'

Output: 202279973546.dkr.ecr.us-east-1.amazonaws.com/demo/lfb:01ab46a6

5️⃣ Rollback to Revision 8 (image 83b5fcb2) if needed
kubectl rollout undo deployment lfb --to-revision=8
kubectl rollout status deployment lfb
kubectl get deployment lfb -o=jsonpath='{.spec.template.spec.containers[*].image}'
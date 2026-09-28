# PHASE 27: INFRASTRUCTURE AS CODE (Terraform - AWS EKS)

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "mahi-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. Virtual Private Cloud (VPC) for Secure Networking
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "mahi-apiverse-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false
}

# 2. Amazon Elastic Kubernetes Service (EKS) Cluster
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "mahi-cluster"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    # The General Node Group for API and Web Portal
    general = {
      desired_size = 3
      min_size     = 2
      max_size     = 10
      instance_types = ["t3.large"]
    }

    # High Memory Nodes dedicated for PostgreSQL & OpenSearch
    database = {
      desired_size = 3
      min_size     = 3
      max_size     = 5
      instance_types = ["r6g.xlarge"]
      labels = {
        role = "database"
      }
    }
  }
}

# 3. Output the Kubeconfig connection string
output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

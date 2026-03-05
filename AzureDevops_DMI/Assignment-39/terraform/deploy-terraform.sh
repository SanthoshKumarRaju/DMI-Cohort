#!/bin/bash

set -e

echo "=========================================="
echo "Terraform VM Deployment Script"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
check_directory() {
    if [ ! -f "main.tf" ]; then
        print_error "Please run this script from the terraform directory"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install it first."
        exit 1
    fi
    
    if [ ! -f "terraform.tfvars" ]; then
        print_error "terraform.tfvars file not found. Please create it with your configuration."
        exit 1
    fi
    
    print_info "All prerequisites satisfied."
}

# Initialize Terraform
init_terraform() {
    print_info "Initializing Terraform..."
    terraform init
}

# Validate Terraform configuration
validate_terraform() {
    print_info "Validating Terraform configuration..."
    terraform validate
}

# Plan Terraform deployment
plan_terraform() {
    print_info "Creating Terraform plan..."
    terraform plan -out=tfplan
}

# Apply Terraform configuration
apply_terraform() {
    print_info "Applying Terraform configuration..."
    terraform apply -auto-approve tfplan
}

# Get outputs
show_outputs() {
    print_info "Deployment completed successfully!"
    echo ""
    print_info "=== VM Connection Details ==="
    print_info "Public IP: $(terraform output -raw vm_public_ip)"
    print_info "Username: $(terraform output -raw admin_username)"
    print_info "Web URL: http://$(terraform output -raw vm_public_ip)"
    echo ""
    print_info "SSH Command: ssh $(terraform output -raw admin_username)@$(terraform output -raw vm_public_ip)"
    echo ""
    print_warn "Wait 2-3 minutes for the VM to fully initialize before running Ansible."
}

# Main deployment process
main() {
    print_info "Starting Terraform deployment..."
    
    check_directory
    check_prerequisites
    init_terraform
    validate_terraform
    plan_terraform
    apply_terraform
    show_outputs
    
    print_info "=========================================="
    print_info "✅ Terraform deployment completed!"
    print_info "=========================================="
}

# Run main function
main "$@"
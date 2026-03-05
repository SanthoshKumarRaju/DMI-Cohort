#!/bin/bash

set -e

echo "=========================================="
echo "Ansible NGINX Configuration Script"
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

# Set environment variables to force config usage
export ANSIBLE_CONFIG=$(pwd)/ansible.cfg
export ANSIBLE_INVENTORY=$(pwd)/inventory.ini

print_info "Using ANSIBLE_CONFIG: $ANSIBLE_CONFIG"
print_info "Using ANSIBLE_INVENTORY: $ANSIBLE_INVENTORY"

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command -v ansible &> /dev/null; then
        print_error "Ansible is not installed. Please install it first."
        exit 1
    fi
    
    if [ ! -f "inventory.ini" ]; then
        print_error "inventory.ini file not found."
        exit 1
    fi
    
    if [ ! -f "nginx-setup.yml" ]; then
        print_error "nginx-setup.yml file not found."
        exit 1
    fi
    
    print_info "All prerequisites satisfied."
}

# Test Ansible connection
test_ansible_connection() {
    print_info "Testing Ansible connection to VM..."
    
    if ansible web_servers -m ping; then
        print_info "✅ Ansible connection successful!"
    else
        print_error "❌ Ansible connection failed"
        exit 1
    fi
}

# Run Ansible playbook
run_ansible() {
    print_info "Running Ansible playbook to configure NGINX..."
    
    if ansible-playbook nginx-setup.yml; then
        print_info "✅ Ansible playbook completed successfully!"
    else
        print_error "❌ Ansible playbook failed"
        exit 1
    fi
}

# Verify deployment
verify_deployment() {
    print_info "Verifying NGINX deployment..."
    
    vm_ip="172.172.180.18"
    
    print_info "Testing web server at: http://$vm_ip"
    
    # Wait for NGINX to start
    sleep 5
    
    # Test HTTP connectivity
    if curl -s -f "http://$vm_ip" > /dev/null; then
        print_info "✅ NGINX is successfully serving content!"
        print_info "🌐 Your application is accessible at: http://$vm_ip"
        
        # Show webpage content
        print_info "Webpage content:"
        curl -s "http://$vm_ip" | head -20
    else
        print_error "❌ NGINX is not responding"
        
        # Debug information
        print_info "Checking NGINX status on VM..."
        ansible web_servers -m command -a "systemctl status nginx" --become
        
        print_info "Checking NGINX configuration..."
        ansible web_servers -m command -a "nginx -t" --become
        
        exit 1
    fi
    
    # Final checks
    print_info "Final system checks:"
    ansible web_servers -m command -a "systemctl is-active nginx" --become
    ansible web_servers -m command -a "systemctl is-enabled nginx" --become
    ansible web_servers -m command -a "ls -la /var/www/html/" --become
}

# Main deployment process
main() {
    print_info "Starting Ansible NGINX deployment..."
    
    check_prerequisites
    test_ansible_connection
    run_ansible
    verify_deployment
    
    print_info "=========================================="
    print_info "🎉 NGINX deployment completed successfully!"
    print_info "🌐 Access your React app at: http://172.172.180.18"
    print_info "=========================================="
}

# Run main function
main "$@"
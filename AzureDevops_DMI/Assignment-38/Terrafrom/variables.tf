variable "admin_password" {
  description = "The password for the VM admin user"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.admin_password) >= 12
    error_message = "The admin password must be at least 12 characters long."
  }
}
output "public_ip" {
  description = "Public IP of the VM."
  value       = azurerm_public_ip.pip.ip_address
}

output "ssh_command" {
  description = "Command to connect to the VM."
  value       = "ssh ${var.admin_username}@${azurerm_public_ip.pip.ip_address}"
}

output "frontend_url" {
  value = "http://${azurerm_public_ip.pip.ip_address}:3000"
}

output "backend_url" {
  value = "http://${azurerm_public_ip.pip.ip_address}:8081"
}

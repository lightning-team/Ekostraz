variable "region" {
	default = "West Europe"
}
variable "resource_group_name" {
	default = "requestsapp"
}
variable "function_app_name" {
	default = "requestsapp"
}
variable "storage_account_name" {
	default = "requestsstorage" 
}
variable "storage_replication_type" {
	default = "GRS"
}
variable "storage_account_kind" {
	default = "StorageV2"
}
variable "testprefix" {
	default = ""
}
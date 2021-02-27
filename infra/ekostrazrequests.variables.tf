variable "region" {
	default = "West Europe"
}
variable "resource_group_name" {
	default = ""
}
variable "function_app_name" {
	default = "requestsappec"
}
variable "storage_account_name" {
	default = "requestsstorageec" 
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

variable "subscription_id" {
	default = ""
}
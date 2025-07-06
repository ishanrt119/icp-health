use candid::CandidType;
use candid::Principal;
use serde::{Deserialize, Serialize};
use ic_cdk::api::time;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct User {
    pub name: String,
    pub email: String,
    pub role: String, // "doctor", "patient", "admin"
    pub principal: Principal,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct UserPublic {
    pub name: String,
    pub email: String,
    pub role: String,
    pub principal: Option<Principal>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct UploadBlock {
    pub index: u64,
    pub timestamp: u64,
    pub file_name: String,
    pub doc_type: String,
    pub subtype: String,
    pub file_content: String,
    pub doctor_name: String,
    pub earning_icp: u64,
    pub hash: String,
    pub previous_hash: String,
    pub patient_name: String, 
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UploadRecord {
    pub user_principal: String,
    pub filename: String,
    pub category: String,
    pub keywords: String,
    pub doctor: String,
    pub earning: u32,
    pub timestamp: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct DataRequest {
    pub id: String,
    pub requester_name: String,
    pub requester_email: String,
    pub recipients: Vec<String>,
    pub data_type: String,
    pub purpose: String,
    pub message: String,
    pub compensation: String,
    pub status: String,
    pub date: String,
}


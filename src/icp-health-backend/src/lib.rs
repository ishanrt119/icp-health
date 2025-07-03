mod models;
mod storage;
mod handlers;
use crate::models::UserPublic;
use crate::models::UploadBlock;



use ic_cdk_macros::{query, update};
use candid::Principal;

#[update]
fn register_user(name: String, email: String, role: String) -> Result<(), String> {
    handlers::register_user(name, email, role)
}

#[update]
fn fix_doctors_principals() {
    handlers::fix_existing_doctors();
}

#[query]
fn get_user() -> models::User {
    handlers::get_user()
}

#[query]
fn check_user_exists() -> bool {
    handlers::check_user_exists()
}

#[query]
fn get_my_uploads() -> Vec<models::UploadBlock> {
    handlers::get_my_uploads()
}

#[update]
fn upload_document(
    file_name: String,
    doc_type: String,
    subtype: String,
    file_content: String,
    doctor_name: String,
) -> Result<UploadBlock, String> {
    handlers::upload_document(file_name, doc_type, subtype, file_content, doctor_name)
}


#[update]
fn delete_upload(hash: String) -> Result<(), String> {
    handlers::delete_upload(hash)
}


#[query]
fn get_uploads_for_doctor() -> Vec<models::UploadBlock> {
    handlers::get_uploads_for_doctor()
}

#[query]
fn get_all_doctors() -> Vec<UserPublic> {
    handlers::get_all_doctors()
}
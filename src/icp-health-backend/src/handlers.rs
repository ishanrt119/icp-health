use ic_cdk::api::{caller, time};
use crate::models::{User, UploadBlock, UserPublic};
use crate::storage::{USERS, UPLOAD_CHAINS};
use sha2::{Sha256, Digest};
use candid::Principal;
use crate::models::DataRequest;
use crate::storage::DATA_REQUESTS;
use ic_cdk_macros::{update, query};


fn current_timestamp() -> u64 {
    time() / 1_000_000_000
}

fn calculate_hash(index: u64, timestamp: u64, file_name: &str, doc_type: &str, subtype: &str, previous_hash: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(index.to_string());
    hasher.update(timestamp.to_string());
    hasher.update(file_name);
    hasher.update(doc_type);
    hasher.update(subtype);
    hasher.update(previous_hash);
    format!("{:x}", hasher.finalize())
}

pub fn submit_data_request(request: DataRequest) {
    ic_cdk::println!(
    "📩 New request submitted for recipients: {:?}", 
    request.recipients
);

    DATA_REQUESTS.with(|reqs| reqs.borrow_mut().push(request));
}

pub fn get_data_requests_by_email(email: String) -> Vec<DataRequest> {
    DATA_REQUESTS.with(|reqs| {
        reqs.borrow()
            .iter()
            .filter(|r| r.recipients.contains(&email) && !r.requester_email.is_empty()) // skip malformed
            .cloned()
            .collect()
    })
}

pub fn get_sent_requests_by_email(email: String) -> Vec<DataRequest> {
    DATA_REQUESTS.with(|reqs| {
        reqs.borrow()
            .iter()
            .filter(|r| r.requester_email == email)
            .cloned()
            .collect()
    })
}

pub fn update_data_request_status(id: String, new_status: String) -> Result<(), String> {
    DATA_REQUESTS.with(|requests| {
        let mut reqs = requests.borrow_mut();
        if let Some(req) = reqs.iter_mut().find(|r| r.id == id) {
            req.status = new_status;
            Ok(())
        } else {
            Err("Request not found".to_string())
        }
    })
}


pub fn upload_document(
    file_name: String,
    doc_type: String,
    subtype: String,
    file_content: String,
    doctor_name: String,
) -> Result<UploadBlock, String> {
    let patient_principal = caller();

    let user = USERS.with(|users| users.borrow().get(&patient_principal).cloned());
    if user.is_none() {
        return Err("User not registered".to_string());
    }
    let user = user.unwrap();
    if user.role != "patient" {
        return Err("Only patients can upload documents".to_string());
    }

    let file_name_for_hash = file_name.clone();
    let doc_type_for_hash = doc_type.clone();
    let subtype_for_hash = subtype.clone();
    let doctor_name_final = doctor_name.clone();

    let new_block = UPLOAD_CHAINS.with(|chains| {
        let mut chains = chains.borrow_mut();
        let user_chain = chains.entry(patient_principal).or_insert(Vec::new());

        let index = user_chain.len() as u64;
        let timestamp = current_timestamp();
        let previous_hash = if index == 0 {
            "genesis".to_string()
        } else {
            user_chain.last().unwrap().hash.clone()
        };

        let earning_icp = match doc_type.to_lowercase().as_str() {
            "mri" => 25,
            "prescription" => 30,
            "scan" => 20,
            "medical test" => 35,
            "reports" => 40,
            "other" => 10,
            _ => 15,
        };

        let block = UploadBlock {
            index,
            timestamp,
            file_name,
            doc_type,
            subtype,
            file_content,
            doctor_name: doctor_name_final,
            earning_icp,
            hash: calculate_hash(index, timestamp, &file_name_for_hash, &doc_type_for_hash, &subtype_for_hash, &previous_hash),
            previous_hash,
            patient_name: user.name.clone(), 
        };

        user_chain.push(block.clone());
        block
    });

    Ok(new_block)
}

pub fn get_my_uploads() -> Vec<UploadBlock> {
    let principal = caller();
    UPLOAD_CHAINS.with(|chains| {
        chains.borrow().get(&principal).cloned().unwrap_or_default()
    })
}

pub fn get_all_collaborators() -> Vec<UserPublic> {
    USERS.with(|users| {
        users
            .borrow()
            .iter()
            .filter(|(_, u)| u.role == "provider" || u.role == "researcher")
            .map(|(p, u)| UserPublic {
                name: u.name.clone(),
                email: u.email.clone(),
                role: u.role.clone(),
                principal: Some(*p),
            })
            .collect()
    })
}

pub fn delete_upload(hash: String) -> Result<(), String> {
    let principal = caller();
    UPLOAD_CHAINS.with(|chains| {
        let mut chains = chains.borrow_mut();
        if let Some(chain) = chains.get_mut(&principal) {
            let original_len = chain.len();
            chain.retain(|block| block.hash != hash);
            if chain.len() < original_len {
                return Ok(());
            } else {
                return Err("Block not found".to_string());
            }
        }
        Err("No uploads found".to_string())
    })
}

pub fn get_user() -> User {
    let principal = caller();
    USERS.with(|users| {
        users
            .borrow()
            .get(&principal)
            .expect("User not found")
            .clone()
    })
}

pub fn check_user_exists() -> bool {
    let principal = caller();
    USERS.with(|users| users.borrow().contains_key(&principal))
}

pub fn register_user(name: String, email: String, role: String) -> Result<(), String> {
    let principal = caller();
    let user = User {
        name,
        email,
        role,
        principal,
    };

    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if users.contains_key(&principal) {
            return Err("User already registered".to_string());
        }
        users.insert(principal, user);
        Ok(())
    })
}

pub fn get_all_doctors() -> Vec<UserPublic> {
    USERS.with(|users| {
        users
            .borrow()
            .iter()
            .filter(|(_, u)| u.role == "doctor" || u.role == "provider")
            .map(|(p, u)| UserPublic {
                name: u.name.clone(),
                email: u.email.clone(),
                role: u.role.clone(),
                principal: Some(*p),
            })
            .collect()
    })
}

pub fn get_uploads_for_doctor() -> Vec<UploadBlock> {
    let principal = caller();
    let doctor_opt = USERS.with(|users| users.borrow().get(&principal).cloned());

    if let Some(doctor) = doctor_opt {
        if doctor.role != "doctor" && doctor.role != "provider" {
            return vec![];
        }

        let doctor_name = doctor.name.to_lowercase();

        UPLOAD_CHAINS.with(|chains| {
            chains
                .borrow()
                .values()
                .flat_map(|chain| chain.clone())
                .filter(|block| block.doctor_name.to_lowercase() == doctor_name)
                .collect()
        })
    } else {
        vec![]
    }
}

pub fn fix_existing_doctors() {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        let existing = users.clone();
        for (p, mut user) in existing {
            if (user.role == "doctor" || user.role == "provider") && user.principal != p {
                user.principal = p;
                users.insert(p, user);
            }
        }
    });
}

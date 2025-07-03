use std::collections::HashMap;
use std::cell::RefCell;
use candid::Principal;
use crate::models::{User, UploadBlock};

thread_local! {
    pub static USERS: RefCell<HashMap<Principal, User>> = RefCell::new(HashMap::new());
    pub static UPLOAD_CHAINS: RefCell<HashMap<Principal, Vec<UploadBlock>>> = RefCell::new(HashMap::new());
}

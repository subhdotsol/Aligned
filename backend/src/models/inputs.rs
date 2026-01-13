use serde::Deserialize;

#[derive(Deserialize)]
pub struct PhoneLoginRequest {
    pub phone: String,
}

#[derive(Deserialize)]
pub struct PhoneVerifyRequest {
    pub verification_id: String,
    pub code: String,
}

#[derive(Deserialize)]
pub struct UpdateProfileRequest {
    pub name: Option<String>,
    pub bio: Option<String>,
    pub job: Option<String>,
    pub height: Option<i32>,
    // Add other fields as optional
}

#[derive(Deserialize)]
pub struct InteractRequest {
    pub target_user_id: String,
    pub action: String, // "LIKE" or "PASS" (Cross Click)
    pub context: Option<InteractContext>,
    pub comment: Option<String>,
}

#[derive(Deserialize)]
pub struct InteractContext {
    pub r#type: String, // "IMAGE" or "PROMPT"
    pub id: String,
}

#[derive(Deserialize)]
pub struct SendMessageRequest {
    pub text: String,
}

#[derive(Deserialize)]
pub struct MessageQuery {
    pub cursor: Option<String>, 
    pub limit: Option<i64>,
}
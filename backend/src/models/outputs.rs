use serde::Serialize;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, sqlx::FromRow, Serialize)]
pub struct MatchRow {
    pub id: Uuid,
    pub user1_id: Option<Uuid>,
    pub user2_id: Option<Uuid>,
    pub created_at: Option<DateTime<Utc>>,
    pub last_message: Option<String>,
    pub last_message_at: Option<DateTime<Utc>>,
}

#[derive(Serialize)]
pub struct StatusResponse {
    pub status: String,
    pub message: Option<String>,
}

// Auth
#[derive(Serialize)]
pub struct LoginResponse {
    pub message: String,
    pub verification_id: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserSummary,
}

#[derive(Serialize)]
pub struct UserSummary {
    pub id: String,
    pub is_profile_complete: bool,
    pub is_new_user: bool,
}

// Profile
#[derive(Serialize)]
pub struct UserProfile {
    pub id: String,
    pub name: String,
    pub images: Vec<UserImage>,
    pub prompts: Vec<UserPrompt>,
    pub details: ProfileDetails,
}

#[derive(Serialize)]
pub struct UserImage {
    pub id: String,
    pub url: String,
    pub order: i32,
}

#[derive(Serialize)]
pub struct UserPrompt {
    pub id: String,
    pub question: String,
    pub answer: String,
    pub order: i32,
}

#[derive(Serialize)]
pub struct ProfileDetails {
    pub height: Option<i32>,
    pub job: Option<String>,
    // Add other fields
}

#[derive(Serialize)]
pub struct ImageUploadResponse {
    pub id: String,
    pub url: String,
    pub order: i32,
}

#[derive(Serialize)]
pub struct FinalizeProfileResponse {
    pub success: bool,
    pub is_profile_complete: bool,
}

// Feed
#[derive(Serialize)]
pub struct FeedResponse {
    pub profiles: Vec<UserProfile>,
}

// Interactions
#[derive(Serialize, sqlx::FromRow )]
pub struct MatchResponse {
    pub status: String, // "MATCH" or "SENT"
    pub match_id: Option<String>,
    pub match_data: Option<MatchData>,
}

#[derive(Serialize)]
pub struct MatchData {
    pub user: UserSummary, // Simplified for now
}

// Messages
#[derive(Serialize)]
pub struct MatchSummary {
    pub id: String,
    pub with_user: UserSummary,
    pub last_message: Option<MessagePreview>,
}

#[derive(Serialize)]
pub struct MessagePreview {
    pub text: String,
    pub created_at: String, // ISO String
    pub is_read: bool,
}

#[derive(Serialize)]
pub struct MessageHistoryResponse {
    pub messages: Vec<Message>,
}

#[derive(Serialize)]
pub struct Message {
    pub id: String,
    pub sender_id: String,
    pub text: String,
    pub created_at: String,
}

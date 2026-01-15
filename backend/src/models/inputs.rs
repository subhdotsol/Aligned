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
pub struct UpdateUserRequest {
    pub email: Option<String>,
    pub phone: Option<String>,
}   

#[derive(Deserialize)]
pub struct UploadProfileImageRequest {
    pub image_url: String,
}

#[derive(Deserialize)]
pub struct UpdateProfileRequest {
    // For profiles table
    pub name: Option<String>,
    pub bio: Option<String>,
    pub birthdate: Option<String>,      // DATE - "1995-03-15"
    pub pronouns: Option<String>,        // "she/her", "he/him"
    pub gender: Option<String>,          // "Woman", "Man", "Non-binary"
    pub sexuality: Option<String>,       // "Straight", "Gay", "Bisexual"
    pub height: Option<i32>,             // in cm
    pub location: Option<String>,        // Will need to convert to POINT
    pub job: Option<String>,
    pub company: Option<String>,
    pub school: Option<String>,
    pub ethnicity: Option<String>,
    pub politics: Option<String>,
    pub religion: Option<String>,
    pub relationship_type: Option<String>,  // "Monogamy"
    pub dating_intention: Option<String>,   // "Long-term relationship"
    pub drinks: Option<String>,             // "Socially", "No"
    pub smokes: Option<String>,             // "No", "Yes"
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
pub struct CreatePromptRequest {
    pub question: String,
    pub answer: String,
}

#[derive(Deserialize)]
pub struct UpdatePromptRequest {
    pub question: String,
    pub answer: String,
}

// USERS PREFERENCES
#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AgeRange {
    pub min: i32,
    pub max: i32,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Preferences {
    pub age_range: Option<AgeRange>,
    pub distance_max: Option<i32>,
    pub gender_preference: Option<Vec<String>>,
    pub ethnicity_preference: Option<Vec<String>>,
    pub religion_preference: Option<Vec<String>>,
}
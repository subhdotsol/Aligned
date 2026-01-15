use sqlx::PgPool;
use uuid::Uuid;
use serde_json::json;
use crate::models::inputs::UpdateProfileRequest;
use crate::db::{user_queries, profile_queries};

/// Sample profile data for seeding
struct SeedProfile {
    phone: String,
    name: String,
    pronouns: String,
    gender: String,
    sexuality: String,
    height: i32,
    job: String,
    ethnicity: String,
    politics: String,
    religion: String,
    relationship_type: String,
    dating_intention: String,
    drinks: String,
    smokes: String,
    // Preferences for matching
    preferences: SeedPreferences,
}

/// Preferences for matching algorithm
struct SeedPreferences {
    age_min: i32,
    age_max: i32,
    distance_max: i32,
    gender_preference: Vec<String>,
    ethnicity_preference: Vec<String>,
    religion_preference: Vec<String>,
}

/// Get sample profiles data with preferences
fn get_seed_profiles() -> Vec<SeedProfile> {
    vec![
        // === WOMEN ===
        SeedProfile {
            phone: "+1111111111".to_string(),
            name: "Ana".to_string(),
            pronouns: "she/her".to_string(),
            gender: "Woman".to_string(),
            sexuality: "Straight".to_string(),
            height: 168,
            job: "Actress".to_string(),
            ethnicity: "Latina".to_string(),
            politics: "Moderate".to_string(),
            religion: "Catholic".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 25,
                age_max: 40,
                distance_max: 50,
                gender_preference: vec!["Man".to_string()],
                ethnicity_preference: vec![], // Open to all
                religion_preference: vec![],
            },
        },
        SeedProfile {
            phone: "+2222222222".to_string(),
            name: "Scarlett".to_string(),
            pronouns: "she/her".to_string(),
            gender: "Woman".to_string(),
            sexuality: "Straight".to_string(),
            height: 160,
            job: "Actress".to_string(),
            ethnicity: "White".to_string(),
            politics: "Liberal".to_string(),
            religion: "Agnostic".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Socially".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 28,
                age_max: 45,
                distance_max: 100,
                gender_preference: vec!["Man".to_string()],
                ethnicity_preference: vec![],
                religion_preference: vec![],
            },
        },
        SeedProfile {
            phone: "+3333333333".to_string(),
            name: "Elizabeth".to_string(),
            pronouns: "she/her".to_string(),
            gender: "Woman".to_string(),
            sexuality: "Straight".to_string(),
            height: 163,
            job: "Actress".to_string(),
            ethnicity: "White".to_string(),
            politics: "Liberal".to_string(),
            religion: "Spiritual".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 30,
                age_max: 50,
                distance_max: 75,
                gender_preference: vec!["Man".to_string()],
                ethnicity_preference: vec!["White".to_string()],
                religion_preference: vec![],
            },
        },
        SeedProfile {
            phone: "+4444444444".to_string(),
            name: "Gal".to_string(),
            pronouns: "she/her".to_string(),
            gender: "Woman".to_string(),
            sexuality: "Straight".to_string(),
            height: 178,
            job: "Actress".to_string(),
            ethnicity: "Middle Eastern".to_string(),
            politics: "Moderate".to_string(),
            religion: "Jewish".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 30,
                age_max: 50,
                distance_max: 100,
                gender_preference: vec!["Man".to_string()],
                ethnicity_preference: vec![],
                religion_preference: vec![],
            },
        },
        SeedProfile {
            phone: "+5555555555".to_string(),
            name: "Sadie".to_string(),
            pronouns: "she/her".to_string(),
            gender: "Woman".to_string(),
            sexuality: "Bisexual".to_string(),
            height: 152,
            job: "Actress".to_string(),
            ethnicity: "White".to_string(),
            politics: "Liberal".to_string(),
            religion: "Agnostic".to_string(),
            relationship_type: "Figuring out my dating goals".to_string(),
            dating_intention: "Figuring out my dating goals".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 20,
                age_max: 35,
                distance_max: 50,
                gender_preference: vec!["Man".to_string(), "Woman".to_string()],
                ethnicity_preference: vec![],
                religion_preference: vec![],
            },
        },
        SeedProfile {
            phone: "+6666666666".to_string(),
            name: "Disha".to_string(),
            pronouns: "she/her".to_string(),
            gender: "Woman".to_string(),
            sexuality: "Straight".to_string(),
            height: 170,
            job: "Actress".to_string(),
            ethnicity: "South Asian".to_string(),
            politics: "Moderate".to_string(),
            religion: "Hindu".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "No".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 25,
                age_max: 40,
                distance_max: 50,
                gender_preference: vec!["Man".to_string()],
                ethnicity_preference: vec!["South Asian".to_string()],
                religion_preference: vec!["Hindu".to_string()],
            },
        },
        // === MEN ===
        SeedProfile {
            phone: "+7777777777".to_string(),
            name: "Chris E".to_string(),
            pronouns: "he/him".to_string(),
            gender: "Man".to_string(),
            sexuality: "Straight".to_string(),
            height: 183,
            job: "Actor".to_string(),
            ethnicity: "White".to_string(),
            politics: "Liberal".to_string(),
            religion: "Christian".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Socially".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 25,
                age_max: 40,
                distance_max: 100,
                gender_preference: vec!["Woman".to_string()],
                ethnicity_preference: vec![],
                religion_preference: vec![],
            },
        },
        SeedProfile {
            phone: "+8888888888".to_string(),
            name: "Chris H".to_string(),
            pronouns: "he/him".to_string(),
            gender: "Man".to_string(),
            sexuality: "Straight".to_string(),
            height: 190,
            job: "Actor".to_string(),
            ethnicity: "White".to_string(),
            politics: "Moderate".to_string(),
            religion: "Christian".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 25,
                age_max: 45,
                distance_max: 150,
                gender_preference: vec!["Woman".to_string()],
                ethnicity_preference: vec![],
                religion_preference: vec![],
            },
        },
        SeedProfile {
            phone: "+9999999999".to_string(),
            name: "Henry".to_string(),
            pronouns: "he/him".to_string(),
            gender: "Man".to_string(),
            sexuality: "Straight".to_string(),
            height: 185,
            job: "Actor".to_string(),
            ethnicity: "White".to_string(),
            politics: "Moderate".to_string(),
            religion: "Catholic".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 22,
                age_max: 38,
                distance_max: 100,
                gender_preference: vec!["Woman".to_string()],
                ethnicity_preference: vec![],
                religion_preference: vec![],
            },
        },
        SeedProfile {
            phone: "+1010101010".to_string(),
            name: "Hrithik".to_string(),
            pronouns: "he/him".to_string(),
            gender: "Man".to_string(),
            sexuality: "Straight".to_string(),
            height: 180,
            job: "Actor".to_string(),
            ethnicity: "South Asian".to_string(),
            politics: "Moderate".to_string(),
            religion: "Hindu".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "No".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 22,
                age_max: 40,
                distance_max: 75,
                gender_preference: vec!["Woman".to_string()],
                ethnicity_preference: vec!["South Asian".to_string()],
                religion_preference: vec![],
            },
        },
        SeedProfile {
            phone: "+1111011110".to_string(),
            name: "Robert".to_string(),
            pronouns: "he/him".to_string(),
            gender: "Man".to_string(),
            sexuality: "Straight".to_string(),
            height: 173,
            job: "Actor".to_string(),
            ethnicity: "White".to_string(),
            politics: "Liberal".to_string(),
            religion: "Agnostic".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "No".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 30,
                age_max: 55,
                distance_max: 100,
                gender_preference: vec!["Woman".to_string()],
                ethnicity_preference: vec![],
                religion_preference: vec![],
            },
        },
        SeedProfile {
            phone: "+1212121212".to_string(),
            name: "Alex".to_string(),
            pronouns: "he/him".to_string(),
            gender: "Man".to_string(),
            sexuality: "Straight".to_string(),
            height: 178,
            job: "Creator".to_string(),
            ethnicity: "Latino".to_string(),
            politics: "Moderate".to_string(),
            religion: "Catholic".to_string(),
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Socially".to_string(),
            smokes: "No".to_string(),
            preferences: SeedPreferences {
                age_min: 21,
                age_max: 35,
                distance_max: 50,
                gender_preference: vec!["Woman".to_string()],
                ethnicity_preference: vec!["Latina".to_string()],
                religion_preference: vec![],
            },
        },
    ]
}

/// Convert SeedProfile to UpdateProfileRequest
fn to_profile_request(seed: &SeedProfile) -> UpdateProfileRequest {
    UpdateProfileRequest {
        name: Some(seed.name.clone()),
        bio: None,
        birthdate: None,
        pronouns: Some(seed.pronouns.clone()),
        gender: Some(seed.gender.clone()),
        sexuality: Some(seed.sexuality.clone()),
        height: Some(seed.height),
        location: None,
        job: Some(seed.job.clone()),
        company: None,
        school: None,
        ethnicity: Some(seed.ethnicity.clone()),
        politics: Some(seed.politics.clone()),
        religion: Some(seed.religion.clone()),
        relationship_type: Some(seed.relationship_type.clone()),
        dating_intention: Some(seed.dating_intention.clone()),
        drinks: Some(seed.drinks.clone()),
        smokes: Some(seed.smokes.clone()),
    }
}

/// Convert SeedPreferences to JSON
fn to_preferences_json(prefs: &SeedPreferences) -> serde_json::Value {
    json!({
        "ageRange": {
            "min": prefs.age_min,
            "max": prefs.age_max
        },
        "distanceMax": prefs.distance_max,
        "genderPreference": prefs.gender_preference,
        "ethnicityPreference": prefs.ethnicity_preference,
        "religionPreference": prefs.religion_preference
    })
}

/// Update user preferences in the database
async fn update_user_preferences(pool: &PgPool, user_id: &Uuid, preferences: serde_json::Value) -> Result<(), sqlx::Error> {
    sqlx::query(
        "UPDATE users SET preferences = $2 WHERE id = $1"
    )
    .bind(user_id)
    .bind(preferences)
    .execute(pool)
    .await?;

    Ok(())
}

/// Seed the database with sample data
/// This function will:
/// - Create new users OR get existing users by phone
/// - Update preferences for all users (new and existing)
pub async fn seed_database(pool: &PgPool) -> Result<(), sqlx::Error> {
    let profiles = get_seed_profiles();
    let count = profiles.len();
    let mut created_count = 0;
    let mut updated_count = 0;
    
    for seed in &profiles {
        // Get or create user (won't fail if user already exists)
        let (user_id, is_new) = user_queries::get_or_create_user(pool, &seed.phone).await?;
        
        // Parse user_id to Uuid
        let user_uuid = Uuid::parse_str(&user_id).expect("Invalid UUID from get_or_create_user");
        
        // Only create profile for NEW users
        // Comment out if you just want to update preferences for existing users
        /*
        if is_new {
            let req = to_profile_request(seed);
            profile_queries::create_profile(pool, &user_uuid, &req).await?;
        }
        */
        
        // Always update preferences (works for both new and existing users)
        let preferences_json = to_preferences_json(&seed.preferences);
        update_user_preferences(pool, &user_uuid, preferences_json).await?;
        
        if is_new {
            created_count += 1;
            println!("✨ Created: {} ({}) - Gender: {}, Looking for: {:?}", 
                seed.name, 
                user_id,
                seed.gender,
                seed.preferences.gender_preference
            );
        } else {
            updated_count += 1;
            println!("🔄 Updated preferences: {} ({}) - Looking for: {:?}", 
                seed.name, 
                user_id,
                seed.preferences.gender_preference
            );
        }
    }
    
    println!("\n✅ Database seeding complete!");
    println!("  - {} new users created", created_count);
    println!("  - {} existing users updated", updated_count);
    println!("  - Total: {} profiles with preferences", count);
    println!("\nUsers:");
    println!("  - 6 Women (Ana, Scarlett, Elizabeth, Gal, Sadie, Disha)");
    println!("  - 6 Men (Chris E, Chris H, Henry, Hrithik, Robert, Alex)");
    
    Ok(())
}


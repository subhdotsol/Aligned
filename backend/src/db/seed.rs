use sqlx::PgPool;
use uuid::Uuid;
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
    relationship_type: String,
    dating_intention: String,
    drinks: String,
    smokes: String,
}

/// Get sample profiles data
fn get_seed_profiles() -> Vec<SeedProfile> {
    vec![
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Socially".to_string(),
            smokes: "No".to_string(),
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
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
            relationship_type: "Figuring out my dating goals".to_string(),
            dating_intention: "Figuring out my dating goals".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "No".to_string(),
            smokes: "No".to_string(),
        },
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Socially".to_string(),
            smokes: "No".to_string(),
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Sometimes".to_string(),
            smokes: "No".to_string(),
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "No".to_string(),
            smokes: "No".to_string(),
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "No".to_string(),
            smokes: "No".to_string(),
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
            relationship_type: "Monogamy".to_string(),
            dating_intention: "Long-term relationship".to_string(),
            drinks: "Socially".to_string(),
            smokes: "No".to_string(),
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
        religion: None,
        relationship_type: Some(seed.relationship_type.clone()),
        dating_intention: Some(seed.dating_intention.clone()),
        drinks: Some(seed.drinks.clone()),
        smokes: Some(seed.smokes.clone()),
    }
}

/// Seed the database with sample data
pub async fn seed_database(pool: &PgPool) -> Result<(), sqlx::Error> {
    let profiles = get_seed_profiles();
    let count = profiles.len();
    
    for seed in &profiles {
        // Create user
        let user_id = user_queries::create_user(pool, &seed.phone).await?;
        
        // Parse user_id to Uuid
        let user_uuid = Uuid::parse_str(&user_id).expect("Invalid UUID from create_user");
        
        // Create profile
        let req = to_profile_request(seed);
        profile_queries::create_profile(pool, &user_uuid, &req).await?;
        
        println!("Seeded: {} ({})", seed.name, user_id);
    }
    
    println!("Database seeding complete! {} profiles created.", count);
    Ok(())
}

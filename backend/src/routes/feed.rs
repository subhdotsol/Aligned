use actix_web::{web, HttpMessage, HttpRequest, HttpResponse, Responder};
use sqlx::PgPool;
use uuid::Uuid;

use crate::db::{profile_queries, user_queries};
use crate::jwtauth::Claims;
use crate::models::outputs::{StatusResponse, FeedResponse, UserProfile};
use crate::models::inputs::Preferences;

pub async fn get_feed(pool: web::Data<PgPool>, req: HttpRequest) -> impl Responder {
    
    let Some(claim) = req.extensions().get::<Claims>().cloned() else {
        return HttpResponse::Unauthorized().json(StatusResponse {
            status: "error".to_string(),
            message: Some("No authentication claims found".to_string()),
        });
    };

    let Ok(user_id) = Uuid::parse_str(&claim.sub) else {
        return HttpResponse::Unauthorized().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Invalid user ID format".to_string()),
        });
    };

    // Get user's preferences (from users table - JSONB field)
    let preferences = match user_queries::get_user_preferences(&pool, &user_id).await {
        Ok(prefs) => prefs,
        Err(e) => {
            return HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some(format!("Failed to get preferences: {}", e)),
            });
        }
    };

    // Check if preferences exist
    let Some(prefs_json) = preferences else {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: Some("User has no preferences set".to_string()),
        });
    };

    // Parse the JSON into Preferences struct
    let preference: Preferences = match serde_json::from_value(prefs_json) {
        Ok(p) => p,
        Err(e) => {
            return HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some(format!("Failed to parse preferences: {}", e)),
            });
        }
    };

    // Log preferences for debugging
    println!("User {} preferences:", user_id);
    if let Some(ref gp) = preference.gender_preference {
        println!("  Gender preference: {:?}", gp);
    }

    // Get suggestions based on gender preference only (for now)
    let suggestions = match profile_queries::get_suggestions(
        &pool,
        preference.gender_preference,
        &user_id,
    ).await {
        Ok(profiles) => profiles,
        Err(e) => {
            return HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some(format!("Failed to get suggestions: {}", e)),
            });
        }
    };

    println!("Found {} matching profiles", suggestions.len());

    // Convert ProfileDetails to UserProfile for the response
    let profiles: Vec<UserProfile> = suggestions.into_iter().map(|p| {
        UserProfile {
            id: "".to_string(), // We don't have user_id in ProfileDetails
            images: None,
            prompts: None,
            details: Some(p),
        }
    }).collect();

    HttpResponse::Ok().json(FeedResponse { profiles })
}

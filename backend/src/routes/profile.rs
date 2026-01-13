use actix_web::{HttpRequest, HttpResponse, HttpMessage, Responder, web};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::inputs::UpdateProfileRequest;
use crate::jwtauth::Claims;
use crate::models::outputs::StatusResponse;
use crate::db::profile_queries;

pub async fn get_profile() -> impl Responder {
    HttpResponse::Ok().body("Profile: Get Current Profile")
}

pub async fn update_profile(
    req: HttpRequest,
    body: web::Json<UpdateProfileRequest>,
    pool: web::Data<PgPool>,
) -> impl Responder {
    println!("Profile: Updating - Name: {:?}", body.name);

    // Get the user ID from the claims (stored by JWT middleware)
    let claims = match req.extensions().get::<Claims>().cloned() {
        Some(c) => c,
        None => {
            return HttpResponse::Unauthorized().json(StatusResponse {
                status: "error".to_string(),
                message: Some("No authentication claims found".to_string()),
            });
        }
    };

    // Parse user_id from claims.sub (it's a String, need to convert to Uuid)
    let user_id = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => {
            return HttpResponse::BadRequest().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Invalid user ID format".to_string()),
            });
        }
    };

    // Create or update profile
    match profile_queries::upsert_profile(&pool, &user_id, &body).await {
        Ok(_) => {
            HttpResponse::Ok().json(StatusResponse {
                status: "success".to_string(),
                message: Some("Profile updated successfully".to_string()),
            })
        }
        Err(e) => {
            println!("Failed to upsert profile: {:?}", e);
            HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Database error".to_string()),
            })
        }
    }
}

pub async fn upload_profile_images() -> impl Responder {
    // Multipart handling would go here
    HttpResponse::Ok().body("Profile: Upload Images")
}

pub async fn finalize_profile() -> impl Responder {
    HttpResponse::Ok().body("Profile: Finalize (Go Live)")
}

pub async fn delete_account(
    req: HttpRequest,
    pool: web::Data<PgPool>,
) -> impl Responder {
    // Get user ID from claims
    let claims = match req.extensions().get::<Claims>().cloned() {
        Some(c) => c,
        None => {
            return HttpResponse::Unauthorized().json(StatusResponse {
                status: "error".to_string(),
                message: Some("No authentication claims found".to_string()),
            });
        }
    };

    let user_id = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => {
            return HttpResponse::BadRequest().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Invalid user ID format".to_string()),
            });
        }
    };

    // Delete user and profile
    match profile_queries::delete_user(&pool, &user_id).await {
        Ok(_) => {
            HttpResponse::Ok().json(StatusResponse {
                status: "success".to_string(),
                message: Some("Account deleted successfully".to_string()),
            })
        }
        Err(e) => {
            println!("Failed to delete account: {:?}", e);
            HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Database error".to_string()),
            })
        }
    }
}

use actix_web::{HttpRequest, HttpResponse, HttpMessage, Responder, web};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::outputs::{UserProfile, UserImage, UserPrompt};
use crate::models::inputs::{UpdateProfileRequest, UploadProfileImageRequest };
use crate::jwtauth::Claims;
use crate::models::outputs::{StatusResponse, FinalizeProfileResponse};
use crate::db::{profile_queries, prompt_queries, images_queries};

pub async fn get_profile(pool: web::Data<PgPool>, req: HttpRequest) -> impl Responder {
    let Some(claims) = req.extensions().get::<Claims>().cloned() else {
        return HttpResponse::Unauthorized().json(StatusResponse {
            status: "error".to_string(),
            message: Some("No authentication claims found".to_string()),
        });
    };

    let Ok(user_id) = Uuid::parse_str(&claims.sub) else {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Invalid user ID format".to_string()),
        });
    };

    // Get profile details (returns None if not found)
    let profile_details = match profile_queries::get_profile(&pool, &user_id).await {
        Ok(p) => Some(p),
        Err(_) => None,
    };

    // Get images and map tuples to UserImage structs
    let user_images = match images_queries::get_images(&pool, &user_id).await {
        Ok(rows) => Some(rows.into_iter().map(|(id, url, order)| UserImage {
            id: id.to_string(),
            url,
            order,
        }).collect()),
        Err(_) => None,
    };

    // Get prompts and map to UserPrompt structs
    let user_prompts = match prompt_queries::get_user_prompts(&pool, &user_id).await {
        Ok(rows) => Some(rows.into_iter().map(|(id, question, answer, order)| UserPrompt {
            id: id.to_string(),
            question,
            answer,
            order,
        }).collect()),
        Err(_) => None,
    };

    let user_profile = UserProfile {
        id: user_id.to_string(),
        images: user_images,
        prompts: user_prompts,
        details: profile_details,
    };

    HttpResponse::Ok().json(user_profile)
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

pub async fn upload_profile_images(pool: web::Data<PgPool>, req: HttpRequest, body: web::Json<UploadProfileImageRequest>) -> impl Responder {
    // Multipart handling would go here

    let Some(claims) = req.extensions().get::<Claims>().cloned() else {
        return HttpResponse::Unauthorized().json(StatusResponse {
            status: "error".to_string(),
            message: Some("No authentication claims found".to_string()),
        })
    };

    let user_id: Uuid = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => {
            return HttpResponse::BadRequest().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Invalid user ID format".to_string()),
            })
        }
    };

    match images_queries::upload_profile_images(&pool, &user_id, &body.image_url).await {
        Ok(_) => HttpResponse::Ok().json(StatusResponse {
            status: "success".to_string(),
            message: Some("Profile images uploaded successfully".to_string()),
        }),
        Err(e) => {
            println!("Failed to upload profile images: {:?}", e);
            HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some(e.to_string()),
            })
        }
    }
}

pub async fn finalize_profile(req: HttpRequest, pool: web::Data<PgPool>) -> impl Responder {

    let Some(claims) = req.extensions().get::<Claims>().cloned() else {
        return HttpResponse::Unauthorized().json(FinalizeProfileResponse {
            status: "error".to_string(),
            message: Some("No authentication claims found".to_string()),
            pending_actions: Some(vec!["No authentication claims found".to_string()]),
        })
    };

    let user_id: Uuid = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => {
            return HttpResponse::BadRequest().json(FinalizeProfileResponse {
                status: "error".to_string(),
                message: Some("Invalid user ID format".to_string()),
                pending_actions: Some(vec!["Invalid user ID format".to_string()])
            })
        }
    };

    let mut pending: Vec<String> = Vec::new();

    // CHECK: all the 6 photos uploaded
    let images_uploaded = match images_queries::count_images(&pool, &user_id).await {
        Ok(count) => count,
        Err(e) => {
            println!("Failed to count images: {:?}", e);
            return HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some(e.to_string()),
            });
        }
    };

    if images_uploaded < 6 {
        pending.push(format!("Upload {} more images", 6 - images_uploaded));
    }

    // CHECK: all the 3 prompts uploaded
    let prompts_uploaded = match prompt_queries::count_prompts(&pool, &user_id).await {
        Ok(count) => count,
        Err(e) => {
            println!("Failed to count prompts: {:?}", e);
            return HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some(e.to_string()),
            });
        }
    };
    if prompts_uploaded < 3 {
        pending.push(format!("Upload {} more prompts", 3 - prompts_uploaded));
    }

    // CHECK: all profile details filled
    let missing_fields = match profile_queries::check_profile_attributes_filled(&pool, &user_id).await {
        Ok(count) => count,
        Err(e) => {
            println!("Failed to check profile attributes: {:?}", e);
            return HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some(e.to_string()),
            });
        }
    };
    if missing_fields > 0 {
        pending.push(format!("Fill {} more profile details", missing_fields));
    }

    if pending.is_empty() {
        HttpResponse::Ok().json(FinalizeProfileResponse {
            status: "success".to_string(),
            message: Some("Profile finalized successfully".to_string()),
            pending_actions: Some(pending),
        })
    } else {
        HttpResponse::BadRequest().json(FinalizeProfileResponse {
            status: "error".to_string(),
            message: Some("Profile not finalized".to_string()),
            pending_actions: Some(pending),
        })
    }
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

    // Delete user and profile and images and prompts
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
use crate::db::interact_queries;
use crate::jwtauth::Claims;
use crate::models::inputs::InteractRequest;
use crate::models::outputs::StatusResponse;
use actix_web::{HttpMessage, HttpRequest, HttpResponse, Responder, web};
use sqlx::PgPool;
use uuid::Uuid;

pub async fn interact(body: web::Json<InteractRequest>, pool: web::Data<PgPool>, req: HttpRequest) -> impl Responder {
    let claims = match req.extensions().get::<Claims>().cloned() {
        Some(c) => c,
        None => return HttpResponse::Unauthorized().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Unauthorized".to_string()),
        })
    };

    let user_id = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => return HttpResponse::Unauthorized().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Invalid user ID".to_string()),
        })
    };

    let Ok(target_user_id) = Uuid::parse_str(&body.target_user_id) else {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Invalid target user ID".to_string()),
        })
    };

    match interact_queries::interact(&pool, &user_id, &target_user_id, &body.into_inner()).await {
        Ok(_) => HttpResponse::Ok().json(StatusResponse {
            status: "success".to_string(),
            message: Some("Interaction recorded".to_string()),
        }),
        Err(_) => HttpResponse::InternalServerError().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Failed to record interaction".to_string()),
        })
    }
}

use actix_web::{HttpMessage, HttpRequest, HttpResponse, Responder, web};
use sqlx::PgPool;
use uuid::Uuid;

use crate::db::prompt_queries;
use crate::jwtauth::Claims;
use crate::models::inputs::{CreatePromptRequest, UpdatePromptRequest};
use crate::models::outputs::{StatusResponse, UserPrompt};

/// GET /prompts - Get all prompts for the current user
pub async fn get_prompts(pool: web::Data<PgPool>, req: HttpRequest) -> impl Responder {
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

    match prompt_queries::get_user_prompts(&pool, &user_id).await {
        Ok(rows) => {
            let prompts: Vec<UserPrompt> = rows
                .into_iter()
                .map(|(id, question, answer, order)| UserPrompt {
                    id: id.to_string(),
                    question,
                    answer,
                    order,
                })
                .collect();
            HttpResponse::Ok().json(prompts)
        }
        Err(e) => {
            println!("Failed to get prompts: {:?}", e);
            HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Failed to retrieve prompts".to_string()),
            })
        }
    }
}

/// POST /prompts - Create a new prompt (max 3)
pub async fn create_prompt(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    body: web::Json<CreatePromptRequest>,
) -> impl Responder {
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

    // Validate input
    if body.question.trim().is_empty() {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Question cannot be empty".to_string()),
        });
    }

    if body.answer.trim().is_empty() {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Answer cannot be empty".to_string()),
        });
    }

    match prompt_queries::insert_prompt(&pool, &user_id, &body.question, &body.answer).await {
        Ok(_) => HttpResponse::Created().json(StatusResponse {
            status: "success".to_string(),
            message: Some("Prompt created successfully".to_string()),
        }),
        Err(e) => {
            let error_message = e.to_string();
            if error_message.contains("Maximum 3 prompts allowed") {
                HttpResponse::BadRequest().json(StatusResponse {
                    status: "error".to_string(),
                    message: Some("Maximum 3 prompts allowed".to_string()),
                })
            } else {
                println!("Failed to create prompt: {:?}", e);
                HttpResponse::InternalServerError().json(StatusResponse {
                    status: "error".to_string(),
                    message: Some("Failed to create prompt".to_string()),
                })
            }
        }
    }
}

/// PUT /prompts/{order} - Update an existing prompt by order
pub async fn update_prompt(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    path: web::Path<i32>,
    body: web::Json<UpdatePromptRequest>,
) -> impl Responder {
    let display_order = path.into_inner();

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

    // Validate order range (0-2)
    if !(0..=2).contains(&display_order) {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Display order must be between 0 and 2".to_string()),
        });
    }

    // Validate input
    if body.question.trim().is_empty() {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Question cannot be empty".to_string()),
        });
    }

    if body.answer.trim().is_empty() {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Answer cannot be empty".to_string()),
        });
    }

    match prompt_queries::update_prompt(&pool, &user_id, display_order, &body.question, &body.answer).await {
        Ok(_) => HttpResponse::Ok().json(StatusResponse {
            status: "success".to_string(),
            message: Some("Prompt updated successfully".to_string()),
        }),
        Err(e) => {
            println!("Failed to update prompt: {:?}", e);
            HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Failed to update prompt".to_string()),
            })
        }
    }
}

/// DELETE /prompts/{order} - Delete a prompt by order
pub async fn delete_prompt(
    pool: web::Data<PgPool>,
    req: HttpRequest,
    path: web::Path<i32>,
) -> impl Responder {
    let display_order = path.into_inner();

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

    // Validate order range (0-2)
    if !(0..=2).contains(&display_order) {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Display order must be between 0 and 2".to_string()),
        });
    }

    match prompt_queries::delete_prompt(&pool, &user_id, display_order).await {
        Ok(_) => HttpResponse::Ok().json(StatusResponse {
            status: "success".to_string(),
            message: Some("Prompt deleted successfully".to_string()),
        }),
        Err(e) => {
            println!("Failed to delete prompt: {:?}", e);
            HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Failed to delete prompt".to_string()),
            })
        }
    }
}

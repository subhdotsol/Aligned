use crate::models::inputs::SendMessageRequest;
use actix_web::{HttpResponse, Responder, web};
use crate::db::DbState;
use crate::models::outputs::{StatusResponse, MatchRow, MatchSummary, UserSummary, MessagePreview} ;  
use sqlx::types::Uuid;   

pub async fn get_matches(
    db: web::Data<DbState>,
) -> impl Responder {
    let current_user_id = Uuid::parse_str("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .expect("Invalid UUID");
    
    let result = sqlx::query_as::<_, MatchRow>(
        "SELECT id, user1_id, user2_id, created_at, last_message, last_message_at
         FROM matches 
         WHERE user1_id = $1 OR user2_id = $1
         ORDER BY last_message_at DESC NULLS LAST
         LIMIT 50"
    )
    .bind(current_user_id)
    .fetch_all(&db.db)
    .await;

    match result {
        Ok(db_matches) => {
            let summaries: Vec<MatchSummary> = db_matches
                .into_iter()
                .filter_map(|row| {
                    let other_user_id = if row.user1_id == Some(current_user_id) {
                        row.user2_id?  
                    } else {
                        row.user1_id?  
                    };
                    
                    
                    Some(MatchSummary {
                        id: row.id.to_string(),
                        with_user: UserSummary {
                            id: other_user_id.to_string(),
                            is_profile_complete: true, 
                            is_new_user: false,         
                        },
                        last_message: row.last_message.map(|text| MessagePreview {
                            text,
                            created_at: row.last_message_at
                                .map(|dt| dt.to_rfc3339())
                                .unwrap_or_default(),
                            is_read: false,
                        }),
                    })
                })
                .collect();
            
            println!("✓ Fetched {} matches for user {}", summaries.len(), current_user_id);
            HttpResponse::Ok().json(summaries)
        }
        Err(e) => {
            eprintln!("✗ Database error: {:?}", e);
            HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Failed to fetch matches".to_string()),
            })
        }
    }
}

pub async fn get_messages( db: web::Data<DbState>,path: web::Path<String>) -> impl Responder {
    let match_id = path.into_inner();

    let result = sqlx::query_as::<_, MatchRow>(
        "SELECT *
         FROM matches 
         WHERE id = $1"
    )
    .bind(match_id)
    .fetch_all(&db.db)
    .await; 

    match result {
        Ok(matches) => HttpResponse::Ok().json(matches),
        Err(e) => {
            eprintln!("Error fetching messages: {:?}", e);
            HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Failed to fetch messages".to_string()),
            })
        }
    }   


}

pub async fn send_message(
    path: web::Path<String>,
    body: web::Json<SendMessageRequest>,
) -> impl Responder {
    let match_id = path.into_inner();
    println!("Messages: Send to match {}: {}", match_id, body.text);
    HttpResponse::Ok().body(format!("Messages: Send Message to {}", match_id))
}
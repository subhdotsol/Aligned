use crate::models::inputs::{SendMessageRequest,MessageQuery};
use actix_web::{HttpResponse, Responder, web};
use crate::db::DbState;
use crate::models::outputs::{StatusResponse, MatchRow, MatchSummary, UserSummary, MessagePreview, MessageRow, MessageHistoryResponse,Message} ;  
use sqlx::types::Uuid;   
use chrono::{DateTime, Utc};

pub async fn get_matches(
    db: web::Data<DbState>,
) -> impl Responder {
    let current_user_id = Uuid::parse_str("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22")
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


pub async fn get_messages(
    db: web::Data<DbState>,
    path: web::Path<String>,
    query: web::Query<MessageQuery>, 
) -> impl Responder {
 
    let match_id_str = path.into_inner();
    let match_id = match Uuid::parse_str(&match_id_str) {
        Ok(id) => id,
        Err(_) => {
            return HttpResponse::BadRequest().json(StatusResponse {
                status: "error".to_string(),
                message: Some("Invalid match ID format".to_string()),
            });
        }
    };

    
    let current_user_id = Uuid::parse_str("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .expect("Invalid hardcoded UUID");

    
    let match_check = sqlx::query_as::<_, MatchRow>(
        "SELECT id, user1_id, user2_id, created_at, last_message, last_message_at
         FROM matches 
         WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)"
    )
    .bind(match_id)
    .bind(current_user_id)
    .fetch_optional(&db.db)
    .await;

    // match match_check {
    //     Ok(Some(_)) => {
               // match_row is MatchRow {
    //     id: Uuid,
    //     user1_id: Some(Uuid),
    //     user2_id: Some(Uuid),
    //     created_at: Some(DateTime<Utc>),
    //     last_message: Some(String),
    //     last_message_at: Some(DateTime<Utc>),
    // }
    
    // println!("User is part of match: {:?}", match_row.id); 
    //     }
    //     Ok(None) => {
    //         return HttpResponse::Forbidden().json(StatusResponse {
    //             status: "error".to_string(),
    //             message: Some("You don't have access to this match".to_string()),
    //         });
    //     }
    //     Err(e) => {
    //         eprintln!("✗ Database error checking match access: {:?}", e);
    //         return HttpResponse::InternalServerError().json(StatusResponse {
    //             status: "error".to_string(),
    //             message: Some("Failed to verify match access".to_string()),
    //         });
    //     }
    // }

    // Step 4: Parse cursor (if provided)
    let cursor_time: Option<DateTime<Utc>> = match &query.cursor {
        Some(cursor_str) => {
            match DateTime::parse_from_rfc3339(cursor_str) {
                Ok(dt) => Some(dt.with_timezone(&Utc)),
                Err(_) => {
                    return HttpResponse::BadRequest().json(StatusResponse {
                        status: "error".to_string(),
                        message: Some("Invalid cursor format. Use ISO 8601 timestamp".to_string()),
                    });
                }
            }
        }
        None => None,
    };

    
    let limit = query.limit.unwrap_or(50).min(100);

    
    let result = if let Some(cursor) = cursor_time {
        sqlx::query_as::<_, MessageRow>(
            "SELECT id, match_id, sender_id, text, created_at, is_read
             FROM messages 
             WHERE match_id = $1 AND created_at > $2
             ORDER BY created_at ASC
             LIMIT $3"
        )
        .bind(match_id)
        .bind(cursor)
        .bind(limit)
        .fetch_all(&db.db)
        .await
    } else {
        sqlx::query_as::<_, MessageRow>(
            "SELECT id, match_id, sender_id, text, created_at, is_read
             FROM messages 
             WHERE match_id = $1
             ORDER BY created_at ASC
             LIMIT $2"
        )
        .bind(match_id)
        .bind(limit)
        .fetch_all(&db.db)
        .await
    };

    match result {
        Ok(db_messages) => {
            let messages: Vec<Message> = db_messages
                .into_iter()
                .map(|row| Message {
                    id: row.id.to_string(),
                    sender_id: row.sender_id.to_string(),
                    text: row.text,
                    created_at: row.created_at
                        .map(|dt| dt.to_rfc3339())
                        .unwrap_or_else(|| "".to_string()),
                })
                .collect();

            println!("✓ Fetched {} messages for match {} (cursor: {:?})", 
                     messages.len(), match_id, cursor_time);

            HttpResponse::Ok().json(MessageHistoryResponse { messages })
        }
        Err(e) => {
            eprintln!("✗ Database error fetching messages: {:?}", e);
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
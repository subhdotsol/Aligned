use crate::models::inputs::SendMessageRequest;
use actix_web::{HttpResponse, Responder, web};



pub async fn get_matches() -> impl Responder {
    HttpResponse::Ok().body("Matches: Get All Matches")
}

pub async fn get_messages(path: web::Path<String>) -> impl Responder {
    let match_id = path.into_inner();
    println!("Messages: Get history for match {}", match_id);
    HttpResponse::Ok().body(format!("Messages: Get Chat History for {}", match_id))
}

pub async fn send_message(
    path: web::Path<String>,
    body: web::Json<SendMessageRequest>,
) -> impl Responder {
    let match_id = path.into_inner();
    println!("Messages: Send to match {}: {}", match_id, body.text);
    HttpResponse::Ok().body(format!("Messages: Send Message to {}", match_id))
}

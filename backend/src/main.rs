use actix_web::{App, HttpResponse, HttpServer, Responder, web};

use dotenv::dotenv;
mod config;
mod db;
mod models;
mod routes;

use config::Config;
use db::DbState;
use routes::{auth, feed, interactions, matches, profile};

async fn health_check() -> impl Responder {
    HttpResponse::Ok().body("I'm ok")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    

    let config = Config::from_env();
    
    // Create database connection pool
    let pool = db::create_pool()
        .await
        .expect("Failed to create database pool");
   
    let db_state = web::Data::new(DbState { db: pool.clone() }); 
        
    println!("Database connected!");
    println!("Starting server on {}:{}", config.host, config.port);
    
    let server_address = format!("{}:{}", config.host, config.port);
    
    HttpServer::new(move || {
        App::new()
            .app_data(db_state.clone())
            .route("/health", web::get().to(health_check))
            // Auth
            .route("/auth/phone/login", web::post().to(auth::phone_login))
            .route("/auth/phone/verify", web::post().to(auth::phone_verify))
            // Profile
            .route("/profile/me", web::get().to(profile::get_profile))
            .route("/profile", web::post().to(profile::update_profile))
            .route(
                "/profile/images",
                web::post().to(profile::upload_profile_images),
            )
            .route(
                "/profile/finalize",
                web::post().to(profile::finalize_profile),
            )
            .route("/profile", web::delete().to(profile::delete_account))
            // Feed
            .route("/feed", web::get().to(feed::get_feed))
            // Interactions
            .route("/interact", web::post().to(interactions::interact))
            // Matches & Messages
            .route("/matches", web::get().to(matches::get_matches))
            .route(
                "/matches/{id}/messages",
                web::get().to(matches::get_messages),
            )
            .route(
                "/matches/{id}/messages",
                web::post().to(matches::send_message),
            )
    })
    .bind(&server_address)?
    .run()
    .await
}

/*
Route Descriptions:

GET /health
- Health check for load balancers.

POST /auth/phone/login
- Initiates phone authentication (sends OTP).

POST /auth/phone/verify
- Verifies OTP and returns auth token + user info.

GET /profile/me
- Gets the current authenticated user's profile details.

POST /profile
- Updates profile fields (name, bio, etc.).

POST /profile/images
- Uploads a user profile image.

POST /profile/finalize
- Finalizes profile (sets "is_profile_complete") after ensuring 6 images are present.

DELETE /profile
- Deletes the user account permanently.

GET /feed
- Gets recommended profiles for the user to swipe on.

POST /interact
- Handles Like (Heart) or Pass (Cross) interactions.

GET /matches
- Gets a list of all matches (conversations).

GET /matches/{id}/messages
- Gets the chat history for a specific match.

POST /matches/{id}/messages
- Sends a new message to a match.
*/

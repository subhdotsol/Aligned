#![allow(dead_code)]
#![allow(unused_variables)]

use actix_web::{App, HttpResponse, HttpServer, Responder, web};
use actix_web_httpauth::middleware::HttpAuthentication;
use crate::jwtauth::Claims;
use sqlx::postgres::PgPoolOptions;
// use dotenv::dotenv;
use std::time::Duration;
use std::sync::Mutex;
use std::collections::HashMap;

mod models;
mod routes;
mod jwtauth;
mod db;

use routes::{auth, feed, interactions, matches, profile, prompts, user};

async fn health_check() -> impl Responder {
    HttpResponse::Ok().body("I'm ok")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load the .env file
    dotenv::dotenv().ok();

    // get the db url
    let database_url: String = std::env::var("DATABASE_URL").expect("DATABASE_URL MUST BE SET");

    // pg connection to connect to the pool
    let pool = PgPoolOptions::new().max_connections(10).min_connections(1).acquire_timeout(Duration::from_secs(5)).connect(database_url.as_str()).await.expect("Failed to connect to database");

    // Create AppState BEFORE the closure so it's shared across all workers
    let app_state = web::Data::new(models::state::AppState {
        pending_verifications: Mutex::new(HashMap::new()),
    });

    println!("Starting server on 127.0.0.1:8080");
    HttpServer::new(move || {
        // Create the auth middleware
        let auth = HttpAuthentication::bearer(Claims::jwt_validator);

        App::new()
            .app_data(web::Data::new(pool.clone()))
            .app_data(app_state.clone())
            // Public routes (no auth required)
            .route("/health", web::get().to(health_check))
            .route("/auth/phone/login", web::post().to(auth::phone_login))
            .route("/auth/phone/verify", web::post().to(auth::phone_verify))
            // Protected routes (auth required) - wrapped in a scope with middleware
            .service(
                web::scope("")
                    .wrap(auth)
                    .route("/profile/me", web::get().to(profile::get_profile))
                    .route("/profile", web::post().to(profile::update_profile))
                    .route("/user/preferences", web::post().to(user::update_user_preference))
                    .route("/profile/images", web::post().to(profile::upload_profile_images))
                    .route("/profile/finalize", web::post().to(profile::finalize_profile))
                    .route("/profile", web::delete().to(profile::delete_account))
                    .route("/feed", web::get().to(feed::get_feed))
                    .route("/interact", web::post().to(interactions::interact))
                    .route("/matches", web::get().to(matches::get_matches))
                    .route("/matches/{id}/messages", web::get().to(matches::get_messages))
                    .route("/matches/{id}/messages", web::post().to(matches::send_message))
                    // Prompts routes
                    .route("/prompts", web::get().to(prompts::get_prompts))
                    .route("/prompts", web::post().to(prompts::create_prompt))
                    .route("/prompts/{order}", web::put().to(prompts::update_prompt))
                    .route("/prompts/{order}", web::delete().to(prompts::delete_prompt))
            )
    })
    .bind(("127.0.0.1", 8080))?
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

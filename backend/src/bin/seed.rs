//! Database seeding binary
//! Run with: cargo run --bin seed

use sqlx::postgres::PgPoolOptions;
use std::time::Duration;

// Import from the main crate
use backend::db::seed;

#[actix_web::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load .env
    dotenv::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");

    println!("Connecting to database...");
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(5))
        .connect(&database_url)
        .await?;

    println!("Connected! Starting seed...");
    
    seed::seed_database(&pool).await?;

    println!("Done!");
    Ok(())
}

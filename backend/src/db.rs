use sqlx::{PgPool, postgres::PgPoolOptions};
use std::env;

pub struct DbState {
    pub db: PgPool,
}

pub async fn create_pool() -> Result<PgPool, sqlx::Error> {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env file");
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;
    
    println!("Database connection established");
    Ok(pool)
}

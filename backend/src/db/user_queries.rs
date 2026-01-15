use sqlx::PgPool;
use uuid::Uuid;

/// Check if the user exists in the database by phone
/// Returns Some(id) if user exists, None if not found
pub async fn check_user_exists(pool: &PgPool, phone: &str) -> Result<Option<String>, sqlx::Error> {
    let row: Option<(Uuid,)> = sqlx::query_as(
        "SELECT id FROM users WHERE phone = $1"
    )
    .bind(phone)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|r| r.0.to_string()))
}

/// Create a new user in the database
/// Returns the new user's id
pub async fn create_user(pool: &PgPool, phone: &str) -> Result<String, sqlx::Error> {
    let row: (Uuid,) = sqlx::query_as(
        "INSERT INTO users (phone) VALUES ($1) RETURNING id"
    )
    .bind(phone)
    .fetch_one(pool)
    .await?;

    Ok(row.0.to_string())
}

/// Get or create a user by phone number
/// Returns (user_id, is_new_user)
pub async fn get_or_create_user(pool: &PgPool, phone: &str) -> Result<(String, bool), sqlx::Error> {
    // First check if user exists
    if let Some(id) = check_user_exists(pool, phone).await? {
        return Ok((id, false));
    }
    
    // Create new user
    let id = create_user(pool, phone).await?;
    Ok((id, true))
}

/// Update user email (in users table)
pub async fn update_user_email(pool: &PgPool, user_id: &Uuid, email: &str) -> Result<(), sqlx::Error> {
    sqlx::query(
        "UPDATE users SET email = $2 WHERE id = $1"
    )
    .bind(user_id)
    .bind(email)
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn get_user(pool: &PgPool, user_id: &Uuid) -> Result<(), sqlx::Error> {
    let row = sqlx::query_as(r#"
    SELECT * FROM users WHERE id = $1 
    "#).bind(user_id).fetch_one(pool).await?;

    Ok(row)
}

/// Get user preferences as JSON
pub async fn get_user_preferences(pool: &PgPool, user_id: &Uuid) -> Result<Option<serde_json::Value>, sqlx::Error> {
    let row: Option<(serde_json::Value,)> = sqlx::query_as(
        "SELECT preferences FROM users WHERE id = $1"
    )
    .bind(user_id)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|r| r.0))
}

/// Update user preferences
pub async fn update_user_preferences(pool: &PgPool, user_id: &Uuid, preferences: serde_json::Value) -> Result<(), sqlx::Error> {
    sqlx::query(
        "UPDATE users SET preferences = $2 WHERE id = $1"
    )
    .bind(user_id)
    .bind(preferences)
    .execute(pool)
    .await?;

    Ok(())
}
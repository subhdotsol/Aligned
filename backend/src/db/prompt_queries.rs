use sqlx::PgPool;
use uuid::Uuid;

/// Count the number of prompts for a user
pub async fn count_prompts(pool: &PgPool, user_id: &Uuid) -> Result<i64, sqlx::Error> {
    let row: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM user_prompts WHERE user_id = $1")
        .bind(user_id)
        .fetch_one(pool)
        .await?;

    Ok(row.0)
}

/// Insert a new prompt for a user (max 3 prompts allowed)
pub async fn insert_prompt(
    pool: &PgPool,
    user_id: &Uuid,
    question: &str,
    answer: &str,
) -> Result<(), sqlx::Error> {
    let count = count_prompts(pool, user_id).await?;

    if count >= 3 {
        return Err(sqlx::Error::Protocol("Maximum 3 prompts allowed".to_string()));
    }

    let display_order = count as i32;

    sqlx::query(
        "INSERT INTO user_prompts (user_id, question, answer, display_order) VALUES ($1, $2, $3, $4)"
    )
    .bind(user_id)
    .bind(question)
    .bind(answer)
    .bind(display_order)
    .execute(pool)
    .await?;

    Ok(())
}

/// Update an existing prompt
pub async fn update_prompt(
    pool: &PgPool,
    user_id: &Uuid,
    display_order: i32,
    question: &str,
    answer: &str,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        "UPDATE user_prompts SET question = $1, answer = $2 WHERE user_id = $3 AND display_order = $4"
    )
    .bind(question)
    .bind(answer)
    .bind(user_id)
    .bind(display_order)
    .execute(pool)
    .await?;

    Ok(())
}

/// Delete a prompt by order
pub async fn delete_prompt(pool: &PgPool, user_id: &Uuid, display_order: i32) -> Result<(), sqlx::Error> {
    sqlx::query("DELETE FROM user_prompts WHERE user_id = $1 AND display_order = $2")
        .bind(user_id)
        .bind(display_order)
        .execute(pool)
        .await?;

    Ok(())
}

/// Get all prompts for a user
pub async fn get_user_prompts(pool: &PgPool, user_id: &Uuid) -> Result<Vec<(Uuid, String, String, i32)>, sqlx::Error> {
    let rows: Vec<(Uuid, String, String, i32)> = sqlx::query_as(
        "SELECT id, question, answer, display_order FROM user_prompts WHERE user_id = $1 ORDER BY display_order"
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;

    Ok(rows)
}

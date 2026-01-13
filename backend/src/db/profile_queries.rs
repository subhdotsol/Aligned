use sqlx::PgPool;
use uuid::Uuid;
use crate::models::inputs::UpdateProfileRequest;

/// Check if a profile exists for a user
pub async fn check_profile_exists(pool: &PgPool, user_id: &Uuid) -> Result<bool, sqlx::Error> {
    let row: Option<(Uuid,)> = sqlx::query_as(
        "SELECT user_id FROM profiles WHERE user_id = $1"
    )
    .bind(user_id)
    .fetch_optional(pool)
    .await?;

    Ok(row.is_some())
}

/// Create a new profile for a user
pub async fn create_profile(pool: &PgPool, user_id: &Uuid, req: &UpdateProfileRequest) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"INSERT INTO profiles (
            user_id, name, bio, pronouns, gender, sexuality, height, 
            job, company, school, ethnicity, politics, religion,
            relationship_type, dating_intention, drinks, smokes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)"#
    )
    .bind(user_id)
    .bind(&req.name)
    .bind(&req.bio)
    .bind(&req.pronouns)
    .bind(&req.gender)
    .bind(&req.sexuality)
    .bind(&req.height)
    .bind(&req.job)
    .bind(&req.company)
    .bind(&req.school)
    .bind(&req.ethnicity)
    .bind(&req.politics)
    .bind(&req.religion)
    .bind(&req.relationship_type)
    .bind(&req.dating_intention)
    .bind(&req.drinks)
    .bind(&req.smokes)
    .execute(pool)
    .await?;

    Ok(())
}

/// Update an existing profile
pub async fn update_profile(pool: &PgPool, user_id: &Uuid, req: &UpdateProfileRequest) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"UPDATE profiles SET
            name = COALESCE($2, name),
            bio = COALESCE($3, bio),
            pronouns = COALESCE($4, pronouns),
            gender = COALESCE($5, gender),
            sexuality = COALESCE($6, sexuality),
            height = COALESCE($7, height),
            job = COALESCE($8, job),
            company = COALESCE($9, company),
            school = COALESCE($10, school),
            ethnicity = COALESCE($11, ethnicity),
            politics = COALESCE($12, politics),
            religion = COALESCE($13, religion),
            relationship_type = COALESCE($14, relationship_type),
            dating_intention = COALESCE($15, dating_intention),
            drinks = COALESCE($16, drinks),
            smokes = COALESCE($17, smokes)
        WHERE user_id = $1"#
    )
    .bind(user_id)
    .bind(&req.name)
    .bind(&req.bio)
    .bind(&req.pronouns)
    .bind(&req.gender)
    .bind(&req.sexuality)
    .bind(&req.height)
    .bind(&req.job)
    .bind(&req.company)
    .bind(&req.school)
    .bind(&req.ethnicity)
    .bind(&req.politics)
    .bind(&req.religion)
    .bind(&req.relationship_type)
    .bind(&req.dating_intention)
    .bind(&req.drinks)
    .bind(&req.smokes)
    .execute(pool)
    .await?;

    Ok(())
}

/// Create or update a profile (upsert)
pub async fn upsert_profile(pool: &PgPool, user_id: &Uuid, req: &UpdateProfileRequest) -> Result<bool, sqlx::Error> {
    let exists = check_profile_exists(pool, user_id).await?;
    
    if exists {
        update_profile(pool, user_id, req).await?;
        Ok(false) // was not new
    } else {
        create_profile(pool, user_id, req).await?;
        Ok(true) // was new
    }
}

/// Delete user account (profile + user)
pub async fn delete_user(pool: &PgPool, user_id: &Uuid) -> Result<(), sqlx::Error> {
    // Delete profile first (foreign key constraint)
    sqlx::query("DELETE FROM profiles WHERE user_id = $1")
        .bind(user_id)
        .execute(pool)
        .await?;

    // Delete user
    sqlx::query("DELETE FROM users WHERE id = $1")
        .bind(user_id)
        .execute(pool)
        .await?;

    Ok(())
}

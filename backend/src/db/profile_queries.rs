use sqlx::PgPool;
use uuid::Uuid;
use crate::models::inputs::UpdateProfileRequest;
use crate::models::outputs::ProfileDetails;

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

    // Delete the user's images
    sqlx::query("DELETE FROM user_images WHERE user_id = $1")
        .bind(user_id)
        .execute(pool)
        .await?;

    // Delete the user's prompts
    sqlx::query("DELETE FROM user_prompts WHERE user_id = $1")
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

/// Count how many profile attributes are still NULL (unfilled)
pub async fn check_profile_attributes_filled(pool: &PgPool, user_id: &Uuid) -> Result<i64, sqlx::Error> {
    let row: (i64,) = sqlx::query_as(r#"
        SELECT 
            (CASE WHEN name IS NULL THEN 1 ELSE 0 END +
             CASE WHEN bio IS NULL THEN 1 ELSE 0 END +
             CASE WHEN pronouns IS NULL THEN 1 ELSE 0 END +
             CASE WHEN gender IS NULL THEN 1 ELSE 0 END +
             CASE WHEN sexuality IS NULL THEN 1 ELSE 0 END +
             CASE WHEN height IS NULL THEN 1 ELSE 0 END +
             CASE WHEN job IS NULL THEN 1 ELSE 0 END +
             CASE WHEN company IS NULL THEN 1 ELSE 0 END +
             CASE WHEN school IS NULL THEN 1 ELSE 0 END +
             CASE WHEN ethnicity IS NULL THEN 1 ELSE 0 END +
             CASE WHEN politics IS NULL THEN 1 ELSE 0 END +
             CASE WHEN religion IS NULL THEN 1 ELSE 0 END +
             CASE WHEN relationship_type IS NULL THEN 1 ELSE 0 END +
             CASE WHEN dating_intention IS NULL THEN 1 ELSE 0 END +
             CASE WHEN drinks IS NULL THEN 1 ELSE 0 END +
             CASE WHEN smokes IS NULL THEN 1 ELSE 0 END)::bigint AS missing_count
        FROM profiles
        WHERE user_id = $1
    "#)
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    Ok(row.0)
}

pub async fn get_profile(pool: &PgPool, user_id: &Uuid) -> Result<ProfileDetails, sqlx::Error> {
    let row = sqlx::query_as::<_, ProfileDetails>(r#"
        SELECT name, bio, birthdate::TEXT, pronouns, gender, sexuality, height,
            NULL as location, job, company, school, ethnicity, politics, religion,
            relationship_type, dating_intention, drinks, smokes
        FROM profiles WHERE user_id = $1
    "#).bind(user_id).fetch_one(pool).await?;

    Ok(row)
}

/// Get profile suggestions based on user preferences
/// For now: filters by gender_preference only, excludes current user
pub async fn get_suggestions(
    pool: &PgPool,
    gender_preference: Option<Vec<String>>,
    user_id: &Uuid,
) -> Result<Vec<ProfileDetails>, sqlx::Error> {
    
    // If gender_preference is provided, filter by it; otherwise return all profiles
    let profiles = if let Some(genders) = gender_preference {
        // Filter profiles where gender is in the preference list
        sqlx::query_as::<_, ProfileDetails>(r#"
            SELECT name, bio, birthdate::TEXT, pronouns, gender, sexuality, height,
                NULL as location, job, company, school, ethnicity, politics, religion,
                relationship_type, dating_intention, drinks, smokes
            FROM profiles 
            WHERE gender = ANY($1) AND user_id != $2
            LIMIT 20
        "#)
        .bind(&genders)
        .bind(user_id)
        .fetch_all(pool)
        .await?
    } else {
        // No preference - return all profiles except current user
        sqlx::query_as::<_, ProfileDetails>(r#"
            SELECT name, bio, birthdate::TEXT, pronouns, gender, sexuality, height,
                NULL as location, job, company, school, ethnicity, politics, religion,
                relationship_type, dating_intention, drinks, smokes
            FROM profiles 
            WHERE user_id != $1
            LIMIT 20
        "#)
        .bind(user_id)
        .fetch_all(pool)
        .await?
    };

    Ok(profiles)
}
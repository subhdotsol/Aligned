use sqlx::PgPool;
use uuid::Uuid;

use crate::models::inputs::InteractRequest;

pub async fn interact(
    pool: &PgPool,
    from_user_id: &Uuid,
    to_user_id: &Uuid,
    body: &InteractRequest,
) -> Result<(), sqlx::Error> {
    // Extract context_type and context_id from the optional context
    let (context_type, context_id) = match &body.context {
        Some(ctx) => (Some(ctx.r#type.clone()), Some(ctx.id.clone())),
        None => (None, None),
    };

    sqlx::query!(
        r#"INSERT INTO interactions (from_user_id, to_user_id, action, context_type, context_id, comment) 
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (from_user_id, to_user_id) 
           DO UPDATE SET action = $3, context_type = $4, context_id = $5, comment = $6"#,
        from_user_id,
        to_user_id,
        body.action,
        context_type,
        context_id,
        body.comment
    )
    .execute(pool)
    .await?;

    Ok(())
}

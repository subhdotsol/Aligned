use sqlx::PgPool;
use uuid::Uuid;

/// Count the number of images for a user
pub async fn count_images(pool: &PgPool, user_id: &Uuid) -> Result<i64, sqlx::Error> {
    let row: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM user_images WHERE user_id = $1")
        .bind(user_id)
        .fetch_one(pool)
        .await?;

    Ok(row.0)
}

/// Upload a profile image (max 6 allowed)
pub async fn upload_profile_images(pool: &PgPool, user_id: &Uuid, image_url: &str) -> Result<(), sqlx::Error> {
    let count = count_images(pool, user_id).await?;

    if count >= 6 {
        return Err(sqlx::Error::Protocol("Maximum 6 images allowed".to_string()));
    }

    let display_order = count as i32;

    sqlx::query(
        "INSERT INTO user_images (user_id, url, display_order) VALUES ($1, $2, $3)"
    )
    .bind(user_id)
    .bind(image_url)
    .bind(display_order)
    .execute(pool)
    .await?;

    Ok(())
}

/// Delete a profile image by display order
pub async fn delete_profile_images(pool: &PgPool, user_id: &Uuid, display_order: i32) -> Result<(), sqlx::Error> {
    sqlx::query("DELETE FROM user_images WHERE user_id = $1 AND display_order = $2")
        .bind(user_id)
        .bind(display_order)
        .execute(pool)
        .await?;

    Ok(())
}

/// Get all images for a user
pub async fn get_user_images(pool: &PgPool, user_id: &Uuid) -> Result<Vec<(Uuid, String, i32)>, sqlx::Error> {
    let rows: Vec<(Uuid, String, i32)> = sqlx::query_as(
        "SELECT id, url, display_order FROM user_images WHERE user_id = $1 ORDER BY display_order"
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;

    Ok(rows)
}

///
pub async fn get_images(pool: &PgPool, user_id: &Uuid) -> Result<Vec<(Uuid, String, i32)>, sqlx::Error> {
    let rows: Vec<(Uuid, String, i32)> = sqlx::query_as(
        "SELECT id, url, display_order FROM user_images WHERE user_id = $1 ORDER BY display_order"
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;

    Ok(rows)
}

use std::fs;
use std::path::Path;

use actix_multipart::form::{MultipartForm, json::Json as MpJson, tempfile::TempFile};
use actix_web::{HttpResponse, Responder};
use serde::Deserialize;

use crate::models::outputs::StatusResponse;

#[derive(Deserialize, Debug)]
struct Metadata {
    name: String,
}

#[derive(Debug, MultipartForm)]
pub struct ImageUpload {
    #[multipart(limit = "50mb")]
    file: TempFile,
    metadata: MpJson<Metadata>,
}

pub async fn upload_image_file(MultipartForm(form): MultipartForm<ImageUpload>) -> impl Responder {
    let file_name = form.file.file_name.as_ref().map(|s| s.as_str()).unwrap_or("file upload error");

    let dest_path = Path::new("./uploads").join(file_name);

    match fs::copy(form.file.file.path(), &dest_path) {
        Ok(_) => {
            println!("File Uploaded!!!!");
            HttpResponse::Ok().json(StatusResponse {
                status: "success".to_string(),
                message: Some("File uploaded successfully".to_string()),
            })
        },
        Err(_e) => HttpResponse::InternalServerError().json(StatusResponse {
            status: "error".to_string(),
            message: Some("Failed to upload file".to_string()),
        })
    }
}
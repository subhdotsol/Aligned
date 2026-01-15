# Backend API Routes Documentation

Simple reference for all API routes.

---

## Authentication Routes

### `POST /auth/phone/login`
Start phone login (sends OTP).

**Request:**
```json
{
  "phone": "+15550109999"
}
```

**Response:**
```json
{
  "message": "Verification code sent successfully",
  "verification_id": "uuid-string"
}
```

---

### `POST /auth/phone/verify`
Verify OTP code and get auth token.

**Request:**
```json
{
  "verification_id": "uuid-string",
  "code": "123456"
}
```

**Response (Success):**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-uuid",
    "is_profile_complete": false,
    "is_new_user": true
  }
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Invalid verification code"
}
```

---

## Profile Routes

### `GET /profile/me`
Get current user's profile including images and prompts.

**Auth:** Required (Bearer token)

**Response:**
```json
{
  "id": "user-uuid",
  "images": [
    { "id": "img-uuid", "url": "https://...", "order": 0 }
  ],
  "prompts": [
    { "id": "prompt-uuid", "question": "...", "answer": "...", "order": 0 }
  ],
  "details": {
    "name": "Sarah",
    "bio": "...",
    "gender": "Woman"
  }
}
```

### `POST /profile`
Update profile details.

**Auth:** Required

**Request:**
```json
{
  "name": "Sarah",
  "bio": "Love hiking and coffee",
  "pronouns": "she/her",
  "gender": "Woman",
  "sexuality": "Straight",
  "height": 170,
  "job": "Designer",
  "company": "Acme Inc",
  "school": "MIT",
  "ethnicity": "Latina",
  "politics": "Moderate",
  "religion": "Christian",
  "relationship_type": "Monogamy",
  "dating_intention": "Long-term relationship",
  "drinks": "Socially",
  "smokes": "No"
}
```
*All fields are optional - only send what you want to update.*

**Response:**
```json
{
  "status": "success",
  "message": "Profile updated successfully"
}
```

---

### `POST /profile/images`
Upload a profile image URL.

**Auth:** Required

**Request:**
```json
{
  "image_url": "https://cdn.example.com/image.jpg"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Profile images uploaded successfully"
}
```

---

### `POST /profile/finalize`
Check if profile is ready to "Go Live" (6 images, 3 prompts, all fields filled).

**Auth:** Required

**Request:** Empty `{}`

**Response (Success):**
```json
{
  "status": "success",
  "message": "Profile finalized successfully",
  "pending_actions": []
}
```

**Response (Incomplete):**
```json
{
  "status": "error",
  "message": "Profile not finalized",
  "pending_actions": [
    "Upload 4 more images",
    "Upload 2 more prompts",
    "Fill 5 more profile details"
  ]
}
```

---

### `DELETE /profile`
Delete user account permanently.

**Auth:** Required

**Response:**
```json
{
  "status": "success",
  "message": "Account deleted successfully"
}
```

---

## Prompts Routes

### `GET /prompts`
Get all prompts for the current user.

**Auth:** Required

**Response:**
```json
[
  {
    "id": "prompt-uuid",
    "question": "Two truths and a lie...",
    "answer": "I can juggle, I speak French, I have a pet llama.",
    "order": 0
  }
]
```

---

### `POST /prompts`
Create a new prompt (max 3).

**Auth:** Required

**Request:**
```json
{
  "question": "Two truths and a lie...",
  "answer": "I can juggle, I speak French, I have a pet llama."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Prompt created successfully"
}
```

---

### `PUT /prompts/{order}`
Update a prompt by display order (0-2).

**Auth:** Required

**Request:**
```json
{
  "question": "My ideal weekend looks like...",
  "answer": "Coffee, hiking, and cooking a new recipe."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Prompt updated successfully"
}
```

---

### `DELETE /prompts/{order}`
Delete a prompt by display order (0-2).

**Auth:** Required

**Response:**
```json
{
  "status": "success",
  "message": "Prompt deleted successfully"
}
```

---

## User Preferences Routes

### `POST /user/preferences`
Update user dating preferences.

**Auth:** Required

**Request:**
```json
{
  "ageRange": { "min": 21, "max": 35 },
  "distanceMax": 50,
  "genderPreference": ["Woman"],
  "ethnicityPreference": [],
  "religionPreference": []
}
```
*All fields are optional. Empty arrays mean "open to all".*

**Response:**
```json
{
  "status": "success",
  "message": "User preferences updated successfully"
}
```

---

## Feed Routes

### `GET /feed`
Get recommended profiles based on user preferences.

**Auth:** Required

**Query Params:** None (uses stored preferences)

**Response:**
```json
{
  "profiles": [
    {
      "id": "user-uuid",
      "images": null,
      "prompts": null,
      "details": {
        "name": "Ana",
        "gender": "Woman",
        "job": "Actress",
        "ethnicity": "Latina"
      }
    }
  ]
}
```
*Currently filters by `genderPreference` only. Distance/age filters coming soon.*

---


## Interaction Routes

### `POST /interact`
Like or Pass on a profile.

**Auth:** Required

**Request:**
```json
{
  "target_user_id": "user-uuid",
  "action": "LIKE",
  "context": {
    "type": "IMAGE",
    "id": "image-id"
  },
  "comment": "Love this hiking spot!"
}
```
*`context` and `comment` are optional. `action` can be "LIKE" or "PASS".*

**Response (Success):**
```json
{
  "status": "success",
  "message": "Interaction recorded"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Invalid target user ID"
}
```

---

## Match Routes

### `GET /matches`
Get all matches. *(Not implemented yet - returns stub)*

**Auth:** Required

---

### `GET /matches/{id}/messages`
Get chat history for a match. *(Not implemented yet - returns stub)*

**Auth:** Required

---

### `POST /matches/{id}/messages`
Send a message. *(Not implemented yet - returns stub)*

**Auth:** Required

**Request:**
```json
{
  "text": "Hey! How's it going?"
}
```

---

## Response Types Summary

| Type | Fields | Used For |
|------|--------|----------|
| `StatusResponse` | `status`, `message` | Generic success/error |
| `LoginResponse` | `message`, `verification_id` | Phone login |
| `AuthResponse` | `token`, `user` | Phone verify success |
| `FinalizeProfileResponse` | `status`, `message`, `pending_actions` | Finalize profile |

---

## Implementation Status

| Route | Status |
|-------|--------|
| `POST /auth/phone/login` | ✅ Done |
| `POST /auth/phone/verify` | ✅ Done |
| `GET /profile/me` | ✅ Done |
| `POST /profile` | ✅ Done |
| `POST /profile/images` | ✅ Done |
| `POST /profile/finalize` | ✅ Done |
| `DELETE /profile` | ✅ Done |
| `GET /prompts` | ✅ Done |
| `POST /prompts` | ✅ Done |
| `PUT /prompts/{order}` | ✅ Done |
| `DELETE /prompts/{order}` | ✅ Done |
| `POST /user/preferences` | ✅ Done |
| `GET /feed` | ✅ Done |
| `POST /interact` | ✅ Done |
| `GET /matches` | ❌ Stub |
| `GET /matches/{id}/messages` | ❌ Stub |
| `POST /matches/{id}/messages` | ❌ Stub |

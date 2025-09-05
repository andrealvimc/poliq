# 📋 Poliq API - Complete Endpoints Documentation

**Base URL**: `http://localhost:3000/api/v1`  
**Documentation**: `http://localhost:3000/api/v1/docs` (Swagger)

## 🔐 Authentication Required

All endpoints require JWT token in header:
```http
Authorization: Bearer <your-jwt-token>
```

## Authentication

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@poliq.com",
  "password": "admin123"
}
```

### Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

## News Management

### Create News
```http
POST /api/v1/news
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Breaking News Title",
  "summary": "Brief summary of the news",
  "content": "Full content of the news article",
  "originalLink": "https://source.com/article",
  "originalSource": "Source Name",
  "tags": ["technology", "innovation"],
  "status": "DRAFT"
}
```

### Get All News (Admin)
```http
GET /api/v1/news?page=1&limit=10
Authorization: Bearer <token>
```

### Get Published News (Public)
```http
GET /api/v1/news/published?page=1&limit=10
```

### Get News by ID
```http
GET /api/v1/news/:id
```

### Get News by Slug
```http
GET /api/v1/news/slug/:slug
```

### Update News
```http
PATCH /api/v1/news/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "PUBLISHED"
}
```

### Search News
```http
GET /api/v1/news/search?q=technology&page=1&limit=10
```

### Get News by Tag
```http
GET /api/v1/news/tag/technology?page=1&limit=10
```

## External Providers

### Fetch News from All Sources
```http
POST /api/v1/providers/fetch
Authorization: Bearer <token>
```

### Get Active Sources
```http
GET /api/v1/providers/sources/active
Authorization: Bearer <token>
```

### Toggle Source Status
```http
PATCH /api/v1/providers/sources/:id/toggle
Authorization: Bearer <token>
```

## AI Processing

### Process News Content
```http
POST /api/v1/ai/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "News title to process",
  "content": "Full content to analyze",
  "originalSource": "Source name"
}
```

### Generate Summary
```http
POST /api/v1/ai/summary
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "News title",
  "content": "Content to summarize"
}
```

### Generate Headline
```http
POST /api/v1/ai/headline
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Original title",
  "content": "Content for context"
}
```

### Generate Tags
```http
POST /api/v1/ai/tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "News title",
  "content": "News content"
}
```

## Media Generation

### Generate Image
```http
POST /api/v1/media/generate-image
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Image subject",
  "description": "Additional context",
  "style": "news"
}
```

### Generate Social Media Post
```http
POST /api/v1/media/social-post
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "News title",
  "imageUrl": "https://example.com/image.jpg",
  "platform": "instagram"
}
```

## Publication

### Publish to Social Media
```http
POST /api/v1/publication/publish/:newsId/:platform
Authorization: Bearer <token>
```

### Get Publications
```http
GET /api/v1/publication?newsId=optional
Authorization: Bearer <token>
```

### Get Publication Stats
```http
GET /api/v1/publication/stats
Authorization: Bearer <token>
```

### Retry Failed Publication
```http
POST /api/v1/publication/retry/:publicationId
Authorization: Bearer <token>
```

## Queue Management

### Get Queue Statistics
```http
GET /api/v1/queue/stats
Authorization: Bearer <token>
```

### Pause Queue
```http
POST /api/v1/queue/pause/:queueName
Authorization: Bearer <token>
```

### Resume Queue
```http
POST /api/v1/queue/resume/:queueName
Authorization: Bearer <token>
```

## Health Check

### Basic Health
```http
GET /api/v1/
```

### Detailed Health
```http
GET /api/v1/health
```

## Response Formats

### Success Response
```json
{
  "id": "uuid",
  "title": "News Title",
  "slug": "news-title",
  "status": "PUBLISHED",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Paginated Response
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

- Default: 100 requests per minute
- Configurable via `THROTTLE_LIMIT` and `THROTTLE_TTL` environment variables

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Get your token by logging in via `/api/v1/auth/login`.

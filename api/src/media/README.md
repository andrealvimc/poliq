# 🎨 Media Module - Image Generation System

## Overview

The MediaModule is a comprehensive image generation system that creates visual assets from predefined templates. It's designed to be scalable and easily extensible for different template styles and storage providers.

## Architecture

```
src/media/
├── dto/
│   └── generate-image.dto.ts      # Input validation for image generation
├── interfaces/
│   └── template.interface.ts      # TypeScript interfaces for templates
├── services/
│   ├── template.service.ts        # Template loading and management
│   ├── image-generator.service.ts # Core image generation using Canvas
│   └── storage.service.ts         # File storage abstraction
├── templates/
│   ├── infomoney.json            # InfoMoney-style template
│   └── default.json              # Simple default template
├── media.controller.ts           # REST API endpoints
├── media.service.ts              # Main business logic
└── media.module.ts               # Module configuration
```

## Features

### ✅ Template System
- **JSON-based templates** with flexible configuration
- **Template caching** for improved performance
- **Hot-reloading** of templates without server restart
- **Template validation** to ensure consistency

### ✅ Image Generation
- **Node Canvas** for high-quality image rendering
- **Multi-line text** with automatic wrapping
- **Custom fonts, colors, and styling**
- **Gradient backgrounds** and overlays
- **Background image integration**

### ✅ Storage Providers
- **Local storage** (default) with automatic directory creation
- **S3-ready architecture** for cloud storage (placeholder implemented)
- **Configurable storage backend** via environment variables

### ✅ Output Formats
- **PNG, JPEG, WebP** support
- **Base64 encoding** for direct embedding
- **Binary buffer** for direct streaming
- **Quality control** for compressed formats

## API Endpoints

### Generate Image
```http
POST /api/v1/media/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Breaking News: New Technology",
  "subtitle": "Revolutionary AI changes everything",
  "category": "TECHNOLOGY",
  "template": "infomoney",
  "format": "png"
}
```

### Generate Base64 Image
```http
POST /api/v1/media/generate/base64
Authorization: Bearer <token>

// Returns: { "success": true, "data": "data:image/png;base64,..." }
```

### Generate Social Media Optimized
```http
POST /api/v1/media/generate/social/instagram
Authorization: Bearer <token>

{
  "title": "Your news title",
  "subtitle": "Optional subtitle",
  "category": "NEWS"
}
```

### Get Available Templates
```http
GET /api/v1/media/templates
Authorization: Bearer <token>

// Returns: { "templates": ["infomoney", "default"], "count": 2 }
```

## Template Configuration

### Template Structure
```json
{
  "name": "Template Name",
  "description": "Template description",
  "dimensions": {
    "width": 1200,
    "height": 630
  },
  "background": {
    "type": "color",
    "value": "#1e3a8a",
    "gradient": {
      "enabled": true,
      "direction": "diagonal",
      "colors": ["#1e3a8a", "#3b82f6"]
    }
  },
  "elements": {
    "category": {
      "enabled": true,
      "position": { "x": 60, "y": 60 },
      "style": {
        "backgroundColor": "#ef4444",
        "color": "#ffffff",
        "fontSize": 16,
        "fontWeight": "bold",
        "padding": { "horizontal": 16, "vertical": 8 },
        "borderRadius": 4,
        "textTransform": "uppercase"
      }
    },
    "title": {
      "position": { "x": 60, "y": 180, "maxWidth": 1080 },
      "style": {
        "color": "#ffffff",
        "fontSize": 48,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "lineHeight": 1.2,
        "maxLines": 3
      }
    }
  }
}
```

### Adding New Templates

1. Create a new JSON file in `src/media/templates/`
2. Follow the template structure above
3. Add the template name to the enum in `generate-image.dto.ts`
4. Reload templates via API or restart server

## Usage Examples

### Basic Image Generation
```typescript
import { MediaService } from './media/media.service';

// Inject MediaService
const result = await this.mediaService.generateImage({
  title: 'Breaking News',
  subtitle: 'Important update',
  category: 'NEWS',
  template: 'infomoney',
  format: 'png'
});

console.log('Generated image URL:', result.url);
```

### Integration with News Module
```typescript
// In news.service.ts
async createNewsWithImage(newsData: CreateNewsDto) {
  // Create news
  const news = await this.create(newsData);
  
  // Generate image
  const imageResult = await this.mediaService.generateImage({
    title: news.title,
    subtitle: news.summary,
    category: this.extractCategory(news.tags),
    template: 'infomoney'
  });
  
  // Update news with generated image
  if (imageResult.success) {
    await this.update(news.id, {
      imageUrl: imageResult.url,
      imageGenerated: true
    });
  }
  
  return news;
}
```

### Queue Integration
```typescript
// In queue processor
@Process('generate-media')
async generateMedia(job: Job) {
  const { newsId, title, subtitle } = job.data;
  
  const result = await this.mediaService.generateImage({
    title,
    subtitle,
    template: 'infomoney'
  });
  
  // Update database with generated image
  await this.updateNewsImage(newsId, result.url);
}
```

## Configuration

### Environment Variables
```env
# Storage configuration
STORAGE_TYPE=local  # or 's3'
STORAGE_BASE_URL=http://localhost:3000

# S3 Configuration (when using S3)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name
```

### Canvas Dependencies

The module requires `node-canvas` which has native dependencies:

#### Ubuntu/Debian
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

#### macOS
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

#### Docker
The provided Dockerfile includes all necessary dependencies for canvas.

## Performance Considerations

### Template Caching
- Templates are cached in memory after first load
- Use `POST /api/v1/media/templates/reload` to refresh cache
- Templates are validated on load to prevent runtime errors

### Image Generation
- Canvas operations are CPU-intensive
- Consider using queues for batch generation
- Generated images are stored persistently

### Storage
- Local storage is suitable for development
- Use S3 or similar for production with high traffic
- Implement CDN for better image delivery performance

## Extending the System

### Adding New Storage Providers
1. Implement the `StorageProvider` interface
2. Add the provider to `StorageService`
3. Update configuration logic

### Creating Custom Templates
1. Design your template in JSON format
2. Test with the validation system
3. Add template-specific styling options
4. Document the template usage

### Adding Image Effects
1. Extend the `ImageGeneratorService`
2. Add new effect options to template interface
3. Implement Canvas operations for effects

## Error Handling

The system includes comprehensive error handling:
- **Template validation** errors
- **Canvas rendering** errors  
- **Storage operation** errors
- **File system** errors

All errors are logged and returned with descriptive messages.

## Testing

```bash
# Test template loading
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/media/templates

# Test image generation
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","template":"infomoney"}' \
  http://localhost:3000/api/v1/media/generate

# Test base64 generation
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","template":"default"}' \
  http://localhost:3000/api/v1/media/generate/base64
```

## Troubleshooting

### Canvas Installation Issues
- Ensure native dependencies are installed
- Check Node.js version compatibility
- Use Docker for consistent environment

### Template Not Found
- Verify template file exists in `src/media/templates/`
- Check JSON syntax and structure
- Reload template cache

### Storage Errors
- Verify uploads directory permissions
- Check disk space availability
- Validate environment configuration

## Future Enhancements

- [ ] Video generation support
- [ ] Advanced text effects (shadows, outlines)
- [ ] Template inheritance system
- [ ] Batch processing optimization
- [ ] Real-time template editor
- [ ] Image analytics and metrics

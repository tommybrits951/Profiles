# AI Agent Instructions for Profiles Project

## Project Overview
This is a social networking application built with a React frontend and Express/MongoDB backend. The application features user authentication, friend requests, profile management, and post creation/interaction.

## Architecture

### Frontend (`/client`)
- React application using Vite
- Uses Context API for state management (`ProfileContext`)
- TailwindCSS for styling
- Key components:
  - `App.jsx`: Root component with auth state management
  - `/components/layout`: Page layouts and routing
  - `/components/user`: Authentication and profile components
  - `/features/friends`: Friend management components
  - `/features/posts`: Post creation and display components

### Backend (`/server`)
- Express.js server with MongoDB
- Uses controllers, routes, and mongoose models for structure
- All methods are done withing controllers using async/await
- Key features:
  - JWT-based authentication
  - Image upload and processing
  - Friend request system
  - Post creation and management
  - Comments for posts
  

## Key Patterns and Conventions

### Authentication Flow
- Uses JWT with access/refresh token pattern
- Access token stored in memory, refresh token in HTTP-only cookie
- All authenticated routes require `Authorization: Bearer <token>` header

### API Security
- Rate limiting on all routes (100 req/min) and stricter limits on login (5 attempts/15min)
- Password validation requires minimum length, uppercase, lowercase, numbers, special chars
- CORS configured for specific origins


### Error Handling
- Reponses comes with proper HTTP status codes
- Response comes in structured format: `res.status(code).json({ message: err.message || 'Error message' })`

### File Upload Pattern
- Profile pictures processed using Sharp for resizing/cropping
- Profile Pictures are stored in `/server/images/profiles`
- Images stored in `/server/images/gallery`
- File size limited to 5MB

### Database Models
- User schema includes virtual fields for `age` and `full_name`
- Posts support nested comments with likes


## Development Workflow

### Local Development
```bash
# Start backend (PORT 9000)
cd server
npm run dev

# Start frontend (PORT 5173)
cd client
npm run dev
```

### Key Files for Common Tasks
- Adding new API routes: Create controller in `/server/controllers`, add route in `/server/routes`
- No mongodb model methods are used, all database interactions are done directly in controllers.
- CORS is configured in `/server/app.js` using the `cors` package.

- New frontend features: Add components in `/client/src/features`
- Styling: Use Tailwind classes, global styles in `App.css`

### Testing
No automated tests currently implemented. Manual testing required.

## Common Gotchas
1. Editing profile pics requires both resize and file save operations
2. Friend requests must be updated on both users' documents
3. Token refresh happens silently through `App.jsx` useEffect
4. Image URLs must use `http://localhost:9000` prefix

## Future Considerations
1. Need to implement post comments functionality
2. Add real-time notifications for friend requests
3. Implement proper error boundary in React app
4. Add testing framework and CI/CD pipeline
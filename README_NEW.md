# AnySmart LMS - Frontend

A modern, full-featured Learning Management System (LMS) built with React, Vite, and TailwindCSS. This application provides a comprehensive platform for instructors to manage courses and students to learn effectively.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Latest-06B6D4)
![Node](https://img.shields.io/badge/Node.js-16%2B-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Available Scripts](#available-scripts)
- [Key Features by Role](#key-features-by-role)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Students
- 🎓 Browse and search courses by category, level, and price
- 💳 Secure course purchase with PayPal integration
- ▶️ Stream video lectures with progress tracking
- 📊 Track learning progress and course completion status
- 📝 View course curriculum and lecture details
- 🎉 Celebrate course completions with rewards

### For Instructors
- 📚 Create and manage multiple courses
- 🎥 Upload and organize video content
- 💰 Set course pricing and access controls
- 📊 Monitor student progress and engagement
- ✏️ Edit course details and curriculum
- 🗑️ Manage course content and organization

### General
- 🔐 Secure authentication and authorization
- 🎨 Professional, responsive UI design
- ⚡ Fast performance with Vite bundling
- 🌐 Cross-platform compatibility
- 📱 Mobile-friendly interface

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Next generation build tool
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Axios** - HTTP client
- **React Player** - Video player component
- **Swiper** - Modern carousel/slider
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **React Confetti** - Celebration animations

### Development
- **ESLint** - Code quality
- **Autoprefixer** - CSS vendor prefixes
- **PostCSS** - CSS processing

## 📁 Project Structure

```
src/
├── api/                          # API configuration
│   └── axiosInstance.js         # Axios setup
├── assets/                       # Static assets
├── components/
│   ├── common-form/             # Reusable form components
│   ├── instructor-view/         # Instructor-specific components
│   │   ├── courses/
│   │   └── dashboard/
│   ├── student-view/            # Student-specific components
│   ├── ui/                      # Shared UI components (Radix-based)
│   ├── video-player/            # Video player component
│   └── route-guard/             # Protected routes
├── config/                      # Configuration files
├── context/                     # React Context providers
│   ├── auth-context/           # Authentication state
│   ├── instructor-context/     # Instructor state
│   └── student-context/        # Student state
├── hooks/                       # Custom React hooks
│   └── use-toast.js
├── lib/                         # Utility functions
│   └── utils.js
├── pages/
│   ├── auth/                   # Login/Register pages
│   ├── instructor/             # Instructor pages
│   │   ├── add-new-course.jsx
│   │   └── index.jsx
│   ├── student/                # Student pages
│   │   ├── home/
│   │   ├── courses/
│   │   ├── course-details/
│   │   ├── course-progress/
│   │   ├── student-courses/
│   │   └── payment-return/
│   └── not-found/
├── services/                    # API service functions
├── App.jsx                      # Main App component
├── main.jsx                     # Entry point
└── index.css                    # Global styles
```

## 📦 Prerequisites

- **Node.js** - v16.0.0 or higher
- **npm** - v7.0.0 or higher (or yarn/pnpm)
- Backend API server running (typically on `https://anysmart-backend.vercel.app`)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd any-smart-lms-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Verify installation**
```bash
npm run lint
```

## ⚙️ Configuration

### Backend API Setup
Create an environment configuration file or update the Axios instance to point to your backend API:

**File:** `src/api/axiosInstance.js`
```javascript
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://anysmart-backend.vercel.app';
```

### Route Aliases
The project uses path aliases for cleaner imports:
- `@` → `./src`

Example usage:
```javascript
import { Button } from "@/components/ui/button";
import { StudentContext } from "@/context/student-context";
```

### Tailwind CSS Customization
Customize your theme in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#1E4D2B',
      // Add more custom colors
    }
  }
}
```

## 🏃 Running the Application

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (default Vite port)

### Preview Production Build
```bash
npm run build
npm run preview
```

## 🔨 Building for Production

1. **Build the application**
```bash
npm run build
```

2. **Output location**
- Build artifacts are generated in the `dist/` directory
- This directory is ready for deployment to any static hosting service

3. **Optimize for production**
```bash
npm run lint    # Check code quality
npm run build   # Create optimized production build
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🎯 Key Features by Role

### Student Workflow
1. Sign up and log in
2. Browse courses on home page
3. Filter and search courses on /courses page
4. View course details and free preview
5. Purchase course via PayPal
6. Access purchased courses on My Courses (/student-courses)
7. Watch video lectures and track progress
8. Receive completion notifications

### Instructor Workflow
1. Sign up and log in as instructor
2. Create new course from dashboard
3. Add course details, pricing, and description
4. Upload course curriculum and video content
5. Publish course for student access
6. Monitor student enrollment and progress
7. Edit or delete courses as needed

## 🔌 API Integration

The application integrates with a backend API for:
- **Authentication** - Login, register, token validation
- **Course Management** - CRUD operations for courses
- **Student Progress** - Track and update course progress
- **Payment Processing** - PayPal integration for course purchases
- **Media Upload** - Handle video and image uploads

### Base URL
```
https://anysmart-backend.vercel.app
```

### Key Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /student/course/get` - Get all courses
- `GET /student/courses-bought/get/:studentId` - Get purchased courses
- `GET /student/course-progress/get/:userId/:courseId` - Get course progress
- `POST /media/upload` - Upload media files
- `POST /instructor/course/add` - Create new course
- `PUT /instructor/course/update/:courseId` - Update course

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

### Code Quality Standards
- Follow ESLint rules
- Use meaningful component and function names
- Add comments for complex logic
- Keep components focused and reusable
- Test all new features before submitting PR

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Development Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build Errors
```bash
# Clear Vite cache
rm -rf dist/ .vite
npm run build
```

### API Connection Issues
- Verify backend API is running
- Check `VITE_API_BASE_URL` environment variable
- Ensure CORS is properly configured on backend
- Check browser console for detailed error messages
- Verify your authentication token is valid

### Video Loading Issues
- Ensure video URLs in database are accessible
- Check video format compatibility with React Player
- Verify media upload service is configured correctly

## 📞 Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review API error messages in browser console
3. Create an issue in the repository
4. Contact the development team

## 🔐 Security Notes

- All sensitive data (API keys, tokens) should be stored in environment variables
- Use HTTPS for all API communication
- Implement proper authentication checks in route guards
- Validate all user inputs before API submission
- Keep dependencies updated for security patches

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Static Hosting (Netlify, GitHub Pages, etc.)
```bash
npm run build
# Upload dist/ folder to your hosting service
```

---

**Built with ❤️ using React & Vite**

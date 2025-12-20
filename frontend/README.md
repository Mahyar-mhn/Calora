# Calora - Nutrition & Fitness Tracking App

![Calora Logo](public/images/logo.png)

A comprehensive nutrition and fitness tracking application built with modern web technologies. Calora helps users monitor their daily nutrition intake, track physical activities, analyze progress through detailed analytics, and achieve their health goals.

## 🚀 Features

### Core Functionality
- **📊 Dashboard**: Real-time overview of daily calorie intake, macronutrient progress, and remaining calories
- **👤 User Profile**: Comprehensive profile management with goal settings and personal information
- **🍽️ Meal & Food Tracking**: Add custom meals or browse from extensive food database
- **🏃 Activity Tracking**: Log workouts, exercises, and monitor activity levels
- **📈 History & Analytics**: Detailed tracking of nutrition and fitness progress over time
- **🔬 Advanced Analytics**: Premium analytics with detailed charts and AI-powered insights
- **🔔 Notifications**: Customizable notification preferences
- **🔒 Privacy Dashboard**: Manage data privacy and account settings
- **💎 Premium Features**: Access to AI meal plans, advanced analytics, and premium recipes

### Key Components
- **Quick Actions**: Fast access to add meals, scan barcodes, log activities, and view insights
- **Food Modal**: Extensive food database with nutritional information
- **Interactive Charts**: Visual representations of progress using Recharts
- **Responsive Design**: Optimized for desktop and mobile devices
- **Theme Support**: Light/dark mode toggle functionality

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - Modern component library

### Data Visualization
- **Recharts** - Composable charting library
- **Responsive Charts** - Mobile-friendly data visualization

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── activity-tracking/        # Activity logging page
│   ├── advanced-analytics/       # Premium analytics page
│   ├── dashboard/                # Main dashboard page
│   ├── food-modal/              # Food selection page
│   ├── goal-management/         # Goal settings page
│   ├── goal-setup/              # Initial goal setup
│   ├── history/                 # Progress history page
│   ├── login/                   # Authentication page
│   ├── meal-food/               # Meal and food management
│   ├── notifications-settings/  # Notification preferences
│   ├── privacy-dashboard/       # Privacy settings
│   ├── profile/                 # User profile page
│   ├── profile-setup/           # Profile setup wizard
│   ├── signup/                  # User registration
│   ├── subscription/            # Premium subscription
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                  # Reusable components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   ├── *-view.tsx               # Page-specific components
│   └── *-form.tsx               # Form components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── public/                      # Static assets
│   └── images/                  # App images and icons
├── styles/                      # Global styles
└── types/                       # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd calora/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Design System

### Color Palette
- **Primary Green**: `#4A9782` - Main brand color
- **Accent Yellow**: `#FFC50F` - Highlights and CTAs
- **Text Dark**: `#004030` - Primary text
- **Text Light**: `#708993` - Secondary text
- **Background**: `#FFF9E5` - Main background
- **Surface**: `#E7F2EF` - Card backgrounds

### Typography
- **Primary Font**: System font stack
- **Headings**: Bold weights for hierarchy
- **Body Text**: Regular weights for readability

### Components
- **Consistent Spacing**: 4px base unit (0.25rem)
- **Border Radius**: 8px for cards, 6px for buttons
- **Shadows**: Subtle shadows for depth
- **Transitions**: Smooth 200ms transitions for interactions

## 🔧 Development Guidelines

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with React rules
- **Prettier**: Consistent code formatting
- **Component Structure**: Functional components with hooks

### Component Patterns
- **Custom Hooks**: Business logic separated from UI
- **Props Interfaces**: Explicit typing for component props
- **Styled Components**: Inline styles with CSS variables
- **Accessibility**: ARIA labels and keyboard navigation

### State Management
- **Local State**: useState for component-level state
- **Form State**: React Hook Form for complex forms
- **Server State**: React Query for API data (future implementation)

## 📊 Key Metrics & Features

### Dashboard Overview
- **Daily Calorie Tracking**: Real-time progress bars
- **Macronutrient Breakdown**: Protein, Carbs, Fats visualization
- **Quick Actions**: Fast access to common tasks
- **AI Insights**: Personalized recommendations

### Analytics Features
- **Calorie Trends**: 7-day consumption tracking
- **Weight Trajectory**: Progress over time
- **Macro Adherence**: Nutritional goal tracking
- **Activity Correlation**: Exercise vs. nutrition insights

### User Experience
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works without JavaScript
- **Offline Support**: Service worker implementation (planned)
- **Performance**: Optimized bundle size and loading

## 🔐 Authentication Flow

1. **Registration**: User signup with basic information
2. **Profile Setup**: Initial goal and preference configuration
3. **Onboarding**: Guided tour of key features
4. **Dashboard**: Main application interface
5. **Premium Access**: Subscription-based advanced features

## 🚀 Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_URL=your_api_endpoint
NEXT_PUBLIC_APP_ENV=production
```

### Build Commands
```bash
npm run build
npm run start
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment option
- **Docker**: Containerized deployment support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review Process
- Automated testing and linting
- Manual code review by maintainers
- Integration testing before merge
- Deployment to staging environment

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Future Enhancements

### Planned Features
- **AI Meal Planning**: Personalized meal recommendations
- **Social Features**: Community challenges and sharing
- **Wearable Integration**: Sync with fitness devices
- **Advanced Analytics**: Predictive health insights
- **Mobile App**: Native iOS and Android applications

### Technical Improvements
- **Performance Optimization**: Code splitting and lazy loading
- **PWA Features**: Offline functionality and push notifications
- **Internationalization**: Multi-language support
- **Accessibility**: WCAG 2.1 AA compliance
- **Testing**: Comprehensive unit and integration tests

---

**Built with ❤️ for health-conscious individuals worldwide**


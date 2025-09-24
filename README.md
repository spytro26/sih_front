# AI-Driven Lifecycle Assessment (LCA) Tool

A professional React frontend application for generating AI-powered lifecycle assessments for metallurgy and mining industries.

## 🌟 Features

- **AI-Powered Assessments**: Generate comprehensive LCA reports using advanced AI analysis
- **Professional UI/UX**: Modern, responsive design with smooth animations
- **Real-time Validation**: Client-side form validation with instant feedback
- **Advanced Animations**: GSAP and Locomotive Scroll for smooth, professional interactions
- **Error Handling**: Robust error management with retry mechanisms
- **Health Monitoring**: Real-time backend server health checks
- **Mobile Responsive**: Optimized for all screen sizes

## 🚀 Technology Stack

- **React 19.1.1** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **GSAP** for advanced animations
- **Locomotive Scroll** for smooth scrolling effects
- **Lucide React** for beautiful icons

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API server running on `http://localhost:5000`

## 🛠️ Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## 🔗 Backend API Integration

The application integrates with the backend API running on `http://localhost:5000`. Ensure the backend server is running before using the application.

### API Endpoints Used:

- `POST /api/lca/assess` - Generate LCA assessment
- `GET /api/lca/supported-materials` - Get supported materials and processes
- `GET /health` - Server health check
- `GET /api/lca/health` - LCA service health check

## 🎯 Usage

1. **Fill out the assessment form**:

   - Select a material (required)
   - Choose a process (required)
   - Add optional details (location, production volume, energy source)

2. **Submit the assessment**:

   - Click "Generate LCA Assessment"
   - Wait 8-15 seconds for AI processing
   - View comprehensive results

3. **Analyze results**:
   - Review lifecycle stages
   - Examine environmental impact metrics
   - Read AI-generated recommendations
   - Consider circularity opportunities

## 📊 Assessment Results Include:

- **Environmental Impact Metrics**:

  - Carbon footprint (kg CO₂eq)
  - Water usage (L)
  - Energy consumption (kWh)
  - Waste generation (kg)

- **AI-Generated Recommendations**:
  - Alternative methods
  - Reduction strategies
  - Circularity opportunities

## 🎨 Design Features

### Professional Styling

- Industrial-grade color scheme (blues, greens, grays)
- Glass morphism effects
- Smooth hover transitions
- Professional typography

### Advanced Animations

- Form field stagger animations
- Scroll-triggered reveals
- Loading state animations
- Error state feedback animations

### Responsive Design

- Mobile-first approach
- Flexible layouts for all screen sizes
- Touch-friendly interactions

## 🛡️ Error Handling

- Network error detection and retry
- Rate limit handling (10 requests per 15 minutes)
- Form validation with visual feedback
- Server health monitoring

## 📱 Accessibility

- Keyboard navigation support
- High contrast mode support
- Screen reader friendly
- Reduced motion support for sensitive users

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── LCAForm.tsx           # Main assessment form
│   ├── LCAResults.tsx        # Results display
│   └── StatusComponents.tsx  # Loading/error states
├── hooks/
│   ├── useAnimations.ts      # GSAP animation hooks
│   ├── useLCAForm.ts         # Form state management
│   └── useLocomotiveScroll.ts # Smooth scrolling
├── services/
│   └── lcaApi.ts            # API service layer
├── types/
│   └── lca.ts               # TypeScript interfaces
├── App.tsx                  # Main application component
├── App.css                  # Professional styling
└── main.tsx                 # Application entry point
```

## ⚠️ Important Notes

### Disclaimer

This assessment includes both verified data and AI-generated hypothetical suggestions. Please validate all recommendations with industry experts before implementation.

### Rate Limits

The API has a rate limit of 10 requests per 15 minutes per IP address. The application handles this gracefully with appropriate error messages.

### Processing Time

AI assessments typically take 8-15 seconds to complete. A loading indicator shows progress during this time.

---

**Built with ❤️ for sustainable mining practices**

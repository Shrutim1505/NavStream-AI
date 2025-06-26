# Ship Route Optimization System

A comprehensive full-stack application for optimizing shipping routes with real-time tracking, weather integration, and advanced analytics. Built with React Native (Expo) frontend and Node.js backend.

## 🚢 Overview

The Ship Route Optimization System helps maritime companies plan optimal shipping routes by considering multiple factors including fuel efficiency, travel time, and route safety. The system provides interactive map visualization, real-time tracking, and comprehensive analytics.

## ✨ Features

### Frontend (React Native App)
- **Interactive Route Planning**: Select departure and destination ports with intuitive interface
- **Optimization Parameters**: Adjust fuel efficiency, travel time, and safety priorities
- **Map Visualization**: Interactive maps with optimized route display using react-native-maps
- **Real-time Tracking**: Live voyage tracking with position updates
- **Analytics Dashboard**: Performance metrics, savings tracking, and voyage history
- **Responsive Design**: Optimized for mobile devices with clean, modern UI

### Backend (Node.js API)
- **Route Optimization Engine**: Advanced algorithms for calculating optimal routes
- **Weather Integration**: Mock weather and marine forecast data (ready for real API integration)
- **Voyage Management**: Complete voyage lifecycle management
- **RESTful API**: Clean, well-documented REST endpoints
- **Data Validation**: Comprehensive input validation and error handling
- **MongoDB Integration**: Robust data storage and retrieval

## 🏗️ Architecture

```
Ship Route Optimization System/
├── Frontend (React Native + Expo)
│   ├── Interactive UI Components
│   ├── Map Integration
│   ├── API Service Layer
│   └── State Management
│
└── Backend (Node.js + Express)
    ├── Route Optimization Service
    ├── Weather Forecast Service
    ├── Voyage Management
    ├── MongoDB Data Layer
    └── RESTful API Endpoints
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.0.0 or higher)
- MongoDB (v4.4 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (for mobile testing)

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open in Expo**
   - Scan QR code with Expo Go app
   - Or press 'i' for iOS simulator
   - Or press 'a' for Android emulator

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd ship-route-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start MongoDB and run the server**
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:3001`

## 📱 App Screenshots & Features

### Route Planning
- Port selection with search functionality
- Optimization parameter sliders
- Real-time route calculation

### Map Visualization
- Interactive route display
- Multiple map types (standard, satellite, hybrid)
- Route statistics and information

### Analytics Dashboard
- Performance KPIs and metrics
- Voyage history and tracking
- Fuel savings and efficiency reports

### Settings & Configuration
- User profile management
- App preferences and notifications
- Language and region settings

## 🛠️ Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Native Maps**: Interactive map integration
- **Lucide React Native**: Modern icon library
- **TypeScript**: Type-safe development

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **Joi**: Data validation
- **Helmet**: Security middleware

## 📊 API Endpoints

### Route Optimization
```
POST /api/routes/optimize    # Optimize shipping route
GET  /api/routes/:id         # Get route details
GET  /api/routes             # List all routes
PUT  /api/routes/:id         # Update route
DELETE /api/routes/:id       # Delete route
```

### Weather & Forecast
```
GET /api/forecast            # Get weather forecast
GET /api/forecast/marine     # Get marine forecast
GET /api/forecast/route/:id  # Get route forecast
```

### Voyage Management
```
POST /api/voyages            # Create voyage
GET  /api/voyages/:id        # Get voyage details
GET  /api/voyages            # List voyages
PUT  /api/voyages/:id        # Update voyage
GET  /api/voyages/:id/tracking # Get tracking data
```

## 🔮 Future Enhancements

### Planned Features
- **Real Weather Integration**: Connect to live weather APIs (NOAA, OpenWeatherMap)
- **Python Optimization**: Integrate scientific optimization libraries
- **Real-time Updates**: WebSocket support for live tracking
- **Machine Learning**: Route prediction and optimization improvements
- **Multi-language Support**: Internationalization
- **Offline Mode**: Cached data for offline usage

### Integration Opportunities
- **AIS Data**: Automatic Identification System integration
- **Port APIs**: Real-time port information and schedules
- **Fuel Price APIs**: Dynamic fuel cost calculations
- **Cargo Management**: Integration with cargo tracking systems

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
cd ship-route-backend
npm test
```

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build:web
```

### Backend Deployment
```bash
cd ship-route-backend
npm start
```

### Docker Support
Both frontend and backend include Docker configurations for containerized deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🙏 Acknowledgments

- Maritime industry experts for domain knowledge
- Open source community for excellent libraries
- Weather data providers for forecast integration
- Map providers for visualization capabilities

---

**Built with ❤️ for the maritime industry**
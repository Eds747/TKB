# YHWH Knowledge Base

A white, iconic, liquid white knowledge base web application built with FastAPI backend and Tailwind CSS frontend.

## 🎯 Overview

This knowledge base system provides healthcare staff with quick access to:
- Appointment guidelines and scheduling rules
- Staff extensions and contact information  
- Insurance portals and verification processes
- HIPAA compliance guidelines
- Common prescriptions reference
- Call flow procedures

## 🛠️ Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Data Source**: JSON files from alimentacion folder
- **Design**: White, iconic, liquid white aesthetic
- **Deployment**: GitHub integration ready

## 📁 Project Structure

```
yhwh/
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── data/                  # Local data storage
│   └── utils/
│       └── validator.py       # Pydantic validation models
├── frontend/
│   ├── index.html            # Main application page
│   └── app.js                # Frontend JavaScript logic
├── package.json              # Node.js dependencies and scripts
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

Make sure you have installed:
- Python 3.10+
- Node.js (for package management)
- Git (for version control)

### Installation

1. **Clone and navigate to project**:
   ```bash
   cd C:\Users\chris\OneDrive\Escritorio\yhwh
   ```

2. **Install Python dependencies**:
   ```bash
   pip install fastapi uvicorn pydantic python-multipart
   ```

3. **Install Node.js dependencies** (optional):
   ```bash
   npm install
   ```

### Running the Application

1. **Start the backend API**:
   ```bash
   uvicorn backend.app:app --reload
   ```
   The API will be available at `http://localhost:8000`

2. **Start the frontend** (in a new terminal):
   ```bash
   # Option 1: Using Python's built-in server
   python -m http.server 3000 --directory frontend
   
   # Option 2: Using Live Server in VS Code
   # Right-click on frontend/index.html and select "Open with Live Server"
   ```
   The frontend will be available at `http://localhost:3000`

3. **Run both simultaneously** (if you have concurrently installed):
   ```bash
   npm start
   ```

## 🎨 Design Features

- **White, Iconic, Liquid Design**: Clean, modern interface with glassmorphism effects
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Real-time Search**: Fast search across all knowledge base content
- **Category Navigation**: Organized sidebar with different content categories
- **Updates Dashboard**: Important notifications and recent changes

## 📊 Data Sources

The application loads data from these JSON files in `C:\Users\chris\Downloads\alimentacion`:
- `appointment_guide.json` - Visit types and scheduling rules
- `information.json` - HIPAA guidelines, forms, and prescriptions
- `staff_extensions.json` - Staff contact information
- `insurance_portals.json` - Insurance verification portals
- `callflow_corrected.json` - Call handling procedures

## 🔧 API Endpoints

- `GET /api/categories` - Get available categories
- `GET /api/data` - Get all knowledge base data
- `GET /api/appointments` - Get appointment guide
- `GET /api/information` - Get general information
- `GET /api/staff` - Get staff extensions
- `GET /api/insurance` - Get insurance portals
- `GET /api/callflow` - Get call flow procedures
- `GET /api/updates` - Get recent updates

## 🚀 Deployment

### GitHub Integration

This project is configured for the repository: `https://github.com/Eds747/TKB.git`

To push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: YHWH Knowledge Base"
git remote add origin https://github.com/Eds747/TKB.git
git push -u origin main
```

### Production Deployment Options

1. **Render/Railway**: Deploy FastAPI backend
2. **Vercel/Netlify**: Deploy static frontend
3. **Docker**: Container-based deployment
4. **Traditional Hosting**: Upload files to web server

## 🛡️ Error Handling

The application includes:
- Comprehensive error handling for file loading
- Validation using Pydantic models
- User-friendly error messages
- Fallback content for missing data

## 🔮 Future Enhancements

- [ ] Authentication and authorization
- [ ] Real-time data updates via WebSocket
- [ ] Advanced search with filters
- [ ] Data export functionality
- [ ] Multi-language support
- [ ] Offline mode support
- [ ] Admin panel for content management

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions:
- Check the GitHub issues page
- Create a new issue with detailed description
- Contact the development team

---

Built with ❤️ for YHWH Healthcare Knowledge Management

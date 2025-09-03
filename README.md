# RadiusF - Study Abroad CRM (Frontend Only)

A comprehensive Study Abroad CRM system built with React, Ant Design, and localStorage for data persistence. This is a frontend-only application that doesn't require any backend server.

## Features

- **Student Management**: Complete student lifecycle management with detailed profiles
- **Application Tracking**: Monitor application progress with timeline visualization
- **University Database**: Comprehensive university information and partnerships
- **Employee Management**: Team member management with role-based access
- **Reports & Analytics**: Detailed insights and performance metrics
- **Role-Based Access Control**: Admin, Counselor, and Employee roles with different permissions
- **LocalStorage Persistence**: All data is stored locally in the browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 with Vite
- **UI Framework**: Ant Design 5.x
- **Routing**: React Router v6
- **Data Storage**: Browser localStorage
- **Icons**: Ant Design Icons
- **Date Handling**: Day.js
- **Build Tool**: Vite

## Demo Credentials

### Admin Access
- **Email**: admin@radiusf.com
- **Password**: admin123
- **Permissions**: Full access to all features

### Counselor Access
- **Email**: sarah.johnson@radiusf.com
- **Password**: counselor123
- **Permissions**: Student and application management

### Employee Access
- **Email**: lisa.wang@radiusf.com
- **Password**: employee123
- **Permissions**: View-only access to most features

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd radiusf
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Project Structure

```
radiusf/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── MainLayout.jsx  # Main application layout
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx    # Authentication context
│   │   └── MessageContext.jsx # Message handling context
│   ├── data/              # Mock data and initialization
│   │   └── mockData.js    # Sample CRM data
│   ├── pages/             # Application pages
│   │   ├── Login.jsx      # Login page
│   │   ├── Dashboard.jsx  # Dashboard overview
│   │   ├── Students.jsx   # Student management
│   │   ├── Applications.jsx # Application tracking
│   │   ├── Universities.jsx # University database
│   │   ├── Employees.jsx  # Employee management
│   │   └── Reports.jsx    # Analytics and reports
│   ├── utils/             # Utility functions
│   │   └── localStorage.js # LocalStorage management
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── package.json           # Project dependencies
├── vite.config.js         # Vite configuration
└── README.md             # This file
```

## Features by Role

### Admin Users
- Complete access to all modules
- Student management (CRUD operations)
- Employee management
- University partnerships
- System-wide analytics
- Data export capabilities

### Counselor Users
- Student management for assigned students
- Application creation and tracking
- University database access
- Performance reports
- Student communication logs

### Employee Users
- View-only access to students and applications
- Basic reporting
- University information access
- Limited dashboard metrics

## Data Management

### LocalStorage Structure
The application uses browser localStorage to persist data:

- `radiusf_users` - User accounts and authentication
- `radiusf_students` - Student profiles and information
- `radiusf_applications` - Application data and status
- `radiusf_universities` - University database
- `radiusf_employees` - Employee information
- `radiusf_current_user` - Current session data
- `radiusf_initialized` - App initialization flag

### Sample Data
The application comes pre-loaded with:
- 5 user accounts (1 admin, 2 counselors, 2 employees)
- 12 student profiles with realistic data
- 10 university partnerships
- 3 sample applications with progress tracking
- 10 employee records across different departments

## Customization

### Adding New Universities
1. Navigate to Universities page
2. Click "Add University" button
3. Fill in university details
4. Data is automatically saved to localStorage

### Managing Students
1. Go to Students page
2. Add, edit, or delete student profiles
3. Assign counselors to students
4. Track student progress through application stages

### Role Management
User roles are defined in the AuthContext and control:
- Page access permissions
- Feature availability
- Data visibility

## Deployment

This is a static React application that can be deployed to:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Use GitHub Actions for deployment
- **AWS S3**: Upload the build files to an S3 bucket
- **Any static hosting service**

### Environment Considerations
- No backend server required
- Data persists only in the user's browser
- Clear browser data will reset the application
- Consider data export/import for production use

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Create an issue in the repository
- Email: support@radiusf.com
- Documentation: Check the inline code comments

## Future Enhancements

- Data import/export functionality
- Advanced filtering and search
- Email integration
- Document management
- Calendar integration
- Multi-language support
- Dark mode theme
- Mobile application

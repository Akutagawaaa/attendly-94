
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Layout from "./components/layout/Layout";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create AWS Database configuration component
const DatabaseConfig = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="w-full max-w-lg p-8 border rounded-lg bg-card shadow-lg">
        <h1 className="text-2xl font-bold mb-6">AWS RDS Database Configuration</h1>
        
        <div className="prose prose-sm max-w-none mb-8">
          <p>To connect your Attendly application to an AWS RDS database, follow these steps:</p>
          
          <h3 className="text-base font-medium mt-4">1. Database Connection Setup</h3>
          <p>Create a database configuration file (avoiding exposing credentials in your code):</p>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
            {`// src/config/database.ts
export const dbConfig = {
  host: process.env.DB_HOST || "your-aws-rds-endpoint.region.rds.amazonaws.com",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "attendly_db",
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "your_password"
}`}
          </pre>
          
          <h3 className="text-base font-medium mt-4">2. Install Required Packages</h3>
          <p>Install database packages (for example, using PostgreSQL):</p>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
            {`npm install pg pg-hstore sequelize dotenv`}
          </pre>
          
          <h3 className="text-base font-medium mt-4">3. Initialize Database Connection</h3>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
            {`// src/lib/database.ts
import { Sequelize } from 'sequelize';
import { dbConfig } from '../config/database';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;`}
          </pre>
          
          <h3 className="text-base font-medium mt-4">4. Create Models</h3>
          <p>Define your database models (e.g., User, Attendance, etc.):</p>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
            {`// src/models/database/User.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../lib/database';

class User extends Model {
  // Add your model methods here
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    // Add other fields
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;`}
          </pre>
          
          <h3 className="text-base font-medium mt-4">5. Initialize Database</h3>
          <p>Create a function to initialize the database and sync models:</p>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
            {`// src/lib/initDatabase.ts
import sequelize from './database';
import User from '../models/database/User';
// Import other models

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync all models
    await sequelize.sync();
    console.log('Database synchronized.');
    
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};`}
          </pre>
          
          <h3 className="text-base font-medium mt-4">6. Integrate in Your Application</h3>
          <p>Initialize the database when your application starts:</p>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
            {`// in your app entry point
import { initDatabase } from './lib/initDatabase';

const startApp = async () => {
  const dbInitialized = await initDatabase();
  if (!dbInitialized) {
    console.error('Failed to initialize database');
    // Handle error appropriately
  }
  
  // Continue with app initialization
};

startApp();`}
          </pre>
          
          <h3 className="text-base font-medium mt-4">7. Environment Variables</h3>
          <p>Set up your AWS RDS credentials as environment variables:</p>
          <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
            {`# .env file
DB_HOST=your-aws-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=attendly_db
DB_USER=admin
DB_PASSWORD=your_strong_password`}
          </pre>
          
          <p className="mt-4">
            <strong>Important:</strong> Never commit your .env file or database credentials to version control.
            For production, use a secure secrets management solution.
          </p>
        </div>
        
        <a href="/" className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          Return to Application
        </a>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/db-config" element={<DatabaseConfig />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

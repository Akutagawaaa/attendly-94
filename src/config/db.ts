
import { Pool } from 'pg';
import { DatabaseConfig } from '../models/types';

export const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "your-aws-rds-endpoint.region.rds.amazonaws.com",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "attendly_db",
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "your_password"
};

export const db = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.username,
  password: dbConfig.password,
  ssl: {
    rejectUnauthorized: false // Needed for AWS RDS connections in some environments
  }
});

// Test the connection
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully');
  }
});

export const isConfigured = (): boolean => {
  return (
    dbConfig.host !== "your-aws-rds-endpoint.region.rds.amazonaws.com" &&
    dbConfig.password !== "your_password"
  );
};

export async function initializeDatabase() {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        employee_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee', 'hr', 'manager')),
        department VARCHAR(100) NOT NULL,
        designation VARCHAR(100),
        status VARCHAR(20) DEFAULT 'offline',
        address VARCHAR(255),
        phone VARCHAR(20),
        avatar_url TEXT,
        organization_logo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Attendance records
    await db.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        check_in TIMESTAMP,
        check_out TIMESTAMP,
        total_hours INTERVAL,
        weekly_goal INTEGER DEFAULT 40,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Leave requests
    await db.query(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        leave_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Payroll records
    await db.query(`
      CREATE TABLE IF NOT EXISTS payroll (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        month VARCHAR(10) NOT NULL,
        year INTEGER NOT NULL,
        base_salary NUMERIC(10,2) NOT NULL,
        overtime_pay NUMERIC(10,2) DEFAULT 0,
        bonus NUMERIC(10,2) DEFAULT 0,
        deductions NUMERIC(10,2) DEFAULT 0,
        net_salary NUMERIC(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'processed', 'paid')),
        processed_date TIMESTAMP,
        payment_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Overtime records
    await db.query(`
      CREATE TABLE IF NOT EXISTS overtime (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        hours NUMERIC(5,2) NOT NULL,
        rate NUMERIC(10,2) NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        approved_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Activity logs
    await db.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        employee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Registration codes
    await db.query(`
      CREATE TABLE IF NOT EXISTS registration_codes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        expiry_date TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Password reset tokens
    await db.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        token VARCHAR(100) UNIQUE NOT NULL,
        expiry_date TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for frequently accessed columns
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
      CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
      CREATE INDEX IF NOT EXISTS idx_leave_employee_id ON leave_requests(employee_id);
      CREATE INDEX IF NOT EXISTS idx_leave_status ON leave_requests(status);
      CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON payroll(employee_id);
      CREATE INDEX IF NOT EXISTS idx_overtime_employee_id ON overtime(employee_id);
      CREATE INDEX IF NOT EXISTS idx_activity_employee_id ON activity_logs(employee_id);
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  }
}

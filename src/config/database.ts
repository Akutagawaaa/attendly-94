
/**
 * AWS RDS Database Configuration
 * 
 * This file should be kept secure and not committed to version control with actual credentials.
 * For production, use environment variables or a secrets management solution.
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "your-aws-rds-endpoint.region.rds.amazonaws.com",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "attendly_db",
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "your_password"
};

export const isConfigured = (): boolean => {
  return (
    dbConfig.host !== "your-aws-rds-endpoint.region.rds.amazonaws.com" &&
    dbConfig.password !== "your_password"
  );
};

/**
 * Instructions for connecting to AWS RDS:
 * 
 * 1. Replace the placeholder values above with your actual AWS RDS credentials
 * 2. Install required packages: npm install pg pg-hstore sequelize
 * 3. Create a database connection file
 * 4. Set up your models using Sequelize
 * 5. Initialize the database connection in your app
 * 
 * See the DatabaseConfig page in the app for more detailed instructions.
 */

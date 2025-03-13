
import { User, EmployeeRegistration } from "../models/types";

export const userService = {
  async login(email: string, password: string): Promise<User | null> {
    const storedUsers = localStorage.getItem("mockUsers");
    if (!storedUsers) return null;
    
    const users: User[] = JSON.parse(storedUsers);
    const user = users.find(user => user.email === email && user.password === password);
    
    return user || null;
  },
  
  async logout(): Promise<void> {
    return Promise.resolve();
  },
  
  async getUser(id: number): Promise<User | null> {
    const storedUsers = localStorage.getItem("mockUsers");
    if (!storedUsers) return null;
    
    const users: User[] = JSON.parse(storedUsers);
    const user = users.find(user => user.id === id);
    
    return user || null;
  },
  
  async getEmployeeById(id: number): Promise<User | null> {
    const storedUsers = localStorage.getItem("mockUsers");
    if (!storedUsers) return null;
    
    const users: User[] = JSON.parse(storedUsers);
    const employee = users.find(user => user.id === id);
    
    return employee || null;
  },
  
  async getAllEmployees(): Promise<User[]> {
    const storedUsers = localStorage.getItem("mockUsers");
    return storedUsers ? JSON.parse(storedUsers) : [];
  },
  
  async registerEmployee(data: EmployeeRegistration): Promise<User> {
    const storedUsers = localStorage.getItem("mockUsers");
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const emailExists = users.some((user: any) => user.email === data.email);
    if (emailExists) {
      throw new Error("Email already registered");
    }
    
    // Generate a unique employee ID (format: AT-YYYY-XXXX)
    const generateEmployeeId = () => {
      const year = new Date().getFullYear();
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      return `AT-${year}-${randomPart}`;
    };
    
    const newUser: User = {
      id: Math.floor(Math.random() * 10000) + 10,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      department: data.department,
      designation: data.designation,
      employeeId: generateEmployeeId(),
      avatarUrl: data.avatarUrl || "",
    };
    
    users.push(newUser);
    localStorage.setItem("mockUsers", JSON.stringify(users));
    
    return newUser;
  }
};

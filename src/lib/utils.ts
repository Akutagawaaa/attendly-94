
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatTime(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatTimeWithZone(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
}

export function formatDate(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export function getDuration(start: Date | string, end: Date | string): string {
  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);
  
  const durationMs = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  
  return `${hours}h ${minutes}m`;
}

export function exportToCSV(data: any[], filename: string): void {
  const csvRows: string[] = [];
  
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function createMockEmployees() {
  return [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "employee", department: "Engineering" },
    { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "employee", department: "Design" },
    { id: 3, name: "Michael Rodriguez", email: "michael@example.com", role: "employee", department: "Marketing" },
    { id: 4, name: "Emma Williams", email: "emma@example.com", role: "admin", department: "HR" },
    { id: 5, name: "David Kim", email: "david@example.com", role: "employee", department: "Engineering" },
  ];
}

export function createMockAttendance() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  
  return [
    {
      id: 1,
      employeeId: 1,
      date: formatDate(today),
      checkIn: new Date(today.setHours(9, 0, 0, 0)),
      checkOut: new Date(today.setHours(17, 30, 0, 0)),
    },
    {
      id: 2,
      employeeId: 2,
      date: formatDate(today),
      checkIn: new Date(today.setHours(8, 45, 0, 0)),
      checkOut: new Date(today.setHours(16, 50, 0, 0)),
    },
    {
      id: 3,
      employeeId: 3,
      date: formatDate(today),
      checkIn: new Date(today.setHours(9, 15, 0, 0)),
      checkOut: null,
    },
    {
      id: 4,
      employeeId: 1,
      date: formatDate(yesterday),
      checkIn: new Date(yesterday.setHours(8, 50, 0, 0)),
      checkOut: new Date(yesterday.setHours(17, 10, 0, 0)),
    },
    {
      id: 5,
      employeeId: 2,
      date: formatDate(yesterday),
      checkIn: new Date(yesterday.setHours(9, 5, 0, 0)),
      checkOut: new Date(yesterday.setHours(18, 0, 0, 0)),
    },
  ];
}

// Function to generate registration code for new employees
export function generateRegistrationCode(): string {
  // Generate a random 8-character alphanumeric code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

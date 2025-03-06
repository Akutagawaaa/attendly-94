
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export function getDuration(start: Date, end: Date): string {
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  
  return `${hours}h ${minutes}m`;
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

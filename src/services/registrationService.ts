
import { RegistrationCode } from "../models/types";

export const registrationService = {
  async createRegistrationCode(code: string, expiryDays: number): Promise<RegistrationCode> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    const registrationCode: RegistrationCode = {
      code,
      expiryDate,
      isUsed: false
    };
    
    const storedCodes = localStorage.getItem("mockRegistrationCodes");
    const codes = storedCodes ? JSON.parse(storedCodes) : [];
    codes.push(registrationCode);
    localStorage.setItem("mockRegistrationCodes", JSON.stringify(codes));
    
    return registrationCode;
  },
  
  async validateRegistrationCode(code: string): Promise<boolean> {
    const storedCodes = localStorage.getItem("mockRegistrationCodes");
    if (!storedCodes) return false;
    
    const codes: RegistrationCode[] = JSON.parse(storedCodes);
    const registrationCode = codes.find(c => c.code === code);
    
    if (!registrationCode) return false;
    if (registrationCode.isUsed) return false;
    
    const expiryDate = new Date(registrationCode.expiryDate);
    if (expiryDate < new Date()) return false;
    
    return true;
  }
};

import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminTabs from "@/components/admin/AdminTabs";
import OrganizationLogo from "@/components/admin/OrganizationLogo";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [user, isAdmin, navigate]);
  
  if (!user || !isAdmin) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage employees, attendance, and system settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            {/* Admin statistics could go here */}
          </div>
          <div className="md:col-span-1">
            <OrganizationLogo />
          </div>
        </div>
        
        <AdminTabs />
      </div>
    </Layout>
  );
}

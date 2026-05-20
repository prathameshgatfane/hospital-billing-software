import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  BarChart3,
  Settings,
  FileText,
  CreditCard,
  Database,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  UserCog,
  Building,
  Activity,
  Globe,
  Mail,
  Bell,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    icon: Users,
    submenu: [
      { name: "All Users", path: "/admin/users" },
      { name: "Admins", path: "/admin/users/admins" },
      { name: "Sub-Admins", path: "/admin/users/subadmins" },
      { name: "Active Users", path: "/admin/users/active" },
      { name: "Banned Users", path: "/admin/users/banned" },
    ],
  },
  {
    title: "OPD Management",
    icon: FileText,
    submenu: [
      { name: "Doctor Approval", path: "/admin/doctors/approval" },
      { name: "Pending Review", path: "/admin/content/pending" },
      { name: "Published", path: "/admin/content/published" },
      { name: "Rejected", path: "/admin/content/rejected" },
    ],
  },
  {
    title: "Analytics & Reports",
    icon: BarChart3,
    submenu: [
      { name: "Overview", path: "/admin/analytics" },
      { name: "User Analytics", path: "/admin/analytics/users" },
      { name: "Revenue Reports", path: "/admin/analytics/revenue" },
      { name: "Traffic Reports", path: "/admin/analytics/traffic" },
    ],
  },
  {
    title: "Financial",
    icon: CreditCard,
    submenu: [
      { name: "Transactions", path: "/admin/financial/transactions" },
      { name: "Subscriptions", path: "/admin/financial/subscriptions" },
      { name: "Invoices", path: "/admin/financial/invoices" },
      { name: "Refunds", path: "/admin/financial/refunds" },
    ],
  },
  {
    title: "System",
    icon: Settings,
    submenu: [
      { name: "General Settings", path: "/admin/settings/general" },
      { name: "Security", path: "/admin/settings/security" },
      { name: "API Keys", path: "/admin/settings/api" },
      { name: "Backup & Restore", path: "/admin/settings/backup" },
    ],
  },
  {
    title: "Support",
    icon: HelpCircle,
    submenu: [
      { name: "Tickets", path: "/admin/support/tickets" },
      { name: "FAQs", path: "/admin/support/faqs" },
      { name: "Contact Messages", path: "/admin/support/contacts" },
    ],
  },
];

const AdminSidebar = () => {
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleItem = (title) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 hidden md:flex flex-col">
      
      {/* Brand/Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AdminPanel</h1>
            <p className="text-xs text-gray-400">Super Admin Access</p>
          </div>
        </div>
      </div>

      {/* Quick Stats (Optional) */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-xs text-gray-400 mb-2">SYSTEM STATUS</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">All Systems</span>
          </div>
          <span className="text-xs px-2 py-1 bg-green-900 text-green-300 rounded">Online</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.includes(item.title);
            const hasSubmenu = item.submenu;

            return (
              <div key={item.title} className="mb-1">
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleItem(item.title)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-gray-700 ${
                        isExpanded ? "bg-gray-700" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{item.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <NavLink
                            key={subItem.name}
                            to={subItem.path}
                            end
                            className={({ isActive }) =>
                              `flex items-center px-4 py-2 rounded-lg text-sm transition-all
                               ${
                                 isActive
                                   ? "bg-blue-900 text-blue-100"
                                   : "text-gray-400 hover:text-white hover:bg-gray-700"
                               }`
                            }
                          >
                            <span className="w-1 h-1 bg-gray-500 rounded-full mr-3"></span>
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                       ${
                         isActive
                           ? "bg-blue-600 text-white"
                           : "hover:bg-gray-700 hover:text-white"
                       }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.title}</span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <UserCog size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Last login: Today, 14:30</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} AdminPanel v2.1
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Secure Admin Access
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
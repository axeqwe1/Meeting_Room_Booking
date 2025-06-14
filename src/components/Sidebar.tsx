import React, { useState } from "react";
import {
  Calendar,
  LayoutGrid,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Settings,
  DoorOpen,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { SignOut } from "../api/Auth";
import { all } from "axios";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Navigation items config
  const navItems = [
    {
      icon: Calendar,
      label: "Calendar",
      path: "/dashboard",
      action: () => navigate("/dashboard"),
    },
    {
      icon: DoorOpen,
      label: "RoomAvaliable",
      path: "/roomavaliable",
      action: () => navigate("/roomavaliable"),
    },
    {
      icon: LayoutGrid,
      label: "Rooms",
      path: "/rooms",
      action: () => navigate("/rooms"),
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      action: () => navigate("/settings"),
    },
  ];

  return (
    <aside
      className={`md:relative md:block hidden z-20 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* เปลี่ยนจาก flex-col เป็น grid และกำหนดพื้นที่ให้ชัดเจน */}
      <div className="h-full grid grid-rows-[auto_9fr_1fr_auto]">
        {/* Collapse Toggle (แถวที่ 1) */}
        <div className="p-4 flex justify-end">
          <button
            className="hover:cursor-pointer p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* New Booking Button (แถวที่ 2) */}
        {/* {!collapsed && (
          <div className="p-4 border-b border-gray-200">
            <button 
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => navigate('/new-booking')}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              <span>New Booking</span>
            </button>
          </div>
        )} */}

        {/* Navigation (แถวที่ 3 - ยืดหยุ่น) */}
        <nav className="px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (
              user?.department != null &&
              user.department !== "IT" &&
              user.department !== "HR" &&
              item.label === "Rooms"
            ) {
              return null;
            }
            return (
              <NavLink
                key={item.label}
                to={item.path}
                // onClick={(e) => {
                //   e.preventDefault();
                //   item.action();
                // }}
                className={`flex items-center px-4 py-2 rounded-md group ${
                  isActive(item.path)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-100"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive(item.path) ? "text-blue-500" : "text-gray-500"
                  } ${collapsed ? "mr-0" : "mr-3"}`}
                />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout (แถวที่ 4 - ติดล่าง) */}
        <div className=" bottom-0 p-4 border-t border-gray-200">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            className={`flex items-center ${
              collapsed ? "justify-center" : ""
            } px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md`}
          >
            <LogOut className="h-5 w-5 text-red-600" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

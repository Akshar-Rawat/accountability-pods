import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut, Settings, User } from "lucide-react";

import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/DropdownMenu";

import useAuthStore from "../../stores/authStore";

const Navbar = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "My Pods",
      path: "/pods",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed z-50 h-16 w-full border-b border-outline bg-surface-dim">
      <div className="mx-auto flex h-full w-full max-w-container items-center justify-between px-4">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center"
          aria-label="Accountability Pods home"
        >
          <img
            src="../../../logo/logo.png"
            alt="Accountability Pods"
            className="h-16 w-24 object-contain"
          />
        </NavLink>

        {/* Navigation */}
        <ul className="flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "rounded-md bg-surface-container-low px-3 py-2 text-on-surface"
                    : "rounded-md px-3 py-2 text-on-surface-variant hover:text-on-surface"
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button
            type="button"
            variant="ghost"
            className="size-12 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            aria-label="Notifications"
          >
          <Bell size={22} strokeWidth={1.8} />
          </Button>

          {/* Profile */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={() => setProfileOpen((previous) => !previous)}
                aria-label="Open profile menu"
              >
                <Avatar src={user.avatar} alt={user.username} />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
              >
                <DropdownMenuItem
                  icon={User}
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  icon={Settings}
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/settings");
                  }}
                >
                  Settings
                </DropdownMenuItem>

                <DropdownMenuItem icon={LogOut} onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

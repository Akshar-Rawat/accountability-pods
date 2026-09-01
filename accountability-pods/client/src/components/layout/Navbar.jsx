import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const [profileOpen, setProfileOpen] = useState(false);

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
        <NavLink to="/" className="flex items-center" aria-label="Accountability Pods home">
          <img
            src="../../../logo/logo.png"
            alt="Accountability Pods"
            className="h-16 w-24 object-contain"
          />
        </NavLink>

        {/* Navigation — only show My Pods when logged in */}
        <ul className="flex items-center gap-6">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "rounded-md bg-surface-container-low px-3 py-2 text-body-sm text-on-surface"
                  : "rounded-md px-3 py-2 text-body-sm text-on-surface-variant hover:text-on-surface"
              }
            >
              Home
            </NavLink>
          </li>

          {isAuthenticated && (
            <li>
              <NavLink
                to="/pods"
                className={({ isActive }) =>
                  isActive
                    ? "font-bold border-b-2 border-secondary px-3 py-2 text-body-sm text-secondary"
                    : "px-3 py-2 text-body-sm text-on-surface-variant hover:text-on-surface"
                }
              >
                My Pods
              </NavLink>
            </li>
          )}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Button
                type="button"
                variant="ghost"
                className="size-10 rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                aria-label="Notifications"
              >
                <Bell size={18} strokeWidth={1.8} />
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-label="Open profile menu"
                >
                  <Avatar src={user?.avatar} alt={user?.username} />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  open={profileOpen}
                  onClose={() => setProfileOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-outline-variant">
                    <p className="text-body-sm font-semibold text-primary">{user?.username}</p>
                    <p className="text-label-caps text-on-surface-variant">{user?.email}</p>
                  </div>

                  <DropdownMenuItem
                    icon={LogOut}
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-body-sm text-on-surface-variant hover:text-on-surface"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary px-4 py-2 text-body-sm font-semibold text-on-primary hover:bg-primary-container"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

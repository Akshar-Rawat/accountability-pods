import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Bell, LogOut,Settings,User } from "lucide-react";
import BrandMark from "../BrandMark";

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
    <nav className="fixed z-50 h-16 w-full border-b border-outline-variant/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-container items-center justify-between px-5 md:px-16">

        <NavLink to="/" className="flex items-center" aria-label="Pact home">
          <BrandMark />
        </NavLink>

        <ul className="flex items-center gap-0 md:gap-2">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "rounded-full bg-surface-container-high px-2 py-2 text-body-sm text-on-surface md:px-3"
                  : "rounded-full px-2 py-2 text-body-sm text-on-surface-variant hover:text-on-surface md:px-3"
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
                    ? "rounded-full bg-surface-container-high px-2 py-2 font-semibold text-body-sm text-on-secondary-container md:px-3"
                    : "rounded-full px-2 py-2 text-body-sm text-on-surface-variant hover:text-on-surface md:px-3"
                }
              >
                My Pacts
              </NavLink>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/notifications")}
                size={18}
                className="size-10 rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                aria-label="Notifications"
              >
                <Bell  strokeWidth={1.8} />
              </Button>

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
                  <DropdownMenuItem icon={User} onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem icon={Settings} onClick={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full px-3 py-2 text-body-sm text-on-surface-variant hover:text-on-surface"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-primary px-4 py-2 text-body-sm font-medium text-on-primary transition-transform hover:scale-[1.02]"
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

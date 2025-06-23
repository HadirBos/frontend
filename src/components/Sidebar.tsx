import { useNavigate, useLocation } from "react-router";
import {
  Home,
  Users,
  FileText,
  Menu,
  LogOut,
  ClipboardList,
  DollarSign,
  ChevronLeft,
} from "lucide-react";
import { useEffect } from "react";

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
};

const SidebarItem = ({
  icon,
  text,
  active,
  collapsed,
  onClick,
}: SidebarItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center mx-3 mb-1 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 ease-in-out ${
        active
          ? "bg-indigo-800 text-white shadow-lg shadow-indigo-900/50 scale-[1.02]"
          : "text-indigo-100 hover:bg-indigo-800/70 hover:text-white hover:scale-[1.01]"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <div
        className={`flex-shrink-0 transition-transform duration-200 ${
          active ? "scale-110" : "group-hover:scale-105"
        } ${collapsed ? "" : "mr-4"}`}
      >
        {icon}
      </div>
      {!collapsed && (
        <span className="font-medium text-sm tracking-wide transition-all duration-200">
          {text}
        </span>
      )}

      {/* Active indicator */}
      {active && !collapsed && (
        <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-indigo-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-indigo-700">
          {text}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-indigo-800 rotate-45 border-l border-b border-indigo-700"></div>
        </div>
      )}
    </div>
  );
};

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  logoutHandler: () => void;
};

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  logoutHandler,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handlePageChange = (path: string) => {
    navigate(path);

    // Close sidebar on smaller screens
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  const menuItems = [
    {
      icon: <Home size={20} />,
      text: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <Users size={20} />,
      text: "Attendance",
      path: "/admin/attendance",
    },
    {
      icon: <ClipboardList size={20} />,
      text: "Submissions",
      path: "/admin/submissions",
    },
    {
      icon: <DollarSign size={20} />,
      text: "Payroll",
      path: "/admin/payroll",
    },
    {
      icon: <FileText size={20} />,
      text: "Reports",
      path: "/admin/reports",
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`bg-indigo-900 text-white transition-all duration-300 ease-in-out fixed top-0 left-0 h-full z-50 shadow-2xl ${
          sidebarOpen ? "w-72" : "w-20"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/20 via-transparent to-indigo-950/30 pointer-events-none" />

        {/* Header */}
        <div className="relative p-6 border-b border-indigo-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {sidebarOpen ? (
                <div className="p-2.5 bg-indigo-900 rounded-xl shadow-lg ring-2 ring-indigo-700/50 transition-transform duration-200 hover:scale-105">
                  <img
                    src="/p.png"
                    alt="Logo"
                    className="h-7 w-7 object-contain"
                  />{" "}
                </div>
              ) : null}
              {sidebarOpen && (
                <div className="transition-all duration-300 ease-in-out">
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    AdminPanel
                  </h2>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto p-2 rounded-xl hover:bg-indigo-800/70 transition-all duration-1000 group ring-1 ring-indigo-800/50 hover:ring-indigo-700"
            >
              {sidebarOpen ? (
                <ChevronLeft
                  size={20}
                  className="group-hover:scale-110 transition-transform text-indigo-200"
                />
              ) : (
                <Menu
                  size={20}
                  className="group-hover:scale-110 transition-transform text-indigo-200"
                />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div
          // className={`relative flex-1 py-6 ${
          //   sidebarOpen ? "overflow-y-auto" : "overflow-visible"
          // }`}
          className="relative flex-1 py-6"
        >
          <nav className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <div
                key={item.path}
                className="animate-in slide-in-from-left duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SidebarItem
                  icon={item.icon}
                  text={item.text}
                  active={isActive(item.path)}
                  collapsed={!sidebarOpen}
                  onClick={() => handlePageChange(item.path)}
                />
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="relative p-3 border-t border-indigo-700">
          <div className="mb-4 mt-4">
            <SidebarItem
              icon={<LogOut size={20} />}
              text="Logout"
              active={false}
              collapsed={!sidebarOpen}
              onClick={logoutHandler}
            />
          </div>

          {/* {sidebarOpen && (
            <div className="p-4 bg-indigo-800/30 rounded-xl border border-indigo-700/50 backdrop-blur-sm transition-all duration-300 hover:bg-indigo-800/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center ring-2 ring-indigo-600/50 shadow-lg">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    Admin User
                  </p>
                  <p className="text-xs text-indigo-300 truncate">
                    admin@company.com
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
              </div>
            </div>
          )} */}
        </div>

        {/* Decorative elements */}
        {/* <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-700 to-transparent opacity-60" />
        <div
          className={`absolute top-1/2 -right-1 w-2 h-12 bg-indigo-700 rounded-r-full transform -translate-y-1/2 transition-all duration-300 shadow-lg ${
            isHovered ? "opacity-100 scale-110" : "opacity-0"
          }`}
        /> */}

        {/* Subtle glow effect */}
        {/* <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-32 bg-indigo-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
      </div>
    </>
  );
};

export default Sidebar;

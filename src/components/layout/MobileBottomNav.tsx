import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  Bot, 
  User, 
  Menu 
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ROLE_REDIRECT } from "../../utils/roleRedirect";
import { useAuthStore } from "../../store/useAuthStore";

interface MobileBottomNavProps {
  onMenuClick: () => void;
  onAIChatClick: () => void;
  onSearchClick: () => void;
}

const MobileBottomNav = ({ onMenuClick, onAIChatClick, onSearchClick }: MobileBottomNavProps) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  const dashboardHome = ROLE_REDIRECT[user.role_name] ?? "/dashboard";

  const navItems = [
    {
      label: "Home",
      path: dashboardHome,
      icon: <Home size={22} />,
      type: "link"
    },
    {
      label: "Search",
      icon: <Search size={22} />,
      onClick: onSearchClick,
      type: "button"
    },
    {
      label: "AI Chat",
      icon: <Bot size={22} />,
      onClick: onAIChatClick,
      type: "button",
      highlight: true
    },
    {
      label: "Profile",
      path: "/dashboard/profile",
      icon: <User size={22} />,
      type: "link"
    },
    {
      label: "More",
      icon: <Menu size={22} />,
      onClick: onMenuClick,
      type: "button"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200 lg:hidden px-4 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item, index) => {
          const isActive = item.type === "link" && location.pathname === item.path;
          
          if (item.type === "link") {
            return (
              <NavLink
                key={index}
                to={item.path!}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                    isActive 
                      ? "text-primary-600 font-bold" 
                      : "text-slate-500 hover:text-slate-900 active:scale-95"
                  )
                }
              >
                <div className={cn(
                  "p-1 rounded-lg transition-colors",
                  isActive ? "bg-primary-50" : "bg-transparent"
                )}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-medium uppercase tracking-tight">{item.label}</span>
              </NavLink>
            );
          }

          return (
            <button
              key={index}
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                item.highlight 
                  ? "text-primary-600" 
                  : "text-slate-500 hover:text-slate-900 active:scale-95"
              )}
            >
              <div className={cn(
                "p-1 rounded-lg transition-colors",
                item.highlight ? "bg-primary-100/50 shadow-sm" : "bg-transparent"
              )}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

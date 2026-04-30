import assets from "../assets/assets";
import { House,ClipboardList,Briefcase,Hotel, CarFront, Settings, UtensilsCrossed } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigationGroups = [
    {
      title: "",
      items: [{ label: "Dashboard", path: "/", active: location.pathname === "/", icon: House }],
    },
    {
      title: "Packages",
      items: [
        { label: "Packages", path: "/packages", icon: Briefcase }
      ],
    },
    {
      title: "Master Data",
      items: [
        { label: "Hotels", path: "/hotels", active: location.pathname === "/hotels", icon: Hotel },
        { label: "Transfers", path: "/transfers", active: location.pathname === "/transfers", icon: CarFront },
        { label: "Sightseeing", path: "/sightseeing", active: location.pathname === "/sightseeing", icon: Settings },
        { label: "Meals", path: "/meals", active: location.pathname === "/meals", icon: UtensilsCrossed },
      ],
    },
  ];
  return (
    <aside className="sticky top-0 flex h-screen w-full max-w-[240px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-[12px_0_40px_rgba(102,112,133,0.06)]">
      <div className="max-w-[180px] px-2 pb-8 w-full">
        <img
          src={assets.brandlogo}
          alt="TripCraft"
          className="h-auto w-full"
        />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-hidden pr-1">
        {navigationGroups.map((group) => (
          <div key={group.title || "main"}>
            {group.title && (
              <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                {group.title}
              </p>
            )}
            <div className="mb-8">
              {group.items.map((item) => {
                const isActive = item.active ?? location.pathname === item.path;
                return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 group ${isActive
                    ? "bg-violet-50 text-violet-600 shadow-[0_10px_25px_rgba(99,102,241,0.08)]"
                    : " hover:bg-violet-50 hover:text-violet-600"
                    }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white  hover:text-violet-600 ${isActive ? "bg-white text-violet-600" : "text-slate-500"
                      }`}
                  >
                    <item.icon size={16} className="group-hover:text-violet-600"/>
                  </span>
                  <span className="text-[15px] font-medium">{item.label}</span>
                </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

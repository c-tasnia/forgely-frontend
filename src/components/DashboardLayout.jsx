import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const userLinks = [
  { label: "Overview", to: "/dashboard", end: true },
  { label: "My Projects", to: "/dashboard/projects" },
  { label: "Tasks", to: "/dashboard/tasks" },
  { label: "Profile", to: "/dashboard/profile" },
];

const adminLinks = [
  { label: "Overview", to: "/dashboard", end: true },
  { label: "Manage Users", to: "/dashboard/admin/users" },
  { label: "Manage Projects", to: "/dashboard/admin/projects" },
  { label: "Analytics", to: "/dashboard/admin/analytics" },
  { label: "Reports", to: "/dashboard/admin/reports" },
  { label: "Settings", to: "/dashboard/settings" },
];

const DashboardLayout = () => {
  const { user } = useAuth();
  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="card sticky top-20 space-y-1 p-3">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

import AdminDashboard from "../components/admin/AdminDashboard";
import AuthPage from "../components/auth/AuthPage";
import ConversionsPage from "../components/common/users/conversions/ConversionsPage";
import UserDashboard from "../components/common/users/UserDashboard";

const routes = [
  {
    path: "",
    component: UserDashboard,
    name: "User Dashboard",
    protected: true,
  },
  {
    path: "/admin",
    component: AdminDashboard,
    name: "Admin Dashboard",
    protected: true,
    adminOnly: true,
  },
  {
    path: "/conversions",
    component: ConversionsPage,
    name: "Conversions Page",
    protected: true,
  },
  {
    path: "/login",
    component: AuthPage,
    name: "Login Screen",
    protected: false,
  },
];

export default routes;

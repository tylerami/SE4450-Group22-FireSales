import AdminDashboard from "../components/admin/AdminDashboard";
import AuthPage from "../components/auth/AuthPage";
import ConversionsPage from "../components/users/conversions/ConversionsPage";
import UserDashboard from "../components/users/UserDashboard";

const routes = [
  {
    path: "",
    component: UserDashboard,
    name: "Home Page",
    protected: true,
  },
  {
    path: "/admin",
    component: AdminDashboard,
    name: "Home Page",
    protected: true,
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

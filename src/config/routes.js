import AdminDashboard from "../components/admin/AdminDashboard";
import AuthPage from "../components/auth/AuthPage";
import RecordConversionsPage from "../components/users/conversions/RecordConversionsPage";
import UserDashboard from "../components/users/UserDashboard";

const routes = [
  {
    path: "",
    component: AdminDashboard,
    name: "Home Page",
    protected: true,
  },
  {
    path: "/conversions",
    component: RecordConversionsPage,
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

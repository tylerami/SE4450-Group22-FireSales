import AdminHome from "../screens/admin/AdminHome";
import AuthPage from "../screens/auth/AuthPage";
import RecordConversionsPage from "../components/users/conversions/RecordConversionsPage";
import UserDashboard from "../screens/user/UserDashboard";

const routes = [
  {
    path: "",
    component: UserDashboard,
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

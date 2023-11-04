import AdminHome from "../screens/AdminHome";
import AuthPage from "../screens/AuthPage";

const routes = [
  {
    path: "",
    component: AdminHome,
    name: "Home Page",
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

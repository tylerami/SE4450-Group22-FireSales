import AdminHome from "../screens/AdminHome.tsx";
import Login from "../screens/Login.tsx";

const routes = [
  {
    path: "",
    component: AdminHome,
    name: "Home Page",
    protected: true,
  },
  {
    path: "/login",
    component: Login,
    name: "Login Screen",
    protected: false,
  },
];

export default routes;

import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "config/firebase";
import { UserContext } from "./UserProvider";

const AuthChecker = ({
  children,
  adminOnly = false,
}: {
  children: any;
  adminOnly?: boolean;
}) => {
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
    if (adminOnly && currentUser && !currentUser.isAdmin()) {
      navigate("/");
    }
  });

  return <>{children}</>;
};

export default AuthChecker;

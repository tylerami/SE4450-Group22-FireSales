import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";

const AuthChecker = ({
  children,
  adminOnly = false,
}: {
  children: any;
  adminOnly?: boolean;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
    if (adminOnly && auth.currentUser) {
      // check if user is admin
      // if not admin, redirect to home
      navigate("/");
    }
  });

  return <>{children}</>;
};

export default AuthChecker;

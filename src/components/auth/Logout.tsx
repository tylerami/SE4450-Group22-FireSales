import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";

const Logout = ({ navigateTo = "/login" }) => {
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const logout = () => {
    setDisabled(true);
    signOut(auth)
      .then(() => {
        navigate(navigateTo);
      })
      .catch((error) => {
        console.error(error);
        setDisabled(false);
      });
  };

  return (
    <div>
      {/* <Button disabled={disabled} onClick={logout} style={{ color: "white" }}>
        Logout
      </Button> */}
    </div>
  );
};

export default Logout;

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import Center from "../utils/Center";

const RegistrationContainer = (props) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const register = () => {
    setDisabled(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setDisabled(false);
        console.info("TODO: navigate to authenticated screen");
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage(error.code + ": " + error.message);
        setDisabled(false);
      });
  };

  return (
    // <Box width={"40em"}>
    //   <Typography variant="h4" sx={{ mb: 2 }}>
    //     Register
    //   </Typography>
    //   <Typography sx={{ mt: 2 }} color={"red"}>
    //     {errorMessage}
    //   </Typography>
    //   <Box sx={{ mt: 2 }}>
    //     <TextField
    //       label="Full Name"
    //       variant="outlined"
    //       fullWidth
    //       value={fullName}
    //       onChange={(e) => setFullName(e.target.value)}
    //     />
    //   </Box>
    //   <Box sx={{ mt: 2 }}>
    //     <TextField
    //       label="Email"
    //       variant="outlined"
    //       fullWidth
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //   </Box>
    //   <Box sx={{ mt: 2 }}>
    //     <TextField
    //       label="Password"
    //       variant="outlined"
    //       fullWidth
    //       type="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //   </Box>
    //   <Box sx={{ mt: 2 }}>
    //     <TextField
    //       label="Birthdate"
    //       variant="outlined"
    //       fullWidth
    //       value={birthdate}
    //       onChange={(e) => setBirthdate(e.target.value)}
    //     />
    //   </Box>
    //   <Box sx={{ mt: 2 }}>
    //     <Button
    //       fullWidth
    //       variant="contained"
    //       disabled={disabled}
    //       onClick={register}
    //     >
    //       Register
    //     </Button>
    //   </Box>
    // </Box>
    <></>
  );
};

export default RegistrationContainer;

import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, Providers } from "../../config/firebase";
import Center from "../utils/Center";

const LoginContainer = (props) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithGoogle = () => {
    setDisabled(true);
    signInWithPopup(auth, Providers.google)
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

  const signInManually = () => {
    setDisabled(true);
    signInWithEmailAndPassword(auth, email, password)
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
    //     Login
    //   </Typography>
    //   <Typography sx={{ mt: 2 }} color={"red"}>
    //     {errorMessage}
    //   </Typography>
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
    //     <Button
    //       fullWidth
    //       variant="contained"
    //       disabled={disabled}
    //       onClick={signInManually}
    //     >
    //       Login
    //     </Button>
    //     <Box height={12} />
    //     <Button
    //       fullWidth
    //       startIcon={<GoogleIcon />}
    //       size="large"
    //       disabled={disabled}
    //       variant="contained"
    //       onClick={signInWithGoogle}
    //     >
    //       Sign In With Google
    //     </Button>
    //   </Box>
    // </Box>
  //);
};

export default LoginContainer;

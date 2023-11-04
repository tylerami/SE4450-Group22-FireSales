import React, { useEffect } from "react";
import SalesSubmissionForm from "../components/sales/SalesSubmissionForm";
// import { Box } from "@mui/material";
import NavigationBar from "../components/nav/navigationBar";

const Home = (props) => {
  useEffect(() => {}, []);

  return (
    //<Box width="100%">
    <>
      <NavigationBar username="tylerami" onLogout={() => {}}></NavigationBar>
      <SalesSubmissionForm />{" "}
    </>
    // </Box>
  );
};

export default Home;

import React, { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import SalesSubmissionForm from "../components/sales/SalesSubmissionForm";

const Home = (props) => {
  useEffect(() => {}, []);

  return (
    <Center>

      <SalesSubmissionForm/>

      <Logout />
    </Center>
  );
};

export default Home;

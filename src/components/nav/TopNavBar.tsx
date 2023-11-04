import React from "react";
import Logout from "../auth/Logout";
import { Flex, Heading } from "@chakra-ui/react";

type Props = {
  username: string;
  onLogout: () => void;
};

const TopNavBar = (props: Props) => {
  return <div>TopNavBar</div>;
};

export default TopNavBar;

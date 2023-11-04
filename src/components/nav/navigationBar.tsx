import React from "react";
import Logout from "../auth/Logout";

interface NavigationBarProps {
  username: string;
  onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  username,
  onLogout,
}) => {
  return (
    <></>
    // <RootDiv>
    //   {/* <AppBar position="static">
    //     <Toolbar>
    //       <TitleTypography variant="h6">FireSales</TitleTypography>
    //       <Typography variant="subtitle1">{username}</Typography>
    //       <IconButton color="inherit" onClick={onLogout}>
    //         <AccountCircle />
    //       </IconButton>
    //       <Box width={6} />
    //       <Logout />
    //     </Toolbar>
    //   </AppBar> */}
    // </RootDiv>
  );
};

export default NavigationBar;

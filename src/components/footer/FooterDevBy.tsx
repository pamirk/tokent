import React from "react";
import { Box, Typography } from "@material-ui/core";

import Coded from "@material-ui/icons/Code";
import Love from "@material-ui/icons/Favorite";

export default () => {
  return (
    <Box
      bgcolor="black.900"
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding={4}
      marginTop="auto"
    >
      <Box display="flex" margin={1}>
        <Coded color={"primary"} />
      </Box>
      <Typography color={"primary"}>with</Typography>
      <Box display="flex" margin={1}>
        <Love color={"secondary"}/>
      </Box>
      <Typography color={"primary"}>by PK</Typography>
    </Box>
  );
};

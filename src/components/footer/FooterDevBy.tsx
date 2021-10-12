import React from "react";
import { Box, Typography } from "@material-ui/core";

import Coded from "@material-ui/icons/Code";
import Love from "@material-ui/icons/Favorite";
import styled from "styled-components";

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
        <Coded style={{color: "#00cf9d"}} />
      </Box>
      <Typography color={"primary"}><Green>with</Green></Typography>
      <Box display="flex" margin={1}>
        <Love color={"secondary"}/>
      </Box>
      <Typography color={"primary"}><Green>by PK</Green></Typography>
    </Box>
  );
};

const Green = styled.span`
  color: #00cf9d;
`

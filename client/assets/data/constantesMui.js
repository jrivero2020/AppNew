import styled from "@mui/system/styled";

export { default as React } from "react";
export { default as Card } from "@mui/material/Card";
export { default as CardActionArea } from "@mui/material/CardActionArea";

export { default as Button } from "@mui/material/Button";
export { default as Typography } from "@mui/material/Typography";
export { default as CardContent } from "@mui/material/CardContent";
export { default as CardActions } from "@mui/material/CardActions";
export { default as CardMedia } from "@mui/material/CardMedia";
export { default as Box } from "@mui/material/Box";
export { default as Grid } from "@mui/material/Grid";

export const Item = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "#444d58" : "#ced7e0",
  padding: theme.spacing(1),
  borderRadius: "4px",
  textAlign: "center",
}));

import { CircularProgress as MuiCircularProgress, Box } from "@mui/material";

export default function CircularProgress() {
  return (
    <Box sx={{ position: "absolute", top: "50vh", right: "50vw" }}>
      <MuiCircularProgress />
    </Box>
  );
}

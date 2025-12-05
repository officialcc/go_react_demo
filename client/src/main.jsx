// main.jsx
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import App from "./App.jsx";

const queryClient = new QueryClient();

function Root() {
  const [mode, setMode] = useState("light");

  const theme = createTheme({
    palette: {
      mode, // 👈 switches between light and dark
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App mode={mode} setMode={setMode} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

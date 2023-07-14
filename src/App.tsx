import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Comments from "./pages/comments";
import { createTheme, ThemeProvider } from "@mui/material";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Comments />,
    },
  ]);
  const theme = createTheme({ direction: "rtl" });
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  return (
    <React.StrictMode>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </CacheProvider>
    </React.StrictMode>
  );
}

export default App;

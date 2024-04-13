import { useState } from "react";
import PayPal from "./Component/PayPal";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Cancel from "./Component/Cancel";
import Successful from "./Component/Successful";
function App() {
  const r = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/success",
      element: <Successful />,
    },
    {
      path: "/cancel",
      element: <Cancel />,
    },
  ]);

  return (
    <div className="App">
      <PayPalScriptProvider options={{ clientId: process.env.Client_ID }}>
        <RouterProvider router={r}></RouterProvider>
      </PayPalScriptProvider>
    </div>
  );
}

export default App;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserContextProvider } from "./context/userContext.tsx";
import { Toaster } from "sonner";
import Incidents from "./pages/Incidents/Incidents.tsx";
import { ManageApps } from "./pages/manageApps/ManageApps.tsx";
import { Login } from "./pages/login/Login.tsx";

const queryClient = new QueryClient();
// const navigate = useNavigate();

const router = createBrowserRouter([
  {
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    errorElement: <h1>Not Found</h1>,
    children: [
      {
        index: true,
        element: <Navigate to="/incidents" />,
      },
      {
        element: <Incidents />,
        path: "/incidents",
      },
      {
        element: <ManageApps />,
        path: "/manage-apps",
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <Toaster />
        <RouterProvider router={router} />
      </UserContextProvider>
    </QueryClientProvider>
  </StrictMode>
);

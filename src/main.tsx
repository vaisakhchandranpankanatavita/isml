import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ToastProvider } from "@/context/ToastContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <SettingsProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </SettingsProvider>
    </ToastProvider>
  </StrictMode>,
);

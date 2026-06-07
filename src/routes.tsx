import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <h1>Root</h1>,
      },
      {
        path: "/resultado/:id",
        element: <h1>Root</h1>,
      },
      {
        path: "/historico",
        element: <h1>Histórico de Simulações</h1>,
      },
    ],
  },
]);

import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
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

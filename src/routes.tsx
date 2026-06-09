import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import { SimulationFormPage } from "./pages/SimulationFormPage";
import { SimulationResultsPage } from "./pages/SimulationResultsPage";
import { SimulationHistory } from "./pages/SimulationHistory";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <SimulationFormPage />,
      },
      {
        path: "/resultado/:id",
        element: <SimulationResultsPage />,
      },
      {
        path: "/historico",
        element: <SimulationHistory />,
      },
    ],
  },
]);

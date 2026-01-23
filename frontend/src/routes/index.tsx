import { createBrowserRouter } from "react-router";

import NewProductPage from "../pages/NewProduct.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NewProductPage />,
  }
]);

export { router };
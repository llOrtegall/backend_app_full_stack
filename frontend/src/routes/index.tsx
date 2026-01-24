import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

const Layout = lazy(() => import("./Layout.tsx"));
const NewProductPage = lazy(() => import("../pages/NewProduct.tsx"));
const ProductsPage = lazy(() => import("../pages/Products.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense><Layout /></Suspense>,
    children: [
      {
        path: "/products",
        element: <Suspense><ProductsPage /></Suspense>,
      },
      {
        path: "/products/new",
        element: <Suspense><NewProductPage /></Suspense>,
      }
    ]
  }
]);

export { router };
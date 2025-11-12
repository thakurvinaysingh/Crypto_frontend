import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Landing from "../pages/Landing";
import Onboard from "../pages/Onboard";
import DashMain from "../pages/Dashboard/Main";
import Base from "../pages/Dashboard/Base";
import Team from "../pages/Dashboard/Team";
import Partners from "../pages/Dashboard/Team/Partners";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  // Public/auth shell
  {
    element: <AuthLayout />,             // <Outlet/> inside
    children: [
      { index: true, element: <Landing /> },          // "/"
      { path: "onboard", element: <Onboard /> },      // "/onboard"
    ],
  },

  // Dashboard shell
  {
    path: "/dashboard",
    element: <DashboardLayout />,        // <Outlet/> inside
    children: [
      { index: true, element: <DashMain /> },         // "/dashboard"
      { path: "base", element: <Base /> },            // "/dashboard/base"
      { path: "team", element: <Team /> },            // "/dashboard/team"
      { path: "partners", element: <Partners /> },            // "/dashboard/team"
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}



// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import AuthLayout from '../layouts/AuthLayout'
// import Onboard from "../pages/Onboard";
// import DashboardLayout from '../layouts/DashboardLayout'
// import Landing from '../pages/Landing'
// import DashMain from '../pages/Dashboard/Main'
// import Base from '../pages/Dashboard/Base'
// import Team from '../pages/Dashboard/Team'
// import NotFound from '../pages/NotFound'

// const router = createBrowserRouter([
//   { element: <AuthLayout/>, children: [{ path: '/', element: <Landing/> }]},
//   { element: <AuthLayout/>, children: [{ path: '/onboard', element: <Onboard/> }]},
//   { element: <DashboardLayout/>, children: [
//       { path: '/main', element: <DashMain/> },
//       { path: '/base', element: <Base/> },
//       { path: '/team', element: <Team/> },
//     ]},
//   { path: '*', element: <NotFound/> }
// ])

// export default function AppRoutes(){ return <RouterProvider router={router}/> }

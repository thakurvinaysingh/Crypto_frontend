import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import Landing from '../pages/Landing'
import DashMain from '../pages/Dashboard/Main'
import Base from '../pages/Dashboard/Base'
import Team from '../pages/Dashboard/Team'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
  { element: <AuthLayout/>, children: [{ path: '/', element: <Landing/> }]},
  { element: <DashboardLayout/>, children: [
      { path: '/main', element: <DashMain/> },
      { path: '/base', element: <Base/> },
      { path: '/team', element: <Team/> },
    ]},
  { path: '*', element: <NotFound/> }
])

export default function AppRoutes(){ return <RouterProvider router={router}/> }

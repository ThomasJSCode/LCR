import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import MainPage from './pages/MainPage.tsx'
import GameStartup from './pages/GameStartup.tsx'
import LostPage from './pages/LostPage.tsx'
import GameManager from './gameLogic/gameManager.tsx'

const browserRouter = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainPage />,
      errorElement: <LostPage />
    },
    {
      path: '/startGame',
      element: <GameStartup />
    },
    {
      path: '/gameSession',
      element: <GameManager/>
    }
  ]
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={browserRouter} />
  </StrictMode>,
)

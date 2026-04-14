import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { useOrientation } from './hooks/useOrientation'

// Portrait layout screens
import {
  PortraitShell,
  PortraitHome,
  PortraitPlay,
  PortraitLearn,
  PortraitLanguages,
} from './layouts/PortraitLayout'

// Landscape layout screens
import {
  LandscapeShell,
  LandscapeHome,
  LandscapePlay,
  LandscapeLearn,
  LandscapeLanguages,
} from './layouts/LandscapeLayout'

export default function App() {
  const orientation = useOrientation()
  const isLandscape = orientation === 'landscape'

  const Shell     = isLandscape ? LandscapeShell     : PortraitShell
  const Home      = isLandscape ? LandscapeHome      : PortraitHome
  const Play      = isLandscape ? LandscapePlay      : PortraitPlay
  const Learn     = isLandscape ? LandscapeLearn     : PortraitLearn
  const Languages = isLandscape ? LandscapeLanguages : PortraitLanguages

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/play"         element={<Play />} />
          <Route path="/how-it-works" element={<Learn />} />
          <Route path="/languages"    element={<Languages />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}

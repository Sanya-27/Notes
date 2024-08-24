import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import SignIn from './pages/SignIn'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import Contact from './pages/Contact'
import Features from './pages/Features'
import Content from './pages/Content'
import Info from './pages/Info'

const CustomRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/about' element={<About />} />
        <Route path='/features' element={<Features />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/app' Component={Layout}>
          <Route path='/app' element={<Info />} />
          <Route path={'/app/page/:page_name/:id'} element={<Content />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default CustomRouter

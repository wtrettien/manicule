import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import HomePage from './containers/HomePage'
import ReaderPage from './containers/ReaderPage'
import SiteContainer from './containers/SiteContainer'

import './styles/application.scss'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <SiteContainer>
                            <HomePage />
                        </SiteContainer>
                    }
                />
                <Route
                    path="/reader/:editionName/:pageString"
                    element={
                        <SiteContainer>
                            <ReaderPage />
                        </SiteContainer>
                    }
                />
                <Route
                    path="/reader"
                    element={
                        <SiteContainer>
                            <ReaderPage />
                        </SiteContainer>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App

import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import HomePage from 'containers/HomePage'
import ReaderPage from 'containers/ReaderPage'
import SiteContainer from 'containers/SiteContainer'
import About from 'containers/About'
import Structure from 'containers//Structure'

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route
                    path=""
                    element={
                        <SiteContainer>
                            <HomePage />
                        </SiteContainer>
                    }
                />
                <Route
                    path="reader/:editionName/:pageString"
                    element={
                        <SiteContainer>
                            <ReaderPage />
                        </SiteContainer>
                    }
                />
                <Route
                    path="reader"
                    element={
                        <SiteContainer>
                            <ReaderPage />
                        </SiteContainer>
                    }
                />
                <Route
                    path="structure"
                    element={
                        <SiteContainer>
                            <Structure />
                        </SiteContainer>
                    }
                />
                <Route
                    path="about"
                    element={
                        <SiteContainer>
                            <About />
                        </SiteContainer>
                    }
                />
            </Routes>
        </HashRouter>
    )
}

export default App

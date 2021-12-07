import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import HomePage from './containers/HomePage'
import ReaderPage from './containers/ReaderPage'

import './styles/application.scss'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/reader/:editionName/:pageString" element={<ReaderPage />} />
                <Route path="/reader" element={<ReaderPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

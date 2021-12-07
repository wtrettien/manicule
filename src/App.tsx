import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import HomePage from './containers/HomePage/Loadable'
import ReaderPage from './containers/ReaderPage/Loadable'

import './styles/application.scss'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/reader/:editionName/:page" element={<ReaderPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

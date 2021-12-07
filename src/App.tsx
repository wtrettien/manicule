import React from 'react';
import {   BrowserRouter, Route, Routes } from 'react-router-dom'

import HomePage from './containers/HomePage/Loadable'
import './styles/application.scss'

const DEFAULT_EDITION = 'penn'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage edition={DEFAULT_EDITION} />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App

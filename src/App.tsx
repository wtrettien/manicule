import React from 'react';
import { Route, Routes } from 'react-router-dom'

import HomePage from './containers/HomePage/Loadable'
const DEFAULT_EDITION = 'penn'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage edition={DEFAULT_EDITION} />} />
    </Routes>
  );
}

export default App

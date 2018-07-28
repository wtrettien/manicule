
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import HomePage from '../HomePage/Loadable'
import ReaderPage from '../ReaderPage/Loadable'
import Structure from '../Structure/Loadable'
import AboutPage from '../AboutPage/Loadable'

import NotFoundPage from '../NotFoundPage/Loadable'

const DEFAULT_EDITION = 'penn'

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={() => <HomePage edition={DEFAULT_EDITION} />} />
      <Route exact path="/structure" component={() => <Structure edition={DEFAULT_EDITION} />} />
      <Route exact path="/reader" render={() => <Redirect to={`/reader/${DEFAULT_EDITION}/1`} />} />

      <Route
        exact
        path="/reader/:edition/:page"
        component={ReaderPage}
      />
      <Route exact path="/about" component={AboutPage} />
      <Route component={NotFoundPage} />

    </Switch>
  )
}


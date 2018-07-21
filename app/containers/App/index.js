/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import HomePage from '../HomePage/Loadable'
import ReaderPage from '../ReaderPage/Loadable'
import Structure from '../Structure'

import NotFoundPage from '../NotFoundPage/Loadable'

const DEFAULT_EDITION = 'penn'

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/structure" component={() => <Structure edition={DEFAULT_EDITION} />} />
      <Route exact path="/reader" render={() => <Redirect to={`/reader/${DEFAULT_EDITION}/1`} />} />
      <Route
        exact
        path="/reader/:edition/:page"
        component={ReaderPage}
      />
      <Route component={NotFoundPage} />

    </Switch>
  )
}


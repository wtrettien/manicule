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
import { Switch, Route, Redirect } from 'react-router-dom'

import HomePage from 'containers/HomePage/Loadable'
import ReaderPage from 'containers/ReaderPage'
import Tour from 'containers/Tour'

import NotFoundPage from 'containers/NotFoundPage/Loadable'

const DEFAULT_EDITION = 'penn'  // FIXME allow multiple editions

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/reader" render={() => <Redirect to="/reader/penn/1" />} />
        <Route path="/reader/:edition/:page" component={ReaderPage} />
        <Route exact path="/tour" render={() => <Tour edition={DEFAULT_EDITION} />} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  )
}


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

import HomePage from '../HomePage/Loadable'
import ReaderPage from '../ReaderPage'
import Structure from '../Structure'
import Tour from '../Tour'

import NotFoundPage from '../NotFoundPage/Loadable'

const DEFAULT_EDITION = 'penn'  // FIXME allow multiple editions

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/structure" component={() => <Structure edition={DEFAULT_EDITION} />} />
        <Route exact path="/reader" render={() => <Redirect to="/reader/penn/1" />} />
        <Route exact path="/reader/:edition/:page" component={ReaderPage} />
        <Route exact path="/tour" render={() => <Redirect to="/tour/penn/0" />} />
        <Route exact path="/tour/:edition/:index" component={Tour} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  )
}


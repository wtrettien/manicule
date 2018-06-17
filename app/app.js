/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill'

// Import all the third party stuff
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'


// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico'
import '!file-loader?name=[name].[ext]!./images/icon-72x72.png'
import '!file-loader?name=[name].[ext]!./images/icon-96x96.png'
import '!file-loader?name=[name].[ext]!./images/icon-128x128.png'
import '!file-loader?name=[name].[ext]!./images/icon-144x144.png'
import '!file-loader?name=[name].[ext]!./images/icon-152x152.png'
import '!file-loader?name=[name].[ext]!./images/icon-192x192.png'
import '!file-loader?name=[name].[ext]!./images/icon-384x384.png'
import '!file-loader?name=[name].[ext]!./images/icon-512x512.png'
import '!file-loader?name=[name].[ext]!./manifest.json'
import 'file-loader?name=[name].[ext]!./.htaccess'
/* eslint-enable import/no-unresolved, import/extensions */

import 'bootstrap'

import configureStore from './configureStore'

// SASS
import './styles/application.scss'

// Import root app
import App from '../app/containers/App'

// Create redux store with history
const initialState = {}
const history = createHistory({ basename: 'usedbooks' })
const store = configureStore(initialState, history)
const MOUNT_NODE = document.getElementById('app')

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    MOUNT_NODE
  )
}

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE)
    render()
  })
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise((resolve) => {
    resolve(import('intl'))
  }))
    .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
    ]))
    .then(() => render())
    .catch((err) => {
      throw err
    })
} else {
  render()
}

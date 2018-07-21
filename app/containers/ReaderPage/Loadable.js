import Loadable from 'react-loadable'
import React from 'react'

import LoadingPage from '../LoadingPage'

export default Loadable({
  loader: () => import('./index'),
  loading: () => <LoadingPage />,
})

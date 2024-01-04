import React       from 'react'
import App         from './App'
import { hydrate } from 'react-dom'
import ReactDomm from 'react-dom'


hydrate(<App/>, document.getElementById('root'))

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'spectre.css'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()

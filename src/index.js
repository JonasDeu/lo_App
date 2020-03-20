import React from "react"
import ReactDOM from "react-dom"

import MainForm from "./components/MainForm"

import * as serviceWorker from "./serviceWorker"

import "./css/normalize.css"
import "./css/reset.css"
import "./css/typography.css"
import "./css/styles.css"

ReactDOM.render(<MainForm />, document.getElementById("root"))

serviceWorker.register()

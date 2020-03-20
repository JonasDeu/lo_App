import React, { Component } from "react"

class PwaButton extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount = () => {
		document.getElementById("pwaButton").addEventListener("click", e => {
			this.props.deferredPrompt.prompt()
			this.props.deferredPrompt.userChoice.then(choiceResult => {
				if (choiceResult.outcome === "accepted") {
					console.log("User accepted the install prompt")
				} else {
					console.log("User dismissed the install prompt")
				}
			})
		})
	}

	render() {
		return <button id="pwaButton">Add to Homescreen</button>
	}
}

export default PwaButton

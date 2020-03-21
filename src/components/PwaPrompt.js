import React, { Component } from "react"

class PwaPrompt extends Component {
	componentDidMount = () => {
		document.getElementsByClassName("pwaButton")[0].addEventListener("click", () => {
			this.props.closePwaPromptHandler()
			document.getElementsByClassName("pwaPrompt")[0].classList.add("hidden")
			this.props.deferredPrompt.prompt()
			this.props.deferredPrompt.userChoice.then(choiceResult => {
				if (choiceResult.outcome === "accepted") {
					console.log("User accepted the install prompt")
				} else {
					console.log("User dismissed the install prompt")
				}
			})
		})

		setTimeout(() => {
			document.getElementsByClassName("pwaPrompt")[0].classList.remove("hidden")
		}, 4000)
	}

	render() {
		return (
			<div className="pwaPrompt hidden">
				<button className="pwaButton">Add to Homescreen</button>
				<button className="pwaPromptClose" onClick={this.props.closePwaPromptHandler}>
					✕
				</button>
			</div>
		)
	}
}

export default PwaPrompt

import React, { Component } from "react"
import "emoji-mart/css/emoji-mart.css"
import { Picker } from "emoji-mart"

class NewLog extends Component {
	constructor(props) {
		super(props)
		this.state = {
			emojiPicker: false,
			chosenEmoji: "📝",
			logName: ""
		}
	}

	handleCreation = async event => {
		event.preventDefault()

		try {
			const response = await fetch(this.props.url + "/logs", {
				method: "POST",
				body: JSON.stringify({ name: this.state.logName, emoji: this.state.chosenEmoji }),
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + this.props.token
				}
			})
			if (!response.ok) {
				throw new Error("Log can not be created")
			}
			this.props.newLogPromptHandler()
			this.props.getLogs()
		} catch (e) {
			alert(e)
			console.log(e)
		}
	}

	handleEmojiButton = () => {
		const emojiMart = document.getElementsByClassName("emoji-mart")[0]
		if (this.state.emojiPicker) {
			emojiMart.style.visibility = "hidden"
			this.setState({ emojiPicker: false })
		} else {
			emojiMart.style.visibility = "visible"
			this.setState({ emojiPicker: true })
		}
	}

	handleEmojiChange = emoji => {
		this.setState({ chosenEmoji: emoji.native })
		this.handleEmojiButton()
	}

	handleNameChange = event => {
		this.setState({
			logName: event.target.value
		})
	}

	handleSubmit = event => {
		event.preventDefault()
	}

	render() {
		return (
			<li className="newLogOverlay">
				<form className="newLogForm" onSubmit={this.handleSubmit}>
					<button
						className="newLogFormClose"
						onClick={() => {
							this.props.newLogPromptHandler()
						}}
						type="button">
						✕
					</button>

					<h2>Add new Log</h2>

					<button className="emojiButton" type="button" onClick={this.handleEmojiButton}>
						<span role="img" aria-label="Emoji Picker">
							{this.state.chosenEmoji}
						</span>
					</button>

					<Picker
						title={"Pick your emoji…"}
						emoji={"point_up"}
						native={true}
						showPreview={false}
						showSkinTones={false}
						onSelect={this.handleEmojiChange}
					/>

					<input
						placeholder="Log name"
						type="text"
						spellCheck="false"
						autoFocus
						onChange={this.handleNameChange}></input>

					<button className="newLogButtonSubmit" onClick={this.handleCreation}>
						Create
					</button>
				</form>
			</li>
		)
	}
}

export default NewLog

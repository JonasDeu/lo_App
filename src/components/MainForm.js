import React from "react"
import LoginPage from "./LoginPage"
import Header from "./Header"
import LogView from "./LogView"
import StatsLineChart from "./StatsLineChart"
import StatsHeatmap from "./StatsHeatmap"
import PwaPrompt from "./PwaPrompt"
import "emoji-mart/css/emoji-mart.css"
import { Picker } from "emoji-mart"

//TODO
//No fetch if response.ok
//light mode
//removing logs
//accumulated by Days/Hour in Week Graph

const url = "https://lo-app-api.herokuapp.com"

class MainForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loggedIn: false,
			token: "",
			logs: null,
			userData: null,
			viewedLog: null,
			deferredPrompt: null,
			pwaPrompt: true,
			emojiPicker: false,
			chosenEmoji: "📒"
		}

		window.addEventListener("beforeinstallprompt", e => {
			e.preventDefault()
			this.setState({ deferredPrompt: e })
		})

		const handleFirstTab = e => {
			if (e.keyCode === 9) {
				// Tab Key
				document.body.classList.add("user-is-tabbing")
				window.removeEventListener("keydown", handleFirstTab)
			}
		}

		window.addEventListener("keydown", handleFirstTab)
	}

	componentDidMount() {
		const loginData = window.localStorage.getItem("loginData")
		if (loginData) {
			this.setLogin(JSON.parse(loginData))
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.userData !== this.state.userData) {
			this.getLogs()
		}
	}

	setLogin = (response, keepLogged) => {
		if (!response) {
			window.localStorage.removeItem("loginData")
			this.setState({
				token: null,
				userData: null
			})
			return
		}
		if (keepLogged) {
			window.localStorage.setItem("loginData", JSON.stringify(response))
		}
		this.setState({
			token: response.token,
			userData: response
		})
	}

	getLogs = async () => {
		if (this.state.token) {
			try {
				const response = await fetch(url + "/logs", {
					headers: {
						Authorization: "Bearer " + this.state.token
					}
				})
				if (!response) {
					throw new Error("Server not accessible")
				}
				const logs = await response.json()
				this.setState({ logs })
			} catch (e) {
				console.log(e)
			}
		}
	}

	addEntryHandler = async id => {
		const entry = document.getElementById(id)
		entry.classList.remove("addEntryAnimation")
		void entry.offsetWidth
		entry.classList.add("addEntryAnimation")
		entry.classList.add("addLoadingAnimation")

		try {
			const response = await fetch(url + "/logs/" + id, {
				method: "POST",
				headers: {
					Authorization: "Bearer " + this.state.token
				}
			})
			if (!response.ok) {
				throw new Error("Log can not deleted")
			}

			await this.getLogs()
			entry.classList.remove("addLoadingAnimation")
		} catch (e) {
			console.log(e)
			entry.classList.remove("addLoadingAnimation")
		}
	}

	addLogHandler = async event => {
		event.preventDefault()
		const logPrompt = prompt("Enter log name", "Bananas")
		if (logPrompt == null || logPrompt === "") {
			console.log("Enter Log Name!")
		} else {
			try {
				const response = await fetch(url + "/logs", {
					method: "POST",
					body: JSON.stringify({ name: logPrompt, emoji: this.state.chosenEmoji }),
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + this.state.token
					}
				})
				if (!response.ok) {
					throw new Error("Log can not be created")
				}
				this.getLogs()
			} catch (e) {
				alert("duplicate log name!")
				console.log(e)
			}
		}
	}

	removeLogHandler = async id => {
		if (window.confirm("delete log?")) {
			try {
				const response = await fetch(url + "/logs/" + id, {
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + this.state.token
					}
				})
				if (!response.ok) {
					throw new Error("Log can not be deleted")
				}
				this.setState({ viewedLog: null })
				this.getLogs()
			} catch (e) {
				console.log(e)
			}
		}
	}

	emojiButtonHandler = () => {
		const emojiMart = document.getElementsByClassName("emoji-mart")[0]
		if (this.state.emojiPicker) {
			emojiMart.style.visibility = "hidden"
			this.setState({ emojiPicker: false })
		} else {
			emojiMart.style.visibility = "visible"
			this.setState({ emojiPicker: true })
		}
	}

	emojiChangeHandler = emoji => {
		const emojiButton = document.getElementsByClassName("emojiButton")[0]
		const emojiMart = document.getElementsByClassName("emoji-mart")[0]
		this.setState({ chosenEmoji: emoji.native })
		emojiButton.innerHTML = emoji.native

		this.emojiButtonHandler()
	}

	logList = () => {
		if (this.state.logs) {
			const logList = this.state.logs.map(log => {
				const timeDif = Math.abs(Math.round((new Date(log.lastEntry) - Date.now()) / 60000))
				const color = "color-" + 3 //Math.floor(Math.random() * 6)
				//const colorHover = "color-1-hover"

				return (
					<li className="logEntry" key={log._id} id={log._id}>
						<div
							className="logEntryInfo"
							onClick={() => {
								this.viewedLogChangeHandler(log._id)
							}}
							tabIndex="0">
							<div className="logEntryTitle">
								<h3 className={color}>{(log.emoji ? log.emoji : "") + " " + log.name}</h3>
								{/* Replace by log.color later */}
							</div>
						</div>
						<div className={"logEntryAdd "}>
							<button
								className="addEntryButton"
								onClick={() => {
									this.addEntryHandler(log._id)
								}}>
								+
							</button>
							<br></br>
							<span className={"logEntryTimeDif"}>
								{!isNaN(timeDif)
									? timeDif < 60
										? timeDif + "min"
										: Math.round(timeDif / 60) + "h"
									: "-"}
							</span>
						</div>
					</li>
				)
			})

			return (
				<ul className="logList">
					{logList}
					<li className="logEntry logEntryNewEntry">
						<div className="logEntryInfo">
							<div className="logEntryTitle">
								<button className="emojiButton" onClick={this.emojiButtonHandler}>
									<span role="img" aria-label="Emoji Picker"></span>📒
								</button>
								<Picker
									title={"Pick your emoji…"}
									emoji={"point_up"}
									native={true}
									showPreview={false}
									showSkinTones={false}
									onSelect={this.emojiChangeHandler}
								/>
								<h3>new log</h3>
							</div>
						</div>
						<div className={"logEntryAdd "}>
							<button className="addEntryButton" onClick={this.addLogHandler}>
								+
							</button>
							<br></br>
							<span className={"logEntryTimeDif"}>&nbsp;</span>
						</div>
					</li>
				</ul>
			)
		}
	}

	viewedLogChangeHandler = viewedLog => {
		const entries = document.getElementsByClassName("logEntry")
		Array.from(entries).forEach(e => {
			e.classList.remove("viewedLogEntry")
		})
		const entry = document.getElementById(viewedLog)
		entry.classList.add("viewedLogEntry")

		this.setState({ viewedLog })
		if (window.innerWidth <= 900) {
			this.scrollToBottom()
		}
	}

	closePwaPromptHandler = () => {
		this.setState({ pwaPrompt: false })
	}

	scrollToBottom = () => {
		this.pageEnd.scrollIntoView({ behavior: "smooth" })
	}

	render() {
		return (
			<div>
				{this.state.token ? (
					<Header userData={this.state.userData} setLogin={this.setLogin} />
				) : (
					<LoginPage setLogin={this.setLogin} deferredPrompt={this.state.deferredPrompt} />
				)}
				{this.state.token && (
					<div>
						<hr />
						<div className="gridMain">
							{this.logList()}

							<div className="stats">
								<div
									style={{ float: "left", clear: "both" }} //for scroll to bottom
									ref={el => {
										this.pageEnd = el
									}}></div>
								{this.state.viewedLog && (
									<React.Fragment>
										<LogView
											change={this.state.logs}
											viewedLog={this.state.viewedLog}
											logs={this.state.logs}
											url={url}
											token={this.state.token}
											removeLogHandler={this.removeLogHandler}
										/>
									</React.Fragment>
								)}
								<div className="gridStats">
									<StatsLineChart
										change={this.state.logs}
										viewedLog={this.state.viewedLog}
										logs={this.state.logs}
										url={url}
										token={this.state.token}
									/>
									<StatsHeatmap change={this.state.logs} url={url} token={this.state.token} />
								</div>
							</div>
						</div>
					</div>
				)}

				{this.state.pwaPrompt &&
				this.state.deferredPrompt &&
				!window.matchMedia("(display-mode: standalone)").matches ? (
					<PwaPrompt
						deferredPrompt={this.state.deferredPrompt}
						closePwaPromptHandler={this.closePwaPromptHandler}
					/>
				) : (
					<span></span>
				)}
			</div>
		)
	}
}

export default MainForm

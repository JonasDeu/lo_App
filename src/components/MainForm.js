import React from "react"
import LoginPage from "./LoginPage"
import Header from "./Header"
import LogView from "./LogView"
import StatsLineChart from "./StatsLineChart"
import StatsHeatmap from "./StatsHeatmap"
import NewLog from "./NewLog"
import PwaPrompt from "./PwaPrompt"

//TODO
//No fetch if response.ok
//light mode
//removing logs
//accumulated by Days/Hour in Week Graph

const url = "https://lo-app-api.herokuapp.com"
const exampleLogs = [
	"👵 Call Grandma",
	"🍕 Pizzas",
	"🎬 Movies",
	"🍌 Bananas",
	"🍔️ Burger",
	"🥙 Tacos",
	"📘 Books",
	"🥑 Avocadoes",
	"🎷 Sax",
	"💩 Poop",
	"🧗‍♀️ Climbing",
	"⚽ Soccer",
	"🖌️ Drawing",
	"🪒 Shaved",
	"🧹 Cleaned",
	"✈️ Flights"
]

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
			newLogPrompt: false
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
				throw new Error("Can not add Log Entry")
			}

			await this.getLogs()
			entry.classList.remove("addLoadingAnimation")
		} catch (e) {
			console.log(e)
			entry.classList.remove("addLoadingAnimation")
		}
	}

	removeLogHandler = async id => {
		if (window.confirm("Delete log?")) {
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

	newLogPromptHandler = () => {
		this.setState(prevState => {
			return { newLogPrompt: !prevState.newLogPrompt }
		})
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
					<button className="newLogButton" onClick={this.newLogPromptHandler}>
						＋
					</button>
					{this.state.newLogPrompt && (
						<NewLog
							url={url}
							token={this.state.token}
							getLogs={this.getLogs}
							newLogPromptHandler={this.newLogPromptHandler}
							exampleLogs={exampleLogs}
						/>
					)}
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
					<LoginPage
						setLogin={this.setLogin}
						deferredPrompt={this.state.deferredPrompt}
						exampleLogs={exampleLogs}
					/>
				)}
				{this.state.token && (
					<div>
						<hr />
						<div className="flexMain">
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

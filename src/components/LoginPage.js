import React, { Component } from "react"

let logoColor = 0
let timer = null
let timerLogName = null
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

class LoginPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email: "",
			password: "",
			keepLogged: true,
			error: "",
			exampleCounter: 0,
			exampleLog: exampleLogs[Math.floor(Math.random() * exampleLogs.length)]
		}
	}

	componentDidMount = () => {
		this.startTimer()
		this.startTimerLogName()
	}

	componentWillUnmount = () => {
		clearInterval(timer)
		clearInterval(timerLogName)
	}

	loginUser = async () => {
		const data = {
			email: this.state.email,
			password: this.state.password
		}
		try {
			const response = await fetch("https://lo-app-api.herokuapp.com/users/login", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			})
			if (!response.ok) {
				this.setState({ error: "Credentials not found" })
				throw new Error("Credentials not found")
			}
			this.props.setLogin(await response.json(), this.state.keepLogged)
		} catch (e) {
			console.log(e)
		}
	}

	createUser = async () => {
		const data = {
			email: this.state.email,
			password: this.state.password
		}
		try {
			const response = await fetch("https://lo-app-api.herokuapp.com/users", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json"
				}
			})
			if (!response.ok) {
				this.setState({ error: "Could not create" })
				throw new Error("Could not create")
			}

			this.props.setLogin(await response.json(), this.state.keepLogged)
		} catch (e) {
			console.log(e)
		}
	}

	handleSubmit = event => {
		event.preventDefault()
	}

	handleCreation = event => {
		if (!this.state.email) {
			return this.setState({ error: "Email required" })
		}
		if (!this.state.password) {
			return this.setState({ error: "Password required" })
		}
		this.createUser()
		return this.setState({ error: "" })
	}

	handleEnter = event => {
		if (!this.state.email) {
			return this.setState({ error: "Email required" })
		}
		if (!this.state.password) {
			return this.setState({ error: "Password required" })
		}
		this.loginUser()
		return this.setState({ error: "" })
	}

	handleUserChange = event => {
		this.setState({
			email: event.target.value
		})
	}

	handlePassChange = event => {
		this.setState({
			password: event.target.value
		})
	}

	handleKeepLoggedChange = event => {
		this.setState(prevState => {
			return { keepLogged: !prevState.keepLogged }
		})
	}

	resetError = () => {
		this.setState({ error: "" })
	}

	showLoginForm = visible => {
		visible
			? (document.getElementsByClassName("loginOverlay")[0].style.display = "block")
			: (document.getElementsByClassName("loginOverlay")[0].style.display = "none")
	}

	installPwaHandler = () => {
		if (!this.props.deferredPrompt) {
			alert("Currently not supportet :(")
			return
		}
		this.props.deferredPrompt.prompt()
	}

	exampleClick = () => {
		const entry = document.getElementById("exampleEntry")
		entry.classList.remove("addEntryAnimation")
		void entry.offsetWidth
		entry.classList.add("addEntryAnimation")

		this.startTimer()
	}

	startTimer = () => {
		clearInterval(timer)
		const exampleTimer = document.getElementById("exampleTimer")
		exampleTimer.innerHTML = "0sec"
		timer = setInterval(() => {
			let newTime = parseInt(exampleTimer.innerHTML) + 1

			exampleTimer.innerHTML = newTime < 60 ? newTime + "sec" : Math.round(newTime / 60) + "min"
		}, 1000)
	}

	startTimerLogName = () => {
		const exampleLogNames = document.getElementById("exampleLogNames")
		timerLogName = setInterval(() => {
			exampleLogNames.innerHTML = exampleLogs[Math.floor(Math.random() * exampleLogs.length)]
		}, 500)
	}

	render() {
		return (
			<React.Fragment>
				<h1 className={"loginLogo color-" + (logoColor++ % 6)}>lo</h1>

				<input
					className="showLoginFormButton"
					type="submit"
					value="Enter"
					onClick={() => {
						this.showLoginForm(true)
					}}
				/>

				<div className="loginOverlay">
					<div className="loginForm">
						<button
							className="loginFormClose"
							onClick={() => {
								this.showLoginForm(false)
							}}
							type="button">
							✕
						</button>
						<form onSubmit={this.handleSubmit}>
							<div className="loginFormControl">
								<label>Email</label>
								<input type="email" value={this.state.email} onChange={this.handleUserChange} />
							</div>
							<div className="loginFormControl">
								<label>Password</label>
								<input
									type="password"
									minLength="6"
									value={this.state.password}
									onChange={this.handlePassChange}
								/>
							</div>
							<div className="form-checkbox">
								<input
									type="checkbox"
									checked={this.state.keepLogged}
									onChange={this.handleKeepLoggedChange}
								/>
								<label onClick={this.handleKeepLoggedChange}>Stay logged in?</label>
							</div>

							<input className="loginButton" type="submit" value="Enter" onClick={this.handleEnter} />
							<input
								className="createButton"
								type="submit"
								value="Create Account"
								onClick={this.handleCreation}
							/>

							{this.state.error && (
								<p onClick={this.resetError}>
									<button className="errorButton" onClick={this.resetError}>
										✕
									</button>
									<span className="errorMessage">{this.state.error}</span>
								</p>
							)}
						</form>
					</div>
				</div>

				<div className="gridLogin">
					<div className="loginExample">
						<h2>Keep track of the little things in your life.</h2>
						<span>
							Whether it is your occasional cheat meal or the amount of times you call your grandma – lo
							keeps it all.
						</span>
						<div className="loginExampleContainer">
							<div className="loginExampleLogGrid">
								<li id="exampleEntry" className="logEntry">
									<div className="logEntryInfo">
										<div className="logEntryTitle">
											<h3 className="color-3">
												<span role="img" aria-label="example-log">
													{this.state.exampleLog}
												</span>
											</h3>
										</div>
									</div>
									<div className={"logEntryAdd "}>
										<button className="addEntryButton" onClick={this.exampleClick}>
											+
										</button>
										<br></br>
										<span id="exampleTimer" className={"logEntryTimeDif"}>
											0sec
										</span>
									</div>
								</li>
								<li className="logEntry">
									<div className="logEntryInfo">
										<div className="logEntryTitle">
											<h3 className="color-3">
												<span id="exampleLogNames" role="img" aria-label="example-log">
													🎬 Movies
												</span>
											</h3>
										</div>
									</div>
									<div className={"logEntryAdd "}>
										<button className="addEntryButton">+</button>
										<br />
										<span>-</span>
									</div>
								</li>
							</div>
						</div>
					</div>

					<div className="loginExample">
						<h2>Analyse and Discover</h2>
						<span>
							Watch your data neatly arranged in our graphs. Discover possible correlations via the
							cross-correlation matrix. Or simply export your data and do your own evaluation.
						</span>
						<div className="loginExampleContainer">
							<svg height="100" width="280">
								<path
									className="path"
									stroke="#B043D1"
									fill="none"
									d="m2 89.875q16-64 32 0 16 0 16 0 32-128 48-48c16 64 16-96 48 48 16 0 16 0 16 0q16-16 32-64 16-48 32 0"
								/>
							</svg>
						</div>
					</div>

					<div className="loginExample">
						<h2>
							Add<span className="color-2"> lo </span>to your homescreen
						</h2>
						<span>
							Install the progressive web app to have easy access on your phone. Click the button below to
							see if your browser supports it.
						</span>
						<div className="loginExampleContainer">
							<div className="loginExamplePwa">
								<img
									className="loginExamplePwaFavicon"
									src={require("../images/favicon.ico")}
									alt="Logo of lo"
								/>
								<button className="loginExamplePwaButton" onClick={this.installPwaHandler}>
									Install
								</button>
							</div>
						</div>
					</div>

					<div className="loginExample">
						<h2>Everything - Everywhere</h2>
						<span>All entries are synced between your devices.</span>
						<div className="loginExampleContainer">
							<div className="dots">
								<span className="dot1"></span>
								<span className="dot2"></span>
								<span className="dot"></span>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

export default LoginPage

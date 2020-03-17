import React, { Component } from 'react';

let logoColor = 0

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            keepLogged: false,
            error: '',
            exampleCounter: 0,
            exampleTime: new Date(Date.now())
        };
    }

    loginUser = async () => {
        const data = {
            "email": this.state.email,
            "password": this.state.password
        }
        try {
            const response = await fetch("https://lo-app-api.herokuapp.com/users/login", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (!response.ok) {
                this.setState({ error: 'Credentials not found' })
                throw new Error('Credentials not found')
            }
            this.props.setLogin(await response.json(), this.state.keepLogged)

        } catch (e) {
            console.log(e)
        }
    }

    createUser = async () => {
        const data = {
            "email": this.state.email,
            "password": this.state.password,
        }
        try {
            const response = await fetch("https://lo-app-api.herokuapp.com/users", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (!response.ok) {
                this.setState({ error: 'Could not create' })
                throw new Error('Could not create')
            }

            this.props.setLogin(await response.json(), this.state.keepLogged)

        } catch (e) {
            console.log(e)
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
    }

    handleCreation = (event) => {
        if (!this.state.email) { return this.setState({ error: 'Email required' }) }
        if (!this.state.password) { return this.setState({ error: 'Password required' }) }
        this.createUser()
        return this.setState({ error: '' })
    }

    handleEnter = (event) => {
        if (!this.state.email) { return this.setState({ error: 'Email required' }) }
        if (!this.state.password) { return this.setState({ error: 'Password required' }) }
        this.loginUser()
        return this.setState({ error: '' })
    }

    handleUserChange = (event) => {
        this.setState({
            email: event.target.value,
        })
    };

    handlePassChange = (event) => {
        this.setState({
            password: event.target.value,
        })
    }

    handleKeepLoggedChange = (event) => {
        this.setState((prevState) => {
            return { keepLogged: !prevState.keepLogged }
        })
    }

    resetError = () => {
        this.setState({ error: '' });
    }

    showLoginForm = (visible) => {
        visible ? document.getElementsByClassName("loginOverlay")[0].style.display = "block" : document.getElementsByClassName("loginOverlay")[0].style.display = "none"
    }

    render() {
        const timeDif = Math.abs(Math.round(((this.state.exampleTime - Date.now()) / 60000)))
        return (
            <React.Fragment>
                <h1 className={"loginLogo color-" + (logoColor++) % 6}>lo</h1>

                <input className="showLoginFormButton" type="submit" value="Enter" onClick={() => { this.showLoginForm(true) }} />

                <div className="loginOverlay">
                    <div className="loginForm">
                        <button className="loginFormClose" onClick={() => { this.showLoginForm(false) }}>✕</button>
                        <form onSubmit={this.handleSubmit}>
                            <div className="loginFormControl">
                                <label>Email</label>
                                <input type="email" value={this.state.email} onChange={this.handleUserChange} />
                            </div>
                            <div className="loginFormControl">
                                <label>Password</label>
                                <input type="password" minLength="6" value={this.state.password} onChange={this.handlePassChange} />
                            </div>
                            <div className="form-checkbox">
                                <input type="checkbox" checked={this.state.keepLogged} onChange={this.handleKeepLoggedChange} />
                                <label>Keep logged in?</label>
                            </div>

                            <input className="loginButton" type="submit" value="Enter" onClick={this.handleEnter} />
                            <input className="createButton" type="submit" value="Create Account" onClick={this.handleCreation} />

                            {
                                this.state.error &&
                                <p onClick={this.resetError}>
                                    <button className="errorButton" onClick={this.resetError}>✕</button>
                                    <span className="errorMessage">{this.state.error}</span>
                                </p>
                            }
                        </form>
                    </div>

                </div>

                <div className="gridLogin">

                    <div className="loginExample">
                        <h2>Keep track of the little things in your life.</h2>
                        <br />
                        <span>Whether it is your occasional cheat meal or the amount of times you call your grandma – lo keeps it all.</span>
                        <div className="loginExampleContainer">
                            <div className="loginExampleLogGrid">
                                <li className="logEntry">
                                    <div className="logEntryInfo">
                                        <div className="logEntryTitle">
                                            <h3 className="color-3"><span role="img" aria-label="example-log">🍕</span></h3>
                                            {this.state.exampleCounter + " "}
                                        </div>
                                        <span>{"since " + this.state.exampleTime.toLocaleDateString()}</span>
                                        <br />
                                        <button className="removeButton">✕</button >
                                    </div>
                                    <div className={"logEntryAdd "}>
                                        <button className="addEntryButton" onClick={() => {
                                            this.setState((prevState) => {
                                                return { exampleCounter: prevState.exampleCounter + 1, exampleTime: new Date(Date.now()) }
                                            })
                                        }}>+</button>
                                        <br></br>
                                        <span className={"logEntryTimeDif"}>{timeDif < 60 ? timeDif + "min" : Math.round((timeDif / 60)) + "h"}</span>
                                    </div>
                                </li >
                                <li className="logEntry">
                                    <div className="logEntryInfo">
                                        <div className="logEntryTitle">
                                            <h3 className="color-3">...</h3>
                                        </div>
                                        <br /><br />
                                    </div>
                                    <div className={"logEntryAdd "}>
                                        <button className="addEntryButton">+</button>
                                        <br />
                                        <span>-</span>
                                    </div>
                                </li >
                            </div>
                        </div>
                    </div>

                    <div className="loginExample">
                        <h2>Analyse and Discover</h2>
                        <br />
                        <span>Watch your data neatly arranged in our graphs. Discover possible correlations via the cross-correlation matrix. Or simply export your data and do your own evaluation.</span>
                        <div className="loginExampleContainer">
                            <svg height="100" width="280">
                                <path className="path" stroke="#B043D1" fill="none" d="m2 89.875q16-64 32 0 16 0 16 0 32-128 48-48c16 64 16-96 48 48 16 0 16 0 16 0q16-16 32-64 16-48 32 0" />
                            </svg>

                        </div>
                    </div>

                    <div className="loginExample">
                        <h2>Everything - Everywhere</h2>
                        <br />
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
            </React.Fragment >
        );
    }
}

export default LoginPage;
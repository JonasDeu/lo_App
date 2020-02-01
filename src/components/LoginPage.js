import React, { Component } from 'react';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            checkedCreation: false,
            error: '',
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
            this.props.setLogin(await response.json())

        } catch (e) {
            console.log(e)
        }
    }

    createUser = async () => {
        const data = {
            "name": this.state.email,
            "age": "1",
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

            this.props.setLogin(await response.json())

        } catch (e) {
            console.log(e)
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if (!this.state.email) { return this.setState({ error: 'Email required' }) }
        if (!this.state.password) { return this.setState({ error: 'Password required' }) }

        this.state.checkedCreation ? this.createUser() : this.loginUser()

        return this.setState({ error: '' })
    }

    handleUserChange = (event) => {
        this.setState({
            email: event.target.value,
        });
    };

    handlePassChange = (event) => {
        this.setState({
            password: event.target.value,
        });
    }

    handleCreationChange = (event) => {
        this.setState({
            checkedCreation: !this.state.checkedCreation,
        });
    }

    resetError = () => {
        this.setState({ error: '' });
    }

    render() {
        return (
            <div className="loginForm">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-control">
                        <label>Email</label>
                        <input type="text" value={this.state.email} onChange={this.handleUserChange} />
                    </div>
                    <div className="form-control">
                        <label>Password</label>
                        <input type="password" value={this.state.password} onChange={this.handlePassChange} />
                    </div>
                    <div className="form-checkbox">
                        <input type="checkbox" checked={this.state.checkedCreation} onChange={this.handleCreationChange} />
                        <label>Create Account?</label>
                    </div>

                    <input id="loginButton" type="submit" value="Enter" />

                    {
                        this.state.error &&
                        <p onClick={this.resetError}>
                            <button id="errorButton" onClick={this.resetError}>✖</button>
                            <span class="errorMessage">{this.state.error}</span>
                        </p>
                    }
                </form>
            </div>
        );
    }
}

export default LoginPage;
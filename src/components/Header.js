import React, { Component } from 'react';

class Header extends Component {

    handleLogout = async () => {
        try {
            const response = await fetch("https://lo-api.herokuapp.com/users/logout", {
                method: 'POST',
                headers: {
                    "Authorization": 'Bearer ' + this.props.userData.token
                }
            })
            if (!response.ok) {
                throw new Error('Could not Logout')
            }
            this.props.setLogin(false)
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <header>
                <span>{this.props.userData.user.name}</span>
                <button id="logoutButton" onClick={this.handleLogout}>Logout</button>
            </header>
        );
    }
}

export default Header;
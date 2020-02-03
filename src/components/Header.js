import React, { Component } from 'react';
import download from "downloadjs"

class Header extends Component {

    logoutHandler = async () => {
        try {
            const response = await fetch("https://lo-app-api.herokuapp.com/users/logout", {
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

    downloadHandler = async () => {
        try {
            const response = await fetch("https://lo-app-api.herokuapp.com/logs/download", {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + this.props.userData.token
                }
            })
            if (!response.ok) {
                throw new Error('Could not download')
            }
            const downloadData = JSON.stringify(await response.json())
            download(downloadData, "yourLogs.json", "application/json")
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <header>
                <span >
                    <button className="downloadButton" onClick={() => { this.downloadHandler() }} >Download Logs</button >
                </span>
                <span id="email" className={"color-" + Math.floor(Math.random() * 6)}>{this.props.userData.user.name}</span>
                <span id="logout"><button onClick={this.logoutHandler}>Logout</button></span>
            </header>
        );
    }
}

export default Header;
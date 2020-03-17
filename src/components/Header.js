import React, { Component } from 'react'
import download from "downloadjs"

let headerColor = 0

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
            const downloadData = await response.text()
            download(downloadData, "yourLogs.csv", "text/csv")
        } catch (e) {
            console.log(e)
        }
    }

    render() {

        return (
            <header>
                <span >
                    <button className="downloadButton" onClick={() => { this.downloadHandler() }} >Download <span className="downloadButtonBigScreen">Logs</span></button >
                </span>
                <span className={"headerEmail color-" + (headerColor++) % 6}>{this.props.userData.user.name}</span>
                <span className="headerLogout"><button onClick={this.logoutHandler}>Logout</button></span>
            </header>
        );
    }
}

export default Header;
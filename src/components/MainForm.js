import React from "react";
import LoginPage from "./LoginPage"
import Header from "./Header"
import LogEntries from "./LogEntries"
import Heatmap from "./Heatmap"

//TODO No fetch if response.ok
//getlogs in componentDidUpdatea
const url = "https://lo-app-api.herokuapp.com"

const handleFirstTab = (e) => {
  if (e.keyCode === 9) { // Tab Key
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
  }
}
window.addEventListener('keydown', handleFirstTab);

class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      token: "",
      logs: null,
      userData: null,
      viewedLog: null
    };

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userData !== this.state.userData) {
      this.getLogs()
    }
  }

  setLogin = (response) => {
    if (!response) {
      this.setState({
        token: null,
        userData: null
      })
      return
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
            "Authorization": 'Bearer ' + this.state.token
          }
        })
        if (!response) {
          throw new Error('Server not accessible')
        }
        const logs = await response.json()
        this.setState({ logs })
      } catch (e) {
        console.log(e)
      }
    }
  }

  addEntryHandler = async (id) => {
    try {
      const response = await fetch((url + "/logs/" + id), {
        method: 'POST',
        headers: {
          "Authorization": 'Bearer ' + this.state.token
        },
      })
      if (!response.ok) { throw new Error("Log can not deleted") }
      this.getLogs()
    } catch (e) {
      console.log(e)
    }
  };

  addLogHandler = async (event) => {
    event.preventDefault();
    var logPrompt = prompt("Please enter log name", "Bananas");
    if (logPrompt == null || logPrompt === "") {
      alert("Enter Log Name!");
    } else {
      try {
        const response = await fetch(url + "/logs", {
          method: 'POST',
          body: JSON.stringify({ name: logPrompt }),
          headers: {
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + this.state.token
          },
        })
        if (!response.ok) { throw new Error('Log can not be created') }
        this.getLogs()
      } catch (e) {
        console.log(e)
      }
    }
  };

  removeLogHandler = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        const response = await fetch((url + "/logs/" + id), {
          method: 'DELETE',
          headers: {
            "Authorization": 'Bearer ' + this.state.token
          },
        })
        if (!response.ok) { throw new Error("Log can not be deleted") }
        this.getLogs()
      } catch (e) {
        console.log(e)
      }
    }
  }

  logList = () => {
    if (this.state.logs) {
      const tempLog = this.state.logs.map(log => {
        const timeDif = Math.abs(Math.round(((new Date(log.lastEntry) - Date.now()) / 60000)))
        const color = "color-" + 3//Math.floor(Math.random() * 6)
        //const colorHover = "color-1-hover"

        return (
          <li className="logEntry" key={log._id}>
            <div className="logEntryInfo">
              <div className="logEntryTitle">
                <h2 className={color}>{log.name}</h2> {/* Replace by log.color later */}
                {log.numEntries + " "}
              </div>

              <span>{"since " + (new Date(log.date)).toLocaleDateString()}</span>
              <br />
              {/*<button className="viewButton" onClick={() => { this.viewedLogChangeHandler(log._id) }} >View</button >*/}
              <button className="removeButton" onClick={() => { this.removeLogHandler(log._id) }} >Remove</button >

            </div>

            <div className={"logEntryAdd "}>
              <button className="addEntryButton" onClick={() => { this.addEntryHandler(log._id) }}>+</button>
              <br></br>
              <span className={"logEntryTimeDif"}>{timeDif < 60 ? timeDif + "min" : Math.round((timeDif / 60)) + "h"}</span>
            </div>
          </li >
        )
      })

      return (
        <React.Fragment>
          {tempLog}
          <li className="logEntry">
            <button key={"addLog"} onClick={this.addLogHandler}>+ Add new Log +</button>
          </li>
        </React.Fragment>
      );
    }
  }

  viewedLogChangeHandler = (viewedLog) => {
    this.setState({ viewedLog })
    if (window.innerWidth <= 900) { this.scrollToBottom() }
  }

  scrollToBottom = () => {
    this.pageEnd.scrollIntoView({ behavior: "smooth" })
  }

  render() {
    return (
      <div>
        {this.state.token ? <Header userData={this.state.userData} setLogin={this.setLogin} /> : <LoginPage setLogin={this.setLogin} />}
        {this.state.token &&
          <div>
            <hr />
            <div className="gridLogs">
              {this.state.token && this.logList()}
            </div>
            <div className="gridStats">
              <LogEntries viewedLog={this.state.viewedLog} logs={this.state.logs} url={url} token={this.state.token} />
              <Heatmap url={url} token={this.state.token} />
            </div>

          </div>
        }
        <div style={{ float: "left", clear: "both" }} //for scroll to bottom
          ref={(el) => { this.pageEnd = el; }}>
        </div>
      </div >
    );
  }
}

export default MainForm;

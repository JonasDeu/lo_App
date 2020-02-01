import React from "react";
import LoginPage from "./LoginPage"
import Header from "./Header"

//TODO No fetch if response.ok

class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: null,
      token: "",
      loggedIn: false,
      userData: null
    };
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
    this.getLogs()
  }

  async getLogs() {
    if (this.state.token) {
      try {
        const response = await fetch("https://lo-app-api.herokuapp.com/logs", {
          headers: {
            "Authorization": 'Bearer ' + this.state.token
          }
        })
        if (!response) {
          throw new Error('Server not accessible')
        }
        const logs = await response.json()
        this.setState({ logs })
        console.log(this.state.logs)
      } catch (e) {
        console.log(e)
      }
    }
  }

  addEntryHandler = async (id) => {
    try {
      const response = await fetch(("https://lo-app-api.herokuapp.com/logs/" + id), {
        method: 'POST',
        headers: {
          "Authorization": 'Bearer ' + this.state.token
        },
      })
      if (!response.ok) {
        throw new Error("Log can not deleted")
      }
      this.getLogs()
    } catch (e) {
      console.log(e)
    }
  };

  addLogHandler = async (event) => {
    event.preventDefault();
    var logPrompt = prompt("Please enter your name", "Bananas");
    if (logPrompt == null || logPrompt === "") {
      alert("Enter Name");
    } else {
      try {
        const response = await fetch("https://lo-app-api.herokuapp.com/logs", {
          method: 'POST',
          body: JSON.stringify({ name: logPrompt }),
          headers: {
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + this.state.token
          },
        })
        if (!response.ok) {
          throw new Error('Log can not be created')
        }
        this.getLogs()
      } catch (e) {
        console.log(e)
      }
    }
  };

  removeLogHandler = async (id) => {
    try {
      const response = await fetch(("https://lo-app-api.herokuapp.com/logs/" + id), {
        method: 'DELETE',
        headers: {
          "Authorization": 'Bearer ' + this.state.token
        },
      })
      if (!response.ok) {
        throw new Error("Log can not be deleted")
      }
      this.getLogs()
    } catch (e) {
      console.log(e)
    }
  }

  logList = () => {
    if (this.state.logs) {
      const temp = this.state.logs.map(log => {
        const timeDif = Math.abs(Math.round(((new Date(log.lastEntry) - Date.now()) / 60000)))
        return (
          <li className="logEntry" key={log._id}>
            <div onClick={() => { this.addEntryHandler(log._id) }}>
              <h2>{log.name}</h2>
              {log.numEntries + " "}
              <br />
              {timeDif < 60 ? timeDif + "min ago" : Math.round((timeDif / 60)) + "h ago"}
              <br />
              {"since " + (new Date(log.date)).toLocaleDateString()}
            </div>
            <button name={log.name} onClick={() => { this.removeLogHandler(log._id) }} >Remove</button >
          </li>
        )
      })
      return (
        <ul className="gridLogs">
          {temp}
          <li className="logEntry">
            <button key={"addLog"} onClick={this.addLogHandler}>+ Add new Log +</button>
          </li>
        </ul>
      );
    }
  }

  render() {
    return (
      <div>
        {this.state.token ? <Header userData={this.state.userData} setLogin={this.setLogin} /> : <LoginPage setLogin={this.setLogin} />}
        {this.state.token &&
          <div>
            <hr />
            <div className="gridMain">
              {this.state.token && this.logList()}
              <div>
                Placeholder
              </div>
            </div>
          </div>
        }
      </div >
    );
  }
}

export default MainForm;

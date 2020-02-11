import React from "react";
import LoginPage from "./LoginPage"
import Header from "./Header"
import LogEntries from "./LogEntries"


//TODO No fetch if response.ok

class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: null,
      token: "",
      log: null,
      logData: null,
      loggedIn: false,
      userData: null,
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
    var logPrompt = prompt("Please enter log name", "Bananas");
    if (logPrompt == null || logPrompt === "") {
      alert("Enter Log Name!");
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

  viewEntryHandler = async (id) => {
    try {
      const response1 = await fetch(("https://lo-app-api.herokuapp.com/logs/" + id), {
        method: 'GET',
        headers: {
          "Authorization": 'Bearer ' + this.state.token
        },
      })
      if (!response1.ok) {
        throw new Error("Can not get log")
      }
      const log = await response1.json()
      this.setState({ log })

      const response2 = await fetch(("https://lo-app-api.herokuapp.com/logs/" + id + "/day/10"), {
        method: 'GET',
        headers: {
          "Authorization": 'Bearer ' + this.state.token
        },
      })
      if (!response2.ok) {
        throw new Error("Can not get accumulated log")
      }
      const logData = await response2.json()
      this.setState({ logData })


      this.getLogs()
      this.scrollToBottom()
    } catch (e) {
      console.log(e)
    }
  }

  logList = () => {
    if (this.state.logs) {
      const temp = this.state.logs.map(log => {
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
              <button className="viewButton" onClick={() => { this.viewEntryHandler(log._id) }} >View</button >
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
        <ul className="gridLogs">
          {temp}
          <li className="logEntry">
            <button key={"addLog"} onClick={this.addLogHandler}>+ Add new Log +</button>
          </li>
        </ul>
      );
    }
  }

  scrollToBottom = () => {
    this.pageEnd.scrollIntoView({ behavior: "smooth" });
  }

  /*TODO use this for getLogs(), scroll to bottom
   componentDidUpdate(prevProps, prevState) {
    if (prevState.pokemons !== this.state.pokemons) {
      console.log('pokemons state has changed.')
    }
  }
  */


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
                <LogEntries log={this.state.log} logData={this.state.logData} />
              </div>
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

import React, { Component } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

class LogEntries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "day",
            chartSize: 10,
            log: null,
            logData: null,
            lastEntriesNumber: 5
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.viewedLog !== this.props.viewedLog | prevState.mode !== this.state.mode | prevState.chartSize !== this.state.chartSize) {
            this.fetchLogData(this.props.viewedLog)
        }
    }


    async fetchLogData(ID) {
        if (typeof ID == 'undefined' | !ID) { return null }

        try {
            const response1 = await fetch((this.props.url + "/logs/" + ID), {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + this.props.token
                },
            })
            if (!response1.ok) { throw new Error("Can not get log") }
            this.setState({ log: await response1.json() })

            if (this.state.chartSize < 1 | this.state.chartSize > 300) {
                return null
            }

            const response2 = await fetch((this.props.url + "/logs/" + ID + "/" + this.state.mode + "/" + this.state.chartSize), {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + this.props.token
                },
            })
            if (!response2.ok) { throw new Error("Can not get accumulated log") }
            this.setState({ logData: await response2.json() })

        } catch (e) {
            console.log(e)
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
    }

    chartChangeHandler = (mode, chartSize) => {
        this.setState({ chartSize, mode })
    }

    handleModeChange = (event) => {
        this.chartChangeHandler(event.target.value, this.state.chartSize)
    };

    handleChartSizeChange = (event) => {
        this.chartChangeHandler(this.state.mode, event.target.value)
    }

    lastFiveEntries = () => {
        if (typeof this.state.log === 'undefined' | !this.state.log) { return null }
        return (
            this.state.log.entries.slice(-this.state.lastEntriesNumber).reverse().map(entry => {
                return (
                    <li key={entry._id}>
                        <span role="img" aria-label="Emoji Pizza">🍕</span>
                        {new Date(entry.time).toLocaleString()}
                    </li>
                )
            })
        )
    }

    renderLineChart = () => {
        return (
            <ResponsiveContainer>
                <LineChart data={this.state.logData} margin={{ top: 5, right: 15, bottom: 10 }}>
                    <Line type="monotone" dataKey="data" stroke="#8884d8" isAnimationActive={true} />
                    <XAxis dataKey="day" interval="preserveStartEnd" tick={{ fontSize: 13 }} dy={10} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                    <CartesianGrid strokeDasharray="2 2" />
                    <Tooltip />
                </LineChart >
            </ResponsiveContainer >
        )
    }

    render() {
        return (
            <div>
                <h2>{this.state.log ? this.state.log.name : "Log Chart"} </h2>
                <div className="chartContainer">
                    {this.renderLineChart()}
                    <form className="viewEntryForm" onSubmit={this.handleSubmit}>
                        <div className="viewEntryFormControl">
                            <input name="Chart Size" type="number" min="1" max="500" value={this.state.chartSize} onChange={this.handleChartSizeChange} />
                        </div>
                        <div className="viewEntryFormControl">
                            <select name="Mode" value={this.state.mode} onChange={this.handleModeChange}>
                                <option name="Days" value="day">Days</option>
                                <option name="Hours" value="hour">Hours</option>
                            </select>
                        </div>

                    </form>
                </div>
                <div className="lastEntries">
                    Last {this.state.lastEntriesNumber} entries:
                    {this.lastFiveEntries()}
                </div>
            </div>
        );

    }
}

export default LogEntries;
import React, { Component } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const colors = [
    "#FDFDFD",
    "#B043D1",
    "#18E3C8",
    "#FF4971",
    "#FF8037",
    "#B043D1",
    "#3FDCEE"
]

class LogEntries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "day",
            chartSize: 10,
            log: null,
            logData: null,
            combLogData: null,
            lastEntriesNumber: 5
        };
    }

    async componentDidMount() {
        this.setState({ combLogData: await this.fetchCombLogChartData() })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.viewedLog !== this.props.viewedLog | prevState.mode !== this.state.mode | prevState.chartSize !== this.state.chartSize) {
            this.setState({ logData: await this.fetchLogChartData(this.props.viewedLog) })
            this.setState({ combLogData: await this.fetchCombLogChartData(this.props.viewedLog) })
            this.setState({ log: await this.fetchLog(this.props.viewedLog) })
        }
    }

    async fetchLog(ID) {
        if (typeof ID == 'undefined' | !ID) { return null }

        try {
            const response1 = await fetch((this.props.url + "/logs/" + ID), {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + this.props.token
                },
            })
            if (!response1.ok) { throw new Error("Can not get log") }
            return (await response1.json())
        } catch (e) {
            console.log(e)
        }
    }

    async fetchLogChartData(ID) {
        if (typeof ID == 'undefined' | !ID) { return null }
        if (this.state.chartSize < 1 | this.state.chartSize > 300) { return null }
        try {
            const response = await fetch((this.props.url + "/logs/" + ID + "/" + this.state.mode + "/" + this.state.chartSize), {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + this.props.token
                },
            })
            if (!response.ok) { throw new Error("Can not get accumulated log") }
            return await response.json()

        } catch (e) {
            console.log(e)
        }
    }

    async fetchCombLogChartData() {
        if (this.state.chartSize < 1 | this.state.chartSize > 300) { return null }
        try {
            const response = await fetch((this.props.url + "/logs/" + this.state.mode + "/" + this.state.chartSize), {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + this.props.token
                },
            })
            if (!response.ok) { throw new Error("Can not get accumulated log") }
            return await response.json()

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
        if (typeof this.state.log === 'undefined' | !this.state.log) { return null }
        return (
            <ResponsiveContainer>
                <LineChart data={this.state.logData} margin={{ top: 5, right: 15, bottom: 10 }}>
                    <Line type="monotone" dataKey={this.state.log.name} stroke="#8884d8" isAnimationActive={true} />
                    <XAxis dataKey="time" interval="preserveStartEnd" tick={{ fontSize: 13 }} dy={10} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                    <CartesianGrid strokeDasharray="2 2" />
                    <Tooltip />
                </LineChart >
            </ResponsiveContainer >
        )
    }


    renderColorfulLegendText(value, entry) {
        const { color } = entry;
        return <span style={{ color }}>{value}</span>;
    }

    renderCombLineChart = () => {
        if (typeof this.state.combLogData === 'undefined' | !this.state.combLogData) {
            return null
        }

        const lines = Object.keys(this.state.combLogData[0])
        lines.shift()

        const chartLines = []
        lines.forEach((line, index) => {
            chartLines.push(< Line type="monotone" dataKey={line} stroke={colors[index % 7]} isAnimationActive={true} />)
        })

        console.log(this.state.combLogData)
        return (
            < ResponsiveContainer >
                <LineChart data={this.state.combLogData} margin={{ top: 5, right: 15, bottom: 10 }}>
                    {chartLines}

                    <XAxis dataKey="time" interval="preserveStartEnd" tick={{ fontSize: 13 }} dy={10} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                    <CartesianGrid strokeDasharray="2 2" />
                    <Tooltip />
                    <Legend formatter={this.renderColorfulLegendText} />
                </LineChart >
            </ResponsiveContainer >
        )
    }

    render() {
        return (
            <div>
                <div className="chartContainer">
                    {this.renderCombLineChart()}
                    <form className="viewEntryForm" onSubmit={this.handleSubmit}>
                        <input className="viewEntryFormControl" name="Chart Size" type="number" min="1" max="500" value={this.state.chartSize} onChange={this.handleChartSizeChange} />
                        <select className="viewEntryFormControl" name="Mode" value={this.state.mode} onChange={this.handleModeChange}>
                            <option name="Days" value="day">Days</option>
                            <option name="Hours" value="hour">Hours</option>
                        </select>
                    </form>
                </div>

                {/*
                <h2>{this.state.log ? this.state.log.name : "Log Chart"} </h2>
                <div className="chartContainer">
                    {this.renderLineChart()}

                </div>
                

                <div className="lastEntries">
                    Last {this.state.lastEntriesNumber} entries:
                    {this.lastFiveEntries()}
                </div>
                */}
            </div>
        );

    }
}

export default LogEntries;
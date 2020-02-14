import React, { Component } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

class LogEntries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "day",
            chartSize: 10
        };
    }

    handleSubmit = (event) => {
        event.preventDefault()
    }

    handleModeChange = (event) => {
        this.setState({
            mode: event.target.value,
        });
        this.props.viewChangeHandler(event.target.value, this.state.chartSize)
    };

    handlechartSizeChange = (event) => {
        this.setState({
            chartSize: event.target.value,
        });
        this.props.viewChangeHandler(this.state.mode, event.target.value)
    }

    render() {
        if (typeof this.props.logData == 'undefined' | !this.props.logData | typeof this.props.log == 'undefined' | !this.props.log) {
            return null
        }

        const renderLineChart = (
            <ResponsiveContainer>
                <LineChart data={this.props.logData} margin={{ top: 5, right: 15, bottom: 10 }}>
                    <Line type="monotone" dataKey="data" stroke="#8884d8" isAnimationActive={true} />
                    <XAxis dataKey="day" interval="preserveStartEnd" tick={{ fontSize: 13 }} dy={10} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
                    <CartesianGrid strokeDasharray="2 2" />
                    <Tooltip />
                </LineChart >
            </ResponsiveContainer >
        );

        const lastEntriesNumber = 5
        const lastFiveEntries = this.props.log.entries.slice(-lastEntriesNumber).reverse().map(entry => {
            return (
                <li key={entry._id}>
                    <span role="img" aria-label="Emoji Pizza">🍕</span>
                    {new Date(entry.time).toLocaleString()}
                </li>
            )
        })

        return (
            <div>
                <h2>{this.props.log.name}</h2>

                <div className="chartContainer">
                    {renderLineChart}
                    <form className="viewEntryForm" onSubmit={this.handleSubmit}>
                        <div className="viewEntryFormControl">
                            <input name="Chart Size" type="number" min="1" max="500" value={this.state.chartSize} onChange={this.handlechartSizeChange} />
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
                    Last {lastEntriesNumber} entries:
                    {lastFiveEntries}
                </div>
            </div>
        );

    }
}

export default LogEntries;
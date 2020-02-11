import React, { Component } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

class LogEntries extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (typeof this.props.logData == 'undefined' | !this.props.logData | typeof this.props.log == 'undefined' | !this.props.log) {
            return null
        }

        console.log(this.props.logData)

        const renderLineChart = (
            <ResponsiveContainer>
                <LineChart data={this.props.logData} margin={{ top: 5, right: 15, bottom: 10 }}>
                    <Line type="monotone" dataKey="data" stroke="#8884d8" />
                    <XAxis dataKey="day" angle={30} interval="preserveStartEnd" tick={{ fontSize: 14 }} dy={10} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 14 }} />
                    <CartesianGrid strokeDasharray="2 2" />
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
                </div>
                Last {lastEntriesNumber} entries:
                {lastFiveEntries}
            </div>
        );

    }
}

export default LogEntries;
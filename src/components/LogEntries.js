import React, { Component } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from "moment"

class LogEntries extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (typeof this.props.log == 'undefined') {
            return null
        }

        if (!this.props.log) {
            return null
        }

        //////////////Put this in API
        const curTime = new Date()

        const chartSize = 7

        const data = new Array(chartSize).fill(0);
        this.props.log.entries.map((entry, index) => {
            const tempDate = new Date(moment(this.props.log.entries[index].time).startOf('day').toString())
            if (Math.floor((curTime.getTime() - tempDate.getTime()) / 1.65344e+9) < 1) {
                data[Math.ceil((curTime.getTime() - tempDate.getTime()) / 8.64e+7) - 1] += 1
            }
            return null
        })

        const labels = new Array(chartSize)
        for (var i = 0; i < labels.length; i++) {
            labels[i] = moment(new Date(curTime.getTime() - (i * 8.64e+7))).format("DD.MM.");
        }

        const merge = labels.map((day, index) => {
            return { day, data: data[index] }
        })

        merge.reverse()
        /////////////////////

        console.log(merge)



        const renderLineChart = (
            <ResponsiveContainer>
                <LineChart data={merge} margin={{ top: 5, right: 30, bottom: 5 }}>
                    <Line type="monotone" dataKey="data" stroke="#8884d8" />
                    <XAxis dataKey="day" interval={0} angle={30} tick={{ fontSize: 14 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 14 }} />
                    <CartesianGrid strokeDasharray="2 2" />
                    <Tooltip />
                </LineChart >
            </ResponsiveContainer >
        );

        //new Date(entry.time).getTime() for real data
        const lastEntriesNumber = 5
        const lastFiveEntries = this.props.log.entries.slice(0, lastEntriesNumber).map(entry => {
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
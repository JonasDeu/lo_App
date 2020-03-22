import React, { Component } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

class LogView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			mode: "day",
			chartSize: 7,
			log: null,
			logData: null,
			lastEntriesNumber: 5
		}
	}

	async componentDidMount() {
		this.setState({
			logData: await this.fetchLogChartData(this.props.viewedLog)
		})
		this.setState({ log: await this.fetchLog(this.props.viewedLog) })
	}

	async componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.viewedLog !== this.props.viewedLog ||
			prevState.mode !== this.state.mode ||
			prevState.chartSize !== this.state.chartSize ||
			prevProps.change !== this.props.change
		) {
			this.setState({
				logData: await this.fetchLogChartData(this.props.viewedLog)
			})
			this.setState({ log: await this.fetchLog(this.props.viewedLog) })
		}
	}

	async fetchLog(ID) {
		if (typeof ID === "undefined" || !ID) {
			return null
		}

		try {
			const response1 = await fetch(this.props.url + "/logs/" + ID, {
				method: "GET",
				headers: {
					Authorization: "Bearer " + this.props.token
				}
			})
			if (!response1.ok) {
				throw new Error("Can not get log")
			}
			return await response1.json()
		} catch (e) {
			console.log(e)
		}
	}

	async fetchLogChartData(ID) {
		if (typeof ID === "undefined" || !ID) {
			return null
		}
		if (this.state.chartSize < 1 || this.state.chartSize > 300) {
			return null
		}
		try {
			const response = await fetch(
				this.props.url + "/logs/" + ID + "/" + this.state.mode + "/" + this.state.chartSize,
				{
					method: "GET",
					headers: {
						Authorization: "Bearer " + this.props.token
					}
				}
			)
			if (!response.ok) {
				throw new Error("Can not get accumulated log")
			}
			return await response.json()
		} catch (e) {
			console.log(e)
		}
	}

	renderLineChart = () => {
		if (typeof this.state.log === "undefined" || !this.state.log) {
			return null
		}
		return (
			<ResponsiveContainer>
				<LineChart data={this.state.logData} margin={{ top: 5, right: 15, bottom: 10 }}>
					<Line type="monotone" dataKey={this.state.log.name} stroke="#8884d8" isAnimationActive={true} />
					<XAxis dataKey="time" interval="preserveStartEnd" tick={{ fontSize: 13 }} dy={10} />
					<YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
					<CartesianGrid strokeDasharray="2 2" />
					<Tooltip />
				</LineChart>
			</ResponsiveContainer>
		)
	}

	lastFiveEntries = () => {
		if (typeof this.state.log === "undefined" || !this.state.log) {
			return null
		}
		return this.state.log.entries
			.slice(-this.state.lastEntriesNumber)
			.reverse()
			.map(entry => {
				return <li key={entry._id}>{new Date(entry.time).toLocaleString()}</li>
			})
	}

	entryTitle = () => {
		if (typeof this.state.log === "undefined" || !this.state.log) {
			return null
		}
		console.log(this.state.log)
		const tempDate = new Date(this.state.log.date)
		return (
			" " +
			this.state.log.numEntries +
			" entries since " +
			tempDate.getUTCDate() +
			"." +
			tempDate.getMonth() +
			"." +
			tempDate.getFullYear()
		)
	}

	handleSubmit = event => {
		event.preventDefault()
	}

	handleModeChange = event => {
		this.setState({ mode: event.target.value })
	}

	handleChartSizeChange = event => {
		this.setState({ chartSize: event.target.value })
	}

	render() {
		return (
			<div className="logViewContainer">
				<h2>{this.state.log ? this.state.log.name : "Log Chart"} </h2>
				{this.entryTitle()}
				<div className="logViewChart">
					<button
						className="removeButton"
						onClick={() => {
							this.props.removeLogHandler(this.state.log._id)
						}}>
						✕
					</button>
					<div className="logViewChartContainer">{this.renderLineChart()}</div>
					<form className="viewEntryForm" onSubmit={this.handleSubmit}>
						<input
							className="viewEntryFormControl"
							name="Chart Size"
							type="number"
							min="1"
							max="500"
							value={this.state.chartSize}
							onChange={this.handleChartSizeChange}
						/>
						<select
							className="viewEntryFormControl"
							name="Mode"
							value={this.state.mode}
							onChange={this.handleModeChange}>
							<option name="Days" value="day">
								Days
							</option>
							<option name="Hours" value="hour">
								Hours
							</option>
						</select>
					</form>
				</div>
				<div className="logViewEntriesContainer">
					<h4>Last {this.state.lastEntriesNumber} entries:</h4>
					{this.lastFiveEntries()}
				</div>
			</div>
		)
	}
}

export default LogView

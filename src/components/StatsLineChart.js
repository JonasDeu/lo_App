import React, { Component } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

const colors = ["#FDFDFD", "#B043D1", "#18E3C8", "#FF4971", "#FF8037", "#B043D1", "#3FDCEE"]

class StatsLineChart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			mode: "day",
			chartSize: 20,
			log: null,
			logData: null,
			combLogData: null,
			lastEntriesNumber: 5
		}
	}

	async componentDidUpdate(prevProps, prevState) {
		if (
			prevState.mode !== this.state.mode ||
			prevState.chartSize !== this.state.chartSize ||
			prevProps.change !== this.props.change
		) {
			this.setState({
				combLogData: await this.fetchCombLogChartData()
			})
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

	async fetchCombLogChartData() {
		if (this.state.chartSize < 1 || this.state.chartSize > 300) {
			return null
		}
		try {
			const response = await fetch(this.props.url + "/logs/" + this.state.mode + "/" + this.state.chartSize, {
				method: "GET",
				headers: {
					Authorization: "Bearer " + this.props.token
				}
			})
			if (!response.ok) {
				throw new Error("Can not get accumulated log")
			}
			return await response.json()
		} catch (e) {
			console.log(e)
		}
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

	renderColorfulLegendText(value, entry) {
		const { color } = entry
		return <span style={{ color }}>{value}</span>
	}

	renderCombLineChart = () => {
		if (typeof this.state.combLogData === "undefined" || !this.state.combLogData) {
			return null
		}

		const lines = Object.keys(this.state.combLogData[0])
		lines.shift()

		const chartLines = []
		lines.forEach((line, index) => {
			chartLines.push(
				<Line type="monotone" dataKey={line} stroke={colors[index % 7]} isAnimationActive={true} key={index} />
			)
		})

		return (
			<ResponsiveContainer>
				<LineChart data={this.state.combLogData} margin={{ top: 5, right: 15, bottom: 10 }}>
					{chartLines}

					<XAxis dataKey="time" interval="preserveStartEnd" tick={{ fontSize: 13 }} dy={10} />
					<YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
					<CartesianGrid strokeDasharray="2 2" />
					<Tooltip />
					<Legend formatter={this.renderColorfulLegendText} />
				</LineChart>
			</ResponsiveContainer>
		)
	}

	render() {
		return (
			<React.Fragment>
				{this.props.logs && this.props.logs.length !== 0 && (
					<div className="chartContainer">
						<h2>Timeline Combined</h2>
						<div className="lineChart">{this.renderCombLineChart()}</div>
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
				)}
			</React.Fragment>
		)
	}
}

export default StatsLineChart

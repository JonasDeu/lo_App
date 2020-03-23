import React, { Component } from "react"

const getGradientColor = value => {
	const color1 = "B043D1"
	const color2 = "282A36"
	const ratio = Math.abs(value)
	const hex = function(x) {
		x = x.toString(16)
		return x.length === 1 ? "0" + x : x
	}

	const r = Math.ceil(
		parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio)
	)
	const g = Math.ceil(
		parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio)
	)
	const b = Math.ceil(
		parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio)
	)

	return hex(r) + hex(g) + hex(b)
}

class StatsHeatmap extends Component {
	constructor(props) {
		super(props)
		this.state = {
			mode: "day",
			dataTime: 35,
			heatData: null
		}
	}

	async componentDidMount() {
		//this.setState({ heatData: await this.fetchHeatData() })
	}

	async componentDidUpdate(prevProps, prevState) {
		if (
			prevState.mode !== this.state.mode ||
			prevState.dataTime !== this.state.dataTime ||
			prevProps.change !== this.props.change
		) {
			this.setState({ heatData: await this.fetchHeatData() })
		}
	}

	async fetchHeatData() {
		if (this.state.dataTime < 1 || this.state.dataTime > 300) {
			return null
		}
		try {
			const response = await fetch(
				this.props.url + "/logs/correlations/" + this.state.mode + "/" + this.state.dataTime,
				{
					method: "GET",
					headers: {
						Authorization: "Bearer " + this.props.token
					}
				}
			)
			if (!response.ok) {
				throw new Error("Can not get heat data")
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

	handleDataTimeChange = event => {
		this.setState({ dataTime: event.target.value })
	}

	renderHeatChart = () => {
		if (typeof this.state.heatData === "undefined" || !this.state.heatData) {
			return null
		}

		const heading = this.state.heatData.labels.map((label, labelIndex) => {
			return <th key={labelIndex}>{label}</th>
		})

		const body = this.state.heatData.labels.map((label, labelIndex) => {
			const values = this.state.heatData.correlations[labelIndex].map((value, valueIndex) => {
				let colorValue = Math.abs(value)
				colorValue < 0.9 ? (colorValue = 0) : (colorValue = (colorValue - 0.9) * 10)
				var style = {
					backgroundColor: "#" + getGradientColor(colorValue)
				}
				if (labelIndex === valueIndex) {
					return <td key={valueIndex}>-</td>
				}
				if (value === null) {
					return <td key={valueIndex}>-</td>
				}
				return (
					<td style={style} key={valueIndex}>
						{" "}
						{parseFloat(value).toFixed(2)}
					</td>
				)
			})
			return (
				<tr key={labelIndex}>
					<th>{label}</th>
					{values}
				</tr>
			)
		})

		return (
			<React.Fragment>
				<h2>Correlation Matrix</h2>
				<table className="heatMap">
					<thead>
						<tr>
							<th></th>
							{heading}
						</tr>
					</thead>
					<tbody>{body}</tbody>
				</table>
			</React.Fragment>
		)
	}

	render() {
		return (
			<React.Fragment>
				{this.state.heatData && this.state.heatData.labels.length !== 0 && (
					<div className="heatMapContainer">
						{this.renderHeatChart()}
						<form className="heatMapForm" onSubmit={this.handleSubmit}>
							<input
								className="viewEntryFormControl"
								name="Chart Size"
								type="number"
								min="1"
								max="500"
								value={this.state.dataTime}
								onChange={this.handleDataTimeChange}
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

export default StatsHeatmap

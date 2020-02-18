import React, { Component } from "react"

const getGradientColor = (value) => {
    var color1 = '18E3C8'
    var color2 = '282A36'

    var ratio = Math.abs(value)
    var hex = function (x) {
        x = x.toString(16)
        return (x.length === 1) ? '0' + x : x
    };

    var r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
    var g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
    var b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));

    return hex(r) + hex(g) + hex(b);
}

class Heatmap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "day",
            dataTime: 35,
            heatData: null
        };
    }

    async componentDidMount() {
        this.setState({ heatData: await this.fetchHeatData() })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.mode !== this.state.mode | prevState.dataTime !== this.state.dataTime) {
            this.setState({ heatData: await this.fetchHeatData() })

        }
    }

    async fetchHeatData() {
        if (this.state.dataTime < 1 | this.state.dataTime > 300) { return null }
        try {
            const response = await fetch((this.props.url + "/logs/correlations/" + this.state.mode + "/" + this.state.dataTime), {
                method: 'GET',
                headers: {
                    "Authorization": 'Bearer ' + this.props.token
                },
            })
            if (!response.ok) { throw new Error("Can not get heat data") }
            return await response.json()

        } catch (e) {
            console.log(e)
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
    }

    handleModeChange = (event) => {
        this.setState({ mode: event.target.value })
    };

    handleDataTimeChange = (event) => {
        this.setState({ dataTime: event.target.value })
    }

    renderHeatChart = () => {
        if (typeof this.state.heatData === 'undefined' | !this.state.heatData) {
            return null
        }

        const heading = this.state.heatData.labels.map((label) => {
            return (
                <th>{label}</th>
            )
        })

        const body = this.state.heatData.labels.map((label, labelIndex) => {
            const values = this.state.heatData.correlations[labelIndex].map((value) => {
                var style = {
                    backgroundColor: "#" + getGradientColor(value)
                }
                return <td style={style}> {parseFloat(value).toFixed(2)}</td >
            })
            return (
                <tr>
                    <th>{label}</th>
                    {values}
                </tr>
            )
        })

        return (
            <table className="heatMap" >
                <thead>
                    <tr>
                        <th>Correlation</th>
                        {heading}
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <div>
                <div className="heatMapContainer">
                    {this.renderHeatChart()}
                    <form className="heatMapForm" onSubmit={this.handleSubmit}>
                        <input className="viewEntryFormControl" name="Chart Size" type="number" min="1" max="500" value={this.state.dataTime} onChange={this.handleDataTimeChange} />
                        <select className="viewEntryFormControl" name="Mode" value={this.state.mode} onChange={this.handleModeChange}>
                            <option name="Days" value="day">Days</option>
                            <option name="Hours" value="hour">Hours</option>
                        </select>
                    </form>
                </div>
            </div>
        );
    }
}

export default Heatmap;
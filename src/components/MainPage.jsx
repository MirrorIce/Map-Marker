import React from 'react';
const ol = window.ol;

class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.handleMap = this.handleMap.bind(this);
    }
    state = {
        map: undefined,
        email: "",
        startVal: "No query called yet",
        endVal: "No query called yet",
        startTime : "0",
        endTime: "0",
        ip: "192.168.43.241",
        sd:"",
        ed:""
    }
    styles =
        {
            height: "400px",
            width: "50%",
            backgroundColor: "white",
            margin: "0 auto",
            padding: "10px",
            border: "2px solid black"
        }
    buttonStyle =
        {
            backgroundColor: "white",
            border: "1px solid rgb(200,200,200)",
            padding: "2px"
        }

    handleMailInput = (e) => {
        e.preventDefault();
        this.setState({ email: e.target.value });
    }
    handleStartDateInput = (e) =>{
        e.preventDefault();
        this.setState({sd:e.target.value});
    }

    handleEndDateInput = (e) =>{
        e.preventDefault();
        this.setState({ed:e.target.value});
    }

    checkStartDate = (e) =>{
        console.log(new Date(this.state.sd));
    }
    handleMap = () => {
        var self = this;
        fetch("http://" + self.state.ip + ":3000/getlocation/?id=" + this.state.email+"&sd="+this.state.sd+"&ed="+this.state.ed, {
            mode: "cors",
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: "include"
        }).then(function (response) {
            console.log(response);
            return response.json();
        }).then(function (res) {

            if (res.length > 0) {
                if (self.state.map != undefined) {
                    //Remove all previous layers
                    const removeLayer = [...self.state.map.getLayers().getArray()]
                    removeLayer.forEach((layer) => self.state.map.removeLayer(layer))
                    var layers = [];
                    for (var i = 0; i < res.length; i++) {
                        var layer = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                features: [
                                    new ol.Feature({
                                        geometry: new ol.geom.Point(ol.proj.fromLonLat([res[i].lon, res[i].lat]))
                                    })
                                ]
                            })
                        });
                        layers.push(layer);
                    }
                    self.state.map.getView().setCenter(ol.proj.fromLonLat([23.62, 46.77]));

                    self.state.map.addLayer(new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }))
                    for (var i = 0; i < layers.length; i++)
                        self.state.map.addLayer(layers[i]);
                    self.setState({ startVal: res[0].lon + " " + res[0].lat });
                    self.setState({ endVal: res[res.length - 1].lon + " " + res[res.length - 1].lat });
                    self.state.map.render();
                }
                else if (self.state.map == undefined) {
                    var layers = [];
                    for (var i = 0; i < res.length; i++) {
                        var layer = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                features: [
                                    new ol.Feature({
                                        geometry: new ol.geom.Point(ol.proj.fromLonLat([res[i].lon, res[i].lat]))
                                    })
                                ]
                            })
                        });
                        layers.push(layer);
                    }


                    self.state.map = new ol.Map({
                        target: 'map',
                        layers: [
                            new ol.layer.Tile({
                                source: new ol.source.OSM()
                            }), layer
                        ],
                        view: new ol.View({
                            center: ol.proj.fromLonLat([23.62, 46.77]),
                            zoom: 10
                        })
                    });
                    console.log(res[0].lon + " " + res[0].lat);
                    var startDate = new Date(0);
                    startDate.setUTCSeconds(res[0].timestamp/1000);
                    var endDate = new Date(0);
                    endDate.setUTCSeconds(res[res.length - 1].timestamp / 1000);
                    self.setState({ startVal: res[0].lon + " " + res[0].lat });
                    self.setState({ endVal: res[res.length - 1].lon + " " + res[res.length - 1].lat });
                    self.setState({startTime: startDate.toString()});
                    self.setState({endTime: endDate.toString()});
                    //for (var i = 0; i < layers.length; i++)
                       // self.state.map.addLayer(layers[i]);
                }
            }
            else {
                self.setState({ startVal: "User not found!" });
                self.setState({ endVal: "User not found!" });
                self.setState({startTime: 0});
                self.setState({endTime: 0});
            }
        });
    }
    render() {
        return (
            <div style={{ backgroundColor: "rgb(10,10,10)" }}>
                <head>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.0.1/css/ol.css" type="text/css" />
                </head>

                <div>
                    <script>

                    </script>
                    <h1 style={{ margin: "0 auto", width: "20%", color: "white" }}>Map Tracker</h1>
                    <div style={this.styles} id='map'></div>

                    <div style={{ width: "20%", margin: "0 auto", marginTop: '10px', boxShadow: "0px 0px 5px black", backgroundColor: "white", padding: "10px" }}>
                        <input type="text" name="" id="" placeholder="Email" onChange={(e) => { this.handleMailInput(e) }} value={this.state.email} />
                        <button style={this.buttonStyle} onClick={this.handleMap} value="Map IT!">Map ME!</button>

                        <p>Start destination - {this.state.startTime}</p>
                        <p id="startDestination" > {this.state.startVal } </p>
                        <p >End destination - {this.state.endTime}</p>
                        <p id="endDestination"> {this.state.endVal}</p>
                        <p><strong>Start date input</strong></p>
                        <input type="date" onChange = { (e) => {this.handleStartDateInput(e)}} />
                        <p><strong>End date input</strong></p>
                        <input type="date" onChange = { (e) => {this.handleEndDateInput(e)}} />
                    </div>

                    <button onClick = {this.checkStartDate} > Test </button>
                </div>

            </div>
        )
    }
}


export default MainPage;
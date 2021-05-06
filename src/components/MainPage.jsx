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
        startVal: "",
        endVal: "",
        startTime : "Time:NA",
        endTime: "Time:NA",
        sd:"",
        ed:""
    }
    handleMailInput = (e) => {
        e.preventDefault();
        this.setState({ email: e.target.value.toLowerCase() });
    }
    handleStartDateInput = (e) =>{
        e.preventDefault();
        this.setState({sd:e.target.value});
    }

    handleEndDateInput = (e) =>{
        e.preventDefault();
        this.setState({ed:e.target.value});
    }
    handleMap = () => {
        var self = this;
        fetch("/getlocation/?id=" + this.state.email+"&sd="+this.state.sd+"&ed="+this.state.ed, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: "include"
        }).then(function (response) {
            return response.json();
        }).then(function(res) {
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
                    var startDate = new Date(0);
                    startDate.setUTCSeconds(res[0].timestamp/1000);
                    var endDate = new Date(0);
                    endDate.setUTCSeconds(res[res.length - 1].timestamp / 1000);
                    self.setState({ startVal: res[0].lon + " " + res[0].lat });
                    self.setState({ endVal: res[res.length - 1].lon + " " + res[res.length - 1].lat });
                    self.setState({startTime: startDate.toLocaleString()});
                    self.setState({endTime: endDate.toLocaleString()});
                    //for (var i = 0; i < layers.length; i++)
                       // self.state.map.addLayer(layers[i]);
                }
            }
            else {
                self.setState({ startVal: "User not found!" });
                self.setState({ endVal: "User not found!" });
                self.setState({startTime: "Time:NA"});
                self.setState({endTime: "Time:NA"});
            }
        });
    }
    render() {
        return (
            <div>
                <head>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.0.1/css/ol.css" type="text/css" />
                </head>

                <div id = "mainPageContent">  
                    <div id='map'></div>

                    <div id = "mapQueryFields">
                        <input type="text" name="" id="" placeholder="Email" onChange={(e) => { this.handleMailInput(e) }} value={this.state.email} />
                        <p><strong>Starting date</strong></p>
                        <input placeholder = "Start date" type="date" onChange = { (e) => {this.handleStartDateInput(e)}} />
                        <p><strong>Ending date</strong></p>
                        <input type="date" onChange = { (e) => {this.handleEndDateInput(e)}} />
                        <button onClick={this.handleMap} value="Map IT!">Map ME!</button>

                        <p className = "locationTitle"><strong>First location</strong></p>
                        <p>{this.state.startTime} - {this.state.startVal } </p>
                        <p className = "locationTitle"><strong>Last location</strong></p>
                        <p >{this.state.endTime} - {this.state.endVal}</p>
                    </div>
                </div>

            </div>
        )
    }
}


export default MainPage;
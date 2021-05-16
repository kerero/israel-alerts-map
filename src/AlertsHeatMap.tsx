import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MapGL, { Source, Layer } from 'react-map-gl'

import { loadAlertData, prepereGeoData } from './data'

type AlertsHeatMapState = {
  alerts: any;
  geoAlerts: any;
  viewport: {latitude: number; longitude: number; zoom: number};
}

export default class AlertHeatmap extends Component<{}, AlertsHeatMapState> {
  constructor(props) {
    super(props)
    this.state = {
      alerts: {},
      geoAlerts: {},
      viewport: {
        latitude: 31.57566616888998,
        longitude: 34.69456108481244,
        zoom: 8.5,
      },
    }
  }

  async componentDidMount() {
    const alerts = await loadAlertData()
    const geoAlerts = prepereGeoData(alerts)
    this.setState({
      alerts,
      geoAlerts,
    })
  }

  render() {
    return (
      <MapGL
        // eslint-disable-next-line react/destructuring-assignment
        {...this.state.viewport}
        onViewportChange={(viewport) => {
          this.setState({ viewport })
        }}
        width="100%"
        height="100vh"
        maxZoom={9.5}
        minZoom={8.5}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        <Source type="geojson" data={this.state.geoAlerts.data}>
          <Layer {...{
            type: 'heatmap',
            paint: {
              'heatmap-weight': {
                property: 'count',
                type: 'exponential',
                stops: [
                  [1, 0],
                  [62, 1],
                ],
              },
              'heatmap-radius': 50,
              'heatmap-opacity': 0.3,
            },
          }}
          />
        </Source>
      </MapGL>
    )
  }
}

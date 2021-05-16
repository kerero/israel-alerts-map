import React, { useState } from 'react'
import DateRange from '@wojtekmaj/react-daterange-picker'
import AlertsHeatMap from './AlertsHeatMap'
import './App.css'
import { getAlertsDateRange, loadAlertData, prepereGeoData } from './data'

// TODO: feagure out how to hanlde the token

export default function App() {
  const alertsDateRange = getAlertsDateRange()
  const [value, onChange] = useState([alertsDateRange.start, alertsDateRange.end])

  const alertData = loadAlertData(value[0], value[1])
  const geoData = prepereGeoData(alertData)

  return (
    <div>
      <DateRange
        className="infoText"
        onChange={(v) => {
          if (v && v[0] && v[1]) {
            onChange(v)
          } else {
            onChange([alertsDateRange.start, alertsDateRange.end])
          }
        }}
        value={value}
        format="dd/MM/yy"
        maxDate={alertsDateRange.end}
        minDate={alertsDateRange.start}
      />

      <AlertsHeatMap geoData={geoData.data} />
    </div>
  )
}

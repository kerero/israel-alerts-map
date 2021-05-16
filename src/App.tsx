import React, { useState } from 'react'
import DateRange from '@wojtekmaj/react-daterange-picker'
import AlertsHeatMap from './AlertsHeatMap'
import './App.css'
import { getAlertsDateRange, loadAlertData, prepareGeoData } from './data'

export default function App() {
  const alertsDateRange = getAlertsDateRange()
  const [value, onChange] = useState([alertsDateRange.start, alertsDateRange.end])

  const alertData = loadAlertData(value[0], value[1])
  const geoData = prepareGeoData(alertData)

  return (
    <div>
      <div className="absolutePosition">

        <DateRange
          className="datePicker"
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
        <p className="infoText">{geoData.successfulMapping + geoData.failedMappings} Alerts</p>
        <p className="infoText tooltip">
          ⚠
          <span className="tooltiptext">Failed to map {geoData.failedMappings} alerts</span>
        </p>
      </div>

      <AlertsHeatMap geoData={geoData.data} />
    </div>
  )
}

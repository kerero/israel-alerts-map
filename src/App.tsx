import React, { useState } from 'react'
import DateRange from '@wojtekmaj/react-daterange-picker'
import AlertsHeatMap from './HeatMap'
import './App.css'
import { getAlertsDateRange, loadAlertData, prepareGeoData } from './data'
import BarChart from './BarChart'

export default function App() {
  const alertsDateRange = getAlertsDateRange()
  const threeDaysBack = new Date(alertsDateRange.end)
  threeDaysBack.setDate(threeDaysBack.getDate() - 4)

  const [value, onChange] = useState([threeDaysBack, alertsDateRange.end])

  const alertData = loadAlertData(value[0], value[1])
  const geoData = prepareGeoData(alertData)
  const sortedAlerts = Object.entries(alertData).sort((a, b) => b[1] - a[1])

  return (
    <div>
      <div className="absolutePosition">
        <div className="flex">
          <BarChart alertData={sortedAlerts} />
          <div className="datePickerContainer">
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
          </div>
        </div>
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

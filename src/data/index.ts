/* eslint-disable no-param-reassign */

import citiesGeoJson from './cities.geo.json'
import localAlertsData from './alertsHistory.json'

export function getAlertsDateRange() {
  return {
    end: new Date(localAlertsData[0].alertDate),
    start: new Date(localAlertsData[localAlertsData.length - 1].alertDate),
  }
}

export function loadAlertData(start: Date, end: Date): Record<string, number> {
  // const LANG = 'he'
  // const url = `https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=${LANG}&mode=3`
  // const corsWrapper = `http://www.whateverorigin.org/get?url=${url}`

  // !! load data locally, oref.org.il is only accessible within israel
  // May use `npm run updateAlertHistory` to update local data
  let alertsHistory: any[] = Object.values(localAlertsData) // (await axios.get(corsWrapper))

  // filter relevant dates
  if (start && end) {
    alertsHistory = alertsHistory.filter((alert) => {
      const alertDate = new Date(alert.alertDate)
      return alertDate >= start && alertDate <= end
    })
  }

  const alertsCount = {}
  alertsHistory.forEach((e: any) => {
    let name: string = e.data || '' // avert bad data

    // Try to standardize cities names
    name = name.split(', ')[0]
      .replaceAll("''", '"')
      .replace(' והפזורה', '')
    if (name.includes('אשקלון')) name = 'אשקלון'

    if (alertsCount[name]) {
      alertsCount[name] += 1
    } else {
      alertsCount[name] = 1
    }
  })

  return alertsCount
}

export function prepareGeoData(alertData: object):
{ data: object; failedMappings: number; successfulMapping: number } {
  let failedMappings = 0
  let successfulMapping = 0
  const cities = JSON.parse(JSON.stringify(citiesGeoJson))

  Object.keys(alertData).forEach((l) => {
    const geoCity = cities.features.find((c) => c.properties.name === l
        || c.properties.name.replaceAll(' ', '').split('-')[0] === l.replaceAll(' ', '') // try to map cities with different hyphen and spacing arrangements
        || c.properties.name === l.split(' ו')[0] // Try to map coupled cities
        || c.properties.name === l.split(' תעשייה ')[1] /* Try to map industrial parks/zones */
        || c.properties.name.replaceAll(' ', '') === l.replaceAll(' ', '').split('-')[0]) as any
    if (geoCity) {
      geoCity.properties.count = alertData[l]
      successfulMapping += alertData[l]
    } else {
      failedMappings += alertData[l]
    }
  })

  cities.features = cities.features.filter((c: any) => c.properties.count)

  return { data: cities, failedMappings, successfulMapping }
}

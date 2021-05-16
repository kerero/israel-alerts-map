/* eslint-disable no-param-reassign */

import citiesGeoJson from './cities.geo.json'
import alertsMock from './alertsHistory.json'

export function getAlertsDateRange() {
  return {
    end: new Date(alertsMock[0].datetime),
    start: new Date(alertsMock[alertsMock.length - 1].datetime),
  }
}

export /* async */ function loadAlertData(start: Date, end: Date): /* Promise< */object/* > */ {
  // const LANG = 'he'
  // const url = `https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=${LANG}&mode=3`
  // const corsWrapper = `http://www.whateverorigin.org/get?url=${url}`
  let alertHistory: any[] = Object.values(alertsMock) // (await axios.get(corsWrapper))
  if (start && end) {
    alertHistory = alertHistory.filter((alert) => {
      const alertDate = new Date(alert.datetime)
      return alertDate >= start && alertDate <= end
    })
  }

  const alertData = {}
  alertHistory.forEach((e: any) => {
    let name: string = e.data || ''
    name = name.split(', ')[0]
      .replaceAll("''", '"')
      .replace(' והפזורה', '')
    if (name.includes('אשקלון')) name = 'אשקלון'

    if (alertData[name]) {
      alertData[name] += 1
    } else {
      alertData[name] = 1
    }
  })
  return alertData
}

export function prepareGeoData(alertData: object):
{ data: object; failedMappings: number; successfulMapping: number } {
  let failedMappings = 0
  let successfulMapping = 0
  const cities = JSON.parse(JSON.stringify(citiesGeoJson))

  Object.keys(alertData).forEach((l) => {
    const geoCity = cities.features.find((c) => c.properties.name === l
        || c.properties.name.replace(' ', '').split('-')[0] === l.replace(' ', '') // try to map cities with different hyphen and spacing arrangements
        || c.properties.name === l.split(' ו')[0] // Try to map coupled cities
        || c.properties.name === l.split(' תעשייה ')[1] /* Try to map industrial parks/zones */) as any
    if (geoCity) {
      geoCity.properties.count = alertData[l]
      successfulMapping += alertData[l]
    } else {
      failedMappings += alertData[l]
      console.log(`Could not map '${l}' alerts#: ${alertData[l]}`)
    }
  })

  cities.features = cities.features.filter((c: any) => c.properties.count)

  console.log(`mapped: ${successfulMapping}, Unmapped: ${failedMappings}`)
  return { data: cities, failedMappings, successfulMapping }
}

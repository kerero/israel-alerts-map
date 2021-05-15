import axios from 'axios'
import * as cities from './cities.geo.json'

export async function loadAlertData(): Promise<object> {
  const LANG = 'he'
  const alertHistory = (await axios.get(`https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=${LANG}&mode=3`)).data
  const alertData = {}
  alertHistory.forEach((e) => {
    let name: string = e.data.split(', ')[0]
      .split(' - ')[0] // try to take top hierarchy in hierarchical zones
      .replaceAll('-', ' ') // remove difference in writing styles
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

export function prepereGeoData(alertData: object):
{ data: object; failedMappings: number; successfulMapping: number } {
  let failedMappings = 0
  let successfulMapping = 0
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

  return { data: cities, failedMappings, successfulMapping }
}

loadAlertData().then((d) => prepereGeoData(d))

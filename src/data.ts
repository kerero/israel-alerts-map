/* eslint-disable no-param-reassign */
import axios from 'axios'
import cities from './cities.geo.json'
import alertsMock from './alertsHistory.json'

export async function loadAlertData(): Promise<object> {
  // const LANG = 'he'
  // const url = `https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=${LANG}&mode=3`
  // const corsWrapper = `http://www.whateverorigin.org/get?url=${url}`
  const alertHistory: any = Object.values(alertsMock) // (await axios.get(corsWrapper))
  const alertData = {}
  alertHistory.forEach((e: any) => {
    let name: string = e.data || ''
    name = name.split(', ')[0]
      // .split(' - ')[0] // try to take top hierarchy in hierarchical zones
      // .replaceAll('-', ' ') // remove difference in writing styles
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
  // eslint-disable-next-line no-return-assign
  cities.features.forEach((c: any) => c.properties.count = 0)
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

  console.log(`mapped: ${successfulMapping}, Unmapped: ${failedMappings}`)
  return { data: cities, failedMappings, successfulMapping }
}

loadAlertData().then((d) => prepereGeoData(d))

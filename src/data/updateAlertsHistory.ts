// This is a server side script
import axios from 'axios' // eslint-disable-line import/no-extraneous-dependencies
import fs from 'fs'

const LANG = 'he'
const url = `https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=${LANG}&mode=3`
const jsonPath = `${__dirname}/alertsHistory.json`

if (!fs.existsSync(jsonPath)) {
  fs.writeFileSync(jsonPath, '[{"datetime": "1970-01-01T00:00:00.000Z"}]')
}

axios.get(url).then((res) => {
  const alertHistory = require(jsonPath) // eslint-disable-line
  const mostRecent = new Date(alertHistory[0].datetime)
  const newAlerts = (res.data as any[]).filter((v) => (new Date(v.datetime) > mostRecent))
  const mergedAlerts = newAlerts.concat(alertHistory)
  fs.writeFileSync(jsonPath, JSON.stringify(mergedAlerts))
}).catch((e) => console.log(JSON.stringify(e))) // eslint-disable-line no-console

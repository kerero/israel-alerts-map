// This is a server side script
import axios from 'axios' // eslint-disable-line import/no-extraneous-dependencies
import fs from 'fs'
import alertHistory from './alertsHistory.json'

const LANG = 'he'
const url = `https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=${LANG}&mode=3`

axios.get(url).then((res) => {
  const mostRecent = new Date(alertHistory[0].datetime)
  const newAlerts = (res.data as any[]).filter((v) => (new Date(v.datetime) > mostRecent))
  const mergedAlerts = newAlerts.concat(alertHistory)
  fs.writeFileSync(`${__dirname}/alertsHistory.json`, JSON.stringify(mergedAlerts))
}).catch((e) => console.log(JSON.stringify(e))) // eslint-disable-line no-console

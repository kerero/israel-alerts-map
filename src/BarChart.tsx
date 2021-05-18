/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef } from 'react'
import { Bar, Chart } from 'react-chartjs-2'
import './BarCharts.css'

const DATA_LENGTH_LIMIT = 50
const chartOptions = {
  maintainAspectRatio: false,
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: `Alerts per City (Top ${DATA_LENGTH_LIMIT})`,
    },
  },
}

const labelsPlugin = {
  id: 'labelsPlugin',
  afterDraw: (chart) => {
    // @ts-ignore
    const { ctx } = chart
    ctx.font = '12px Verdana'
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    // @ts-ignore
    chart.config.data.datasets.forEach((dataset) => {
      if (dataset.type === 'bar') {
        const dataArray = dataset.data
        chart._metasets[0].data.forEach((bar, index) => {
          ctx.fillText(dataArray[index], bar.x + 10, bar.y + 8)
        })
      }
    })
  },
}

export default function AlertsBarChart({ alertData }) {
  // @ts-ignore
  Chart.register(labelsPlugin)
  const [value, set] = useState({ active: false })
  const contentRef = useRef<HTMLDivElement>()
  const splicedAlertData = alertData.slice(0, 100)
  const chartData = {
    labels: splicedAlertData.map((o) => o[0]),
    datasets: [
      {
        type: 'bar',
        label: '# of Alerts',
        data: splicedAlertData.map((o) => o[1]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="rootContainer">
      <div
        className={`buttonContainer collapsible ${value.active ? 'active' : ''}`}
        onClick={(e) => {
          e.currentTarget.classList.toggle('change')
          set({ active: !value.active })
          const content = contentRef.current
          if (content) {
            if (content.style.maxHeight) {
              (content as any).style.maxHeight = null
            } else {
              content.style.maxHeight = `${content.scrollHeight}px`
              content.style.height = `${content.scrollHeight}px`
            }
          }
        }}
      >
        <div className={`baseLine ${value.active ? 'active' : ''}`} />
        <div className="barsContainer">
          <div className={`bar1 ${value.active ? 'active' : ''}`} />
          <div className={`bar2 ${value.active ? 'active' : ''}`} />
          <div className={`bar3 ${value.active ? 'active' : ''}`} />
        </div>

      </div>
      <div className="chartContainer content" ref={contentRef as React.RefObject<HTMLDivElement>}>
        <div className="chart" style={{ height: `${Object.keys(splicedAlertData).length * 20 + 300}px` }}>
          <Bar
            plugins={[labelsPlugin]}
            data={chartData}
            options={chartOptions}
            type=""
          />
        </div>
      </div>
    </div>
  )
}

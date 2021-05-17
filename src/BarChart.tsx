/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import './BarCharts.css'

export default function AlertsBarChart({ alertData }) {
  const [value, set] = useState({ active: false })
  const contentRef = useRef<HTMLDivElement>()
  const chartData = {
    labels: alertData.map((o) => o[0]),
    datasets: [
      {
        label: '# of Alerts',
        data: alertData.map((o) => o[1]),
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
  const chartOptions = {
    maintainAspectRatio: false,
    indexAxis: 'y',
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
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
        text: 'Alerts per City',
      },
    },
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
        <div className="chart" style={{ height: `${Object.keys(alertData).length * 10 + 300}px` }}>
          <Bar
            data={chartData}
            options={chartOptions}
            type=""
          />
        </div>
      </div>
    </div>
  )
}

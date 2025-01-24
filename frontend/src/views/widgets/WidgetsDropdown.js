

// import React, { useEffect, useState, useRef } from 'react'
// import PropTypes from 'prop-types'
// import api from 'src/api'
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBriefcase, faCalendar, faClipboard} from '@fortawesome/free-solid-svg-icons'
// import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
// import {
//   CRow,
//   CCol,
//   CWidgetStatsA,
// } from '@coreui/react'

// // Import the CSS file
// import './style.css'

// const WidgetsDropdown = (props) => {
//   const [data, setData] = useState({
//     issued_items_count: 0,
//     upcoming_issuance_count: 0,
//     accidents_count: 0,
//     trainings_count: 0,
//   })

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get('/reports/dashboard/')
//         const result = response.data.data
//         console.log('result:', result)
//         setData({
//           issued_items_count: result.issued_items_count,
//           upcoming_issuance_count: result.upcoming_issuance_count,
//           accidents_count: result.accidents_count,
//           trainings_count: result.trainings_count,
//         })
//       } catch (error) {
//         console.error('Error fetching data:', error)
//       }
//     }

//     fetchData()
//   }, [])

//   return (
//     <CRow className={props.className} xs={{ gutter: 4 }}>
//       <CCol sm={6} xl={4} xxl={3}>
//         <CWidgetStatsA
//           className="glassmorphism big-card"
//           style={{ background: 'linear-gradient(to right, rgba(0, 0, 139, 0.5), rgba(0, 0, 139, 0.7))' }}
//           value={data.issued_items_count}
//           title="New Issuance"
//           icon={<FontAwesomeIcon icon={faBriefcase} size="2x" />}
//         />
//       </CCol>
//       <CCol sm={6} xl={4} xxl={3}>
//         <CWidgetStatsA
//           className="glassmorphism big-card"
//           style={{ background: 'linear-gradient(to right, rgba(139, 0, 0, 0.5), rgba(255, 0, 0, 0.7))' }}
//           value={<span className="bold-text">{data.upcoming_issuance_count}</span>}
//           title="Upcoming Issuance"
//           icon={<FontAwesomeIcon icon={faCalendar} size="2x" />}
//         />
//       </CCol>
//       <CCol sm={6} xl={4} xxl={3}>
//         <CWidgetStatsA
//           className="glassmorphism big-card"
//           style={{ background: 'linear-gradient(to right, rgba(0, 139, 139, 0.5), rgba(0, 139, 139, 0.7))' }}
//           value={data.trainings_count}
//           title="Safety Training"
//           icon={<FontAwesomeIcon icon={faClipboard} size="2x" />}
//         />
//       </CCol>
//       <CCol sm={6} xl={4} xxl={3}>
//         <CWidgetStatsA
//           className="glassmorphism big-card"
//           style={{ background: 'linear-gradient(to right, rgba(139, 0, 139, 0.5), rgba(139, 0, 139, 0.7))' }}
//           value={data.accidents_count}
//           title="Accident"
//           icon={<FontAwesomeIcon icon={faExclamationTriangle} size="2x" />}
//         />
//       </CCol>
//     </CRow>
//   )
// }

// WidgetsDropdown.propTypes = {
//   className: PropTypes.string,
//   withCharts: PropTypes.bool,
// }

// export default WidgetsDropdown





import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import api from 'src/api'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faCalendar, faClipboard } from '@fortawesome/free-solid-svg-icons'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import {
  CRow,
  CCol,
} from '@coreui/react'

import './style.css'

const WidgetsDropdown = (props) => {
  const [data, setData] = useState({
    issued_items_count: 0,
    upcoming_issuance_count: 0,
    accidents_count: 0,
    trainings_count: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/reports/dashboard/')
        const result = response.data.data
        console.log('result:', result)
        setData({
          issued_items_count: result.issued_items_count,
          upcoming_issuance_count: result.upcoming_issuance_count,
          accidents_count: result.accidents_count,
          trainings_count: result.trainings_count,
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const cards = [
    {
      title: "New Issuance",
      value: data.issued_items_count,
      icon: faBriefcase,
      color: '#00008b',
    },
    {
      title: "Upcoming Issuance",
      value: data.upcoming_issuance_count,
      icon: faCalendar,
      color: '#8b0000',
    },
    {
      title: "Safety Training",
      value: data.trainings_count,
      icon: faClipboard,
      color: '#008b8b',
    },
    {
      title: "Accident",
      value: data.accidents_count,
      icon: faExclamationTriangle,
      color: '#8b008b',
    },
  ]

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
  <CCol sm={6} xl={4} xxl={3}>
    <div className="custom-card card-new-issuance">
      <div className="card-content">
        <p className="card-title">New Issuance</p>
        <p className="card-value">{data.issued_items_count}</p>
      </div>
      <div className="card-icon">
        <FontAwesomeIcon icon={faBriefcase} />
      </div>
    </div>
  </CCol>
  <CCol sm={6} xl={4} xxl={3}>
    <div className="custom-card card-upcoming-issuance">
      <div className="card-content">
        <p className="card-title">Upcoming Issuance</p>
        <p className="card-value">{data.upcoming_issuance_count}</p>
      </div>
      <div className="card-icon">
        <FontAwesomeIcon icon={faCalendar} />
      </div>
    </div>
  </CCol>
  <CCol sm={6} xl={4} xxl={3}>
    <div className="custom-card card-safety-training">
      <div className="card-content">
        <p className="card-title">Safety Training</p>
        <p className="card-value">{data.trainings_count}</p>
      </div>
      <div className="card-icon">
        <FontAwesomeIcon icon={faClipboard} />
      </div>
    </div>
  </CCol>
  <CCol sm={6} xl={4} xxl={3}>
    <div className="custom-card card-accident">
      <div className="card-content">
        <p className="card-title">Accident</p>
        <p className="card-value">{data.accidents_count}</p>
      </div>
      <div className="card-icon">
        <FontAwesomeIcon icon={faExclamationTriangle} />
      </div>
    </div>
  </CCol>
</CRow>

  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
}

export default WidgetsDropdown

import React from 'react'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import Accidentreportdashboard from '../accidentreportdashboard/Accidentreportdashboard'

const Dashboard = () => {
  return (
    <div style={{ backgroundColor:'', minHeight: '100vh',width: '100%', padding: '20px' }}>
      <WidgetsDropdown className="mb-4" /> 
      <Accidentreportdashboard />
    </div>
  )
}

export default Dashboard

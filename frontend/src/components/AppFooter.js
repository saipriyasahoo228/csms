import React from 'react'
import { CFooter } from '@coreui/react'
import { Link } from 'react-router-dom'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        {/* <a href=" " >
          
        </a> */}
        <span   style={{textDecoration:'none',color:'#5856D6'}}>Nova-Sicuro</span>
        <span className="ms-1">&copy; 2024</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <Link target="_blank" rel="noopener noreferrer" to='https://novazen.in/' style={{textDecoration:'none'}}>Novazen</Link>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

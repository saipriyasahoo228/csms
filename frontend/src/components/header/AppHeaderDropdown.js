import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import avatar8 from './../../assets/images/avatars/8.jpg'
import { logout } from 'src/auth';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AppHeaderDropdown = () => {
  const userRole = useSelector((state) => state.role)
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        {/* <CAvatar src={avatar8} size="md" /> */}
        <AccountCircleIcon  size="lg" sx={{marginTop:'10px'}}/>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">{userRole}</CDropdownHeader>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownItem >
          <CIcon icon={cilUser} className="me-2" style={{display:'none'}}/>
          <Link href='' style={{textDecoration:'none', color:'black', display:'none'}}>Profile</Link>
          
        </CDropdownItem>
        <CDropdownItem style={{cursor:'pointer'}} onClick={ () => logout() }>
          <CIcon icon={cilSettings} className="me-2" style={{cursor:'pointer'}} />
          Logout
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        */}
        <CDropdownItem href="#">
          {/* <CIcon icon={cilLockLocked} className="me-2" /> */}
          {/* Lock Account */}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown

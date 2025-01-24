import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import 'src/scss/sidebar.scss'

// import CIcon from '@coreui/icons-react'

import { AppSidebarNav2 } from './AppSidebarNav2'

// import { logo } from 'src/assets/brand/logo'
// import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav2'

const AppSidebar2 = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const userInfo = useSelector((state) => state.userInfo)

  console.log(userInfo)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        {/*<CSidebarBrand to="/" >*/}
          {/*<CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />*/}
          {/*<CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />*/}
        {/*</CSidebarBrand>*/}
        <CSidebarBrand to="/" style={{
          "width": "100%",
          "height": "100%",
          "textDecoration": "none",
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center"
        }}>
          <div className="company-brand w-100 h-100">
            <span className="company-name w-100 h-100">{userInfo.company_name}</span>
          </div>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav2 items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar2)

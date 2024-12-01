// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useSettings } from 'src/@core/hooks/useSettings'
// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = props => {
  // ** Props
  const { verticalNavMenuBranding: userVerticalNavMenuBranding } = props

  // ** Hooks
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: 6,backgroundColor:'#FFFFFF' }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <div style={{ marginLeft:'50px'}} >
        <Link href='/pages/userinterface/' passHref >
          <StyledLink>
          <img src={`/images/Stride.png`} alt="Logo"  />
     
        {/* <HeaderTitle variant='h6' sx={{ mb: 1 }}>
          {themeConfig.templateName}
        </HeaderTitle> */}
          </StyledLink>
        </Link>
        </div>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader

// ** React Imports
import { Fragment } from 'react'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
// Styled Components
const MaskImg = styled('img')(() => ({
  bottom: 0,
  zIndex: -1,
  width: '100%',
  position: 'absolute'
}))

const Tree1Img = styled('img')(() => ({
  left: 0,
  bottom: 0,
  position: 'absolute',
  marginLeft:'200px', backgroundRepeat: 'no-repeat',
  transform: 'scale(1.6)', // Zoom effect

}))

const Tree2Img = styled('img')(() => ({
  right: 0,
  bottom: 0,
  position: 'absolute'
}))

const FooterIllustrationsV1 = props => {
  const { image1, image2 } = props
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  if (!hidden) {
    return (
      <Fragment>
        {image1 }
      </Fragment>
    )
  } else {
    return null
  }
}

export default FooterIllustrationsV1

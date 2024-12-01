const Menu = theme => {
  return {
    MuiMenu: {
      styleOverrides: {
        root: {
          '& .MuiMenu-paper': {
            borderRadius: 5
          }
        }
      }
    }
  }
}

export default Menu

import { createMuiTheme } from 'material-ui/styles'
import { WHITE, GREEN, RED_ORANGE } from 'styles/colors'

export const theme = createMuiTheme({
  typography: {
    fontFamily: 'Play, Roboto'
  },
  palette: {
    type: 'dark',
    background: {
      default: RED_ORANGE,
      paper: RED_ORANGE,
    },
    primary: {
      main: WHITE
    },
    secondary: {
      main: GREEN
    },
    error: {
      main: GREEN
    }
  }
})

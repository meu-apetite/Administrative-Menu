import { Button } from '@mui/material';
import { styled } from '@mui/material/styles'

export const ButtonCustom = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: '50%',  
  right: 0,
  transform: 'translateX(-50%)',
  textTransform: 'capitalize',
  width: '100%', 
  minHeight: '48px',
  zIndex: theme.zIndex.drawer + 1,
  borderStartEndRadius: 8,
  borderStartStartRadius: 8,
  borderEndStartRadius: 0,
  borderEndEndRadius: 0,
  maxWidth: '400px', 
  '@media(min-width: 600px)': {
    bottom: '8px',
    borderEndStartRadius: 8,
    borderEndEndRadius: 8,
  },
}))
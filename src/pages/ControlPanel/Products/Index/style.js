import { Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/system';

export const ContainerProducts = styled('main')({
  display: 'flex',
  flexDirection: 'column',
  gap: 32
});

export const ModalContainer = styled('div')({
  background: 'rgba(113,113,113,.4)',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  minHeight: '100%',
  zIndex: 1100,
});

export const ModalContent = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 4,
  boxShadow: 24,
  padding: 4,
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  background: '#fff',
  '@media (min-width: 768px)': {
    height: '85%',
    maxHeight: '800px',
    maxWidth: '700px',
  },
});

export const CardCustom = styled(Card)({
  backgroundColor: ' #ffffff',
  boxShadow: '-1px 1px 1px rgba(0, 0, 0, 0.09)',
});

export const CardMediaCustom = styled(CardMedia)({
  width: 100,
  height: 100,
  borderRadius: 6
});

export const CardContentCustom = styled(CardContent)({
  display: 'grid',
  gridTemplateColumns: '1fr 100px',
  gap: '16px',
  paddingBottom: '8px !important'
});

export const CardInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column'

});

export const Description = styled('p')({
  textOverflow: 'ellipsis',
  fontSize: '.9rem',
  lineHeight: '1.25rem',
  wordWrap: 'break-word',
  overflow: 'hidden',
  whiteSpace: 'pre-line',
  visibility: 'visible',
  display: '-webkit-box',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  color: '#717171',
  fontWeight: '300',
  '@media (min-width: 768px)': {
    fontSize: '.877rem',
    lineHeight: '1.25rem'
  },
});

export const WrapperActions = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingBottom: theme.spacing(2), 
  gap: theme.spacing(1),
  color: '#000',
  '.action': {
    display: 'flex',
    gap: theme.spacing(0.5),
    alignItems: 'center',
    backgroundColor: '#3498db', 
    color: 'white', 
    borderRadius: '5px', 
    padding: '4px 8px', 
    fontSize: theme.spacing(1.8),
    transition: 'background-color 0.3s ease', 
    cursor: 'pointer',
    '&:nth-child(1)': {
      background: theme.palette.main,
    },
    '&:nth-child(2)': {
      background: '#c6c6c6',
    },
    '&:nth-child(3)': {
      background: theme.palette.error.main,
    },
    '&:hover': {
      filter: 'brightness(0.8)'
    },
  }
}));






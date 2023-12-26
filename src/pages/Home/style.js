import { styled } from '@mui/system';

export const SectionChart = styled('section')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  '@media(min-width: 992px)': {
    gap: '16px',
    gridTemplateColumns: '1fr 1fr',
  }
}));

export const CardWelcome = styled('div')(({ theme }) => ({
  display: 'grid',
  marginBottom: '32px',
  gridTemplateColumns: '1fr',
  justifyContent: 'center',
  gap: '16px',
  '@media(min-width: 576px)': {
    gridTemplateColumns: '8fr 3fr',
    'svg': {
      width: '100%',
      margin: 'auto'
    }
  },
  alignItems: 'center',
  'svg': {
    width: '120px',
    height: 'auto',
    margin: 'auto'
  }
}));
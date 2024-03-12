import { Backdrop, Box, CircularProgress } from '@mui/material';

const BackdropLoading = (props) => {
  return (
    <Backdrop
      sx={{
        color: '#000000',
        zIndex: (theme) => theme.zIndex.drawer + 100,
        backgroundColor: props?.bgColor ?? 'rgb(0 0 0 / 70%)'
      }}
      open={typeof props.loading === 'string' ? true : props.loading}
    >
      <Box sx={{ display: 'grid', justifyContent: 'center', gap: 1 }}>
        <CircularProgress size="4rem" sx={{ margin: 'auto' }} />
        <strong style={{ color: '#fff' }}>{props.loading}</strong>
      </Box>
    </Backdrop>
  );
};

export default BackdropLoading;

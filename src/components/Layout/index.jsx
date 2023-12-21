import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

import Drawer from 'components/Drawer';

const Create = (props) => {
  return (
    <Box sx={{ display: 'flex', maxWidth: '1300px', margin: 'auto' }}>
      <Drawer />

      <Box component="main" sx={{ flexGrow: 1, p: 2, mt: '64px' }}>
        <Box
          component={props.component}
          onSubmit={props.handleSubmit}
          autoComplete="off"
        >
          <Outlet />
        </Box>
          <Box sx={{ display: 'grid', gap: 1 }}>{props.children}</Box>
      </Box>
    </Box>
  );
};

export default Create;

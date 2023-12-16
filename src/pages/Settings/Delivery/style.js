import { styled } from '@mui/system';
import { Select } from '@mui/material';


export const Title = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: theme.spacing(2.1),
  minWidth: theme.spacing(20)
}));

export const SubTitle = styled('h4')(({ theme }) => ({
  margin: 0,
  fontSize: theme.spacing(2),
  minWidth: theme.spacing(20)
}));

export const Wrapper = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const SelectCustom = styled(Select)(({ theme }) => ({
  '.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
    whiteSpace: "wrap"
  } 
}));

export const WrapperButtonSaved = styled('div')(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(2),
  'button': { width: '100%', maxWidth: '400px', minHeight: '48px'}
}));



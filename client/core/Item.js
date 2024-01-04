import { Paper, styled } from '@mui/material';

// import { styled } from '@mui/material/styles';

const Item = styled( Paper )(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#33691E' : '#EFEBE9',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}))

export default Item


import { createTheme } from '@mui/material';

const defaultBorderRadius = '20px';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: defaultBorderRadius,
                },
            },
        },
        MuiGrid: {
            styleOverrides: {
                root: {
                    padding: '5px',
                },
            },
        },
        MuiStack: {
            defaultProps: {
                style: {
                    alignItems: 'stretch',
                },
                spacing: '20px',
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    height: '100vh',
                    background: 'linear-gradient(165deg, rgba(6,43,62,1) 0%, rgba(7,0,43,1) 100%)',
                },
            },
        },
    },
});

export default theme;

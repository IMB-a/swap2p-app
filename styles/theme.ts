import { createTheme } from '@mui/material';

const defaultBorderRadius = '20px';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    height: '100vh',
                    background: 'linear-gradient(165deg, #1A0D1A, #1A0D0D, #1A0D1A, #0D0D1A, #1A0D1A, #1A0D0D)',
                    backgroundSize: '500% 500%',
                    animation: 'anim 8s linear infinite',
                    '@keyframes anim': {
                        '0%': { backgroundPosition: '0% 0%' },
                        '100%': { backgroundPosition: '100% 100%' },
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: defaultBorderRadius,
                },
                notchedOutline: {
                    borderStyle: 'none',
                },
                input: {
                    padding: '0px 14px',
                    fontSize: 20,
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
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '20px',
                    borderRadius: '20px',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    padding: '10px',
                    borderRadius: '0px',
                },
            },
        },
    },
});

export default theme;

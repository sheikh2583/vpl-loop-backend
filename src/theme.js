import { createTheme } from '@mui/material/styles';

const getTheme = (mode, primaryColor = '#00c6fb') =>
    createTheme({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    background: {
                        default: 'linear-gradient(135deg, #00c6fb 0%, #ffffff 50%, #89f7fe 75%, #ffffff 100%)',
                        paper: 'rgba(255, 255, 255, 0.75)',
                    },
                    text: {
                        primary: '#0d1b2a',
                        secondary: '#1b263b',
                    },
                    primary: {
                        main: primaryColor,
                        contrastText: '#ffffff',
                        dark: primaryColor,
                    },
                }
                : {
                    background: {
                        default: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                        paper: 'rgba(20, 20, 20, 0.65)',
                    },
                    text: {
                        primary: '#ffffff',
                        secondary: '#cccccc',
                    },
                    primary: {
                        main: primaryColor,
                        contrastText: '#ffffff',
                        dark: primaryColor,
                    },
                }),
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        background:
                            mode === 'light'
                                ? 'linear-gradient(-45deg, #00c6fb, #ffffff, #89f7fe, #ffffff)'
                                : 'linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #1e2a38)',
                        backgroundSize: '400% 400%',
                        animation: 'gradientShift 15s ease infinite',
                        backgroundAttachment: 'fixed',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        transition: 'background 1s ease-in-out, color 0.5s ease-in-out',
                    },
                    '@global': {
                        '@keyframes gradientShift': {
                            '0%': { backgroundPosition: '0% 50%' },
                            '50%': { backgroundPosition: '100% 50%' },
                            '100%': { backgroundPosition: '0% 50%' },
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    contained: {
                        '&.Mui-disabled': {
                            backgroundColor: mode === 'light' ? '#a0a0a0' : '#555555',
                            color: '#ffffff',
                        },
                    },
                },
            },
        },
        typography: {
            fontFamily: 'Poppins, sans-serif',
        },
    });

export default getTheme;

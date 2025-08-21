import { createTheme } from '@mui/material/styles';

const getTheme = (mode) =>
    createTheme({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    background: {
                        default: 'linear-gradient(135deg, #00c6fb 0%, #ffffff 100%)', // teal to white
                        paper: 'rgba(255, 255, 255, 0.9)',
                    },
                    text: {
                        primary: '#0d1b2a',
                        secondary: '#1b263b',
                    },
                    primary: {
                        main: '#00c6fb',
                        contrastText: '#ffffff',
                    },
                }
                : {
                    background: {
                        default:
                            'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', // dark blue/blackish gradient
                        paper: 'rgba(20, 20, 20, 0.85)',
                    },
                    text: {
                        primary: '#ffffff',
                        secondary: '#cccccc',
                    },
                    primary: {
                        main: '#5A9BD5',
                        contrastText: '#ffffff',
                    },
                }),
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        background:
                            mode === 'light'
                                ? 'linear-gradient(135deg, #00c6fb 0%, #ffffff 100%)'
                                : 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                        backgroundAttachment: 'fixed',
                        backgroundSize: 'cover',
                    },
                },
            },
        },
        typography: {
            fontFamily: 'Poppins, sans-serif',
        },
    });

export default getTheme;

import React, { useState, useMemo } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import getTheme from './theme.js';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";

function Main() {
    const [mode, setMode] = useState('light');
    const [primaryColor, setPrimaryColor] = useState('#00c6fb');

    // regenerate theme whenever mode or primaryColor changes
    const theme = useMemo(() => getTheme(mode, primaryColor), [mode, primaryColor]);

    const toggleMode = () => setMode(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App
                mode={mode}
                toggleMode={toggleMode}
                primaryColor={primaryColor}
                setPrimaryColor={setPrimaryColor}
            />
        </ThemeProvider>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Main />
    </StrictMode>
);

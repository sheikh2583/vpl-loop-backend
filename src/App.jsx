import { useState } from 'react';
import './App.css';
import {
    AppBar,
    Toolbar,
    Button,
    CircularProgress,
    FormControl,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    Container,
    Box,
    Switch,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

function App({ mode, toggleMode, primaryColor, setPrimaryColor }) {
    const [emailContent, setEmailContent] = useState('');
    const [tone, setTone] = useState('');
    const [generatedReplies, setGeneratedReplies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFolder, setActiveFolder] = useState('');
    const theme = useTheme();

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post("http://localhost:8080/api/email/generate-multiple", {
                emailContent,
                tone
            });
            setGeneratedReplies(Array.isArray(response.data) ? response.data : [String(response.data)]);
        } catch (err) {
            setError('Failed to generate email reply. Please try again');
        } finally {
            setLoading(false);
        }
    };

    const toggleDrawer = (open) => () => setSidebarOpen(open);
    const folders = ['Inbox', 'Sent', 'Drafts'];
    const folderPlaceholders = { Inbox: 'No Inbox messages', Sent: 'No Sent messages', Drafts: 'No Draft messages' };

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(12px)" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton onClick={toggleMode} sx={{ color: mode === 'dark' ? '#FFD700' : '#6A0DAD' }}>
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={sidebarOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250 }} role="presentation">
                    <List>
                        {folders.map((text) => (
                            <Box key={text}>
                                <ListItem button onClick={() => setActiveFolder(text)}>
                                    <ListItemText primary={text} />
                                </ListItem>
                                {activeFolder === text && (
                                    <Typography variant="body2" sx={{ pl: 4, pb: 1, color: 'text.secondary', fontStyle: 'italic' }}>
                                        {folderPlaceholders[text]}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </List>
                    <Divider sx={{ my: 1 }} />
                </Box>
            </Drawer>

            <Container maxWidth="md" sx={{
                py: 6,
                background: `linear-gradient(135deg, ${primaryColor}, #ffffff, #89f7fe, #ffffff)`,
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite'
            }}>
                <Box sx={{
                    p: 4,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 4,
                    boxShadow: 8,
                    backdropFilter: "blur(8px)",
                    transition: "all 0.5s ease-in-out",
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    alignItems: 'center'
                }}>
                    <Typography variant='h4' align='center' sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                        Email Reply Generator
                    </Typography>

                    <Box sx={{ width: '100%', display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            sx={{ width: 60, padding: 0 }}
                        />
                        <Typography>Pick Primary Color</Typography>
                    </Box>

                    <TextField
                        fullWidth multiline rows={5} variant='outlined' label="Paste your email here"
                        value={emailContent} onChange={(e) => setEmailContent(e.target.value)}
                        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                        InputProps={{ style: { color: theme.palette.text.primary } }}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="tone-select-label">Tone (Optional)</InputLabel>
                        <Select labelId="tone-select-label" value={tone} onChange={(e) => setTone(e.target.value)}>
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="professional">Professional</MenuItem>
                            <MenuItem value="casual">Casual</MenuItem>
                            <MenuItem value="friendly">Friendly</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': { backgroundColor: theme.palette.primary.dark }
                        }}
                        onClick={handleSubmit}
                        disabled={!emailContent || loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Generate Replies"}
                    </Button>

                    {error && <Typography color='error'>{error}</Typography>}

                    {generatedReplies.length > 0 && generatedReplies.map((reply, idx) => (
                        <Box key={idx} sx={{
                            width: '100%',
                            p: 2,
                            borderRadius: 3,
                            border: '1px solid rgba(255,255,255,0.2)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': { transform: 'scale(1.02)', boxShadow: 12 }
                        }}>
                            <Typography variant="h6">Reply {idx + 1}</Typography>
                            <TextField fullWidth multiline rows={4} value={reply} InputProps={{ readOnly: true }} />
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                <Button variant='outlined' sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main }} onClick={() => navigator.clipboard.writeText(reply)}>Copy</Button>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>

            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </>
    );
}

export default App;

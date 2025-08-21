import { useState } from 'react';
import './App.css';
import {
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
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

function App({ mode, toggleMode }) {
    const [emailContent, setEmailContent] = useState('');
    const [tone, setTone] = useState('');
    const [generatedReply, setGeneratedReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFolder, setActiveFolder] = useState('');

    const theme = useTheme();

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post("http://localhost:8080/api/email/generate", {
                emailContent,
                tone
            });
            setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
        } catch (error) {
            setError('Failed to generate email reply. Please try again');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDrawer = (open) => () => {
        setSidebarOpen(open);
    };

    const folders = ['Inbox', 'Sent', 'Drafts'];

    const folderPlaceholders = {
        Inbox: 'No Inbox messages',
        Sent: 'No Sent messages',
        Drafts: 'No Draft messages'
    };

    return (
        <>
            <Drawer anchor="left" open={sidebarOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250 }} role="presentation">
                    <List>
                        {folders.map((text) => (
                            <Box key={text}>
                                <ListItem button onClick={() => setActiveFolder(text)}>
                                    <ListItemText primary={text} />
                                </ListItem>
                                {activeFolder === text && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            pl: 4,
                                            pb: 1,
                                            color: 'text.secondary',
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        {folderPlaceholders[text]}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </List>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ px: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Theme:
                        </Typography>
                        <Switch
                            checked={mode === 'dark'}
                            onChange={toggleMode}
                            color="primary"
                        />
                        <Typography variant="caption">
                            {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </Typography>
                    </Box>
                </Box>
            </Drawer>

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <IconButton onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                </Box>

                <Typography
                    variant='h3'
                    component="h1"
                    gutterBottom
                    align='center'
                    sx={{ color: theme.palette.text.primary }}
                >
                    Email Reply Generator
                </Typography>

                <Box
                    component='form'
                    sx={{
                        mx: 3,
                        p: 3,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        variant='outlined'
                        label="Original Email Content"
                        value={emailContent || ''}
                        onChange={(e) => setEmailContent(e.target.value)}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                        InputProps={{ style: { color: theme.palette.text.primary } }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="tone-select-label">Tone (Optional)</InputLabel>
                        <Select
                            labelId="tone-select-label"
                            id="tone-select"
                            value={tone || ''}
                            label="Tone (Optional)"
                            onChange={(e) => setTone(e.target.value)}
                            variant="outlined"
                            sx={{ color: theme.palette.text.primary }}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="professional">Professional</MenuItem>
                            <MenuItem value="casual">Casual</MenuItem>
                            <MenuItem value="friendly">Friendly</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant='contained'
                        onClick={handleSubmit}
                        disabled={!emailContent || loading}
                        fullWidth
                    >
                        {loading ? <CircularProgress size={24} /> : "Generate Reply"}
                    </Button>
                </Box>

                {error && !loading && (
                    <Typography color='error' textAlign='center' sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {generatedReply && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant='h6' gutterBottom>
                            Generated Reply:
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            variant='outlined'
                            value={generatedReply || ''}
                            InputProps={{
                                readOnly: true,
                                style: { color: theme.palette.text.primary },
                            }}
                        />
                        <Button
                            variant='outlined'
                            sx={{ mt: 2 }}
                            onClick={() => navigator.clipboard.writeText(generatedReply)}
                        >
                            Copy to Clipboard
                        </Button>
                    </Box>
                )}
            </Container>
        </>
    );
}

export default App;

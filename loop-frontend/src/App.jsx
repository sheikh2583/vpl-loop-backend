import { useState, useEffect } from 'react';
import './App.css'

function App() {
    const [emailContent, setEmailContent] = useState('');
    const [tone, setTone] = useState('professional');
    const [generatedReply, setGeneratedReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    // Load theme preference from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
        }
    }, []);

    // Toggle theme and save to localStorage
    const toggleTheme = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    };

    const handleSubmit = async() => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch("http://localhost:8080/api/email/generate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent,
                    tone
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate reply');
            }
            
            const data = await response.text();
            setGeneratedReply(data);
        } catch (error) {
            setError('Failed to generate email reply. Please try again');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedReply);
        alert('Reply copied to clipboard!');
    };

    const clearContent = () => {
        setEmailContent('');
        setGeneratedReply('');
        setError('');
    };

    return (
        <div className={`app ${darkMode ? 'dark' : 'light'}`}>
            {/* Background Gradient */}
            <div className="background-gradient"></div>
            
            {/* Theme Toggle */}
            <div className="theme-toggle">
                <button 
                    className="theme-btn"
                    onClick={toggleTheme}
                    title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </div>

            <div className="container">
                {/* Header */}
                <header className="header">
                    <div className="header-content">
                        <div className="logo">✨</div>
                        <h1 className="title">
                            <span className="gradient-text">AI Email Generator</span>
                        </h1>
                        <p className="subtitle">Generate professional email replies with AI</p>
                    </div>
                </header>

                {/* Main Content */}
                <main className="main-content">
                    <div className="card">
                        {/* Email Input Section */}
                        <div className="input-section">
                            <label className="label">
                                <span className="label-icon">📧</span>
                                <span className="label-text">Email Content</span>
                            </label>
                            <textarea
                                className="textarea"
                                value={emailContent}
                                onChange={(e) => setEmailContent(e.target.value)}
                                placeholder="Paste the email content you want to reply to..."
                                rows={6}
                            />
                        </div>

                        {/* Tone Selection */}
                        <div className="tone-section">
                            <label className="label">
                                <span className="label-icon">🎨</span>
                                <span className="label-text">Reply Tone</span>
                            </label>
                            <div className="tone-buttons">
                                {['professional', 'casual', 'friendly'].map((toneOption) => (
                                    <button
                                        key={toneOption}
                                        className={`tone-btn ${tone === toneOption ? 'active' : ''}`}
                                        onClick={() => setTone(toneOption)}
                                    >
                                        {toneOption === 'professional' && '💼'}
                                        {toneOption === 'casual' && '😊'}
                                        {toneOption === 'friendly' && '🤝'}
                                        <span>{toneOption.charAt(0).toUpperCase() + toneOption.slice(1)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button
                                className="generate-btn"
                                onClick={handleSubmit}
                                disabled={loading || !emailContent.trim()}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>✨</span>
                                        <span>Generate Reply</span>
                                    </>
                                )}
                            </button>

                            <button
                                className="clear-btn"
                                onClick={clearContent}
                                disabled={loading}
                            >
                                🗑️ Clear
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Generated Reply */}
                        {generatedReply && (
                            <div className="reply-section">
                                <div className="reply-header">
                                    <span className="reply-icon">🎉</span>
                                    <span className="reply-title">Your AI-Generated Reply</span>
                                </div>
                                <div className="reply-content">
                                    <textarea
                                        className="reply-textarea"
                                        value={generatedReply}
                                        readOnly
                                        rows={6}
                                    />
                                </div>
                                <button
                                    className="copy-btn"
                                    onClick={handleCopy}
                                >
                                    📋 Copy to Clipboard
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;

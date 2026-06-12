import express from 'express';
import app from './api/index.js';
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running locally on http://localhost:${PORT}`);
});
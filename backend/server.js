/* eslint-disable no-undef */

import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

import cors from 'cors'
import mongoose from 'mongoose'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'

import authRoutes from './routes/authRoutes.js'
import analyzeRoutes from './routes/analyzeRoutes.js'
import resumeRoutes from './routes/resumeRoutes.js'
import chatbotRoutes from './routes/chatbotRoutes.js'
import moduleRoutes from './routes/moduleRoutes.js'

import {
    notFound,
    errorHandler,
} from './middleware/errorMiddleware.js'

const app = express()


/* =========================
   SECURITY
========================= */

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
)

/* =========================
   RATE LIMIT
========================= */

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
})

app.use(limiter)

/* =========================
   MIDDLEWARE
========================= */

app.use(
    cors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(morgan('dev'))

/* =========================
   STATIC FOLDER
========================= */

app.use('/uploads', express.static('uploads'))

/* =========================
   ROUTES
========================= */

app.use('/api/auth', authRoutes)
app.use('/api/analyze', analyzeRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/chatbot', chatbotRoutes)
app.use('/api', moduleRoutes)

/* =========================
   HOME & HEALTH ROUTE
========================= */

app.get('/', (req, res) => {
    res.json({
        service: 'AI Resume Intelligence Backend',
        status: 'online',
        version: '2.0.0',
    })
})

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    })
})

/* =========================
   ERROR MIDDLEWARE
========================= */

app.use(notFound)
app.use(errorHandler)

/* =========================
   DATABASE & SERVER START
========================= */

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected')

    app.listen(PORT, () => {
        console.log(`Server Running On Port ${PORT}`)
    })
})
.catch((error) => {
    console.error('MongoDB Connection Warning:', error.message)
    // Still start Express server so API routes and fallbacks work even if DB is delayed
    app.listen(PORT, () => {
        console.log(`Server Running On Port ${PORT} (Database pending connection)`)
    })
})

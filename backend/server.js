import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { Sequelize } from 'sequelize';
import './src/models/associations.js';
import routes from './src/routes/index.js';
import { fileURLToPath } from 'url';
import config from './config/database.js';

// Configuração do ambiente
dotenv.config({ path: path.join(__dirname, '.env') });
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Verificação do ambiente
const isProd = process.env.NODE_ENV === 'production';
console.log('Ambiente:', isProd ? 'Produção' : 'Desenvolvimento');

// Rota de teste CORS
const app = express();
app.get('/test-cors', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin');
    res.header('Access-Control-Max-Age', '86400');
    res.json({ message: 'CORS test successful', origin: req.headers.origin, environment: isProd ? 'production' : 'development' });
});

// Configuração do CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Permite requisições de qualquer origem em desenvolvimento
        if (!isProd || !origin) {
            return callback(null, true);
        }
        
        // Em produção, permite apenas do Render
        const allowedOrigins = [
            'https://sistema-nobrega-1.onrender.com',
            'https://sistema-nobrega-1.onrender.com/api',
            'https://sistema-nobrega-1.onrender.com:10000'
        ];
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400
};

// Aplicar CORS globalmente
app.use(cors(corsOptions));

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// Configuração do Sequelize
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: 'mysql',
        logging: false,
        define: { timestamps: false }
    }
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Rotas
app.use('/api', routes);

// Servir arquivos estáticos do React
app.use(express.static(path.join(__dirname, '../build')));

// Rota catch-all para o React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Database connection and server start
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
    }
}

startServer();

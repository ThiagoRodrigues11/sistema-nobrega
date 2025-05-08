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

// Configuração do CORS
const corsOptions = {
    origin: ['https://vestalize.com', 'http://vestalize.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para CORS
app.use((req, res, next) => {
    // Define a origem permitida
    const origin = req.headers.origin;
    if (origin === 'https://vestalize.com' || origin === 'http://vestalize.com') {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    // Configura as credenciais
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Configura os métodos permitidos
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Configura os headers permitidos
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin');
    
    // Configura os headers expostos
    res.header('Access-Control-Expose-Headers', 'Authorization');
    
    // Se for uma requisição OPTIONS (preflight), responde com 200
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Max-Age', '86400');
        return res.status(200).end();
    }
    next();
});

// Configuração do CORS com cors
app.use(cors(corsOptions));

// Adiciona uma rota de teste para CORS
app.get('/test-cors', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.json({ message: 'CORS test successful' });
});

// Configuração do Sequelize com base no ambiente
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Inicialização do Sequelize
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

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', routes);

// Servir arquivos estáticos do React
app.use(express.static(path.join(__dirname, '../build')));

// Rota catch-all para o React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();

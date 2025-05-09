// backend/server.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { Sequelize } = require('sequelize');
const fs = require('fs');
const routes = require('./src/routes/index.js');

// Configuração do ambiente
dotenv.config({ path: path.join(__dirname, '.env') });

// Configuração do CORS
const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400
};

const app = express();
app.use(cors(corsOptions));

// Configuração do body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do session
app.use(session({
    secret: process.env.SESSION_SECRET || 'seu-segredo-aqui',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// Configuração do Sequelize
const env = process.env.NODE_ENV || 'production';
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        dialect: 'mysql',
        logging: false,
        define: { timestamps: false }
    }
);

// Rotas
app.use('/api', routes);

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Inicia o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);

    // Tenta conectar com o banco de dados
    sequelize.authenticate()
        .then(() => {
            console.log('Conexão com o banco de dados estabelecida com sucesso!');
        })
        .catch(err => {
            console.error('Erro ao conectar com o banco de dados:', err);
        });
});
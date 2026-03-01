const express = require("express");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const process = require("process");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { verificarSesionUnica } = require("./config");

const isSecure = String(process.env.COOKIE_SECURE || '0') === '1';
const { mongoReady } = require('./dbConfig');

const app = express();

// 🔌 Servidor HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT'] }
});

// 🔧 Passport
require('./modelo/lib/passportConfig');

// 🧩 Configuración de vista
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);

// 🧱 Middlewares generales
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 1000000 }));
app.use(express.static(path.join(__dirname, "modelo/front")));
app.use(express.static(path.join(__dirname, "/front")));

// 📂 Carga de archivos
const storage = multer.memoryStorage();
app.use(multer({ storage }).fields([
    { name: "adjunto", maxCount: 5 },
    { name: "adjuntoColeccion", maxCount: 20 },
    { name: "adjuntoColec", maxCount: 20 },
    { name: "imgAdj", maxCount: 2 }
]));

// ✅ INIT: esperar Mongo antes de sesiones / rutas / listen
(async function init() {
    await mongoReady; // <-- CLAVE

    // 🔒 Sesión y autenticación (usando el MISMO client de mongoose)
    app.use(session({
        name: 'sbc.sid',
        secret: process.env.SESSION_SECRET_MAIN || 'gesHh',
        resave: false,
        saveUninitialized: false,
        rolling: true,
        store: MongoStore.create({
            clientPromise: Promise.resolve(mongoose.connection.getClient()),
            ttl: 60 * 60 * 24,
            collectionName: 'sessions_sbc'
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            sameSite: 'lax',
            secure: isSecure,
            path: '/'
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(verificarSesionUnica);

    // 👤 res.locals.user
    app.use((req, res, next) => {
        res.locals.user = req.user || null;
        next();
    });

    // 🔁 Rutas
    app.use(require('./modelo/controladores/endPoints/email'));
    app.use(require('./modelo/controladores/endPoints/homeLogin'));
    app.use(require('./modelo/controladores/endPoints/operaciones'));
    app.use(require('./modelo/controladores/endPoints/configuracionBase'));
    app.use(require('./modelo/controladores/endPoints/afip'));
    app.use(require('./modelo/controladores/playwright/endPointsTest'));

    const iniciarTareasCron = require('./modelo/controladores/tareasProg');
    iniciarTareasCron();

    // 🔌 Sockets
    const configurarSockets = require("./modelo/controladores/sockets");
    configurarSockets(io);

    // 🚀 Iniciar servidor
    const port = process.env.PORT || 3000;
    server.listen(port, '0.0.0.0', () => {
        console.log(`🚀 Server on :${port} DB=${process.env.DB_NAME}`);
    });
})().catch(err => {
    console.error("Fallo init app:", err);
    process.exit(1);
});

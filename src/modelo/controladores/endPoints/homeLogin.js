const express = require('express');
const router = express.Router();
const passport = require("passport");
const Session = require("../../models/marketPlace/Session");
let baseDeDatos = require(`../baseDeDatos`);
const User = require("../../models/marketPlace/01 - usuarioSeguridad/User");
const { capitalize, makeObjects, updateObjects, sortObject, plancharObjeto, guardAdjunto, version } = require(`../funcionesBack`)
//Clientes mainTree

function asegurarAutenticado(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/?error=Debes iniciar sesión');
}
router.get('/', async (req, res) => {

    res.render('login');
});
router.get('/recuperar/:token', async (req, res) => {

    try {

        const { token } = req.params;
        const offset = new Date().getTimezoneOffset() * 60000

        const usuario = await baseDeDatos.User.findOne({
            resetToken: token,
            resetExpires: { $gt: new Date(Date.now()) - offset } // Verifica si el token no ha expirado
        });

        res.render('reestablecer',
            { mensaje: 'Token válido', userId: usuario });
    } catch (err) {
        res.render('reestablecer',
            { mensaje: 'Token inválido' });
    }

});
router.post("/users/post", async (req, res) => {
    try {

        let enviar = req.body

        delete enviar._id
        const key = req.body[req.body.key] || ""
        const mostrar = req.body.mostrar || ""

        let newP = await makeObjects(Object.keys(enviar), enviar, req.user, "User", req.files || {})

        newP.password = await newP.encryptPassword(enviar.password);
        let newPost = await newP.save();
        res.json({
            mensaje: `El Usuario ${key} ${mostrar} fue creado con exito`,
            posteo: newPost
        });

    } catch (error) {

        console.log("Creacion Usuario")
        console.log(req.query)
        console.log(error)
        res.json(error);
    }
});
router.post("/users/login", (req, res, next) => {

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            return res.redirect("/?error=" + encodeURIComponent(info.message) + "&emoji=" + encodeURIComponent(info.emoji));
        }

        req.logIn(user, async (err) => {
            if (err) return next(err);

            const ip = req.ip;
            const deviceId = req.body.deviceId || req.headers['x-device-id'];

            // Destruir sesión anterior si la IP o el device cambió
            const sesionActivaConOtroDispositivo = (
                user.currentSessionId &&
                (user.lastIp !== ip || user.currentDeviceId !== deviceId)
            );

            if (process.env.NODE_ENV !== "development" && sesionActivaConOtroDispositivo) {
                req.sessionStore.destroy(user.currentSessionId, (err) => {
                    if (err) {
                        console.error("Error al eliminar la sesión anterior:", err);
                    } else {
                        console.log("💥 Sesión anterior eliminada por cambio de IP o dispositivo");
                    }
                });
            }

            // Guardar nueva sesión, IP y deviceId
            await User.findByIdAndUpdate(user._id, {
                currentSessionId: req.sessionID,
                currentDeviceId: deviceId,
                lastIp: ip
            });

            return res.redirect("/home");
        });
    })(req, res, next);
});
router.get('/home', asegurarAutenticado, async (req, res) => {

    const userId = req.user._id;
    const regex = new RegExp(userId + "", 'i')

    await Session.find({ "session": { $regex: regex }, '_id': { $ne: req.sessionID } }).deleteMany().exec();

    res.cookie("myCookieName", req.user.name, {
        //  maxAge: 1000 * 60 * 7,//es en segundos
        //expires: new Date("2022-12-31"),
        httpOnly: true, //por defecti viene siempre en false, sirve para si pongo no puede ser accedida a travez del navegador pero si de peticiones
        secure: true, // solo se puede acceder cuando alguien visite de https
        sameSite: "strict",
    })

    res.render('homeLog',
        { userNombre: req.user.name, username: req.user.usernameUser, userPermisos: req.user.grupoSeguridad });

});

router.get('/api/user', (req, res) => {
    res.json({
        nombre: req.user.name,
        username: req.user.usernameUser,
        permisos: req.user.grupoSeguridad
    });
})
router.get(`/getSeg`, asegurarAutenticado, async (req, res) => {
    try {

        let filtro = JSON.parse(req.query.filtros || `{}`)

        let data = await baseDeDatos.SeguridadEntidad.find(filtro)
        res.json(data);

    } catch (error) {
        console.log("Seguridad Entidad")
        console.log(error)
        res.json(error);
    }
})
router.get('/marketp/signup', (req, res) => {
    res.render('inicio/signup');
});
router.post("/users/register", async (req, res) => {
    let errors = [];

    let { name, surname, username, email, grupoSegurdiad } = req.body;

    if (!name || !email || !username || !surname) {
        errors.push({ message: "Complete todos los campos" });
    }

    if (errors.length > 0) {
        res.render("register", { errors, name, surname, usernameUser: username, grupoSegurdiad, email, password, password2 });
    } else {

        const emailUser = await User.findOne({ email: email });
        const usernameUser = await User.findOne({ usernameUser: username });

        if (emailUser) {
            req.flash("error_msg", "El email ya existe");
            res.redirect("/users/signup");
        } else if (usernameUser) {
            req.flash("error_msg", "El usuario ya existe");
            res.redirect("/users/signup");
        } else {

            const newUser = new User({ name, surname, usrnameUser: username, grupoSegurdiad, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Estas Registrado');
            res.redirect('/users/signin');
        }
    }
});
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
            return next(err);
        }
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.redirect('/');
        });
    });
});
router.put('/blanquearContrasena', async (req, res) => {
    try {
        const { _id, password } = req.body;

        // Encriptar la nueva contraseña
        const tempUser = new baseDeDatos.User(); // Solo para usar el método de encriptación
        const passwordEncriptada = await tempUser.encryptPassword(password);

        // Actualizar en la base de datos
        const usuarioActualizado = await baseDeDatos.User.findByIdAndUpdate(
            _id,
            { password: passwordEncriptada },
            { new: true }
        );

        res.json({
            mensaje: "La contraseña fue blanqueada con éxito.",
            _id
        });

    } catch (error) {
        console.error("Error al blanquear la contraseña:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
});
router.delete('/imagen', async (req, res) => {

    unlink(path.resolve(`./src/front` + req.body.adjunto))
})

module.exports = router;
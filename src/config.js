const { execSync } = require("child_process");
const User = require('./modelo/models/marketPlace/01 - usuarioSeguridad/User'); // Revisá el path

function getCurrentBranch() {
    try {
        // Si está siendo ejecutado desde un test de Playwright, forzamos 'testing'
        const isPlaywright = process.argv.some(arg => arg.includes('playwright'));

        if (isPlaywright) {
            return 'testing';
        }

        return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    } catch (error) {
        console.error("No se pudo determinar la rama:", error.message);
        return null;
    }
}

const branch = getCurrentBranch();

function verificarSesionUnica(req, res, next) {
    if (!req.isAuthenticated()) return next();

    const deviceId = req.headers['x-device-id'] || req.body.deviceId;

    User.findById(req.user._id).then(user => {
        const mismoDevice = !user.currentDeviceId || user.currentDeviceId === deviceId;

        if (!mismoDevice) {
            console.log("⚠️ Dispositivo distinto detectado. Cerrando sesión.");

            req.session.destroy(() => {
                req.logout(() => {
                    const aceptaJson = req.headers.accept && req.headers.accept.includes("application/json");
                    const esFetch = req.headers['x-requested-with'] === 'XMLHttpRequest' || req.headers['x-device-id'];

                    if (aceptaJson || esFetch) {
                        return res.status(401).json({ error: "Sesión cerrada desde otro dispositivo" });
                    } else {
                        return res.redirect("/?error=" + encodeURIComponent("Sesión cerrada desde otro dispositivo") + "&emoji=⚠️");
                    }
                });
            });
        } else {
            next();
        }
    }).catch(err => {
        console.log("❌ Error en verificación de sesión única:", err);
        next();
    });
}

module.exports = {
    rama: branch,
    verificarSesionUnica
};

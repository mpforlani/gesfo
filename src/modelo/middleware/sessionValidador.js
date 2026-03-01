const Session = require("../models/marketPlace/Session");

const sessionValidador = async (req, res, next) => {
    if (req.sessionID) {
        const sessionCount = await Session.countDocuments({ '_id': req.sessionID });

        if (sessionCount <= 0) {
            if (req.session) {
                req.session.destroy();
            }
            res.redirect("/");
        }
        else {
            next();
        }
    }
    else {
        next();
    }
}

module.exports = sessionValidador;
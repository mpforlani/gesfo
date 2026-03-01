const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/marketPlace/01 - usuarioSeguridad/User');

passport.use(new LocalStrategy({
    usernameField: 'usernameUser'
}, async (usernameUser, password, done) => {

    // Match Email's User
    const user = await User.findOne({ usernameUser: usernameUser });

    if (!user) {

        return done(null, false, { message: 'Usuario no registrado', emoji: "👤" });
    } else if (!user.habilitado) {
        return done(null, false, { message: 'Usuario deshabilitado', emoji: "👤" });
    } else {
        // Match Password's User
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Contraseña incorrecta', emoji: "🔑" });
        }

        return done(null, user);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(function (user) {
        done(null, user);
    })
        .catch(function (err) {
            console.log(err);
        });

});
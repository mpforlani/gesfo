require('dotenv').config({ path: process.env.ENV_PATH || '.env' });
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);//Si strictQuery se establece en true, Mongoose eliminará cualquier campo en una consulta que no esté definido en el esquema antes 
//de enviar la consulta a MongoDB. Por ejemplo, si tienes un esquema con solo un campo name, y tratas de hacer una consulta con un campo age, Mongoose eliminará el campo 
//age de la consulta.


const host = process.env.SERVER;           // ej: mongo:27017
const user = process.env.USERADMIN || '';
const pwd = process.env.USERPWD || '';
const db = process.env.DB_NAME || 'sbc'; // <<<<<<<<<<<<<< CLAVE

const auth = (user && pwd) ? `${user}:${pwd}@` : '';
const tail = (user && pwd) ? '?authSource=admin' : '';
//const MONGODB_URI = `mongodb://db:27017/sbc`;
const MONGODB_URI = `mongodb://${auth}${host}/${db}${tail}`;

const mongoReady = mongoose.connect(MONGODB_URI)
    .then(() => console.log(`Conectado a MongoDB -> DB: ${db}`))
    .catch(err => console.error('Error de conexión:', err));

// resetDb seguro y compacto
async function resetDb({
    mode = 'truncate',          // 'truncate' | 'drop'
    keep = [],                  // nunca tocar
    only = [],                  // limitar a estas
    allowUsers = false          // proteger 'users' por defecto
} = {}) {
    const conn = mongoose.connection;
    if (!conn) throw new Error('Sin conexión mongoose');
    if (conn.readyState !== 1) await conn.asPromise();

    const db = conn.db;
    const all = (await db.listCollections().toArray()).map(c => c.name);

    // set objetivo
    let target = all.filter(n => !keep.includes(n));
    if (only.length) target = target.filter(n => only.includes(n));

    // protección básica
    if (!allowUsers) target = target.filter(n => !['users', 'usuarios', 'roles', 'sessions'].includes(n));
    if (!target.length) return;

    if (mode === 'drop') {
        for (const n of target) { try { await db.dropCollection(n); } catch { } }
    } else { // truncate
        for (const n of target) await db.collection(n).deleteMany({});
    }
}


module.exports = { MONGODB_URI, db, resetDb, mongoReady };
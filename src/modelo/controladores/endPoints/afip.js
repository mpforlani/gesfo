const afip = require('../configAfip/cliente');
const express = require('express');
const router = express.Router();

router.post('/facturaElectronica', async (req, res) => {

    const ultimo = await afip.ElectronicBilling.getLastVoucher(req.body.PtoVta, req.body.CbteTipo);
    const siguiente = ultimo + 1;

    const data = {
        CantReg: 1,//Registros enviados
        CbteDesde: siguiente,
        CbteHasta: siguiente,
        CbteFch: parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, '')),
        ...req.body,
    };

    try {
        const resultado = await afip.ElectronicBilling.createVoucher(data);

        res.json({
            ...resultado,
            numeroFactura: siguiente, // ← agregás el número que acabás de usar
        });;
    } catch (err) {
        console.error("Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
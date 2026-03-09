const afip = require('../configAfip/cliente');
const express = require('express');
const router = express.Router();

router.post('/facturaElectronica', async (req, res) => {
    try {
        const ultimo = await afip.ElectronicBilling.getLastVoucher(req.body.PtoVta, req.body.CbteTipo);
        const siguiente = ultimo + 1;

        const data = {
            CantReg: 1, // Registros enviados
            CbteDesde: siguiente,
            CbteHasta: siguiente,
            CbteFch: parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''), 10),
            ...req.body,
        };

        const resultado = await afip.ElectronicBilling.createVoucher(data);

        res.json({
            ...resultado,
            numeroFactura: siguiente,
        });
    } catch (err) {
        console.error('Error AFIP:', err.message, err.data || '');
        res.status(err.status || 400).json({
            error: err.message,
            detalle: err.data || null,
        });
    }
});

module.exports = router;

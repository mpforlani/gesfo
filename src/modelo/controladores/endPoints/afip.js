const afip = require('../configAfip/cliente');
const config = require('../../../afipFiles/config');
const express = require('express');
const router = express.Router();
const afipFacturacionRealHabilitada = ['1', 'true'].includes(String(process.env.AFIP_HABILITAR_FACTURACION_REAL || '').toLowerCase());

router.post('/facturaElectronica', async (req, res) => {
try {
    if (config.production && !afipFacturacionRealHabilitada) {
        return res.status(403).json({
            error: 'Facturacion AFIP en produccion bloqueada. Defini AFIP_HABILITAR_FACTURACION_REAL=1 para habilitarla.',
        });
    }

    const ultimo = await afip.ElectronicBilling.getLastVoucher(req.body.PtoVta, req.body.CbteTipo);
    const siguiente = ultimo + 1;

    const data = {
        ...req.body,
        CantReg: 1, // Registros enviados
        CbteDesde: siguiente,
        CbteHasta: siguiente,
        CbteFch: parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''), 10),
    };

    const resultado = await afip.ElectronicBilling.createVoucher(data);

    res.json({
        ...resultado,
        numeroFactura: resultado.numeroFactura ?? siguiente,
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

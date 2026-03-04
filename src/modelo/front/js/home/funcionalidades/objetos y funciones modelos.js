let variablesModelo = {
    //Logistica
    cotizacionesLogistica: variablesModeloLogistica.cotizacionesLogistica,
    operacionesLogistica: variablesModeloLogistica.operacionesLogistica,
    certificadosLogistica: variablesModeloLogistica.certificadosLogistica,
    tipoOperacion: variablesModeloLogistica.tipoOperacion,
    tipoTransporte: variablesModeloLogistica.tipoTransporte,
    tipoContenedor: variablesModeloLogistica.tipoContenedor,
    tamanoContenedor: variablesModeloLogistica.tamanoContenedor,
    tipoCarga: variablesModeloLogistica.tipoCarga,
    despachante: variablesModeloLogistica.despachante,
    agenteComex: variablesModeloLogistica.agenteComex,
    incoterm: variablesModeloLogistica.incoterm,
    maritima: variablesModeloLogistica.maritima,
    segurosComex: variablesModeloLogistica.segurosComex,
    gastosAgentes: variablesModeloLogistica.gastosAgentes,
    //cobrosYPagos
    pendienteFacturar: variablesModeloLogistica.operacionesLogistica,
    facturasEmitidas: variablesModeloPagosCobros.facturasEmitidas,
    cotizaciones: variablesModeloPagosCobros.cotizaciones,
    cobrosRecibidos: variablesModeloPagosCobros.cobrosRecibidos,
    cliente: variablesModeloPagosCobros.cliente,
    itemVenta: variablesModeloPagosCobros.itemVenta,
    pagosRealizados: variablesModeloPagosCobros.pagosRealizados,
    anticipoFinanciero: variablesModeloPagosCobros.anticipoFinanciero,
    proveedor: variablesModeloPagosCobros.proveedor,
    itemCompra: variablesModeloPagosCobros.itemCompra,
    cuentaCorrienteClientes: variablesModeloPagosCobros.cuentaCorrienteClientes,
    cuentaCorrienteProveedores: variablesModeloPagosCobros.cuentaCorrienteProveedores,
    facturasProveedores: variablesModeloPagosCobros.facturasProveedores,
    //Stock
    stock: variablesModeloInventarios.stock,
    producto: variablesModeloInventarios.producto,
    categoriaProducto: variablesModeloInventarios.categoriaProducto,
    subCategoriaProducto: variablesModeloInventarios.subCategoriaProducto,
    almacen: variablesModeloInventarios.almacen,
    marca: variablesModeloInventarios.marca,
    ubicaciones: variablesModeloInventarios.ubicaciones,
    traspasoUbicaciones: variablesModeloInventarios.traspasoUbicaciones,
    entradaInventario: variablesModeloInventarios.entradaInventario,
    salidaInventario: variablesModeloInventarios.salidaInventario,
    operacionStock: variablesModeloInventarios.operacionStock,
    listaProveedores: variablesModeloInventarios.listaProveedores,
    listasPrecios: variablesModeloInventarios.listasPrecios,
    listaDeVenta: variablesModeloInventarios.listaDeVenta,
    //tesoreria
    chequesTercero: variablesModeloTesoreria.chequesTercero,
    depositoCheques: variablesModeloTesoreria.depositoCheques,
    saldosBancos: variablesModeloTesoreria.saldosBancos,
    itemsBancos: variablesModeloTesoreria.itemsBancos,
    itemsCajas: variablesModeloTesoreria.itemsCajas,
    cotizacionMonedaExtranjera: variablesModeloTesoreria.cotizacionMonedaExtranjera,
    movimientoFinanciero: variablesModeloTesoreria.movimientoFinanciero,
    prestamosEmpresas: variablesModeloTesoreria.prestamosEmpresas,
    transferencia: variablesModeloTesoreria.transferencia,
    liquidacionMoneda: variablesModeloTesoreria.liquidacionMoneda,
    moneda: variablesModeloTesoreria.moneda,
    tipoPago: variablesModeloTesoreria.tipoPago,
    bancos: variablesModeloTesoreria.bancos,
    cajas: variablesModeloTesoreria.cajas,
    saldosCajas: variablesModeloTesoreria.saldosCajas,
    cuentasBancarias: variablesModeloTesoreria.cuentasBancarias,
    impuestoDefinicion: variablesModeloTesoreria.impuestoDefinicion,
    agrupadorImpuesto: variablesModeloTesoreria.agrupadorImpuesto,
    //CRM
    error: variablesModeloCrm.error,
    requerimiento: variablesModeloCrm.requerimiento,
    estadoProceso: variablesModeloCrm.estadoProceso,
    criticidad: variablesModeloCrm.criticidad,
    tarea: variablesModeloCrm.tarea,
    empleadosCrm: variablesModeloCrm.empleadosCrm,
    sectorCrm: variablesModeloCrm.sectorCrm,
    entidadCrm: variablesModeloCrm.entidadCrm,
    //generales
    proyeccionesCashFlow: variablesModeloGenerales.proyeccionesCashFlow,
    grupoSeguridad: variablesModeloGenerales.grupoSeguridad,
    operacionesPermitidas: variablesModeloGenerales.operacionesPermitidas,
    unidadesMedida: variablesModeloGenerales.unidadesMedida,
    pais: variablesModeloGenerales.pais,
    provincia: variablesModeloGenerales.provincia,
    ciudad: variablesModeloGenerales.ciudad,
    //base
    user: variablesModeloBase.user,
    acumulador: variablesModeloBase.acumulador,
    numerador: variablesModeloBase.numerador,
    testing: variablesModeloBase.testing,
    casosTesting: variablesModeloBase.casosTesting,
    empresa: variablesModeloBase.empresa,
    tareasProgramadas: variablesModeloBase.tareasProgramadas,
    logEmails: variablesModeloBase.logEmails,
    //reportes
    erroresAbiertos: variablesModeloReportes.erroresAbiertos,
    salidaSinFacturar: variablesModeloReportes.salidaSinFacturar,
    cobrosPagos: variablesModeloReportes.cobrosPagos,
    entradasPendientes: variablesModeloReportes.entradasPendientes,
    existencias: variablesModeloReportes.existencias,
    anticiposAbiertos: variablesModeloReportes.anticiposAbiertos,
    chequesEnCartera: variablesModeloReportes.chequesEnCartera,
    saldosBancosCajas: variablesModeloReportes.saldosBancosCajas,
    facturacionMensual: variablesModeloReportes.facturacionMensual,
    movimientosBancos: variablesModeloReportes.movimientosBancos,
    movimientosCajas: variablesModeloReportes.movimientosCajas,
    emailLogs: variablesModeloReportes.emailLogs,
    movimientosClientes: variablesModeloReportes.movimientosClientes,
    movimientosProveedores: variablesModeloReportes.movimientosProveedores,
    productosVencimientos: variablesModeloReportes.productosVencimientos
}

$.each(variablesIniciales?.entidades || {}, (indice, value) => {

    variablesModelo[indice] = objetoFusionEntidad(indice)
})

let variablesModeloTransformar = {
    //Logistica
    cotPendientes: variablesModeloLogisticaTransformar.cotPendientes,
    cotRechazado: variablesModeloLogisticaTransformar.cotRechazado,
    confirmarEmbarq: variablesModeloLogisticaTransformar.confirmarEmbarq,
    confTarifa: variablesModeloLogisticaTransformar.confTarifa,
    avisoArribo: variablesModeloLogisticaTransformar.avisoArribo,
    operacionRechazada: variablesModeloLogisticaTransformar.operacionRechazada,
    resetearConfirmaciones: variablesModeloLogisticaTransformar.resetearConfirmaciones,
    //Facturado
    pendFactOperLogistica: variablesModeloPagosCobrosTransformar.pendFactOperLogistica,
    itemsFactRechazo: variablesModeloPagosCobrosTransformar.itemsFactRechazo,
    certificarItem: variablesModeloLogisticaTransformar.certificarItem,
    rechazoCertificarItem: variablesModeloLogisticaTransformar.rechazoCertificarItem,
    facturacionOrdenSalida: variablesModeloPagosCobrosTransformar.facturacionOrdenSalida,
    facturacionOrdenEntrada: variablesModeloPagosCobrosTransformar.facturacionOrdenEntrada

}

$.each(variablesIniciales.transf, (indice, value) => {

    variablesModeloTransformar[indice] = Object.assign(variablesModeloTransformar[indice], variablesIniciales.transf[indice])
})

let variablesFusionadas = {

    cotPendientes: objetoFusion(variablesModelo.cotizacionesLogistica, "cotPendientes"),
    cotRechazado: objetoFusion(variablesModelo.cotizacionesLogistica, "cotRechazado"),
    confirmarEmbarq: objetoFusion(variablesModelo.operacionesLogistica, "confirmarEmbarq"),
    confTarifa: objetoFusion(variablesModelo.operacionesLogistica, "confTarifa"),
    avisoArribo: objetoFusion(variablesModelo.operacionesLogistica, "avisoArribo"),
    operacionRechazada: objetoFusion(variablesModelo.operacionesLogistica, "operacionRechazada"),
    resetearConfirmaciones: objetoFusion(variablesModelo.operacionesLogistica, "resetearConfirmaciones"),
    certificarItem: objetoFusion(variablesModelo.operacionesLogistica, "certificarItem"),
    rechazoCertificarItem: objetoFusion(variablesModelo.operacionesLogistica, "rechazoCertificarItem"),
    pendFactOperLogistica: objetoFusion(variablesModelo.operacionesLogistica, "pendFactOperLogistica"),
    itemsFactRechazo: objetoFusion(variablesModelo.operacionesLogistica, "itemsFactRechazo"),
    facturacionOrdenSalida: objetoFusion(variablesModelo.salidaInventario, "facturacionOrdenSalida"),
    facturacionOrdenEntrada: objetoFusion(variablesModelo.stock, "facturacionOrdenEntrada")


}





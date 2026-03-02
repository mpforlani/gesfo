const funcionesInicioPage = () => {//Ojo si borro esta función cada vez que cierro una pestana va tirar error

}
funcionesInicioPage()
tipoDeCambioDefault = ""//ESto es utiliza para que en el file MonedasTotales.js en la funcion totalesBaseYMoneda, donde se d
let modulosLocales = {
    cobranzas: { ...modulosTotales.cobranzas },
    pagos: { ...modulosTotales.pagos },
    facturacion: { ...modulosTotales.facturacion },
    tesoreria: { ...modulosTotales.tesoreria },
    indices: { ...modulosTotales.indices },
    reportes: { ...modulosTotales.reportes },
    aplicacion: { ...modulosTotales.aplicacion },
    clientes: { ...modulosTotales.clientes },
    proveedores: { ...modulosTotales.proveedores },
    configTesoreria: { ...modulosTotales.configTesoreria },
    configImpositiva: { ...modulosTotales.configImpositiva },
    parametrosGrales: { ...modulosTotales.parametrosGrales },
    empresa: { ...modulosTotales.empresa },
    numeradores: { ...modulosTotales.numeradores },
    testing: { ...modulosTotales.testing },
    tareasProgramadas: { ...modulosTotales.tareasProgramadas },
    emails: { ...modulosTotales.emails },
    acumuladores: { ...modulosTotales.acumuladores }
}

let tareasProgramadasLocal = {}
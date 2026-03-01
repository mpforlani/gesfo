let modulosPages = {
    jquery: [
        "/js/librerias/patoLibrary.js"
    ],
    librerias: [
        "/js/librerias/desencadenante/desencadenante.js",
        "/js/librerias/desencadenante/funcionesDesencadenates.js",
        "/js/librerias/impresion/impresionFormularios.js",
        "/js/librerias/impresion/tipoBloques.js",
        "/js/librerias/print.min.js",
        "/js/librerias/acumulador.js",
        "/js/librerias/apis.js",
        "/js/librerias/carteles.js",
        "/js/librerias/numerador.js",
        "/js/librerias/fechas.js",
        "/js/librerias/pestanas.js",
        "/js/librerias/funcionesDeAtributos.js",
    ],
    generales: [
        "/js/home/funcionesGrales/funcionesFormato.js",
    ],
    modulos: [
        "/js/home/modulos/logistica.js",
        "/js/home/modulos/crm.js",
        "/js/home/modulos/aprobacion.js",
        "/js/home/modulos/facturacion.js"
    ],
    abm: [
        "/js/home/abm/tipoAtributos.js",
        "/js/home/abm/formAbm.js",
        "/js/home/abm/crearAbm.js"
    ],
    formIndividual: [
        "/js/home/unicaInstancia/tipoAtributoForm.js",
        "/js/home/unicaInstancia/formUnicaInstancia.js",
        "/js/home/unicaInstancia/funcionesColecciones.js",
    ],
    atributosInicial: [
        "/js/home/funcionesGrales/monedasTotales.js"
    ],
    atributosInicial: [
        "/js/home/funcionesGrales/monedasTotales.js"
    ],
    tablaDoble: [
        "/js/home/tablaDoble/formDobleTabla.js"
    ],
    variablesIniciales: [
        "/js/home/variablesIniciales/onElementGrales.js",//0
        "/js/home/variablesIniciales/botones.js",//1
        "/js/home/variablesIniciales/atributosSimples.js",//2
        "/js/home/variablesIniciales/variablesIniciales.js",//3
        "/js/home/variablesIniciales/atributosCompuestos.js",//4
    ],
    reporte: [
        "/js/home/reportes/formReportes.js",
        "/js/home/reportes/reporteEmail.js",
        "/js/home/reportes/tipoAtributoReporte.js",
        "/js/home/reportes/tiposdeTabla.js",
        "/js/home/reportes/crearRep.js",
    ],
    unicaInstancia: [
        "/js/home/unicaInstancia/crearFormUnicaInst.js"
    ],
    testing: [
        "/js/testing/testing.js",
    ],
    funcionalidadesBase: [
        "/js/home/funcionalidades/base.js",
    ],
    funcionalidades: [
        "/js/home/funcionalidades/cobrosYPagos.js",//1
        "/js/home/funcionalidades/crm.js",//2
        "/js/home/funcionalidades/generales.js",//3
        "/js/home/funcionalidades/inventario.js",//4
        "/js/home/funcionalidades/logistica.js",//5
        "/js/home/funcionalidades/tesoreria.js",//6
        "/js/home/funcionalidades/reportes.js",//7
        "/js/home/funcionalidades/objetos y funciones modelos.js",//8
    ],
    menuInicial: [
        "/js/home/variablesIniciales/menuInicio.js"
    ],
    seguridad: [
        "/js/home/variablesIniciales/seguridad.js"
    ],
}
function archivosInicios(mod) {
    return Promise.all(
        Object.values(mod).flatMap(grupo =>
            grupo.map(src => {
                const script = document.createElement('script');
                script.src = src;
                script.async = false;
                return new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            })
        )
    );
}

let variablesModeloGenerales = {
    grupoSeguridad: {
        atributos: {
            names: [TR("name"), TA("observaciones"), habilitado],
            titulos: ['Nombre', `Observaciones`, `limite`],
            eliminar: false,
            deshabilitar: true,
        },
        funcionesPropias: {
            inicio: {
                cambiarBoton: [cambiarBoton, `crearBotonInd`, iCrearDoble],
            }
        },
        pest: `Grupo de seguridad`,
        accion: `grupoSeguridad`,
        tablaDobleEntrada: {
            columna: [CH("visualizar"), CH("crear"), CH("editar"), CH("eliminar"), BT("atributos")],
            titulosColumna: [`Consultar`, `Crear`, `Editar`, `Eliminar`, "Atributos"],
            funciones: {
                addname: [addname],
                clickSeguridad: [clickSeguridad],
                botonSeguridad: [botonSeguridad],

            }
        },
        type: "parametrica",
    },
    operacionesPermitidas: {
        atributos: {
            names: [T("name"), F(), habilitado],
            titulos: ['Nombre', `Fecha`, `Descripción`, `habilitado`],
            configAbm: {
                formatoFunc: {
                    primeraLetraMayuscula: [primeraLetraMayuscula, [T("name")]],
                }
            },
            eliminar: false,
            deshabilitar: true
        },
        pest: `Fecha Permitidas`,
        accion: `operacionesPermitidas`,
        type: "parametrica",
        empresa: false
    },
    unidadesMedida: {
        atributos: {
            names: [T({ nombre: "name", width: "quince", clase: "requerido" }), habilitado],
            titulos: [`Unidad`],
            eliminar: false,
            deshabilitar: true,
        },
        pest: `Unidades de medida`,
        accion: `unidadesMedida`,
        type: "parametrica",
        multimoneda: false
    },
    pais: {
        atributos: {
            names: [
                T({ nombre: `name`, clase: "primeraMayusOracion requerido", width: "veinte", validacion: "textoMayuscula" }),
                habilitado
            ],
            titulos: ['Nombre'],
            eliminar: false,
            deshabilitar: true,
        },
        sort: { name: 1 },
        pest: `Pais`,
        pestIndividual: "Pais",
        accion: `pais`,
        type: "parametrica",
        empresa: false
    },
    provincia: {
        atributos: {
            names: [T({ nombre: `name`, clase: "primeraMayusOracion", width: "veinte", validacion: "textoMayuscula" }), P("pais"), habilitado],
            titulos: ['Nombre', `Pais`],
            eliminar: false,
            deshabilitar: true,
        },

        validaciones: ["name", "pais"],
        sort: { name: 1 },
        pest: `Provincia`,
        pestIndividual: "Provincia",
        accion: `provincia`,
        type: "parametrica",
        empresa: false
    },
    ciudad: {
        atributos: {
            names: [T({ nombre: `name`, clase: "primeraMayusOracion requerido", width: "veinte", validacion: "textoMayuscula" }), T({ nombre: `cp`, clase: "textoCentrado", width: "siete" }), P("provincia"), P("pais"), habilitado],
            titulos: ['Nombre', `CP`, `Provincia`, `Pais`],
            eliminar: false,
            deshabilitar: true,
        },
        funcionesPropias: {
            finalAbm: {
                filtroAsociativo: [filtroAsociativo, "provincia", "pais", "provincia"],
            },
            formularioIndiv: {
                filtroAsociativo: [filtroAsociativo, "provincia", "pais", "provincia"],
            },
        },
        sort: { name: 1 },
        pest: `Ciudad`,
        pestIndividual: "Ciudad",
        accion: `ciudad`,
        type: "parametrica",
        empresa: false
    }
}
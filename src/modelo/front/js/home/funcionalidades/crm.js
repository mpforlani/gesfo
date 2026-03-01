let variablesModeloCrm = {
    error: {
        atributos: {
            names: [NS("numerador"),
            FH(),
            P({ nombre: "cliente", clase: "requerido" }),
            TA({ nombre: "asunto", clase: "requerido" }),
            P({ nombre: "estadoProceso", valorInicial: "Ingresado", clase: "requerido" }),
            P({ nombre: "criticidad", clase: "requerido" }), adjunto,
            TF({ nombre: "descripcion", clase: "requerido" }),
            F("fechaResolucion"), H(`estimado`), tareas, F("resolucion"),
            H(`tiempoTotal`),
            TF("resolucionTexto"),],
            titulos: ['Numero', `Fecha`, 'Cliente', `Asunto`, `Estado`, `Criticidad`, `Adjunto`, `Descripcion`, `Resol estimada`, `Tiempo Estimado`, `Cierre`, `Resolucion`, `Tiempo Total`, `tareas`],
            eliminar: true,
            deshabilitar: false
        },
        formInd: {
            inputRenglones: [4, 3, 1, 2, `compuesto`, 2, 6]
        },
        funcionesPropias: {
            formularioIndiv: {
                filtrarTareaPorEntidad: [filtrarTareaPorEntidad, "Error"]
            }
        },
        clasesInput: { consumidoDetalle: "horaMinutos ", remanenteDetalle: "horaMinutos" },
        key: "numerador",
        pest: `Error`,
        pestIndividual: `Ingreso Error`,
        accion: `error`,
        type: "transaccional",
    },
    requerimiento: {
        /* atributos: {
             names: [num, fecha, cliente, observaciones, estadoProceso, P("criticidad"), adjunto, observacionesRectanculo, fechaDos, fechaTres, observacionesRectanculoDos, tareas],
             titulos: ['Numero', `Fecha`, 'Cliente', `Asunto`, `Estado`, `Criticidad`, `Ajunto`, `Descripcion`, `Resol estimada`, `Cierre`, `Resolucion`, `tareas`],
             valoresIniciales: {
                 select: {
                     tarea: `Revision Gesfin`,
                 }
             },
             eliminar: true,
             deshabilitar: false,
         },*/
        formInd: {
            inputRenglones: [4, 3, 1, 2, 1, `compuesto`, 6],
        },
        key: {
            // atributo: num,
            nombre: `numero`,
        },
        pest: `Requerimiento`,
        pestIndividual: `Ingreso Reque`,
        accion: `requerimiento`,
        type: "transaccional",
    },
    estadoProceso: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), N("orden"), habilitado],
            titulos: ['Nombre', `Orden`],
            eliminar: false,
            deshabilitar: true,
            videoTutorial: "/videosTutoriales/market/pais.mp4 "
        },
        sort: { orden: 1 },
        pest: `Estado procesos`,
        accion: `estadoProceso`,
        type: "parametrica",
    },
    criticidad: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), N("orden"), habilitado],
            titulos: ['Nombre', `Orden`],
            eliminar: false,
            deshabilitar: true
        },
        sort: { orden: 1 },
        pest: `Criticidad procesos`,
        accion: `criticidad`,
        type: "parametrica"
    },
    tarea: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), N("orden"), entidadTarea, habilitado],
            titulos: ['Nombre', `Orden`],
            eliminar: false,
            deshabilitar: true
        },
        formInd: {
            inputRenglones: [2, `compuesto`],
        },
        sort: { orden: 1 },
        pest: `Tareas procesos`,
        accion: `tarea`,
        type: "parametrica"
    },
    sectorCrm: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), habilitado],
            titulos: ['Nombre'],
            eliminar: false,
            deshabilitar: true
        },
        pest: `Sector procesos`,
        accion: `sectorCrm`,
        type: "parametrica"
    },
    empleadosCrm: {
        atributos: {
            names: [T({ nombre: "name", oculto: "oculto" }), P({ nombre: "usuario", origen: "user", clase: "requerido" }), habilitado],
            titulos: ["oculto", 'Usuario'],
            eliminar: false,
            deshabilitar: true
        },
        funcionesPropias: {
            cargar: {

            },
            formularioIndiv: {

            }
        },
        pest: `Usuarios del crm`,
        accion: `empleadosCrm`,
        type: "parametrica"
    },
    entidadCrm: {
        atributos: {
            names: [T({ nombre: "name", clase: "requerido" }), habilitado],
            titulos: ['Nombre'],
            eliminar: false,
            deshabilitar: true
        },
        pest: `Entidades CRM`,
        accion: `entidadCrm`,
        type: "parametrica"
    },
}

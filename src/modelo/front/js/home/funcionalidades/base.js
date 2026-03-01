let variablesModeloBase = {
    user: {
        atributos: {
            names: [
                T({ nombre: "name", clase: "primeraLetraMayuscula requerido" }),
                T({ nombre: "surname", clase: "primeraLetraMayuscula requerido" }),
                T({ nombre: "email", clase: "requerido", validacion: "email" }),
                CH("logico"), T({ nombre: "usernameUser", clase: "requerido" }),
                T({ nombre: "password", clase: "requerido", validacion: "password" }),
                gruposDeSeguridad,
                habilitado],
            titulos: ['Nombre', `Apellido`, `Email`, `Empleado`, `Username`, `Contraseña`, `gruposDeSeguridad`],
            eliminar: false,
            deshabilitar: true,
        },
        formInd: {
            inputRenglones: [4, 2, `compuesto`, 3],
        },
        funcionesPropias: {
            finalAbm: {
                passwordAbm: [passwordAbm]
            },
            formularioIndiv: {
                cambiarBotonOkUsuario: [cambiarBotonOkUsuario],
                activarBlanquearContraseña: [activarBlanquearContraseña],
                formatoPassword: [formatoPassword],
                validadPasswordIguales: [validadPasswordIguales],
                chequeGrupo: [chequeGrupo],
            }
        },
        key: "usuario",
        pest: `Usuarios`,
        pestIndividual: `Ingreso de usuario`,
        accion: `user`,
        multimoneda: false,
        type: "parametrica",
        empresa: false
    },
    empresa: {
        atributos: {
            names: [
                T("name"),
                T({ nombre: `documento`, clase: `formatoNumeroDni` }),
                PPE({ nombre: "condicionImpositiva", opciones: ["Responsable Inscripto", "Monotributo", "Consumidor Final", "Exento"] }),
                T({ nombre: `iibb` }),
                F({ nombre: `fechaInicio` }),
                PPE({ nombre: "monedaBase", opciones: ["Pesos", "Dolar", "Euro"] }),
                PPE({ nombre: "monedaAlternativa", opciones: ["Pesos", "Dolar", "Euro"] }),
                PPE({ nombre: "bajaStock", opciones: ["Facturacion", "Orden de salida"] }),
                PPE({ nombre: "ingresaStock", opciones: ["Facturacion", "Remito"] }),
                IM("logo"),
                CH({ nombre: "multimoneda", width: "siete" }),
                CH({ nombre: "cajas", width: "siete" }),
                CH({ nombre: "listaPrecios", width: "siete" }),
                P("cuentasBancarias"),
                PPE({ nombre: "colores", opciones: ["Blanco", "Verde", "Azul", "Amarillo"] }),
                COM(Object.assign({}, direcciones, {
                    componentes: {
                        nombreDireccion: T("nombreDireccion"),
                        calle: T("calle"),
                        numero: T({ nombre: "numero", clase: "center", width: "siete" }),
                        piso: T({ nombre: "piso", clase: "center", width: "siete" }),
                        depto: T({ nombre: "depto", clase: "center", width: "siete" }),
                        cp: T({ nombre: "cp", clase: "center", width: "siete" }),
                        ciudadDir: P({ nombre: "ciudadDir", origen: "ciudad" }),
                        tipoDomicilio: PPE({ nombre: "tipoDomicilio", opciones: ["Fiscal", "Legal", "Real", "Comercial", "Explotación", "Fiscal Electrónico", "Especial"] }),
                        observacionesDirecciones: TA("observacionesDirecciones"),
                    },
                    titulosComponentes: [`Nombre`, `Calle`, `Numero`, "Piso", "Depto", "CP", "Ciudad", "Tipo Domicilio", "Observaciones"],
                })),
                adjunto,
                habilitado],
            titulos: ['Nombre', `CUIT`, `Condición Impositiva`, `IIBB`, `Fecha Inicio`, `Moneda Base`, `Moneda Alternativa`, `Baja Stock`, `Ingresa Stock`, "Logo", `Multimoneda`, `Cajas`, "Listas Precios", "Cuenta Facturación", "Colores", `Adjunto`, `habilitado`],
            eliminar: false,
            deshabilitar: true,
        },
        formInd: {
            inputRenglones: [4, 4, 5, 2, "compuesto", 1],
        },
        funcionesPropias: {
            formularioIndiv: {
                coloresOpc: [coloresOpc],
                formatoDocumento: [formatoDocumento, "documento"],
            },
        },
        key: `name`,
        pest: `Empresa`,
        accion: `empresa`,
        type: "parametrica",
        empresa: false
    },
    acumulador: {
        atributos: {
            names: [
                T({ nombre: "name", width: "veinte" }),
                T({ nombre: "entidad", width: "veinte" }),
                P("moneda"),
                T("mes"),
                T("ano"),
                T("atributoAgrup"),
                I("importe"),
                I("importemb"),
                I("importema"),
                habilitado],
            titulos: ['Nombre', `Entidad`, `Moneda`, `Mes`, `Año`, `Agrupador`, "Importe", "Importe Base", "Importe Alternativa", `habilitado`],
            crear: false,
            editar: false,
            eliminar: false,
            deshabilitar: true,
        },
        funcionesPropias: {
            finalAbm: {
                transformarSemiParametrica: [transformarSemiParametrica],
                ocultarFuncAcumuladores: [ocultarFuncAcumuladores]
            }
        },
        key: "name",
        pest: `Acumulador`,
        pestIndividual: "Acumulador",
        accion: `acumulador`,
        type: "desarrollo",
    },
    numerador: {
        atributos: {
            names: [T("name"), T("numerador"), T("ancla"), T("filtroUno"), habilitado],
            titulos: ['Nombre', `Número`, `Ancla`, "Filtro Uno"],
            eliminar: false,
            deshabilitar: true,
            crear: false,
        },
        key: "name",
        pest: `numerador`,
        pestIndividual: "Numeradores",
        accion: `numerador`,
        type: "desarrollo",
    },
    testing: {
        atributos: {
            names: [TR("name"), TA("observaciones"), habilitado],
            titulos: ['Nombre', `Observaciones`],
            eliminar: true,
            deshabilitar: false,
        },
        funcionesPropias: {
            inicio: {
                cambiarBoton: [cambiarBoton, `crearBotonInd`, iCrearDoble],
                claseBoton: [claseBoton, `historia`, "ocultoSiempre"],
                agregarBoton: [agregarBoton, "okBoton ", iPlay],
                testingBotonPlayAbm: [testingBotonPlayAbm]
            },
        },
        tablaDobleEntrada: {
            claseTituloFila: "pointer",
            columna: [CH("crearInd"), CH("crearIndAbm"), CH("crearAbm"), CH("editInd"), CH("editAbm"), CH("eliminar"), CH("imprimir"), BM({ nombre: "casosCrear", titulo: "Casos" }), T({ nombre: "orden", clase: "textoCentrado", width: "cinco" })],
            titulosColumna: [`Crear Ind`, "Ind x Abm", `Crear Abm`, `Edit Ind`, `Edit Abm`, "Eliminar", "Imprimir", "Casos Crear", "Orden"],
            funciones: {
                claseBoton: [claseBoton, "save", "enEntidad"],
                claseBotonA: [claseBoton, "undo", "ocultoSiempre"],
                claseBotonB: [claseBoton, "cancelBoton", "ocultoSiempre"],
                agregarBoton: [agregarBoton, "okBoton ", iPlay],
                botonPlay: [botonPlay],
                ocultarElementosTesting: [ocultarElementosTesting],
                botonMultipleTesting: [botonMultipleTesting],
                sorteableDoble: [sorteableDoble],

            }
        },
        pest: `Testing`,
        pestIndividual: "Testing",
        accion: `testing`,
        type: "desarrollo",
    },
    casosTesting: {
        atributos: {
            names: [NS("numerador"), T({ nombre: "name", clase: "requerido" }), T("entidad"), habilitado],
            titulos: ["Num", 'Nombre', `Entidad`, `limite`],
            eliminar: true,
            deshabilitar: false,
        },
        funcionesPropias: {
            inicio: {
                cambiarBoton: [cambiarBoton, `crearBotonInd`, iCrearTesting],
                crearTesting: [crearTesting]
            },
            finalAbm: {
                cambiarNombreEntidad: [cambiarNombreEntidad],
                lastRenglonTest: [lastRenglonTEst]
            }

        },
        pest: `Casos Test`,
        pestIndividual: "Casos Test",
        accion: `casosTesting`,
        type: "desarrollo",
        multimoneda: false,//Aca lo pongo porque sino tira multimoneda
    },
    tareasProgramadas: {
        atributos: {
            names: [
                T({ nombre: `name`, clase: "primeraMayusOracion requerido", width: "veinte", validacion: "textoMayuscula" }),
                PPE({ nombre: "funcionTarea", opciones: [] }),
                CH({ nombre: "todos", clase: "dias totalizador" }),
                CH({ nombre: "lunes", clase: "dias" }),
                CH({ nombre: "martes", clase: "dias" }),
                CH({ nombre: "miercoles", clase: "dias" }),
                CH({ nombre: "jueves", clase: "dias" }),
                CH({ nombre: "viernes", clase: "dias" }),
                CH({ nombre: "sabado", clase: "dias" }),
                CH({ nombre: "domingo", clase: "dias" }),
                COM({
                    nombre: "asignados",
                    titulo: "Usuarios",
                    componentes: {
                        userAsignado: P({ nombre: "userAsignado", origen: "user", width: "diez" }),
                        grupoSeguridad: P("grupoSeguridad"),
                    },
                    titulosComponentes: ["Usuario", "Grupo"]
                }),
                habilitado],
            titulos: ["Nombre", `Función`, 'Todos', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingos', 'Asignados'],
            eliminar: true,
            deshabilitar: false,
        },
        formInd: {
            inputRenglones: [2, 8, `compuesto`, 6, 3]
        },
        funcionesPropias: {
            formularioIndiv: {
                ordenBloqueDias: [ordenBloqueDias]
            }
        },
        pest: "Tareas Programadas",
        pestIndividual: "Tareas Programadas",
        accion: `tareasProgramadas`,
        type: "desarrollo",
        multimoneda: false,
    },
    logEmails: {
        atributos: {
            names: [
                FT("fecha"),
                P({ nombre: "username", origen: "user" }),
                T("para"),
                T("copia"),
                T("copiaOculta"),
                T("asunto"),
                T("origen"),
                T("estado"),
            ],
            titulos: ["Fecha", "De", "Para", "Copia", "Copia Oculta", "Asunto", "Orgien", "Estado"],
            eliminar: false,
            deshabilitar: false,
            crear: false,
            editar: false
        },
        pest: "Emails log",
        accion: `logEmails`,
        type: "desarrollo",
        multimoneda: false,
    }
}

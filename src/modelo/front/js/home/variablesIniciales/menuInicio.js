
const modulosTotales = {
    //Home////////////////////////////////////////////////////////////////////////////////////////////
    //CRM
    crm: {
        titulo: "CRM",
        lugar: "home",
        componentes: {
            errorInd: variablesModelo.error,
            error: variablesModelo.error,
            requerimientoInd: variablesModelo.requerimiento,
            requerimiento: variablesModelo.requerimiento,

        }
    },
    //Tesoreria
    cobranzas: {
        titulo: "Cuentas por cobrar",
        lugar: "home",
        componentes: {
            cobrosRecibidosInd: variablesModelo.cobrosRecibidos,
            cobrosRecibidos: variablesModelo.cobrosRecibidos,
            cuentaCorrienteClientes: variablesModelo.cuentaCorrienteClientes,
            cobrosPagosRep: variablesModelo.cobrosPagos,
            movimientosClientesRep: variablesModelo.movimientosClientes,
        }
    },
    pagos: {
        titulo: "Cuentas por pagar",
        lugar: "home",
        componentes: {
            pagosRealizadosInd: variablesModelo.pagosRealizados,
            pagosRealizados: variablesModelo.pagosRealizados,
            anticipoFinanciero: variablesModelo.anticipoFinanciero,
            cuentaCorrienteProveedores: variablesModelo.cuentaCorrienteProveedores,
            facturasProveedores: variablesModelo.facturasProveedores,
            anticiposAbiertosRep: variablesModelo.anticiposAbiertos,
            movimientosProveedoresRep: variablesModelo.movimientosProveedores,
            entradasPendientesRep: variablesModelo.entradasPendientes

        }
    },
    facturacion: {
        titulo: "Facturación",
        lugar: "home",
        componentes: {
            facturasEmitidasInd: variablesModelo.facturasEmitidas,
            facturasEmitidas: variablesModelo.facturasEmitidas,
            facturacionOrdenSalida: variablesFusionadas.facturacionOrdenSalida,
            facturacionOrdenEntrada: variablesFusionadas.facturacionOrdenEntrada,
            salidaSinFacturarRep: variablesModelo.salidaSinFacturar,
            facturacionMensualRep: variablesModelo.facturacionMensual,
        },
    },
    tesoreria: {
        titulo: "Tesoreria",
        lugar: "home",
        componentes: {
            saldosBancos: variablesModelo.saldosBancos,
            saldosCajas: variablesModelo.saldosCajas,
            transferencia: variablesModelo.transferencia,
            chequesTercero: variablesModelo.chequesTercero,
            depositoCheques: variablesModelo.depositoCheques,
            liquidacionMoneda: variablesModelo.liquidacionMoneda,
            chequesEnCarteraRep: variablesModelo.chequesEnCartera,
            saldosCajasRep: variablesModelo.saldosBancosCajas,
            movimientosBancosRep: variablesModelo.movimientosBancos,
            movimientosCajasRep: variablesModelo.movimientosCajas,
        }
    },
    //Logistica
    cotizaciones: {
        titulo: "Cotizaciones",
        lugar: "home",
        componentes: {
            cotizacionesLogisticaInd: variablesModelo.cotizacionesLogistica,
            cotizacionesLogistica: variablesModelo.cotizacionesLogistica,
            cotPendientes: variablesFusionadas.cotPendientes,
            cotRechazado: variablesFusionadas.cotRechazado
        }
    },
    operaciones: {
        titulo: "Operaciones",
        lugar: "home",
        componentes: {
            operacionesLogisticaInd: variablesModelo.operacionesLogistica,
            operacionesLogistica: variablesModelo.operacionesLogistica,
            confirmarEmbarq: variablesFusionadas.confirmarEmbarq,
            confTarifa: variablesFusionadas.confTarifa,
            avisoArribo: variablesFusionadas.avisoArribo,
            operacionRechazada: variablesFusionadas.operacionRechazada,
            resetearConfirmaciones: variablesFusionadas.resetearConfirmaciones,
        },
    },
    gestiones: {
        titulo: "Gestiones",
        lugar: "home",
        componentes: {
            segurosComex: variablesModelo.segurosComex,
            gastosAgentes: variablesModelo.gastosAgentes,

        },
    },
    //Inventario
    stock: {
        titulo: "Stocks",
        lugar: "home",
        componentes: {
            stock: variablesModelo.stock,
            entradaInventario: variablesModelo.entradaInventario,
            salidaInventario: variablesModelo.salidaInventario,
            listaDeVenta: variablesModelo.listaDeVenta,
            listaProveedores: variablesModelo.listaProveedores,
            existenciasRep: variablesModelo.existencias,
            productosVencimientosRep: variablesModelo.productosVencimientos
        },
    },
    indices: {
        titulo: "Indices",
        lugar: "home",
        componentes: {
            cotizacionMonedaExtranjeraRep: variablesModelo.cotizacionMonedaExtranjera,
        },
    },
    //Reportes
    reportes: {
        titulo: "Reportes",
        lugar: "home",
        componentes: {
            erroresAbiertosRep: variablesModelo.erroresAbiertos,
            emailLogsRep: variablesModelo.emailLogs,
        }
    },
    //market///////////////////////////////////////////////////////////////////////////////////////////
    aplicacion: {
        titulo: "Usuario y Seguridad",
        lugar: "market",
        componentes: {
            user: variablesModelo.user,
            grupoSeguridad: variablesModelo.grupoSeguridad,
            //operacionesPermitidas: variablesModelo.operacionesPermitidas,
        },
    },
    clientes: {
        titulo: "Ventas",
        lugar: "market",
        componentes: {
            cliente: variablesModelo.cliente,
            itemVenta: variablesModelo.itemVenta,
            listasPrecios: variablesModelo.listasPrecios
        },
    },
    proveedores: {
        titulo: "Compras",
        lugar: "market",
        componentes: {
            proveedor: variablesModelo.proveedor,
            itemCompra: variablesModelo.itemCompra
        },
    },
    configInvent: {
        titulo: "Config stock",
        lugar: "market",
        componentes: {
            producto: variablesModelo.producto,
            categoriaProducto: variablesModelo.categoriaProducto,
            subCategoriaProducto: variablesModelo.subCategoriaProducto,
            almacen: variablesModelo.almacen,
            ubicaciones: variablesModelo.ubicaciones,
            marca: variablesModelo.marca,
            operacionStock: variablesModelo.operacionStock,

        },
    },
    configComex: {
        titulo: "Config comex",
        lugar: "market",
        componentes: {
            despachante: variablesModelo.despachante,
            agenteComex: variablesModelo.agenteComex,
            tipoOperacion: variablesModelo.tipoOperacion,
            tipoTransporte: variablesModelo.tipoTransporte,
            tipoCarga: variablesModelo.tipoCarga,
            tipoContenedor: variablesModelo.tipoContenedor,
            tamanoContenedor: variablesModelo.tamanoContenedor,
            incoterm: variablesModelo.incoterm,
            maritima: variablesModelo.maritima
        },
    },
    configTesoreria: {
        titulo: "Config tesorería",
        lugar: "market",
        componentes: {
            tipoPago: variablesModelo.tipoPago,
            moneda: variablesModelo.moneda,
            cuentasBancarias: variablesModelo.cuentasBancarias,
            bancos: variablesModelo.bancos,
            itemsBancos: variablesModelo.itemsBancos,
            itemsCajas: variablesModelo.itemsCajas,
            cajas: variablesModelo.cajas

        },
    },
    configImpositiva: {
        titulo: "Config impositiva",
        lugar: "market",
        componentes: {
            agrupadorImpuesto: variablesModelo.agrupadorImpuesto,
            impuestoDefinicion: variablesModelo.impuestoDefinicion,
        },
    },
    configCrm: {
        titulo: "Config CRM",
        lugar: "market",
        componentes: {
            estadoProceso: variablesModelo.estadoProceso,
            criticidad: variablesModelo.criticidad,
            tarea: variablesModelo.tarea,
            empleadosCrm: variablesModelo.empleadosCrm,
            sectorCrm: variablesModelo.sectorCrm,
            entidadCrm: variablesModelo.entidadCrm
        },
    },
    parametrosGrales: {
        titulo: "Parametros Grales",
        lugar: "market",
        componentes: {
            unidadesMedida: variablesModelo.unidadesMedida,
            ciudad: variablesModelo.ciudad,
            provincia: variablesModelo.provincia,
            pais: variablesModelo.pais,
        },
    },
    //Base
    empresa: {
        titulo: "Empresa",
        lugar: "base",
        componentes: {
            empresa: variablesModelo.empresa,
        },
    },
    numeradores: {
        titulo: "Numeradores",
        lugar: "base",
        componentes: {
            numerador: variablesModelo.numerador,
        },
    },
    testing: {
        titulo: "Testing",
        lugar: "base",
        componentes: {
            testing: variablesModelo.testing,
            casosTesting: variablesModelo.casosTesting
        },
    },
    tareasProgramadas: {
        titulo: "Tareas Programadas",
        lugar: "base",
        componentes: {
            tareasProgramadas: variablesModelo.tareasProgramadas,
        },
    },
    emails: {
        titulo: "Emails",
        lugar: "base",
        componentes: {
            logEmails: variablesModelo.logEmails,
        },
    },
    acumuladores: {
        titulo: "Acumuladores",
        lugar: "base",
        componentes: {
            acumulador: variablesModelo.acumulador,
        },
    },
}

function actualizarMenuStock(empresaSeleccionada) {

    const menuStock = $("#menu-container .nav-vert #salidaSinFacturar").parent();
    const segundoMenu = $(`#menu-container .nav-vert [aprobar="facturacionOrdenSalida"]`).parent();

    const valor = empresaSeleccionada?.bajaStock?.trim();

    if (valor == "Orden de salida") {
        menuStock.removeClass("ocultoSiempre");
    } else {
        menuStock.addClass("ocultoSiempre");
    }
    if (valor == "Facturacion") {
        segundoMenu.removeClass("ocultoSiempre");

    } else {
        segundoMenu.addClass("ocultoSiempre");
    }
}
function actualizarMenuStockingresos(empresaSeleccionada) {

    const menuStock = $('#menu-container .nav-vert #stock[aprobar="facturacionOrdenEntrada"]').parent();
    const valor = empresaSeleccionada?.ingresaStock?.trim();

    if (valor === "Remito") {
        menuStock.removeClass("ocultoSiempre");
    } else {
        menuStock.addClass("ocultoSiempre");
    }
}

async function escribirMenu(permisObject, empresasHabilitadas) {
    let secciones = new Object
    if (usu == "master") {

        empresasHabilitadas = consultaPestanas.empresa
        empresaSeleccionada = empresaSeleccionada || Object.values(consultaPestanas.empresa)[0]
    }

    const classElement = {//Este elemento es para si agrega clase noneSEee a elemento que no pertenece a esa parte ejemplo market y home, agrega clase noneSee
        market: "noneSee",
        base: "noneSee",
        home: ""
    }
    const tipoForm = {//agrega clase si es formulario individual
        Ind: "menuFormulario",
        Rep: "menuReportes"

    }
    const titulo = {
        Ind: "pestIndividual"
    }
    const aprobar = {
        aprobar: (ind) => { return `aprobar=${ind}` },
        aprobarColección: (ind) => { return `aprobar=${ind}` },
    }
    const tipoPermisos = {
        Ind: "crear"
    }

    let cabeceraEmpresa = ""

    if (Object.values(empresasHabilitadas)[0] != undefined) {

        empresaFiltro = { empresa: empresaSeleccionada?._id || "" }

        cabeceraEmpresa += `<div class="empresaNavegacion medio"><div class="tituloEmpresa"><div class="empresaSelect">${empresaSeleccionada?.name || ""}</div><div class="trianguloAbajo">&nbsp</div></div>`
        cabeceraEmpresa += `<div class="opcionesEmpresas">`

        if (Object.values(empresasHabilitadas).length > 1) {

            Object.values(empresasHabilitadas)
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(value => {
                    cabeceraEmpresa += `<div class="opcion">${value.name}</div>`;
                });
        }

        cabeceraEmpresa += `</div>`
        if (empresaSeleccionada?.pathImg?.length > 0) {
            cabeceraEmpresa += `<div class="logoEmpresa"><img src="${empresaSeleccionada.pathImg}"> </div>`
        }

        cabeceraEmpresa += `</div>`

        $(`body`).attr("color", empresaSeleccionada?.colores || "")
        // $(`body`).attr("bajaStock", empresaSeleccionada?.bajaStock?.replace(/\s+/g, "") || "")
        $(`body`).attr("cajas", empresaSeleccionada?.cajas || "")
        $(`body`).attr("listaPrecios", empresaSeleccionada?.cajas || "")



    } else {

        let cartel = cartelComplemento({}, "", { claseCartel: "sinPermisosCartel", botonConfirmar: "oculto" })

        let texto = `<p class="mensajeSinPermisos">El usuario no tiene permisos asignados</p>`

        $(cartel).appendTo(`body`);
        $(texto).appendTo(`body .bloque0`);

    }
    let usuario = $(`#usuarioDes`).html()
    let navegacíonSuperior = `<div class="navegacionSupHomeLog">
                <div class="primeraParteNavegacion">
                
                    <div class="contenedorLogo">
                        <div class="logoGesfin">
                            <div class="flecha">&nbsp;</div>
                            <div class="logoGesfin_icon uno">&nbsp;</div>
                            <div class="logoGesfin_icon dos">&nbsp;</div>
                            <div class="logoGesfin_icon tres">&nbsp;</div>
                            <div class="logoGesfin_icon cuatro">&nbsp;</div>

                        </div>
                    </div>
                ${cabeceraEmpresa}
                  </div>
                <div class="ultimaParte">
                    <div class="spanes">
               
                          <div class="spanDiv campana"><span class="material-symbols-outlined">notifications</span><div class="pendientes oculto"><p></p></div>
                          <div class="notificacionesCampana"></div>
                          
                          </div>
                         <div class="spanDiv"><span class="material-symbols-outlined usuario">account_circle</span></div>
                    </div>

                    <div class="nav">
                        <div class="ul men-prin">
                            <div class="nombreUsuario">
                                <h3 id="usuarioDes">${usuario}</h3>
                            </div>
                            <div class="trianguloAbajo">&nbsp;</div>

                            <ul class="men">
                                <li class="menuPest oculto" id="home">Home</li>
                                <li class="menuPest" id="market">Configuracion Aplicacion</li>
                            
                                <li><a href="/logout">Cerrar sesión</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`;

    const navSup = $(navegacíonSuperior)
    $(navSup).appendTo(`.cabecera`)

    let tablas = `<div id="tablas" class="comp">
                <div class="tabs_links" id="tabs_links"></div>
                <div class="comandos" id="comandera"></div>
                <div class="tabs_contents" id="tabs_contents"></div>
            </div>`
    const tabl = $(tablas)
    $(tabl).appendTo(`.cuerpoPrincipal`)

    let navegacion = `<div class="nav-vert" view="home"><div class="closeNavegacion">+</div>
                      <span class="material-symbols-outlined keep navegacion">keep</span>
                      <span class="material-symbols-outlined keep navegacion off oculto">keep_off</span>`

    $.each(modulosLocales, (indice, value) => {
        let permisoGral = false

        let comp = ""
        let order = 0

        $.each(value.componentes, (ind, val) => {

            let permisoObjeto = permisObject?.[empresaSeleccionada?._id]?.[tipoPermisos[ind.slice(- 3)] || "visualizar"]
            let permiso = permisoObjeto?.[ind] || permisoObjeto?.[val.accion]

            permisoGral = Boolean(permisoGral) || permiso

            comp += `<div class="${tipoForm[ind.slice(- 3)] || ""}" style="order:${value?.orden?.[order] || order}"><p class="${tipoForm[ind.slice(- 3)] || "menuSelectAbm"}"  visualizar="${permiso || "none"}" view="${value?.lugar}" id="${val.accion}" ${aprobar?.[val.type]?.(ind) || ""} indice="${indice}">${val[titulo[ind.slice(- 3)] || "pest"]}</p></div>`

            order++
        })
        secciones[value.lugar] = secciones[value.lugar] || permisoGral

        navegacion += `<div class="itemMenu ${indice}">
        
        <h4 class="desplegableAbm oculto ${classElement[value.lugar]}" visualizar=${permisoGral || "none"} view="${value?.lugar}" agrupador="${value.agrupador || value.titulo}">
        ${value.titulo}<div class="trianguloAbajo">&nbsp;</div></h4>`
        navegacion += `<div class="subMenu">`
        navegacion += comp

        navegacion += `</div>`//cierro itemMenu
        navegacion += `</div>`//cierro subMenu
    })

    navegacion += `</div>`//cierro nav vert

    const nav = $(navegacion)

    let tareasProgramadasObj = Object.assign(tareasProgramadasModulo, tareasProgramadasLocal || {})
    let funcionTarea = variablesModelo.tareasProgramadas.atributos.names.find(e => e.nombre == "funcionTarea")

    $.each(tareasProgramadasObj, (indice, value) => {

        funcionTarea.opciones.push(indice)
    })

    $(`#tablas`).before(nav)
    actualizarMenuStock(empresaSeleccionada)
    actualizarMenuStockingresos(empresaSeleccionada)
    if (Object.values(empresasHabilitadas)?.length == 1) {

        $(`.empresaNavegacion.medio .trianguloAbajo`).addClass("oculto")
        $(`.empresaNavegacion.medio`).addClass("unico")
    }

    if (usu == "master") {

        $(`div.nav-vert h4.desplegableAbm,
            div.nav-vert p.menuSelectAbm,
            div.nav-vert p.menuFormulario,
            .menuReportes`).removeAttr("visualizar")
    }

    let menuUsuario = `<li class="menuPest" id="base">Configuracion base</li>`
    let men = $(menuUsuario)

    $(`div.navegacionSupHomeLog li#market`).after(men);

    $.each(secciones, (indice, value) => {

        $(`.menuPest#${indice}`).attr("visualizar", value)

    })

    heigthWindow = "";
    heigtNavSup = "";
    pestanaHeight = ""
    comanderaHeight = ""

    heigthWindow = window.innerHeight;
    heigtNavSup = $(`.navegacionSupHomeLog`).outerHeight(true);

    $(`body`).removeClass("enEspera")
    consultasPestanaIndividual("grupoSeguridad")
    await consultasPestanaIndividual("user")

    let usuarioComp = Object.values(consultaPestanas.user).find(e => e.usernameUser == usu)

    $.each(usuarioComp?.tareasProgramadas, (indice, value) => {

        tareasProgramadasObj[value]()
    })
    let tareasPendientes = 0
    $.each(usuarioComp.tareasPendientes, (indice, value) => {

        let cartel = `<div class="itemCampanita ${value.estado}" funcion="${value.funcion}"><span class="material-symbols-outlined pendiente">pending</span><span class="material-symbols-outlined check">done_all</span><p>${value.tarea}</p></div>`

        $(cartel).appendTo(`.notificacionesCampana`)

        if (value.estado == "pendiente") tareasPendientes++

    })
    if (tareasPendientes > 0) {
        $(`.pendientes`).removeClass("oculto")
        $(`.pendientes p`).html(tareasPendientes)
    }

    let entidadesFiltrosEmail = Object.values(variablesModelo).filter(e => e?.enviar?.emailAtributo != undefined)
    let entidadesemailTransfr = Object.values(variablesModeloTransformar).filter(e => e?.enviar?.emailAtributo != undefined)

    $.each(entidadesFiltrosEmail, (indice, value) => {

        $.each(value?.enviar?.emailAtributo, (ind, val) => {

            entidadesEmail[val] = entidadesEmail[val] || []
            entidadesEmail[val].push(value.accion)

        })
    })
    $.each(entidadesemailTransfr, (indice, value) => {

        $.each(value?.enviar?.emailAtributo, (ind, val) => {
            entidadesEmail[val] = entidadesEmail[val] || []
            entidadesEmail[val].push(value.accion)

        })
    })

    modulosTotales.testing.componentes.testing.tablaDobleEntrada.fila = modulosLocales
    modulosTotales.aplicacion.componentes.grupoSeguridad.tablaDobleEntrada.fila = modulosLocales
}









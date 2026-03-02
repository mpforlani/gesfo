const mesesTitulo = {
    1: "Ene",
    2: "Feb",
    3: "Mar",
    4: "Abr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Ago",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dic",

}

function normalizarMonedaReporte(moneda) {

    if (!moneda) return "";

    return moneda
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function aplicarMonedaSegunFilaReporte(tablaCreada) {

    if (!tablaCreada?.length) return;

    const filas = $("tr.fila, tr.itemsTabla", tablaCreada);

    $.each(filas, (_, fila) => {

        const filaActual = $(fila);
        const celdaMoneda = $("td[atributo='monedaComp'], td[atributo='moneda'], td.monedaComp, td.moneda", filaActual).first();
        const monedaNormalizada = normalizarMonedaReporte(celdaMoneda.text());

        if (!monedaNormalizada) return;

        $("td[type='importe'], td[type='numero'], td.saldo", filaActual).attr("moneda", monedaNormalizada);

        $("td.mesItems div[type='importe'], td.mesItems div[type='numero'], td.anteriores div[type='importe'], td.totalHorizontal div[type='importe'], td.totalHorizontal div[type='numero'], td.total div[type='importe'], td.total div[type='numero']", filaActual)
            .attr("moneda", monedaNormalizada);
    });
}

function obtenerMonedaTotalTablaReporte(objeto, numeroForm, nombreTab) {

    const filtroMoneda =
        objeto?.filtros?.cabecera?.monedaComp ||
        objeto?.filtros?.cabecera?.moneda;

    if (Array.isArray(filtroMoneda)) {
        const monedaFiltrada = filtroMoneda[2] || filtroMoneda[1] || "";
        const monedaNormalizada = normalizarMonedaReporte(monedaFiltrada);
        if (monedaNormalizada) return monedaNormalizada;
    }

    const primerRegistro = consultaGet?.[numeroForm]?.[nombreTab]?.[0] || {};
    return normalizarMonedaReporte(primerRegistro?.monedaComp || primerRegistro?.moneda || "");
}
//Tipo de reportes
function agrupadorSubAgrupadorMeses(objeto, numeroForm, nombreTab, objetoRep) {

    let tabla = `<div class="tituloTabla"><h3>${objeto.tituloTabla || ""}</h3></div>`;
    tabla += `<table tablaRef="${nombreTab}">`;
    tabla += `<tr class="titulosFila">`;
    let totalesHorizontal = {}
    let anteriores = []
    let complemento = ""
    let colum = 0
    let filtro = [];

    if (objeto?.totalHorizontal) {

        totalesHorizontal.total = 0
    }
    if (objetoRep?.anteriores) {

        anteriores.push("Anteriores")
    }
    if (objeto?.tablaComplemento != undefined) {

        complemento = `tablaComplemento=true`
    }

    $.each(objeto.titulos, (ind, val) => {
        let atributo = objeto.atributos[ind];
        tabla += `<th class="titulosCelda ${atributo.nombre || atributo} ${atributo.clase || ""}" atributo="${atributo.nombre || atributo}" type="${atributo.type}" 
                ${widthObject[atributo.width] || ""}> <div class="th-contenido"> <span class="tit">${val}</span> <div class="iconos">${flechasOrden}${filtroIcon}</div></div></th>`;
    });

    const mesActual = parseFloat($(`#bf${numeroForm} input.MesReporteHasta`).val().slice(-2))
    const anoActual = parseFloat($(`#bf${numeroForm} input.MesReporteHasta`).val().slice(0, 4))
    let fechaFin = $(`#bf${numeroForm} input.MesReporteHasta`).val()
    let fechaInicio = $(`#bf${numeroForm} input.MesReporteDesde`).val()
    let mesesTotales = diffMeses(fechaFin, fechaInicio)
    const columnasMes = objeto.atributosEnMeses.length;
    let mesTitulos = mesActual
    let anoTitulos = anoActual
    let mesAnoTitulos = mesTitulos.toString() + anoTitulos.toString()

    for (let x = 0; x < mesesTotales; x++) {

        if (mesTitulos === 0) { mesTitulos = 12; anoTitulos--; }

        const mesAno = `${mesTitulos}${anoTitulos}`;

        tabla += `<th class="th titulosCelda ${mesesTitulo[mesTitulos]}" mesAno="${mesAno}" colum="${x}" >${mesesTitulo[mesTitulos]}</th>`;

        mesTitulos--
        colum++
    }

    tabla += `</tr>`;

    // SEGUNDA FILA

    tabla += `<tr class="tr segunFilaTitulos">`;



    $.each(objeto.titulos, (indice, value) => {
        let atributo = objeto.atributos[indice];

        tabla += `<th class="titulosSegundaFila ${atributo.nombre || atributo} ${atributo.clase || ""}" atributo="${atributo.nombre || atributo}" type="${atributo.type}"  ${widthObject[atributo.width] || ""}><div class="th-contenido"><p class="tit">${value}</p></div></th>`;
        colum++
    });

    let mesTit = mesActual;
    let anoTit = anoActual;

    for (let x = 0; x < mesesTotales; x++) {

        if (mesTit === 0) { mesTit = 12; anoTit--; }

        tabla += `<th class="th compuesto${columnasMes} "  mesAno="${mesTit}${anoTit}">`;

        $.each(objeto.titulosEnMeses, (ind, val) => {
            let atributo = objeto.atributosEnMeses[ind];

            tabla += `<div class="subth ${atributo.nombre || atributo} ${atributo.clase || ""} padding-right-uno"> <p class="tit">${val}</p> </div>`;
        });

        tabla += `</th>`;
        mesTit--;
    }

    tabla += `</tr>`;
    //////Creación fila filtros

    tabla += `<tr class="tr filtros">`

    tabla += `<td class="filtro _id oculto"  style="order:-1" colum="-1"></td>`
    $.each(objeto.titulos, (indice, value) => {

        let atributo = objeto.atributos[indice]

        tabla += `<td class="td filtro ${atributo.nombre || atributo} ${atributo.clase || ""}" atributo="${atributo.nombre || atributo}" colum="${colum}" ${widthObject[atributo.width] || ""}>
                 
                 <input class="filtro ${atributo.nombre || atributo}" atributo="${atributo.nombre || atributo}" type="${atributo.type}"  colum="${colum}" ${autoCompOff} />
                  <span class="material-symbols-outlined oculto ojito">visibility</span>
                   <span class="material-symbols-outlined tachado ojito">visibility_off</span>
                 </td>`

        colum++
    })


    tabla += `</tr>` //Cierre Tr filtros

    $.each(consultaGet[numeroForm][nombreTab], (indice, value) => {

        tabla += `<tr class="fila">`;

        $.each(objeto.atributos, (i, v) => {

            let origen = v.origen || v.nombre;
            let valor = value[origen];

            if (Array.isArray(valor)) valor = valor[0];

            let atributoPestana = consultaPestanas?.[origen]?.[valor];

            tabla += `<td class="td ${v.nombre} ${v.clase} padding-left-uno" atributo="${v.nombre}"  type="${v.type}" ${widthObject[v.width] || ""}>
            ${atributoPestana?.name || value[v.nombre]}</td>`;
        });

        let mesActualAtributo = mesActual
        let anoActualAtributo = anoActual
        let mesAnoActualAtributos = anoActualAtributo.toString() + mesActualAtributo.toString()

        for (let x = 0; x < mesesTotales; x++) {

            mesActualAtributo == 0 ? (mesActualAtributo = 12, anoActualAtributo--) : ""
            mesAnoActualAtributos = anoActualAtributo.toString() + mesActualAtributo.toString()

            tabla += `<td class="td mesItems ${mesesTitulo[mesActualAtributo]} flex" mesAno="${mesAnoActualAtributos}" ${complemento || ""} colum="${colum}";>`

            $.each(objeto.atributosEnMeses, (i, val) => {

                let valorPeriodo = value?.periodos?.find(e => e.periodo == mesAnoActualAtributos)
                let valor = objetoTabla[val.type || val](val, valorPeriodo)
                let vacio = valor == ""

                tabla += `<div class="td ${mesesTitulo[mesActualAtributo]} ${val.nombre || val} padding-right-uno" type="${val.type}" vacio="${vacio}" colum=${colum}><p>${valor}</p></div>`
            })

            tabla += `</td>`//Cierre Td
            colum++
            mesActualAtributo--
        }

        tabla += `</tr>`;
    });

    tabla += `</table>`;

    $(tabla).appendTo(`#t${numeroForm}`);
    aplicarMonedaSegunFilaReporte($(`#t${numeroForm} table[tablaRef="${nombreTab}"]`));
    abrirRegistroIndividual(objeto, numeroForm);

    setTimeout(() => {
        $(`#t${numeroForm}`).removeClass("creado")
    }, 1000);
}
function infoEntidadMasEditTable(objeto, numeroForm, nombreTab, objetoRep) {

    let tabla = ""
    tabla += `<table tablaRef="${nombreTab}">`
    ////creación primera fila de titulos   
    tabla += `<tr class="titulosFila">`
    let colum = 0
    ///Definición titulos ids
    tabla += `<th class="titulosCelda _id oculto" style="order:-1" atributo="_id" colum="-1"><div class="contenido">_id</th>`
    ////
    $.each(objeto.titulos, (indice, value) => {

        let atributo = objeto.atributos[indice]

        tabla += `<th class="titulosCelda ${atributo.nombre || atributo}" style="order:${indice}" atributo="${atributo.nombre || atributo}" type="${atributo.type}" colum="${colum}" ${widthObject[atributo.width] || ""}><div class="th-contenido"><span class="tit">${[value]}</span><div class="iconos">${flechasOrden}${filtroIcon}</div></div></th>`;

        colum++
    })

    $.each(objeto.titulosEditables, (indice, value) => {

        let atributo = objeto.atributosEditables[indice]
        let orden = objeto.ordenEditables?.[indice]

        tabla += `<th class="th titulosCelda ${atributo.nombre || atributo}" atributo="${atributo.nombre || atributo}" type="editable" subtype="${atributo.type}" colum="${colum}" style="order:${orden || indice}" ${widthObject[atributo.width] || ""}><div class="th-contenido"><span class="tit">${[value]}</span><div class="iconos">${flechasOrden}${filtroIcon}</div></div></th>`;

        colum++

    })
    tabla += `</tr>`///Cerrar tr de titulos
    //////Creación fila filtros
    tabla += `<tr class="filtros">`
    colum = 0
    ///Definiciín titulos ids
    tabla += `<td class="filtro _id oculto" style="order:-1" colum="-1"></td>`
    ////
    $.each(objeto.titulos, (indice, value) => {

        let atributo = objeto.atributos[indice]

        tabla += `<td class="td filtro ${atributo.nombre || atributo}" atributo="${atributo.nombre || atributo}" style="order:${indice}" colum="${colum}" ${widthObject[atributo.width] || ""}>
           
           <input  class="filtro ${atributo.nombre || atributo}" atributo="${atributo.nombre || atributo}" type="${atributo.type}"  colum="${colum}" ${autoCompOff} />
           <span class="material-symbols-outlined oculto ojito">visibility</span>
           <span class="material-symbols-outlined tachado ojito">visibility_off</span>
           </td>`

        colum++
    })
    $.each(objeto.titulosEditables, (indice, value) => {

        let atributo = objeto.atributosEditables[indice]
        let orden = objeto?.ordenEditables?.[indice]

        tabla += `<td class="td filtro ${atributo.nombre || atributo}" atributo="${atributo.nombre || atributo}" style="order:${orden || indice}" colum="${colum}" style="order:${orden || indice}" ${widthObject[atributo.width] || ""}>
           
           <input  class="filtro ${atributo.nombre || atributo}" atributo="${atributo.nombre || atributo}" type="${atributo.type}"  colum="${colum}" ${autoCompOff} />
           <span class="material-symbols-outlined oculto ojito">visibility</span>
            <span class="material-symbols-outlined tachado ojito">visibility_off</span>
           
           
           </td>`

        colum++
    })
    tabla += `</tr>`//Cierre tr filtro
    ////Creacipon cuerpo de tabla
    $.each(consultaGet[numeroForm][nombreTab], (indice, value) => {

        colum = 0
        tabla += `<tr class="itemsTabla">`

        //Cración de ids
        tabla += `<td class="_id oculto" atributo="_id"  style="order:"-1" colum="-1">
         <input class="rep _idRefencia" name="_id" colum="-1" value="${value._id}"  ${autoCompOff} /></td>`

        /////
        $.each(objeto.atributos, (ind, val) => {

            let valor = objetoTabla[val.type || val](val, value)

            let vacio = valor == ""
            tabla += `<td class="${val.nombre || val} ${val.clase || ""}" atributo="${val.nombre || val}" type="${val.type}" vacio="${vacio}" style="order:${ind}" colum="${colum}" ${widthObject[val.width] || ""}>${valor}</td>`
            colum++
        })

        $.each(objeto?.atributosEditables, (ind, val) => {

            let orden = objeto?.ordenEditables?.[ind]
            let valor = value?.infoReportes?.[nombreTab]?.[val.nombre || val] || value?.[val.nombre || val]

            tabla += `<td class="${val.nombre || val} editableRep" atributo="${val.nombre || val}" style="order:${orden || ind}" type="${val.type}" colum="${colum}" ${widthObject[val.width] || ""}>
            ${objetoReporteInput[val.type](val, colum, valor)}</td>`
            colum++
        })
        tabla += `</tr>`//Cerrar tr items
    })

    tabla += `</table>`
    tabla += `<div class="barraCalculada"><div class="datosCalculados"><p>Registros: ${consultaGet[numeroForm][nombreTab].length || 0}</p></div></div>`;

    $(tabla).appendTo(`#t${numeroForm}`);
    aplicarMonedaSegunFilaReporte($(`#t${numeroForm} table[tablaRef="${nombreTab}"]`));
    $(`#t${numeroForm} div._id`).addClass("oculto")

    setTimeout(() => {
        $(`#t${numeroForm}`).removeClass("creado")
    }, 1000);


}
function agrupadoMes(objeto, numeroForm, nombreTab, objetoRep) {

    let tabla = `<div class="tituloTabla"><h3>${objeto.tituloTabla || ""}</h3></div>`
    tabla += `<table tablaRef="${nombreTab}">`
    tabla += `<tr class="titulosFila">`
    let totalesHorizontal = {}
    let anteriores = []
    let complemento = ""
    let colum = 0

    const asegurarEstiloRowspanCompat = () => {
        $("#rowspanCompatStyle").remove();

        const style = `
        <style id="rowspanCompatStyle">
            .tablaReporte table[rowspanCompat="true"] tr {
                display: table-row !important;
            }
            .tablaReporte table[rowspanCompat="true"] tr th,
            .tablaReporte table[rowspanCompat="true"] tr td {
                display: table-cell !important;
            }
            .tablaReporte table[rowspanCompat="true"] tr td:hover {
                background-color: transparent !important;
                font-weight: inherit !important;
                cursor: default !important;
            }
            .tablaReporte table[rowspanCompat="true"] tr td.seleccionada {
                background-color: transparent !important;
            }
            .tablaReporte table[rowspanCompat="true"] tr td.hoverGrupoCeldaCompat {
                background-color: rgb(237, 239, 247) !important;
            }
            .tablaReporte table[rowspanCompat="true"] tr td,
            .tablaReporte table[rowspanCompat="true"] tr td * {
                user-select: none !important;
                -webkit-user-select: none !important;
            }
            .tablaReporte table[rowspanCompat="true"] tr.filtros {
                display: none !important;
            }
            .tablaReporte table[rowspanCompat="true"] tr.filtros.active {
                display: table-row !important;
            }
        </style>`;

        $("head").append(style);
    };
    const activarHoverGrupoRowspanCompat = (tablaCreada, columnasUnir) => {
        const limpiarHoverGrupo = () => {
            $("td.hoverGrupoCeldaCompat", tablaCreada).removeClass("hoverGrupoCeldaCompat");
        };

        tablaCreada.off(".rowspanCompatGroupHover");
        tablaCreada.on("mouseenter.rowspanCompatGroupHover", "tr.fila", function () {
            limpiarHoverGrupo();

            const fila = $(this);
            for (const columna of columnasUnir) {
                const grupo = fila.attr(`data-rowspan-group-${columna}`);
                if (!grupo) continue;

                const celdaGrupo = $(`td.${columna}[data-rowspan-group-${columna}="${grupo}"]`, tablaCreada).first();
                if (celdaGrupo.length) {
                    celdaGrupo.addClass("hoverGrupoCeldaCompat");
                }
            }
        });
        tablaCreada.on("mouseleave.rowspanCompatGroupHover", function () {
            limpiarHoverGrupo();
        });
    };
    const aplicarRowspanPorColumna = (tablaCreada, claseColumna) => {
        let celdaBase = null;
        let valorBase = "";
        let cantidadFilas = 1;
        let grupoActual = 0;
        const grupoAttr = `data-rowspan-group-${claseColumna}`;

        const cerrarGrupo = () => {
            if (celdaBase && cantidadFilas > 1) {
                celdaBase.attr("rowspan", cantidadFilas);
            }
        };

        $("tr.fila", tablaCreada).each((_, fila) => {
            const celdaActual = $(`td.${claseColumna}`, fila).first();
            if (!celdaActual.length) return;

            const valorActual = (celdaActual.text() || "").trim();

            if (!celdaBase || valorActual !== valorBase) {
                cerrarGrupo();
                grupoActual++;
                celdaBase = celdaActual;
                valorBase = valorActual;
                cantidadFilas = 1;
                $(fila).attr(grupoAttr, grupoActual);
                celdaBase.attr(grupoAttr, grupoActual);
                return;
            }

            $(fila).attr(grupoAttr, grupoActual);
            celdaActual.remove();
            cantidadFilas++;
        });

        cerrarGrupo();
    };

    if (objeto?.totalHorizontal) {

        totalesHorizontal.total = 0
    }
    if (objetoRep?.anteriores) {

        anteriores.push("Anteriores")
    }
    if (objeto?.tablaComplemento != undefined) {

        complemento = `tablaComplemento=true`
    }

    $.each(objeto.titulos, (indice, value) => {

        let atributo = objeto.atributos[indice]

        tabla += `<th class="titulosCelda  ${atributo.nombre || atributo} ${atributo.clase || ""}" atributo="${atributo.nombre || atributo}" type="${atributo.type}" ${widthObject[atributo.width] || ""}><div class="th-contenido"><span class="tit">${[value]}</span><div class="iconos">${flechasOrden}${filtroIcon}</div></div></th>`;

    })
    tabla += `</div>`;

    const mesAno = (anio, mes) => `${anio}${String(mes).padStart(2, "0")}`;
    const mesActual = parseFloat($(`#bf${numeroForm} input.MesReporteHasta`).val()?.slice(-2))
    const anoActual = parseFloat($(`#bf${numeroForm} input.MesReporteHasta`).val()?.slice(0, 4))
    let fechaFin = $(`#bf${numeroForm} input.MesReporteHasta`).val()
    let fechaInicio = $(`#bf${numeroForm} input.MesReporteDesde`).val()
    let mesesTotales = diffMeses(fechaFin, fechaInicio)

    let mesTitulos = mesActual
    let anoTitulos = anoActual
    let mesAnoTitulos = mesAno(anoTitulos, mesTitulos)

    for (let x = 0; x < mesesTotales; x++) {

        mesTitulos == 0 ? (mesTitulos = 12, anoTitulos--) : ""
        mesAnoTitulos = mesAno(anoTitulos, mesTitulos)

        tabla += `<th class="titulosCelda compuesto${objeto.atributosEnMeses.length} ${mesesTitulo[mesTitulos]}" mesAno="${mesAnoTitulos}">${mesesTitulo[mesTitulos]}</th>`
        mesTitulos--
    }

    for (const total of anteriores) {
        tabla += `<th class="titulosCelda  anteriores" >Anter</th>`
    }
    for (const total of Object.values(totalesHorizontal)) {
        tabla += `<th class="titulosCelda  total" >Total</th>`
    }

    tabla += `</tr>`

    //////Creación fila filtros

    tabla += `<tr class="filtros">`
    colum = 0
    tabla += `<td class="filtro _id oculto"  style="order:-1" colum="-1"></td>`
    $.each(objeto.titulos, (indice, value) => {

        let atributo = objeto.atributos[indice]

        tabla += `<td class="filtro ${atributo.nombre || atributo} ${atributo.clase || ""}" atributo="${atributo.nombre || atributo}"  ${widthObject[atributo.width] || ""}>
                <input name="${atributo.nombre || atributo}" class="filtro ${atributo.nombre || atributo}" atributo="${atributo.nombre || atributo}" type="${atributo.type}"  ${autoCompOff} />
                <span class="material-symbols-outlined oculto ojito">visibility</span>
                <span class="material-symbols-outlined tachado ojito">visibility_off</span>
                </td>`

        colum++
    })
    tabla += "</div>";
    let mesTitulosFiltro = mesActual
    let anoTitulosFiltro = anoActual
    let mesAnoTitulosFiltro = mesAno(anoTitulosFiltro, mesTitulosFiltro)
    for (let x = 0; x < mesesTotales; x++) {

        mesTitulosFiltro == 0 ? (mesTitulosFiltro = 12, anoTitulosFiltro--) : ""
        mesAnoTitulosFiltro = mesAno(anoTitulosFiltro, mesTitulosFiltro)

        $.each(objeto.atributosEnMeses, (ind, val) => {

            let atributo = objeto.atributosEnMeses[ind]
            tabla += `<td class=" filtro ${mesesTitulo[mesTitulosFiltro]} ${atributo.nombre || atributo}" atributo="${atributo.nombre || atributo}">
                      <input  class="filtro ${atributo.nombre || atributo}" atributo="${atributo.nombre || atributo}" type="${atributo.type}" ${autoCompOff} />
                      <span class="material-symbols-outlined oculto ojito">visibility</span>
                      <span class="material-symbols-outlined tachado ojito">visibility_off</span>
                      </td>`

        })

        mesTitulosFiltro--
        colum++
    }

    for (const total of anteriores) {

        tabla += `<td class=" filtro anteriores" atributo="anteriores">
                      <input  class="filtro anteriores" atributo="anteriores" type="cantidad" ${autoCompOff} />
                     </td>`
    }

    for (const total of Object.values(totalesHorizontal)) {

        tabla += `<td class=" filtro total" atributo="total">
                      <input  class="filtro total" atributo="total" type="importe" ${autoCompOff} />
                     </td>`
    }

    tabla += `</tr>` //Cierre Tr filtros
    $.each(consultaGet[numeroForm][nombreTab], (indice, value) => {

        tabla += `<tr class="fila" fila="${indice}" >`

        $.each(objeto.atributos, (i, v) => {

            let atributoPestana = consultaPestanas?.[v.origen || v.nombre]?.[value[v.origen || v.nombre]]

            tabla += `<td class="td ${v.nombre} ${v.clase} padding-left-uno" atributo="${v.nombre}" agrupa="${v.agrupa || ""}" type="${v.type}" ${widthObject[v.width] || ""}>${atributoPestana?.name || value[v?.nombre]} </td>`
        })

        let mesActualAtributo = mesActual
        let anoActualAtributo = anoActual
        let mesAnoActualAtributos = mesAno(anoActualAtributo, mesActualAtributo)

        for (let x = 0; x < mesesTotales; x++) {

            mesActualAtributo == 0 ? (mesActualAtributo = 12, anoActualAtributo--) : ""
            mesAnoActualAtributos = mesAno(anoActualAtributo, mesActualAtributo)

            tabla += `<td class="td mesItems compuesto ${mesesTitulo[mesActualAtributo]} textoCentrado" mesAno="${mesAnoActualAtributos}" ${complemento || ""} colum="${colum}">`

            $.each(objeto.atributosEnMeses, (i, v) => {

                let valorPeriodo = value?.periodos?.find(e => e.periodo == mesAnoActualAtributos)
                let valor = objetoTabla[v.type || v](v, valorPeriodo)

                let vacio = valor == ""
                tabla += `<div class="td ${mesesTitulo[mesActualAtributo]} ${v.nombre || v}" type="${v.type}" vacio="${vacio}" colum=${colum}>${valor}</div>`
            })

            tabla += `</td>`//Cierre Td
            colum++
            mesActualAtributo--
        }

        for (const ant of anteriores) {

            const numericKeys = Object.keys(value).filter(k => /^\d+$/.test(k));
            const minNumeric = Math.min(...numericKeys.map(Number));

            $.each(objeto.atributosEnMeses, (i, v) => {
                let valor = ""

                if (minNumeric < mesAnoActualAtributos) {
                    valor = numeroAString(value[minNumeric][v.nombre || v])
                }
                tabla += `<td class="td anteriores textoCentrado" colum="anteriores">
                              <div class="anteriores" type="importe"  colum="anteriores">${valor}</div></td>`

            })
        }

        for (const total of Object.values(totalesHorizontal)) {

            totalesHorizontal.total = totalesHorizontal.total + value.totalHorizontal
            tabla += `<td class="td totalHorizontal textoCentrado"  colum="total">
                <div class="total" type="importe"  colum="total">${numeroAString(value.totalHorizontal)}</div></td>`
        }

        tabla += `</tr>`

    })

    if (objeto?.totales?.vertical != undefined || objeto.totalVertical) {

        const monedaTotales = obtenerMonedaTotalTablaReporte(objeto, numeroForm, nombreTab);
        const monedaTotalesAttr = monedaTotales ? ` moneda="${monedaTotales}"` : "";

        let totalVertical = Object.values(consultaGet[numeroForm][nombreTab][0].periodos)

        tabla += `<tr class="filaTotal">`

        $.each(objeto.atributos, (i, value) => {

            tabla += `<td class="td total ${value.nombre}" ${widthObject[value.width] || ""}>${objeto.totalTitulos[value.nombre] || "&nbsp"}</td>`

        })

        let mesTitulos = mesActual
        let anoTitulos = anoActual
        let mesAnoTitulos = mesAno(anoTitulos, mesTitulos)


        for (let x = 0; x < mesesTotales; x++) {

            mesTitulos == 0 ? (mesTitulos = 12, anoTitulos--) : ""
            mesAnoTitulos = mesAno(anoTitulos, mesTitulos)

            let total = totalVertical.find(e => e.periodo == mesAnoTitulos) || {}

            tabla += `<td class="td total mes ${mesesTitulo[mesTitulos]} textoCentrado"  mesAno="${mesAnoTitulos}"${monedaTotalesAttr}>${numeroAString(total?.totalVertical || 0)}</td>`
            mesTitulos--
        }

        for (const ant of anteriores) {

            const numericKeys = Object.keys(totales).filter(k => /^\d+$/.test(k));
            const minNumeric = Math.min(...numericKeys.map(Number));

            $.each(objeto.atributosEnMeses, (i, v) => {
                let valor = ""

                if (minNumeric < mesAnoTitulos) {
                    valor = numeroAString(totales[minNumeric])
                }
                tabla += `<td class="td total anteriores textoCentrado" colum="anteriores"${monedaTotalesAttr}>${valor}</td>`

            })
        }
        $.each(totalesHorizontal, (indice, value) => {

            tabla += `<td class="td total totalorizontal textoCentrado"${monedaTotalesAttr}>${numeroAString(totalesHorizontal.total)}</td>`
        })

        tabla += `</tr>`
    }

    tabla += `</table>`

    tabla += `<div class="barraCalculada"><div class="datosCalculados"><p>Registros: ${consultaGet[numeroForm][nombreTab].length || 0}</p></div></div>`;

    $(tabla).appendTo(`#t${numeroForm}`);
    const tablaCreada = $(`#t${numeroForm} table[tablaRef="${nombreTab}"]`);
    aplicarMonedaSegunFilaReporte(tablaCreada);

    if (objeto?.unir && Object.keys(objeto.unir).length > 0) {
        asegurarEstiloRowspanCompat();
        tablaCreada.attr("rowspanCompat", "true");
        const columnasUnir = Object.values(objeto.unir);
        $.each(columnasUnir, (_, claseColumna) => aplicarRowspanPorColumna(tablaCreada, claseColumna));
        activarHoverGrupoRowspanCompat(tablaCreada, columnasUnir);
    }

    abrirRegistroIndividual(objeto, numeroForm)

    setTimeout(() => {
        $(`#t${numeroForm}`).removeClass("creado")
    }, 1000);
}
function tipoExtracto(objeto, numeroForm, nombreTab, objetoRep) {

    let tabla = ""
    tabla += `<div class="tituloTabla"><h3>${objetoRep.tituloTabla || ""}</h3></div>`
    tabla += `<table tablaRef="${nombreTab}">`

    tabla += `<tr class="titulosFila">`

    let colum = 0

    tabla += `<th class="titulosCelda _id oculto" atributo="_id" colum="-1" style="order:-1">
                <div class="th-contenido">_id</div>
              </th>`

    $.each(objetoRep.tablas[nombreTab].titulos, (i, value) => {

        let atr = objetoRep.tablas[nombreTab].atributos[i]

        tabla += `<th class="titulosCelda ${atr.nombre}" atributo="${atr.nombre}"type="${atr.type}" colum="${colum}" style="order:${i}"${widthObject[atr.width] || ""}><div class="th-contenido"> <span class="tit">${value}</span><div class="iconos">${flechasOrden}${filtroIcon}</div></div></th>`

        colum++
    })
    let tieneImporte = objetoRep.tablas[nombreTab].atributos.some(a => a.nombre === "importe");
    if (tieneImporte) {
        tabla += `<th class="titulosCelda saldo" atributo="saldo"type="importe"colum="${colum}"style="order:${colum}"><div class="th-contenido"><span class="tit">Saldo</span><div class="iconos">${flechasOrden}${filtroIcon}</div></div></th>`
    }
    tabla += `</tr>`

    tabla += `<tr class="filtros">`

    tabla += `<td class="filtro _id oculto" colum="-1" style="order:-1"></td>`

    colum = 0

    $.each(objetoRep.tablas[nombreTab].atributos, (i, atr) => {

        tabla += `<td class="td filtro ${atr.nombre}" atributo="${atr.nombre}" colum="${colum}" style="order:${i}" ${widthObject[atr.width] || ""}><input class="filtro ${atr.nombre}" atributo="${atr.nombre}"type="${atr.type}" colum="${colum}"  ${autoCompOff} />
        <span class="material-symbols-outlined oculto ojito">visibility</span>
        <span class="material-symbols-outlined tachado ojito">visibility_off</span>
        </td>`

        colum++
    })
    if (tieneImporte) {
        tabla += `<td class="td filtro saldo" atributo="saldo" colum="${colum}" style="order:${colum}"${widthObject["medio"] || ""}><input class="filtro saldo"atributo="saldo"type="importe" colum="${colum}"  ${autoCompOff} /></td>`
    }
    tabla += `</tr>`

    const inputsCabecera = $(`#bf${numeroForm} .selectCont input`);

    let cabeceraCompleta = true;
    $.each(inputsCabecera, (i, inp) => {
        if (!$(inp).val()) {
            cabeceraCompleta = false;
            return false;
        }
    });
    let saldoAcumulado = null;

    if (tieneImporte) {
        let saldoInicial = stringANumero($(`#bf${numeroForm} div.saldoInicial`).html() || 0)
        saldoAcumulado = cabeceraCompleta ? saldoInicial : null;
    }
    $.each(consultaGet[numeroForm][nombreTab], (i, fila) => {

        colum = 0
        tabla += `<tr class="fila">`


        tabla += `<td class="_id oculto" atributo="_id" colum="-1" style="order:-1"><input class="rep _idRefencia" name="_id" value="${fila._id || ""}"  ${autoCompOff} /></td>`


        $.each(objetoRep.tablas[nombreTab].atributos, (ind, atr) => {

            let contenido = fila[atr.nombre]
            let valor = objetoTabla[atr.type](atr, fila) || contenido

            let claseRojo = "";
            if (atr.nombre == "importe" && parseFloat(contenido) < 0) {
                claseRojo = "importeNegativo";
            }
            if (atr.nombre == "fechaVencimientoProducto" && new Date(contenido) < new Date()) {
                claseRojo = "importeNegativo";
            }

            tabla += `<td class="${atr.nombre} ${atr.clase || ""} ${claseRojo}" atributo="${atr.nombre}" type="${atr.type}"colum="${colum}"style="order:${ind}"${widthObject[atr.width] || ""}>${valor || ""}</td>`

            colum++
        })

        if (tieneImporte) {
            let celdaSaldo = "";
            if (cabeceraCompleta) {
                saldoAcumulado += fila.importe || 0;
                celdaSaldo = numeroAString(saldoAcumulado);
            }
            let saldoFinal = Number(saldoAcumulado) || 0;
            $(`#bf${numeroForm} div.saldoFinal`).html(numeroAString(saldoFinal)) || 0

            tabla += `<td class="saldo textoCentrado" atributo="saldo" type="importe"colum="${colum}" style="order:${colum}">${celdaSaldo}</td>`;
        }
        tabla += `</tr>`
    })

    tabla += `</table>`
    tabla += `<div class="barraCalculada"><div class="datosCalculados"><p>Registros: ${consultaGet[numeroForm][nombreTab].length || 0}</p></div></div>`;
    $(tabla).appendTo(`#t${numeroForm}`)
    aplicarMonedaSegunFilaReporte($(`#t${numeroForm} table[tablaRef="${nombreTab}"]`));
    abrirRegistroIndividual(objeto, numeroForm)

    setTimeout(() => {
        $(`#t${numeroForm}`).removeClass("creado")
    }, 1000)
}
//////
function abrirRegistroIndividual(objeto, numeroForm) {

    $(`#t${numeroForm}`).on("dblclick", `div.infoRegistro tr`, (e) => {

        e.stopPropagation

        let id = $(`td._id`, e.currentTarget).html()
        let objetoDef = variablesModelo[objeto.entidad]
        let detalleFiltroAtributos = { _id: id }
        const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`

        $.ajax({
            type: "get",
            async: false,
            url: `/get?base=${objeto.entidad}${filtros}`,
            before: function () {
                mouseEnEsperaForm(objeto, numeroForm)
            },
            success: function (data) {

                clickFormularioIndividualPestana(objetoDef, numeroForm, data[0])

                quitarEsperaForm(objeto, numeroForm)
            },
            error: function (error) {

                console.log(error);
            }
        })
    })

}
async function tableDetalleEnumeracion(objeto, numeroForm, data) {

    let table = `<div class="contenedorTable">`
    table += `<table>`
    table += `<tr>`

    for (const [index, val] of (objeto?.tablaComplemento?.pestanas ?? []).entries()) {

        if (consultaPestanas[val.origen] == undefined) {

            await consultasPestanaIndividual(val.origen || val.nombre);
        }

        if (index + 1 == objeto.tablaComplemento.pestanas.length) {
            delete objeto.tablaComplemento.pestanas
        }
    }

    $.each(objeto.tablaComplemento.titulos, (ind, val) => {

        table += `<th class="tablaComp ${objeto.tablaComplemento.atributos[ind].clase || ""} ${objeto.tablaComplemento.atributos[ind].nombre}">${val}</th>`
    })
    table += `</tr>`//Cierro tr


    for (const value of data) {

        table += `<tr>`

        for (const val of objeto.tablaComplemento.atributos) {

            table += `<td class="tablaComp ${val.clase || ""} ${val.nombre}">${objetoTabla[val.type](val, value)}</td>`
        }


        table += `</tr>`//Cierro tr
    }

    table += `</table>`//Cierro tablaDetalle
    table += `</div>`//Cierro tablaComplemento

    return table

}
function cotizacionMonedaExtranjera(objeto, numeroForm, nombreTab) {

    let tabla = ""

    console.log(consultaGet[numeroForm][nombreTab])
    $.each(consultaGet[numeroForm][nombreTab], (indice, value) => {

        value.reverse()

        tabla += `<table tablaRef="${indice}">`
        tabla += `<tr class="titulosFila">`
        tabla += `<th>${indice || ""}</th>`

        $.each(value, (ind, val) => {

            tabla += `<th>${val.fecha}</th>`

        })

        tabla += `</tr>`
        tabla += `<tr class="compra">`
        tabla += `<td>Compra</td>`

        $.each(value, (ind, val) => {

            tabla += `<td class="textoCentrado">${val.compra}</td>`

        })

        tabla += `</tr>`

        tabla += `<tr class="venta">`
        tabla += `<td>Venta</td>`

        $.each(value, (ind, val) => {

            tabla += `<td class="textoCentrado">${val.venta}</td>`
        })

        tabla += `</tr>`
        tabla += `</table>`

    })

    $(tabla).appendTo(`#t${numeroForm}`);


}
////Tablas Calculadsas
function tableCalculada(objetoCalc, numeroForm, objeto, tablaName) {

    const mesActual = parseFloat($(`#bf${numeroForm} input.MesReporteHasta`).val().slice(-2))
    const anoActual = parseFloat($(`#bf${numeroForm} input.MesReporteHasta`).val().slice(0, 4))
    let fechaFin = $(`#bf${numeroForm} input.MesReporteHasta`).val()
    let fechaInicio = $(`#bf${numeroForm} input.MesReporteDesde`).val()
    let mesesTotales = diffMeses(fechaFin, fechaInicio)
    let colum = 0
    let tabla = ""

    tabla += `<table class="tablaCalculada ${tablaName}">`
    tabla += `<tr>`

    $.each(objeto.tablas[objetoCalc.tablas[0]].atributos, (indice, value) => {

        tabla += `<td class="td atributosCalculados" ${widthObject[value.width] || ""}>${objetoCalc.titulos[indice] || ""}</td>`
    })

    let mesActualAtributo = mesActual
    let anoActualAtributo = anoActual
    let mesAnoActualAtributos = mesActualAtributo.toString() + anoActualAtributo.toString()

    for (let x = 0; x < mesesTotales; x++) {

        mesActualAtributo == 0 ? (mesActualAtributo = 12, anoActualAtributo--) : ""
        mesAnoActualAtributos = mesActualAtributo.toString() + anoActualAtributo.toString()

        tabla += `<td class="td tablaCalculado atributosCalculados ${mesesTitulo[mesActualAtributo]} textoCentrado" mesAno="${mesAnoActualAtributos}">`

        $.each(objetoCalc.atributos, (i, v) => {

            let primerValor = $(`#t${numeroForm} table[tablaref="${objetoCalc.tablas[0]}"] td.total[mesano="${mesAnoActualAtributos}"]`).html()?.trim()
            let segundoValor = $(`#t${numeroForm} table[tablaref="${objetoCalc.tablas[1]}"] td.total[mesano="${mesAnoActualAtributos}"]`).html()?.trim()
            let valor = operacionesMath[objetoCalc.operacion](stringANumero(primerValor), stringANumero(segundoValor))

            tabla += `<div class=" ${mesesTitulo[mesActualAtributo]} ${v.nombre || v}" type="${v.type}" >${numeroAString(valor)}</div>`

        })

        tabla += `</td>`//Cierre Td
        colum++
        mesActualAtributo--
    }

    tabla += `</tr>`
    tabla += `</table>`

    $(tabla).appendTo(`#t${numeroForm}`);
}
function tablaPromedio(objetoCalc, numeroForm, objeto, tablaName) {

    const mesActual = parseFloat($(`#bf${numeroForm} input.MesReporteHasta`).val().slice(-2))
    const anoActual = parseFloat($(`#bf${numeroForm} input.MesReporteHasta`).val().slice(0, 4))
    let fechaFin = $(`#bf${numeroForm} input.MesReporteHasta`).val()
    let fechaInicio = $(`#bf${numeroForm} input.MesReporteDesde`).val()
    let mesesTotales = diffMeses(fechaFin, fechaInicio)

    let datos = consultaGet[numeroForm][objetoCalc.tablas[0]]
    let tablaBase = objeto.tablas[objetoCalc.tablas[0]]

    let tabla = ""

    tabla += `<table class="tablaCalculada ${tablaName}">`
    tabla += `<tr class="tablaCalculada">`
    let atributosOriginales = tablaBase.atributos || []
    atributosOriginales.forEach((attr, i) => {
        if (i == 0) {
            tabla += `<td class="td atributosCalculados tituloCalculado" ${widthObject[attr.width] || ""}>${objetoCalc.titulos || ""}</td>`
        } else {
            tabla += `<td class="td atributosCalculados" ${widthObject[attr.width] || ""}></td>`
        }

    })

    let mesActualAtributo = mesActual
    let anoActualAtributo = anoActual
    for (let x = 0; x < mesesTotales; x++) {

        if (mesActualAtributo == 0) {
            mesActualAtributo = 12
            anoActualAtributo--
        }

        let periodoBuscado = anoActualAtributo.toString() + mesActualAtributo.toString()

        tabla += `<td class="td tablaCalculado atributosCalculados ${mesesTitulo[mesActualAtributo]} textoCentrado" mesAno="${periodoBuscado}">`

        $.each(objetoCalc.atributos, (ind, val) => {

            let attrName = val.nombre || val
            let itemsDelMes = (datos || []).flatMap(d => d.periodos.filter(p => p.periodo == periodoBuscado).map(p => p[attrName]))

            if (itemsDelMes.length == 0) {
                tabla += `<div class="${mesesTitulo[mesActualAtributo]} ${attrName} " type="${val.type}"></div>`
            } else {
                let total = itemsDelMes.reduce((a, b) => a + b, 0)
                let promedio = total / itemsDelMes.length

                tabla += `<div class="${mesesTitulo[mesActualAtributo]} ${attrName} " type="${val.type}">${numeroAString(promedio)}</div>`
            }

        })

        tabla += `</td>`

        mesActualAtributo--
    }
    let totalesHoriz = datos.map(d => d.totalHorizontal || 0)
    let sumaHorizontal = totalesHoriz.reduce((a, b) => a + b, 0)
    let promedioTotalHorizontal = sumaHorizontal / totalesHoriz.length
    tabla += `<td class="td  textoCentrado" colum="total"><div class="total" type="importe" colum="total">${numeroAString(promedioTotalHorizontal)}</div></td>`

    tabla += `</tr>`
    tabla += `</table>`

    $(tabla).appendTo(`#t${numeroForm}`);

}

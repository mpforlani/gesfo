//Pestanas
function pestanaIndividual(objeto, numeroForm) {

    let p = `<div id=p${numeroForm} class="pestana active"><div class="palabraPest">${objeto.pestIndividual || objeto.pest}</div><div class="closeFormInd" id="${numeroForm}">+</div></div>`; //definicion de pestaña
    let pestana = $(p);

    pestana.appendTo('#tabs_links')

    $(`#p${numeroForm} .closeFormInd`).on(`click`, function () {

        funcionCerrar(this)

    })
}
/////Cabeceras tablas
async function cabeceraAtributoParametrica(objeto, numeroForm) {

    let cabecera = `<div class="comand tabla paddingBotton active" id="bf${numeroForm}">`;

    for (const pest of objeto.cabeceraParam) {
        cabecera += `<div class="primerDiv selecAtributo">`
        cabecera += await cargarPestanasCabecera(objeto, pest)
        cabecera += `</div>`;
    }

    cabecera += `</div>`;//Cerrar comand
    let cab = $(cabecera);
    cab.appendTo('#comandera');

    $(`#bf${numeroForm}`).on("change", `.divSelectInput`, (e) => {

        $(`#t${numeroForm}`).remove()
        crearCuerpoReporte(objeto, numeroForm)
    })
}
function botonesCabecera(objeto, numeroForm) {

    let cabecera = `<div class="divCabecera botones"></div>`
    let cab = $(cabecera);
    cab.appendTo(`#bf${numeroForm}`);

    $.each(objeto.cabeceraCont.botones, (ind, botonObj) => {

        let boton = $(botonObj.boton)
        boton.appendTo(`#bf${numeroForm} .divCabecera.botones`)

        if (botonObj.funcion != undefined) {
            $(`#bf${numeroForm} span.${botonObj.nombre}`).addClass("particular")
            $(`#bf${numeroForm}`).on("click", `span.${botonObj.nombre}.particular`, (e) => {
                botonObj.funcion(objeto, numeroForm)
            })
        }
    })
}

const caberaConstructorDef = {
    fecha: fechaCabeceraReportes,
    rango: rangoFechasReportes,
    parametrica: cabeceraAtributoParametrica,
    parametricaDef: cabeceraAtributoParametricaDef,
    filtroRapido: filtroMultipleCabecera,
    botones: botonesCabecera,
    saldo: cabeceraSaldo
}
function fechaCabeceraReportes(objeto, numeroForm) {

    let fechaHasta = dateNowAFechaddmmyyyy(objeto.cabeceraCont.fecha[0], "y-m-d")
    let fechaDesde = addDay(objeto.cabeceraCont.fecha[0], objeto.cabeceraCont.fecha[1], 0, 0, "y-m-d")

    let cabecera = `<div class="divCabecera alignitemsCenter fechaTablaReporte ${objeto.cabeceraCont.fecha[2]}">
      <div class="divDesde margin-right-uno"><p class="fsOnce centroVertical interSans margin-right-ceroTres">Desde:</p><input type="date" class="fechaTextoDeReporte" value=${fechaDesde}></div>
      <div class="divHasta"><p class="fsOnce centroVertical interSans margin-right-ceroTres">Hasta:</p><input type="date" class="fechaTextoHastaReporte" value=${fechaHasta}></div>
      </div>`

    let cab = $(cabecera);
    cab.appendTo(`#bf${numeroForm}`);
}

function rangoFechasReportes(objeto, numeroForm) {

    const today = new Date();

    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);

    const sixMonthsAgo = new Date(year, today.getMonth() - 6);
    const yearSixMonthsAg = sixMonthsAgo.getFullYear();
    const monthSixMonthsAg = ('0' + (sixMonthsAgo.getMonth() + 1)).slice(-2);

    let cabecera = `<div class="divCabecera mesesPicker">
    <div class="fechaHasta"><p class="fsOnce centroVertical interSans margin-right-ceroTres">Hasta:</p><input type="month" class="MesReporteHasta" name="monthPickerDesde" value="${year}-${month}"></div>
    <div class="fechaDesde"><p class="fsOnce centroVertical interSans margin-right-ceroTres">Desde:</p><input type="month" class="MesReporteDesde" name="monthPickerHasta" value="${yearSixMonthsAg}-${monthSixMonthsAg}"></div>
    </div>`;
    let cab = $(cabecera);
    cab.appendTo(`#bf${numeroForm}`);
}
function cabeceraSaldo(objeto, numeroForm) {
    let fechaDesdeEntidad = objeto.fechaRegistros || fechaDesde
    let saldoInicial = objeto.saldoInicial ?? 0
    let saldoFinal = objeto.saldoFinal ?? 0
    let cabecera = `<div class="divCabecera atributosParametricos">
      <div class="primerDiv selecAtributo row"><p class="fsOnce centroVertical noWrap interSans margin-right-ceroTres">Saldo Inicial:</p><div style="min-width: 7rem" class="saldoInicial centrado transparente bordCinco interSans alignitemsCenter" name="saldoInicial" value=${saldoInicial}></div>
      <div class="primerDiv selecAtributo row"><p class="fsOnce centroVertical noWrap interSans margin-right-ceroTres">Saldo Final:</p><div style="min-width: 7rem" class="saldoFinal centrado transparente bordCinco interSans alignitemsCenter" name="saldoFinal" value=${saldoFinal}></div>
      </div>`

    let cab = $(cabecera);
    cab.appendTo(`#bf${numeroForm}`);
}
async function cabeceraAtributoParametrica(objeto, numeroForm) {

    let cabecera = `<div class="divCabecera atributosParametricos">`

    for (const pest of objeto.cabeceraCont.parametrica) {

        cabecera += `<div class="selecAtributo row interSans ${pest.clases || ""}"><p class="fsOnce centroVertical margin-right-ceroTres">${pest.titulo}:</p>`
        cabecera += await cargarPestanasCabecera(objeto, pest.atributo)
        cabecera += `</div>`;
    }
    cabecera += `</div>`;
    let cab = $(cabecera);
    cab.appendTo(`#bf${numeroForm}`);

}
async function cabeceraAtributoParametricaDef(objeto, numeroForm) {

    let cabecera = `<div class="divCabecera atributosParametricos">`

    for (const pest of Object.values(objeto.cabeceraCont.parametricaDef)) {

        cabecera += `<div class="selecAtributo row interSans ${pest.nombre}" type="${pest.type}"><p class="fsOnce centroVertical margin-right-ceroTres">${pest.titulo}:</p>`
        cabecera += pestanaCabeceraInformePrevalores(objeto, numeroForm, pest, { select: "function" })
        cabecera += `</div>`;

        cabecera += `</div>`;
        let cab = $(cabecera);
        cab.appendTo(`#bf${numeroForm}`);

        $.each(pest?.clases, (indice, value) => {

            $(`#bf${numeroForm} .selecAtributo.${pest.nombre}`).addClass(value)

        })

        $.each(pest.functionChange, (indice, value) => {

            $(`#bf${numeroForm} .selecAtributo.${pest.nombre} .divSelectInput`).on("change", (e) => {


                value[0](objeto, numeroForm, ...value[1],)

            })
        })

        $(`#bf${numeroForm} .selecAtributo.${pest.nombre} .inputSelect`).trigger("change")
    }
}
function fitradoFiltroMultiple(objeto, numeroForm) {

    const valorAtributos = {
        td: (selector) => { return selector.text() || "" },
        input: (selector) => { return selector.val() || "" },
    }

    const tipoValor = {
        igual: (a, b) => a == b,
        distinto: (a, b) => a != b,
        todos: () => true
    }

    let atributoSeleccionado = $(`#bf${numeroForm} .filtroRapido.botonActivo`);
    let type = atributoSeleccionado.attr("type")
    let atributo = atributoSeleccionado.attr("atributo")
    let igual = atributoSeleccionado.attr("iguald")
    let valorComp = atributoSeleccionado.attr("valor")
    let filas = $(`#t${numeroForm} tr.itemsTabla`)

    $.each(filas, (indice, value) => {

        let valor = valorAtributos[type]($(`${type}.${atributo}`, value))

        if (tipoValor[igual](valor, valorComp)) {

            $(value).removeClass(`oculto${atributo}`);

        } else {

            $(value).addClass(`oculto${atributo}`);
        }
    })
}
function filtroMultipleCabecera(objeto, numeroForm) {

    let cabecera = `<div class="divCabecera filtroMultiple">`

    for (const filtro of objeto.cabeceraCont.filtroRapido) {

        cabecera += `<div class="filtroRapido ${filtro.clase || ""}" type="${filtro.type || "td"}" iguald="${filtro.iguald || "igual"}" atributo="${filtro.atributo}" valor="${filtro.valor}" >${filtro.titulo}</div>`

    }

    cabecera += `</div>`;

    let cab = $(cabecera);
    cab.appendTo(`#bf${numeroForm}`);
}
async function cabeceraReporte(objeto, numeroForm) {

    $(`.comand.active`).removeClass("active");
    let cabecera = `<div class="comand tabla paddingBotton acive" id="bf${numeroForm}">`;
    let cab = $(cabecera);

    cab.appendTo('#comandera');

    for (const [indice, value] of Object.entries(objeto.cabeceraCont || {})) {

        await caberaConstructorDef[indice](objeto, numeroForm)
    }

    $.each(objeto.funcionesCabecera, (indice, value) => {

        value[0](objeto, numeroForm, ...value[1])

    })

    $(`#bf${numeroForm}`).on("click", `.filtroRapido`, (e) => {

        $(e.currentTarget).addClass("botonActivo")
        $(e.currentTarget).siblings().removeClass("botonActivo")
        fitradoFiltroMultiple(objeto, numeroForm)

    })
}
function cabeceraSimple(objeto, numeroForm) {

    let cabecera = `<div class="comand tabla paddingBotton" id="bf${numeroForm}">`;

    cabecera += configReporte
    cabecera += `</div>`;//Cerrar comand

    let cab = $(cabecera);
    cab.appendTo('#comandera');

}
////Funciones base
function administrarAtributoTabla(objeto, numeroForm, mo) {

    const subTipeDato = {
        texto: (valor) => { return valor?.val().toLowerCase() },
        importe: (valor) => { return parseFloat(stringANumero(valor?.val())) },
    }

    const tipoDato = {
        importe: (valor) => { return parseFloat(stringANumero(valor?.text())) },
        numero: (valor) => { return parseFloat(stringANumero(valor?.text())) },
        texto: (valor) => { return valor?.text()?.toLowerCase() },
        editable: (valor) => { return subTipeDato[valor?.attr("type")]($(`input`, valor)) },
        parametrica: (valor) => { return valor?.text().toLowerCase() },
        listaArray: (valor) => { return valor?.text()?.toLowerCase() },
        numeradorCompuesto: (valor) => { return parseFloat(stringANumero(`${valor?.text()?.slice(-2 || 0)}${valor?.text()?.slice(0, -2)}`) || 0) },
        fecha: (valor) => {
            const texto = valor?.text()?.trim();
            if (!texto) return -Infinity; // fechas vacías al final (si ordenás descendente)

            // dd-mm-yyyy
            const partes = texto.split("-");
            if (partes.length !== 3) return -Infinity;

            const [d, m, y] = partes.map(Number);
            if (!d || !m || !y) return -Infinity;

            // devolvés un número (timestamp), no un Date
            return new Date(y, m - 1, d).getTime();
        },
        fechaHora: (valor) => {
            let [fecha, hora] = valor?.text().split(" ");
            let [d, m, y] = fecha.split("/");
            let fechaISO = `${y}-${m}-${d}`
            if (hora.length === 5) hora += ":00"; return new Date(`${fechaISO}T${hora}`)
        }
    }

    const ordenarAscendente = (e) => {

        e.stopPropagation()
        const th = $(e.target).closest("th, .subth");
        const typeAtributo = th.attr("type");
        const atributo = th.attr("atributo");

        const tabla = $(e.target).closest("table");
        const tablaRef = tabla.attr("tablaRef");
        let registros = $(`tr:not(.filaTotal):not(.titulosFila):not(.filtros)`, tabla);

        const filaTotal = $(`tr.filaTotal`, tabla);
        $(e.target).addClass("active")
        $(e.target).siblings().removeClass("active")

        registros.sort((a, b) => {

            const tdA = $(a).find(`td.${atributo}`).first();
            const tdB = $(b).find(`td.${atributo}`).first();

            const valor1 = tipoDato[typeAtributo](tdA);
            const valor2 = tipoDato[typeAtributo](tdB);

            if (valor1 < valor2) {

                return -1;
            }
            if (valor1 > valor2) {

                return 1;
            }

            return 0;

        });

        $.each(registros, (indice, value) => {

            $(`#t${numeroForm} table[tablaRef='${tablaRef}']`).append(value);
        });
        if (filaTotal.length) tabla.append(filaTotal);
    }
    const ordenarDescendente = (e) => {

        e.stopPropagation()

        const th = $(e.target).closest("th, .subth");
        const typeAtributo = th.attr("type");
        const atributo = th.attr("atributo");

        const tabla = $(e.target).closest("table");
        const tablaRef = tabla.attr("tablaRef");

        let registros = $(`tr:not(.filaTotal):not(.titulosFila):not(.filtros)`, tabla);
        const filaTotal = $(`tr.filaTotal`, tabla); // ✅ capturamos el total

        $(e.target).addClass("active")
        $(e.target).siblings().removeClass("active")

        registros.sort((a, b) => {

            const tdA = $(a).find(`td.${atributo}`).first();
            const tdB = $(b).find(`td.${atributo}`).first();

            const valor1 = tipoDato[typeAtributo](tdA);
            const valor2 = tipoDato[typeAtributo](tdB);

            if (valor1 > valor2) {

                return -1;
            }
            if (valor1 < valor2) {

                return 1;
            }

            return 0;

        });

        $.each(registros, (indice, value) => {

            $(`#t${numeroForm} table[tablaRef='${tablaRef}']`).append(value);
        });
        if (filaTotal.length) tabla.append(filaTotal);

    }
    const quitarActive = (e) => {

        $(e.target).removeClass("active")

    }
    const filaFiltroOculto = (e) => {

        if ($(e.target).hasClass("active")) {

            $(`#t${numeroForm} tr[class*="oculto"]`).removeClass(function (index, className) {
                return (className.match(/\boculto\S*/g) || []).join(' ');
            });
            $(`#t${numeroForm} td.filtro input`).val("")
        }

        $(e.target).parents('table').find('tr.filtros').toggleClass('active');

    }
    const filtros = (e) => {

        let valorBuscado = $(e.target).val().toLowerCase();
        let primerCaracter = valorBuscado.slice(0, 1);
        const tabla = $(e.target).closest("table");

        let registros = $(`tr:not(.filaTotal):not(.titulosFila):not(.filtros)`, tabla);

        let filtrado = $(e.target).attr(`atributo`);

        if (primerCaracter == ">") {

            let tipoFiltrado = $(e.target).attr("type")
            if (valorBuscado.includes("<")) {
                let indice = valorBuscado.indexOf("<");

                switch (tipoFiltrado) {
                    case `fecha`:
                        let mayorQueFa = valorBuscado.slice(1, indice).split(`/`);
                        let menorQueFa = valorBuscado.slice(indice + 1).split(`/`);
                        let mayorQueFecha = new Date(mayorQueFa[1] + `/` + mayorQueFa[0] + `/` + mayorQueFa[2])
                        let menorQueFecha = new Date(menorQueFa[1] + `/` + menorQueFa[0] + `/` + menorQueFa[2])


                        $.each(registros, (indice, value) => {

                            let valorFila = $(value).children(`td.${filtrado}`).text().split(`/`);
                            let valorFilaFecha = new Date(valorFila[1] + `/` + valorFila[0] + `/` + valorFila[2])
                            if (valorFilaFecha > mayorQueFecha && valorFilaFecha < menorQueFecha) {
                                $(value).removeClass(`oculto${filtrado}`);
                            } else {
                                $(value).addClass(`oculto${filtrado}`);
                            }
                        });
                        break;
                    case `importe`:

                        let mayorQueNumero = parseFloat(valorBuscado.slice(1, indice));
                        let menorQueNumero = parseFloat(valorBuscado.slice(indice + 1));

                        $.each(registros, (indice, value) => {
                            let valorFilaNumero = parseFloat(stringANumero($(`td.${filtrado}`, value).text()));;

                            if (valorFilaNumero > mayorQueNumero && valorFilaNumero < menorQueNumero) {
                                $(value).removeClass(`oculto${filtrado}`);
                            } else {
                                $(value).addClass(`oculto${filtrado}`);
                            }
                        });
                        break;
                }
            } else {

                switch (tipoFiltrado) {
                    case `fecha`:

                        let valorBuscadoMenorFecha = valorBuscado.slice(1).split(`/`);
                        let valorBuscadoMenorFechaDef = new Date(valorBuscadoMenorFecha[1] + `/` + valorBuscadoMenorFecha[0] + `/` + valorBuscadoMenorFecha[2])

                        $.each(registros, (indice, value) => {
                            let valorFilaFecha = $(value).children(`td.${filtrado}`).text().split(`/`);
                            let valorfilaFechaDef = new Date(valorFilaFecha[1] + `/` + valorFilaFecha[0] + `/` + valorFilaFecha[2])

                            if (valorfilaFechaDef > valorBuscadoMenorFechaDef) {
                                $(value).removeClass(`oculto${filtrado}`);
                            } else {
                                $(value).addClass(`oculto${filtrado}`);
                            }
                        });
                        break;
                    case `importe`:
                        let valorBuscadoMenorNumero = parseFloat(valorBuscado.slice(1));

                        $.each(registros, (indice, value) => {
                            let valorFilaNumero = parseFloat(stringANumero($(`td.${filtrado}`, value).text()));

                            if (valorFilaNumero > valorBuscadoMenorNumero) {
                                $(value).removeClass(`oculto${filtrado}`);
                            } else {
                                $(value).addClass(`oculto${filtrado}`);
                            }
                        });

                        break;
                }
            }
        } else if (primerCaracter == "<") {

            let tipoFiltrado = $(e.target).attr("type")

            if (valorBuscado.includes(">")) {
                let indice = valorBuscado.indexOf(">");

                switch (tipoFiltrado) {
                    case `fecha`:
                        let mayorQueFecha = Date.parse(valorBuscado.slice(1, indice));
                        let menorQueFecha = Date.parse(valorBuscado.slice(indice + 1));

                        $.each(registros, (indice, value) => {
                            let valorFilaFecha = Date.parse(
                                $(value).children(`td.${filtrado}`).text().toLowerCase()
                            );

                            if (
                                valorFilaFecha < mayorQueFecha &&
                                valorFilaFecha > menorQueFecha
                            ) {
                                $(value).removeClass(`oculto${filtrado}`);
                            } else {
                                $(value).addClass(`oculto${filtrado}`);
                            }
                        });
                        break;
                    case `importe`:

                        let mayorQueNumero = parseFloat(valorBuscado.slice(1, indice));
                        let menorQueNumero = parseFloat(valorBuscado.slice(indice + 1));

                        $.each(registros, (indice, value) => {

                            let valorFilaNumero = parseFloat(stringANumero($(`td.${filtrado}`, value).text()));

                            if (valorFilaNumero < mayorQueNumero && valorFilaNumero > menorQueNumero) {
                                $(value).removeClass(`oculto${filtrado}`);
                            } else {
                                $(value).addClass(`oculto${filtrado}`);
                            }
                        });
                        break;

                }
            } else {
                switch (tipoFiltrado) {
                    case `fecha`:
                        let valorBuscadoMenorFecha = Date.parse(valorBuscado.slice(1));

                        $.each(registros, (indice, value) => {
                            let valorFilaFecha = Date.parse(
                                $(value).children(`td.${filtrado}`).text().toLowerCase()
                            );

                            if (valorFilaFecha < valorBuscadoMenorFecha) {
                                $(value).removeClass(`oculto${filtrado}`);
                            } else {
                                $(value).addClass(`oculto${filtrado}`);
                            }
                        });
                        break;
                    case `importe`:

                        let valorBuscadoMenorNumero = parseFloat(valorBuscado.slice(1));

                        $.each(registros, (indice, value) => {
                            let valorFilaNumero = parseFloat(stringANumero($(`td.${filtrado}`, value).text()));

                            if (valorFilaNumero < valorBuscadoMenorNumero) {
                                $(value).removeClass(`oculto${filtrado}`);
                            } else {
                                $(value).addClass(`oculto${filtrado}`);
                            }
                        });
                        break;
                }
            }
        } else {

            $.each(registros, (indice, value) => {

                let valorFila = $(`td.${filtrado}`, value).text()?.toLowerCase();

                if (valorFila.includes(valorBuscado)) {

                    $(value).removeClass(`oculto${filtrado}`);
                } else {
                    $(value).addClass(`oculto${filtrado}`);
                }
            })
        }
    }

    $(`#t${numeroForm}`).on("click", `.flechasOrden span.arriba:not(.active)`, ordenarAscendente)
    $(`#t${numeroForm}`).on("click", `.flechasOrden span.abajo:not(.active)`, ordenarDescendente)
    $(`#t${numeroForm}`).on("click", `.flechasOrden span.active`, quitarActive)
    $(`#t${numeroForm}`).on("click", `.filtro span`, filaFiltroOculto)
    $(`#t${numeroForm}`).on("input", `tr.filtros input`, filtros)

    $(`#t${numeroForm} th.${objeto?.ordenDefault?.[0]?.nombre} .flechasOrden span.${objeto?.ordenDefault?.[1]}`).trigger("click")
    $(`#t${numeroForm}`).data("orden-ready", true);
    let alto = $(`#t${numeroForm} tr.titulosFila`).height()
    $(`#t${numeroForm} tr.filtros`).css({ "top": `${alto}px` })


}
//Funciones que no aplica a tods las tablas
function asignarMonedaImporte(objeto, numeroForm, mon) {

    let filas = $(`#t${numeroForm} .tr.items`)
    let monedaForm = mon || "moneda"

    $.each(filas, (indice, value) => {

        let monedaFila = $(`.td.${monedaForm.nombre || monedaForm}`, value).html()
        $('.td[type="importe"]', value).attr(`moneda`, monedaFila)

    })
}
function desOcultarPickerDatePorValor(objeto, numeroForm, valor) {

    const desocultarPick = (e) => {

        let valorSel = $(e.target).val()

        if (valor == valorSel) {

            $(`#bf${numeroForm} .fechaTablaAbm`).removeClass("oculto")
            $(`#bf${numeroForm} .selecAtributo`).removeClass("todos")

        } else if (valorSel == "Todas") {


            $(`#bf${numeroForm} .fechaTablaAbm`).removeClass("oculto")
            $(`#bf${numeroForm} .selecAtributo`).addClass("todos")

        } else {

            $(`#bf${numeroForm} .selecAtributo`).removeClass("todos")
            $(`#bf${numeroForm} .fechaTablaAbm`).addClass("oculto")
        }
    }

    $(`#bf${numeroForm}`).on("change", `input.inputSelect`, desocultarPick)

}
//enviarRegistros
async function salvarinfoReportes(objeto, numeroForm) {

    transformarNumeroAntesEnviar(numeroForm)

    let registros = $(`#t${numeroForm} tr.modificado`)

    const envios = registros.map((i, value) => {
        const dataNuevo = {};

        let tableFather = $(value).parents("table").attr("tablaref")

        $.each($('input', value), (indi, val) => {

            dataNuevo[val.name] = val.value;
        });

        return new Promise((resolve, reject) => {
            $.ajax({
                type: "put",
                url: `/put?base=${objeto.tablas[tableFather].entidad}`,
                contentType: "application/json",
                data: JSON.stringify(dataNuevo),
                beforeSend: function () {
                    mouseEnEsperaMenu(objeto, numeroForm);
                },
                success: function (response) {
                    // ajustá el closest() al contenedor real que querés des-marcar
                    $(value).closest("tr").removeClass("modificado");
                    resolve(response);
                },
                error: function (error) {
                    console.log(error);
                    reject(error);
                },
            });
        });
    });

    try {
        await Promise.all(envios);

        let cartel = cartelInforUnaLinea(
            "Los registros se grabaron correctamente",
            "✔️",
            { cartel: "infoChiquito verde", close: "ocultoSiempre" }
        );
        $(cartel).appendTo(`#bf${numeroForm}`);
    } finally {
        // Esto conviene que siempre corra, haya error o no
        quitarEsperaMenu(objeto, numeroForm);
        removeCartelInformativo(objeto, numeroForm);
    }
}
function asgregarStickyColumnas(objeto, numeroForm, columnas) {

    let stickyposition = 0

    $.each(columnas, (indice, value) => {

        $(`#t${numeroForm} .td.${value.nombre},
           #t${numeroForm} .th.${value.nombre}:not(.transparent)`).css({
            'position': 'sticky',
            'left': `${stickyposition}px`, // Ajusta según el ancho de las columnas anteriores
            'backdrop-filter': 'blur(30px)',
            'z-index': 10,
            "boxSizing": 'border-box',
        });

        let th = $(`#t${numeroForm} .th.${value.nombre}:first`)
        const width = th.width() || 0; // contenido
        const paddingLeft = parseFloat(th.css("padding-left")) || 0;
        const paddingRight = parseFloat(th.css("padding-right")) || 0;
        const borderLeft = parseFloat(th.css("border-left-width")) || 0;
        const borderRight = parseFloat(th.css("border-right-width")) || 0;


        const anchoTotal =
            width +
            paddingLeft +
            paddingRight +
            borderLeft +
            borderRight;

        stickyposition += anchoTotal
    })
}
function asgregarStickyColumnasTabla(objeto, numeroForm, columnas) {

    let stickyposition = 0

    $.each(columnas, (indice, value) => {

        $(`#t${numeroForm} td.${value.nombre},
           #t${numeroForm} th.${value.nombre}:not(.transparent)`).css({
            'position': 'sticky',
            'left': `${stickyposition}px`, // Ajusta según el ancho de las columnas anteriores
            'backdrop-filter': 'blur(30px)',
            'z-index': 10,
            "boxSizing": 'border-box',
        });

        let th = $(`#t${numeroForm} th.${value.nombre}:first`)
        const width = th.width() || 0; // contenido
        const borderLeft = parseFloat(th.css("border-left-width")) || 0;
        const borderRight = parseFloat(th.css("border-right-width")) || 0;


        const anchoTotal =
            width +
            borderLeft +
            borderRight;

        stickyposition += anchoTotal

    })
}
function asgregarStickyDiv(objeto, numeroForm, div) {

    let stickyposition = 0

    $.each(div, (indice, value) => {

        $(`.${div}`).css({
            'position': 'sticky',
            'left': `${stickyposition}px`, // Ajusta según el ancho de las columnas anteriores
            'backdrop-filter': 'blur(30px)',
            'z-index': 10,
            "boxSizing": 'border-box',
        });

        let th = $(`.th.${value.nombre}:first`)
        const width = th.width() || 0; // contenido
        const paddingLeft = parseFloat(th.css("padding-left")) || 0;
        const paddingRight = parseFloat(th.css("padding-right")) || 0;
        const borderLeft = parseFloat(th.css("border-left-width")) || 0;
        const borderRight = parseFloat(th.css("border-right-width")) || 0;


        const anchoTotal =
            width +
            paddingLeft +
            paddingRight +
            borderLeft +
            borderRight;

        stickyposition += anchoTotal
    })
}
function valorParametrica(objeto, numeroForm, data, atributo, datoBuscado, multiplicador, nuevoAtributo) {
    $.each(data, (indice, value) => {
        let unidadMedida = value.unidadesMedida;

        let atribut = consultaPestanas[atributo][value[atributo]];
        let unidades = atribut?.["unidadesMedida"] || [];
        let precios = atribut?.[datoBuscado] || [];
        let index = unidades.indexOf(unidadMedida);
        let buscado = index >= 0 ? precios[index] : precios[0] || 0;
        if (multiplicador == "totalHorizontal") {
            value[nuevoAtributo] = value?.[multiplicador] * buscado;
        } else {
            $.each(value.periodos, (ind, val) => {
                let cantidad = val?.[multiplicador]
                val[nuevoAtributo] = cantidad * buscado;
            })
        }

    });

    return data;
}
function totalVerticalManual(objeto, numeroForm, tabla) {

    let totales = new Object
    let celdas = $(`#t${numeroForm} table[tablaRef="${tabla}"] tr[class*='fila']:not(.filaTotal) td.mesItems`)
    let anteriores = $(`#t${numeroForm} table[tablaRef="${tabla}"] tr[class*='fila']:not(.filaTotal) td.anteriores`)

    $.each(celdas, (indice, celd) => {

        let mes = $(celd).attr("mesano")
        totales[mes] = (totales[mes] || 0) + stringANumero($(`div`, celd).html() || 0)
    })
    $.each(anteriores, (indice, ant) => {

        totales.ant = (totales.ant || 0) + stringANumero($(`div`, ant).html() || 0)
    })

    let filasTot = $(`#t${numeroForm} table[tablaRef="${tabla}"] tr.filaTotal td.total.mes`)

    $.each(filasTot, (ind, val) => {
        let mes = $(val).attr("mesano")

        $(val).html(numeroAString(totales[mes]) || "")

    })
    $(`#t${numeroForm} table[tablaRef="${tabla}"] tr.filaTotal td.anteriores`).html(numeroAString(totales.ant) || "")

}
/*function fechasReportes(objeto, numeroForm, fecha) {
    let fechas = ""
    if (fecha == "rango") {

        const today = new Date();

        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);

        const sixMonthsAgo = new Date(year, today.getMonth() - 6);
        const yearSixMonthsAg = sixMonthsAgo.getFullYear();
        const monthSixMonthsAg = ('0' + (sixMonthsAgo.getMonth() + 1)).slice(-2);

        fechas += `<div class="primerDiv mesesPicker">
    <div class="fechaHasta"><div class="tituloPick"><h3>Hasta:</h3></div><input type="month" class="MesReporteHasta" name="monthPickerDesde" value="${year}-${month}"></div>
    <div class="fechaDesde"><div class="tituloPick"><h3>Desde:</h3></div><input type="month" class="MesReporteDesde" name="monthPickerHasta" value="${yearSixMonthsAg}-${monthSixMonthsAg}"></div>
    </div>`;

    } else if (fecha == "fecha") {

        let fechaDesdeEntidad = objeto.fechaRegistros || fechaDesde

        fechas += `<div class="fechaTablaAbm">
      <div><p>Desde:</p><input name="fechaDesde" type="date" class="fechaTextoDeAbm" value=${fechaDesdeEntidad}></div>
      <div><p>Hasta:</p><input name="fechaHasta" type="date" class="fechaTextoHastaAbm" value=${fechaHasta}></div>
      </div>`

    } else if (fecha == "saldos") { // para probar si anda el saldo, volar luego

        let fechaDesdeEntidad = objeto.fechaRegistros || fechaDesde

        fechas += `<div class="fechaTablaAbm">
      <div><p>Desde:</p><input name="fechaDesde" type="date" class="fechaTextoDeAbm" value=${fechaDesdeEntidad}></div>
      <div><p>Hasta:</p><input name="fechaHasta" type="date" class="fechaTextoHastaAbm" value=${fechaHasta}></div>
      </div>`

        let saldoInicial = objeto.saldoInicial ?? 0
        let saldoFinal = objeto.saldoFinal ?? 0
        fechas += `<div class="saldosAbm">
      <div class="primerDiv atributoCompletoCabecera"><h4>Saldo Inicial:</h4><div class="saldoInicial textoCentrado transparente bord formatoNumero cabecera" style="min-width: 7rem" name="saldoInicial" value=${saldoInicial}></div>
      <div class="primerDiv atributoCompletoCabecera"><h4>Saldo Final:</h4><div class="saldoFinal textoCentrado transparente bord formatoNumero cabecera" style="min-width: 7rem" value=${saldoFinal}></div>
      </div>`
    }
    let cab = $(fechas);
    cab.appendTo(`#bf${numeroForm}`);
}*/
function ocultarFechaFiltroRapido(objeto, numeroForm, valor) {

    function ocultar(e) {

        let valorSeleccionado = $(e.target).text()

        if (valor == valorSeleccionado) {

            $(`#bf${numeroForm} .fechaTablaReporte`).addClass("chau")

            setTimeout(() => {
                $(`#bf${numeroForm} .fechaTablaReporte`).addClass("oculto")
                $(`#bf${numeroForm} .fechaTablaReporte`).removeClass("chau")
            }, 600);

        } else {

            $(`#bf${numeroForm} .fechaTablaReporte`).removeClass("oculto")
            $(`#bf${numeroForm} .fechaTablaReporte`).addClass("hola")

            setTimeout(() => {

                $(`#bf${numeroForm} .fechaTablaReporte`).removeClass("hola")
            }, 600);

        }
    }

    $(`#bf${numeroForm}`).on("click", ".filtroRapido", ocultar)
}
function pestanaFiltro(objeto, numeroForm, atributo) {

    const tipoValor = {
        igual: (valor) => { return { [atributo]: valor } },
        distinto: (valor) => { return { [atributo]: { $ne: valor } } },
        or: (valor) => { return { $or: valor } },
        nor: (valor) => { return { $nor: valor } },
        todos: () => { return {} }

    }

    let valor = $(`#bf${numeroForm} .selectCont.${atributo} input.inputSelect`).val()

    let type = objeto.cabeceraCont.parametricaDef[atributo].infoAtr[valor]
    return tipoValor[Object.keys(type)[0]](Object.values(type)[0] || "")
}
function ocultarFechaReporte(objeto, numeroForm, atributo, valor) {

    let valorSeleccionado = $(`#bf${numeroForm} .selectCont.${atributo} input.inputSelect`).val()

    if (valorSeleccionado == valor) {

        $(`#bf${numeroForm} .fechaTablaReporte`).addClass("chau")

        setTimeout(() => {
            $(`#bf${numeroForm} .fechaTablaReporte`).addClass("oculto")
            $(`#bf${numeroForm} .fechaTablaReporte`).removeClass("chau")
        }, 600);

    } else {

        $(`#bf${numeroForm} .fechaTablaReporte`).removeClass("oculto")
        $(`#bf${numeroForm} .fechaTablaReporte`).addClass("hola")

        setTimeout(() => {

            $(`#bf${numeroForm} .fechaTablaReporte`).removeClass("hola")
        }, 600);

    }
}
function ordenarTablasRep(objeto, numeroForm, tabla) {

    const cont = $(`#t${numeroForm}`);

    if (!cont.data("orden-ready")) {
        setTimeout(() => ordenarTablasRep(objeto, numeroForm, tabla), 10);
        return;
    }

    cont
        .find(`table[tablaRef="${tabla}"] th.producto .flechasOrden span.arriba:not(.active)`)
        .trigger("click");
    cont
        .find(`table[tablaRef="${tabla}"] th.fechaVencimientoProducto .flechasOrden span.arriba:not(.active)`)
        .trigger("click");
}
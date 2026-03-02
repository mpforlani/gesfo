function crearTablaDobleEntradaForm(objeto, numeroFormAnt, consulta) {

    const numeroForm = contador
    contador++

    consultaGet[numeroForm] = consulta
    let accion = objeto.accion;
    let tabla = ""

    let p = `<div id=p${numeroForm} class="pestana active"><div class="palabraPest">${objeto.pest}</div><div class="close" id="${numeroForm}">+</div></div>`; //definicion de pestañas
    let pestana = $(p);

    let imgs = `<div class="comanderaPestana active" id="bf${numeroForm}"><div class="botonesPest">${iDelete}${undoF}${iCruz}${iSave}</div></div>`;
    let imagenes = $(imgs);

    pestana.appendTo('#tabs_links'); //colgamos la pestaña finala
    imagenes.appendTo('#comandera');
    //////////////////////

    let atributosCabecera = tipoAtributoForm(objeto, numeroForm, (consulta?.orginal?.[0] || consulta || []));//Esto esta ok carga los atributos de form individual
    tabla += `<div id="t${numeroForm}" class="tabs_contents_item active formularioPestana tablaDoble center" tabla="tablaDoble" nombre="${objeto.nombre || objeto.accion}" preFather="${numeroFormAnt}">`;
    tabla += `<form method="POST" action="/${accion}" id="f${accion}${numeroForm}"></form>`;
    tabla += atributosCabecera;
    tabla += `</div>`;
    tabla += `<table class="tablaDoble" id="de${numeroForm}">`;

    tablaDoble(numeroForm, objeto, (consulta?.entidad || consulta), tabla);
    active(numeroForm);

    $(`#t${numeroForm}`).css(`max-height`, heightTabla(numeroForm))

    $(`#bf${numeroForm}`).on("click", `.save:not(.enEspera)`, (e) => {

        e.preventDefault();

        enviarFormularioDoble(objeto, numeroForm);

    });
    $(`#t${numeroForm} .deleteBoton`).on("click", () => {

        eliminarRegistroFormularioDoble(objeto, numeroForm)
    });
    /* $(`#t${numeroForm} .cruzBoton`).on("click", () => {
 
         if (editando == true) {
 
             $(`.audit.${numeroForm}`).remove();
             $(`#de${numeroForm}`).remove();
 
             crearTablaDoble(numeroForm, objeto, filaContador)
             valoresDobleEntrada(consulta, columna)
             totalesFilas(numeroForm, objeto)
 
             let fecha = moment(Date.now()).format('L');
             $(`.d.date.${numeroForm}`).val(fecha);
             editando = false
         } else {
             $(`input.form`).val("");
             $(`.select.form`).val("");
 
             $(`.form.username`).val(usu);
             let fecha = moment(Date.now()).format('L');
             $(`.form.date`).prop("readonly", "true");
             $(`.form.date`).val(fecha);
 
             $(`input.form`).attr(`disabled`, false);
             $(`.select.form`).attr(`disabled`, false);
         }
     });*/
    $(`#t${numeroForm} .undo`).on("click", () => {

        volverValoresGrabados(objeto, numeroForm, consultaIndividualForm)

    });
    $(`#t${numeroForm}`).on(`click`, `th.agrupador`, function (e) {

        let filtro = $(this).attr(`filtro`)
        let parent = $(this).parent()

        $(`#de${numeroForm} td[filtro="${filtro}"],
                   #de${numeroForm} th.filaNombre[filtro=${filtro}]`).toggleClass(`oculto`)

        parent.toggleClass(`acordeon`)

    })
    $(`#bf${numeroForm} .editBoton`).on("click", (e) => {

        editFormulario(objeto, numeroForm);

        $(`#de${numeroForm} input`).removeAttr("disabled")

    });
    $(`#t${numeroForm}`).on("change", `input:not(.agrupador):not(.seleccionarTodo)[type="checkbox"]`, function (e) {

        e.target.closest(`tr`).classList.add(`modificado`);
    })
    $(`#t${numeroForm}`).on("change", `div.fo input`, (e) => {

        $(`#t${numeroForm}`).addClass("modificadoBase");
    })

    $.each(objeto.tablaDobleEntrada.funciones, (indice, value) => {

        value[0](objeto, numeroForm, value[1], value[2])
    })

    renglonesTablaDoble(objeto, numeroForm)

    const id = $(`#t${numeroForm} input._id`).val()
    if (id == "") {

        let date = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`)

        $(`#t${numeroForm} .form.date`).val(date);
        $(`#t${numeroForm} .form.username`).val(usu);
    }
}
async function enviarFormularioDoble(objeto, numeroForm) {

    mouseEnEsperaForm(objeto, numeroForm)

    let id = $(`#t${numeroForm} input._id`).val();
    const method = id ? "PUT" : "POST";

    const url = `/${method.toLowerCase()}?base=${objeto.accion}&vers=no`;//vers es si hace historia o no
    let data = new FormData($(`#f${objeto.accion}${numeroForm}`)[0]);

    let promesa = fetch(url, {
        method: method,
        body: data
    })
        .then(response => response.json())
        .then(data => {
            quitarEsperaForm(objeto, numeroForm);
            insertarCartelCabecera(objeto, numeroForm, "Todos los registros han sido procesados correctamente.");
            let numFather = $(`#${numeroForm}`).attr("preFather")
            $(`#t${numeroForm} tr.modificado`).removeClass("modificado")
            $(`#t${numFather}`).remove();

            reCrearporIngresoDeRegistro(objeto, numFather);
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            insertarCartelCabecera(objeto, numeroForm, "Hubo un error al procesar los registros.");
        });

}
function eliminarRegistroFormularioDoble(objeto, numeroForm) {

    $.ajax({
        type: "put",
        url: `/${objeto.accion}DobleEliminar`,
        data: $(`#dobleEntrada${accion}${numeroForm}`).serialize(),
        beforeSend: function () { },
        complete: function () { },
        success: function (response) {

            $(`#de${numeroForm} input`).val("")

            let fecha = moment(Date.now()).format('L');
            $(`.d.date.${numeroForm}`).val(fecha);
            $(`.cartelErrorForm p`).html(response);
            $(`.cartelErrorForm`).css("display", "block");
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function valoresTablaPestana(objeto, numeroForm, consulta) {

    let total = new Object;
    let totalAgrupador = new Object;
    let totalMes = new Object;
    let totalAgrupadorMes = new Object;
    let mesesDefault = 12


    let hoy = new Date(Date.now());
    let mesActual = hoy.getMonth();
    let ano = hoy.getFullYear()

    let tds = ""
    let tdsMes = ""

    $.each(objeto.formDoblePest.names, (ind, val) => {


        tds = $(`#t${numeroForm} td.celdaTab.${val.nombre}`);
        total[val.nombre] = 0;


        $.each(consulta.agrupador, (indice, value) => {

            let className = value.name.replace(/ /g, "")
            totalAgrupador[className] = 0

            tds = $(`#t${numeroForm} td.celdaTab.${val.nombre}.${className} input`);


            $.each(tds, (i, v) => {

                if ($(v).val() != "") {

                    $(v).siblings(`p`).addClass(`conValorPesos`)
                    let valor = parseFloat($(v).val() || 0)

                    totalAgrupador[className] += parseFloat(valor || 0);
                    total[val.nombre] += parseFloat(valor || 0);
                }


            })

            $(`#t${numeroForm} tr.${className} th.${val.nombre}`).html(new Intl.NumberFormat("de-DE").format(totalAgrupador[className]))
            $(`#t${numeroForm} tr.${className} th.porcentaje`).html("")
        })

        $(`td.total.${val.nombre}`).html(new Intl.NumberFormat("de-DE").format(total[val.nombre]));
        $(`td.total.porcentaje`).html("");

    })

    let b = 0;
    anoCort = parseFloat(ano.toString().slice(2, 4));

    for (let x = 0; x < mesesDefault; x++) {
        totalMes[meses[mesActual + b]] = new Object;
        totalAgrupadorMes[meses[mesActual + b]] = new Object;
        totalMes[meses[mesActual + b]][anoCort] = 0
        totalAgrupadorMes[meses[mesActual + b]][anoCort] = 0

        $.each(consulta.agrupador, (indice, value) => {

            let className = value.name.replace(/ /g, "")

            let tdsMes = $(`#t${numeroForm} td.${className}.celdaTab.mes.${meses[mesActual + b]}.${anoCort} input`);

            $.each(tdsMes, (ind, val) => {


                if ($(val).val() != "") {

                    $(val).siblings(`p`).addClass(`conValorPesos`)

                    let valor = parseFloat($(val).val() || 0)

                    totalMes[meses[mesActual + b]][anoCort] += parseFloat(valor || 0);
                    totalAgrupadorMes[meses[mesActual + b]][anoCort] += parseFloat(valor || 0);
                }


            })
            $(`#t${numeroForm} tr.${className} th.${meses[mesActual + b]}.${anoCort}`).html(new Intl.NumberFormat("de-DE").format(totalAgrupadorMes[meses[mesActual + b]][anoCort]))
        })
        $(`#t${numeroForm} td.total.${meses[mesActual + b]}.${anoCort}`).html(new Intl.NumberFormat("de-DE").format(totalMes[meses[mesActual + b]][anoCort]))


        if (mesActual + 1 + b == 12) {
            anoCort++
            b -= 12
        }
        b++
    }

    let porcentaje = $(`#t${numeroForm} td.fijo.porcentaje`)

    $.each(porcentaje, (indice, value) => {
        let elementoPrevio = ($(value).prev())

        let valor = $(`p`, elementoPrevio).html()

        if (valor != "") {

            let v = valor.replace(".", "");
            let vn = v.replace(",", ".");

            let porcentaje = (parseFloat(vn || 0) / parseFloat(total.previsto || 0) * 100).toFixed(0)

            $(value).html(porcentaje)
            $(value).addClass("conValor")

        }

    })
    let porcentajeTh = $(`#t${numeroForm} th.porcentaje`)

    $.each(porcentajeTh, (indice, value) => {

        let elementoPrevio = ($(value).prev())
        let valor = $(elementoPrevio).html()

        if (valor != "") {

            let v = valor.replace(".", "");
            let vn = v.replace(",", ".");
            let porcentaje = (parseFloat(vn || 0) / parseFloat(total.previsto || 0) * 100).toFixed(0)

            $(value).html(porcentaje)
        }
    })


}
/*function abmEnFormUnica(objeto, numeroForm, data, pest, names) {

    let accion = objeto.accion;

    let imgs = `<div class="com" id="com${accion}${numeroForm}"><div><div class="cartelErrorForm noShow">
               <p>Revisar los campos en rojo</p>
           </div>
       </div>
       </div>
       <div class="closeForm ${numeroForm}">+</div>`;

    let imagenes = $(imgs);

    imagenes.appendTo("#comanderaIndiv");

    let tabla = "";

    tabla += `<table class="formPest ${numeroForm}" id="t${numeroForm}">`;

    for (let i = -1; i <= data.length; i++) {
        if (i < 0) {

            let filtro = [];
             let names = objeto.tablaDobleEntrada.datos.celdas[pest].subTabla.atributos
             let titulos = objeto.tablaDobleEntrada.datos.celdas[pest].subTabla.titulos
 
             $.each(names, function (indice, value) {
 
                 if (value.type == `coleccion` || value.type == `coleccionTotal`) {
                     $.each(value.componentes, function (indice, value) {
                         filtro.push(indice);
                     });
                 } else {
                     filtro.push(value.nombre);
                 }
             });

            tabla += `<tr class="titulos">`;
            $.each(titulos, function (indice, value) {

                tabla += `<th class="tituloTablas ${filtro[indice]}" filtro="${filtro[indice]}">${[value]}</th>`;
            });
            tabla += `</tr>`;

            $.each(objeto.atributos.titulos, function (indice, value) {
                tabla += `<td class="filtro oculto ${filtro[indice]}" filtro="${filtro[indice]}" numeroFila="${indice}">
                           <div class="filtroClass"><input class="busqueda" ${autoCompOff} ><p class="closeFiltro">+</p></div></td>`;
            });
            tabla += `</tr>`;
        } else if (i > -1 && i < data.length) {
            tabla += "<tr class=fila>";

            tabla += tipoAtributo(data[i], objeto, pest);

        }
        tabla += "</tr>";
    }
    tabla += `</table>`;

    let tablaQuery = $(tabla);

    tablaQuery.appendTo(`#cuerpoPrincipal`);

    $(`#t${numeroForm}`).css("display", "flex");
    $(`#t${numeroForm}2`).css("display", "flex");
    objeto.atributos.names = names

}*/
//Funciones Exclusivas de seguridad
function clickSeguridad(objeto, numeroForm) {//Dic

    const consultarBrother = (e) => {

        let valor = $(e.target).is(":checked")
        let father = $(e.target).parents("tr")

        if (valor == false) {

            $(`input.editar,
               input.eliminar,
               input.imprimir,
               input.limite`, father).addClass("oculto")
        } else {
            $(`input.editar,
               input.eliminar,
               input.imprimir,
               input.limite`, father).removeClass("oculto")
        }

    }

    $(`#de${numeroForm}`).on(`change`, `input.agrupador[filtro=visualizar]`, function () {

        let subFiltro = $(this).attr(`subfiltro`)

        if ($(this).is(":checked")) {

            $(`#de${numeroForm} input[subfiltro=${subFiltro}][filtro=editar],
               #de${numeroForm} input[subfiltro=${subFiltro}][filtro=eliminar],
               #de${numeroForm} input[subfiltro=${subFiltro}][filtro=imprimir],
               #de${numeroForm} input[subfiltro=${subFiltro}][filtro=limite]`).removeClass("oculto")

        } else {
            $(`#de${numeroForm} input[subfiltro=${subFiltro}][filtro=editar],
               #de${numeroForm} input[subfiltro=${subFiltro}][filtro=eliminar],
               #de${numeroForm} input[subfiltro=${subFiltro}][filtro=imprimir],
               #de${numeroForm} input[subfiltro=${subFiltro}][filtro=limite]`).addClass("oculto")
        }
    })
    $(`#de${numeroForm}`).on(`click`, `input.filtroTodo[filtro=visualizar]`, function () {

        if ($(this).is(":checked")) {

            $(`#de${numeroForm} input[filtro=editar],
               #de${numeroForm} input[filtro=eliminar],
               #de${numeroForm} input[filtro=imprimir],
               #de${numeroForm} input[filtro=limite]`).removeClass("oculto")

        } else {
            $(`#de${numeroForm} input[filtro=editar],
               #de${numeroForm} input[filtro=eliminar],
               #de${numeroForm} input[filtro=imprimir],
               #de${numeroForm} input[filtro=limite]`).addClass("oculto")
        }
    })
    $(`#de${numeroForm}`).on("click", `input.visualizar`, consultarBrother)
}
function ocultarElementosTablaDoble(objeto, numeroForm) {

    $.each(objeto.tablaDobleEntrada.oculto, (indice, value) => {

        $.each(value, (ind, val) => {

            $(`#t${numeroForm} td.de.${val}.${indice} input`).addClass(`ocultoSiempre`)
        })

        let titulos = $(`#t${numeroForm} th.tituloTablas.${indice}:not(.seleccionarTodo)`)

        $.each(titulos, (i, value) => {

            let subFiltro = $(`input`, value).attr(`subfiltro`)
            let elementosFiltro = ($(`#t${numeroForm} input[subfiltro="${subFiltro}"].${indice}`));

            let oculto = `ocultoSiempre`

            $.each(elementosFiltro, (ind, val) => {

                if (!$(val).hasClass(`ocultoSiempre`)) {

                    oculto = ""
                }
            })

            $(`input`, value).addClass(oculto)

        })
        $(`#t${numeroForm} input.filtroTodo`).removeClass(`oculto`);

    })
}
///////////////////////////
function renglonesTablaDoble(objeto, numeroForm) {

    let div = $(`#t${numeroForm} div.fo`);
    let cabecera = $(`#t${numeroForm} div.cabeceraCol`);
    let compuesto = $(`#t${numeroForm} div.tableCol`);
    let renglon = 0;
    let contieneRenglon = 0;
    let inputRenglones = objeto?.formInd?.inputRenglones || calcularRenglonesImplicitoFormIndividual(objeto.atributos.names)

    div.sort((a, b) => {
        let valor1 = a.style.order;
        let valor2 = b.style.order;

        if (parseFloat(valor1 || 0) < parseFloat(valor2 || 0)) {
            return -1;
        }
        if (parseFloat(valor1 || 0) > parseFloat(valor2 || 0)) {
            return 1;
        }
        return 0;
    });

    $.each(div, (indice, value) => {

        if (inputRenglones[renglon] > contieneRenglon) {
            $(`#t${numeroForm} div.renglon.${renglon}`).append(value);
            contieneRenglon++;
        } else {
            renglon++;

            if (isNaN(inputRenglones[renglon])) {
                contieneRenglon = 0;

                $(`#t${numeroForm} div.renglon.${renglon}`).addClass(inputRenglones[renglon]);
                $(`#t${numeroForm} div.renglon.${renglon}`).append(cabecera);
                $(`#t${numeroForm} div.renglon.${renglon}`).append(compuesto);

                renglon++;
                contieneRenglon = 1;
                $(`#t${numeroForm} div.renglon.${renglon}`).append(value);
            } else {
                contieneRenglon = 1;
                $(`#t${numeroForm} div.renglon.${renglon}`).append(value);
            }
        }
    });
};
//////////////////////////////////////////
//Cheque los totalizadores de inputs
function chequeTodo(numeroForm, filtro) {//Dic

    let input = $(`#de${numeroForm} input[type="checkbox"].tablaDobleN.${filtro}`)
    let indice = 0;
    let checked = true;

    while (indice < input.length && checked == true) {

        checked = $(input[indice]).is(":checked");

        indice++;
    }

    if (checked) {

        $(`#de${numeroForm} th.${filtro} input.filtroTodo[type="checkbox"]`).prop('checked', true)


    } else {

        $(`#de${numeroForm} th.${filtro} input.filtroTodo[type="checkbox"]`).prop('checked', false)

    }
}
function chequefiltrar(numeroForm, filtro, subFiltro) {//Ver despues

    let input = $(`#de${numeroForm} td[filtro=${subFiltro}] input[type="checkbox"].tablaDobleN.${filtro}`)

    let indice = 0;
    let checked = true;

    while (indice < input.length && checked == true) {

        checked = $(input[indice]).is(":checked");

        indice++;
    }

    if (!checked) {

        $(`#de${numeroForm} th.${subFiltro}.${filtro} input.agrupador`).prop('checked', false);
    } else {
        $(`#de${numeroForm} th.${subFiltro}.${filtro} input.agrupador`).prop('checked', true);
    }
}
function tablaDoble(numeroForm, objeto, data, tabla) {

    const tipoValorInput = {
        on: "checked",
    }
    const inputCheckBox = (agrupador, val, d, valueCampo) => {

        let valorCheck = valueCampo == "true" ? "checked" : "";

        return `<input type="checkbox" ${valorCheck} class="tablaDobleN ${d.nombre || d}" ${tipoValorInput[valueCampo] || ""} filtro="${d.nombre || d}" subFiltro="${agrupador}" ${autoCompOff} ></input>
                <input type="hidden" class="tablaDobleN ${d.nombre || d}" name="${d.nombre}.${val.nombre || val}" form="f${objeto.accion}${numeroForm}" value=${valueCampo || false}  ${autoCompOff} ></input></td>`;
    }
    const inputBoton = (agrupador, val, d, valueCampo) => {

        return `<div type="${d.type}" atributo="${val.nombre}" class="boton tablaDobleN ${val.nombre || val}"><p>${d.titulo}</p></div>
        <input type="hidden" class="tablaDobleN boton ${val.nombre}" name="atributos.${val.nombre || val}" form="f${objeto.accion}${numeroForm}" value="${valueCampo || ""}"  ${autoCompOff} />`
    }
    const inputBotonMultiple = (agrupador, val, d, valueCampo) => {

        let botones = `<div type="boton" atributo="${val.nombre}" class="botonMultiple tablaDobleN ${val.nombre || val}"><p>${d.titulo}</p></div>`

        botones += `<input type="hidden" class="tablaDobleN botonMultiple ${val.nombre}" name="atributos.${val.nombre || val}" fila=0 form="f${objeto.accion}${numeroForm}" value="${valueCampo?.[0] || ""}"  ${autoCompOff} />`
        let valueCampoDef = (valueCampo || []).shift()

        $.each(valueCampoDef, (ind, v) => {

            botones += `<input type="hidden" class="tablaDobleN botonMultiple ${val.nombre}" name="atributos.${val.nombre || val}" fila=${ind + 1} form="f${objeto.accion}${numeroForm}" value="${v || ""}"  ${autoCompOff} />`
        })

        return botones

    }
    const inputText = (agrupador, val, d, valueCampo) => {

        return `<input type="${d.type}" class="tablaDobleN ${d.nombre} ${d.clase}" name="${d.nombre}.${val.nombre || val}" form="f${objeto.accion}${numeroForm}" value="${valueCampo || ""}"  ${autoCompOff} />`
    }
    tabla += "<tbody>"
    ///Estos son los titulos de laa tabla
    tabla += `<tr class="primeraFila"><th class="tituloTablas vacio"></th>`;

    $.each(objeto.tablaDobleEntrada.titulosColumna, (indice, value) => {

        tabla += `<th class="tituloTablas ${value} ">${value}</th>`

    })
    tabla += `</tr>`;
    ///////////////////////////////////////////
    ///la fila de seleccionar todo 
    tabla += `<th class="tituloTablas filtro">Seleccionar todo</th>`;
    $.each(objeto.tablaDobleEntrada.columna, (indice, value) => {

        tabla += `<th class="tituloTablas seleccionarTodo ${value.nombre}">`

        if (value.type == "checkbox") {
            tabla += `<input type="${value.type}" class="filtroTodo checkbox" filtro=${value.nombre || value} ${autoCompOff} >`
        }
        tabla += `</th>`

    })
    tabla += `</tr>`;
    ///////////////////////////////////////////
    ////Etoy armando las filas con el agrupados por grupo
    $.each(objeto.tablaDobleEntrada.fila, (indice, value) => {

        let title = value.titulo
        let agrupador = title.replace(/\s+/g, '')

        //Esto es el agrupador de cada grupo
        tabla += `<tr>`
        tabla += `<th class="tituloTablas filtro agrupador ${agrupador}" filtro="${agrupador}">${title}</th>`;

        $.each(objeto.tablaDobleEntrada.columna, (ind, val) => {

            tabla += `<th class="tituloTablas ${val.nombre} ${agrupador}">`

            if (val.type == "checkbox") {
                tabla += `<input type="${val.type}" class="agrupador  ${agrupador}" filtro="${val.nombre || val}" subFiltro="${agrupador}" ${autoCompOff} > </input>`;
            }
            tabla += `</th>`
        })

        tabla += `</tr>`
        //Esto es el agrupador de cada grupo
        $.each(value.componentes, (ind, val) => {

            tabla += `<tr filaNombre="${val.nombre || val}"><th class="filaNombre ${val.nombre || val} ${objeto?.tablaDobleEntrada?.claseTituloFila || ""}" filtro="${agrupador}" atributo="${val.nombre || val}">
            ${val.titulo}`;

            $.each(objeto.tablaDobleEntrada.columna, (i, v) => {

                tabla += `<td class="de ${val.nombre} ${v.nombre}" ${ocultoOject[v.oculto] || ""} filtro="${agrupador}" width="${v.width}">`

                let valueCampo = data?.[v.nombre || v]?.[val.nombre || val] || ""

                switch (v.type) {
                    case "checkbox":
                        tabla += inputCheckBox(agrupador, val, v, valueCampo)
                        break;
                    case "boton":

                        tabla += inputBoton(agrupador, val, v, valueCampo)
                        break;
                    case "botonMultiple":

                        tabla += inputBotonMultiple(agrupador, val, v, valueCampo)
                        break;
                    default:

                        tabla += inputText(agrupador, val, v, valueCampo)
                        break;

                }
            })

            tabla += `</tr>`;

        })
    })

    tabla += "</tbody></table></div>"

    $(tabla).appendTo(`#tabs_contents`);
    $(`#de${numeroForm}`).insertBefore(`#t${numeroForm} .renglon.auditoria`);
    $(`#t${numeroForm} div.fo input`).removeAttr("disabled")

    validarFormulario(objeto, numeroForm);
    funcionesFormato(objeto, numeroForm)

    $.each($(`#t${numeroForm} div.fo input.requerido`), (indice, value) => {

        $(value).trigger("change").trigger("input")

    })
    $.each(objeto.tablaDobleEntrada.columna, (indice, value) => {

        chequeTodo(numeroForm, value.nombre)

        $.each(objeto.tablaDobleEntrada.fila, (ind, val) => {

            let subFiltro = val.titulo.replace(/\s+/g, '')

            chequefiltrar(numeroForm, value.nombre, subFiltro)
        })
    })
    $(`#t${numeroForm}`).on(`click`, `input.filtroTodo.checkbox`, function (e) {//ESte es el filtrat todo, clickeo totodo

        let attr = $(this).attr(`filtro`)

        if ($(this).is(":checked")) {

            $(`#de${numeroForm} td.${attr} input[type="checkbox"],
               #de${numeroForm} th.${attr} input[type="checkbox"]`).prop('checked', true).trigger("change")

        } else {

            $(`#de${numeroForm} td.${attr} input[type="checkbox"],
               #de${numeroForm} th.${attr} input[type="checkbox"]`).prop('checked', false).trigger("change")

        }
    })
    $(`#t${numeroForm}`).on(`click`, `input.tablaDobleN[type="checkbox"]`, function (e) {

        let subFiltro = $(this).attr(`subFiltro`)
        let attr = $(this).attr(`filtro`)

        if (!$(this).is(":checked")) {

            $(`#de${numeroForm} th.${attr} input.filtroTodo[type="checkbox"]`).prop('checked', false)
            $(`#de${numeroForm} input.${subFiltro}.agrupador[filtro~=${attr}]`).prop('checked', false)

        }

        chequeTodo(numeroForm, attr)
        chequefiltrar(numeroForm, attr, subFiltro)
    })
    $(`#t${numeroForm}`).on(`click`, `input.agrupador`, function (e) {

        let subFiltro = $(this).attr(`subfiltro`)
        let filtro = $(this).attr(`filtro`)

        if ($(this).is(":checked")) {

            $(`#de${numeroForm} input.${filtro}[type="checkbox"][subFiltro~=${subFiltro}]`).prop('checked', true).trigger("change")

        } else {
            $(`#de${numeroForm} input.${filtro}[subFiltro~=${subFiltro}]`).prop('checked', false).trigger("change")
            $(`#de${numeroForm} th.${filtro} input.filtroTodo[type="checkbox"]`).prop('checked', false)
        }

        chequeTodo(numeroForm, filtro)
        chequefiltrar(numeroForm, filtro, subFiltro)
    })

    ocultarElementosTablaDoble(objeto, numeroForm)
}
function addname(objeto, numeroForm) {

    $(`#t${numeroForm}`).on("change", `tr[namefila="vacio"] input[type="checkbox"]`, function (e) {

        let father = e.currentTarget.closest('tr')
        $(`input.name`, father).val(father.id)

    })
}
////////////////
function ocultarElementosTesting(objeto, numeroForm) {

    let playDirect = $(`#t${numeroForm}`).hasClass("soloPlay")

    if (playDirect) {

        $(`#t${numeroForm} div.fo.name, 
           #t${numeroForm} div.fo.observaciones`).addClass("ocultoSiempre")
    }
}

function sorteableDoble(objeto, numeroForm) {

    new Sortable(document.querySelector(`#t${numeroForm} table tbody`), {
        animation: 150,
        handle: 'td.orden', // arrastrás desde cualquier celda
        filter: 'tr.primeraFila',
        preventOnFilter: false,
        onEnd: function (evt) {
        }
    });
}
//////////////

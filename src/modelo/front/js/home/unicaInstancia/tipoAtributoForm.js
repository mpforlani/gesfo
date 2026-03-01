//Atributos en Form
function atributosLista(objeto, numeroForm, indice, value, titulos, consulta, disabled) {
    let form = ""
    let ord = 0

    let valorDef = []
    if (value.subType == "date") {

        $.each(consulta[value.nombre], (indice, value) => {
            valorDef.push(dateNowAFechaddmmyyyy(value || "", `y-m-d`))
        })

    } else {
        valorDef = consulta[value.nombre] || []
    }

    form += `<div id="form${value.nombre}${numeroForm}" class="fo ${value.nombre}" ${widthObject[value.width] || ""}>
                 <h2>${titulos[indice]}</h2>`;

    form += `<div class="listaInputs">`
    form += `<div class="inputIndiv main">
             <input type="${value.subType || "text"}" class="formLista ${value.nombre} ${value.clase || ""}" name="${value.nombre}" value="${valorDef[ord] || ""}" form="f${objeto.accion}${numeroForm}"  tabindex="${parseFloat(indice) + 1}" ord=${ord} tabindex="${parseFloat(indice) + 1}" ${disabled} ${autoCompOff}/>
             <div class="icon"><span class="material-symbols-outlined arrow abajo">keyboard_arrow_down</span><span class="material-symbols-outlined arrow arriba oculto">keyboard_arrow_up</span></div>`
    form += `</div>`;//Cierro div inputIndiv main
    ord++
    form += `<div class="inputIndiv lista ${value.clase} oculto">`;//Abro lista inputs oculto
    $.each(valorDef?.slice(1), (ind, val) => {

        form += `<div class="inputHijo"><input type="${value.subType || "text"}"  class="formLista ${value.nombre} ${value.clase || ""}" name="${value.nombre}" value="${valorDef[ind + 1] || ""}" form="f${objeto.accion}${numeroForm}" ord=${ind + 1} ${disabled} ${autoCompOff}/>
        <div class="icon"><span class="material-symbols-outlined botonListaDelete">delete</span></div></div>`
        ord++
    })
    form += `<div class="inputHijo"><input class="formLista input ${value.nombre} ${value.clase || ""}"  ord="${consulta?.[value.nombre]?.length || 0}" readonly ${disabled} />
             <div class="icon"><span class="material-symbols-outlined botonListaDelete ocultoConLugar">delete</span></div></div>`
    form += `</div>`;//Cierro div inputIndiv lista
    form += `</div>`//Cierro listaInputs
    form += `</div>`;//Cierro div.fo
    /////////////////////////////////////////

    const agregarAtributo = (e) => {

        let atributo = `<div class="inputHijo"><input type="${value.subType || "text"}" class="formLista ${value.nombre} ${value.clase || ""}" name="${value.nombre}" form="f${objeto.accion}${numeroForm}" ord="${ord}" ${autoCompOff} />
        <div class="icon"><span class="material-symbols-outlined botonListaDelete">delete</span></div></div>`

        $(`#t${numeroForm} div.fo.${value.nombre} .inputIndiv.lista div.inputHijo:last-child`).before(atributo)
        ord++
    }
    const deletetributo = (e) => {

        $(e.target).parents(".inputHijo").remove()
    }
    const closeAtributo = (e) => {

        $(`.inputIndiv.lista,
           .inputIndiv.main span.arrow.arriba`, $(`#t${numeroForm}`)).addClass(`oculto`)
        $(`.inputIndiv.main span.arrow.abajo`, $(`#t${numeroForm}`)).removeClass(`oculto`)

        $(`.inputIndiv`, $(`#t${numeroForm}`)).removeClass(`activeLista`)
        $(`#t${numeroForm}`).off("focus", `div.fo.${value.nombre} input:not(.${value.nombre})`, closeAtributo)
    }
    const abrirLista = (e) => {

        e.stopPropagation()

        const father = $(e.target).parents(`.listaInputs`)

        $(`.inputIndiv.lista,
           .inputIndiv.main span.arrow.abajo,
           .inputIndiv.main span.arrow.arriba`, father).toggleClass(`oculto`)


        $(`.inputIndiv`, father).toggleClass(`activeLista`)
        $(`#t${numeroForm}`).on("focus", `div.fo.${value.nombre} input:not(.${value.nombre})`, closeAtributo)

    }

    $(`#t${numeroForm}`).on(`click`, `div.fo.${value.nombre} span.arrow`, abrirLista)
    $(`#t${numeroForm}`).on(`dblclick`, `div.fo.${value.nombre} .listaInputs input[readonly]`, agregarAtributo)
    $(`#t${numeroForm}`).on(`click`, `div.fo.${value.nombre} .listaInputs span.botonListaDelete:not(.ocultoConLugar)`, deletetributo)
    return form
}
function listaArrayParametrica(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let form = ""
    let ord = 0

    let valorDef = consulta[value.nombre] || []

    form += `<div id="form${value.nombre}${numeroForm}" class="fo ${value.nombre}"  ${widthObject[value.width] || ""}>
                 <h2>${titulos[indice]}</h2>`;

    form += `<div class="listaInputs">`

    form += `<div class="inputIndiv main">
             ${prestanaFormIndividual(objeto, numeroForm, value, valorDef[0], indice, { disabled })}
             <div class="icon select"><span class="material-symbols-outlined arrow abajo">keyboard_arrow_down</span><span class="material-symbols-outlined arrow arriba oculto">keyboard_arrow_up</span></div>`
    form += `</div>`
    ord++
    form += `<div class="inputIndiv lista ${value.clase} oculto" ${widthObject[value.width] || ""}>`;//Abro lista inputs oculto

    $.each(valorDef?.slice(1), (ind, val) => {

        form += `<div class="inputHijo">${prestanaFormIndividual(objeto, numeroForm, value, valorDef[ind + 1], indice, { disabled })}
        <div class="icon"><span class="material-symbols-outlined botonListaDelete">delete</span></div></div>`
        ord++
    })
    form += `<div class="inputHijo"><input class="formLista input ${value.nombre} ${value.clase || ""}"  ord="${consulta?.[value.nombre]?.length || 0}" readonly ${disabled} ${autoCompOff} />
             <div class="icon"><span class="material-symbols-outlined botonListaDelete ocultoConLugar">delete</span></div></div>`
    form += `</div>`;//Cierro div inputIndiv lista
    form += `</div>`//Cierro listaInputs
    form += `</div>`;//Cierro div.fo
    /////////////////////////////////////////

    const agregarAtributo = (e) => {

        let atributo = `<div class="inputHijo">${prestanaFormIndividual(objeto, numeroForm, value, [], indice)}
        <div class="icon"><span class="material-symbols-outlined botonListaDelete">delete</span></div></div>`

        $(`#t${numeroForm} div.fo.${value.nombre} .inputIndiv.lista div.inputHijo:last-child`).before(atributo)
        ord++
    }
    const deletetributo = (e) => {

        $(e.target).parents(".inputHijo").remove()
    }
    const closeAtributo = (e) => {

        $(`.inputIndiv.lista,
           .inputIndiv.main span.arrow.arriba`, $(`#t${numeroForm}`)).addClass(`oculto`)
        $(`.inputIndiv.main span.arrow.abajo`, $(`#t${numeroForm}`)).removeClass(`oculto`)

        $(`.inputIndiv`, $(`#t${numeroForm}`)).removeClass(`activeLista`)
        $(`#t${numeroForm}`).off("focus", `div.fo.${value.nombre} input:not(.${value.nombre})`, closeAtributo)
    }
    const abrirLista = (e) => {

        e.stopPropagation()

        const father = $(e.target).parents(`.listaInputs`)

        $(`.inputIndiv.lista,
           .inputIndiv.main span.arrow.abajo,
           .inputIndiv.main span.arrow.arriba`, father).toggleClass(`oculto`)


        $(`.inputIndiv`, father).toggleClass(`activeLista`)
        $(`#t${numeroForm}`).on("focus", `div.fo.${value.nombre} input:not(.${value.nombre})`, closeAtributo)

    }

    $(`#t${numeroForm}`).on(`click`, `div.fo.${value.nombre} span.arrow`, abrirLista)
    $(`#t${numeroForm}`).on(`dblclick`, `div.fo.${value.nombre} .listaInputs input[readonly]`, agregarAtributo)
    $(`#t${numeroForm}`).on(`click`, `div.fo.${value.nombre} .listaInputs span.botonListaDelete:not(.ocultoConLugar)`, deletetributo)
    return form



}
function parametricaForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let atributo = ""

    atributo += `<div class="fo ${value.nombre}"  ${widthObject[value?.width] || `width="veinte"`}  ${ocultoOject[value.oculto] || ""} >

    <h2>${titulos[indice]}</h2>`;

    atributo += prestanaFormIndividual(objeto, numeroForm, value, consulta[value.nombre] || "", (indice + 1), { clase: "form", disabled })

    atributo += `</div>`;//Cerrar div.fo

    return atributo
}
function parametricaMixtaForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let atributo = ""

    atributo += `<div class="fo ${value.nombre}" parametricaMixta=${value.nombre}  ${widthObject[value?.width] || `width="veinte"`}  ${ocultoOject[value.oculto] || ""} >

    <h2>${titulos[indice]}</h2>`;

    atributo += prestanaFormIndividual(objeto, numeroForm, value, consulta[value.nombre] || "", (indice + 1), { clase: "form", disabled })

    atributo += `</div>`;//Cerrar div.fo

    return atributo

}
function parametricaPreEstablecidaForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let atributo = ""

    atributo += `<div class="fo ${value.nombre}"  ${widthObject[value?.width] || `width="veinte"`}  ${ocultoOject[value.oculto] || ""} >

    <h2>${titulos[indice]}</h2>`;

    atributo += prestanaFormIndividualPreEstablecida(objeto, numeroForm, value, consulta[value.nombre] || "", (indice + 1), { clase: "form", disabled })

    atributo += `</div>`;//Cerrar div.fo

    return atributo
}
function textoForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let valorDef = consulta[value.nombre] ?? value.valorInicial ?? "";

    let atributo = ""
    atributo += `<div class="fo ${value.nombre}" ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}  >

    <h2>${titulos[indice]}</h2>`;

    atributo += `<input type="texto" class="form ${value.nombre} ${value.clase || ""}" name="${value.nombre}" value="${valorDef}" form="f${objeto.accion}${numeroForm}"  tabindex="${indice + 1}" valid="${value.validacion}" autocomplete="off" ${disabled} ${autoCompOff}  /></div>`;
    return atributo
}
function numeradorForm(objeto, numeroForm, indice, value, titulos, consulta) {

    let atributo = ""

    valorDef = consulta?.[value.nombre] || numeradorDato(objeto, numeroForm)
    atributo += `<div class="fo ${value.nombre}"  ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""}  >

    <h2>${titulos[indice]}</h2>`;

    atributo += `<p>${valorDef.numerador || valorDef}</p><div>

         <input class="form ${value.nombre} ${value.clase || ""}" name="${value.nombre}" value="${valorDef.numerador || valorDef}" form="f${objeto.accion}${numeroForm}" tabindex="${indice + 1}" ${autoCompOff}  /></div></div>`;


    return atributo

}
function numeroCompuesto(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let valor = new Object()
    let valorString = ""
    let inputs = ""

    let consutDef = consulta.numerador || numeradorDato(objeto, numeroForm)

    let numerador = consulta.numerador || consutDef.numerador

    valor.numerador = numerador
    valorString += `${numerador} `

    inputs += `<div class="numerador numerador">`
    inputs += `<input class="form numerador numerador" name="numerador" value="${valor.numerador}" form="f${objeto.accion}${numeroForm}" ${disabled} ${autoCompOff}  />`
    inputs += `</div>`

    $.each(value.componentes, (ind, val) => {
        let atr = consulta[val.nombre] || consutDef[val.nombre]

        valor[val.nombre] = atr
        valorString += `${atr}`

        inputs += `<div class="numerador ${val.nombre}">`
        inputs += `<input class="form numerador ${val.nombre}" name="${val.nombre}" value="${valor[val.nombre]}" form="f${objeto.accion}${numeroForm}" ${disabled} ${autoCompOff}  />`
        inputs += `</div>`

    })
    $.each(value.complemento, (ind, val) => {
        let atr = consulta[val.nombre] || consutDef[val.nombre]

        valor[val.nombre] = atr
        valorString += `${atr}`

        inputs += `<div class="numerador ${val.nombre}">`
        inputs += `<input class="form numerador ${val.nombre}" name="${val.nombre}" value="${valor[val.nombre]}" form="f${objeto.accion}${numeroForm}" ${disabled} ${autoCompOff}  />`
        inputs += `</div>`

    })

    let form = `<div class="fo numeradorCompuesto ${value.nombre}"  ${widthObject[value.width] || ""} >
     <h2>${titulos[indice]}</h2>`

    if (objeto.numerador.orden == "reves") {

        let partes = valorString.split(" ");
        form += `<p>${partes[1]} ${partes[0]}</p>`;

    } else {
        form += `<p>${valorString.trim()}</p>`;
    }


    form += inputs

    form += `</div>`;

    return form;
}
function numeroCompuestoTrigger(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let valorString = ""
    let inputs = ""

    valorString += `${consulta.numerador || ""} `

    inputs += `<div class="numerador numerador">`
    inputs += `<input class="form numerador numerador" name="numerador" value="${consulta.numerador}" form="f${objeto.accion}${numeroForm}" ${disabled} ${autoCompOff}  />`
    inputs += `</div>`

    $.each(value.componentes, (ind, val) => {

        valorString += `${consulta[val.nombre] || ""}`

        inputs += `<div class="numerador ${val.nombre}">`
        inputs += `<input class="form numerador ${val.nombre}" name="${val.nombre}" value="${consulta[val.nombre] || ""}" form="f${objeto.accion}${numeroForm}" ${disabled} ${autoCompOff}  />`
        inputs += `</div>`

    })

    let form = `<div class="fo numeradorCompuesto ${value.nombre}"  ${widthObject[value.width] || ""} >
     <h2>${titulos[indice]}</h2>`

    if (objeto.numerador.orden == "reves") {

        let partes = valorString.split(" ");
        form += `<p>${partes[1]} ${partes[0]}</p>`;

    } else {
        form += `<p>${valorString.trim()}</p>`;
    }

    form += inputs

    form += `</div>`;

    $.each(value.trigger, (ind, val) => {

        $(`#t${numeroForm}`).on("change", `input.${val}`, (e) => {

            let trigger = true
            let index = 0

            while (trigger == true & index < value.trigger.length) {

                if ($(`#t${numeroForm} .inputSelect.${value.trigger[index]}`).val() == "") {

                    trigger = false
                }
                index++
            }
            if (trigger == true) {
                numeradorActualizarFormTrigger(objeto, numeroForm)
            }
        })
    })

    return form;
}
function textareaForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {
    let form = ""
    let valorDef = consulta[value.nombre] || ""

    form += `<div class="fo ${value.nombre}"  ${widthObject[value.width] || ""}  > 

  <h2>${titulos[indice]}</h2>`;

    form += `<textarea rows="5" cols="20" class="form ${value.nombre} ${numeroForm} ${value.clase || ""}" name="${value.nombre}" form="f${objeto.accion}${numeroForm}" valid=${value.validacion} tabindex="${indice + 1}" ${disabled}>${valorDef}</textarea>
  </div>`;


    return form;
}
function textareaFRForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {
    let form = ""
    let valorDef = consulta[value.nombre] || ""
    form += `<div class="fo fullRenglon ${value.nombre}"  > 

  <h2>${titulos[indice]}</h2>`;

    form += `<textarea  type="textarea" class="form ${value.nombre} ${numeroForm} ${value.clase || ""}" name="${value.nombre}" form="f${objeto.accion}${numeroForm}" tabindex="${indice + 1}" valid=${value.validacion} ${disabled}>${valorDef}</textarea>
  </div>`;


    return form;
}
function fechaForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let form = ""

    let valorDef = consulta[value.nombre] || value.valorInicial?.() || ""

    form += `<div class="fo ${value.nombre}"  ${widthObject[value.width] || ""}  ${ocultoOject[value.oculto] || ""} >

    <h2>${titulos[indice]}</h2>`;

    form += `<input type="date" class="form  ${value.nombre} ${value.clase || ""}" name="${value.nombre}" value="${dateNowAFechaddmmyyyy(valorDef, `y-m-d`)}" form="f${objeto.accion}${numeroForm}" tabindex="${indice + 1}"  valid=${value.validacion} ${disabled}  ${autoCompOff}  />
   </div>`;

    return form
}
function fechaHoraForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let form = ""

    let valorDef = consulta[value.nombre] || value.valorInicial?.() || ""

    form += `<div class="fo ${value.nombre}"  ${widthObject[value.width] || ""}  ${ocultoOject[value.oculto] || ""} >

    <h2>${titulos[indice]}</h2>`;

    form += `<input type="datetime-local" class="form  ${value.nombre} ${value.clase || ""}" name="${value.nombre}" value="${dateNowAFechaddmmyyyy(valorDef, `y-m-dThh`)}" form="f${objeto.accion}${numeroForm}" tabindex="${indice + 1}"  valid=${value.validacion} ${disabled}  ${autoCompOff}  />
   </div>`;

    return form
}
function importeForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let form = ""
    let valorDef = consulta[value.nombre] || ""
    let valorDefMb = consulta[value.nombre + "mb"] || ""
    let valorDefMa = consulta[value.nombre + "ma"] || ""

    form += `<div class="fo ${value.nombre}"   ${widthObject[value.width] || ""} moneda="${monedaGesfin[value?.moneda] || consultaPestanas?.moneda?.[moneda]?.name?.toLowerCase() || ""}"  >

   <h2>${titulos[indice]}</h2>`;

    form += `<input type="importe" class="form ${value.nombre} ${value.clase || ""} monedaFormulario" type="importe" name="${value.nombre}" value="${numeroAString(valorDef)}" form="f${objeto.accion}${numeroForm}" tabindex="${indice + 1}"  valid=${value.validacion} autocomplete="off" ${disabled}  ${autoCompOff}  />`
    //Moneda Base
    form += `<input type="importe" class="form ocultoSiempre ${value.nombre}mb monedaBase" type="importe" name="${value.nombre}mb" value="${valorDefMb}" form="f${objeto.accion}${numeroForm}" ${disabled}  ${autoCompOff}  />`
    //Moneda Alternativa
    form += `<input type="importe" class="form ocultoSiempre ${value.nombre}ma monedaAlternativa" type="importe" name="${value.nombre}ma" value="${valorDefMa}" form="f${objeto.accion}${numeroForm}" ${disabled}  ${autoCompOff}  />`
    form += `</div>`;


    return form
}
function numeroForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {
    let form = ""

    let valorDef = consulta[value.nombre] || ""

    form += `<div class="fo ${value.nombre}"   ${widthObject[value.width] || ""} moneda="${monedaGesfin[value?.moneda] || consultaPestanas?.moneda?.[moneda]?.name?.toLowerCase() || ""}" ${ocultoOject[value.oculto] || ""}  >

<h2>${titulos[indice]}</h2>`;

    form += `<input type="numero" class="form textoCentrado ${value.nombre} ${value.clase || ""}"  name="${value.nombre}" value="${numeroAString(valorDef)}" form="f${objeto.accion}${numeroForm}" tabindex="${indice + 1}"  valid=${value.validacion} ${disabled}  ${autoCompOff}  />
</div>`;


    return form
}
function coleccionSimpleForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let form = ""
    let titulosindcie = 0

    form += `<div id="form${value.nombre}${numeroForm}" class="fo coleccionSimple ${value.nombre}" compuesto="${value.nombre}">`

    $.each(value.componentes, (ind, val) => {
        valorDef = consulta[val.nombre] || ""
        let titulos = value.titulosComponentes || objeto.formInd.titulosCompuesto[value.nombre]

        form += `<div id="form${val.nombre}${numeroForm}" class="foColec ${value.nombre} ${val.nombre}" ${widthObject[val.width] || ""} >`
        form += `<h2>${titulos[titulosindcie]}</h2>`

        switch (val.type) {
            case `parametrica`:

                form += prestanaFormIndividual(objeto, numeroForm, val, valorDef, indice, { clase: "formColec", disabled })

                break;
            default:

                form += `<input class="form ${value.nombre} ${val.nombre} ${numeroForm}" name="${val.nombre}" form="f${accion}${numeroForm}"   valid=${value.validacion}tabindex="${indice + 1}" ${autoCompOff}  />`
                break;

        }

        form += `</div>`

        titulosindcie++

    })

    form += `</div>`//Cierror form
    return form
}
function logicoForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let form = ""
    let checked = {
        true: "checked",
        false: ""
    }

    form += `<div  class="fo ${value.nombre}"  ${widthObject[value.width] || ""}  >
         <h2>${titulos[indice]}</h2>`;
    form += `<input type="hidden" class="form ${value.nombre}" name="${value.nombre}" form="f${objeto.accion}${numeroForm}" value=${consulta[value.nombre] || false} ${disabled}  ${autoCompOff}  />`;
    form += `<input type="checkbox" class="form ${value.nombre} ${value.clase || ""}" ${checked[consulta[value.nombre]]} tabindex="${indice + 1}" ${disabled}  ${autoCompOff}  />
                 
        </div>`;

    return form
}
function coleccionIndForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let atributosdelCompuesto = value.componentes
    let accion = objeto.accion
    let orderCompuesto = "";
    let pestColec = "";
    let col = "";
    let colec = "";
    const formatoNum = {
        texto: (valor) => { return valor }
    }
    let signo = {//esto para los td de los atributos tipo importe tengan moneda inicial
        importe: `moneda=""`,
    }

    orderCompuesto = titulos.indexOf(value.titulos);
    $(`#compuesto${accion}${numeroForm}`).css(`order`, orderCompuesto);

    let p = `<a class="pestana colect ${value.nombre}" id="pe${indice}">${value.titulos}</a>`;
    pestColec = $(p);
    pestColec.appendTo(`#cabeceraCol${accion}${numeroForm}`);

    colec += `<table class="tablaCompuesto ${value.nombre}" id="pc${indice}" compuesto="${value.nombre}">`;

    let titulosColec = `<tr class="tr titulos">`;
    let totalesColec = `<tr class="tr totales oculto">`;
    let signosColec = `<tr class="tr fltrosOcultCol oculto">`;

    titulosColec += `<th class="th menuFila"></th>`;//Titulo vacio para los botones
    totalesColec += `<td class="td totales menuFila"></td>`;//Titulo vacio para los botones
    signosColec += `<td class="td menuFila"></td>`;//Esto es el filto superior, para ocultar y mostrar columna

    let titulosCompue = value?.titulosComponentes
    let valorT = consulta || []
    let titIndex = 0

    $.each(atributosdelCompuesto, (ind, val) => {

        titulosColec += `<th class="th tituloTablasIndividual ${ind} ${val.clase}" ${widthObject[val.width] || ""} ${ocultoOject[val.oculto] || `ocultoConLugar`}>${titulosCompue?.[titIndex] || ""}</th>`;
        totalesColec += `<td class="td totales ${ind}" ${widthObject[val.width] || ""} ${ocultoOject[val.oculto] || `ocultoConLugar`}></td>`
        signosColec += `<td class="td celdaSignoOculto ${ind} ${val.nombre}" ${widthObject[val.width] || ""} ${ocultoOject[val.oculto] || `ocultoConLugar`}><span class="material-symbols-outlined oculto minus" claseOcultar="${ind}">indeterminate_check_box</span></td>`

        titIndex++
    });

    titulosColec += `</tr>`;//cierro tr
    colec += titulosColec
    let val = consulta || []

    let lengthTotal = val[`position${value.nombre}`]?.length || 1

    for (x = 0; x < lengthTotal; x++) {

        //////// voy a buscar la key del atributo compuesto para ver la longitud de la coleccion
        let pos = x

        ord = parseFloat(val?.[`position${value.nombre}`]?.[pos]) || parseFloat(val?.[`position${value.nombre}`]?.[pos - 1]) + 1 || pos
        colec += `<tr class="${value.nombre} mainBody" q="${ord}">`;
        colec += `<td class="menuFila"></td>`

        $.each(atributosdelCompuesto, (i, v) => {

            valorColec = val?.[i]?.[pos] || ""

            colec += `<td class="comp ${value.nombre} ${i}" ord="${ord}" ${widthObject[v.width] || ""} ${signo[v.type] || ""} ${ocultoOject[v.oculto] || ``} set=pc${indice}>`;

            colec += tipoatributoColecciones[v.type](objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) || tipoatributoColecciones.default(objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) || ""

        });
        colec += `<td class="position ${value.nombre} position${value.nombre} ocultoSiempre" ord="${ord + 1}" set=pc${indice}>
        <input class="position ${value.nombre}" name="position${value.nombre}" value="${val?.[`position${value.nombre}`]?.[pos] || 0}" form="f${accion}${numeroForm}" ${disabled}></td>`;
        colec += `<td class="delete" ord="${ord + 1}"><span class="material-symbols-outlined botonColeccion deleteIcon">delete</span></td></tr>`;
    }

    colec += `<tr class="last mainBody vacio"  q="${ord + 1}">`;
    colec += `<td class="menuFila"></td>`

    $.each(atributosdelCompuesto, (ind, val) => {

        colec += `<td class="vacio ${ind} ${val.nombre}" ord=${ord + 1} ${widthObject[val.width] || ""} ${ocultoOject[val.oculto] || ``} set=pc${indice}>`;

        switch (val.type) {
            case `fecha`:

                colec += `<input type="date" class="formColec ${value.nombre} ${ind} ${val.clase || ""}" colec="${value.nombre}" name="${ind}" disabled="disabled" form="f${accion}${numeroForm}" ord="${ord + 1}"   valid=${val.validacion} tabindex="${indice + 1}" readonly="true" autocomplete="off" disabled="disabled"  ${autoCompOff}  /></td>`;
                break;
            case `logico`:
                colec += `<input type="hidden" class="formColec ${ind} ${val.clase || ""}" name="${ind} form="f${accion}${numeroForm}" value=false ord="${ord + 1}">
                          <input type="checkbox" class="formColec ${ind} ${val.clase || ""}" tabindex="${indice + 1}" ord="${ord + 1}" disabled="disabled" />`
                break;
            case `importe`:

                colec += `<input type="${val.type}" class="formColec ${value.nombre} ${ind}  ${val.clase || ""} monedaFormulario" colec="${value.nombre}" name="${ind}" form="f${accion}${numeroForm}"   valid=${val.validacion} ord="${ord + 1}" tabindex="${indice + 1}" readonly="true" autocomplete="off" disabled="disabled" ${autoCompOff}  />`

                colec += ` <input type="${val.type}" class="formColec ${ind}mb monedaBase ocultoSiempre" colec="${value.nombre}" name="${ind}mb" form="f${accion}${numeroForm}"  ord="${ord + 1}"  disabled="disabled"/>`

                colec += ` <input type="${val.type}" class="formColec ${ind}ma  monedaAlternativa ocultoSiempre" colec="${value.nombre}" name="${ind}ma" form="f${accion}${numeroForm}"  ord="${ord + 1}"   disabled="disabled"/>
                </td>`;

                break;
            case "textarea":

                colec += `<textarea class="formColec ${ind}  ${val.clase || ""}" name="${ind}" autocomplete="off" form="f${accion}${numeroForm}" ord="${ord + 1}" valid="${value.validacion}" tabindex="${indice + 1}" readonly="true" disabled="disabled"></textarea></td>`;

                break;
            default:

                colec += `<input type="texto" class="formColec ${value.nombre} ${ind} ${numeroForm}  ${val.clase || ""} ${val.clase || ""}" colec="${value.nombre}" name="${ind}" form="f${accion}${numeroForm}" valid=${val.validacion} ord="${ord + 1}" tabindex="${indice + 1}" autocomplete="off" readonly="true" disabled="disabled" ${autoCompOff}  /></td>`;
                break;
        }

    });

    colec += `<td class="position ocultoSiempre ${value.nombre}" set=pc${indice}><input class="position ${value.nombre}" name="position${value.nombre}" form="f${accion}${numeroForm}" value="${parseFloat(val?.[`position${value.nombre}`]?.[val?.[`position${value.nombre}`]?.length - 1] || 0) + 1}"  ${ocultoOject[val.oculto] || ``} readonly="true" disabled="disabled"/></td>`
    colec += `</tr>`;
    colec += `</table>`;
    col = $(colec);

    col.appendTo(`#tablaCol${accion}${numeroForm}`);

    $.each(value.totales, (indi, valu) => {

        let totColec = $(totalesColec)
        totColec.addClass(indi).attr("qt", indi).removeClass("oculto")

        $(`#t${numeroForm} table.tablaCompuesto.${value.nombre} tr:last`).after(totColec)//no modificar aca el punto de last, porque va en el ultimo literal

        $.each(valu.componentes, function (ind, val) {//No Pushear a impuestos base porque una coleccin puede tener varias monedas, por lo tanto el total no podria transformarse sino sumarse

            let valorTot = formatoNum?.[val.type]?.(valorT[`${val.nombre}`]) || numeroAString(valorT[`${val.nombre}`] || "")

            let input = `<input class="formColec totalColec ${ind} ${val.nombre} ${val.clase || ""}" name="${val.nombre}" form="f${accion}${numeroForm}" value="${valorTot}" sololec="true" ${disabled}>
             </div>`;

            $(`#t${numeroForm} table.tablaCompuesto.${value.nombre} tr.totales:last td.${ind}`).removeAttr("ocultoconlugar")

            $(input).appendTo(`#t${numeroForm} table.tablaCompuesto.${value.nombre} tr.totales:last td.${ind}`)
            $(`#t${numeroForm} table.tablaCompuesto.${value.nombre} tr.totales:last td.${ind}`).attr("moneda", val.moneda)

        })
    })
    $.each(value.ocultarColumna, (indi, valu) => {

        let sign = $(signosColec)

        sign.removeClass("oculto")
        $(`#t${numeroForm} table.tablaCompuesto.${value.nombre} tr:first`).before(sign)

        agregarOcultarColumna(objeto, numeroForm, value)

        $.each(valu, (ind, val) => {

            $(`#t${numeroForm} table.${value.nombre} tr.fltrosOcultCol td.${val.nombre || val}:not(.ocultoSiempre) span`).removeClass("oculto")

            $(`#t${numeroForm} table.${value.nombre} td.${val.nombre || val}:not(.ocultoSiempre),
                #t${numeroForm} table.${value.nombre} th.${val.nombre || val}:not(.ocultoSiempre)`).removeClass("ocultoConLugar").addClass("oculto ocltable").attr("ocltable", (val.nombre || val))

        })
    })

    return ""

}
function adjuntoForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let form = ""
    let listaAdjunto = ""
    let accion = objeto.accion
    let largoArchivos = consulta?.path?.length || 0
    if (largoArchivos == 1 && consulta?.path[0] == "") {

        largoArchivos = 0

    }
    const adj = {
        0: "Sin Adjuntos",
        1: "archivo adjunto",
        2: "archivos adjuntos",
    }
    const NumALet = {
        1: (largoArchivos) => { return primeraLetraMayusculaString(NumeroALetras("", largoArchivos, "")) },
        0: (largoArchivos) => { return "" }
    }
    let fila = 0
    const lengthClass = {
        1: "abrir"
    }
    let qAdj = adj[Math.min(largoArchivos, 2)]


    form += `<div id="form${value.nombre}${numeroForm}" class="fo ${value.nombre}" adjQ="${qAdj}"  ${widthObject[value.width] || ""} >`;
    form += `<div class="botonDescriptivo ${disabled} ${lengthClass[Math.min(consulta?.path?.length || 0, 1)] || ""}">${NumALet[Math.min(largoArchivos, 1)](largoArchivos)} ${qAdj}</div>`;
    form += `</div>`
    listaAdjunto += `<div class="listadoAdjunto oculto ${disabled}"><div class="cabecera"><div class=tituloAdjunto><h2>Lista de adjuntos</h2></div><div class="closePop">+</div></div> <div class=contenido>`
    listaAdjunto += `<div class="th fila titulos"><div class="nombre titulo" width="nueve">Nombre</div><div class="adjuntar ocultoSiempre titulo"></div><div class="verAdjunto titulo ocultoSiempre"></div><div class="titulo eliminarAdj"></div></div>`

    if (consulta?.path?.length > 1 || (consulta?.path?.length == 1 && consulta?.path?.[0] != "")) {

        $.each(consulta?.path, (indice, value) => {

            listaAdjunto += `<div class="tr fila" fila="${fila}">
                        <div class="celdAdj nameUsu src=""><input class="nameUsu adjuntoForm" value="${consulta.nameUsu[indice]}" name="nameUsu" form="f${accion}${numeroForm}"/></div>
                        <div class="celdAdj originalname ocultoSiempre"><input class="originalname adjuntoForm" name="originalname" value="${consulta.originalname[indice]}" form="f${accion}${numeroForm}"/></div> 
                        <div class="celdAdj path ocultoSiempre"><input class="path adjuntoForm ocultoSiempre" name="path" value="${value}" form="f${accion}${numeroForm}"/></div>                                                                 
                        <div class="celdAdj adjunto"><label for="adjunto${accion}${numeroForm}fila${fila}"><img src="/img/iconos/botonAdjunto/adjuntar.svg"/></label><input type=file id="adjunto${accion}${numeroForm}fila${fila}" name="adjunto" form="f${accion}${numeroForm}" class="adjunto adjuntoForm"/></div>
                        <div class="celdAdj verAdj "><img class="verAdj" img src="/img/iconos/botonAdjunto/VerAdj.svg" title="Ver adjunto"></div>
                        <div class="celdAdj eliminarAdj"><img class="eliminarAdj"src="/img/iconos/botonAdjunto/deleteAdj.svg" title="Eliminar adjunto"></div></div>`
            fila++
        })
    }

    listaAdjunto += `<div class="tr fila filaVacia" fila="${fila}">
                        <div class="celdAdj nameUsu vacio" src=""><input class="nameUsu adjuntoForm" name="nameUsu" form="f${accion}${numeroForm}" disabled="disabled" /></div>
                        <div class="celdAdj path vacio ocultoSiempre" src=""><input class="path adjuntoForm" name="path" form="f${accion}${numeroForm}" disabled="disabled" /></div>
                        <div class="celdAdj originalname vacio ocultoSiempre" src=""><input class="adjuntoForm originalname" name="originalname" form="f${accion}${numeroForm}" disabled="disabled"/></div>
                        <div class="celdAdj adjunto vacio"><label for="adjunto${accion}${numeroForm}fila${fila}"></label><img src="/img/iconos/botonAdjunto/adjuntar.svg"/><input type=file id="adjunto${accion}${numeroForm}fila${fila}" name="adjunto" form="f${accion}${numeroForm}" class="adjunto adjuntoForm"/></div>
                        <div class="celdAdj verAdj vacio"><img class="verAdj" img src="/img/iconos/botonAdjunto/VerAdj.svg" title="Ver adjunto"></div>
                        <div class="celdAdj eliminarAdj vacio"><img class="eliminarAdj" src="/img/iconos/botonAdjunto/deleteAdj.svg" title="Eliminar adjunto"></div>
                        <div class="celdAdj agregarFila vacio"><img class="agregarFila" src="/img/iconos/botonAdjunto/addAdj.svg" title="Agregar fila"></div></div>`

    listaAdjunto += `</div></div>`

    let adju = $(listaAdjunto)

    adju.appendTo(`#t${numeroForm}`);

    return form

}
/*function empresaForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let valorDef = consulta[value.nombre] || ""
    let form = ""
    let accion = objeto.accion
    const esSelected = {
        true: "selected",
        false: "",
    }

    if (caracteristicaEmpresa.empresas == true) {

        form += `<div class="fo ${value.nombre}"  ${widthObject[value.width] || ""}>
                     <h2>${titulos[indice]}</h2>`;


        form += `<input class="form ${value.nombre} ${numeroForm} oculto" name="${value.nombre}" value="${valorDef}" form="f${accion}${numeroForm}" tabindex="${indice + 1}"   disabled/>`
        form += `<select class="select form ${value.nombre}"  name="${value.nombre}" form="f${accion}${numeroForm}" value=${valorDef} validado="false" tabindex="${indice + 1}">`;
        form += `<option class="opciones" value=""></option>`;

        $.each(consultaPestanas.empresa, (indice, value) => {

            form += `<option class="opciones ${value.habilitado} valueString="${value.name} " ${esSelected[valorDef == value._id]} value="${value._id} ">${value.name}</option>`;
        })
        form += `</select>`;
    } else {

        form += `<div class="fo ${value.nombre} oculto"  ${widthObject[value.width] || ""}  >
                 <h2>${titulos[indice]}</h2>`;
        form += `<input class="form ${value.nombre} ${value.clase || ""}" name="${value.nombre}" value="${valorDef}" form="f${accion}${numeroForm}" tabindex="${indice + 1}"   disabled/>`
    }

    form += `</div>`;

    return form

}*/
function imagenForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let form = ""
    let accion = objeto.accion
    let img = ""
    if (consulta?.pathImg?.length > 0) {

        img = `<img class="vistaPreviaImg" src="${consulta.pathImg}" alt="${consulta.originalnameImg}" />`
    }

    form += `<div  class="fo imagen ${value.nombre}"  ${widthObject[value.width] || ""}  >
     <h2>${titulos[indice]}</h2>`;
    form += `<div class="contenedorImg">`
    form += `<div class="vistaPrevia">${img || "Vacio"}</div>`
    form += `<div class="botones">
             <div class="imgCrear">`
    form += `<label for="imgAdj${numeroForm}" class="botonImg">
             <img src="/img/iconos/botonAdjunto/adjuntar.svg"></label>
             <input class="ocultoSiempre"type="file" id="imgAdj${numeroForm}" name="imgAdj" form="f${accion}${numeroForm}" accept="image/*">`
    form += `</div>`
    form += `<div class="imgEliminar"><img src="/img/iconos/botonAdjunto/deleteAdj.svg""></div>`
    form += `</div>`
    form += `</div>`
    form += `<input class="pathImg ocultoSiempre" name="pathImg" value="${consulta.pathImg || ""}" form="f${accion}${numeroForm}" ${disabled}/>
             <input class="originalnameImg ocultoSiempre" name="originalnameImg" value="${consulta.originalnameImg || ""}" form="f${accion}${numeroForm}" ${disabled}/>
    
    </div>`;

    $(`#t${numeroForm}`).on("change", "input[name=imgAdj]", (e) => {

        const nombreDescriptivo = () => {

            if ($(`#t${numeroForm} input._id`).attr(`disabled`)) {
                editFormulario(objeto, numeroForm);
                botonesEditarFormInd(numeroForm)
            }

            let valorAdjunto = $(e.target).val();
            const file = e.target.files[0];

            if (valorAdjunto == "" || !file) {

                $(`#t${numeroForm} input.nameUsuImg`).val("").attr("disabled", "disabled");
                $(`#t${numeroForm} input.pathImg`).val("").attr("disabled", "disabled");
                $(`#t${numeroForm} input.originalnameImg`).val("").attr("disabled", "disabled");

            } else {

                if (!file.type.startsWith('image/')) {

                    e.target.value = ''; // limpia el input

                    let cartel = cartelInforUnaLinea(`Solo se permiten imágenes (jpg, png, etc.)`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
                    $(cartel).appendTo(`#bf${numeroForm}`)
                    removeCartelInformativo(objeto, numeroForm)
                    return;
                } else {

                    const url = URL.createObjectURL(file);
                    let imagen = `<img class="vistaPreviaImg" src="${url}" ></img>`
                    $(`#t${numeroForm} .vistaPrevia`).html("");
                    $(imagen).appendTo(`#t${numeroForm} .vistaPrevia`)
                }
            }
        }
        const noNombreDescriptivo = () => {

            let cartel = cartelInforUnaLinea(`No tiene permisos para editar registros anteriores a ${dateNowAFechaddmmyyyy(fechaPermitida, `y-m-d`)}`, "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)
        }
        const editarAdjNa = {
            habilitado: nombreDescriptivo,
            deshabilitado: noNombreDescriptivo
        }
        editarAdjNa[permisos]()
    })
    $(`#t${numeroForm}`).on("click", ".imgEliminar", (e) => {

        $(`#t${numeroForm} div.fo.imagen input`).val("")
        $(`#t${numeroForm} div.fo.imagen .vistaPrevia img`).remove()
        $(`#t${numeroForm} div.fo.imagen .vistaPrevia`).html("Vacio")
    })
    return form
}
function defaultForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let form = ""
    let accion = objeto.accion
    let valorDef = consulta[value.nombre] || ""

    form += `<div  class="fo ${value.nombre}"  ${widthObject[value.width] || ""}  >
     <h2>${titulos[indice]}</h2>`;


    form += `<input class="form ${value.nombre} ${value.clase || ""}" name="${value.nombre}" value="${valorDef}" form="f${accion}${numeroForm}" tabindex="${indice + 1}"  valid=${value.validacion} ${disabled} ${autoCompOff}  />
    
    </div>`;
    // return form
}
function textoDivForm(objeto, numeroForm, indice, value, titulos, consulta, disabled) {

    let form = ""

    form += `<div  class="fo textoDiv ${value.nombre}"  ${widthObject[value.width] || ""} ${ocultoOject[value.oculto] || ""} >
     <h2>${titulos[indice]}</h2>`;


    form += `<p class="form ${value.nombre} ${value.clase || ""}">${value.texto || ""}</p>
    
    </div>`;
    return form
}
const tipoatributoForm = {

    listaArray: atributosLista,//1
    listaArrayParametrica: listaArrayParametrica,//1
    //numerador
    numeradorCompuesto: numeroCompuesto,//2
    numeroCompuestoTrigger: numeroCompuestoTrigger,//3
    numerador: numeradorForm,//4
    //parametrica
    parametrica: parametricaForm,//5
    parametricaMixta: parametricaMixtaForm,
    parametricaPreEstablecida: parametricaPreEstablecidaForm,
    //texto
    texto: textoForm,//6
    text: textoForm,//7
    textarea: textareaForm,//8
    textareafullrenglon: textareaFRForm,//9
    //Fecha
    fecha: fechaForm,//10
    fechaHora: fechaHoraForm,//10
    date: fechaForm,//10
    //Numero e importe
    importe: importeForm,//11
    numero: numeroForm,//12
    //colección
    coleccionSimple: coleccionSimpleForm,//13
    coleccionInd: coleccionIndForm,//14
    //otros
    textoDiv: textoDivForm,//14
    checkbox: logicoForm,//15
    logico: logicoForm,//15
    adjunto: adjuntoForm,//16
    //empresa: empresaForm,//18
    imagen: imagenForm,//19
    default: defaultForm//20
}
function textoColec(objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) {

    let valorDef = valorColec || v.valorInicial || ""

    let colec = `<input type="texto" class="formColec ${i} ${value.nombre}  ${v.clase || ""}" name="${i}" value="${valorDef}" form="f${objeto.accion}${numeroForm}" ord="${ord}" valid=${v.validacion} tabindex="${indice + 1}" ${disabled} ${autoCompOff}  /></td>`;

    return colec
}
function textAreaColec(objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) {

    let colec = `<textarea class="formColec  ${i}  ${v.clase || ""}" name="${i}" form="f${objeto.accion}${numeroForm}" ord="${ord}" valid=${v.validacion} tabindex="${indice + 1}" ${disabled}>${valorColec}</textarea></td>`;

    return colec
}
function parametricaColec(objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) {
    let colec = prestanaFormIndividual(objeto, numeroForm, v, valorColec, indice + 1, { disabled, clase: "formColec" })

    return colec
}
function parametricaPreEstablecidaColec(objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) {

    let colec = ""

    colec += prestanaFormIndividualPreEstablecida(objeto, numeroForm, v, valorColec, indice + 1, { clase: "formColec", disabled })


    return colec
}
function numeroColec(objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) {

    let colec = `<input type="${v.type}" class="formColec ${i} ${value.nombre} ${v.clase || ""}" name="${i}" value="${numeroAString(valorColec)}" form="f${objeto.accion}${numeroForm}" ord="${ord}" valid="${v.validacion}" tabindex="${indice + 1}" ${disabled}/></td>`;

    return colec
}
function importeColec(objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) {

    let valorDefMb = consultaGet?.[numeroForm]?.[v.nombre + "mb"] || ""
    let valorDefMa = consultaGet?.[numeroForm]?.[v.nombre + "ma"] || ""

    let colec = `<input type="${v.type}" class="formColec ${v.moneda} ${i} ${v.clase || ""} monedaFormulario" name="${i}" value="${numeroAString(valorColec)}" form="f${objeto.accion}${numeroForm}" ord="${ord}" valid="${v.validacion}" tabindex="${indice + 1}" ${disabled} ${autoCompOff}  />`

    colec += `<input type="${v.type}" class="formColec  ${i}mb monedaBase ocultoSiempre" name="${i}mb" value="${valorDefMb}" form="f${objeto.accion}${numeroForm}" ord="${ord}" valid="${v.validacion}" ${disabled}/>`

    colec += `<input type="${v.type}" class="formColec  ${i}ma monedaAlternativa ocultoSiempre" name="${i}ma" value="${valorDefMa}" form="f${objeto.accion}${numeroForm}" ord="${ord}" valid="${v.validacion}" ${disabled}/></td>`;

    return colec
}
function logicoColec(objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) {

    let checked = {
        true: "checked",
        false: ""
    }
    let valorDef = valorColec || false

    let colec = `<input type="hidden" class="formColec ${i} ${v.clase || ""}"  name="${i}" form="f${accion}${numeroForm}" ord="${ord}" value="${valorDef}"><input type="checkbox" class="formColec ${i} ${v.clase || ""}"  tabindex="${indice + 1}" ${checked[valorDef]}  ${disabled}/></div>`;

    return colec
}
function fechaColec(objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) {

    let fecha = valorColec || v.valorInicial?.() || ""
    let colec = `<input type="date" class="formColec ${i} ${v.clase || ""}" name="${i}" value="${dateNowAFechaddmmyyyy(fecha, `y-m-d`)}" form="f${objeto.accion}${numeroForm}" valid="${v.validacion}" ord="${ord}" tabindex="${indice + 1}" ${disabled} ${autoCompOff}  /></td>`;

    return colec
}
function defaultColec(objeto, numeroForm, i, v, value, ord, indice, disabled, valorColec) {

    let colec = `<input type="texto" class="formColec ${i} ${value.nombre}  ${v.clase || ""}" name="${i}" value="${valorColec}" form="f${accion}${numeroForm}" ord="${ord}"   valid=${v.validacion} tabindex="${indice + 1}" ${disabled}/></td>`;

    return colec
}
const tipoatributoColecciones = {

    //texto
    texto: textoColec,
    textarea: textAreaColec,
    parametrica: parametricaColec,
    parametricaPreEstablecida: parametricaPreEstablecidaColec,
    numero: numeroColec,
    importe: importeColec,
    logico: logicoColec,
    fecha: fechaColec,
    default: defaultColec

}

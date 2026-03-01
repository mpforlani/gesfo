//En esta libreria se guardan todos las funciones que pertenecen a atributos
function filtroRapido(objeto, numeroForm) {
    const filtroDefault = {
        referencia: habilitado,
        filtros: [`true`, `false`, `todos`],
        titulos: [`Habilitado`, `DesHab`, `Todos`],
        inicio: `true`,
    }
    let filtroRapido = "";

    let filtro = objeto?.atributos?.filtroRapido || filtroDefault
    filtroRapido += `<div id=filtroRapido class=${filtro.referencia.nombre}>`;

    $.each(filtro.filtros, (indie, value) => {

        filtroRapido += `<div class="opcionFiltroRapido" valorBuscado="${value}">${filtro.titulos[indie]}</div>`;
    });

    filtroRapido += `</div>`;

    let filRapido = $(filtroRapido);

    if (objeto.atributos?.limiteCabecera != true) {
        $(`#bf${numeroForm} .progressBar`).after(filRapido);

    } else {

        filRapido.appendTo($(`#bf${numeroForm} .comandSegundaLinea`))
        $(`#bf${numeroForm}`).attr("linea", "dos")
    }

    $(`#bf${numeroForm} .opcionFiltroRapido[valorBuscado="${filtro.inicio}"]`).addClass(`botonActivo`);

    $(`#bf${numeroForm} .opcionFiltroRapido`).on("click", (e) => {

        $(e.target).addClass(`botonActivo`);
        $(e.target).siblings().removeClass(`botonActivo`);

        let registros = $(`#t${numeroForm} .tr.fila`);
        let valorBuscado = $(e.target).attr("valorBuscado");
        let filtrado = filtro.referencia.nombre || filtro.referencia;

        $.each(registros, (indice, value) => {

            let valorFila = $(`div.${filtrado}`, value).html() || "false";

            if (valorFila.trim() == valorBuscado || valorBuscado == "todos") {
                $(value).removeClass(`oculto${filtrado}`);
            } else {
                $(value).addClass(`oculto${filtrado}`).removeClass("sel");
            }
        });

        if ($(e.target).text().trim() == objeto?.atributos?.filtroRapido?.ocultaFecha) {

            $(`#bf${numeroForm} .fechaTablaAbm`).addClass("oculto")
        } else {
            $(`#bf${numeroForm} .fechaTablaAbm`).removeClass("oculto")

        }
    });
};
function abrirAdjuntoFormIndividual(objeto, numeroForm) {

    const adj = {
        0: "Sin Adjuntos",
        1: "archivo adjunto",
        2: "archivos adjuntos",
    }
    const NumALet = {
        1: (largoArchivos) => { return primeraLetraMayusculaString(NumeroALetras("", largoArchivos, "")) },
        0: (largoArchivos) => { return "" }
    }
    const aperturaLista = (e) => {

        $(`#t${numeroForm} .listadoAdjunto`).removeClass("oculto")
        let table = $(`#t${numeroForm}`)
        let scrollTop = table.scrollTop();
        let porcentajeTop = table.height() * 0.1;
        let nuevaTop = porcentajeTop + scrollTop;

        $(`#t${numeroForm} .listadoAdjunto`).css("top", `${nuevaTop}px`);
    }
    const cerrarLista = (e) => {

        let inputsUsados = $(`#t${numeroForm} .listadoAdjunto input.path`).filter(function () {
            return ($(this).val() != "" || $(`input.adjunto`, $(this).parents(`.tr`)).val() != "")
        }).length

        $(`#t${numeroForm} .botonDescriptivo`).html(`${NumALet[Math.min(inputsUsados, 1)](inputsUsados)} ${adj[Math.min(inputsUsados, 2)]}`)
        $(`#t${numeroForm} .listadoAdjunto`).addClass("oculto")

    }
    const vistaPrevia = (e) => {

        const filaFather = $(e.target).parents("div.tr")
        let src = $(`div.celdAdj.path input`, filaFather).val();
        const esImagen = /\.(webp|jpg|jpeg|png)(\?.*)?$/i.test(src);
        const esPDF = /\.pdf(\?.*)?$/i.test(src);

        let canvasCointaner = ""

        if (src != "") {

            if (esImagen) {

                canvasCointaner = `<div id="canvas_container"><img id="vistaPreviaImg" src="${src}"></div>`
                let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`
                $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
                $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos

            } else if (esPDF) {

                canvasCointaner = `<div id="canvas_container" class="pdf"><embed id="vistaPreviaPDF" src="${src}" type="application/pdf"></div>`;
                let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`
                $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
                $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos
            }
            else {
                // Descargar automáticamente sin mostrar nada
                const a = document.createElement('a');
                a.href = src;
                a.download = src.split("/").pop();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                return; // No continúa con vista previa
            }

        } else {

            const file = $(`input.adjunto`, filaFather)[0].files[0];
            const esImagen = /^image\/(webp|jpeg|png)$/i.test(file.type);
            const esPDF = (/^application\/pdf$/i.test(file.type) || /\.pdf$/i.test(file.name));

            const reader = new FileReader();
            reader.onload = function (event) {

                if (esImagen) {
                    canvasCointaner = `<div id="canvas_container"><img id="vistaPreviaImg" src="${reader.result}"></div>`
                    let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`
                    $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
                    $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos


                } else if (esPDF) {

                    canvasCointaner = `<div id="canvas_container" class="pdf"><embed id="vistaPreviaPDF" src="${reader.result}" type="application/pdf"></div>`;
                    let cortinaNegraComandos = `<div class="cortinaNegraComandosImg"><div class="closePop vistaPrevia">+</div><div>`
                    $(cortinaNegraComandos).appendTo(`#bf${numeroForm}`)
                    $(canvasCointaner).appendTo(`#t${numeroForm}`)//Esta es la cortina negra para tapar los comandos

                } else {

                    let cartel = cartelInforUnaLinea("Solo tiene vista previa imagenes y pdf", "", { cartel: "infoChiquito ", close: "ocultoSiempre" })
                    $(cartel).appendTo(`#bf${numeroForm}`)
                    removeCartelInformativo(objeto, numeroForm)
                    return; // No continúa con vista previa
                }
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }

    $(`#t${numeroForm}`).on(`click`, `.adjunto .botonDescriptivo:not(.disabled, .noAbrir), .adjunto .botonDescriptivo.disabled.abrir`, aperturaLista)
    $(`#t${numeroForm}`).on(`click`, `.listadoAdjunto .closePop`, cerrarLista)
    $(`#t${numeroForm}`).on("click", `img.verAdj`, vistaPrevia);
    $(`#t${numeroForm}`).on("click", `.listadoAdjunto .celdAdj.adjunto img`, (e) => {

        $(e.target).siblings("label").trigger("click")
    });
    $(`#bf${numeroForm}`).on(`click`, `.closePop.vistaPrevia`, (e) => {

        $(`#bf${numeroForm} .cortinaNegraComandosImg`).remove()
        $(`#t${numeroForm} #canvas_container`).remove()

    })
};
function abrirAdjuntoColeccion(objeto, numeroForm) {

    const father = fatherId(objeto, numeroForm)
    const adj = {
        0: "Sin Adjuntos",
        1: "archivo adjunto",
        2: "archivos adjuntos",
    }
    const NumALet = {
        1: (largoArchivos) => { return primeraLetraMayusculaString(NumeroALetras("", largoArchivos, "")) },
        0: (largoArchivos) => { return "" }
    }


    const vistaPrevia = (e) => {

        const filaFather = $(e.target).parents("div.tr")
        let src = $(`div.celdAdj.path input`, filaFather).val();

        if (src != "") {

            $(`#vistaPrevia`).attr("src", src);

            $(`#canvas_container`).css("display", `flex`);
        } else {

            const file = $(`input.adjunto`, filaFather)[0].files[0];

            const reader = new FileReader();
            reader.onload = function (event) {

                $('#vistaPrevia').attr('src', reader.result);
                $(`#canvas_container`).css("display", `flex`);
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }

    $(`#t${numeroForm}`).on("click", `img.verAdj`, vistaPrevia);
    $(`#t${numeroForm}`).on("click", `.adjuntoColec .celdAdj.adjunto img`, (e) => {

        $(e.target).siblings("label").trigger("click")
    });
};
function anularEnvioAtributos(objeto, numeroForm, atributo) {

    const father = fatherId(objeto, numeroForm)

    $(`#t${numeroForm} input.${atributo.nombre || atributo}`).removeAttr("name")
    $(`#t${numeroForm} input.${atributo.nombre || atributo}`).removeAttr("form")

}
function activarBlanquearContraseña(objeto, numeroForm) {

    let passwordForm = ""
    let passwordRepetidaForm = ""

    const removeocult = () => {

        $(`#t${numeroForm} div.blanquearCont.cartel`).removeClass("oculto")
        $(`#t${numeroForm} div.blanquearCont.cartel input[name="password"]`).removeAttr("disabled")
        $(` div.blanquearCont.cartel input`).addClass("requerido")
        $(`#t${numeroForm} div.blanquearCont.cartel input`).removeAttr("disabled", "disabled")

    }
    const cerrarClose = () => {

        $(`#t${numeroForm} div.blanquearCont.cartel`).addClass("oculto")
        $(`#t${numeroForm} div.blanquearCont.cartel input`).val("").removeClass("validado").removeClass("requerido")
        $(`#t${numeroForm} div.blanquearCont.cartel p`).remove()
        $(`#t${numeroForm} div.blanquearCont.cartel input`).attr("disabled", "disabled")
    }
    const changeOjito = (e) => {

        let parents = e.target.closest(`div`)

        if ($(e.target).hasClass(`tachado`)) {

            $("input", parents).attr(`type`, `text`)

        } else {

            $("input", parents).attr(`type`, `password`)
        }
        $(`span`, parents).toggleClass("oculto")
    }
    const chequeaeContrasenaUno = (e) => {

        passwordForm = $(e.target).val()

        if (passwordForm == passwordRepetidaForm) {

            $(`#t${numeroForm} input.repetirContrasena`).addClass("validado")
            $(`#t${numeroForm} div.textoValidacionContrasena `).addClass("oculto")
        } else {

            $(`#t${numeroForm} input.repetirContrasena`).removeClass("validado")
            $(`#t${numeroForm} div.textoValidacionContrasena `).removeClass("oculto")

        }
    }
    const chequeaeContrasenaDos = (e) => {

        passwordRepetidaForm = $(e.target).val()

        if (passwordForm == passwordRepetidaForm) {

            $(e.target).addClass("validado")
            $(`#t${numeroForm} div.textoValidacionRep`).addClass("oculto")
        } else {

            $(e.target).removeClass("validado")
            $(`#t${numeroForm} div.textoValidacionRep`).removeClass("oculto")
        }


    }
    const enviarBlanqueo = (e) => {

        let inputEnviar = $(`#t${numeroForm} input.nuevaCont`).hasClass("validado")
        let inputChequeo = $(`#t${numeroForm} input.chequeo`).hasClass("validado")

        if (inputEnviar && inputChequeo) {

            let objetoEnviar = new Object
            objetoEnviar._id = $(`#t${numeroForm} input._id`).val()
            objetoEnviar.password = $(`#t${numeroForm} input[name="password"]`).val()

            $.ajax({
                type: "PUT",
                url: `/blanquearContrasena`,
                data: objetoEnviar,
                beforeSend: function (data) { },
                complete: function (data) { },
                success: function (response) {

                    $(`#t${numeroForm} .blanquearCont.cartel .closePop`).trigger("click")
                    const mensaje = `La clave fue blanqueada con exito`

                    let cartel = cartelInforUnaLinea(mensaje, "☑️", { cartel: "verde" })
                    $(cartel).appendTo(`#bf${numeroForm}`)
                    removeCartelInformativo(objeto, numeroForm)


                },
                error: function (error) {
                    console.log(error);
                },
            })
        } else {

            let cartel = cartelInforUnaLinea("Revisar campos en rojos", "❌", { cartel: "infoChiquito rojo", close: "ocultoSiempre" })
            $(cartel).appendTo(`#bf${numeroForm}`)
            removeCartelInformativo(objeto, numeroForm)

        }
    }
    const enviarRegistro = (e) => {

        funcionesAntesdeEnviar(objeto, numeroForm, `t${numeroForm}`).then((resultado) => {

            enviarUsuarioNuevoForm(numeroForm, objeto);

            if (confirmarImprimir == true) {

                imprimirDirecto(objeto, numeroForm, consultaPestanas), (confirmarImprimir = false);
            }

        }).catch(error => {
            // Manejar el error aquí para evitar que se propague
            console.error('Se produjo un error:', error);
        });
    }

    $(`#t${numeroForm}`).on("click", `.botonDescriptivo:not(.disabled)`, removeocult)
    $(`#t${numeroForm}`).on("click", `.blanquearCont.cartel .closePop`, cerrarClose)
    $(`#t${numeroForm}`).on(`click`, `span.ojito`, changeOjito)
    $(`#t${numeroForm}`).on(`input`, `.blanquearCont.cartel input[name="password"]`, chequeaeContrasenaUno)
    $(`#t${numeroForm}`).on(`input`, `.blanquearCont.cartel input.chequeo`, chequeaeContrasenaDos)
    $(`#t${numeroForm}`).on(`click`, `.blanquearCont.cartel .botonEnviar`, enviarBlanqueo)
    $(`#bf${numeroForm}`).on(`click`, `.okUsuarioBoton`, enviarRegistro)

}
async function transformarSemiParametrica(objeto, numeroForm) {
    let filas = $(`#t${numeroForm} .tr.fila`).toArray();

    for (const fila of filas) {

        let valorNeto = $(`.celda.atributoAgrup`, fila).html()?.trim();
        let entidad = $(`.celda.entidad`, fila).html()?.trim();
        let nombre = $(`.celda.name`, fila).html()?.trim();

        let acumulador = Object.values(variablesModelo[entidad]?.acumulador)?.find(e => e.nombre == nombre);
        let atributoAgrup = acumulador?.atributos?.atributoAgrup;

        let valorParamet;

        if (consultaPestanas?.[atributoAgrup]) {

            valorParamet = consultaPestanas[atributoAgrup];
        } else if (atributoAgrup != undefined) {

            valorParamet = (await consultasPestanaIndividual(atributoAgrup)).pestana;
        }

        $(`.celda.atributoAgrup`, fila).html(valorParamet?.[valorNeto]?.name || "");

    }
}
function ocultarFuncAcumuladores(objeto, numeroForm) {

    $(`#t${numeroForm} .tr.input`).remove()
    $(`#bf${numeroForm} span.editBoton`).remove()
    $(`#bf${numeroForm} span.desHabilitarBoton`).remove()
    $(`#bf${numeroForm} span.historia`).remove()
    $(`#bf${numeroForm} span.crearBotonInd `).addClass("ocultoSiempre")

    const botonChequear = `<div class="barraForm"><span class="material-symbols-outlined botones checkAcum">check_box</span></div>`
    $(`#bf${numeroForm} .fechaTablaAbm`).before(botonChequear)
}
function despleglarListaInicio(objeto, numeroForm) {

    $(`#t${numeroForm} span.arrow.abajo`).trigger("click")
}

//Totalizadores
function totalizadorCabecera(objeto, numeroForm, totalizador) {

    const calculartotalesCabecera = (value) => {

        let total = 0

        $.each(value.digitosPositivos, (ind, value) => {

            let digitosPositivos = $(`#t${numeroForm} input.${value.nombre || value}`)

            $.each(digitosPositivos, (ind, val) => {

                total += stringANumero($(val).val()) || 0;

            })
        })
        $.each(value.digitosNegativos, (ind, value) => {

            let digitosNegativos = $(`#t${numeroForm} input.${value.nombre || value}`)

            $.each(digitosNegativos, (ind, val) => {

                total -= stringANumero($(val).val()) || 0;
            })
        })

        let totalFormato = numeroAString(total)

        $(`#t${numeroForm} input.${value.total[0].nombre || value.total[0]}`).val(totalFormato).trigger("input")

    };

    $.each(totalizador.trigger, (ind, val) => {

        $(`#t${numeroForm}`).on(`input`, `input.${val.nombre || val}`, (e) => {

            calculartotalesCabecera(totalizador)

        })
    })
    $(`#t${numeroForm} input.${totalizador.total[0].nombre || totalizador.total[0]}`).addClass("total").attr("readonly", true).attr("atributoSuma", totalizador.digitosPositivos[0]).attr("tabindex", -1)
    $(`#t${numeroForm} div.${totalizador.total[0].nombre}`).addClass("total")
}
function totalizadorColeccion(objeto, numeroForm, totalizador) {

    const calculartotalesColeccion = (value, e) => {

        let fila = $(e.target).parents("tr");
        const porcentaje = {
            porcentaje: 100,
            numero: 1
        }
        const deft = {
            porcentaje: 0,
            numero: 1,
            undefined: 1
        }

        let totalimporteSuma = 0;

        let cantidad = (stringANumero($(`input.${value.cantidad.nombre || value.cantidad}`, fila).val()) || deft[value.cantidad?.type]) * (1 / (porcentaje[value.cantidad?.type] || 1));

        $.each(value.digitosPositivos, (ind, val) => {

            let importe = $(`input.${val.nombre || val}`, fila).val() || 0;
            totalimporteSuma += stringANumero(importe) * cantidad
        })

        $.each(value.digitosNegativos, (ind, val) => {

            let importe = $(`input.${val.nombre || val}`, fila).val() || 0;
            totalimporteSuma -= stringANumero(importe) * cantidad
        })

        $.each(value.digitosPositivosSinCantidad, (ind, val) => {

            let importe = $(`input.${val.nombre || val}`, fila).val() || 0;

            totalimporteSuma += stringANumero(importe)
        })

        let importeFormato = numeroAString(totalimporteSuma)

        $(`input.${value.total[0].nombre || value.total[0]}:not(.anuladoCalculo):not(.totalColec)`, fila).val(importeFormato).trigger("input")

    };
    $.each(totalizador.trigger, (ind, val) => {

        $(`#t${numeroForm}`).on(`input`, `tr:not(:last-child) input.${val.nombre || val}`, (e) => {
            calculartotalesColeccion(totalizador, e)

        });
    })

    $(`#t${numeroForm} input.${totalizador.total[0].nombre || totalizador.total[0]}`).addClass("total").attr("readonly", true).attr("tabindex", -1).attr("atributoSuma", totalizador.digitosPositivos[0])

}
function totalizadorColeccionMult(objeto, numeroForm, totalizador) {

    const calculartotalesColeccion = (value, e) => {

        const resultado = {
            0: (importe) => { return 0 },
            1: (importe) => { return numeroAString(importe) }

        }
        let fila = $(e.target).parents("tr");

        let totalimporteSuma = ""
        let sumarImporte = 0
        $.each(value.digitosPositivos, (ind, val) => {

            let importe = $(`input.${val.nombre || val}`, fila).val() || 0;
            sumarImporte += stringANumero(importe)
            totalimporteSuma = (totalimporteSuma || 1) * stringANumero(importe || 1)
        })

        let importeFinal = resultado[Math.min(sumarImporte, 1)](totalimporteSuma)

        $(`input.${value.total[0].nombre || value.total[0]}:not(.anuladoCalculo):not(.totalColec)`, fila).val(importeFinal).trigger("input")

    };
    $.each(totalizador.trigger, (ind, val) => {

        $(`#t${numeroForm}`).on(`input`, `tr:not(:last-child) input.${val.nombre || val}`, (e) => {
            calculartotalesColeccion(totalizador, e)

        });
    })

    $(`#t${numeroForm} input.${totalizador.total[0].nombre || totalizador.total[0]}`).addClass("total").attr("readonly", true).attr("tabindex", -1).attr("atributoSuma", totalizador.digitosPositivos[0])

}
function totalizadorColeccionVertical(objeto, numeroForm, totalizador) {

    const calculartotalesColeccionVertical = (value, e) => {

        let digitosNegativos = value.digitosNegativos
        let digitosPositivos = value.digitosPositivos
        let totalimporteSuma = 0;
        let father = $(e.target).parents(`table`)

        $.each(digitosPositivos, (indin, value) => {

            let inputs = $(`input.${value.nombre || value}:not(.totalColec)`, father)
            $.each(inputs, (ind, val) => {

                totalimporteSuma += stringANumero($(val).val() || 0);
            })
        })

        $.each(digitosNegativos, (indin, value) => {

            let inputs = $(`input.${value.nombre || value}.${numeroForm}:not(.totalColec)`, father)

            $.each(inputs, (ind, val) => {

                totalimporteSuma += stringANumero($(val).val() || 0);

            })
        })

        let importeFormato = numeroAString(totalimporteSuma)

        $(`input.${value.total[0].nombre || value.total[0]}`, father).val(importeFormato).trigger("input");

    };

    $(`#t${numeroForm} input.${totalizador.total[0].nombre || totalizador.total[0]}`).addClass("total").attr("readonly", true).attr("atributoSuma", totalizador.digitosPositivos[0]).attr("tabindex", -1)

    $.each(totalizador.trigger, (ind, v) => {

        $(`#t${numeroForm}`).on(`input`, `input.${v.nombre || v}:not(.totalColec)`, (e) => {
            calculartotalesColeccionVertical(totalizador, e)

        })
    })


}
function totalizadorColeccionVerticalHora(objeto, numeroForm, totalizador) {

    const calculartotalesColeccionVertical = (value, e) => {

        let digitosNegativos = value.digitosNegativos
        let digitosPositivos = value.digitosPositivos
        let totalimporteSuma = 0;
        let father = $(e.target).parents(`table`)

        $.each(digitosPositivos, (indin, value) => {

            let inputs = $(`input.${value.nombre || value}:not(.totalColec)`, father)

            $.each(inputs, (ind, val) => {

                let valorEnhora = $(val).val() || `0h 0m`;

                let [hora, minutos] = valorEnhora.replace("m", "").split("h")
                let minutosTotales = parseFloat(minutos || 0) + parseFloat((hora || 0) * 60)

                totalimporteSuma += parseFloat(minutosTotales || 0);
            })
        })

        $.each(digitosNegativos, (indin, value) => {

            let inputs = $(`input.${value.nombre || value}.${numeroForm}:not(.totalColec)`, father)

            $.each(inputs, (ind, val) => {

                let valorEnhora = $(val).val() || `0h 0m`;
                let [hora, minutos] = valorEnhora.replace("m", "").split("h")

                let minutosTotales = parseFloat(minutos || 0) + parseFloat((hora || 0) * 60)

                totalimporteSuma += parseFloat(minutosTotales || 0) - 1;

            })
        })

        let importeFormato = minutosAHoraMinutos(totalimporteSuma)

        $(`input.${value.total[0].nombre || value.total[0]}`, father).val(importeFormato).trigger("blur")

    };

    $(`#t${numeroForm} input.${totalizador.total[0].nombre || totalizador.total[0]}`).addClass("total").removeClass("formatoNumero").attr("readonly", true).attr("tabindex", -1).attr("atributoSuma", totalizador.digitosPositivos[0])
    $.each(totalizador.trigger, (ind, v) => {

        $(`#t${numeroForm}`).on(`blur`, `input.${v.nombre || v}:not(.totalColec):not(.total):not(.transformandoNumerHor)`, (e) => {

            calculartotalesColeccionVertical(totalizador, e)

        })
    })
}
function totalizadorColeccionHora(objeto, numeroForm, totalizador) {

    const calculartotalesColeccion = (value, e) => {

        let fila = $(e.target).parents("tr");

        let totalimporteSuma = 0;
        let cantidad = stringANumero($(`input.${value.cantidad?.nombre || value.cantidad}`, fila).val() || 1);

        $.each(value.digitosPositivos, (ind, val) => {


            let valorEnhora = $(`input.${val.nombre || val}`, fila).val() || `0h 0m`;

            let [hora, minutos] = valorEnhora.replace("m", "").split("h")
            let minutosTotales = parseFloat(minutos || 0) + parseFloat((hora || 0) * 60)

            totalimporteSuma += stringANumero(minutosTotales)
        })

        $.each(value.digitosNegativos, (ind, val) => {

            let valorEnhora = $(`input.${val.nombre || val}`, fila).val() || `0h 0m`;

            let [hora, minutos] = valorEnhora.replace("m", "").split("h")
            let minutosTotales = parseFloat(minutos || 0) + parseFloat((hora || 0) * 60)
            totalimporteSuma -= stringANumero(minutosTotales)
        })

        totalimporteSuma * cantidad
        $.each(value.digitosPositivosSinCantidad, (ind, val) => {


            let valorEnhora = $(`input.${val.nombre || val}`, fila).val() || `0h 0m`;

            let [hora, minutos] = valorEnhora.replace("m", "").split("h")
            let minutosTotales = parseFloat(minutos || 0) + parseFloat((hora || 0) * 60)
            totalimporteSuma += stringANumero(minutosTotales)
        })

        let importeFormato = minutosAHoraMinutos(totalimporteSuma)
        $(`input.${value.total[0].nombre || value.total[0]}:not(.anuladoCalculo):not(.totalColec)`, fila).val(importeFormato).trigger("blur")

    };

    $.each(totalizador.trigger, (ind, val) => {

        $(`#t${numeroForm}`).on(`blur`, `tr:not(:last-child) input.${val.nombre || val}:not(.transformandoNumerHor)`, (e) => {

            calculartotalesColeccion(totalizador, e)

        });
    })

    $(`#t${numeroForm} input.${totalizador.total[0].nombre || totalizador.total[0]}`).addClass("total").attr("readonly", true).attr("tabindex", -1)

}
function totalizadorColeccionSegunValorExt(objeto, numeroForm, totalizador) {//Esta se fija si un valor es % segun el tipo de item

    const calculartotalesColeccionSegunValorExt = (value, e) => {

        let fila = $(e.target).parents("tr")
        const porcentaje = {
            porcentaje: 100,
            numero: 1

        }
        const deft = {
            porcentaje: 10,
            numero: 1
        }
        let typeDeSeg = "numero"

        if ($(`.inputSelect.${value?.porcentaje?.atributo}`, fila).val() == value?.porcentaje?.valor) {
            typeDeSeg = "porcentaje"

        }

        let totalimporteSuma = 0;

        let cantidad = ((stringANumero($(`input.${value.cantidad.nombre || value.cantidad}`, fila).val()) || deft[typeDeSeg] || 1) * (1 / (porcentaje[typeDeSeg] || 1)));

        $.each(value.digitosPositivos, (ind, val) => {

            let importe = $(`input.${val.nombre || val}`, fila).val() || 0;

            totalimporteSuma += stringANumero(importe) * cantidad
        })

        $.each(value.digitosNegativos, (ind, val) => {

            let importe = $(`input.${val.nombre || val}`, fila).val() || 0;
            totalimporteSuma -= stringANumero(importe) * cantidad
        })

        let importeFormato = numeroAString(totalimporteSuma)

        $(`input.${value.total[0].nombre || value.total[0]}:not(.anuladoCalculo)`, fila).val(importeFormato).trigger("input")

    };

    $(`#t${numeroForm} input.${totalizador.total[0].nombre || totalizador.total[0]}`).addClass("total").attr("readonly", true).attr("tabindex", -1)

    $.each(totalizador.trigger, (ind, val) => {

        $(`#t${numeroForm}`).on(`input`, `tr:not(:last-child) input.${val.nombre || val}`, (e) => {

            calculartotalesColeccionSegunValorExt(totalizador, e)

        });
    })
}
function totalizadorColeccionVerticalConCondicion(objeto, numeroForm, totalizador) {//ESto se usa en una coleccin cuando cambio la moneda

    const calculartotalesColeccionVerticalConCondicion = (value, e) => {

        let digitosNegativos = value.digitosNegativos
        let digitosPositivos = value.digitosPositivos
        let father = $(e.target).parents(`table`)

        $.each(value.total, (i, v) => {

            let totalimporteSuma = 0;

            $.each(digitosPositivos, (indin, value) => {

                let inputs = $(`[moneda=${i.toLowerCase()}] input.${value.nombre || value}:not(.totalColec)`, father)

                $.each(inputs, (ind, val) => {

                    totalimporteSuma += stringANumero($(val).val() || 0);

                })
            })

            $.each(digitosNegativos, (indin, value) => {

                let inputs = $(`[moneda="${i.toLowerCase()}"] input.${value.nombre || value}:not(.totalColec)`, father)

                $.each(inputs, (ind, val) => {

                    totalimporteSuma += stringANumero($(val).val() || 0);
                })
            })

            let imp = reemplazarPuntoPorComaSinTip(totalimporteSuma)
            let importeFormato = separadorDeMilNumero(imp)

            $(`input.${v.nombre || v}`, father).val(importeFormato).trigger("input");

        })
    };

    $.each(totalizador.total, (indice, val) => {

        $(`#t${numeroForm} div.${val}`).attr("atributoSuma", totalizador.digitosPositivos[0]).addClass("total").attr("readonly", true).attr("tabindex", -1)
    })

    $.each(totalizador.trigger, (ind, v) => {

        $(`#t${numeroForm}`).on(`input`, `input:not(.totalColec ).${v.nombre || v}`, (e) => {
            calculartotalesColeccionVerticalConCondicion(totalizador, e)
        });

        $(`#t${numeroForm}`).on(`change`, `.divSelectInput[name=${v.nombre || v}]`, (e) => {
            calculartotalesColeccionVerticalConCondicion(totalizador, e)
        });
    })
}
const objetoTotalizadores = {
    totalizadorColeccion: [totalizadorColeccion],
    totalizadorCabecera: [totalizadorCabecera],
    totalizadorColeccionVertical: [totalizadorColeccionVertical],
    totalizadorColeccionSegunValorExt: [totalizadorColeccionSegunValorExt],
    totalizadorColeccionVerticalConCondicion: [totalizadorColeccionVerticalConCondicion],
    //Multiplicar
    totalizadorColeccionMult: [totalizadorColeccionMult],
    ///Tengo que hacer totalizadores exlclusivo de hora, por el trigger y todo lo relacionado, ya que  el de hora es blur por el tema del fomato de la hora, que quede finalizado
    totalizadorColeccionVerticalHora: [totalizadorColeccionVerticalHora],
    totalizadorColeccionHora: [totalizadorColeccionHora]

}
//Multimoneda Form
async function tcMultimoneda(objeto, numeroForm) {

    let monedaAlternativaId = Object.values(consultaPestanas.moneda).find(e => e.name.toLowerCase() == caracteristicaEmpresa.monedaAlternativa.toLowerCase())?._id;
    let monedaBaseId = Object.values(consultaPestanas.moneda).find(e => e.name.toLowerCase() == caracteristicaEmpresa.monedaBase.toLowerCase())?._id;
    let ultimaCotizacionMonedaAlternativa = cotizacionesMoneda[caracteristicaEmpresa.monedaAlternativa.toLowerCase()] || await obtenerUltimasCotizaciones(monedaAlternativaId)

    async function calcularcotizacionYTotales(objeto, numeroForm, e) {

        let name = e.target.name
        let inputMonedaBase = $(e.target).siblings(`.${name}mb`)
        let inputMonedaAlternativa = $(e.target).siblings(`.${name}ma`)
        let valor = stringANumero(e.target.value || 0)
        let moneda = $(`#t${numeroForm} .inputSelect.moneda`).val() //|| $(`.inputSelect.moneda`, `#bf${numeroForm}`).val()
        let monedaId = Object.values(consultaPestanas.moneda).find(e => e.name.toLowerCase() == moneda.toLowerCase())?._id

        if (monedaId == monedaBaseId) {

            inputMonedaBase.val(valor)

            inputMonedaAlternativa.val(((valor || 0) / ultimaCotizacionMonedaAlternativa).toFixed(2))

        } else {

            if (monedaId == monedaAlternativaId) {
                inputMonedaBase.val((valor || 0) * ultimaCotizacionMonedaAlternativa)
                inputMonedaAlternativa.val(valor)

            } else {

                let cotizacionMonedaExtranjera = stringANumero(cotizacionesMoneda[consultaPestanas.moneda[monedaId]]) || stringANumero($(`#t${numeroForm} input.tipoCambio`).val())

                inputMonedaBase.val(valor * cotizacionMonedaExtranjera)
                inputMonedaAlternativa.val(valor * (cotizacionMonedaExtranjera / ultimaCotizacionMonedaAlternativa).toFixed(2))

            }
        }
    }
    //////////////input tc Triger 
    $(`#t${numeroForm}`).on(`change`, `input[name^=tipoCambio]`, () => {

        $(`#t${numeroForm} input.monedaFormulario`).trigger("input")
    })
    //
    $(`#t${numeroForm}`).on(`input`, `input.monedaFormulario`, (e) => {

        calcularcotizacionYTotales(objeto, numeroForm, e)
    })

    async function validarSelectMonedaForm(e) {

        let valor = e.target.value

        if (valor != "" && consultaPestanas.moneda?.[valor]?.name.toLowerCase() != caracteristicaEmpresa.monedaBase.toLowerCase()) {


            let ultimaCotizacionMonedaAlternativa = cotizacionesMoneda[consultaPestanas.moneda?.[valor]?.name.toLowerCase()] || await obtenerUltimasCotizaciones(valor)

            $(`#t${numeroForm} div.fo[class*=tipoCambio] input`).val(numeroAString(ultimaCotizacionMonedaAlternativa)).trigger("input").trigger("change")
            $(`#t${numeroForm} div.fo[class*=tipoCambio]`).removeClass("oculto");

        } else if (consultaPestanas.moneda?.[valor]?.name.toLowerCase() == caracteristicaEmpresa.monedaBase.toLowerCase() || valor == "") {

            $(`#t${numeroForm} div.fo[class*=tipoCambio] input`).val(1).trigger("input").trigger("change")
            $(`#t${numeroForm} div.fo[class*=tipoCambio]`).addClass("oculto");
        }
    }
    async function validarSelectMonedaColec(e) {

        let valor = e.target.value
        let fatherFila = $(e.target).parents("tr")
        let fatherTable = $(e.target).parents("table")

        if (valor != "" && consultaPestanas.moneda?.[valor]?.name.toLowerCase() != caracteristicaEmpresa.monedaBase.toLowerCase()) {

            let ultimaCotizacionMonedaAlternativa = cotizacionesMoneda?.[consultaPestanas.moneda?.[valor]?.name.toLowerCase()] || await obtenerUltimasCotizaciones(valor)

            $(`td[class*=tipoCambio] input`, fatherFila).val(numeroAString(ultimaCotizacionMonedaAlternativa)).trigger("input").trigger("change")
            $(`td[class*=tipoCambio]`, fatherFila).removeClass("oculto").removeClass("ocultoConLugar");
            $(`td[class*=tipoCambio],
               th[class*=tipoCambio]`, fatherTable).removeClass("oculto")

        } else if (consultaPestanas.moneda?.[valor]?.name.toLowerCase() == caracteristicaEmpresa.monedaBase.toLowerCase() || valor == "") {

            $(`td[class*=tipoCambio] input`, fatherFila).val(1).trigger("input").trigger("change")

            let monedaExt = false
            let monedasTotales = $(`td[class*="moneda"] .divSelectInput`, fatherTable)

            let index = 0

            while (index < monedasTotales.length && !monedaExt) {

                if (consultaPestanas.moneda?.[monedasTotales[index].value]?.name?.toLowerCase() != caracteristicaEmpresa.monedaBase.toLowerCase()) {
                    monedaExt = true
                }

                index++

            }

            if (monedaExt) {
                $(`td[class^=tipoCambio] input`, fatherFila).addClass("ocultoConLugar");
            } else {

                $(`td[class*=tipoCambio],
                     th[class*=tipoCambio]`, fatherTable).addClass("oculto")

            }
        }
    }

    $(`#t${numeroForm}`).on(`change`, `div.fo[class*="moneda"] .divSelectInput`, validarSelectMonedaForm)
    $(`#t${numeroForm}`).on(`change`, `td[class*="moneda"] .divSelectInput:not(:disabled)`, validarSelectMonedaColec)
    $(`#t${numeroForm} div.fo[class*="moneda"] .inputSelect`).trigger(`change`)//Para q oculte valroes iniciales
    $(`#t${numeroForm} td[class*="moneda"] .divSelectInput`).trigger(`change`)//Para q oculte valroes iniciales

    $(`#t${numeroForm}`).on("dblclick", "input.position", (e) => {

        let tc = $(`tr.mainBody[q=0] td[class*=tipoCambio]`).hasClass("oculto")

        if (tc) {

            $(`tr.last td[class*=tipoCambio]:not([notEsconder])`).addClass("oculto")
        }

    })
}
async function tipodeCambioSinMultimoneda(objeto, numeroForm) {

    async function calcularTC(e) {

        let moneda = consultaPestanas.moneda?.[$(e.target).val()]?.name
        let ultimaCotizacionMonedaAlternativa = cotizacionesMoneda[moneda] || await obtenerUltimasCotizaciones(caracteristicaEmpresa.monedaAlternativa.toLowerCase())

        $(`#t${numeroForm} div.fo[class*=tipoCambio] input`).val(ultimaCotizacionMonedaAlternativa).trigger("input")
    }

    $(`#t${numeroForm}`).on("change", `div.fo[class*="moneda"] .divSelectInput`, calcularTC)

    async function calcularTCColec(e) {

        let table = e.target.closest("table")
        let moneda = consultaPestanas.moneda?.[$(e.target).val()]?.name
        let ultimaCotizacionMonedaAlternativa = cotizacionesMoneda[moneda] || await obtenerUltimasCotizaciones(caracteristicaEmpresa.monedaAlternativa.toLowerCase())

        $(`input[class*=tipoCambio]`, table).val(ultimaCotizacionMonedaAlternativa).trigger("input")
    }

    $(`#t${numeroForm}`).on("change", `table td[class*="moneda"] .divSelectInput`, calcularTCColec)

}
const multimoneda = {
    true: [tcMultimoneda]

}
///////////////FUNCIONES TRIGER
function totalesBaseYMoneda(objeto, numeroForm) {

    //no cambiar el orden porque sino los input input no detectan el sumar en monedas alternativas
    $.each(objeto?.formInd?.moneda?.coleccion, (indice, value) => {

        $(`#t${numeroForm}`).on(`change`, `.divSelectInput[name=${value.nombre || value || "moneda"}]`, function (e) {

            let fatherCelda = $(e.target).parents(".selectCont")
            let currency = $(`.inputSelect`, fatherCelda).val()
            let fatherColeccion = $(e.target).parents("tr")

            if (fatherColeccion.length == 0) {

                $(`#t${numeroForm} table.${indice} td[moneda]`).attr("moneda", currency.toLowerCase())

            } else {

                $(`input.monedaFormulario`, fatherColeccion).parents("td").attr("moneda", currency.toLowerCase())
                let inputsVariable = $(`#t${numeroForm} table.${indice} tr.totales input.monedaBase:not(.ocultoSiempre)`)

                $.each(inputsVariable, (indice, value) => {

                    $(value).parents(`td`).attr("moneda", currency.toLowerCase())
                })
            }

            $(`table.${indice} div[monedaVariable=variable]`).attr("moneda", currency.toLowerCase())

        })
    })

    $(`#t${numeroForm}`).on(`change`, `.divSelectInput[name=${objeto?.atributos?.moneda?.nombre || objeto?.atributos?.moneda || "moneda"}]`, (e) => {

        let currency = $(`#t${numeroForm} .inputSelect.${objeto?.atributos?.moneda?.nombre || objeto?.atributos?.moneda || "moneda"}`).val()

        $(`#t${numeroForm} div.fo input.monedaFormulario`).parents(`div.fo`).attr(`moneda`, currency.toLowerCase())

    })

    multimoneda[caracteristicaEmpresa.multimoneda == true && objeto.type != "parametrica" && objeto.multimoneda != false]?.[0](objeto, numeroForm)

    $.each(objeto.totalizadores, (indice, value) => {

        objetoTotalizadores[value.type][0](objeto, numeroForm, value)
    })
}
//Multimoneda Abm
const multimonedaAbm = {
    true: [tcMultimonedaAbm]
}
function tcMultimonedaAbm(objeto, numeroForm) {

    const insertarMon = async (e) => {

        let valor = e.target.value

        if (valor != "" && consultaPestanas.moneda?.[valor]?.name.toLowerCase() != caracteristicaEmpresa.monedaBase.toLowerCase()) {

            let ultimaCotizacionMonedaAlternativa = cotizacionesMoneda[consultaPestanas.moneda?.[valor]?.name.toLowerCase()] || await obtenerUltimasCotizaciones(consultaPestanas.moneda?.[valor]?.name.toLowerCase())

            $(`#t${numeroForm} .inputTd[class*=tipoCambio] input`).val(numeroAString(ultimaCotizacionMonedaAlternativa)).trigger("input")

        } else if (consultaPestanas.moneda?.[valor]?.name.toLowerCase() == caracteristicaEmpresa.monedaBase.toLowerCase() || valor == "") {

            $(`#t${numeroForm} .inputTd[class*=tipoCambio] input`).val(1).trigger("input").prop("readonly", true)

        }
    }

    $(`#t${numeroForm}`).on(`change`, `.inputTd[class*="moneda"] .divSelectInput`, insertarMon)

    async function calcularcotizacionYTotalesAbm(objeto, numeroForm, e) {

        let ultimaCotizacionMonedaAlternativa = cotizacionesMoneda[caracteristicaEmpresa.monedaAlternativa.toLowerCase()] || await obtenerUltimasCotizaciones(caracteristicaEmpresa.monedaAlternativa.toLowerCase())

        let name = e.target.name
        let inputMonedaBase = $(e.target).siblings(`.${name}mb`)
        let inputMonedaAlternativa = $(e.target).siblings(`.${name}ma`)
        let valor = stringANumero(e.target.value || 0)
        let moneda = $(`#t${numeroForm} .inputSelect.moneda`).val()

        if (moneda.toLowerCase() == caracteristicaEmpresa.monedaBase.toLowerCase()) {

            inputMonedaBase.val(valor)
            inputMonedaAlternativa.val(((valor || 0) / ultimaCotizacionMonedaAlternativa).toFixed(2))

        } else {
            if (moneda.toLowerCase() == caracteristicaEmpresa.monedaAlternativa.toLowerCase()) {
                inputMonedaBase.val((valor || 0) * ultimaCotizacionMonedaAlternativa)
                inputMonedaAlternativa.val(valor)

            } else {

                let cotizacionMonedaExtranjera = stringANumero(cotizacionesMoneda[consultaPestanas.moneda[monedaId]])
                inputMonedaBase.val(valor * cotizacionMonedaExtranjera)
                inputMonedaAlternativa.val(valor * (cotizacionMonedaExtranjera / ultimaCotizacionMonedaAlternativa).toFixed(2))

            }
        }
    }

    $(`#t${numeroForm}`).on(`input`, `input.monedaFormulario`, (e) => {

        calcularcotizacionYTotalesAbm(objeto, numeroForm, e)
    })

}
function totalesBaseYMonedaAbm(objeto, numeroForm) {

    multimonedaAbm[caracteristicaEmpresa.multimoneda == true && objeto.type != "parametrica" && objeto.multimoneda != false]?.[0](objeto, numeroForm)

    $(`#t${numeroForm}`).on(`change`, `.divSelectInput[name=${objeto?.atributos?.moneda?.nombre || objeto?.atributos?.moneda || "moneda"}]`, (e) => {

        let currency = $(`#t${numeroForm} .inputSelect.${objeto?.atributos?.moneda?.nombre || objeto?.atributos?.moneda || "moneda"}`).val()

        $(`#t${numeroForm} .inputTd input.monedaBase`).parents(`.inputTd`).attr(`moneda`, currency.toLowerCase())

    })

}
function descativarCalculoOcultarDigito(father, total, digitos) {

    let requeridos = []

    $(`#${father}`).on(`dblclick`, `input.${total}.total`, (e) => {
        requeridos = []
        $(e.target).removeAttr("readonly").removeClass("total").val("")
        let fatherFila = $(e.target).parents("tr")

        $.each(digitos, (indice, value) => {

            let input = $(`td[unidadmedida] input.${value.nombre || value}`, fatherFila)
            input.addClass("ocultoConLugar").val("")
            let td = $(`input.${value.nombre || value}`, fatherFila).parents("td")
            let unid = td.attr("unidadmedida")
            td.attr("unidOculta", unid).removeAttr("unidadmedida")

            if (input.hasClass("requerido")) {

                requeridos.push(value.nombre || value)
                input.removeClass("requerido")
            }
        })
    })

    $(`#${father}`).on(`dblclick`, `input.${total}:not(.total)`, (e) => {

        $(e.target).prop('readonly', true).addClass("total").val("")
        let fatherFila = $(e.target).parents("tr")

        $.each(digitos, (indice, value) => {
            let input = $(`input.${value.nombre || value}.ocultoConLugar`, fatherFila)

            if (requeridos.includes(value.nombre || value)) {

                input.addClass("requerido")

            }

            let td = input.parents("td")
            let unid = td.attr("unidOculta")

            input.removeClass("ocultoConLugar")
            td.attr("unidadmedida", unid)
        })
    })

    if ($(`#${father} input._id`).val() != "") {
        let obj = {
            true: 0,
            false: 1
        }

        let totales = $(`#${father} tr:not(:last-child) input.${total}.total`)

        $.each(totales, (indice, value) => {
            let fatherFil = $(value).parents("tr")
            let vacio = 0

            $.each(digitos.slice(1), (ind, val) => {


                vacio += obj[$(`input.${val.nombre || val}`, fatherFil).val() == ""]
            })

            if (vacio == 0 && $(`input.${total}`, fatherFil).val().length > 1) {

                $.each(digitos, (indice, value) => {

                    $(`td[unidadmedida] input.${value.nombre || value}`, fatherFil).addClass("ocultoConLugar")
                    let td = $(`input.${value.nombre || value}`, fatherFil).parents("td")
                    let unid = td.attr("unidadmedida")
                    td.attr("unidOculta", unid).removeAttr("unidadmedida")

                })
            }
        })
    }
}
//Tipo cambio Parche medio de pagos
function medioDePagoTC(objeto, numeroForm) {

    function equivalenciaTC(e) {

        let fila = $(e.target).parents("tr")
        let tc = stringANumero($(`input.tipoCambioTipoPago`, fila).val())
        let valor = stringANumero($(`input.importeTipoPago`, fila).val())
        $(`input.importeValidador`, fila).val(valor * tc).trigger("input")
    }

    $(`#t${numeroForm}`).on(`input`, `input.importeTipoPago, input.tipoCambioTipoPago`, equivalenciaTC)
}
function tipoCabioGralAColec(objeto, numeroForm) {

    let tipoCambioGralPrev = ""

    function autoCompletarTc(e) {

        let monedaGral = $(`#t${numeroForm} .inputSelect.moneda`).val()
        let tipoCambioGral = $(`#t${numeroForm} input.tipoCambio`).val()
        let tipoCambioColect = $(`#t${numeroForm} input.tipoCambioTipoPago`)

        $.each(tipoCambioColect, (indice, value) => {

            let fatherFila = $(value).parents(`tr`)
            let valorTCFila = $(value).val()
            let monedaColec = $(`.inputSelect.monedaTipoPago`, fatherFila).val()

            if ((monedaGral == monedaColec) && (valorTCFila == tipoCambioGralPrev || valorTCFila == "")) {

                $(`input.tipoCambioTipoPago`, fatherFila).val(tipoCambioGral).trigger("input").trigger("blur")
            }
        })

        tipoCambioGralPrev = tipoCambioGral
    }

    $(`#t${numeroForm}`).on(`input`, `input.tipoCambio`, autoCompletarTc)

    function monedaYTcInicial(e) {

        let monedaGral = $(`#t${numeroForm} .inputSelect.moneda`).val()
        let tipoCambioGral = $(`#t${numeroForm} input.tipoCambio`).val()
        let tr = $(e.target).parents(`tr`)
        $(`.inputSelect.monedaTipoPago`, tr).val(monedaGral).trigger("change")
        $(`input.tipoCambioTipoPago`, tr).val(tipoCambioGral).trigger("input")
    }
    $(`#t${numeroForm}`).on(`dblclick`, `.compuestoMedioPagos  input.position`, monedaYTcInicial)
}
function signosImporteSignos(objeto, numeroForm) {

    $.each(objeto?.formInd?.moneda?.coleccion, (indice, value) => {

        let monedaColec = $(`#t${numeroForm} .inputSelect.${value.nombre || value || "moneda"}`)

        $.each(monedaColec, (ind, val) => {

            let moneda = $(val).val()
            let fatherColeccion = $(val).parents("tr")

            if (fatherColeccion.length == 0) {

                $(`#t${numeroForm} table.${indice} td[moneda]`).attr("moneda", moneda.toLowerCase())

            } else {

                $(`td[moneda]`, fatherColeccion).attr("moneda", moneda.toLowerCase())

                let inputsVariable = $(`#t${numeroForm} table.${indice} tr.totales input.monedaBase:not(.ocultoSiempre)`)

                $.each(inputsVariable, (indice, value) => {

                    $(value).parents(`td`).attr("moneda", moneda.toLowerCase())
                })
            }
        })
    })

    let monedaGral = $(`#t${numeroForm} .inputSelect.${objeto?.atributos?.moneda?.nombre || objeto?.atributos?.moneda || "moneda"}`).val()
    $(`#t${numeroForm} div.fo input.monedaBase`).parents(`div.fo`).attr(`moneda`, monedaGral?.toLowerCase())

}
async function obtenerUltimasCotizaciones(moneda) {

    try {

        const response = await fetch(`/get?base=cotizacionMonedaExtranjera&filtros=${JSON.stringify({ moneda: moneda })}&limite=1&sort=fecha:-1`);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const data = await response.json();

        $.each(data?.[0]?.moneda, (indice, value) => {

            let m = consultaPestanas.moneda[value];

            let cotizacion = data[0].cotizacion[indice];

            cotizacionesMoneda[m._id] = cotizacion;

        });

        return cotizacionesMoneda[moneda] || 1; // <-- Esto ahora sí retorna
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
}
function atributoSaldoAbm(objeto, numeroForm, atributo, atributoSaldo) {

    const saldo = (e) => {

        let registros = $(`#t${numeroForm} .tr.fila:visible`)
        let filtros = $(`#bf${numeroForm} .inputSelect.condicionSaldo`)
        let filtrosVacios = filtros.filter(function () {
            return $(this).val().trim() == "";
        });

        let saldo = stringANumero($(`#bf${numeroForm} div.saldoInicial`).html() || 0)
        if (filtrosVacios.length > 0) {

            $(`.celda.${atributo}`, registros).html("")
        } else {
            $.each(registros, (indice, value) => {

                saldo += Number(stringANumero($(`.celda.${atributoSaldo}`, value).html() || 0))
                $(`.celda.${atributo}`, value).html(numeroAString(saldo) || "")
            })
        }

        $(`#bf${numeroForm} div.saldoFinal`).html(numeroAString(saldo) || "")
    }

    $(`#bf${numeroForm}`).on("contenidoCambiado", `div.saldoInicial`, saldo);
    $(`#t${numeroForm} .inputTd.${atributo} input`).addClass("ocultoSiempre").removeClass("monedaBase")
    $(`#t${numeroForm} .inputTd.${atributo}`).removeAttr("moneda")
}
//Cotización Reporte
function monedaCotis(objeto, numeroForm) {

    let valor = $(`#bf${numeroForm} .inputSelect.moneda`).val()

    if (valor == "Todas") {

        return { moneda: "" }
    } else {

        return {
            moneda: [valor]
        }
    }
}
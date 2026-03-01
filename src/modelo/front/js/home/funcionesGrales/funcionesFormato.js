
function verificarCadena(cadena) {
    return /\.\d{3}$/.test(cadena);
}
function stringANumero(importeNum) {

    let numNum = Number(importeNum)

    if (isNaN(numNum) || verificarCadena(importeNum)) {

        let importeFormt = (importeNum || "")?.replace(/[^0-9,-]/g, "");
        let importe = importeFormt?.replace(",", ".");  // Convertimos decimal a formato JS

        return Number(importe)

    } else {

        return numNum;
    }
}
//Usado para cuando hace focus convertir string a numero nombre formato superador de mil
function sacarPuntos(e) {

    $(e.target).val(e.target.value.replaceAll(".", "").replaceAll(",", "."))

}
function puntoPorComa(e) {

    if (e.key == ".") {
        const input = document.activeElement; // Obtiene el elemento que está enfocado

        const start = input.selectionStart;
        const end = input.selectionEnd;

        // Inserta la coma en la posición actual del cursor
        const newValue = input.value.substring(0, start - 1) + ',' + input.value.substring(end);

        input.value = newValue;

        // Ajusta la posición del cursor después de la coma
        input.setSelectionRange(start + 1, start + 1);

    }

}
function doc(e) {

    let importeUltimoFormato = formatoTipeo(e)

    $(e.target).val(importeUltimoFormato || 0)

}
function docCuatroDec(e) {

    let importeUltimoFormato = formatoTipeoCuatroDec(e)
    $(e.target).val(importeUltimoFormato)
}
function formatoNumeroSepMil(numeroForm, elemento) {

    $(`#t${numeroForm}`).on("focus", elemento, sacarPuntos);
    $(`#t${numeroForm}`).on("input", elemento, puntoPorComa);
    $(`#t${numeroForm}`).on("blur", elemento, doc);
}
function formatoNumeroSepMilCuatroDec(numeroForm, elemento) {

    $(`#t${numeroForm}`).on("focus", elemento, sacarPuntos);
    $(`#t${numeroForm}`).on("input", elemento, puntoPorComa);
    $(`#t${numeroForm}`).on("blur", elemento, docCuatroDec);
}
///////////////////////
function reemplazarPuntoPorComaSinTip(impor) {

    let importe = impor?.toString()
    let ultimoCaracter = importe?.slice(-1)

    if (ultimoCaracter == ".") {

        return importe.includes(",") ? importe.slice(0, -1) : importe.slice(0, -1) + ","

    } else {

        return importe?.includes(".") ? importe?.replace(`.`, `,`) : importe
    }
}
function separadorDeMilNumero(importeSinPunto, e) {

    importeSinPunto?.replaceAll(",,", ",")
    let importe = importeSinPunto == "" ? "" : new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(importeSinPunto?.replace(",", "."));

    return importe
}
function separadorDeMilNumeroDosDec(importeSinPunto, e) {

    importeSinPunto?.replaceAll(",,", ",")
    let importe = importeSinPunto == "" ? "" : new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(importeSinPunto?.replace(",", "."));

    return importe
}
function separadorDeMilNumeroCuatroDec(importeSinPunto, e) {

    let imp = importeSinPunto.replaceAll(".", "").replace(/,{2,}/g, ",")
    let importeC = imp.replace(",", ".")
    let posicionComa = Math.min(4, imp.length - imp.indexOf(","))
    let importe = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 4 },).format(importeC)

    let respuestaObjeto = {

        1: (importeSinPunto != "") ? importeSinPunto.replaceAll(",,", ",") : "",
        2: (importeSinPunto.slice(-1) == 0) && (importeSinPunto.includes(`, `)) ? importe + ",0" : importe,
        3: (importeSinPunto.slice(-2) == "00") && (importeSinPunto.includes(`, `)) ? importe + ",00" : importe,
        4: importe
    }

    return respuestaObjeto[posicionComa]
}
function numeroAString(impor) {

    let importe = reemplazarPuntoPorComaSinTip(impor)
    let numeroDef = separadorDeMilNumero(importe)

    return numeroDef
}
function numeroAStringCom(impor) {

    let importe = reemplazarPuntoPorComaSinTip(impor)
    let numeroDef = separadorDeMilNumeroDosDec(importe)

    return numeroDef
}
function numeroAStringCuatroDec(impor) {

    let importe = reemplazarPuntoPorComaSinTip(impor)
    let numeroDef = separadorDeMilNumeroCuatroDec(importe)

    return numeroDef || ""
}
//Formato sobre string
function primeraLetraMayuscula(objeto, numeroForm, atributos) {

    let match = /\s[^'\s]/
    const mayuscula = function (e) {

        let mayus = ""

        if (match.test(e.target.value)) {

            let words = e.target.value.trim().split(" ")
            let may = ""

            $.each(words, (indice, value) => {

                may += value[0].toUpperCase() + value.slice(1) + " "

            })
            mayus = may.slice(0, -1)

        } else {
            mayus = e.target.value[0].toUpperCase() + e.target.value.slice(1)
        }

        $(e.target).val(mayus.trim())
    }

    $(`#t${numeroForm}`).on("input", `input.primeraMayuscula`, mayuscula);


}
function palabraMayuscula(objeto, numeroForm, atributos) {
    let father = fatherId(objeto, numeroForm)

    const mayusculaPalabra = (e) => {

        let valor = e.target.value

        $(e.target).val(valor.toUpperCase())

    }

    $.each(atributos, (indice, value) => {
        $(`#${father}`).on("input", `input.${value.nombre}`, mayusculaPalabra);
    })
}
function primeraLetraMayusculaString(palabra) {

    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
}
function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}
function NumeroALetras(moneda, num, centavos) {

    function Unidades(num) {

        switch (num) {
            case 1: return "UN";
            case 2: return "DOS";
            case 3: return "TRES";
            case 4: return "CUATRO";
            case 5: return "CINCO";
            case 6: return "SEIS";
            case 7: return "SIETE";
            case 8: return "OCHO";
            case 9: return "NUEVE";
        }

        return "";
    }

    function Decenas(num) {

        decena = Math.floor(num / 10);
        unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0: return "DIEZ";
                    case 1: return "ONCE";
                    case 2: return "DOCE";
                    case 3: return "TRECE";
                    case 4: return "CATORCE";
                    case 5: return "QUINCE";
                    default: return "DIECI" + Unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0: return "VEINTE";
                    default: return "VEINTI" + Unidades(unidad);
                }
            case 3: return DecenasY("TREINTA", unidad);
            case 4: return DecenasY("CUARENTA", unidad);
            case 5: return DecenasY("CINCUENTA", unidad);
            case 6: return DecenasY("SESENTA", unidad);
            case 7: return DecenasY("SETENTA", unidad);
            case 8: return DecenasY("OCHENTA", unidad);
            case 9: return DecenasY("NOVENTA", unidad);
            case 0: return Unidades(unidad);
        }
    }//Unidades()

    function DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + " Y " + Unidades(numUnidades)

        return strSin;
    }//DecenasY()

    function Centenas(num) {

        centenas = Math.floor(num / 100);
        decenas = num - (centenas * 100);

        switch (centenas) {
            case 1:
                if (decenas > 0)
                    return "CIENTO " + Decenas(decenas);
                return "CIEN";
            case 2: return "DOSCIENTOS " + Decenas(decenas);
            case 3: return "TRESCIENTOS " + Decenas(decenas);
            case 4: return "CUATROCIENTOS " + Decenas(decenas);
            case 5: return "QUINIENTOS " + Decenas(decenas);
            case 6: return "SEISCIENTOS " + Decenas(decenas);
            case 7: return "SETECIENTOS " + Decenas(decenas);
            case 8: return "OCHOCIENTOS " + Decenas(decenas);
            case 9: return "NOVECIENTOS " + Decenas(decenas);
        }

        return Decenas(decenas);
    }//Centenas()

    function Seccion(num, divisor, strSingular, strPlural) {
        cientos = Math.floor(num / divisor)
        resto = num - (cientos * divisor)

        letras = "";

        if (cientos > 0)
            if (cientos > 1)
                letras = Centenas(cientos) + " " + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += "";

        return letras;
    }//Seccion()

    function Miles(num) {
        divisor = 1000;
        cientos = Math.floor(num / divisor)
        resto = num - (cientos * divisor)

        strMiles = Seccion(num, divisor, "MIL", "MIL");
        strCentenas = Centenas(resto);

        if (strMiles == "")
            return strCentenas;

        return strMiles + " " + strCentenas;

        //return Seccion(num, divisor, "UN MIL", "MIL") + " " + Centenas(resto);
    }//Miles()

    function Millones(num) {
        divisor = 1000000;
        cientos = Math.floor(num / divisor)
        resto = num - (cientos * divisor)

        strMillones = Seccion(num, divisor, "UN MILLON", "MILLONES");
        strMiles = Miles(resto);

        if (strMillones == "")
            return strMiles;

        return strMillones + " " + strMiles;

        //return Seccion(num, divisor, "UN MILLON", "MILLONES") + " " + Miles(resto);
    }//Millones()

    let data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: "",
    };
    if (centavos == undefined || centavos == false) {
        data.letrasMonedaPlural = `${moneda}`;
        data.letrasMonedaSingular = `${moneda}`;
    } else {
        data.letrasMonedaPlural = "CENTAVOS";
        data.letrasMonedaSingular = "CENTAVOS";
    }


    if (data.centavos > 0)
        data.letrasCentavos = "CON " + Millones(data.centavos) + " CENTAVOS";

    if (data.enteros == 0)
        return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
        return Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
    else
        return Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
}
function textoCentrado(objeto, numeroForm, atributos) {

    $.each(atributos, (indice, value) => {

        $(`#t${numeroForm} input.${value.nombre || value}`).addClass(`textoCentrado`)
        $(`#t${numeroForm} .celda.${value.nombre || value}`).addClass(`textoCentrado`)
    })

}
/////
function formatoTipeo(e) {

    let imp = (Number(e.target.value) || 0).toString();

    let importeC = imp.replace(",", ".")
    let posicionComa = Math.min(4, imp.length - imp.indexOf(","))
    let importe = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 },).format(importeC)

    let respuestaObjeto = {

        1: (imp != "") ? imp.replaceAll(",,", ",") : "",
        2: (imp.slice(-1) == 0) && (imp.includes(`,`)) ? importe + ",0" : importe,
        3: (imp.slice(-2) == "00") && (imp.includes(`,`)) ? importe + ",00" : importe,
        4: importe
    }

    return respuestaObjeto[posicionComa]
}
function formatoTipeoCuatroDec(e) {

    let imp = e.target.value
    let importeC = imp.replace(",", ".")
    //let posicionComa = Math.min(4, imp.length - imp.indexOf(","))
    let importe = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 4 },).format(importeC)

    /*let respuestaObjeto = {
 
        1: (imp != "") ? imp.replaceAll(",,", ",") : "",
        2: (imp.slice(-1) == 0) && (imp.includes(`,`)) ? importe + ",0" : importe,
        3: (imp.slice(-2) == "00") && (imp.includes(`,`)) ? importe + ",00" : importe,
        4: importe
    }*/
    return importe
    //return respuestaObjeto[posicionComa]
}
///Formato especificos
function formatoNumeroFactura(objeto, numeroForm, atributos) {

    let father = fatherId(objeto, numeroForm)

    const numeroFac = (e) => {

        let numero = e.target.value
        $(e.target).val(formatoNumeroFacturaReturn(numero))

        $(`#${father} div.fo.${atributos.nombre} p`).html(formatoNumeroFacturaReturn(numero))
    }

    $.each(atributos, (indice, value) => {
        $(`#${father}`).on("change", `input.${value.nombre}`, numeroFac);
    })
}
function formatoNumeroFacturaReturn(num) {

    let numero = num.toString()
    let split = 0;

    while (parseFloat(numero[split]) == 0) {
        split++;
    }
    let numeroDef = numero.slice(split)
    let numeroLength = numeroDef.length

    return ("0".repeat((8 - numeroLength))) + numeroDef

}
function formatoDosNumero(num) {

    return ("0" + num).slice(-2)
}
function transformarNumeroAntesEnviar(numeroForm) {

    let numero = $(`#t${numeroForm} input.formatoNumero`)

    $.each(numero, (indice, value) => {

        $(value).val(stringANumero($(value).val()))

    })
}
//Formato hora minutos
function transformarNumerosaHora(objeto, numeroForm) {
    const quitarHyM = (e) => {

        $(e.target).val(e.target.value.replaceAll("h ", ":").replaceAll("m", "")).addClass("transformandoNumerHor")

    }
    const numeroHora = (e) => {

        let numero = e?.target?.value

        let hora = ""
        let minutos = ""
        let formatoHora = numero.toString()?.includes(":")

        if (formatoHora) {

            let split = numero.split(":")
            hora = parseFloat(split[0])
            minutos = parseFloat(split[1])

            if (minutos > 59) {

                let horasenMinutos = (parseFloat(minutos) / 60).toFixed(2)
                let [entero, decimal] = horasenMinutos.toString().split(".");

                hora = `${hora + parseFloat(entero)}h`
                minutos = `${parseFloat((60 * (horasenMinutos - entero)).toFixed(0))}m`

            } else {
                hora = `${hora}h`
                minutos = `${minutos}m`
            }

        } else {

            if (numero > 59) {

                let horasenMinutos = (parseFloat(numero) / 60).toFixed(2)
                let [entero, decimal] = horasenMinutos.toString().split(".");

                minutos = `${(60 * (horasenMinutos - entero)).toFixed(0)}m`
                hora = `${entero}h`

            } else {


                if (numero > 0) {
                    hora = "00h"
                    minutos = `${numero}m`
                } else {
                    hora = ""
                    minutos = ""
                }
            }

        }

        $(e.target).val(`${hora} ${minutos}`).removeClass("transformandoNumerHor").trigger("blur")

    }
    $(`#t${numeroForm}`).on(`focus`, `input.horaMinutos`, quitarHyM)
    $(`#t${numeroForm}`).on(`blur`, `input.horaMinutos.transformandoNumerHor`, numeroHora)

}
function minutosAHoraMinutos(numero) {

    let hora = ""
    let minutos = ""

    if (numero > 59) {

        let horasenMinutos = (parseFloat(numero) / 60).toFixed(2)
        let [entero, decimal] = horasenMinutos.toString().split(".");

        minutos = `${(60 * (horasenMinutos - entero)).toFixed(0)}m`
        hora = `${entero}h`

    } else {

        if (numero > 0) {
            hora = "00h"
            minutos = `${numero}m`
        } else {
            hora = ""
            minutos = ""
        }
    }

    return `${hora} ${minutos}`
}
function horasAMinutos(time) {

    let totalMinutos = 0
    let [hora, minutos] = (time || '0h 0m').replace("m", "").split("h");
    totalMinutos = (Number(minutos) || 0) + (Number(hora) * 60 || 0);


    return totalMinutos

}
//funciones formato
function funcionesFormato(objeto, numeroForm) {

    formatoNumeroSepMilCuatroDec(numeroForm, "input.formatoNumero.cuatroDec")
    formatoNumeroSepMil(numeroForm, "input.formatoNumero:not(.cuatroDec)")

}
function formatoDocumento(objeto, numeroForm, atributo) {

    function formatoDni(e) {

        let ingreso = e.target.value
        ingreso = e.target.value.replaceAll(".", "");
        const length = ingreso.toString().length

        if (length == 11) {

            let ultimoDigito = ingreso.toString().slice(-1)
            let primerosDos = ingreso.toString().slice(0, 2)
            let igresoCortado = ingreso.toString().slice(2, -1)

            $(e.target).val(`${primerosDos}-${igresoCortado}-${ultimoDigito}`)

        } else {
            let dni = ingreso

            if (!isNaN(ingreso)) {
                dni = new Intl.NumberFormat("de-DE").format(ingreso) || ""

            }
            $(e.target).val(dni)
        }
    }
    $(`#t${numeroForm}`).on("blur", `input.${atributo}`, formatoDni);
}
function formatoTelefono(objeto, numeroForm, atributo) {
    function formatoTel(e) {
        let ingreso = e.target.value.trim();

        // limpio caracteres raros
        ingreso = ingreso.replaceAll("-", "");
        ingreso = ingreso.replace(/\s+/g, "");
        ingreso = ingreso.replace(/^0+/, "");

        let prefijo, resto;

        if (ingreso.startsWith("11")) {

            prefijo = "11";
            resto = ingreso.slice(2);
        } else {
            prefijo = ingreso.slice(0, 4);
            resto = ingreso.slice(4);
        }
        let formatted = `${prefijo} ${resto}`;

        if (resto.length > 4) {
            formatted = `${prefijo} ${resto.slice(0, resto.length - 4)}-${resto.slice(-4)}`;
        }

        $(e.target).val(formatted);
    }

    $(`#t${numeroForm}`).on("blur", `input.${atributo}`, formatoTel);
}

function formatoFacturas(objeto, numeroForm, atributo) {
    function formatoFactura(e) {
        let ingreso = e.target.value.trim();

        ingreso = ingreso.replaceAll("-", " ");
        ingreso = ingreso.replace(/\s+/g, " ");

        if (/^\d+(\s\d+)?$/.test(ingreso)) {
            let prefijo = "";
            let resto = "";

            if (ingreso.includes(" ")) {
                // Caso: usuario puso separador (espacio o guion)
                let partes = ingreso.split(" ");
                let partePrefijo = partes[0] || "";
                let parteResto = partes[1] || "";

                prefijo = partePrefijo.padStart(4, "0");
                resto = parteResto.padStart(8, "0");
            } else {
                // Caso: número corrido
                if (ingreso.length <= 8) {
                    resto = ingreso.padStart(8, "0");
                    prefijo = "0000";
                } else {
                    let partePrefijo = ingreso.slice(0, ingreso.length - 8);
                    let parteResto = ingreso.slice(-8);

                    prefijo = partePrefijo.padStart(4, "0");
                    resto = parteResto.padStart(8, "0");
                }
            }

            $(e.target).val(`${prefijo} ${resto}`);
        } else {
            // No es válido → lo dejo como está
            $(e.target).val(e.target.value);
        }
    }
    $(`#t${numeroForm}`).on("blur", `input.${atributo}`, formatoFactura);
}
const operacionesMath = {
    resta: function restar(...nums) {
        return nums.reduce((acc, val) => acc - val);
    }
}
function coloresOpc(objeto, numeroForm) {

    function colores(e) {

        let valor = $(e.target).val()
        if (valor != "") {
            $(`#t${numeroForm} .selectCont.colores .selectInput`).attr("color", valor)
        }
    }

    $(`#t${numeroForm}`).on("change", `.selectCont.colores .inputSelect`, colores)

    $(`#t${numeroForm} .selectCont.colores .inputSelect`).trigger("change")


}
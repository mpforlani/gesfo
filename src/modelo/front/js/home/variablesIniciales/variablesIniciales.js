let servidor = "";
let contador = 0; //Contador para definir Id de cada pestaña
let usu = $("#oculto").val();
let usuarioCompleto = ""
let losInput = false;
let tipoCambioVigentes = new Object
let fechaDesde = addDay(Date.now(), 0, -1, 0, `y-m-d`)
let fechaHasta = dateNowAFechaddmmyyyy(Date.now(), `y-m-d`);
let tipoDeCambioDefault = "oficial"//ESto es utiliza para que en el file MonedasTotales.js en la funcion totalesBaseYMoneda, donde se determina el tipo de cambio poner oficial, blue en estes caso tiene tantos tipos de cambio que no pone nada
const fondoImpresion = {
    fondoUno: "/img/fondoImpresion/fondoImpresionUno.jpg"
}
let valoresInicialesApp = {
    tc: ""
}
let entidadesConsultas = new Object//ESta se usa para ver si hago ciertas funciones o caracterista de la entidad por unica vez la primera vez que la cosulto
let consultaPestanas = new Object; //Guardo todas las consultas pestanas que hago
let consultaPestanasConOrden = new Object; //Al no poner el id como key, entonces despues siempre termina ordenando en forma alfabetica del id
let pestanaHeight = ""//se usa en crear abm y crear formulario
let comHeigth = new Object//se usa en crear abm y crear formulario
let inverlos = new Object//Se usa en  la progress bar
let positionObject = new Object
let progressBarActive = new Object
let cotizacionesMoneda = new Object//Aca guardo las cotizacioens de tipo de cambio
let entidadesEmail = new Object
let empresaSeleccionada = "";
let empresaFiltro = new Object
let tareasProgramadasModulo = new Object
let campanaPendiente = []

/// valoresInciales 
$(`#fechaTextoDe`).val(fechaDesde)
$(`#fechaTextoHasta`).val(fechaHasta)
///////////////////////////////////////////////////

function getFileExtension(filename) {
    return filename.split('.').pop();
}
function funcionCerrar(self) {

    const navSup = {
        1: $(`.navegacionSupHomeLog`)
    }

    let id = $(self).attr("id"); //atrapo id de la que estoy cerrando
    let cl = $(self).parents("div.pestana"); //pestaá de la que estoy cerrando
    let cla = cl.prev(); //Atrapo pesatña anterior de la que estoy cerrando
    let idPrevio = $(cla).attr("id")
    let clav = cl.next(); //Atrapo pesatña poesterior de la que estoy cerrando
    let idNext = $(clav).attr("id")
    let clase = cl.attr("class"); //atrapo clase de la pestaña selecconada
    let links = $('.tabs_links div.pestana'); //Atrapado todas las pestañas
    let linksIdfirst = $(links[0]).attr("id"); //Selecciona y limpio el id de la primera pestaña

    if ((clase === "pestana active") && (`p${id}` != linksIdfirst)) {

        let idpr = idPrevio.slice(1)

        $(`#${id},
            #p${id},
            #bf${id},
            #t${id}`).addClass("removiendo");
        delete positionObject[id]

        setTimeout(() => {

            cla.addClass('active');
            $(`#t${idpr},
               #bf${idpr}`).addClass('active');

            $(`.cartelHistorial.${idpr}`).removeClass("oculto")

            $(`#${id},
               #p${id},
               #bf${id},
               #t${id}`).remove();

            borrarTriggerRelacionados(id)

        }, 200);


        //Si la tabla selecciona tiene clase active es igual a la primeta asigno active a la de derecha
    } else if ((clase == "pestana active") && links.length > 1) {

        let idnx = idNext.slice(1)

        $(`#${id},
            #p${id},
            #bf${id},
            #t${id},
            .tabs_contents_item.${id}`).addClass("removiendo");
        delete positionObject[id]

        setTimeout(() => {

            clav.addClass('active');
            $(`#bf${idnx}`).addClass('active');
            $(`#t${idnx}`).addClass('active');
            $(`.cartelHistorial.${idnx}`).removeClass("oculto")

            $(`#${id},
               #p${id},
               #bf${id},
               #t${id}`).remove();
            borrarTriggerRelacionados(id)

        }, 200);


        //si no tiene active elimino tabla sin afectar el active 
    } else {
        console.log(3)

        delete positionObject[id]

        $(`#${id},
           #p${id},
           #bf${id},
           #t${id}`).remove();
        borrarTriggerRelacionados(id)
    }

    delete consultaGet?.[id]
    navSup?.[links.length]?.removeClass("oculto ocultable")

    $(`.cartelHistorial.${id}`).remove()
    $(`.cartelEliminar.${id}`).remove()

}
////////////////ESCRITORIO///////////////
///CAJA Y BANCOS////
function numerosNegativos() {
    let ars = $(`.arsHome`);

    $.each(ars, function (indice, value) {
        Math.sign(value)
    })
}
function signoAlternativa(objeto, numeroForm) {

    $.each(objeto.atributos?.importe?.importePesos, (indice, value) => {

        $(`#t${numeroForm} td.${value.nombre}`).attr(`moneda`, `Pesos`)
    })

    $.each(objeto.atributos?.importe?.importeUsd, (indice, value) => {

        $(`#t${numeroForm} td.${value.nombre}`).attr(`moneda`, `Dolar`)
    })
}
function fatherId(objeto, numeroForm) {

    let id = $(`.formulario${objeto.accion}${numeroForm}`).attr("id") || $(`.tabs_contents_item.${numeroForm}`).attr("id")

    return id

}
function getValorDeAtributo(objeto, numeroForm, atributo) {//dic

    atributo = valoresInicialesApp[atributo]

    return atributo
}
async function usuarios() {

    try {
        const res = await fetch(`/get?base=user`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data = await res.json();

        consultaPestanas.username = {};
        consultaPestanas.usuario = {};

        data.forEach(value => {
            consultaPestanas.username[value._id] = value;
            consultaPestanas.usuario[value._id] = value;
        });

    } catch (error) {
        console.log(error);
        throw error;
    }

}
function adicionarCaracteristicaAtributos(objeto, numeroForm, value) {//doc

    $.each(value.funcion, (ind, val) => {

        switch (val.lugar) {
            case "inicio":

                $.extend(true, objeto.funcionesPropias, { [val?.lugar]: { [val.nombre]: [val.func] } });

                break;
            case "validarAlConfirmar":

                $.extend(true, objeto.funcionesPropias, { [val?.lugar]: { [val.nombre]: val.func } });

                break;
            case "coleccionFormIndividual":

                $.extend(true, objeto.funcionesPropias, { [val?.lugar]: { [value.nombre]: { [val.nombre]: [val.func] } } });

                break;
            case undefined://Este lo dejo porque los nmeradores tienen funciones y no corresopnde que hagan nada

                break;
            default:

                $.extend(true, objeto, { funcionesPropias: { [val?.lugar]: { [val.nombre]: [val.func] } } });

                $.each(val?.atributos, (i, v) => {

                    objeto.funcionesPropias[val?.lugar][val.nombre].push(v)

                })
                break;
        }
    })
    $.each(value.valoresIniciales, (ind, val) => {

        switch (ind) {
            case "string":
                $.extend(true, objeto.atributos, { valoresIniciales: { string: { [value.nombre]: val } } });
                break;
            case "stringEntidad":
                $.extend(true, objeto.atributos, { valoresIniciales: { string: { [value.nombre]: objeto.pest } } });
                break;
            case "coleccionFirst":
                $.extend(true, objeto.atributos, { valoresIniciales: { coleccionFirst: { [value.nombre]: { valor: val, coleccion: colecNombre } } } });
                break;
            case "coleccion":

                $.extend(true, objeto.atributos, { valoresIniciales: { coleccion: { [val.nombre]: { funcion: [val.funcion], coleccion: value.nombre } } } });

                $.each(val.atributos, (i, v) => {
                    objeto.atributos.valoresIniciales.coleccion[val.nombre].funcion.push(v)
                })

                break;
            case "funcion":
                $.extend(true, objeto.atributos, { valoresIniciales: { funcion: { [value.nombre]: val } } });
                break;
            case "select":
                $.extend(true, objeto.atributos, { valoresIniciales: { select: { [value.nombre]: val } } });
                break;
        }
    })

    $.each(value.totalizadores, (indice, value) => {

        $.extend(true, objeto, { totalizadores: { [indice]: value } });
    })

}
function unWindJavaScript(objeto, valoresEnviado, desencadena) {
    let compuesto = desencadena.coleccionOrigen
    let objetoPlanchado = new Object
    let lengthTotal = valoresEnviado[`position${compuesto.nombre}`].length

    for (let x = 0; x < lengthTotal; x++) {

        objetoPlanchado[x] = { ...valoresEnviado }
        objetoPlanchado[x].indiceArray = x

        for (const [clave, valor] of Object.entries(compuesto.componentes)) {
            if (valor instanceof Importe) {
                objetoPlanchado[x][clave] = valoresEnviado?.[clave]?.[x] || ""
                objetoPlanchado[x][`${clave}mb`] = valoresEnviado?.[`${clave}mb`]?.[x] || ""
                objetoPlanchado[x][`${clave}ma`] = valoresEnviado?.[`${clave}ma`]?.[x] || ""

            } else {
                objetoPlanchado[x][clave] = valoresEnviado?.[clave]?.[x] || ""
            }
        }

        objetoPlanchado[x][`position${compuesto.nombre}`] = valoresEnviado?.[`position${compuesto.nombre}`]?.[x] || ""
    }


    return objetoPlanchado
}
function encontraKeyPorValor(object, atributo, value) {

    return Object.keys(object).find(key => object[key][atributo] == value);
}
function agregarIdDesenCompononentesObjetos(objeto, coleccionesObjeto) { //Esta función se utilza porque si una colección tiene desdencadenate, child o imputaciones desde colecciones crear un id por cada uno de ellos
    //La coleccion externa lo hace porque al momento de crear un objeto, se fija si la colección que esta armando tiene desencadenates  o child 
    //18/11 Lo tiene que generar siempre el id por las modificaciones del historial
    let atributosdelCompuesto = { ...coleccionesObjeto.componentes }

    $.each(objeto.desencadenaColeccion, (ind, val) => {

        if ((coleccionesObjeto.nombre || coleccionesObjeto) == (val.coleccionOrigen.nombre || val.coleccionOrigen)) {

            atributosdelCompuesto[`destino${val.identificador}`] = T({ nombre: `destino${val.identificador}`, oculto: "oculto" })
            atributosdelCompuesto[`idCol${val.identificador}`] = T({ nombre: `idCol${val.identificador}`, oculto: "oculto" })

            if (val.opciones != undefined) {

                $.extend(true, objeto, { funcionesPropias: { formularioIndiv: { atributoLimpiaDesencadenante: [atributoLimpiaDesencadenante, val] } } });

            }
        }
    })
    $.each(objeto.desencadenaColeccionAgrupado, (ind, val) => {

        if ((coleccionesObjeto.nombre || coleccionesObjeto) == (val.coleccionOrigen.nombre || val.coleccionOrigen)) {

            atributosdelCompuesto[`destino${val.identificador}`] = T({ nombre: `destino${val.identificador}`, oculto: "oculto" })
            atributosdelCompuesto[`idCol${val.identificador}`] = T({ nombre: `idCol${val.identificador}`, oculto: "oculto" })

            if (val.opciones != undefined || val.atributosMain != undefined) {

                $.extend(true, objeto, { funcionesPropias: { formularioIndiv: { atributoLimpiaDesencadenante: [atributoLimpiaDesencadenante, val] } } });

            }
        }
    })
    $.each(objeto.childColeccion, (ind, val) => {

        if ((coleccionesObjeto.nombre || coleccionesObjeto) == (val.coleccionOrigen.nombre || val.coleccionOrigen)) {

            atributosdelCompuesto[`destino${val.identificador}`] = T({ nombre: `destino${val.identificador}`, oculto: "oculto" })
            atributosdelCompuesto[`idCol${val.identificador}`] = T({ nombre: `idCol${val.identificador}`, oculto: "oculto" })

            if (val.opciones != undefined) {

                $.extend(true, objeto, { funcionesPropias: { formularioIndiv: { atributoLimpiaDesencadenante: [atributoLimpiaDesencadenante, val] } } });

            }
        }
    })

    $.each(objeto.imputarcoleccion, (ind, val) => {

        if ((coleccionesObjeto.nombre || coleccionDesen) == val.coleccionOrigen.nombre) {

            atributosdelCompuesto[`destino${val.identificador}`] = T({ nombre: `destino${val.identificador}`, oculto: "oculto" })
            atributosdelCompuesto[`idCol${val.identificador}`] = T({ nombre: `idCol${val.identificador}`, oculto: "oculto" })
        }
    })

    return atributosdelCompuesto
}
function ordenarObjetoPestana(objeto) {

    const arrayObjeto = Object.entries(consultaPestanas[objeto.accion]);

    let atributoOrden = variablesModelo[objeto.accion]?.ordenEnPestana
    const objetoOrdenado = new Object
    arrayObjeto.sort((a, b) => a[1][atributoOrden?.nombre || "name"].localeCompare(b[1][atributoOrden?.nombre || "name"]))

    $.each(arrayObjeto, (indice, value) => {

        objetoOrdenado[value[0]] = value[1]
    })
    delete consultaPestanas[objeto.accion]
    consultaPestanas[objeto.accion] = objetoOrdenado

}
function crearCortinaNegra() {

    let cortina = `<div id="cortinaNegra"></div>`
    $(cortina).appendTo(`body`)
}
function active(numeroForm) {
    // $(`.tabs_contents_item`).removeClass("saliendo")
    $(`#p${numeroForm},
       #bf${numeroForm},
       #de${numeroForm},
       #t${numeroForm}`).siblings().removeClass("active");
    $(`#bf${numeroForm}`).addClass("active");

}
//////Modficación creación objetos
function reemplazoAtributo(array, names, posicion, deleteItem, objeto) {

    let arrayNuevo = (array || []).slice()

    if (names != undefined) {
        arrayNuevo = [...array || []]
        $.each(names, (indice, value) => {

            const pos = posicion?.[indice] ?? arrayNuevo.length;
            const del = deleteItem?.[indice] ?? 0;
            // *** CLAVE: operar sobre la copia acumulada ***
            arrayNuevo = arrayNuevo.toSpliced(pos, del, value);
        })
    } else if (array != undefined) {
        arrayNuevo = [...array || []]
    }

    return arrayNuevo
}
function cambiarTituloObjetoModelo(objeto, titulos) {

    $.each(titulos, (indice, value) => {

        let index = objeto.atributos.titulos.indexOf(indice)
        objeto.atributos.titulos[index] = value

        let indexInd = objeto?.formInd?.titulos?.indexOf(indice)
        objeto.formInd.titulos[indexInd] = value
    })

}
function eliminarAtributosEnModelo(atributo, IdObjeto) {

    let objeto = variablesModelo[IdObjeto]
    let index = objeto.atributos.names.indexOf(atributo)

    objeto.atributos.names.splice(index, 1)
    objeto.atributos.titulos.splice(index, 1)
    objeto?.formInd?.titulos?.splice(index, 1)

}
function objetoFusion(entidad, aprobar) {//Cuadno hago inicialmente la fusión de la entidad y aprovación

    let objeto = new Object

    if (variablesIniciales[aprobar] != undefined && variablesModeloTransformar[aprobar] != undefined) {

        objeto = new Aprobacion(objFuc, { ...entidad })

    } else {

        objeto = new Aprobacion((variablesModeloTransformar[aprobar] || variablesIniciales[aprobar]), { ...entidad })

    }

    return objeto
}
function objetoFusionEntidad(id) {//Cuadno hago inicialmente la fusión de la entidad

    let entidad = ""
    let objeto = new Object

    if (variablesIniciales?.entidades?.[id] != undefined && variablesModelo[id] != undefined) {

        entidad = new Entidad(variablesModelo[id], variablesIniciales.entidades?.[id])
        objeto = entidad
    } else {

        entidad = variablesModelo[id] || variablesIniciales?.entidades?.[id]
        objeto = { ...entidad }
    }

    $.each(variablesIniciales?.entidades?.[id]?.funcionDeFusion, (indice, value) => {

        value[0](objeto, ...value[1])

    })

    return objeto
}
function objetoFusionTransformacion(id) {

    let entidad = ""
    let objeto = new Object

    if (variablesInicialesTransformar?.[id] != undefined && variablesModeloTransformar[id] != undefined) {

        entidad = new Entidad(variablesModeloTransformar[id], variablesInicialesTransformar[id])
        objeto = entidad
    } else {

        entidad = variablesModeloTransformar[id] || variablesInicialesTransformar[id]
        objeto = { ...entidad }
    }

    $.each(variablesInicialesTransformar?.[id]?.funcionDeFusion, (indice, value) => {

        value[0](objeto, ...value[1])

    })
    return objeto


}
function eliminarocultoAtributo(objeto, numeroForm, atributo) {

    let father = fatherId(objeto, numeroForm)

    $.each(atributo, (indice, value) => {

        $(`#${father} div.${value.nombre || value}`).removeAttr("oculto")

    })
}
///// Solo Lecturas Propio
function soloLecturaSelectInput(father, selector) {

    $(father).on('mousedown', selector, function (event) {
        event.preventDefault();
    });
    $(father).on('keydown', selector, function (event) {

        if (event.key === 'Tab') {

            event.preventDefault();
        }
    });
}
function anularSoloLecturaSelectInput(father, selector) {

    $(father).off('mousedown', selector);
}
function anularSoloLecturaInputDate(father, selector) {

    $(father).off('click', selector);

}
function soloLecturaInputDate(father, selector) {

    $(father).on('click', selector, function (event) {
        event.preventDefault();
    });
}
function noEditarAllForm(objeto, numeroForm) {

    soloLecturaSelectInput($(`#t${numeroForm}`), `select, input`)
    soloLecturaInputDate($(`#t${numeroForm}`), `input[type="date"]`)

}
function anularNoEditarAllForm(objeto, numeroForm) {

    let father = fatherId(objeto, numeroForm)

    anularSoloLecturaSelectInput($(`#${father}`), `select, input`)
    anularSoloLecturaInputDate($(`#${father}`), `input[type="date"]`)

}
function habilitarTodosLosSelectoresDeForm(objeto, numeroForm) {

    $(`input.form:not(.inputPestana),
       input.formLista,
       select,
       textarea,
       table tr:not(:last-child) input:not(.ocultoPestana):not(.inputPestana)`, `#t${numeroForm}`).attr(`disabled`, false);

}
function desHabilitarTodosLosSelectoresDeForm(objeto, numeroForm) {

    $(`input.form:not(.inputPestana),
       input.formLista,
       select,
       textarea,
       table tr:not(:last-child) input:not(.ocultoPestana):not(.inputPestana)`, `#t${numeroForm}`).attr(`disabled`, "disabled");

}
/////trigger propios 
function blurChange(padre, elemento, funcion) {

    let cambio = false;
    $(padre).on("change", elemento, () => {
        cambio = true;
    })
    $(padre).on('blur', elemento, (e) => {
        if (cambio) {
            funcion(e)

            cambio = false;
        }
    });
}
function triggerInput(objeto, numeroForm, input) {

    $.each(input, (indice, value) => {

        $(`#t${numeroForm} input.${value.nombre || value}`).trigger("input").trigger("change")

    })
}
/////Menu en espera
function mouseEnEsperaForm(objeto, numeroForm) {

    $(`#t${numeroForm}`).addClass("enEspera")
    $(`#bf${numeroForm}`).addClass("enEspera")

    $(`#bf${numeroForm} span`).addClass("enEspera")

}
function mouseEnEsperImpresion() {

    $(`#impresionFormulario`).addClass("enEspera")
    $(`#impresionFormulario`).addClass("enEspera")

}
function mouseEnEsperaMenu(objeto, numeroForm) {

    $(`#t${numeroForm}`).addClass("enEspera")
    $(`#bf${numeroForm}`).addClass("enEspera")
    $(`.nav-vert`).addClass("enEspera")
    $(`body`).addClass("enEspera")
}
function mouseEnEsperaImpresion(objeto, numeroForm) {

    $(`#t${numeroForm}`).addClass("enEsperaImpresion")
    $(`#bf${numeroForm}`).addClass("enEsperaImpresion")

}
function mouseEnEsperaImpresionPrevia(objeto, numeroForm) {

    $(`#impresionFormulario`).addClass("enEspera")

}
function progressBar(objeto, numeroForm) {

    let progress = `<div class="progressBar" data-label="Cargando..."></div>`

    $(progress).appendTo(`.tabs_contents`)
    $(`.nav-vert`).addClass("enEspera")

    let progressBar = document.getElementsByClassName("progressBar")[0];
    let width = 0;
    progressBarActive[numeroForm] = setInterval(() => {
        width = (width + 1) % 100;
        progressBar.style.setProperty(`--width`, width)

    }, 10)
}
function progressBarHeight(objeto, numeroForm) {

    $(`.nav-vert`).addClass("enEspera")

    const div = document.getElementById(`t${numeroForm}`);

    let maxHeight = heightTabla(numeroForm)
    div.style.maxHeight = maxHeight;
    let height = 100;
    div.style.height = height + "px";
    progressBarActive[numeroForm] = setInterval(() => {

        height += 15;

        if (height >= Number(maxHeight.slice(0, -2))) {
            height = 100;
        }

        div.style.height = height + "px";

    }, 10);
}
function removeProgressBar(objeto, numeroForm) {

    clearInterval(progressBarActive[numeroForm])
    delete progressBarActive[numeroForm]
    $(`.progressBar`).remove()
    $(`.nav-vert`).removeClass("enEspera")
}
function removeProgressBarHeight(objeto, numeroForm) {

    const div = document.getElementById(`t${numeroForm}`);
    const table = document.querySelector(`#t${numeroForm} table`);
    const altoTabla = table.clientHeight;

    let heightActual = parseFloat(div.style.height)
    const maxHeight = parseFloat(div.style.maxHeight)
    clearInterval(progressBarActive[numeroForm])
    delete progressBarActive[numeroForm]

    if (altoTabla > heightActual) {

        progressBarActive[numeroForm] = setInterval(() => {

            heightActual += 20;

            if (heightActual >= maxHeight) {
                heightActual = maxHeight;
                clearInterval(progressBarActive[numeroForm]);
                delete progressBarActive[numeroForm];
            }

        }, 1);
    }
    div.style.removeProperty("height");

    $(`.nav-vert`).removeClass("enEspera")
    $(`.tabs_contents_item.construyendo`).removeClass("construyendo")
}
function removeProgressBarHeightForm(objeto, numeroForm) {

    const div = document.getElementById(`t${numeroForm}`);
    let heightActual = parseFloat(div.style.height)
    const maxHeight = parseFloat(div.style.maxHeight)
    clearInterval(progressBarActive[numeroForm])
    delete progressBarActive[numeroForm]

    if (maxHeight > heightActual) {

        progressBarActive[numeroForm] = setInterval(() => {

            heightActual += 20;

            if (heightActual >= maxHeight) {
                heightActual = maxHeight;
                clearInterval(progressBarActive[numeroForm]);
                delete progressBarActive[numeroForm];
            }
        }, 1);
    }
    div.style.removeProperty("height");
    $(`.nav-vert`).removeClass("enEspera")
    $(`.tabs_contents_item.construyendo`).removeClass("construyendo")
}
function removeProgressBarHeightDiv(objeto, numeroForm) {

    const div = document.getElementById(`t${numeroForm}`);
    const table = document.querySelector(`#t${numeroForm} .table`);
    const altoTabla = table.clientHeight;

    let heightActual = parseFloat(div.style.height)
    const maxHeight = parseFloat(div.style.maxHeight)

    clearInterval(progressBarActive[numeroForm])
    delete progressBarActive[numeroForm]

    if (altoTabla > heightActual) {

        progressBarActive[numeroForm] = setInterval(() => {

            heightActual += 20;

            if (heightActual >= maxHeight) {
                heightActual = maxHeight;
                clearInterval(progressBarActive[numeroForm]);
                delete progressBarActive[numeroForm];
            }
        }, 1);
    }
    div.style.removeProperty("height");
    $(`.nav-vert`).removeClass("enEspera")
    $(`.tabs_contents_item.construyendo`).removeClass("construyendo")
}
function quitarEsperaForm(objeto, numeroForm) {

    $(`#t${numeroForm}`).removeClass("enEspera")
    $(`#bf${numeroForm}`).removeClass("enEspera")

    $(`#bf${numeroForm} span`).removeClass("enEspera")

}
function quitarEnEsperaImpresionPrevia(objeto, numeroForm) {

    $(`#impresionFormulario`).removeClass("enEspera")
}
function quitarEsperaImpresionS() {

    $(`#impresionFormulario.enEspera`).removeClass("enEspera")
    $(`#impresionFormulario.enEspera`).removeClass("enEspera")

}
function quitarEsperaImpresion(objeto, numeroForm) {

    $(`#t${numeroForm}`).removeClass("enEsperaImpresion")
    $(`#bf${numeroForm}`).removeClass("enEsperaImpresion")

}
function quitarEsperaMenu(objeto, numeroForm) {

    $(`#t${numeroForm}`).removeClass("enEspera")
    $(`#bf${numeroForm}`).removeClass("enEspera")
    $(`.nav-vert`).removeClass("enEspera")
    $(`body`).removeClass("enEspera")

}
////Filtros get
function filtroValorIgual(objeto, numeroForm, valor) {

    return valor
} function filtroValorIgualVarios(objeto, numeroForm, valor) {

    return { $in: valor }
}
function filtroValorIgualVariosReferencia(objeto, numeroForm, pestana, valor) {

    let arreglo = []
    $.each(valor, (indice, value) => {

        let valorPestana = Object.values(consultaPestanas[pestana]).find(e => e.name.toLowerCase() == value.toLowerCase())._id

        arreglo.push(valorPestana)
    })

    return { $in: arreglo }
}
function filtroValorDistino(objeto, numeroForm, valor) {

    return { $ne: valor }

}
function filtroValorDistinoVarios(objeto, numeroForm, valor) {
    return { $nin: valor }

}
function filtroigualoVacio(objeto, numeroForm, atributo) {
    return {
        $or: [
            { atributo: { $exists: false } },
            { atributo: null },
            { atributo: "" }
        ]
    }

}
function filtroAtributoCompuestoDistintoCondicion(objeto, numeroForm, entidadParametrica, atributo, condicion) {

    let pestana = consultaPestanas[entidadParametrica]

    let atributosNor = Object.values(pestana).filter(e => e[atributo] == condicion).map(e => e._id);

    return { $nin: atributosNor }
}
function filtroSelectIgual(objeto, numeroForm, indice, valorString) {

    let valorSelect = Object.values(consultaPestanas[indice]).find(e => e?.name?.toLowerCase() === valorString?.toLowerCase());

    return valorSelect._id
}
function filtroSelectDistinto(objeto, numeroForm, indice, valorString) {

    let valorSelect = Object.values(consultaPestanas[indice]).filter(e => e.name == valorString).map(e => e._id)
    return { $nin: valorSelect }
}
function filtroSelectCabeceraDistinto(objeto, numeroForm, valor) {

    return { $nin: valor }

}
//Funciones de registros creado por codigo
function inhabilitarRegistroOriginario(objeto, numeroForm) {

    if ($(`#t${numeroForm}.formularioPestana input.username`).attr("idregistro") == "Gesfin") {

        $(`#bf${numeroForm} span.editBoton,
           #bf${numeroForm} span.recargar,
           #bf${numeroForm} span.cruzBoton,
           #bf${numeroForm} span.okfImprimirBoton,
           #bf${numeroForm} span.deleteBoton,
           #bf${numeroForm} span.okfBoton,
           #bf${numeroForm} span.historia,
           #bf${numeroForm} span.desHabilitarBotonInd,
           #bf${numeroForm} span.editBoton`).parent(`div`).addClass(`ocultoInhabilitado`)

    }

    const deshabiitar = (e) => {


        let father = $(e.target).parents(`div.tr.fila`)

        if ((!father.hasClass(`sel`)) && $(`div.username`, father).attr("idregistro") == "Gesfin") {

            $(`#bf${numeroForm} span.editBoton,
               #bf${numeroForm} span.recargar,
               #bf${numeroForm} span.cancelBoton,
               #bf${numeroForm} span.okBoton,
               #bf${numeroForm} span.deleteBoton,
               #bf${numeroForm} span.historia,
               #bf${numeroForm} span.desHabilitarBoton`).parents(`.barraForm`).addClass(`ocultoInhabilitado`)

        } else {

            $(`#bf${numeroForm} span.editBoton,
               #bf${numeroForm} span.recargar,
               #bf${numeroForm} span.cancelBoton,
               #bf${numeroForm} span.okBoton,
               #bf${numeroForm} span.deleteBoton,
               #bf${numeroForm} span.historia,
               #bf${numeroForm} span.desHabilitarBoton`).parents(`.barraForm`).removeClass(`ocultoInhabilitado`)
        }
    }

    $(`#t${numeroForm}[tabla="abm"]`).on(`click`, `.tr.fila`, deshabiitar)
}
const funcionesIniciales = {
    parametrica: [inhabilitarRegistroOriginario]
}
function removeOculto(objeto, numeroForm) {

    $.each(objeto.atributos.removeOculto, (indice, value) => {

        $(`#t${numeroForm} .tr div.${value.nombre},
        #t${numeroForm} .th.${value.nombre},
  #t${numeroForm} .inputTd.${value.nombre} input.${value.nombre}`).removeClass("oculto");

    })
}
function removeOcultoRaiz(objeto, numeroForm, atributos) {

    $.each(atributos, (indice, value) => { })


}
function findAllindex(str, char) {
    // Crear una expresión regular para buscar todas las ocurrencias del carácter
    const regex = new RegExp(char, 'g');
    const matches = str.matchAll(regex);
    const indices = [];

    for (const match of matches) {
        indices.push(match.index);
    }

    return indices;
}
//Ocutlar
function ocultoSiempre(objeto, numeroForm, atributos) {//Esta la uso por ejemplo en cotizaciones es para oultar elementos de coleccion que perfectamente son reutilizables pero hay atributos que  quiero ocultar, y en caso de esa entidad solo puedo ocultar asi proque tiene para ver elementos ocultos

    $.each(atributos, (indice, value) => {

        $(`#t${numeroForm} td.${value.nombre || value},
            #t${numeroForm} th.${value.nombre || value}`).addClass("ocultoSiempre")

    })
    const ocultosiempreC = (e) => {

        let father = $(e.target).parents("table")
        $.each(atributos, (indice, value) => {

            $(`tr.last td.${value.nombre || value}`, father).addClass("ocultoSiempre")

        })
    }

    $(`#t${numeroForm}`).on("dblclick", `input[class^="position"]`, ocultosiempreC)//Esto para chequear el coleccion
}
function ocultoFormInd(objeto, numeroForm, atributo) {

    $(`#t${numeroForm} div.fo.${atributo}`).addClass("oculto")
}
function ocultarBotones(objeto, numeroForm, boton) {

    $(`#bf${numeroForm} span.${boton}`).addClass("oculto")
}
function ocultarColeccionEntera(objeto, numeroForm, coleccion) { //dic

    $.each(coleccion, (indice, value) => {

        $(`#t${numeroForm} a.${value.nombre || value},
           #t${numeroForm} table.${value.nombre || value}`).addClass("ocultoSiempre").removeClass("active")

    })

    $(`#t${numeroForm} a:not(.ocultoSiempre):first,
       #t${numeroForm} table:not(.ocultoSiempre):first`).addClass("active")
}
function ocultarColeccionSegunEstaVacia(objeto, numeroForm, coleccion) {

    const coleccionTabla = $(`#t${numeroForm} table[compuesto=${coleccion.nombre}]`)

    let valoresKeys = []
    $.each(coleccionTabla, (indice, value) => {

        valoresKeys = $(`input.position`, value)

        if (!($(valoresKeys?.[0])?.val()?.length > 0)) {

            $(value).addClass("oculto").removeClass("active")
            let ord = $(value).attr("ordatr")
            let comp = $(value).attr("compuesto")

            $(`#t${numeroForm} a.pestana.${comp}[ordatr=${ord}]`).addClass("ocultoSiempre")
        }
    })

    $(`#t${numeroForm} a.pestana:not(.ocultoSiempre)`).trigger("click")
}
function ocultarPestana(objeto, numeroForm, pestanas, atributo) {//esto se modificara y se hará dinamica cuando alguna entidad más lo necesite

    let diasbledInput = $(`#t${numeroForm} input._id`).attr(`disabled`)

    const ocultarPrimeraPestana = (primeraPestana, segundaPestana) => {

        $(`#t${numeroForm} div.cabeceraCol a.${segundaPestana}`).addClass(`oculto`)
        $(`#t${numeroForm} div.cabeceraCol a.${primeraPestana}`).removeClass(`oculto`)

        $(`div.tableCol.${numeroForm} table,
           div.cabeceraCol.${numeroForm} a`).removeClass(`active`)

        $(`div.tableCol.${numeroForm} table.${primeraPestana},
           div.cabeceraCol.${numeroForm} a.${primeraPestana}`).addClass(`active`)

        $(`div.tableCol.${numeroForm} table.${segundaPestana} input`).attr(`disabled`, `disabled`).addClass("ocultoPestana")

        if (diasbledInput != "disabled") {

            $(`div.tableCol.${numeroForm} table.${primeraPestana} tr select,
               div.tableCol.${numeroForm} table.${primeraPestana} tr:not(.last) input:not(.inputPestana)`).removeAttr(`disabled`).removeClass("ocultoPestana")
            $(`div.tableCol.${numeroForm} table.${primeraPestana} tr.last input:not(.inputPestana)`).removeClass("ocultoPestana")

        }
    }
    const ocultarSegundaPestana = (primeraPestana, segundaPestana) => {

        $(`div.cabeceraCol.${numeroForm} a.${primeraPestana}`).addClass(`oculto`)
        $(`div.cabeceraCol.${numeroForm} a.${segundaPestana}`).removeClass(`oculto`)

        $(`div.tableCol.${numeroForm} table,
           div.cabeceraCol.${numeroForm} a`).removeClass(`active`)

        $(`div.tableCol.${numeroForm} table.${segundaPestana},
           div.cabeceraCol.${numeroForm} a.${segundaPestana}`).addClass(`active`)
        $(`div.tableCol.${numeroForm} table.${primeraPestana} input`).attr(`disabled`, `disabled`).addClass("ocultoPestana")

        if (diasbledInput != "disabled") {

            $(`div.tableCol.${numeroForm} table.${segundaPestana} tr:not(.last) input:not(.inputPestana),
               div.tableCol.${numeroForm} table.${segundaPestana} select`).removeAttr(`disabled`).removeClass("ocultoPestana")
            $(`div.tableCol.${numeroForm} table.${segundaPestana} tr.last input:not(.inputPestana)`).removeClass("ocultoPestana")

        }
    }
    const verTodasPesatnas = (primeraPestana, segundaPestana) => {

        $(`div.cabeceraCol.${numeroForm} a.${primeraPestana},
               div.cabeceraCol.${numeroForm} a.${segundaPestana}`).removeClass(`oculto`)

        $(`div.tableCol.${numeroForm} table,
               div.cabeceraCol.${numeroForm} a`).removeClass(`active`)

        $(`div.tableCol.${numeroForm} table.${primeraPestana},
               div.cabeceraCol.${numeroForm} a.${primeraPestana}`).addClass(`active`)

        if (diasbledInput != "disabled") {

            $(`div.tableCol.${numeroForm} table.${segundaPestana} tr:not(.last) input:not(.inputPestana),
               div.tableCol.${numeroForm} table.${segundaPestana} select,
               div.tableCol.${numeroForm} table.${primeraPestana} tr:not(.last) input:not(.inputPestana),
               div.tableCol.${numeroForm} table.${primeraPestana} select`).removeAttr(`disabled`).removeClass("ocultoPestana")

            $(`div.tableCol.${numeroForm} table.${segundaPestana} tr.last input:not(.inputPestana),
               div.tableCol.${numeroForm} table.${primeraPestana} tr.last input:not(.inputPestana)`).removeClass("ocultoPestana")
        }
    }
    const ocultarPest = (e) => {
        diasbledInput = $(`#t${numeroForm} input._id`).attr(`disabled`)
        let valor = $(`.inputSelect`, $(e.target).parents(".selectCont")).val().trim()

        if (valor == pestanas.segundaPestana.mostrar) {

            ocultarPrimeraPestana(pestanas.primeraPestana.nombre, pestanas.segundaPestana.nombre)

        } else if (valor == pestanas.primeraPestana.mostrar) {

            ocultarSegundaPestana(pestanas.primeraPestana.nombre, pestanas.segundaPestana.nombre)

        } else {

            verTodasPesatnas(pestanas.primeraPestana.nombre, pestanas.segundaPestana.nombre)
        }
    }

    $(`#t${numeroForm}`).on(`change`, `.divSelectInput[name=${atributo.nombre || atributo}]`, ocultarPest)
    $(`#t${numeroForm} .divSelectInput[name=${atributo.nombre || atributo}]`).trigger("change")

}
function mostrarPestana(objeto, numeroForm, compuestoA, compuestoB) {

    const ocultarPest = (e) => {

        const input = $(e.target);
        const estaMarcado = input.is(":checked");
        const pestanaA = $(`div.tableCol.${numeroForm} table.${compuestoA}`);
        const cabeceraA = $(`div.cabeceraCol.${numeroForm} a.${compuestoA}`);
        const cabeceraB = $(`div.cabeceraCol.${numeroForm} a.${compuestoB}`);

        if (estaMarcado) {

            cabeceraA.removeClass("ocultoSiempre")
            pestanaA.removeClass("ocultoSiempre");
            $(cabeceraA).trigger("click")

            $(`#t${numeroForm} table.${compuestoB} input.requerido`).addClass("removeReq").removeClass("requerido");
            $(`#t${numeroForm} table.${compuestoA} input.removeReq`).addClass("requerido").removeClass("removeReq");

        } else {

            pestanaA.addClass("ocultoSiempre");
            cabeceraA.removeClass("active").addClass("ocultoSiempre");

            $(`#t${numeroForm} table.${compuestoB} input.removeReq`).addClass("requerido").removeClass("removeReq");
            $(`#t${numeroForm} table.${compuestoA} input.requerido`).addClass("removeReq").removeClass("requerido");
            $(cabeceraB).trigger("click")
        }

    };
    const $checkbox = $(`#t${numeroForm} input[type=checkbox]`);
    $checkbox.on("change", ocultarPest);
    $checkbox.trigger("change");
}
function ocultarAtributos(objeto, numeroForm) {

    let empresaSel = $(`.empresaSelect`).html().trim()
    let empresaSelecta = Object.values(consultaPestanas.empresa).find(e => e.name == empresaSel);

    if (empresaSelecta.ingresaStock == "Facturacion") {
        $(`#t${numeroForm} div.fo.estado`).addClass("ocultoSiempre");
        $(`#t${numeroForm} div.celda.estado`).addClass("ocultoSiempre")
        $(`#t${numeroForm} div.th.estado`).addClass("ocultoSiempre")
    }
}
function ocultarIngresoStock(objeto, numeroForm) {
    let empresaSel = $(`.empresaSelect`).html().trim()
    let empresaSelecta = Object.values(consultaPestanas.empresa).find(e => e.name == empresaSel); // obtiene la primera clave del objeto
    if (empresaSelecta.ingresaStock == "Facturacion") {
        $(`#t${numeroForm} .selectCont.operacionStock .opciones[value="Entrada"]`).addClass("ocultoSiempre");
        $(`#t${numeroForm} .itemMenu [id="entradasPendientes"]`).addClass("ocultoSiempre");
    }
}
function ocultarSalidaStock(objeto, numeroForm) {
    let empresaSel = $(`.empresaSelect`).html().trim()
    let empresaSelecta = Object.values(consultaPestanas.empresa).find(e => e.name == empresaSel); // obtiene la primera clave del objeto

    if (empresaSelecta.bajaStock == "Facturacion") {
        $(`#t${numeroForm} .selectCont.operacionStock .opciones[value="Salida"]`).addClass("ocultoSiempre");
        $(`#t${numeroForm} .itemMenu [aprobar="facturacionOrdenSalida"]`).addClass("ocultoSiempre");
        $(`#t${numeroForm} .itemMenu [id="salidaSinFacturar"]`).addClass("ocultoSiempre");

    }
}
function ocultarBotonesNoUsados(objeto, numeroForm) {//dic

    $(`.okfLupa,
       .okfImprimir,
       .deleteBoton,
       .desHabilitarBotonInd,
       .historia,
       .editBoton`, `#bf${numeroForm} .botonesPest`).addClass("oculto")

}
function ocultarElementos(objeto, numeroForm, ocultos) {

    $.each(ocultos, (indice, value) => {

        $(`#t${numeroForm} div.fo.${value}`).attr("oculto", true)

    })
}
function ocultarElementosColeccion(objeto, numeroForm, ocultos) {

    $.each(ocultos, (indice, value) => {

        $(`#t${numeroForm} td.${value}`).attr("oculto", true)
        $(`#t${numeroForm} th.${value}`).attr("oculto", true)
    })

    $(`#t${numeroForm}`).on("dblclick", "input.position", (e) => {
        $.each(ocultos, (indice, value) => {
            $(`#t${numeroForm} td.${value}`).attr("oculto", true)
            $(`#t${numeroForm} th.${value}`).attr("oculto", true)
        })
    })
}
function ocultarCrear(objeto, numeroForm) {

    $(`#t${numeroForm} div.tr.input`).addClass("oculto")
    $(`#t${numeroForm} div.logicoAprobacion input`).removeAttr("disabled")
}
function ocultarAtributosMedioPagos(objeto, numeroForm) {//dic

    let fatherColect = $(`#t${numeroForm} .tablaCompuesto[class*="compuestoMedioPagos"]`)
    let edit = $(`#t${numeroForm} input._id`).val()?.length > 0

    $(`th.vencimientoCheque,
       td.vencimientoCheque,
       th.numeroDeCheque,
       td.numeroDeCheque,
       th.cuentasBancarias,
       td.cuentasBancarias,
       th.cajas,
       td.cajas,
       th.bancoCheque,
       td.bancoCheque`, fatherColect).addClass(`oculto`)

    const ocultarMostrar = (e) => {

        let father = $(e.target).parents("tr")
        let idSeleccinado = $(".divSelectInput[name=tipoPago]", father).val()
        $(father).removeAttr("medioPago")
        if (consultaPestanas.tipoPago?.[idSeleccinado]?.admBancos == "true" && consultaPestanas.tipoPago?.[idSeleccinado]?.admCheque == "true") {//Cheque propio

            $(`td.cuentasBancarias,
               td.numeroDeCheque,
               td.vencimientoCheque`, father).removeClass(`oculto`).removeClass(`ocultoConLugar`)

            $(`th.cuentasBancarias,
               th.numeroDeCheque,
               th.vencimientoCheque`, fatherColect).removeClass(`oculto`)

            $(`td.cuentasBancarias .inputSelect`, father).addClass(`requerido`)

            $(`td.cuentasBancarias.oculto,
                td.numeroDeCheque.oculto,
                td.vencimientoCheque.oculto`, fatherColect).addClass(`ocultoConLugar`).removeClass("oculto")

            $(`tr.last td.cuentasBancarias,
               tr.last td.numeroDeCheque,
               tr.last td.vencimientoCheque`, fatherColect).removeClass(`ocultoConLugar`)

            $(father).attr("medioPago", "bancosCheque")

        } else {

            $(`td.cuentasBancarias,
               td.numeroDeCheque,
               td.vencimientoCheque`, father).addClass(`oculto`)

            $(`td.cuentasBancarias .inputSelect`, father).removeClass(`requerido`)

            let filasMediosPagos = $(`tr:not(.totales)[medioPago="bancosCheque"]`, fatherColect)//cheque
            let filasMediosPagosTransf = $(`tr:not(.totales)[medioPago="bancos"]`, fatherColect)//trasnferencia
            let filasMediosPagosCh = $(`tr:not(.totales)[medioPago="cheque"]`, fatherColect)//cheque de tercero

            if (filasMediosPagos.length == 0 && filasMediosPagosTransf.length == 0 && filasMediosPagosCh.length == 0) {

                $(`td.cuentasBancarias,
                   td.numeroDeCheque,
                   td.vencimientoCheque`, fatherColect).addClass(`oculto`).removeClass(`ocultoConLugar`)

            } else {

                $(`td.cuentasBancarias:not(.last).oculto,
                   td.numeroDeCheque:not(.last).oculto,
                   td.vencimientoCheque:not(.last).oculto`, fatherColect).addClass(`ocultoConLugar`).removeClass("oculto")

                $(`th.cuentasBancarias,
                   th.numeroDeCheque,
                   th.vencimientoCheque`, fatherColect).removeClass("oculto")

            }
        }

        if (consultaPestanas.tipoPago?.[idSeleccinado]?.admCheque == "true" && consultaPestanas.tipoPago?.[idSeleccinado]?.admBancos != "true") {//Cheque de tercero

            $(`td.vencimientoCheque,
               td.numeroDeCheque,
               td.bancoCheque`, father).removeClass(`oculto`).removeClass(`ocultoConLugar`)

            $(`th.vencimientoCheque,
               th.numeroDeCheque,
               th.bancoCheque`, fatherColect).removeClass(`oculto`)

            $(`td.vencimientoCheque.oculto,
               td.numeroDeCheque.oculto,
               td.bancoCheque.oculto`, fatherColect).addClass(`ocultoConLugar`).removeClass("oculto")

            $(`tr.last td.vencimientoCheque,
               tr.last td.numeroDeCheque,
               tr.last td.bancoCheque`, fatherColect).removeClass(`ocultoConLugar`)

            $(father).attr("medioPago", "cheque")

        } else if (consultaPestanas.tipoPago?.[idSeleccinado]?.admCheque != "true") {

            $(`td.vencimientoCheque,
               td.numeroDeCheque,
               td.bancoCheque`, father).addClass(`oculto`)

            let filasMediosPagos = $(`tr:not(.totales)[medioPago=cheque]`, fatherColect)
            let filasMediosPagosMixt = $(`tr:not(.totales)[medioPago=bancosCheque]`, fatherColect)

            if (filasMediosPagosMixt.length == 0 && filasMediosPagos.length == 0) {

                $(`th.vencimientoCheque,
                   th.bancoCheque,
                   td.bancoCheque,
                   td.vencimientoCheque,
                   th.numeroDeCheque,
                   td.numeroDeCheque`, fatherColect).addClass(`oculto`).removeClass(`ocultoConLugar`)

            } else if (filasMediosPagos.length == 0) {

                $(`th.bancoCheque,
                   td.bancoCheque`, fatherColect).addClass(`oculto`).removeClass(`ocultoConLugar`)

                $(`td.vencimientoCheque,
               td.numeroDeCheque`, father).removeClass(`oculto`).addClass(`ocultoConLugar`)


            } else {

                $(`td.vencimientoCheque:not(.last).oculto,
                   td.numeroDeCheque:not(.last).oculto,
                   td.bancoCheque:not(.last).oculto`, fatherColect).addClass(`ocultoConLugar`).removeClass("oculto")

                $(`th.vencimientoCheque,
                   th.numeroDeCheque,
                   th.bancoCheque`, fatherColect).removeClass("oculto")
            }
        }

        if (consultaPestanas.tipoPago?.[idSeleccinado]?.admCajas == "true") {//Cajas

            $(`td.cajas`, father).removeClass(`oculto`).removeClass(`ocultoConLugar`)
            $(`td.cajas .inputSelect`, father).addClass(`requerido`)
            $(`th.cajas`, fatherColect).removeClass(`oculto`)
            $(`td.cajas.oculto`, fatherColect).addClass(`ocultoConLugar`).removeClass("oculto")
            $(`tr.last td.cajas`, fatherColect).removeClass(`ocultoConLugar`)
            $(father).attr("medioPago", "cajas")

        } else {

            $(`td.cajas`, father).addClass(`oculto`)
            $(`td.cajas .inputSelect`, father).removeClass(`requerido`)

            let filasMediosPagos = $(`tr:not(.totales)[medioPago=cajas]`, fatherColect)
            if (!filasMediosPagos.length > 0) {

                $(`th.cajas,
                   td.cajas`, fatherColect).addClass(`oculto`).removeClass(`ocultoConLugar`)

            } else {

                $(`td.cajas:not(.last).oculto`, fatherColect).addClass(`ocultoConLugar`).removeClass("oculto")
                $(`th.cajas`, fatherColect).removeClass("oculto")
            }
        }

        if (consultaPestanas.tipoPago?.[idSeleccinado]?.admBancos == "true" && consultaPestanas.tipoPago?.[idSeleccinado]?.admCheque != "true") {

            $(`td.cuentasBancarias`, father).removeClass(`oculto`).removeClass(`ocultoConLugar`)

            $(`td.cuentasBancarias .inputSelect`, father).addClass(`requerido`)

            $(`th.cuentasBancarias`, fatherColect).removeClass(`oculto`)

            $(`td.cuentasBancarias.oculto`, fatherColect).addClass(`ocultoConLugar`).removeClass("oculto")

            $(`tr.last td.cuentasBancarias`, fatherColect).removeClass(`ocultoConLugar`)

            $(father).attr("medioPago", "bancos")

        } else if (consultaPestanas.tipoPago?.[idSeleccinado]?.admBancos != "true") {


            $(`td.cuentasBancarias`, father).addClass(`oculto`)
            $(`td.cuentasBancarias .inputSelect`, father).removeClass(`requerido`)

            let filasMediosPagos = $(`tr:not(.totales)[medioPago=bancos]`, fatherColect)
            let filasMediosPagosCh = $(`tr:not(.totales)[medioPago=bancosCheque]`, fatherColect)

            if (!filasMediosPagos.length > 0 && !filasMediosPagosCh.length > 0) {

                $(`td.cuentasBancarias,
                   th.cuentasBancarias`, fatherColect).addClass(`oculto`).removeClass(`ocultoConLugar`)

            } else {

                $(`td.cuentasBancarias:not(.last).oculto`, fatherColect).addClass(`ocultoConLugar`).removeClass("oculto")
                $(`th.cuentasBancarias`, fatherColect).removeClass("oculto")
            }
        }
        ///esto lo agrego sino no me valida mal validar pagos
        $(`td.vencimientoCheque.ocultoConLugar input,
           td.numeroDeCheque.ocultoConLugar input,
           td.cuentasBancarias.ocultoConLugar .inputSelect,
           td.cajas.ocultoConLugar .inputSelect,
           td.bancoCheque.ocultoConLugar input`, fatherColect).addClass(`ocultoConLugar`)

        $(`td.vencimientoCheque:not(.ocultoConLugar) input,
           td.numeroDeCheque:not(.ocultoConLugar) input,
           td.cuentasBancarias:not(.ocultoConLugar) .inputSelect,
           td.cajas:not(.ocultoConLugar) .inputSelect,
           td.bancoCheque:not(.ocultoConLugar) input`, fatherColect).removeClass(`ocultoConLugar`)
    }
    const evaluarOcultos = (e) => {
        setTimeout(() => {
            $(`#t${numeroForm} table.compuestoMedioPagos tr.mainBody:first .divSelectInput[name=tipoPago] `).trigger("change")

        }, 500)
    }
    $(fatherColect).on("change", ".divSelectInput[name=tipoPago]", ocultarMostrar)
    $(fatherColect).on("click", "td.delete", evaluarOcultos)

    $(`#t${numeroForm}`).on(`dblclick`, `.compuestoMedioPagos  input.position`, (e) => {

        let mediosPagos = [`vencimientoCheque`, `numeroDeCheque`, `cuentasBancarias`, `cajas`, `bancos`, `bancoCheque`]
        let colec = $(`#t${numeroForm} table.compuestoMedioPagos`)

        $.each(mediosPagos, (indice, value) => {

            if (!$(`th.${value}`, colec).hasClass(`oculto`)) {

                $(`tr.last td.${value}`, colec).removeClass(`oculto`)
            } else {

                $(`tr.last td.${value}`, colec).addClass(`oculto`)
            }
        })



    })
    let tirggerEdit = () => {

        $(`.inputSelect.tipoPago`, fatherColect).trigger("change")
    }
    edit && tirggerEdit()

}
function agregarCaractAtributos(objeto, numeroForm, elemento, clase) {

    objeto.pestanas = objeto.pestanas || []

    $.each(objeto.atributos.names, (ind, val) => {

        (val.type == "parametrica" || val.type == "parametricaMixta" || val.type == "listaArrayParametrica") && objeto.pestanas.push(val)
        adicionarCaracteristicaAtributos(objeto, numeroForm, val)

        if (val.type == "coleccionInd") {

            $.extend(true, objeto.atributos, { compuesto: { [val.nombre]: val } });//Aca agrego el compuesto al objeto buscar la manera de hacerlo solo una vez
            $.extend(true, objeto, { formInd: { moneda: { coleccion: { [val.nombre]: val.moneda || (objeto.atributos.moneda || "moneda") } } } });

            $.each(val.componentes, (i, v) => {

                v.type == "parametrica" && objeto.pestanas.push(v)
                adicionarCaracteristicaAtributos(objeto, numeroForm, v)

            })

            val.componentes = agregarIdDesenCompononentesObjetos(objeto, val)
        }
        if (val.type == "coleccionSimple") {

            $.each(val.componentes, (i, v) => {

                v.type == "parametrica" && objeto.pestanas.push(v)

            })
        }
    })

    const numeradores = objeto.atributos.names.filter(item => item?.numerador === true);

    for (const numerador of numeradores) {

        objeto.numerador = numerador
    }
}
function agregarClase(objeto, numeroForm, elemento, clase) {

    $(`#t${numeroForm} ${elemento}`).addClass(clase)
}
function heightTabla(numeroForm) {

    const tablas = document.querySelector("#tablas");
    const pestana = document.querySelector(`#p${numeroForm}`);

    const comandera = $(`#bf${numeroForm}`).addClass("active");
    let tablaSun = document.querySelector(".tabs_contents_item.active");
    let numeroActve = $(`.tabs_contents_item.active`)?.attr("id")?.slice(1);//No tocar esto es para ver el activo

    // Obtener las alturas de los divs anteriores (incluyendo márgenes)
    const pestanaHeight = pestana?.offsetHeight || 0 +
        parseFloat(getComputedStyle?.(pestana)?.marginTop) +
        parseFloat(getComputedStyle?.(pestana)?.marginBottom);

    const comanderaHeight = comandera[0].offsetHeight +
        parseFloat(getComputedStyle(comandera[0]).marginTop) +
        parseFloat(getComputedStyle(comandera[0]).marginBottom);

    if (numeroActve != numeroForm) {

        $(`#bf${numeroForm}`).removeClass("active");
    }

    const tablasPadding = parseFloat(getComputedStyle(tablaSun)?.marginTop) +
        parseFloat(getComputedStyle(tablaSun)?.marginBottom);

    // Calcular el espacio restante
    const espacioRestante = tablas.clientHeight - pestanaHeight - tablasPadding - comanderaHeight - 15;

    // Aplicar el tamaño restante a otro div
    return `${espacioRestante}px`

}
/*function heightEspacioDisponible(numeroForm) {

    const tablas = document.querySelector("#tablas");
    const pestana = document.querySelector(`#p${numeroForm}`);

    const comandera = $(`#bf${numeroForm}`).addClass("active");
    let tablaSun = document.querySelector(".tabs_contents_item.active");
    let numeroActve = $(`.tabs_contents_item.active`)?.attr("id")?.slice(1);//No tocar esto es para ver el activo

    // Obtener las alturas de los divs anteriores (incluyendo márgenes)
    const pestanaHeight = pestana?.offsetHeight || 0 +
        parseFloat(getComputedStyle?.(pestana)?.marginTop) +
        parseFloat(getComputedStyle?.(pestana)?.marginBottom);

    const comanderaHeight = comandera[0].offsetHeight +
        parseFloat(getComputedStyle(comandera[0]).marginTop) +
        parseFloat(getComputedStyle(comandera[0]).marginBottom);

    if (numeroActve != numeroForm) {

        $(`#bf${numeroForm}`).removeClass("active");
    }

    const tablasPadding = parseFloat(getComputedStyle(tablaSun)?.marginTop) +
        parseFloat(getComputedStyle(tablaSun)?.marginBottom);

    // Calcular el espacio restante
    const espacioRestante = tablas.clientHeight - pestanaHeight - tablasPadding - comanderaHeight - 15;
    $(`#t${numeroForm}`).removeClass("construyendo")
    // Aplicar el tamaño restante a otro div
    return `${espacioRestante}px`

}*/
function estaVisibleEnPantalla(selector, content) {

    const rect = selector.getBoundingClientRect();
    const contenedor = content.getBoundingClientRect()

    return (
        rect.top >= 0 &&
        rect.bottom <= contenedor.top &&
        rect.top >= contenedor.bottom
    );
}
function encontrarPestColec(objeto, input) {//Solo se usa si la pestaña es colección
    const father = $(input).closest('table, div.coleccionSimple');

    const coleccion = father.attr('compuesto');
    const coleccionFind = objeto.atributos.names.find((e) => e.nombre === coleccion);

    return coleccionFind?.componentes[$(input).attr('name')];

}
function ponerTodoEnMayusucla(objeto, numeroForm) {

    $(`#t${numeroForm}`).on("blur", `input:not([type=importe]):not(.inputSelect)`, (e) => {

        let value = $(e.target).val();
        $(e.target).val(value.toUpperCase())
    })

    $(`#t${numeroForm}`).on("blur", `textarea`, (e) => {

        let value = $(e.target).val();
        $(e.target).val(value.toUpperCase())
    })

    $(`#t${numeroForm} input.soloLectura`).attr("tabindex", "-1")
}
//tareasProg
function ordenBloqueDias(objeto, numeroForm) {

    let divAgrupador = `<div class="agrupador flex" > </div>`

    $(divAgrupador).appendTo(`#t${numeroForm} .renglon.1`)

    let div = $(`#t${numeroForm} input.dias`).parents("div.fo").get().reverse()
    $(div).appendTo(`#t${numeroForm} .agrupador`)

    $(`#t${numeroForm} `).on("change", `input.dias:not(.totalizador)`, (e) => {

        let tot = 0
        let input = $(`#t${numeroForm} input.dias:not(.totalizador)`)
        $(`#t${numeroForm} input.totalizador`).prop("checked", false)
        $.each(input, (indice, value) => {

            if ($(value).is(':checked')) {
                tot++

            }
        })

        if (tot == 7) {

            $(`#t${numeroForm} input.totalizador`).prop("checked", true)

        }
    })
    $(`#t${numeroForm} `).on("change", `input.totalizador`, (e) => {

        if ($(e.target).is(':checked')) {

            $(`#t${numeroForm} input.dias:not(.totalizador)`).prop("checked", true).trigger("change")
        } else {


            $(`#t${numeroForm} input.dias:not(.totalizador)`).prop("checked", false).trigger("change")
        }

    })

}
async function cartelAvisoCampanita(texto, funcion) {

    let usuario = Object.values(consultaPestanas.user).find(e => e.usernameUser == usu);
    let actualizar = { estado: "pendiente", tarea: texto, _id: usuario._id, funcion, tareaAEliminar: "clientesSinGarantia", }

    try {
        const resp = await fetch(`/putTareas`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actualizar)
        });

        const response = await resp.json();

        if (response) {

            if (response?.posteo?.tareasPendientes) {
                let tareasPendientes = 0
                $(`.itemCampanita`).remove()
                $.each(response?.posteo?.tareasPendientes, (indice, value) => {

                    let cartel = `<div class="itemCampanita ${value.estado}" funcion="${value.funcion}"><span class="material-symbols-outlined pendiente">pending</span><span class="material-symbols-outlined check">done_all</span><p>${value.tarea}</p></div>`

                    $(cartel).appendTo(`.notificacionesCampana`)

                    if (value.estado == "pendiente") tareasPendientes++

                })
                if (tareasPendientes > 0) {
                    $(`.pendientes`).removeClass("oculto")
                    $(`.pendientes p`).html(tareasPendientes)

                }
            }
        }
    } catch (error) {
        console.error("❌ Error en fetch:", error);

    }
}
///Enviar emails
function entidadesEmailFuncion(objeto, numeroForm) {

    let filas = $(`#t${numeroForm} .contacto tr.mainBody:not(.last)`)

    let celdas = ""
    let titulos = ""
    const entidadesUnicas = new Set(entidadesEmail[objeto.accion]);
    let idTabla = $(`#t${numeroForm} table.contacto`).attr("id");

    for (const value of entidadesUnicas) {

        celdas += `<td class="${value} email${value} textoCentrado" set="${idTabla}"><input type="checkbox" class="email${value}" />`
        celdas += `<input type="hidden" class="formColec email${value}" name="email${value}" form="f${objeto.accion}${numeroForm}"/>`
        celdas += `</td>`
        titulos += `<th class="tituloTablasIndividual ${value}">${variablesModelo?.[value]?.pest || variablesIniciales?.locales?.[value]?.pest}</th>`
    }

    $(`#t${numeroForm} .contacto th.observacionesContacto`).after(titulos);

    $.each(filas, (indice, value) => {

        let ord = $(`input:first`, value).attr("ord")
        let celd = $(celdas)
        $(`td.observacionesContacto`, value).after(celd);

        $.each($(`input:not([ord]):not([type=hidden]):not(.position)`, value), (ind, val) => {

            let name = $(val).siblings("input").attr("name")
            let valor = consultaGet[numeroForm]?.[name]?.[indice] || consultaGet[numeroForm]?.[name]
            let valorDefinito = valor == "true"
            $(val).prop("checked", valorDefinito).attr("ord", ord).trigger("change")

        })
    })
    function agregarFilaExt(e) {

        let celd = $(celdas)
        let father = $(e.target).parents("tr")
        let ordNew = $(father).attr("q")
        $(`td.observacionesContacto`, father).after(celd);


        $.each($(`input:not([ord]):not([type=hidden]):not(.position)`, father), (ind, val) => {

            $(val).attr("ord", ordNew)

        })
    }

    $(`#t${numeroForm}`).on("dblclick", "input.position", agregarFilaExt)
}
////Fusion entidades
let Entidad = function (objetoGesfin, objetoCliente) {
    this.atributos = {
        names: reemplazoAtributo(objetoGesfin?.atributos?.names, objetoCliente?.atributos?.names, objetoCliente?.atributos?.posicion, objetoCliente?.atributos?.deleteItem, objetoGesfin),
        titulos: reemplazoAtributo(objetoGesfin?.atributos?.titulos, objetoCliente?.atributos?.titulos, objetoCliente?.atributos?.posicion, objetoCliente?.atributos?.deleteItem),
        abmCompuesto: Object.assign({ ...objetoGesfin?.atributos?.abmCompuesto }, { ...objetoCliente?.atributos?.abmCompuesto }),
        cabeceraAbm: objetoCliente.atributos?.cabeceraAbm || objetoGesfin?.atributos?.cabeceraAbm, //5.5
        moneda: objetoCliente?.atributos?.moneda || objetoGesfin?.atributos?.moneda,//8
        limiteCabecera: objetoCliente?.atributos?.limiteCabecera || objetoGesfin?.atributos?.limiteCabecera || undefined,
        filtroRapido: objetoCliente?.atributos?.filtroRapido || objetoGesfin?.atributos?.filtroRapido || "",
        filtroRapidoOculto: Object.assign(objetoGesfin?.atributos?.filtroRapidoOculto || {}, objetoCliente?.atributos?.filtroRapidoOculto || {}),//13
        eliminar: objetoGesfin?.atributos?.eliminar || objetoGesfin?.atributos?.eliminar || false,
        deshabilitar: objetoGesfin?.atributos?.deshabilitar || objetoCliente?.atributos?.deshabilitar || false,
        valorInicial: {
            select: Object.assign({ ...objetoGesfin?.atributos?.valorInicial?.select }, { ...objetoCliente?.atributos?.valorInicial?.select })
        },
        crear: objetoGesfin?.atributos?.crear || objetoCliente?.atributos?.crear,
    };
    this.formInd = {
        titulos: (Object.values(objetoGesfin?.formInd?.titulos || {}).length > 0 ? reemplazoAtributo(objetoGesfin?.formInd?.titulos, objetoCliente?.formInd?.titulos, objetoCliente?.atributos?.posicion, objetoCliente?.atributos?.deleteItem) : ""),
        titulosCompuesto: Object.assign(objetoGesfin?.formInd?.titulosCompuesto || {}, objetoCliente?.formInd?.titulosCompuesto || {}),
        inputRenglones: objetoCliente?.formInd?.inputRenglones || objetoGesfin?.formInd?.inputRenglones,
        soloLectura: (objetoGesfin?.formInd?.soloLectura || []).concat(objetoCliente?.formInd?.soloLectura || []),
        impresion: Object.assign(objetoGesfin?.formInd?.impresion || {}, objetoCliente?.formInd?.impresion || {}),
        type: objetoCliente?.formInd?.type || objetoGesfin?.formInd?.type
    };
    this.funcionesPropias = {
        inicio: Object.assign(objetoGesfin?.funcionesPropias?.inicio || {}, objetoCliente?.funcionesPropias?.inicio || {}),
        crearAbm: Object.assign(objetoGesfin?.funcionesPropias?.crearAbm || {}, objetoCliente?.funcionesPropias?.crearAbm || {}),
        cargar: Object.assign(objetoGesfin?.funcionesPropias?.cargar || {}, objetoCliente?.funcionesPropias?.cargar || {}),
        formularioIndiv: Object.assign(objetoGesfin?.funcionesPropias?.formularioIndiv || {}, objetoCliente?.funcionesPropias?.formularioIndiv || {}),
        coleccionFormIndividual: Object.assign(objetoGesfin?.funcionesPropias?.coleccionFormIndividual || {}, objetoCliente?.funcionesPropias?.coleccionFormIndividual || {}),
        ejecutarAlconfirmar: Object.assign(objetoGesfin?.funcionesPropias?.ejecutarAlconfirmar || {}, objetoCliente?.funcionesPropias?.ejecutarAlconfirmar || {}),
        validarAlConfirmar: Object.assign(objetoGesfin?.funcionesPropias?.validarAlConfirmar || {}, objetoCliente?.funcionesPropias?.validarAlConfirmar || {}),
        finalAbm: Object.assign(objetoGesfin?.funcionesPropias?.finalAbm || {}, objetoCliente?.funcionesPropias?.finalAbm || {})
    };
    this.totalizadores = Object.assign(objetoGesfin.totalizadores || {}, objetoCliente.totalizadores || {});
    this.acumulador = Object.assign(objetoGesfin.acumulador || {}, objetoCliente.acumulador || {});
    this.validaciones = (objetoGesfin.validaciones || []).concat(objetoCliente.validaciones || []);
    this.oculto = (objetoGesfin.oculto || []).concat(objetoCliente.oculto || []);
    this.key = objetoCliente.key || objetoGesfin.key;
    this.pest = objetoCliente.pest || objetoGesfin.pest;
    this.pestanas = (objetoGesfin.pestanas || []).concat(objetoCliente.pestanas || []);
    this.sort = objetoCliente.sort || objetoGesfin.sort;
    this.pestIndividual = objetoCliente.pestIndividual || objetoGesfin.pestIndividual;
    this.accion = objetoCliente.accion || objetoGesfin.accion;
    this.tablaDobleEntrada = (objetoGesfin.tablaDobleEntrada || "").concat(objetoCliente.tablaDobleEntrada || "");
    this.child = Object.assign(objetoGesfin.child || {}, objetoCliente.child || {});
    this.type = objetoCliente.type || objetoGesfin.type;
    this.datos = objetoCliente.datos || objetoGesfin.datos;
    this.coleccionPlancha = objetoCliente.coleccionPlancha || objetoGesfin.coleccionPlancha;
    this.desencadenante = Object.assign(objetoGesfin.desencadenante || {}, objetoCliente.desencadenante || {});
    this.desencadenaColeccion = Object.assign(objetoGesfin.desencadenaColeccion || {}, objetoCliente.desencadenaColeccion || {});
    this.desencadenaColeccionAgrupado = Object.assign(objetoGesfin.desencadenaColeccionAgrupado || {}, objetoCliente.desencadenaColeccionAgrupado || {});
    this.imputarcoleccion = Object.assign(objetoGesfin.imputarcoleccion || {}, objetoCliente.imputarcoleccion || {});
    this.empresa = objetoGesfin.empresa;
    this.multimoneda = objetoGesfin.multimoneda;
    this.filtros = Object.assign(objetoGesfin.filtros || {}, objetoCliente.filtros || {});
    this.filtrosComp = Object.assign(objetoGesfin.filtrosComp || {}, objetoCliente.filtrosComp || {});
    this.type = objetoGesfin.type;
    this.enviar = objetoCliente.enviar || objetoGesfin.enviar;
    ///Exluciso reportes
    this.cabecera = objetoCliente.cabecera || objetoGesfin.cabecera;
    this.cabeceraAtr = objetoCliente.cabeceraAtr || objetoGesfin.cabeceraAtr;


}
let Aprobacion = function (objetoAprobacion, objetoOriginal) {

    const inputRenglones = (objetoAprobacion) => {

        let renglones = { ...objetoAprobacion?.formInd?.inputRenglones }

        renglones[0] = parseFloat(renglones[0] + 1)
        return renglones
    }

    this.atributos = {
        names: [logicoAprobacion]?.concat(reemplazoAtributo(objetoOriginal?.atributos?.names, objetoAprobacion?.atributos?.names, objetoAprobacion?.atributos?.posicion, objetoAprobacion?.atributos?.deleteItem, objetoOriginal) || []),
        titulos: [""].concat(reemplazoAtributo(objetoOriginal?.atributos?.titulos, objetoAprobacion?.atributos?.titulos, objetoAprobacion?.atributos?.posicion, objetoAprobacion?.atributos?.deleteItem) || []),
        abmCompuesto: Object.assign({ ...objetoOriginal?.atributos?.abmCompuesto }, { ...objetoAprobacion?.atributos?.abmCompuesto }),
        cabeceraAbm: objetoAprobacion?.atributos?.cabeceraAbm || objetoOriginal?.atributos?.cabeceraAbm,
        limiteCabecera: objetoAprobacion?.atributos?.limiteCabecera || undefined,
        moneda: objetoAprobacion?.atributos?.moneda,
        filtroRapido: objetoOriginal?.atributos?.filtroRapido,
        filtroRapidoOculto: Object.assign({ ...objetoOriginal?.atributos?.filtroRapidoOculto }, { ...objetoAprobacion?.atributos?.filtroRapidoOculto }),
        valorInicial: {
            select: Object.assign({ ...objetoOriginal?.atributos?.valorInicial?.select }, { ...objetoAprobacion?.atributos?.valorInicial?.select })
        },
        crear: false,
    };
    this.formInd = {
        type: objetoAprobacion?.formInd?.type || objetoOriginal?.formInd?.type,
        titulos: (Object.values(objetoOriginal?.formInd?.titulos || {}).length > 0 ? [""].concat(reemplazoAtributo(objetoOriginal?.formInd?.titulos, objetoAprobacion?.formInd?.titulos, objetoAprobacion?.atributos?.posicion, objetoAprobacion?.atributos?.deleteItem) || []) : ""),
        titulosCompuesto: objetoOriginal?.formInd?.titulosCompuesto,
        inputRenglones: inputRenglones(objetoOriginal),
        moneda: {
            moneda: objetoOriginal?.formInd?.moneda?.moneda,
            coleccion: objetoOriginal?.formInd?.moneda?.coleccion,
        },
        soloLectura: (objetoOriginal?.formInd?.soloLectura?.compuesto || [])?.concat(objetoAprobacion?.formInd?.soloLectura?.compuesto || []),
        impresion: objetoOriginal?.formInd?.impresion,
    };
    this.funcionesPropias = {
        inicio: Object.assign({ ...objetoAprobacion?.funcionesPropias?.inicio }, { ...objetoAprobacion?.funcionesPropias?.inicio }),
        crearAbm: Object.assign({ ...objetoOriginal?.funcionesPropias?.crearAbm }, { ...objetoAprobacion?.funcionesPropias?.crearAbm }, { entidadAprobacionInicio: [entidadAprobacionInicio] }),
        cargar: Object.assign({ ...objetoOriginal?.funcionesPropias?.cargar }, { ...objetoAprobacion?.funcionesPropias?.cargar }),
        formularioIndiv: Object.assign({ ...objetoOriginal?.funcionesPropias?.formularioIndiv }, { ...objetoAprobacion?.funcionesPropias?.formularioIndiv }),
        validarAlConfirmar: Object.assign({ ...objetoOriginal?.funcionesPropias?.validarAlConfirmar }, { ...objetoAprobacion?.funcionesPropias?.validarAlConfirmar }),
        ejecutarAlconfimar: Object.assign({ ...objetoOriginal?.funcionesPropias?.ejecutarAlconfimar }, { ...objetoAprobacion?.funcionesPropias?.ejecutarAlconfimar }),
        finalAbm: Object.assign({ ...objetoOriginal?.funcionesPropias?.finalAbm } || {}, { ...objetoAprobacion?.funcionesPropias?.finalAbm } || {}, { entidadAprobacion: [entidadAprobacion] }),
        formularioIndivFinal: { entidadAprobacionInd: [entidadAprobacionInd] },

    };
    this.trigger = objetoAprobacion?.trigger;
    this.formulario = objetoAprobacion?.formulario || objetoOriginal?.formulario;
    this.funciones = objetoAprobacion?.funciones || objetoOriginal?.funciones;
    this.totalizadores = Object.assign({ ...objetoOriginal?.totalizadores }, { ...objetoAprobacion?.totalizadores });
    this.validaciones = objetoAprobacion?.validaciones;
    this.oculto = (objetoAprobacion.oculto || []).concat(objetoOriginal.oculto || []);
    this.key = objetoAprobacion?.key || objetoOriginal?.key;
    this.pest = objetoAprobacion?.pest || objetoOriginal?.pest;
    this.pestIndividual = objetoAprobacion?.pestIndividual || objetoOriginal?.pestIndividual;
    this.pestanas = (objetoAprobacion?.pestanas || []).concat(objetoOriginal?.pestanas || []);
    this.accion = objetoAprobacion?.accion || objetoOriginal?.accion;
    this.sort = objetoAprobacion.sort || objetoOriginal.sort;
    this.tablaDobleEntrada = objetoAprobacion?.tablaDobleEntrada || objetoOriginal?.tablaDobleEntrada;
    this.desencadenante = objetoAprobacion?.desencadenante;
    this.child = objetoAprobacion?.child;
    this.desencadenaColeccion = objetoAprobacion?.desencadenaColeccion;
    this.desencadenaAgrupado = objetoAprobacion?.desencadenaAgrupado;
    this.desencadenaColeccionAgrupado = objetoAprobacion?.desencadenaColeccionAgrupado;
    this.coleccionPlancha = objetoAprobacion?.coleccionPlancha || objetoOriginal?.coleccionPlancha;
    this.empresa = objetoOriginal?.empresa;
    this.imprimirAprob = objetoAprobacion?.imprimirAprob || "";
    this.multimoneda = objetoOriginal?.empresa;
    this.type = objetoAprobacion?.type;
    this.botones = objetoAprobacion?.botones;
    this.atributoMultipleMenu = objetoAprobacion?.atributoMultipleMenu;
    this.ayuda = objetoAprobacion?.ayuda
    this.datos = objetoAprobacion?.datos || objetoOriginal?.datos;
    this.fechaRegistros = objetoAprobacion?.fechaRegistros;
    this.filtros = objetoAprobacion?.filtros;
    this.filtrosComp = objetoAprobacion?.filtrosComp;
    this.filtrosUnwind = objetoAprobacion?.filtrosUnWind;
    this.atributosConfirmadosEnForm = Object.assign({ ...objetoOriginal?.atributosConfirmadosEnForm }, { ...objetoAprobacion?.atributosConfirmadosEnForm });
    this.atributosModificadosAlEnviar = Object.assign({ ...objetoOriginal?.atributosModificadosAlEnviar }, { ...objetoAprobacion?.atributosModificadosAlEnviar });
    this.typeHistorial = objetoAprobacion?.typeHistorial //Esto se usa para el tipo de acción en el historial en el momento de aprobar antes de enviar
    this.modificar = objetoAprobacion?.modificar
    this.modificarPostAprob = objetoAprobacion?.modificarPostAprob
    this.objetoAprobacionFusion = Object.assign({ ...objetoOriginal?.objetoAprobacionFusion }, { ...objetoAprobacion?.objetoAprobacionFusion })
    this.destinoTrigger = objetoAprobacion?.destinoTrigger//Esto ara al momento de transformar desencadenar se dispare segun valores iniciales
    this.enviar = objetoAprobacion.enviar || objetoOriginal.enviar;
}
//////////////////////
//console.log('funcionB se está ejecutando aquí:');
//console.log(new Error().stack);
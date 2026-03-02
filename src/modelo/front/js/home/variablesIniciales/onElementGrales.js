let temporizador;//Temportizador que cierra el menu vertical despues que saco el mouse 5 segundos
let temporizadorDos;
let temporizadorTres;

(function initCrumbs() {
    const MAX = 80;
    window.__crumbs = window.__crumbs || [];

    window.crumb = function (tag, data) {
        try {
            window.__crumbs.push({ t: Date.now(), tag, data });
            if (window.__crumbs.length > MAX) window.__crumbs.shift();
        } catch (_) { }
    };
})();

$(`body`).on(`change`, `input[type="checkbox"]`, (e) => {

    $(e.target).siblings("input").val(e.target.checked)

})
$(`#canvas_container .crossForm`).on("click", function () {

    /////////////este cierre la venta emergente del pdf////////
    $(`#vistaPrevia`).attr("src", "")
    $(`#canvas_container`).css("display", `none`)

})
$(`#videoTutorialDiv .crossForm`).on("click", function () {

    $(`#videoTutorialDiv`).removeClass("show")
    $(`#videoTutorial`).remove()

    let embed = `<embed id="videoTutorial" src="">`
    let emb = $(embed)
    emb.appendTo(`#videoTutorialDiv`)

})
//Mouse enter
$('body').on("mouseenter", '.nav-vert:not(.activeNav)', function (e) {//Abri menu izquierda

    $(`.desplegableAbm`).removeClass(`oculto`)
    $(`.nav-vert`).addClass(`activeNav`)
    $('#tablas').addClass("vistaActive");
})
$('body').on("mouseenter", '.nav-vert', function (e) {//Reinicio temporizadores si entro a la nav izquierda

    clearTimeout(temporizador)
    clearTimeout(temporizadorDos)
})
$('body').on("mouseenter", '.navegacionSupHomeLog.oculto', function (e) {//Abro navegacion superior

    $(`.navegacionSupHomeLog.ocultable`).removeClass("oculto")
    clearTimeout(temporizadorDos)

})
$('body').on("mouseenter", '.navegacionSupHomeLog', function (e) {//Abro navegacion superior

    clearTimeout(temporizadorTres)
})
//Mouse leave
$('body').on("mouseleave", '.nav-vert.activeNav:not(.fija)', function (e) {//Cierro en 5 segundos cuando dejo navegacion

    temporizador = setTimeout(function () {
        $(`.closeNavegacion`).trigger(`click`)

    }, 1000);
})
$('body').on("mouseleave", '.nav-vert.activeNav.ocultable:not(.fija)', function (e) {//Cierro en 5 segundos cuando dejo navegacion

    $(`.closeNavegacion`).trigger(`click`)

})
$('body').on("mouseleave", '.navegacionSupHomeLog.ocultable:not(.oculto)', function (e) {

    temporizadorTres = setTimeout(function () {

        $(`.navegacionSupHomeLog.ocultable:not(.oculto)`).addClass("oculto")

    }, 1000);
})
//////
$('body').on("click", '.closeNavegacion', function (e) {

    $(`.nav-vert`).removeClass(`activeNav`)
    $('#tablas').removeClass("vistaActive");
})
$('body').on("click", '.keep.navegacion', function (e) {

    $(`.keep.navegacion,
       .keep.navegacion.off`).toggleClass(`oculto`)
    $(`.nav-vert`).toggleClass(`fija`)
})
$(`body`).on("click", function () {

    $('.men').removeClass("show");

})
$(`body`).on("click", '.men-prin', function (event) {
    event.stopPropagation();
});
$('.men').on("click", function (event) {
    event.stopPropagation();
});
/////////////DESPLEGABLE HOME OPCIONES
$(`body`).on('click', `.opcionesEmpresas .opcion`, (e) => {

    let empresaSeleccionadaUsu = $(e.currentTarget).html().trim()
    let empresaActual = $(`.empresaSelect`).html().trim()

    if (empresaSeleccionadaUsu != empresaActual) {

        $(`.empresaSelect`).html(empresaSeleccionadaUsu);

        empresaSeleccionada = Object.values(consultaPestanas.empresa).find(e => e.name == empresaSeleccionadaUsu);
        empresaFiltro = { empresa: empresaSeleccionada?._id }

        if (empresaSeleccionada?.pathImg?.length > 0) {
            let logo = `<div class="logoEmpresa"><img src="${empresaSeleccionada.pathImg}"> </div>`
            $(`.empresaNavegacion.medio .logoEmpresa`).remove()
            $(logo).appendTo(`.empresaNavegacion.medio`)

            consultaPestanas = {
                empresa: consultaPestanas.empresa,
                username: consultaPestanas.username,
                usuario: consultaPestanas.usuario,
            }
            entidadesConsultas = {
                empresa: true,
                username: true,
                usuario: true
            }
        }

        $(`body`).attr("color", empresaSeleccionada.colores || "")
        $(`body`).attr("cajas", empresaSeleccionada.cajas || "")
        $(`body`).attr("bajaStock", empresaSeleccionada?.bajaStock?.replace(/\s+/g, "") || "")

        $(`.tabs_contents_item,
            .comanderaPestana,
            .comand,
            .pestana`).remove()
    }
})
$(`body`).on('click', `.desplegableAbm`, (e) => {

    $(e.target).siblings(`div.subMenu`).toggleClass("show");

})
$(`body`).on("click", `.menuPest`, (e) => {

    let id = $(e.target).attr(`id`)

    $(`#menu-container .nav-vert h4[view=${id}]`).removeClass(`noneSee`)
    $(`#menu-container .nav-vert h4:not([view="${id}"])`).addClass(`noneSee`)
    $(`#menu-container .nav-vert h4:not([view="${id}"])`).siblings("div.subMenu").removeClass(`show`)
    $(`#menu-container .nav-vert`).attr("view", id)
    $(`.menuPest`).removeClass(`oculto`)
    $(e.target).addClass(`oculto`)

    $('.men').removeClass("show");
})
$(`#menu-container`).on("click", `.cartelSeleccion .closePop`, (e) => {

    $(e.target).parents(`.cartelSeleccion`).remove();

})
$('#menu-container').on('click', `.pestana`, function (e) {

    if (!$(e.target).hasClass('close')) {

        let i = $(this).attr("id"); //atrapo el id de la pestaña
        let id = i.slice(1); //Le saco la "p" del Id
        let idActive = $(`.tabs_contents_item.active`).attr("id").slice(1);
        let positinoScrol = $(`.tabs_contents_item.active`).scrollTop()
        positionObject[idActive] = positinoScrol
        $(`#${i}`).addClass('active').siblings().removeClass('active'); //asigno active a tablas
        $(`#bf${id}`).addClass('active').siblings().removeClass('active');
        $(`#t${id}`).addClass('active').siblings().removeClass('active'); //asigno active a pestaña
        $(`#de${id}`).siblings().removeClass('active');
        $(`div.cartelHistorial`).addClass("oculto")
        $(`div.cartelHistorial.${id}`).removeClass("oculto")

    }
});
//Cerrar tabla y asignar atributo active a la tabla de la izquierda excepto si es la primera
$('#menu-container').on('click', ".close", function () {

    funcionCerrar(this)

});
$(`body`).on('click', `.spanDiv.campana`, (e) => {

    e.currentTarget.classList.toggle("active")
})
$('body').on('click', '.itemCampanita', async function (e) {

    let funcion = $(e.currentTarget).attr("funcion")
    console.log(funcion)
    window[funcion]();

    if ($(e.currentTarget).hasClass("pendiente")) {
        $(e.currentTarget).removeClass("pendiente").addClass("consultado")

        let usuario = Object.values(consultaPestanas.user).find(e => e.usernameUser == usu);

        let actualizar = { estado: "consultado", _id: usuario._id, funcion }
        console.log(actualizar)

        try {
            const resp = await fetch(`/cambiarEstadoTareas`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(actualizar)
            });

            const response = await resp.json();

            if (response) {

                let pendientes = $(`.itemCampanita.pendiente`).length

                if (pendientes > 0) {
                    $(`.pendientes p`).html(pendientes)
                } else {
                    $(`.pendientes`).addClass("oculto")
                }
            }

        } catch (error) {
            console.error("❌ Error en fetch:", err);

        }
    }
})

function addEmail(email, container, input) {

    const chip = document.createElement('div');
    chip.className = 'email-chip';
    chip.innerHTML = `${email}<span class="remove">&times;</span>`;

    chip.querySelector('.remove').addEventListener('click', (e) => {

        let cont = $(e.target).parents(`div.email-chip`)
        cont.remove();
    });

    let div = $(input).parent(`div`)

    div.before(chip)

}
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
$(`#impresionFormulario`).on(`keydown`, `.cartelComplemento input`, function (e) {

    let container = $(e.target).parents(`div.email-container`)
    if (e.key == 'Enter' || e.key == ',' || e.key == ' ') {
        e.preventDefault();
        const email = e.target.value.trim();

        if (email && validateEmail(email)) {
            addEmail(email, container, e.target);

            e.target.value = '';
        }
    }
})
$(`#impresionFormulario`).on(`blur`, `.cartelComplemento input`, function (e) {

    let container = $(e.target).parents(`div.email-container`)
    e.preventDefault();
    const email = e.target.value.trim();

    if (email && validateEmail(email)) {

        addEmail(email, container, e.target);

        e.target.value = '';
    }
})
////////////Eventos keydown
const quitarVistaPrevia = (e) => {

    /////////////este cierre el menu contextual////////
    $(`#menuContextualTitulo,
           #menuContextualCuerpoTabla`).css("display", "none");
    /////////////este cierre la venta emergente del pdf////////
    $(`#vistaPrevia`).attr("src", "")
    $(`#canvas_container`).css("display", `none`)
    $(`.cartelMovil`).remove();
    $(`.cartelErrorFront`).remove();
}
const objetoKewDown = {
    27: quitarVistaPrevia,
    ControlLeft: ""

}

$(`body`).on("click", `span.usuario`, async (e) => {

    const numeroForm = contador
    consultaPestanas.user = consultaPestanas.user || (await consultasPestanaIndividual("user")).pestana

    let info = Object.values(consultaPestanas.user).find(e => e.usernameUser == usu)

    clickFormularioIndividualPestana(variablesModelo.user, numeroForm, info)

    contador++

    $(`#bf${numeroForm} span.editBoton`).trigger("click")
    $(`span:not(.okBoton)`, `#bf${numeroForm}`).addClass(`.oculto`)
    $(`#t${numeroForm} table span.deleteIcon`).addClass(`.oculto`)

    $(`#t${numeroForm} table input, input.usernameUser`).removeClass("requerido").attr("disabled", "disabled").css({ appearance: `none` })
    $(`#t${numeroForm}`).removeClass("desHabilitado")
    $(`#t${numeroForm}, #bf${numeroForm}`).removeClass("desHabilitado")
    $(`#t${numeroForm} div.renglon.compuesto`).hide();


    $(`#bf${numeroForm} .okBoton`).on(`click`, (e) => {
        const elemento = document.querySelector(`#p${numeroForm} .closeFormInd`);
        funcionCerrar(elemento)

    })
})

const resize = () => {

    heigthWindow = window.innerHeight;
    heigtNavSup = $(`.navegacionSupHomeLog`).outerHeight(true);

}
$(window).on('resize', resize);
//ESto son los controles y shirt de mover las petanas de las colecciones
$.fn.controlRightKeyup = function (handler) {

    return this.each(function () {
        $(this).on('keyup.controlRightKeyup', function (event) {
            if (event.code === "ControlRight") { // Reemplaza "Enter" con la tecla deseada
                handler.call(this, event);
            }
        });
    });
};
$.fn.controlLefttKeyup = function (handler) {

    return this.each(function () {
        $(this).on('keyup.controlLefttKeyup', function (event) {
            if (event.code === "ControlLeft") { // Reemplaza "Enter" con la tecla deseada
                handler.call(this, event);
            }
        });
    });
};
//////////////////////////////////
///ESto para pasar de sub pestañas con en form individual
$(document).controlRightKeyup(function () {

    let father = $(`.tabs_contents_item.active`)

    let pestanaActual = $(`.cabeceraCol a.pestana.active`, father)
    let idPestActual = pestanaActual.attr("id")

    $(`#${idPestActual}`, father).nextAll(':not(.oculto)').first().addClass("active").siblings().removeClass("active");
    let pestActualNew = $(`.cabeceraCol a.pestana.active`, father).attr("id")
    let idPestAct = pestActualNew?.slice(2)

    $(`#pc${idPestAct}`, father).addClass("active").siblings().removeClass("active");

    $(`#pc${idPestAct} input:not(.ocultoPestana):first`, father).trigger("focus");

})
/*$(document).controlLefttKeyup(function () {

    let father = $(`.tabs_contents_item.active`)

    let pestanaActual = $(`.cabeceraCol a.pestana.active`, father)
    let idPestActual = pestanaActual.attr("id")

    $(`#${idPestActual}`, father).prevAll(':not(.oculto)').first().addClass("active").siblings().removeClass("active");
    let pestActualNew = $(`.cabeceraCol a.pestana.active`, father).attr("id")
    let idPestAct = pestActualNew?.slice(2)

    $(`#pc${idPestAct}`, father).addClass("active").siblings().removeClass("active");
    $(`#pc${idPestAct} input:not(.ocultoPestana):first`, father).trigger("focus");

})*/

///////////////////////////////
/*document.addEventListener("keydown", (event) => {

    const activeDocument = $(`.tabs_contents_item.active`);
    const activeTable = $(`table.active`, activeDocument);

    const objectoEjecucion = {
        trueq: () => activeTable.find('tr.last td.vacio').trigger('dblclick'),
        truew: () => activeTable.find('td.delete span:last').trigger('click'),
        trueEnter: () => $('.comanderaPestana.active .okBoton').trigger('click'),
        falseArrowUp: () => $(`input:not(.inputSelect):focus`, activeTable).closest('tr').prev('tr.mainBody:not(.last)').find(`input[name=${$('input:focus', activeTable).attr('name')}]`).focus(),
        falseArrowDown: () => $(`input:not(.inputSelect):focus`, activeTable).closest('tr').next('tr.mainBody:not(.last)').find(`input[name=${$('input:focus', activeTable).attr('name')}]`).focus(),
    };

    objectoEjecucion?.[`${event.getModifierState("Alt")}${event.key}`]?.()

});*/
//Formato 
function mayuscula(e) {
    const valor = e.target?.value || "";

    if (!valor) return; // evita error si está vacío

    const mayus = valor[0].toUpperCase() + valor.slice(1);
    $(e.target).val(mayus);
}
$(`body`).on("keyup", `input.primeraMayusOracion`, mayuscula);

///Olvistaste Contraseña
$(`body`).on("click", `div.olvidaste`, () => {

    $(`.cartelComplemento.resetPassword`).remove()
    $(`body .cartelInfo`).remove()

    let cartel = cartelComplemento({}, "", { claseCartel: "widthCuarenta resetPassword paddingAmplio black", bloques: 2, botonConfirmar: "oculto", position: { top: "10%" } })
    $(cartel).appendTo(`body`);

    let bloqueCero = `<div class="cabecera">
     <div class="iconoCabecera">🔒</div>
      <h2>¿Olvidaste tu contraseña?</h2>
      <p class="descripcionCabecera">
    Por favor ingresá tu usuario y correo electrónico para recuperar el acceso.
     </p></div>`
    $(bloqueCero).appendTo(`.bloque0`)
    let bloqueUno = `<form method="PUT" action="/recuperarContrasena"  id="recuperarContrasena"></form>`
    bloqueUno += `<div class="inputDiv"><label for="usuario">🧑‍💻 Usuario</label><input type="text" id="usuario" name="usernameUser" form="recuperarContrasena" placeholder="Ingresá tu nombre de usuario" ${autoCompOff} ></div>`
    bloqueUno += ` <div class="inputDiv"><label for="email">📧 Email</label><input type="email" id="email" name="email"  form="recuperarContrasena" placeholder="Ingresá tu correo electrónico" ${autoCompOff} ></div>`
    bloqueUno += `<button class="botonCartel">🔁 Recuperar contraseña</button>`

    $(bloqueUno).appendTo(`.bloque1`)

})
$(`body`).on("click", `div.resetPassword .botonCartel`, async () => {

    try {

        const dataEnviar = $(`.cartelComplemento.resetPassword #recuperarContrasena`).serialize();
        const response = await fetch('/recuperarContrasena', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: dataEnviar
        });

        const data = await response.json();

        if (data == "ok") {

            $(`.cartelComplemento.resetPassword .closePop`).trigger("click")

            let cartel = cartelInforUnaLinea(`Se envió email para<br>restablecer contraseña`, `📧`, { cartel: "centroCartel body" })
            $(cartel).appendTo(`body`);

        } else {
            $(`.cartelComplemento .cartelInfo`).remove()

            let cartel = cartelInforUnaLinea(`No se encuentra usuario con la información ingresada`, `❗`, { cartel: "centroCartel rojo", icono: "fondoBlanco" })
            $(cartel).appendTo(`.cartelComplemento .bloque0`);

        }

    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
})

function obtenerActivo() {
    const el = document.querySelector('.tabs_contents_item.active');
    let transaccion = {}

    if (!el) return null;

    if (el.getAttribute('tabla') === "formularioPestana") {
        transaccion = {
            numerador: $(`input.numerador`, el).val() || null,
            _id: $(`input._id`, el).val() || null,
            name: $(`input.name`, el).val() || null
        };
    }

    return {
        tag: el.tagName,
        id: el.id || null,
        clases: el.className || null,
        name: el.getAttribute('name') || null,
        transaccion
    };
}
// Captura errores normales del front (TypeError, ReferenceError, etc.)
window.addEventListener('error', (event) => {

    try {
        fetch('/log-frontend-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: 'error',
                mensaje: event.message,
                archivo: info?.archivo || event.filename,
                linea: info?.linea || event.lineno,
                columna: info?.columna || event.colno,
                stack: stack || null,
                activo: (typeof obtenerActivo === "function" ? obtenerActivo() : null),
                crumbs: window.__crumbs || []

            })
        });
    } catch (_) { }
});
// Captura promesas sin catch (async/await sin try/catch, fetch fallidos, etc.)
window.addEventListener('unhandledrejection', (event) => {

    try {
        const activo = obtenerActivo();
        const stack = event.reason?.stack || '';
        const info = extraerInfoStack(stack);

        fetch('/log-frontend-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: 'errorEnFuncion',
                mensaje: event.reason?.message || String(event.reason),
                archivo: info?.archivo || null,
                linea: info?.linea || null,
                columna: info?.columna || null,
                stack,
                activo,
                crumbs: window.__crumbs || []

            })
        });
    } catch (_) { }
});
function extraerInfoStack(stack) {
    if (!stack) return null;

    const lineas = stack.split('\n');

    // Buscar la PRIMER línea que contenga un archivo .js
    const lineaCodigo = lineas.find(l => l.match(/\.js:\d+:\d+/));
    if (!lineaCodigo) return null;

    // Extraer archivo, linea y columna
    const match = lineaCodigo.match(/at .*?\(?(.+\.js):(\d+):(\d+)\)?/);
    if (!match) return null;

    return {
        archivo: match[1],   // nombre de la hoja
        linea: Number(match[2]),
        columna: Number(match[3])
    };
}


//const tabla = contenedor.querySelector('table');
/*$(document).on("selectionchange", () => {


    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    console.log(range)*/
// ❗ Si la selección NO está dentro del contenedor → salir
/*const nodoInicial = sel.anchorNode;
if (!contenedor.contains(nodoInicial)) return;*/

// limpiar anteriores
/*document.querySelectorAll('td.seleccionada')
    .forEach(td => td.classList.remove('seleccionada'));

// marcar las que intersectan
document.querySelectorAll('td').forEach(td => {
    if (range.intersectsNode(td)) {
        td.classList.add('seleccionada');
    }
});
})*/
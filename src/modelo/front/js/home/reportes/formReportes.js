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
      <div class="divDesde margin-right-uno"><p class="fsOnce centroVertical interSans margin-right-ceroTres">Desde:</p><input type="date" class="fechaTextoDeReporte" value=${fechaDesde} ${autoCompOff} ></div>
      <div class="divHasta"><p class="fsOnce centroVertical interSans margin-right-ceroTres">Hasta:</p><input type="date" class="fechaTextoHastaReporte" value=${fechaHasta} ${autoCompOff} ></div>
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
    <div class="fechaHasta"><p class="fsOnce centroVertical interSans margin-right-ceroTres">Hasta:</p><input type="month" class="MesReporteHasta" name="monthPickerDesde" value="${year}-${month}" ${autoCompOff} ></div>
    <div class="fechaDesde"><p class="fsOnce centroVertical interSans margin-right-ceroTres">Desde:</p><input type="month" class="MesReporteDesde" name="monthPickerHasta" value="${yearSixMonthsAg}-${monthSixMonthsAg}" ${autoCompOff} ></div>
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

        cabecera += `<div class="primerDiv selecAtributo row interSans ${pest.clases || ""}"><p class="fsOnce centroVertical margin-right-ceroTres">${pest.titulo}:</p>`
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

        cabecera += `<div class="primerDiv selecAtributo row interSans ${pest.nombre}" type="${pest.type}"><p class="fsOnce centroVertical margin-right-ceroTres">${pest.titulo}:</p>`
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

    const contenedorBotones = $(`#bf${numeroForm}.divCabecera.botones`).first()
    if (contenedorBotones.length) {
        contenedorBotones.append(iResetResizeReporte)
    } else {
        let div = `<div class="divCabecera.botones"></div>`
        $(div).appendTo(`#bf${numeroForm}`)
        $(iResetResizeReporte).prependTo(`#bf${numeroForm} div.divCabecera.botones`)
    }

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
const resizeTablaReportesState = {}
const sortableColumnasReportes = {}
const sortableFilasReportes = {}
const sortableRetryPendienteReportes = {}
const resizeCookiePrefixReportes = "gf_resize_rep_v1"
function hashResizeReporte(texto) {

    let hash = 5381
    const str = `${texto || ""}`
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i)
    }
    return (hash >>> 0).toString(36)
}
function sanitizarColIdReporte(texto) {

    const limpio = `${texto || "col"}`
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_-]/g, "")
    return limpio || "col"
}
function normalizarOrdenDesdeCookieReporte(valor) {

    if (Array.isArray(valor)) {
        return valor.map((v) => `${v}`).filter((v) => v !== "")
    }

    if (valor && typeof valor === "object") {
        return Object.entries(valor)
            .sort((a, b) => (parseInt(a[1], 10) || 0) - (parseInt(b[1], 10) || 0))
            .map(([colId]) => `${colId}`)
            .filter((v) => v !== "")
    }

    if (typeof valor === "string") {
        return valor
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v !== "")
    }

    return []
}
function esReferenciaIndiceReporte(ref) {

    if (typeof ref === "number") return Number.isFinite(ref)
    if (typeof ref !== "string") return false

    const texto = ref.trim()
    if (texto === "") return false

    return /^-?\d+$/.test(texto)
}
function esHeaderDraggeableReporte(th) {

    if (!th?.length) return false
    if (th.hasClass("_id") || th.hasClass("oculto") || th.hasClass("transparent")) return false
    if (th.attr("oculto") === "true") return false
    return true
}
function normalizarRowIdReporte(valor, indice) {

    const base = sanitizarColIdReporte(valor || `fila_${indice}`)
    const hash = hashResizeReporte(valor || `fila_${indice}`).slice(0, 8)
    return `row_${base}_${hash}`
}
function esFilaDraggeableReporte(tr) {

    if (!tr?.length) return false
    if (tr.hasClass("titulosFila") || tr.hasClass("segunFilaTitulos") || tr.hasClass("filtros") || tr.hasClass("filaTotal")) return false
    return true
}
function keyRetrySortableReporte(numeroForm, tableKey, tipo) {

    return `${numeroForm}::${tableKey || "sin_key"}::${tipo}`
}
function ejecutarInitSortableConRetryReporte(numeroForm, tableKey, tipo, initFn) {

    const ejecutarIntento = (esReintento) => {
        try {
            return !!initFn(esReintento)
        } catch (error) {
            console.error(`Error inicializando sortable de ${tipo} (${tableKey || "sin_key"})`, error)
            return false
        }
    }

    const okInicial = ejecutarIntento(false)
    if (okInicial) {
        delete sortableRetryPendienteReportes[keyRetrySortableReporte(numeroForm, tableKey, tipo)]
        return true
    }

    const retryKey = keyRetrySortableReporte(numeroForm, tableKey, tipo)
    if (sortableRetryPendienteReportes[retryKey]) return false
    sortableRetryPendienteReportes[retryKey] = true

    const dispararReintento = () => {
        setTimeout(() => {
            try {
                ejecutarIntento(true)
            } finally {
                delete sortableRetryPendienteReportes[retryKey]
            }
        }, 0)
    }

    if (typeof requestAnimationFrame === "function") requestAnimationFrame(dispararReintento)
    else dispararReintento()

    return false
}
function normalizarTablaStateReporte(rawState) {

    if (!rawState || typeof rawState !== "object" || Array.isArray(rawState)) {
        return { columnas: {}, orden: [], filas: [] }
    }

    if (rawState.columnas !== undefined || rawState.orden !== undefined || rawState.filas !== undefined) {
        return {
            columnas: (typeof rawState.columnas === "object" && !Array.isArray(rawState.columnas)) ? rawState.columnas : {},
            orden: normalizarOrdenDesdeCookieReporte(
                rawState?.orden ??
                rawState?.order ??
                rawState?.columnas?.orden
            ),
            filas: normalizarOrdenDesdeCookieReporte(
                rawState?.filas ??
                rawState?.rows ??
                rawState?.rowOrder
            )
        }
    }

    return {
        columnas: rawState,
        orden: [],
        filas: []
    }
}
function getTableStateReporte(state, tableKey) {

    const normalizado = normalizarTablaStateReporte(state?.tablas?.[tableKey])
    state.tablas[tableKey] = normalizado
    return normalizado
}
function obtenerDeviceResizeIdReporte() {

    const key = "gesfin_device_resize_id"
    try {
        let id = localStorage.getItem(key)
        if (!id) {
            id = `dv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
            localStorage.setItem(key, id)
        }
        return id
    } catch (error) {
        return `ua_${hashResizeReporte(navigator.userAgent || "sin_ua")}`
    }
}
function nombreCookieResizeReporte(scopeKey) {

    return `${resizeCookiePrefixReportes}_${hashResizeReporte(scopeKey)}`
}
function setCookieResizeReporte(nombre, valor, dias = 365) {

    const ms = dias * 24 * 60 * 60 * 1000
    const expires = new Date(Date.now() + ms).toUTCString()
    document.cookie = `${nombre}=${encodeURIComponent(valor)}; expires=${expires}; path=/; SameSite=Lax`
}
function deleteCookieResizeReporte(nombre) {

    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}
function getCookieResizeReporte(nombre) {

    const nombreEq = `${nombre}=`
    const partes = document.cookie.split(";")

    for (const parte of partes) {
        const c = parte.trim()
        if (c.indexOf(nombreEq) === 0) {
            return decodeURIComponent(c.substring(nombreEq.length))
        }
    }
    return ""
}
function getScopeResizeReporte(objeto) {

    const usuario = usu || "anonimo"
    const dispositivo = obtenerDeviceResizeIdReporte()
    const empresa = empresaSeleccionada?._id || "sin_empresa"
    const reporte = objeto?.nombre || objeto?.accion || objeto?.pest || "reporte"

    return `${usuario}|${dispositivo}|${empresa}|${reporte}`
}
function limpiarResizePersistidoReporte(numeroForm, objeto) {

    try {
        const scopeKey = resizeTablaReportesState[numeroForm]?.scopeKey || getScopeResizeReporte(objeto)
        const nombre = nombreCookieResizeReporte(scopeKey)
        deleteCookieResizeReporte(nombre)
        delete resizeTablaReportesState[numeroForm]
        return true
    } catch (error) {
        console.error("No se pudo limpiar la persistencia de resize de reportes", error)
        return false
    }
}
function cargarResizeCookieReporte(scopeKey) {

    try {
        const nombre = nombreCookieResizeReporte(scopeKey)
        const valor = getCookieResizeReporte(nombre)
        if (!valor) return { tablas: {} }

        const parseado = JSON.parse(valor)
        const tablasParseadas = {}
        const tablasRaw = parseado?.tablas || {}

        $.each(tablasRaw, (tableKey, tableState) => {
            tablasParseadas[tableKey] = normalizarTablaStateReporte(tableState)
        })

        return { tablas: tablasParseadas }
    } catch (error) {
        return { tablas: {} }
    }
}
function guardarResizeCookieReporte(state) {

    if (!state?.scopeKey) return
    const nombre = nombreCookieResizeReporte(state.scopeKey)
    const payload = JSON.stringify({ tablas: state.tablas || {} })
    setCookieResizeReporte(nombre, payload, 365)
}
function getResizeStateReportes(numeroForm, objeto) {

    if (!resizeTablaReportesState[numeroForm]) {
        const scopeKey = getScopeResizeReporte(objeto)
        const persistido = cargarResizeCookieReporte(scopeKey)

        resizeTablaReportesState[numeroForm] = {
            scopeKey,
            tablas: persistido.tablas || {}
        }
    }
    return resizeTablaReportesState[numeroForm]
}
function obtenerFilaTitulosReporte(tabla) {

    const filaTitulos = tabla.find("tr.titulosFila").first()
    if (filaTitulos.length) return filaTitulos
    return tabla.find("tr").first()
}
function obtenerContenedorFilasReporte(tabla) {

    if (!tabla?.length) return $()
    const tbody = tabla.children("tbody").first()
    return tbody.length ? tbody : tabla
}
function obtenerFilasTablaReporte(tabla) {

    return obtenerContenedorFilasReporte(tabla).children("tr")
}
function obtenerCeldaHandleFilaReporte(tr) {

    if (!tr?.length) return $()

    const celdasPreferidas = tr.children("td, th").filter((_, celda) => {
        const c = $(celda)
        if (c.hasClass("_id") || c.hasClass("oculto") || c.hasClass("transparent")) return false
        if (c.attr("oculto") === "true") return false
        return true
    })
    if (celdasPreferidas.length) return celdasPreferidas.first()

    return tr.children("td, th").first()
}
function asignarColIdsTablaReporte(tabla) {

    const filaTitulos = obtenerFilaTitulosReporte(tabla)
    if (!filaTitulos.length) return

    const headers = filaTitulos.children("th, td")
    if (!headers.length) return

    const usados = new Set()
    const mapaIndices = []

    headers.each((indice, header) => {
        const th = $(header)
        let colId = th.attr("data-col-id")

        if (!colId) {
            const refAtributo = th.attr("atributo") || th.attr("colum") || `col_${indice}`
            const baseId = sanitizarColIdReporte(refAtributo)
            colId = `${baseId}_${indice}`
            let intento = 1
            while (usados.has(colId)) {
                colId = `${baseId}_${indice}_${intento}`
                intento++
            }
        }

        usados.add(colId)
        th.attr("data-col-id", colId)
        mapaIndices[indice] = colId
    })

    tabla.find("tr").each((_, fila) => {
        $(fila).children("th, td").each((indice, celda) => {
            const celdaJq = $(celda)
            if (celdaJq.attr("data-col-id")) return
            const colId = mapaIndices[indice]
            if (!colId) return
            celdaJq.attr("data-col-id", colId)
        })
    })
}
function obtenerFilaIdReporte(tr, indice) {

    const fila = $(tr)
    const existente = fila.attr("data-row-id")
    if (existente) return existente

    const celdaId = fila.children("td._id, th._id").first()
    const idInput = celdaId.find("input").val()
    const idTexto = celdaId.text()?.trim()
    const atributoFila = fila.attr("fila") || fila.attr("idregistro")

    if (idInput || idTexto || atributoFila) {
        return normalizarRowIdReporte(idInput || idTexto || atributoFila, indice)
    }

    const resumenFila = fila.children("td, th").slice(0, 5).map((_, celda) => $(celda).text().trim()).get().join("|")
    return normalizarRowIdReporte(resumenFila || `fila_${indice}`, indice)
}
function asignarRowIdsTablaReporte(tabla) {

    const filas = obtenerFilasTablaReporte(tabla).filter((_, tr) => esFilaDraggeableReporte($(tr)))
    const usados = new Set()

    filas.each((indice, tr) => {
        let rowId = obtenerFilaIdReporte(tr, indice)
        if (!rowId) return

        let intento = 1
        while (usados.has(rowId)) {
            rowId = `${rowId}_${intento}`
            intento++
        }

        usados.add(rowId)
        $(tr).attr("data-row-id", rowId)
    })
}
function obtenerOrdenHeadersDragReporte(tabla) {

    const filaTitulos = obtenerFilaTitulosReporte(tabla)
    if (!filaTitulos.length) return []

    return filaTitulos
        .children("th, td")
        .filter((_, header) => esHeaderDraggeableReporte($(header)))
        .map((_, header) => $(header).attr("data-col-id"))
        .get()
        .filter((colId) => !!colId)
}
function obtenerOrdenFilasDragReporte(tabla) {

    return obtenerFilasTablaReporte(tabla)
        .filter((_, tr) => esFilaDraggeableReporte($(tr)))
        .map((_, tr) => $(tr).attr("data-row-id"))
        .get()
        .filter((rowId) => !!rowId)
}
function normalizarOrdenColIdsReporte(ordenGuardado, colIdsActuales) {

    const actualesSet = new Set(colIdsActuales)
    const orden = []

    if (Array.isArray(ordenGuardado)) {
        for (const colId of ordenGuardado) {
            if (!actualesSet.has(colId)) continue
            if (orden.includes(colId)) continue
            orden.push(colId)
        }
    }

    for (const colId of colIdsActuales) {
        if (!orden.includes(colId)) orden.push(colId)
    }

    return orden
}
function normalizarOrdenFilasReporte(ordenGuardado, rowIdsActuales) {

    const actualesSet = new Set(rowIdsActuales)
    const orden = []

    if (Array.isArray(ordenGuardado)) {
        for (const rowId of ordenGuardado) {
            if (!actualesSet.has(rowId)) continue
            if (orden.includes(rowId)) continue
            orden.push(rowId)
        }
    }

    for (const rowId of rowIdsActuales) {
        if (!orden.includes(rowId)) orden.push(rowId)
    }

    return orden
}
function sincronizarOrdenVisualColumnasReporte(tabla, ordenColIds) {

    if (!tabla?.length) return
    if (!Array.isArray(ordenColIds) || !ordenColIds.length) return

    const ordenPorColId = {}
    ordenColIds.forEach((colId, indice) => {
        ordenPorColId[colId] = indice
    })

    tabla.find("tr").each((_, fila) => {
        const tr = $(fila)
        tr.children("th, td").each((_, celda) => {
            const colId = celda.getAttribute("data-col-id")
            if (!colId) return
            if (ordenPorColId[colId] === undefined) return

            const orden = ordenPorColId[colId]
            celda.style.setProperty("order", `${orden}`, "important")

            const celdaJq = $(celda)
            const esColumnaSistema = celdaJq.hasClass("_id") || celdaJq.attr("atributo") === "_id" || celdaJq.attr("colum") === "-1"
            if (!esColumnaSistema) {
                celdaJq.attr("colum", `${orden}`)
            }
        })
    })
}
function aplicarOrdenTablaReporte(tabla, ordenGuardado) {

    asignarColIdsTablaReporte(tabla)
    const colIdsActuales = obtenerOrdenHeadersDragReporte(tabla)
    if (!colIdsActuales.length) return []

    const hayOrdenGuardado = Array.isArray(ordenGuardado) && ordenGuardado.length > 0
    const ordenFinal = normalizarOrdenColIdsReporte(ordenGuardado, colIdsActuales)
    if (!hayOrdenGuardado) return ordenFinal

    const idsOrdenados = new Set(ordenFinal)
    tabla.find("tr").each((_, fila) => {
        const tr = $(fila)
        const celdas = tr.children("th, td").toArray()
        if (!celdas.length) return

        const porId = {}
        celdas.forEach((celda) => {
            const colId = celda.getAttribute("data-col-id")
            if (!colId) return
                ; (porId[colId] ??= []).push(celda)
        })

        const usadas = new Set()
        const ordenadas = []
        ordenFinal.forEach((colId) => {
            const grupo = porId[colId] || []
            grupo.forEach((celda) => {
                ordenadas.push(celda)
                usadas.add(celda)
            })
        })

        const restantes = celdas.filter((celda) => {
            const colId = celda.getAttribute("data-col-id")
            if (!colId) return true
            if (!idsOrdenados.has(colId)) return true
            return !usadas.has(celda)
        })

        tr.append([...ordenadas, ...restantes])
    })

    sincronizarOrdenVisualColumnasReporte(tabla, ordenFinal)

    return ordenFinal
}
function aplicarOrdenFilasTablaReporte(tabla, ordenGuardado) {

    asignarRowIdsTablaReporte(tabla)
    const contenedorFilas = obtenerContenedorFilasReporte(tabla)
    const filasActuales = obtenerFilasTablaReporte(tabla).filter((_, tr) => esFilaDraggeableReporte($(tr)))
    if (!filasActuales.length) return []

    const rowIdsActuales = filasActuales
        .map((_, fila) => $(fila).attr("data-row-id"))
        .get()
        .filter((rowId) => !!rowId)
    if (!rowIdsActuales.length) return []

    const ordenFinal = normalizarOrdenFilasReporte(ordenGuardado, rowIdsActuales)
    const hayOrdenGuardado = Array.isArray(ordenGuardado) && ordenGuardado.length > 0
    if (!hayOrdenGuardado) return ordenFinal

    const mapaFilas = {}
    filasActuales.each((_, fila) => {
        const rowId = $(fila).attr("data-row-id")
        if (!rowId) return
            ; (mapaFilas[rowId] ??= []).push(fila)
    })

    const ordenadas = []
    const usadas = new Set()
    ordenFinal.forEach((rowId) => {
        const grupo = mapaFilas[rowId] || []
        grupo.forEach((fila) => {
            ordenadas.push(fila)
            usadas.add(fila)
        })
    })

    const restantes = filasActuales.toArray().filter((fila) => !usadas.has(fila))
    const filasFinales = [...ordenadas, ...restantes]
    const filaTotal = contenedorFilas.children("tr.filaTotal").first()

    if (filaTotal.length) filaTotal.before(filasFinales)
    else contenedorFilas.append(filasFinales)

    return ordenFinal
}
function obtenerAnchoInicialColumnaReporte(th) {

    if (!th?.length) return 120

    const el = th.get(0)
    const styles = window.getComputedStyle(el)
    const maxWidth = parseFloat(styles.maxWidth)
    if (!Number.isNaN(maxWidth) && Number.isFinite(maxWidth) && maxWidth > 0) return maxWidth

    const width = parseFloat(styles.width)
    if (!Number.isNaN(width) && Number.isFinite(width) && width > 0) return width

    return th.outerWidth() || 120
}
function aplicarAnchoColumnaReporte(tabla, referenciaColumna, anchoPx) {

    const ancho = Math.max(80, Math.round(anchoPx))
    let columnas = $()

    if (!esReferenciaIndiceReporte(referenciaColumna)) {
        columnas = tabla.find(`[data-col-id="${referenciaColumna}"]`)
    }

    if (!columnas.length && esReferenciaIndiceReporte(referenciaColumna)) {
        const indiceColumna = parseInt(referenciaColumna, 10)
        tabla.find("tr").each((_, fila) => {
            const celda = $(fila).children("th, td").eq(indiceColumna)
            if (!celda.length) return
            columnas = columnas.add(celda)
        })
    }

    if (!columnas.length) return

    columnas.each((_, celda) => {
        celda.style.setProperty("width", `${ancho}px`, "important")
        celda.style.setProperty("min-width", `${ancho}px`, "important")
        celda.style.setProperty("max-width", `${ancho}px`, "important")
        celda.style.setProperty("flex", `0 0 ${ancho}px`, "important")
    })
}
function aplicarAlturaFilaReporte(fila, altoPx) {

    const alto = Math.max(28, Math.round(altoPx))
    const elFila = fila.get(0)
    if (elFila) {
        elFila.style.setProperty("height", `${alto}px`, "important")
        elFila.style.setProperty("min-height", `${alto}px`, "important")
    }

    fila.children("th, td").each((_, celda) => {
        celda.style.setProperty("height", `${alto}px`, "important")
        celda.style.setProperty("min-height", `${alto}px`, "important")
    })
}
function getResizeTableKey(table, index) {

    return table.attr("tablaref") || `index_${index}`
}
function normalizarNombreStickyColumnaReporte(columna) {

    if (!columna) return ""
    if (typeof columna === "string") return columna.trim()
    return `${columna.nombre || columna.atributo || ""}`.trim()
}
function aplicarStickyColumnasTablaPorNombresReporte(tabla, columnasNombres) {

    if (!tabla?.length) return

    const columnas = (Array.isArray(columnasNombres) ? columnasNombres : [])
        .map((columna) => normalizarNombreStickyColumnaReporte(columna))
        .filter((nombre) => nombre !== "")

    if (!columnas.length) return

    const contenedor = tabla.closest(".tablaReporte")
    if (!contenedor.length) return

    tabla.find("th.sticky-columna-reporte, td.sticky-columna-reporte")
        .removeClass("sticky-columna-reporte sticky-columna-reporte-ultima")

    const escapar = (valor) => {
        if (typeof $.escapeSelector === "function") return $.escapeSelector(valor)
        return `${valor}`.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1")
    }

    const celdasSticky = []

    columnas.forEach((nombre, indice) => {
        const nombreEscapado = escapar(nombre)
        const header = tabla
            .find(`tr.titulosFila > th[atributo="${nombre}"]:not(.transparent), tr.titulosFila > th.${nombreEscapado}:not(.transparent), tr.titulosFila > td[atributo="${nombre}"]:not(.transparent), tr.titulosFila > td.${nombreEscapado}:not(.transparent)`)
            .first()
        if (!header.length) return

        const colId = header.attr("data-col-id")
        let celdas = colId ? tabla.find(`[data-col-id="${colId}"]`) : $()
        if (!celdas.length) {
            celdas = tabla.find(`td[atributo="${nombre}"], th[atributo="${nombre}"]:not(.transparent), td.${nombreEscapado}, th.${nombreEscapado}:not(.transparent)`)
        }
        if (!celdas.length) return

        celdas.css({
            position: "relative",
            "z-index": 12 + (columnas.length - indice),
            boxSizing: "border-box",
        })
        celdas.addClass("sticky-columna-reporte")
        celdasSticky.push(celdas)
    })

    if (!celdasSticky.length) return
    celdasSticky[celdasSticky.length - 1].addClass("sticky-columna-reporte-ultima")

    const tableKey = tabla.attr("data-resize-key") || tabla.attr("tablaref") || "tabla"
    const contenedorId = contenedor.attr("id") || "contenedor"
    const namespace = `.stickyColsRep_${contenedorId}_${tableKey}`

    const actualizar = () => {
        const scrollX = contenedor.scrollLeft() || 0
        celdasSticky.forEach((celdas) => celdas.css("left", `${scrollX}px`))
    }

    contenedor.off(`scroll${namespace}`).on(`scroll${namespace}`, actualizar)
    $(window).off(`resize${namespace}`).on(`resize${namespace}`, actualizar)

    actualizar()
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(actualizar)
    else setTimeout(actualizar, 0)
}
function reaplicarStickyColumnasRegistradasReportes(numeroForm) {

    const contenedor = $(`#t${numeroForm}`)
    if (!contenedor.length) return

    contenedor.find("table").each((_, t) => {
        const tabla = $(t)
        const columnasSticky = tabla.data("stickyColumnasReportes")
        if (!Array.isArray(columnasSticky) || !columnasSticky.length) return
        aplicarStickyColumnasTablaPorNombresReporte(tabla, columnasSticky)
    })
}
function aplicarStickyDesdeConfigReporte(numeroForm, objeto) {

    const contenedor = $(`#t${numeroForm}`)
    if (!contenedor.length) return

    Object.entries(objeto?.tablas || {}).forEach(([tablaRef, configTabla]) => {
        const stickyDef = configTabla?.funcionesPropias?.tabla?.asgregarStickyColumnasTabla
        if (!Array.isArray(stickyDef) || stickyDef.length < 2) return

        const columnasSticky = (Array.isArray(stickyDef[1]) ? stickyDef[1] : [])
            .map((columna) => normalizarNombreStickyColumnaReporte(columna))
            .filter((nombre) => nombre !== "")
        if (!columnasSticky.length) return

        let tabla = contenedor.find(`table[tablaref='${tablaRef}']`).first()
        if (!tabla.length) {
            const nombrePrimeraColumna = columnasSticky[0]
            tabla = contenedor
                .find("table")
                .filter((_, t) => $(t).find(`th.${nombrePrimeraColumna}`).length > 0)
                .first()
        }
        if (!tabla.length) return

        tabla.data("stickyColumnasReportes", columnasSticky)
        aplicarStickyColumnasTablaPorNombresReporte(tabla, columnasSticky)
    })
}
function insertarHandlesResizeReportes(numeroForm) {

    const contenedor = $(`#t${numeroForm}`)
    if (!contenedor.length) return

    contenedor.find("table").each((indiceTabla, t) => {
        const tabla = $(t)
        tabla.attr("data-resize-key", getResizeTableKey(tabla, indiceTabla))
        asignarColIdsTablaReporte(tabla)
        asignarRowIdsTablaReporte(tabla)

        const filaTitulos = obtenerFilaTitulosReporte(tabla)
        const headers = filaTitulos.children("th, td")
        headers.each((_, header) => {
            const th = $(header)
            let contenido = th.children(".th-contenido").first()

            if (!contenido.length) {
                const envoltorio = $(`<div class="th-contenido"></div>`)
                th.contents().each((__, nodo) => {
                    if (nodo.nodeType === 1 && $(nodo).hasClass("resize-col-handle")) return
                    envoltorio.append(nodo)
                })
                th.append(envoltorio)
                contenido = envoltorio
            }

            if (!th.children(".resize-col-handle").length) {
                th.append(`<span class="resize-col-handle" title="Arrastrar para cambiar ancho"></span>`)
            }
            if (contenido.length && esHeaderDraggeableReporte(th) && !contenido.children(".reorder-col-handle").length) {
                contenido.prepend(`<span class="reorder-col-handle" title="Arrastrar para cambiar orden"></span>`)
            }
        })

        tabla.find("tr").not(".titulosFila, .segunFilaTitulos, .filtros").each((_, fila) => {
            const tr = $(fila)
            if (!tr.children(".resize-row-handle").length) {
                tr.append(`<span class="resize-row-handle" title="Arrastrar para cambiar alto"></span>`)
            }
            const celdaHandle = obtenerCeldaHandleFilaReporte(tr)
            if (celdaHandle.length) {
                if (celdaHandle.css("position") === "static") celdaHandle.css("position", "relative")
                const handlesEnTr = tr.children(".reorder-row-handle")
                if (handlesEnTr.length) celdaHandle.append(handlesEnTr)
            }
            if (esFilaDraggeableReporte(tr) && tr.attr("data-row-id") && !tr.find(".reorder-row-handle").length) {
                if (celdaHandle.length) celdaHandle.append(`<span class="reorder-row-handle" title="Arrastrar para cambiar orden de fila"></span>`)
                else tr.append(`<span class="reorder-row-handle" title="Arrastrar para cambiar orden de fila"></span>`)
            }
        })
    })
}
function restaurarResizeReportes(numeroForm, objeto) {

    const state = getResizeStateReportes(numeroForm, objeto)
    const contenedor = $(`#t${numeroForm}`)

    contenedor.find("table").each((_, t) => {
        const tabla = $(t)
        const key = tabla.attr("data-resize-key")
        if (!key) return

        const tableState = getTableStateReporte(state, key)
        tableState.orden = aplicarOrdenTablaReporte(tabla, tableState.orden)
        tableState.filas = aplicarOrdenFilasTablaReporte(tabla, tableState.filas)

        $.each(tableState.columnas, (referenciaColumna, ancho) => {
            aplicarAnchoColumnaReporte(tabla, referenciaColumna, ancho)
        })
    })
}
function limpiarPreviewDropReporte(numeroForm) {

    $(`#t${numeroForm} .drop-preview-before, #t${numeroForm} .drop-preview-after`).removeClass("drop-preview-before drop-preview-after")
}
function marcarPreviewDropReporte(numeroForm, evt, tipo) {

    limpiarPreviewDropReporte(numeroForm)
    const related = $(evt?.related)
    if (!related.length) return

    if (tipo === "columna" && related.closest("tr.titulosFila").length === 0) return
    if (tipo === "fila" && !esFilaDraggeableReporte(related)) return

    related.addClass(evt?.willInsertAfter ? "drop-preview-after" : "drop-preview-before")
}
function inicializarReordenamientoColumnasReportes(numeroForm, objeto) {

    const contenedor = $(`#t${numeroForm}`)
    const state = getResizeStateReportes(numeroForm, objeto)
    sortableColumnasReportes[numeroForm] = sortableColumnasReportes[numeroForm] || {}

    contenedor.find("table").each((_, t) => {
        const tabla = $(t)
        const tableKey = tabla.attr("data-resize-key")
        if (!tableKey) return

        const filaTitulos = obtenerFilaTitulosReporte(tabla)
        if (!filaTitulos.length) return

        const initColumnas = () => {
            const elFilaTitulos = filaTitulos.get(0)
            if (!elFilaTitulos || !elFilaTitulos.isConnected) {
                delete sortableColumnasReportes[numeroForm][tableKey]
                return false
            }
            if (sortableColumnasReportes[numeroForm]?.[tableKey]?.destroy) {
                try {
                    sortableColumnasReportes[numeroForm][tableKey].destroy()
                } catch (error) {
                    console.error(`Error destruyendo sortable de columnas (${tableKey})`, error)
                }
            }
            delete sortableColumnasReportes[numeroForm][tableKey]

            const headersDrag = filaTitulos
                .children("th, td")
                .filter((_, header) => esHeaderDraggeableReporte($(header)))

            if (headersDrag.length < 2) {
                delete sortableColumnasReportes[numeroForm][tableKey]
                return false
            }

            try {
                sortableColumnasReportes[numeroForm][tableKey] = new Sortable(elFilaTitulos, {
                    animation: 120,
                    draggable: "th:not(._id):not(.oculto):not(.transparent):not([oculto='true'])",
                    handle: ".reorder-col-handle",
                    filter: ".resize-col-handle",
                    preventOnFilter: false,
                    direction: "horizontal",
                    swapThreshold: 0.35,
                    invertSwap: true,
                    forceFallback: true,
                    fallbackOnBody: true,
                    fallbackTolerance: 2,
                    ghostClass: "sortable-ghost-item",
                    chosenClass: "sortable-chosen-item",
                    dragClass: "sortable-drag-item",
                    onStart: () => {
                        contenedor.addClass("reordering-col")
                        limpiarPreviewDropReporte(numeroForm)
                    },
                    onMove: (evt) => {
                        marcarPreviewDropReporte(numeroForm, evt, "columna")
                        return true
                    },
                    onEnd: () => {
                        const tableState = getTableStateReporte(state, tableKey)
                        const ordenActual = obtenerOrdenHeadersDragReporte(tabla)
                        tableState.orden = aplicarOrdenTablaReporte(tabla, ordenActual)
                        reaplicarStickyColumnasRegistradasReportes(numeroForm)
                        guardarResizeCookieReporte(state)
                        limpiarPreviewDropReporte(numeroForm)
                        contenedor.removeClass("reordering-col")
                    }
                })
                return true
            } catch (error) {
                console.error(`Error creando sortable de columnas (${tableKey})`, error)
                delete sortableColumnasReportes[numeroForm][tableKey]
                return false
            }
        }

        ejecutarInitSortableConRetryReporte(numeroForm, tableKey, "columna", initColumnas)
    })
}
function inicializarReordenamientoFilasReportes(numeroForm, objeto) {

    const contenedor = $(`#t${numeroForm}`)
    const state = getResizeStateReportes(numeroForm, objeto)
    sortableFilasReportes[numeroForm] = sortableFilasReportes[numeroForm] || {}

    contenedor.find("table").each((_, t) => {
        const tabla = $(t)
        const tableKey = tabla.attr("data-resize-key")
        if (!tableKey) return

        const initFilas = () => {
            const contenedorFilas = obtenerContenedorFilasReporte(tabla)
            const elContenedorFilas = contenedorFilas.get(0)
            if (!elContenedorFilas || !elContenedorFilas.isConnected) {
                delete sortableFilasReportes[numeroForm][tableKey]
                return false
            }

            if (sortableFilasReportes[numeroForm]?.[tableKey]?.destroy) {
                try {
                    sortableFilasReportes[numeroForm][tableKey].destroy()
                } catch (error) {
                    console.error(`Error destruyendo sortable de filas (${tableKey})`, error)
                }
            }
            delete sortableFilasReportes[numeroForm][tableKey]

            const filasDrag = obtenerFilasTablaReporte(tabla).filter((_, tr) => esFilaDraggeableReporte($(tr)) && !!$(tr).attr("data-row-id"))
            if (filasDrag.length < 2) {
                delete sortableFilasReportes[numeroForm][tableKey]
                return false
            }

            try {
                sortableFilasReportes[numeroForm][tableKey] = new Sortable(elContenedorFilas, {
                    animation: 120,
                    draggable: "tr[data-row-id]:not(.titulosFila):not(.segunFilaTitulos):not(.filtros):not(.filaTotal)",
                    handle: ".reorder-row-handle",
                    filter: ".resize-row-handle",
                    preventOnFilter: false,
                    direction: "vertical",
                    swapThreshold: 0.35,
                    invertSwap: true,
                    forceFallback: true,
                    fallbackOnBody: true,
                    fallbackTolerance: 2,
                    ghostClass: "sortable-ghost-item",
                    chosenClass: "sortable-chosen-item",
                    dragClass: "sortable-drag-item",
                    onStart: () => {
                        contenedor.addClass("reordering-row")
                        limpiarPreviewDropReporte(numeroForm)
                    },
                    onMove: (evt) => {
                        marcarPreviewDropReporte(numeroForm, evt, "fila")
                        return true
                    },
                    onEnd: () => {
                        const tableState = getTableStateReporte(state, tableKey)
                        const ordenActual = obtenerOrdenFilasDragReporte(tabla)
                        tableState.filas = aplicarOrdenFilasTablaReporte(tabla, ordenActual)
                        guardarResizeCookieReporte(state)
                        limpiarPreviewDropReporte(numeroForm)
                        contenedor.removeClass("reordering-row")
                    }
                })
                return true
            } catch (error) {
                console.error(`Error creando sortable de filas (${tableKey})`, error)
                delete sortableFilasReportes[numeroForm][tableKey]
                return false
            }
        }

        ejecutarInitSortableConRetryReporte(numeroForm, tableKey, "fila", initFilas)
    })
}
function inicializarResizeTablaReportes(numeroForm, objeto) {

    const contenedor = $(`#t${numeroForm}`)
    if (!contenedor.length) return

    insertarHandlesResizeReportes(numeroForm)
    restaurarResizeReportes(numeroForm, objeto)
    aplicarStickyDesdeConfigReporte(numeroForm, objeto)
    inicializarReordenamientoColumnasReportes(numeroForm, objeto)
    inicializarReordenamientoFilasReportes(numeroForm, objeto)
    reaplicarStickyColumnasRegistradasReportes(numeroForm)

    contenedor.off(".resizeRep")
    $(document).off(`.resizeRep${numeroForm}`)

    const state = getResizeStateReportes(numeroForm, objeto)
    let drag = null

    const terminarDrag = () => {
        drag = null
        contenedor.removeClass("resizing-col resizing-row")
        document.body.style.cursor = ""
    }

    contenedor.on("mousedown.resizeRep", ".resize-col-handle", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const th = $(e.currentTarget).closest("th, td")
        const tabla = th.closest("table")
        if (!th.length || !tabla.length) return

        const tableKey = tabla.attr("data-resize-key")
        if (!tableKey) return

        const referenciaColumna = th.attr("data-col-id") || th.index()
        drag = {
            tipo: "columna",
            tabla,
            tableKey,
            referenciaColumna,
            start: e.pageX,
            sizeInicial: obtenerAnchoInicialColumnaReporte(th)
        }
        contenedor.addClass("resizing-col")
        document.body.style.cursor = "col-resize"
    })

    contenedor.on("mousedown.resizeRep", ".resize-row-handle", (e) => {
        e.preventDefault()
        e.stopPropagation()

        const fila = $(e.currentTarget).closest("tr")
        if (!fila.length) return

        drag = {
            tipo: "fila",
            fila,
            start: e.pageY,
            sizeInicial: fila.outerHeight() || 32
        }
        contenedor.addClass("resizing-row")
        document.body.style.cursor = "row-resize"
    })

    $(document).on(`mousemove.resizeRep${numeroForm}`, (e) => {
        if (!drag) return
        e.preventDefault()

        if (drag.tipo === "columna") {
            const nuevoAncho = drag.sizeInicial + (e.pageX - drag.start)
            aplicarAnchoColumnaReporte(drag.tabla, drag.referenciaColumna, nuevoAncho)

            const tableState = getTableStateReporte(state, drag.tableKey)
            tableState.columnas[drag.referenciaColumna] = Math.max(80, Math.round(nuevoAncho))
            return
        }

        const nuevoAlto = drag.sizeInicial + (e.pageY - drag.start)
        aplicarAlturaFilaReporte(drag.fila, nuevoAlto)
    })

    $(document).on(`mouseup.resizeRep${numeroForm}`, () => {
        if (!drag) return

        if (drag.tipo === "columna") {
            guardarResizeCookieReporte(state)
            reaplicarStickyColumnasRegistradasReportes(numeroForm)
        }
        terminarDrag()
    })
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
    const resetearFiltrosReporte = ($tabla) => {
        if (!$tabla?.length) return;

        $tabla.find(`tr[class*="oculto"]`).removeClass(function (index, className) {
            return (className.match(/\boculto\S*/g) || []).join(' ');
        });

        $tabla.find(`tr.filtros td.filtro`)
            .removeClass("filtroDeshabilitado")
            .find("input.filtro")
            .prop("disabled", false)
            .val("");

        $tabla.find(`tr.filtros td.filtro .closeFiltro`).removeClass("oculto");

        $tabla.find(`.busquedasColumna`).each((_, columna) => {
            $(`.filtroCampo`, columna).slice(2).remove();
        });
    };
    const filaFiltroOculto = (e) => {
        const $tabla = $(e.target).closest("table");

        if ($(e.target).hasClass("active")) resetearFiltrosReporte($tabla);

        $(e.target).parents('table').find('tr.filtros').toggleClass('active');
        actualizarBarraRegistros($tabla);
    }
    const parsearValorNumericoSeleccionReporte = ($celda) => {
        if (!$celda?.length) return null;

        const texto = ($celda.text() ?? "").toString().trim();
        if (!texto) return null;

        const tipoCelda = (($celda.attr("type") || "").toString().toLowerCase().trim());
        const esNumericoPorTipo = esTipoNumerico(tipoCelda);
        if (!esNumericoPorTipo && /[a-zA-Z]/.test(texto)) return null;

        const numeroDirecto = Number(texto.replace(/\s+/g, ""));
        if (!Number.isNaN(numeroDirecto)) return numeroDirecto;

        const numeroLocal = Number(stringANumero(texto));
        if (!Number.isNaN(numeroLocal)) return numeroLocal;

        return null;
    };
    const calcularSumaSeleccionReporte = ($tabla) => {
        if (!$tabla?.length) return { suma: 0, cantidad: 0 };

        let suma = 0;
        let cantidad = 0;

        $tabla.find("td.seleccionada:visible").each((_, celda) => {
            const numero = parsearValorNumericoSeleccionReporte($(celda));
            if (numero == null) return;
            suma += numero;
            cantidad++;
        });

        return { suma, cantidad };
    };
    const contarCeldasSeleccionadasReporte = ($tabla) => {
        if (!$tabla?.length) return 0;
        return $tabla.find("td.seleccionada").length;
    };
    const actualizarBarraRegistros = ($tabla) => {
        if (!$tabla?.length) return;

        const registrosVisibles = $tabla.find("tr").filter((_, fila) => {
            const $fila = $(fila);
            return !$fila.is(".titulosFila, .segunFilaTitulos, .filtros, .filaTotal") && $fila.is(":visible");
        }).length;

        const barra = $tabla.nextAll(".barraCalculada").first();
        if (!barra.length) return;

        const datosCalculados = barra.find(".datosCalculados").first();
        if (!datosCalculados.length) return;

        let pRegistros = datosCalculados.find("p.registrosCalculados").first();
        if (!pRegistros.length) {
            pRegistros = datosCalculados.find("p").first();
            if (pRegistros.length) pRegistros.addClass("registrosCalculados");
            else pRegistros = $(`<p class="registrosCalculados"></p>`).appendTo(datosCalculados);
        }
        pRegistros.text(`Registros: ${registrosVisibles}`);

        let pCeldasSel = datosCalculados.find("p.celdasSeleccionadasCalculadas").first();
        if (!pCeldasSel.length) {
            pCeldasSel = $(`<p class="celdasSeleccionadasCalculadas"></p>`);
            pCeldasSel.css("margin-left", "1rem");
            datosCalculados.append(pCeldasSel);
        }
        const cantidadCeldasSeleccionadas = contarCeldasSeleccionadasReporte($tabla);
        if (cantidadCeldasSeleccionadas > 0) {
            pCeldasSel.text(`Celdas: ${cantidadCeldasSeleccionadas}`).show();
        } else {
            pCeldasSel.hide();
        }

        let pSuma = datosCalculados.find("p.sumaSeleccionCalculada").first();
        if (!pSuma.length) {
            pSuma = $(`<p class="sumaSeleccionCalculada"></p>`);
            pSuma.css("margin-left", "1rem");
            datosCalculados.append(pSuma);
        }
        const { suma, cantidad } = calcularSumaSeleccionReporte($tabla);
        const mostrarSuma = cantidad > 0 && Math.abs(Number(suma) || 0) > 1e-10;
        if (mostrarSuma) {
            pSuma.text(`Suma: ${numeroAString(suma)}`).show();
        } else {
            pSuma.hide();
        }
    };
    const cerrarFiltrosConCruz = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const $tabla = $(e.currentTarget).closest("table");
        resetearFiltrosReporte($tabla);
        $tabla.find("tr.filtros").removeClass("active");
        $tabla.find("th .iconos .filtro span.filtro.active").removeClass("active");
        actualizarBarraRegistros($tabla);
    };
    const normalizarTexto = (v) => (v ?? "").toString().toLowerCase().trim();
    const parseFechaReporte = (valor) => {
        const texto = (valor ?? "").toString().trim();
        if (!texto) return null;

        const match = texto.match(/\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{1,2}-\d{1,2}/);
        if (!match) return null;

        const fechaTexto = match[0];
        let dia, mes, anio;

        if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(fechaTexto)) {
            [anio, mes, dia] = fechaTexto.split("-").map(Number);
        } else {
            [dia, mes, anio] = fechaTexto.split(/[/-]/).map(Number);
            if (anio < 100) anio += 2000;
        }

        const fecha = new Date(anio, mes - 1, dia);
        if (
            Number.isNaN(fecha.getTime()) ||
            fecha.getFullYear() !== anio ||
            fecha.getMonth() !== (mes - 1) ||
            fecha.getDate() !== dia
        ) return null;

        return fecha.getTime();
    };
    const esTipoNumerico = (tipo) => ["importe", "numero", "cantidad", "numerador", "numeradorCompuesto"].includes(tipo);
    const comparable = (valor, tipo) => {
        if (tipo === "fecha" || tipo === "fechaHora") return parseFechaReporte(valor);
        if (esTipoNumerico(tipo)) {
            const num = parseFloat(stringANumero(valor));
            return Number.isNaN(num) ? null : num;
        }
        return null;
    };
    const coincideConTermino = (termino, fila, filtrado, tipoFiltrado) => {
        const terminoRaw = (termino ?? "").toString();
        if (/^\s+$/.test(terminoRaw)) {
            const textoFilaRaw = ($(`td.${filtrado}`, fila).text() ?? "").toString();
            return textoFilaRaw.trim() === "";
        }

        const buscado = normalizarTexto(terminoRaw);
        const primerCaracter = buscado.slice(0, 1);
        const textoFila = $(`td.${filtrado}`, fila).text() || "";
        const textoFilaNormalizado = normalizarTexto(textoFila);

        if (buscado === "vacio") return textoFilaNormalizado === "";
        if (buscado === "!vacio") return textoFilaNormalizado !== "";

        if (primerCaracter === ">" || primerCaracter === "<") {
            const separador = primerCaracter === ">" ? "<" : ">";
            const valorFilaComp = comparable(textoFila, tipoFiltrado);
            if (valorFilaComp == null) return false;

            if (buscado.includes(separador)) {
                const indiceSep = buscado.indexOf(separador);
                const valA = comparable(buscado.slice(1, indiceSep), tipoFiltrado);
                const valB = comparable(buscado.slice(indiceSep + 1), tipoFiltrado);
                if (valA == null || valB == null) return false;

                if (primerCaracter === ">") return valorFilaComp > valA && valorFilaComp < valB;
                return valorFilaComp < valA && valorFilaComp > valB;
            }

            const valUnico = comparable(buscado.slice(1), tipoFiltrado);
            if (valUnico == null) return false;

            if (primerCaracter === ">") return valorFilaComp > valUnico;
            return valorFilaComp < valUnico;
        }

        return textoFilaNormalizado.includes(buscado);
    };
    const crearCampoFiltro = (inputBase) => {
        const input = $(inputBase).clone(false);
        const campo = $(`<div class="filtroCampo"></div>`);
        const botonEliminar = $(`<span class="material-symbols-outlined deleteFiltroCampo" title="Eliminar campo">delete</span>`);
        campo.append(input).append(botonEliminar);
        return campo;
    };
    const inicializarFiltrosDinamicos = () => {
        $(`#t${numeroForm} tr.filtros td.filtro`).each((_, td) => {
            const tdFiltro = $(td);
            let columna = tdFiltro.children(".busquedasColumna");
            if (!columna.length) {
                const inputs = tdFiltro.children("input.filtro");
                if (!inputs.length) return;
                columna = $(`<div class="busquedasColumna"></div>`);
                inputs.each((__, input) => {
                    columna.append(crearCampoFiltro(input));
                });
                inputs.remove();
                tdFiltro.prepend(columna);
            }

            const cantidadCampos = columna.children(".filtroCampo").length;
            if (cantidadCampos < 2) {
                const inputBase = columna.find("input.filtro").first();
                for (let i = cantidadCampos; i < 2; i++) {
                    columna.append(crearCampoFiltro(inputBase));
                }
            }
        });
    };
    const filtros = (e) => {
        const inputActual = $(e.target);
        const tdFiltro = inputActual.closest("td.filtro");
        const tabla = inputActual.closest("table");
        const registros = $(`tr:not(.filaTotal):not(.titulosFila):not(.filtros)`, tabla);
        const filtrado = tdFiltro.attr("atributo") || inputActual.attr("atributo");
        const tipoFiltrado = inputActual.attr("type");
        const terminos = $(`input.filtro`, tdFiltro)
            .map((_, input) => ($(input).val() ?? "").toString())
            .get()
            .filter((v) => v !== "");

        if (terminos.length === 0) {
            $.each(registros, (_, fila) => {
                $(fila).removeClass(`oculto${filtrado}`);
            });
            actualizarBarraRegistros(tabla);
            return;
        }

        $.each(registros, (_, fila) => {
            const coincide = terminos.some((termino) => coincideConTermino(termino, fila, filtrado, tipoFiltrado));
            if (coincide) $(fila).removeClass(`oculto${filtrado}`);
            else $(fila).addClass(`oculto${filtrado}`);
        });
        actualizarBarraRegistros(tabla);
    }
    const autoAgregarCampoFiltro = (e) => {
        const inputActual = $(e.currentTarget);
        const columna = inputActual.closest(".busquedasColumna");
        if (!columna.length) return;

        const ultimoInput = columna.find(".filtroCampo:last input.filtro");
        const valorUltimo = (ultimoInput.val() ?? "").toString();
        if (valorUltimo === "") return;

        const inputBase = columna.find("input.filtro").first();
        if (!inputBase.length) return;

        const nuevoCampo = crearCampoFiltro(inputBase);
        $("input.filtro", nuevoCampo).val("");
        columna.append(nuevoCampo);
    }

    inicializarFiltrosDinamicos();
    const $contenedorReporte = $(`#t${numeroForm}`);
    const esCeldaSeleccionableReporte = (celda) => {
        const $celda = $(celda);
        if (!$celda.is("td")) return false;
        const $fila = $celda.closest("tr");
        return !$fila.is(".titulosFila, .filtros, .filaTotal");
    };
    const esObjetivoInteractivoReporte = (target) => {
        return $(target).closest("input, textarea, select, button, a, [contenteditable=true]").length > 0;
    };
    const esObjetivoDragResizeReporte = (target) => {
        return $(target).closest(
            ".reorder-row-handle, .resize-row-handle, .reorder-col-handle, .resize-col-handle"
        ).length > 0;
    };
    const limpiarSeleccionCeldasReporte = ($tabla) => {
        if ($tabla?.length) $tabla.find("td.seleccionada").removeClass("seleccionada");
        else $contenedorReporte.find("table td.seleccionada").removeClass("seleccionada");

        const seleccion = window.getSelection?.();
        if (seleccion && seleccion.rangeCount > 0) {
            seleccion.removeAllRanges();
        }
    };
    const obtenerPosicionCeldaReporte = ($celda, $tabla) => {
        const $fila = $celda.closest("tr");
        const filas = $tabla.find("tr").filter((_, fila) => {
            const $filaActual = $(fila);
            return !$filaActual.is(".titulosFila, .filtros, .filaTotal") && $filaActual.is(":visible");
        });
        return {
            filaIdx: filas.index($fila),
            colIdx: $fila.children("td:visible").index($celda)
        };
    };
    const marcarRangoCeldasReporte = ($inicio, $fin) => {
        if (!$inicio?.length || !$fin?.length) return;

        const $tablaInicio = $inicio.closest("table");
        const $tablaFin = $fin.closest("table");
        if (!$tablaInicio.length || !$tablaFin.length || $tablaInicio.get(0) !== $tablaFin.get(0)) return;

        const posInicio = obtenerPosicionCeldaReporte($inicio, $tablaInicio);
        const posFin = obtenerPosicionCeldaReporte($fin, $tablaInicio);
        if (posInicio.filaIdx < 0 || posFin.filaIdx < 0 || posInicio.colIdx < 0 || posFin.colIdx < 0) return;

        limpiarSeleccionCeldasReporte($tablaInicio);

        const filaMin = Math.min(posInicio.filaIdx, posFin.filaIdx);
        const filaMax = Math.max(posInicio.filaIdx, posFin.filaIdx);
        const colMin = Math.min(posInicio.colIdx, posFin.colIdx);
        const colMax = Math.max(posInicio.colIdx, posFin.colIdx);

        const filas = $tablaInicio.find("tr").filter((_, fila) => {
            const $fila = $(fila);
            return !$fila.is(".titulosFila, .filtros, .filaTotal") && $fila.is(":visible");
        });

        filas.each((filaIdx, fila) => {
            if (filaIdx < filaMin || filaIdx > filaMax) return;
            const celdas = $(fila).children("td:visible");
            celdas.each((colIdx, celda) => {
                if (colIdx >= colMin && colIdx <= colMax) {
                    $(celda).addClass("seleccionada");
                }
            });
        });

        actualizarBarraRegistros($tablaInicio);
    };

    let arrastrandoCeldasReporte = false;
    let celdaInicioReporte = null;
    let ultimaCeldaReporte = null;
    let seInicioEnCeldaSeleccionadaReporte = false;
    let huboArrastreSeleccionReporte = false;

    $contenedorReporte.off("mousedown.seleccionCeldaRep", "table td");
    $contenedorReporte.on("mousedown.seleccionCeldaRep", "table td", function (e) {
        if (
            e.button !== 0 ||
            !esCeldaSeleccionableReporte(this) ||
            esObjetivoInteractivoReporte(e.target) ||
            esObjetivoDragResizeReporte(e.target)
        ) return;

        e.preventDefault();
        e.stopPropagation();
        const $celdaActual = $(this);
        arrastrandoCeldasReporte = true;
        celdaInicioReporte = $celdaActual;
        ultimaCeldaReporte = $celdaActual;
        huboArrastreSeleccionReporte = false;
        seInicioEnCeldaSeleccionadaReporte = $celdaActual.hasClass("seleccionada");

        if (!seInicioEnCeldaSeleccionadaReporte) {
            marcarRangoCeldasReporte(celdaInicioReporte, celdaInicioReporte);
        }
    });

    $contenedorReporte.off("mouseover.seleccionCeldaRep", "table td");
    $contenedorReporte.on("mouseover.seleccionCeldaRep", "table td", function (e) {
        if (!arrastrandoCeldasReporte || !esCeldaSeleccionableReporte(this) || !celdaInicioReporte?.length) return;
        e.preventDefault();
        const $celdaActual = $(this);
        ultimaCeldaReporte = $celdaActual;
        if (!$celdaActual.is(celdaInicioReporte)) {
            huboArrastreSeleccionReporte = true;
        }
        marcarRangoCeldasReporte(celdaInicioReporte, $celdaActual);
    });

    $(document).off(`mouseup.seleccionCeldaRep${numeroForm}`);
    $(document).on(`mouseup.seleccionCeldaRep${numeroForm}`, () => {
        if (!arrastrandoCeldasReporte) return;

        if (!huboArrastreSeleccionReporte && celdaInicioReporte?.length) {
            if (seInicioEnCeldaSeleccionadaReporte) {
                limpiarSeleccionCeldasReporte(celdaInicioReporte.closest("table"));
            } else {
                marcarRangoCeldasReporte(celdaInicioReporte, celdaInicioReporte);
            }
        } else if (huboArrastreSeleccionReporte && celdaInicioReporte?.length && ultimaCeldaReporte?.length) {
            marcarRangoCeldasReporte(celdaInicioReporte, ultimaCeldaReporte);
        }

        if (celdaInicioReporte?.length) {
            actualizarBarraRegistros(celdaInicioReporte.closest("table"));
        }

        arrastrandoCeldasReporte = false;
        celdaInicioReporte = null;
        ultimaCeldaReporte = null;
        seInicioEnCeldaSeleccionadaReporte = false;
        huboArrastreSeleccionReporte = false;
    });

    $contenedorReporte.find("table").each((_, tabla) => {
        actualizarBarraRegistros($(tabla));
    });

    $(`#t${numeroForm}`).on("click", `.flechasOrden span.arriba:not(.active)`, ordenarAscendente)
    $(`#t${numeroForm}`).on("click", `.flechasOrden span.abajo:not(.active)`, ordenarDescendente)
    $(`#t${numeroForm}`).on("click", `.flechasOrden span.active`, quitarActive)
    $(`#t${numeroForm}`).off("click.filtroRep", `th .iconos .filtro span.filtro`)
    $(`#t${numeroForm}`).on("click.filtroRep", `th .iconos .filtro span.filtro`, filaFiltroOculto)
    $(`#t${numeroForm}`).off("click.filtroRep", `tr.filtros td.filtro .closeFiltro`)
    $(`#t${numeroForm}`).on("click.filtroRep", `tr.filtros td.filtro .closeFiltro`, cerrarFiltrosConCruz)
    $(`#t${numeroForm}`).on("input", `tr.filtros input`, (e) => {
        autoAgregarCampoFiltro(e);
        filtros(e);
    })
    $(`#t${numeroForm}`).off("dblclick.filtroRep", `tr.filtros td.filtro`)
    $(`#t${numeroForm}`).off("click.filtroRep", `.deleteFiltroCampo`)
    $(`#t${numeroForm}`).on("click.filtroRep", `.deleteFiltroCampo`, (e) => {
        e.stopPropagation();

        const campo = $(e.currentTarget).closest(".filtroCampo");
        const tdFiltro = campo.closest("td.filtro");
        const columna = campo.closest(".busquedasColumna");
        const cantidadCampos = columna.children(".filtroCampo").length;

        if (cantidadCampos <= 2) {
            $("input.filtro", campo).val("").trigger("input");
            return;
        }

        campo.remove();
        $("input.filtro", tdFiltro).first().trigger("input");
    });

    $(`#t${numeroForm} th.${objeto?.ordenDefault?.[0]?.nombre} .flechasOrden span.${objeto?.ordenDefault?.[1]}`).trigger("click")
    $(`#t${numeroForm}`).data("orden-ready", true);
    const filaTitulos = $(`#t${numeroForm} tr.titulosFila`)
    filaTitulos.css({ height: "", minHeight: "", maxHeight: "" })
    filaTitulos.children("th,td").css({ height: "", minHeight: "", maxHeight: "", paddingTop: "", paddingBottom: "" })
    const filasFiltro = $(`#t${numeroForm} tr.filtros`)
    filasFiltro.removeClass("active")
    let alto = $(`#t${numeroForm} tr.titulosFila`).height()
    filasFiltro.css({ "top": `${alto}px` })
    inicializarResizeTablaReportes(numeroForm, objeto)


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

    const columnasSticky = (Array.isArray(columnas) ? columnas : [])
        .map((columna) => normalizarNombreStickyColumnaReporte(columna))
        .filter((nombre) => nombre !== "")
    if (!columnasSticky.length) return

    const contenedor = $(`#t${numeroForm}`)
    if (!contenedor.length) return

    const nombrePrimeraColumna = columnasSticky[0]
    let tablasObjetivo = contenedor.find("table")
    if (nombrePrimeraColumna) {
        const filtradas = tablasObjetivo.filter((_, t) => $(t).find(`th.${nombrePrimeraColumna}`).length > 0)
        if (filtradas.length) tablasObjetivo = filtradas
    }

    tablasObjetivo.each((_, t) => {
        const tabla = $(t)
        tabla.data("stickyColumnasReportes", columnasSticky)
        aplicarStickyColumnasTablaPorNombresReporte(tabla, columnasSticky)
    })

    if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => reaplicarStickyColumnasRegistradasReportes(numeroForm))
    } else {
        setTimeout(() => reaplicarStickyColumnasRegistradasReportes(numeroForm), 0)
    }
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
        console.log(data)
        console.log(datoBuscado)
        let atribut = consultaPestanas[atributo][value[atributo]];
        console.log(atribut)
        let unidades = atribut?.["unidadesMedida"] || [];
        let precios = atribut?.[datoBuscado] || [];
        let monedas = atribut?.["monedaCostos"] || [];

        let index = unidades.indexOf(unidadMedida);
        let buscado = index >= 0 ? precios[index] : precios[0] || 0;
        let moneda = index >= 0 ? monedas[index] : monedas[0] || "";
        if (multiplicador == "totalHorizontal") {
            value["monedaCostos"] = moneda;
            value[nuevoAtributo] = (value?.[multiplicador] || 0) * buscado;

        } else {
            $.each(value.periodos, (ind, val) => {
                val["monedaCostos"] = moneda;
                let cantidad = val?.[multiplicador]
                val[nuevoAtributo] = cantidad * buscado;

            })
        }

    });
    console.log(data)
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
    <div class="fechaHasta"><div class="tituloPick"><h3>Hasta:</h3></div><input type="month" class="MesReporteHasta" name="monthPickerDesde" value="${year}-${month}" ${autoCompOff} ></div>
    <div class="fechaDesde"><div class="tituloPick"><h3>Desde:</h3></div><input type="month" class="MesReporteDesde" name="monthPickerHasta" value="${yearSixMonthsAg}-${monthSixMonthsAg}" ${autoCompOff} ></div>
    </div>`;

    } else if (fecha == "fecha") {

        let fechaDesdeEntidad = objeto.fechaRegistros || fechaDesde

        fechas += `<div class="fechaTablaAbm">
      <div><p>Desde:</p><input name="fechaDesde" type="date" class="fechaTextoDeAbm" value=${fechaDesdeEntidad} ${autoCompOff} ></div>
      <div><p>Hasta:</p><input name="fechaHasta" type="date" class="fechaTextoHastaAbm" value=${fechaHasta} ${autoCompOff} ></div>
      </div>`

    } else if (fecha == "saldos") { // para probar si anda el saldo, volar luego

        let fechaDesdeEntidad = objeto.fechaRegistros || fechaDesde

        fechas += `<div class="fechaTablaAbm">
      <div><p>Desde:</p><input name="fechaDesde" type="date" class="fechaTextoDeAbm" value=${fechaDesdeEntidad} ${autoCompOff} ></div>
      <div><p>Hasta:</p><input name="fechaHasta" type="date" class="fechaTextoHastaAbm" value=${fechaHasta} ${autoCompOff} ></div>
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

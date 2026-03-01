async function getAcumuladorSaldoIncial(acumulado, filtr) {

    let objetoGr = [];
    let objetoGrInit = { $group: { _id: {} } };

    let detalleFiltroAtributos = { ...filtr };
    detalleFiltroAtributos.periodo = stringANumero(`${obtenerAno(filtr.fechaDesdeEntidad)}${obtenerMes(filtr.fechaDesdeEntidad)}`);
    detalleFiltroAtributos.name = acumulado.nombre;
    let entidad = detalleFiltroAtributos.entidad;
    delete detalleFiltroAtributos.entidad;
    let fechaDesdeEntidad = detalleFiltroAtributos.fechaDesdeEntidad;
    delete detalleFiltroAtributos.fechaDesdeEntidad;

    for (const [indice, value] of Object.entries(acumulado.atributos)) {
        objetoGrInit.$group._id[value.nombre || value] = `$${indice}`;
    }

    for (const value of Object.values(acumulado.atributosSuma)) {
        objetoGrInit.$group[value.nombre || value] = { $sum: `$${value.nombre || value}` };
    }
    objetoGr.push(objetoGrInit)
    detalleFiltroAtributos = Object.assign(detalleFiltroAtributos, empresaFiltro)
    const filtros = encodeURIComponent(JSON.stringify(detalleFiltroAtributos));
    const objetoBusqueda = encodeURIComponent(JSON.stringify(objetoGr));

    let saldoAcumulado = 0;
    try {
        const res = await fetch(`/acumulador?filtros=${filtros}&objetoGroup=${objetoBusqueda}`);
        const data = await res.json();
        saldoAcumulado = data?.[0]?.importe || 0;

    } catch (error) {
        console.error("Error acumulador:", error);
    }

    const [y, m, d] = filtr.fechaDesdeEntidad.split("-");
    const diaActual = Number(d);
    const pad = n => String(n).padStart(2, "0");
    const fechaHasta = `${y}-${m}-${pad(diaActual - 1)}`;
    let fechaDesde = null;

    if (d > 1) {
        fechaDesde = `${y}-${m}-01`;
    }
    let detalleFiltroDias = null;
    if (fechaDesde) {
        detalleFiltroDias = {
            coleccion: {
                ...filtr
            },
            cabecera: {
                fecha: {
                    desde: fechaDesde,
                    hasta: fechaHasta
                }
            }

        };
        delete detalleFiltroDias.coleccion.entidad
        delete detalleFiltroDias.coleccion.fechaDesdeEntidad

    }
    const grupoDias = [
        { $group: { _id: null, importe: { $sum: "$importe" } } }
    ];
    let saldoDias = 0;
    if (detalleFiltroDias) {
        const filtrosDias = encodeURIComponent(JSON.stringify(detalleFiltroDias));
        const objetoGroupDias = encodeURIComponent(JSON.stringify(grupoDias));

        try {
            const res = await fetch(`/getGroup?base=${entidad}&filtros=${filtrosDias}&objetoGroup=${objetoGroupDias}`);
            const data = await res.json();
            saldoDias = data?.[0]?.importe || 0;

        } catch (error) {
            console.error("Error movimientos día:", error);
        }
    }
    return saldoAcumulado + saldoDias;
}
function acumuladorUpdate(acum, fileEnviar, objeto) {

    let respuesta = fileEnviar.posteo
    let acumulador = new Object
    acumulador.agrupadores = new Object
    acumulador.atributosNoRequeridos = new Object
    acumulador.atributosTotales = new Object
    acumulador.agrupadores.name = acum.nombre
    let ano = obtenerAno(respuesta.fecha)
    let mes = obtenerMes(respuesta.fecha)
    acumulador.agrupadores.periodo = `${ano}${mes}`
    acumulador.agrupadores.entidad = objeto.accion
    acumulador.date = respuesta.date
    acumulador.username = respuesta.username

    $.each(acum.atributosSuma, (indice, value) => {

        acumulador.atributosNoRequeridos[indice] = respuesta[value.nombre || value]
    })
    $.each(acum.atributos, (indice, value) => {

        acumulador.agrupadores[indice] = respuesta[value.nombre || value]
    })
    $.each(acum.atributosSumaAcumulado, (indice, value) => {

        acumulador.atributosTotales[indice] = respuesta[value.nombre || value]
    })
    acumulador.agrupadores.empresa = empresaSeleccionada?._id || ""
    let anoActual = obtenerAno(new Date())
    let mesActual = obtenerMes(new Date())
    let periodoActual = `${anoActual}${mesActual}`

    $.ajax({
        type: "put",
        url: `/putAcumulador`,
        data: acumulador,
        beforeSend: function (data) { },
        complete: function (data) { },
        success: function (data) {
            console.log(data)
            if (acumulador?.agrupadores?.periodo < periodoActual) {

                fetch('/actualizaTotalesAcum', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(acumulador)
                })
                    .then(res => {
                        if (!res.ok) throw res;
                        return res.json();
                    })
                    .then(data => {
                        ////??????????

                    })
                    .catch(err => {
                        console.log(err);
                    });
            }

        },
        error: function (error) {
            console.log(error);
        },
    })
};
function acumuladorUpdateEdit(acum, fileEnviar, objeto) {
    console.log(acum)
    console.log(fileEnviar)
    console.log(objeto)
    let respuestaAnterior = fileEnviar.anterior
    let ultimaRespuesta = fileEnviar.posteo

    let acumuladorAnterior = new Object
    acumuladorAnterior.agrupadores = new Object
    acumuladorAnterior.atributosNoRequeridos = new Object
    acumuladorAnterior.agrupadores.name = acum.nombre
    let anoAnterior = obtenerAno(respuestaAnterior.fecha)
    let mesAnterior = obtenerMes(respuestaAnterior.fecha)
    acumuladorAnterior.agrupadores.periodo = `${anoAnterior}${mesAnterior}`
    acumuladorAnterior.agrupadores.entidad = objeto.accion
    acumuladorAnterior.date = respuestaAnterior.date
    acumuladorAnterior.username = respuestaAnterior.username


    let acumulador = new Object
    acumulador.agrupadores = new Object
    acumulador.atributosNoRequeridos = new Object
    acumulador.atributosTotales = new Object
    acumulador.agrupadores.name = acum.nombre
    let ano = obtenerAno(ultimaRespuesta.fecha)
    let mes = obtenerMes(ultimaRespuesta.fecha)
    acumulador.agrupadores.periodo = `${ano}${mes}`
    acumulador.agrupadores.entidad = objeto.accion
    acumulador.date = ultimaRespuesta.date
    acumulador.username = ultimaRespuesta.username
    let anoActual = obtenerAno(new Date())
    let mesActual = obtenerMes(new Date())
    let periodoActual = `${anoActual}${mesActual}`

    let change = ""

    $.each(acum.atributos, (indice, value) => {

        if (respuestaAnterior[value.nombre || value] != ultimaRespuesta[value.nombre || value]) {
            change = true

        }

        acumulador.agrupadores[indice] = ultimaRespuesta[value.nombre || value]
        acumuladorAnterior.agrupadores[indice] = respuestaAnterior[value.nombre || value]

    })

    if (change == false) {

        $.each(acum.atributosSuma, (indice, value) => {
            acumulador.atributosNoRequeridos[indice] = (ultimaRespuesta[value.nombre || value] || 0) - (respuestaAnterior[value.nombre || value] || 0)
        })

        $.each(acum.atributosSumaAcumulado, (indice, value) => {
            acumulador.atributosTotales[indice] = (ultimaRespuesta[value.nombre || value] || 0) - (respuestaAnterior[value.nombre || value] || 0)

        })
        acumulador.agrupadores.empresa = empresaSeleccionada?._id || ""
    } else {


        $.each(acum.atributosSuma, (indice, value) => {

            acumulador.atributosNoRequeridos[indice] = ultimaRespuesta[value.nombre || value]
            acumuladorAnterior.atributosNoRequeridos[indice] = (respuestaAnterior[value.nombre || value] * -1)

        })
        $.each(acum.atributosSumaAcumulado, (indice, value) => {

            acumulador.atributosTotales[indice] = (ultimaRespuesta[value.nombre || value] || 0) - (respuestaAnterior[value.nombre || value] || 0)

        })
        acumulador.agrupadores.empresa = empresaSeleccionada?._id || ""

    }
    if (change) {
        $.ajax({
            type: "put",
            url: `/putAcumulador`,
            data: acumuladorAnterior,
            beforeSend: function (data) { },
            complete: function (data) { },
            success: function (data) {


                fetch('/actualizaTotalesAcum', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(acumuladorAnterior)
                })
                    .then(res => {
                        if (!res.ok) throw res;
                        return res.json();
                    })
                    .then(data => {
                        //   ????????????????

                    })
                    .catch(err => {
                        console.log(err);
                    });

            },
            error: function (error) {
                console.log(error);
            },
        })
    }
    $.ajax({

        type: "put",
        url: `/putAcumulador`,
        data: acumulador,
        beforeSend: function (data) { },
        complete: function (data) { },
        success: function (data) {
            if (acumulador?.agrupadores?.periodo < periodoActual) {

                fetch('/actualizaTotalesAcum', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(acumulador)
                })
                    .then(res => {
                        if (!res.ok) throw res;
                        return res.json();
                    })
                    .then(data => {
                        //   ????????????????

                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        error: function (error) {
            console.log(error);
        },
    })


};
function acumuladorUpdateDelete(acum, fileEnviar, objeto) {

    let respuesta = fileEnviar.posteo || fileEnviar.updt

    let acumulador = new Object
    acumulador.agrupadores = new Object
    acumulador.atributosNoRequeridos = new Object
    acumulador.atributosTotales = new Object
    acumulador.agrupadores.name = acum.nombre
    let ano = obtenerAno(respuesta.fecha)
    let mes = obtenerMes(respuesta.fecha)
    acumulador.agrupadores.periodo = `${ano}${mes}`
    acumulador.date = respuesta.date
    acumulador._id = respuesta._id
    acumulador.username = respuesta.username
    let anoActual = obtenerAno(new Date())
    let mesActual = obtenerMes(new Date())
    let periodoActual = `${anoActual}${mesActual}`
    $.each(acum.atributosSuma, (indice, value) => {

        acumulador.atributosNoRequeridos[indice] = (respuesta[value.nombre || value]) * -1
    })
    $.each(acum.atributos, (indice, value) => {

        acumulador.agrupadores[indice] = respuesta[value.nombre || value]
    })
    $.each(acum.atributosSumaAcumulado, (indice, value) => {

        acumulador.atributosTotales[indice] = (respuesta[value.nombre || value]) * -1
    })
    acumulador.agrupadores.empresa = empresaSeleccionada?._id || ""
    $.ajax({
        type: "put",
        url: `/putAcumulador`,
        data: acumulador,
        beforeSend: function (data) { },
        complete: function (data) { },
        success: function (data) {
            if (acumulador?.agrupadores?.periodo < periodoActual) {

                fetch('/actualizaTotalesAcum', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(acumulador)
                })
                    .then(res => {
                        if (!res.ok) throw res;
                        return res.json();
                    })
                    .then(data => {
                        ////??????????


                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },

        error: function (error) {
            console.log(error);
        },
    })
};
function saldoInicialConRegistros(objeto, numeroForm, consulta, fechaDesde) {

    let saldoIncial = 0

    consulta.filter(element => obtenerMes(element.fecha) == obtenerMes(fechaDesde)).map(function (obj) {

        saldoIncial += parseFloat(stringANumero(obj.importe))

    });

    return saldoIncial

}
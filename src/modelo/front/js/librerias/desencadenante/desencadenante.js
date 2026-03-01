async function desencadenante(desencadenante, objeto, numeroForm, response) {

    const origenDes = {
        child: "origenChild",
        desencadenante: "origenDesencadenante"
    }
    const tipoDesencadenante = {
        condicionSegunFuncion,
        directo: desencadenaDirecto
    }

    let desencadena = tipoDesencadenante[desencadenante.type || "directo"](desencadenante, response.posteo) || false

    if (desencadena != false) {

        let idDesen = obtencionidDesen(desencadena, response.posteo)

        let tipoDeEnvio = (idDesen == "") ? "post" : "put"  //Si el posteo tiene un id, es un put, sino es un post

        let fileEnviarDesencadenate = fileDesencadenante(response)//basicamente aagarro el objeto original, lo copio disasociado con los {...} luego le paso el id, como id origen y elimino el id

        let objetoDestino = variablesModelo[desencadena.destino]

        if (entidadesConsultas[objetoDestino?.nombre || objetoDestino?.accion] == undefined) {
            agregarCaractAtributos(objetoDestino)
            seguridadAtributos(objetoDestino)
            entidadesConsultas[objetoDestino.nombre || objetoDestino.accion] = true
        }

        let objetoFinal = new Object
        const accionesPost = async () => {

            objetoFinal = await modificarObjetoAEnviar(desencadena.atributos, fileEnviarDesencadenate)
            let objetoEnDestino = new Object

            objetoEnDestino[desencadena.identificador] = {
                _id: fileEnviarDesencadenate._idOrigen,
                nombre: objeto.pest,
                entidad: objeto.accion,
                origen: "entidad",
                mostrar: new Object
            }

            fileEnviarDesencadenate.referencias = {}
            fileEnviarDesencadenate.autoImputo = {}

            fileEnviarDesencadenate.referencias[origenDes[desencadena.origen]] = Object.assign(fileEnviarDesencadenate.origen || {}, objetoEnDestino || {})

            $.each(desencadena.grabarEnDestino, (indice, value) => {

                objetoEnDestino[desencadena.identificador].mostrar[indice] = response.posteo[value.nombre || value] || objetoFinal[value]
            })

            if (objetoDestino.numerador != undefined) {

                let numeradorObjeto = await insertarNumeradorDesencadenante(objetoDestino, numeroForm)
                objetoFinal.numerador = numeradorObjeto.numerador

                $.each(objetoDestino.numerador.componentes, (indice, value) => {

                    objetoFinal[value.nombre || value] = numeradorObjeto[value.nombre || value]
                })
                $.each(objetoDestino.numerador.complemento, (indice, value) => {

                    objetoFinal[value.nombre || value] = numeradorObjeto[value.nombre || value]
                })
            }
        }
        const accionePut = async () => {

            fileEnviarDesencadenate._id = idDesen
            objetoFinal = await modificarObjetoAEnviar(Object.assign(desencadena.atributos), fileEnviarDesencadenate)
            delete objetoFinal.historia // borro historia porque sino se duplica en el back, con el push historia no hace falta que la manda explicita
            delete objetoFinal.version
        }

        const accionesSegunEnvio = {
            "post": accionesPost,
            "put": accionePut
        }

        await accionesSegunEnvio[tipoDeEnvio]()

        $.ajax({
            type: tipoDeEnvio,
            url: `/${tipoDeEnvio}?base=${desencadena.destino}`,
            dataType: "JSON",
            async: false,
            contentType: "application/json",
            data: JSON.stringify(objetoFinal),
            success: function (respon) {

                let posteo = respon.posteo

                $.each(objetoDestino.acumulador, (indice, value) => {

                    acumuladorUpdate(value, respon, objetoDestino)
                })
                //actualizar Id del registro enviado
                let grabarEnOrigen = new Object

                grabarEnOrigen[desencadena.identificador] = {
                    _id: posteo._id,
                    nombre: objetoDestino.pest,
                    entidad: objetoDestino.accion,
                    destino: desencadena.origen,
                    mostrar: new Object
                }

                $.each(desencadena.grabarEnOrigen, (indice, value) => {

                    grabarEnOrigen[desencadena.identificador].mostrar[indice] = posteo[value.nombre || value]

                })

                let valor = Object.assign(fileEnviarDesencadenate?.referencias?.[desencadena.origen] || {}, grabarEnOrigen || {})

                let envioIdDesencadenado = {
                    _id: fileEnviarDesencadenate._idOrigen,

                }

                envioIdDesencadenado[`referencias.${desencadena.origen}`] = valor

                $.ajax({
                    type: "put",
                    dataType: "JSON",
                    contentType: "application/json",
                    url: `/put?base=${objeto.accion}&vers=no`,
                    data: JSON.stringify(envioIdDesencadenado),
                    success: function (response) { },
                    error: function (error) {
                        console.log(error);
                    },
                });
            },
            error: function (error) {

                console.log(error);
            },
        });
    } else {

        let data = response?.posteo

        if (data?.referencias?.[desencadenante?.origen]?.[desencadenante?.identificador]._id != undefined) {

            responseDelete(objeto, desencadenante, data, data?.referencias?.[desencadenante?.origen]?.[desencadenante?.identificador]._id)

        }
    }
}
function desencadenaColec(desencadenante, objeto, numeroForm, response, tableModificadas) {
    console.log(response)
    return new Promise(async (resolve, reject) => {
        const origenDes = {
            childColec: "referencias.origenChild",
            desencadenaColeccion: "referencias.origenDesencadenante"
        }
        let contador = ""

        const atributoGrabar = {
            desencadenaColeccion: { "referencias.desencadenantesColec": new Object },
            childColec: { "referencias.childColec": new Object }
        }
        const tipoDesencadenante = {
            condicionSegunFuncion,
            directo: desencadenaDirecto
        }

        const postPut = {
            0: "post",
            1: "put"
        }

        let fileCabecera = fileDesencadenante(response)//Limpia la respuesta del id original y las referencias

        if (response?.anterior !== undefined) {

            await responseDeleteColecion(objeto, desencadenante, response); // ← acá usás await
        }
        fileCabecera.historia = fileCabecera?.historia[Object.values(fileCabecera.historia).length - 1]

        let enviarObjetosPlanchado = unWindJavaScript(objeto, fileCabecera, desencadenante)

        contador = Object.values(enviarObjetosPlanchado).length

        let objetograbarEnOrigen = new Object
        objetograbarEnOrigen._id = response.posteo._id

        let respuestasOrigen = new Object

        for (const [indiceRespuesta, valueRespuesta] of Object.entries(enviarObjetosPlanchado)) {
            try {

                let desencadena = tipoDesencadenante[desencadenante.type](desencadenante, valueRespuesta) || false
                desencadena.origen = desencadenante.origen

                let idDesencadenado = valueRespuesta?.[`idCol${desencadena.identificador || desencadenante.identificador}`]

                let type = postPut[Math.min(idDesencadenado?.length || 0, 1)]
                let objetoDestino = variablesModelo[desencadena.destino]

                contador--

                if (desencadena != false && (type == "post" || tableModificadas?.[desencadena.coleccionOrigen.nombre]?.[valueRespuesta[`position${desencadena.coleccionOrigen.nombre}`]] != undefined)) {

                    if (entidadesConsultas[objetoDestino.nombre || objetoDestino.accion] == undefined) {
                        agregarCaractAtributos(objetoDestino)
                        seguridadAtributos(objetoDestino)
                        entidadesConsultas[objetoDestino.nombre || objetoDestino.accion] = true
                    }

                    let grabarEnDestino = new Object

                    objetograbarEnOrigen.array = (objetograbarEnOrigen.array || [])?.concat(valueRespuesta.indiceArray)
                    objetograbarEnOrigen.atributosArray = objetograbarEnOrigen?.atributosArray || {}
                    objetograbarEnOrigen.atributosCabecera = objetograbarEnOrigen?.atributosCabecera || {}
                    objetograbarEnOrigen.referencias = objetograbarEnOrigen?.referencias || atributoGrabar[desencadena.origen]

                    grabarEnDestino[desencadena.identificador] = {
                        _id: response._id || response.posteo._id,
                        nombre: objeto.pest,
                        entidad: objeto.accion,
                        origen: "coleccion",
                        indice: indiceRespuesta,
                        mostrar: new Object
                    }

                    $.each(desencadena.grabarEnDestino, (indice, value) => {
                        grabarEnDestino[desencadena.identificador].mostrar[indice] = valueRespuesta[value]
                    })

                    valueRespuesta[[origenDes[desencadena.origen]]] = Object.assign(valueRespuesta.origen || {}, grabarEnDestino || {})

                    let fileColeccionFinal = { ...(await modificarObjetoAEnviar(desencadena.atributosColeccion, valueRespuesta)) }

                    if (fileColeccionFinal[`idCol${desencadena.identificador}`].length == 0) {
                        //esto es para los post
                        if (objetoDestino.numerador != undefined) {

                            let numeradorObjeto = await insertarNumeradorDesencadenante(objetoDestino, numeroForm)
                            fileColeccionFinal.numerador = numeradorObjeto.numerador

                            $.each(objetoDestino.numerador.componentes, (indice, value) => {
                                fileColeccionFinal[value.nombre || value] = numeradorObjeto[value.nombre || value]
                            })
                            $.each(objetoDestino.numerador.complemento, (indice, value) => {
                                fileColeccionFinal[value.nombre || value] = numeradorObjeto[value.nombre || value]
                            })
                        }

                    } else {
                        //esto es para los put
                        fileColeccionFinal._id = fileColeccionFinal[`idCol${desencadena.identificador}`]
                        fileColeccionFinal.modificaciones = JSON.stringify(fileColeccionFinal?.historia?.modificaciones?.coleccion)
                        fileColeccionFinal.descripcionEnvio = "Modificación por desencadenante"

                        delete fileColeccionFinal.historia
                        delete fileColeccionFinal.version
                        delete fileColeccionFinal.autoImputo
                    }

                    $.ajax({
                        type: `${type}`,
                        url: `/${type}?base=${desencadena.destino}`,
                        async: false,
                        data: fileColeccionFinal,
                        success: function (response) {

                            let posteo = { ...response?.posteo }

                            let objetoD = objetoDestino || {}

                            console.log(objetoD)
                            console.log(response)

                            if (type == "post") {
                                $.each(objetoD.acumulador, (indice, value) => {
                                    console.log(value)

                                    acumuladorUpdate(value, response, objetoD)
                                })

                            } else {
                                $.each(objetoD.acumulador, (indice, value) => {
                                    console.log(value)
                                    acumuladorUpdateEdit(value, response, objetoD)
                                })
                            }

                            respuestasOrigen = objetosColeccion(desencadena, objetograbarEnOrigen, posteo, valueRespuesta.indiceArray)

                            if (contador == 0) {
                                resolve(respuestasOrigen)
                            }
                        },
                        error: function (error) {
                            console.log(error)
                        },
                    });
                } else if (contador == 0) {

                    if (Object.values(respuestasOrigen).length > 0) {
                        resolve(respuestasOrigen)
                    } else {
                        reject("Rechazado")
                    }
                }
            } catch (error) {
                console.error(`Error en desencadenaColec [índice ${indiceRespuesta}]:`, error)
                return reject(error); // frena el bucle y la función
            }
        };
    });
}
async function desencadenanteAgrupado(desencadena, objeto, numeroForm, response) {

    let atributoMain = desencadena.atributosMain[0]
    let atributoSecond = desencadena.atributosMain.slice(1) || []
    let objetoDestino = variablesModelo[desencadena.destino]
    let nuevosRegistros = []

    if (response?.anterior !== undefined) {

        await responseDeleteColecion(objeto, desencadena, response); // ← acá usás await
    }

    const postPut = {
        0: "post",
        1: "put"
    }

    const base = response.posteo;

    let objetograbarEnOrigen = new Object
    objetograbarEnOrigen._id = response.posteo._id

    if (atributoSecond.length > 0) {

        const acc = {};
        const arrMain = base?.[atributoMain] || [];

        for (let i = 0; i < arrMain.length; i++) {

            const atributo = arrMain[i];
            if (!atributo) continue;

            let faltan = false;
            for (const val of atributoSecond) {
                const v = base?.[val]?.[i];
                if (!v) { faltan = true; break; }
            }
            if (faltan) continue;

            let key = `${atributo}`;
            let objetoKey = {};

            for (const val of atributoSecond) {
                const v = base[val][i];
                objetoKey[val] = v;
                key += `-${v}`;
            }

            if (!acc[key]) {
                acc[key] = Object.assign({}, base, {
                    [atributoMain]: atributo,
                    ...objetoKey,
                    indicesFusion: []
                });

                acc[key] = await modificarObjetoAEnviar(desencadena.atributosFusion, acc[key]);
                delete acc[key]._id;
            }

            $.each(desencadena.atributosIndice, (indice, value) => {
                switch (indice) {
                    case "suma":
                        $.each(value, (ind, val) => {
                            acc[key][ind] = (acc[key]?.[ind] || 0) + (base[val]?.[i] || 0);
                        });
                        break;
                }
            });

            $.each(desencadena.funcionesFusion, (indice, value) => {
                acc[key][indice] = value[0](acc[key], value[1]);
            });

            delete acc[key].referencias;
            delete acc[key].version;
            delete acc[key].historia;

            acc[key]._id = acc[key]._id || base?.[`idCol${desencadena.identificador}`]?.[i] || "";
            acc[key].indicesFusion.push(i);
        }

        nuevosRegistros = Object.values(acc);
    }


    let contador = nuevosRegistros.length
    let respuestasOrigenFinal;

    return new Promise(async (resolve, reject) => {
        try {

            if (contador > 0) {
                if (entidadesConsultas[objetoDestino.nombre || objetoDestino.accion] == undefined) {
                    agregarCaractAtributos(objetoDestino);
                    seguridadAtributos(objetoDestino);
                    entidadesConsultas[objetoDestino.nombre || objetoDestino.accion] = true;
                }

                for (const [indice, registro] of nuevosRegistros.entries()) {
                    registro.indiceArray = indice;
                    contador--;

                    let grabarEnDestino = {};
                    let type = postPut[Math.min(registro._id?.length || 0, 1)];

                    objetograbarEnOrigen.array = (objetograbarEnOrigen.array || []).concat(registro.indicesFusion);
                    objetograbarEnOrigen.atributosArray = objetograbarEnOrigen.atributosArray || {};
                    objetograbarEnOrigen.atributosCabecera = objetograbarEnOrigen.atributosCabecera || {};
                    objetograbarEnOrigen.referencias = objetograbarEnOrigen.referencias || { "referencias.desenColecAgrup": {} };

                    grabarEnDestino[desencadena.identificador] = {
                        _id: base._id,
                        nombre: objeto.pest,
                        entidad: objeto.accion,
                        origen: "fusion",
                        indice: indice,
                        mostrar: {}
                    };

                    $.each(desencadena.grabarEnDestino, (i, v) => {
                        grabarEnDestino[desencadena.identificador].mostrar[i] = base[v];
                    });

                    if (type == "post" && objetoDestino.numerador != undefined) {
                        let numeradorObjeto = await insertarNumeradorDesencadenante(objetoDestino, numeroForm);

                        registro.numerador = numeradorObjeto.numerador;

                        $.each(objetoDestino.numerador.componentes, (i, v) => {
                            registro[v.nombre || v] = numeradorObjeto[v.nombre || v];
                        });

                        $.each(objetoDestino.numerador.complemento, (i, v) => {
                            fileColeccionFinal[v.nombre || v] = numeradorObjeto[v.nombre || v];
                        });
                    }

                    registro.referencias = registro.referencias || {};
                    registro.referencias.origenDesencadenanteAgrupado = grabarEnDestino;

                    const resp = await fetch(`/${type}?base=${desencadena.destino}`, {
                        method: String(type).toUpperCase(),
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(registro),
                    });

                    const json = await resp.json();
                    const posteo = { ...(json?.posteo || {}) };

                    if (type == "post") {
                        $.each(objetoDestino.acumulador, (i, v) => {
                            acumuladorUpdate(v, respFetch, objetoD);
                        });
                    } else {
                        $.each(objetoDestino.acumulador, (i, v) => {
                            acumuladorUpdateEdit(v, respFetch, objetoD);
                        });
                    }

                    respuestasOrigenFinal = objetosColeccionFusion(desencadena, objetograbarEnOrigen, posteo, registro.indicesFusion);
                }

                return resolve(respuestasOrigenFinal || null);
            }

            // contador == 0
            return resolve(null);
        } catch (e) {
            return reject(e);
        }
    });
}
function fileDesencadenante(response) {//Limpia la respuesta del id original y las referencias

    let envioObject = { ...response.posteo }

    envioObject._idOrigen = envioObject._id

    delete envioObject._id
    delete envioObject.referencias

    return envioObject

}
function fileDesencadenante(response) {//Limpia la respuesta del id original y las referencias
    let envioObject = { ...response.posteo }

    envioObject._idOrigen = envioObject._id

    delete envioObject._id
    delete envioObject.referencias

    return envioObject

}
function obtencionidDesen(desencadena, fila) {

    crumb("obtencionidDesen:errorCheck", { // 09/02/2026
        destino: desencadena?.destino,
        existeFila: !!fila,
        existeReferencias: !!fila?.referencias,
        existeDesencadenante: !!fila?.referencias?.desencadenante,
        keysDesencadenante: fila?.referencias?.desencadenante
            ? Object.keys(fila.referencias.desencadenante)
            : null,
        valorDestino: desencadena?.destino
            ? fila?.referencias?.desencadenante?.[desencadena.destino] ?? null
            : null
    });

    let idDesen = fila?.referencias?.desencadenante?.[desencadena?.destino]

    return idDesen?._id || ""
}
function desencadenanteAgrupadoColeccionVistaPrevia(desencadena, objeto, numeroForm, response) {

    let arrayResponse = new Object //Este se crea para hacer una grabacion por id, los unifico en el siguiente each
    $.each(response, (indice, value) => {

        arrayResponse[value._id] = arrayResponse[value._id] || new Array
        arrayResponse[value._id].push(value)
    })

    let objetoGuardar = desencadenaAgrup(desencadena, objeto, response)

    let objetoDestino = variablesModelo[desencadena.destino]
    let datosEnviar = new Object
    $.each(desencadena?.atributosFusion, (indice, value) => {

        datosEnviar[indice] = response[0][value.nombre || value]
    })

    $.each(desencadena?.cabeceraAColec, (indice, value) => {
        datosEnviar[indice] = []
        $.each(response, (ind, val) => {

            datosEnviar[indice].push(val[value.nombre || value])
        })
    })
    $.each(response, (ind, resp) => {

        $.each(desencadena.atributosConcatenar, (indice, value) => {

            datosEnviar[value.nombre || value] = (datosEnviar[value.nombre || value] || []).concat(resp[value.nombre || value])

        })
    })

    modificarObjetoAEnviar(desencadena.atributos, datosEnviar)

    $.each(desencadena.formacionFuncionesAtributosFinal, (indice, value) => {

        value[0](datosEnviar, objetoDestino)

    })

    delete datosEnviar._id
    datosEnviar.username = usu
    datosEnviar.date = dateNowAFechaddmmyyyy(Date.now(), `y-m-dThh`);

    $.each(objeto?.destinoTrigger, (indice, value) => {
        triggerAtrDestino(numeroForm, objeto.destinoTrigger)
    })

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    clickFormularioIndividualVistaPrevia(objetoDestino, numeroForm, datosEnviar).then((resultado) => {

        let editarOrigenObj = new Object
        let ident = resultado.posteo._id
        let objetoEnOrigenInicial = new Object

        /*Esta es la referencia de la operación original*/
        $.extend(true, objetoEnOrigenInicial, { referencias: { desencAgrup: new Object } });

        objetoEnOrigenInicial.referencias.desencAgrup[ident] = {
            _id: resultado.posteo._id,
            nombre: desencadena.nombre,
            entidad: desencadena.destino,
            origen: "coleccion",
            type: desencadena.type,
            mostrar: new Object
        }

        let valorenOrigen = ""

        $.each(desencadena.grabarEnOrigen, (indice, value) => {

            valorenOrigen += `${resultado.posteo[value.nombre || value]} `

            objetoEnOrigenInicial.referencias.desencAgrup[ident].mostrar[value.titulo] = resultado.posteo[value.nombre]
        })

        valorenOrigen = valorenOrigen.slice(0, -1);

        /*Aca guardo el origen del objeto, y si bien hice el post recientemente, no tengo menera de sumarlo a post porque es un form data 
        y no puedo pasarle objeto y si paso un json, despues tendraias que cambiar el codigo de back end solo por esete caso*/
        editarOrigenObj._id = resultado.posteo._id
        editarOrigenObj[`referencias.orDesencAgrup`] = {}
        editarOrigenObj[`referencias.orDesencAgrup`] = objetoGuardar.datosEnviar

        $.ajax({
            type: "put",
            url: `/put?base=${desencadena.destino}&vers=no`,
            dataType: "JSON",
            async: false,
            contentType: "application/json",
            data: JSON.stringify(editarOrigenObj),
            success: function (respon) {

            },
            error: function (error) {
                console.log(error);
            },
        });
        //Aca termino de editar el la tranasccion destino
        //Ahora voy a modificar la/s transaccion origen/es
        $.each(arrayResponse, (indRegistro, registro) => {
            let objetoEnOrigen = { ...objetoEnOrigenInicial }
            objetoEnOrigen._id = indRegistro

            $.each(registro, (indice, value) => {

                objetoEnOrigen.array = objetoEnOrigen?.array || new Array
                objetoEnOrigen.array.push(value._idColeccionUnWind)
            })

            $.each(objeto?.atributosModificadosAlEnviar?.confirmar?.cabecera, (indice, value) => {
                objetoEnOrigen.atributosCabecera = datosEnviar.atributosCabecera || {}
                objetoEnOrigen.atributosCabecera[indice] = value
            })

            objetoEnOrigen.atributosArray = { [desencadena.atributoGrabarColec]: [valorenOrigen] }

            actualizarOrigenColeccion(objetoEnOrigen, objeto).then((resultado) => {

                $(`#t${numeroForm}`).remove()
                reCrearTabla(numeroForm, objeto)

            })
        })
    });
};
/////funciones de generar atributos
function objetosColeccion(desencadena, objetoEnOrigenColec, posteo, arrayOrigen) {

    const atributoGrabar = {
        desencadenaColeccion: "referencias.desencadenantesColec",
        childColec: "referencias.childColec",
        imputado: "referencias.imputado"
    }

    objetoEnOrigenColec.atributosArray[`idCol${desencadena.identificador}`] = (objetoEnOrigenColec.atributosArray[`idCol${desencadena.identificador}`] || []).concat(posteo._id)
    objetoEnOrigenColec.atributosArray[`destino${desencadena.identificador}`] = (objetoEnOrigenColec.atributosArray[`destino${desencadena.identificador}`] || []).concat(desencadena.destino)

    objetoEnOrigenColec.referencias[atributoGrabar[desencadena.origen]][posteo._id] = {
        _id: posteo._id,
        identificador: desencadena.identificador,
        entidad: desencadena.destino,
        nombre: desencadena.nombre,
        mostrar: new Object

    }

    $.each(desencadena.grabarEnOrigenColeccion, (indice, value) => {

        objetoEnOrigenColec.referencias[atributoGrabar[desencadena.origen]][posteo._id].mostrar[indice] = posteo[value]
    })

    objetoEnOrigenColec.referencias[atributoGrabar[desencadena.origen]][posteo._id].mostrar["Colección origen"] = desencadena.coleccionOrigen.titulos

    return objetoEnOrigenColec

}
function objetosColeccionFusion(desencadena, objetoEnOrigenColec, posteo, fusion) {

    const atributoGrabar = {

        desencadenaColeccionAgrupado: "referencias.desenColecAgrup",
    }

    for (const indice of (fusion)) {

        objetoEnOrigenColec.atributosArray[`idCol${desencadena.identificador}`] = (objetoEnOrigenColec.atributosArray[`idCol${desencadena.identificador}`] || []).concat(posteo._id)
        objetoEnOrigenColec.atributosArray[`destino${desencadena.identificador}`] = (objetoEnOrigenColec.atributosArray[`destino${desencadena.identificador}`] || []).concat(desencadena.destino)
    }

    objetoEnOrigenColec.referencias[atributoGrabar[desencadena.origen]][posteo._id] = {
        _id: posteo._id,
        entidad: desencadena.destino,
        nombre: desencadena.nombre,
        mostrar: new Object
    }

    $.each(desencadena.grabarEnOrigenColeccion, (indice, value) => {

        objetoEnOrigenColec.referencias[atributoGrabar[desencadena.origen]][posteo._id].mostrar[indice] = posteo[value]
    })

    objetoEnOrigenColec.referencias[atributoGrabar[desencadena.origen]][posteo._id].mostrar["Colección origen"] = desencadena.coleccionOrigen.titulos

    return objetoEnOrigenColec
}
function actualizarOrigenColeccion(respuestasOrigen, objeto) {

    let deferred = $.Deferred();

    $.ajax({
        type: "put",
        url: `/putValoresArray?base=${objeto.accion}`,
        dataType: "JSON",
        async: false,
        contentType: "application/json",
        data: JSON.stringify(respuestasOrigen),
        success: function (respon) {

            deferred.resolve(respon);
        },
        error: function (error) {
            console.log(error);
        },
    });

    return deferred.promise();
}
async function responseDeleteColecion(objeto, desencadena, response) {

    const origenRef = {
        desencadenaColeccion: "desencadenantesColec",
        childColec: "childColec",
        desencadenaColeccionAgrupado: "desenColecAgrup"
    };

    let eliminarId = [];
    let idAnteriores = response?.anterior?.[`idCol${desencadena.identificador}`] || [];
    let idActuales = response?.posteo?.[`idCol${desencadena.identificador}`] || [];

    idAnteriores.forEach((value, indice) => {
        if (!idActuales.includes(value)) {
            eliminarId.push(value);
        }
    });

    const tareas = eliminarId.map(async (value) => {

        let referenciaGuardar = response?.anterior?.referencias?.[origenRef[desencadena.origen]]?.[value];
        let entidad = referenciaGuardar?.entidad;

        if (!entidad) return;
        let objetoDestino = variablesModelo[entidad];

        const infoEnviar = {
            _id: response.posteo._id,
            entidad: objeto.accion,
            unset: `referencias.${origenRef[desencadena.origen]}.${value}`
        };

        const deletePeticion = fetch(`/delete?base=${entidad}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `_id=${value}`
        }).then(async (res) => {
            if (!res.ok) throw new Error(`Error al eliminar`);
            const data = await res.json();

            $.each(objetoDestino?.acumulador, (indice, value) => {
                acumuladorUpdateDelete(value, data, objetoDestino);
            })
        });

        const desencadenantePeticion = deleteDesencadenanteEnOrigen(infoEnviar);

        return Promise.all([deletePeticion, desencadenantePeticion]);

    })

    await Promise.all(tareas);// porqe este promise all, si esta el anterior 
}
async function responseDelete(objeto, desencadena, data, IdEliminar) {

    const origenRef = {
        child: "origenChild",
        desencadenante: "origenDesencadenante"
    };

    let objetoDestino = variablesModelo[desencadena.identificador];

    const infoEnviar = {
        _id: data._id,
        entidad: objeto.accion,
        unset: `referencias.${desencadena.origen}.${desencadena.identificador}`
    };

    const deletePeticion = fetch(`/delete?base=${desencadena.identificador}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `_id=${IdEliminar}`
    }).then(async (res) => {
        if (!res.ok) throw new Error(`Error al eliminar`);
        const data = await res.json();

        objetoDestino?.acumulador?.forEach(v => {
            acumuladorUpdateDelete(v, data, objetoDestino);
        });
    });

    deleteDesencadenanteEnOrigen(infoEnviar);
}
function bloquearElementoDesencadenado(objeto, numeroForm, father) {

    $(`#${father}`).addClass("bloqueoChild")
    $(`#bf${numeroForm} img.deleteBoton`).parents(`div`).addClass("oculto")
    $(`#bf${numeroForm} img.editBoton`).parents(`div`).addClass("oculto")
}
async function imputacionDesdeColeccion(imputacion, objeto, response) {
    return new Promise(async (resolve, reject) => {

        const tipoImputacion = {
            condicionSegunFuncion,
            directo: desencadenaDirecto
        };
        console.log(response)
        let fileCabecera = fileDesencadenante(response);

        /*if (response?.anterior !== undefined) {
            await responseDeleteColecion(objeto, desencadenante, response); // ← acá usás await
        }*/
        //Tengo que poner algo de borra imputacion si se elimina renglon

        //fileCabecera.historia = fileCabecera?.historia[Object.values(fileCabecera.historia).length - 1];
        console.log(imputacion)
        console.log(objeto)
        console.log(fileCabecera)
        let enviarObjetosPlanchado = unWindJavaScript(objeto, fileCabecera, imputacion);
        console.log(enviarObjetosPlanchado)
        let contador = Object.values(enviarObjetosPlanchado).length;
        let objetograbarEnOrigen = new Object
        objetograbarEnOrigen._id = response.posteo._id;

        let respuestasOrigen = new Object

        for (const [indiceRespuesta, valueRespuesta] of Object.entries(enviarObjetosPlanchado)) {
            let objetoDestino = variablesModelo[imputacion.destino]
            let imputa = tipoImputacion[imputacion.type](imputacion, valueRespuesta);
            imputa.origen = imputacion.origen
            console.log(imputa)
            contador--;

            if (imputa != "") {
                let grabarEnDestino = {};
                objetograbarEnOrigen.array = (objetograbarEnOrigen.array || []).concat(valueRespuesta.indiceArray);
                objetograbarEnOrigen.atributosArray = objetograbarEnOrigen?.atributosArray || {};
                objetograbarEnOrigen.atributosCabecera = objetograbarEnOrigen?.atributosCabecera || {};

                objetograbarEnOrigen.referencias = objetograbarEnOrigen?.referencias || {
                    [`referencias.imputado`]: {}
                };
                console.log(objetograbarEnOrigen)
                grabarEnDestino[`${imputa.identificador}${valueRespuesta._idOrigen}`] = {//agrego origen ai me deja guardar dos elementos
                    _id: valueRespuesta._idOrigen,
                    identificador: imputa.identificador,
                    nombre: objeto.pest,
                    entidad: objeto.accion,
                    indice: indiceRespuesta,
                    type: imputa.type,
                    mostrar: {}
                };
                console.log(grabarEnDestino)
                let datosEnviar = await crearObjetoalEnviar(imputa, valueRespuesta);
                console.log(datosEnviar)
                if (response.borrar != true) {
                    $.each(imputa.grabarEnDestino, (indice, value) => {
                        console.log(imputa.grabarEnDestino)

                        grabarEnDestino[`${imputa.identificador}${valueRespuesta._idOrigen}`].mostrar[indice] = valueRespuesta[value];

                    })

                    datosEnviar.referencias = {};
                    datosEnviar.referencias.origenImputado = grabarEnDestino;
                }
                datosEnviar.modificaciones = JSON.stringify(datosEnviar || {});
                datosEnviar.descripcionEnvio = `Imputación desde ${imputacion.nombreEnDestino}`;
                console.log(datosEnviar)
                delete datosEnviar.historia;


                try {

                    const respon = await $.ajax({
                        type: "put",
                        url: `/put?base=${imputa.destino}`,
                        dataType: "JSON",
                        contentType: "application/json",
                        data: JSON.stringify(datosEnviar),


                    });




                    console.log(respon)
                    console.log(objetoDestino)

                    respon.posteo[`position${imputa.coleccionOrigen.nombre}`] = valueRespuesta[`position${imputa.coleccionOrigen.nombre}`];

                    $.each(objetoDestino.acumulador, (indice, value) => {
                        console.log(value)

                        acumuladorUpdateEdit(value, respon, objetoDestino)
                    })


                    respuestasOrigen = objetosColeccion(imputa, objetograbarEnOrigen, respon.posteo, valueRespuesta.indiceArray);
                    console.log(respuestasOrigen)

                    if (contador === 0) {
                        resolve(respuestasOrigen);
                    }

                } catch (error) {
                    console.error(error);
                    reject(error);
                }

            } else if (contador === 0) {
                if (Object.values(respuestasOrigen).length > 0) {
                    resolve(respuestasOrigen);
                } else {
                    reject("Rechazado");
                }
            }
        }
    });
}
async function modificarObjetoAEnviar(atributos, datosEnviar) {//Agarra el objeto devuelto por el posteo del registro original y modificar los atributos especificados, pero envia todos los atributos los moficiados y los no modificados


    for (const [indice, value] of Object.entries(atributos)) {

        switch (indice) {
            case "valorFijo":
                $.each(value, (ind, val) => {

                    datosEnviar[ind] = val;
                })
                break;
            case "funcion":

                for (const [ind, val] of Object.entries(value)) {

                    datosEnviar[ind] = await val[0](datosEnviar, val[1], val[2]);
                }

                break;
            case "cambiarAtributos":

                $.each(value, (ind, val) => {

                    datosEnviar[ind] = datosEnviar[val]
                })
                break;
            case "cambiarAtributosYSigno":

                $.each(value, (ind, val) => {

                    datosEnviar[ind] = datosEnviar[val] * -1
                })
                break;
            case "cambiarSigno":

                $.each(value, (ind, val) => {

                    datosEnviar[val.nombre || val] = datosEnviar[val.nombre || val] * -1

                })
                break;
            case "delete":
                $.each(value, (ind, val) => {
                    delete datosEnviar[ind]

                })
                break
            case "deleteVacio":

                $.each(value, (ind, val) => {
                    if (datosEnviar[ind] == "") {
                        delete datosEnviar[ind]
                    }
                })
                break;

        }
    }

    return datosEnviar
}
async function crearObjetoalEnviar(imputable, objetoEnviado) {

    let datosEnviarNuevo = {};

    for (const [indice, value] of Object.entries(imputable.atributoImputables)) {
        switch (indice) {
            case "valorFijo":
                for (const [ind, val] of Object.entries(value)) {
                    datosEnviarNuevo[ind] = val;
                }
                break;

            case "cambioNombre":
                for (const [ind, val] of Object.entries(value)) {
                    datosEnviarNuevo[ind] = objetoEnviado[val.nombre || val];
                }
                break;

            case "idem":
                for (const val of value) {
                    const key = val.nombre || val;
                    datosEnviarNuevo[key] = objetoEnviado[key];
                }
                break;

            case "funcion":
                for (const [ind, val] of Object.entries(value)) {
                    datosEnviarNuevo[ind] = await val[0](objetoEnviado, val[1], val[2]);
                }
                break;
        }
    }

    return datosEnviarNuevo;
}
function desencadenaAgrup(desencadena, objeto, response) {

    let objetoEnDestino = new Object//Este objeto es creado para completar contodos los atributos que al atributo origen de la entidad destino
    let datosEnviar = new Object
    let objetoEnOrigen = new Object
    let idOrigen = []

    $.each(response, (ind, val) => {

        let id = val._id || val.posteo._id

        if (!(idOrigen.includes(id))) {

            objetoEnOrigen[id] = []

            idOrigen.push(id)

            objetoEnDestino[id] = {
                _id: id,
                nombre: variablesModelo[objeto.accion].pest,
                entidad: objeto.accion,
                atributoEnColec: {
                    idColec: [],
                    valorAnterior: [],
                    atributo: desencadena?.atributoGrabarColec
                },
                mostrar: new Object
            }

            $.each(desencadena.grabarEnDestino, (indice, value) => {

                objetoEnDestino[id].mostrar[value.titulo] = (objetoEnDestino[id].mostrar[value.titulo] || [])?.concat(val?.[value.nombre] || val?.posteo?.[value.nombre])
            })
        }
        objetoEnOrigen[id].push(val._idColeccionUnWind)

        objetoEnDestino[id].atributoEnColec.idColec.push(val._idColeccionUnWind)
        objetoEnDestino[id].atributoEnColec.valorAnterior.push(val?.[desencadena?.atributoGrabarColec]?.[0])
    })

    datosEnviar = objetoEnDestino

    return {
        datosEnviar,
        objetoEnOrigen
    }

}
function deleteDesencadenanteEnOrigen(info) {
    $.ajax({
        type: "put",
        url: `/putDeleteOrigen?base=${info.entidad}`,
        data: info,
        success: function (data) { }
    })

}
function atributoLimpiaDesencadenante(objeto, numeroForm, desencadena) {

    if ($(`#t${numeroForm} input._id`).val() != "") {

        const limpiarFila = (e) => {

            let cambios = []
            let fila = $(e.target).parents("tr")
            let position = $(`input.position`, fila).val()

            $.each(desencadena.atributosMain, (indice, value) => {

                cambios.push($(`input:not(.inputSelect)[name=${value}]`, fila)?.val()?.trim() == consultaGet[numeroForm][value][position]?.trim())
            })

            if (cambios.includes(false)) {

                $(`input.idCol${desencadena.identificador}`, fila).val("")
                // $(`input.destino${desencadena.identificador}`, fila).val("")

            } else {

                $(`input.idCol${desencadena.identificador}`, fila).val(consultaGet[numeroForm][`idCol${desencadena.identificador}`][position]?.trim())
                // $(`input.destino${desencadena.identificador}`, fila).val(consultaGet[numeroForm][`destino${desencadena.identificador}`][position].trim())
            }
        }

        $.each(desencadena.atributosMain, (indice, value) => {

            $(`#t${numeroForm}`).on("change", `input:not(.inputSelect)[name=${value}]`, limpiarFila)

        })
    }
}
function chequeLength(data, atributo) {//ESta funcion se usa para agregar los atributos position en  desencadenantes, esta de este lado porque va siempre

    let atributoEnviar = []

    $.each(data[atributo], (ind, val) => {

        atributoEnviar.push(ind)

    })
    return atributoEnviar

}
function triggerAtrDestino(numeroForm, atributo) {

    const selector = `[prefather="#t${numeroForm}"] input[name="${atributo}"]`;

    // Si ya existe, ejecutamos directamente
    let atributoCreado = document.querySelector(selector);
    if (atributoCreado) {
        $(atributoCreado).trigger("change").trigger("input");
        return;
    }

    // Si no existe, esperamos que aparezca
    const obs = new MutationObserver(() => {
        const found = document.querySelector(selector);

        if (found) {

            obs.disconnect(); // dejar de observar
            setTimeout(() => {
                $(found).trigger("change").trigger("input");
            }, 200)

        }
    });

    obs.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}
function modificarDesencadenado(objeto, numeroForm, atributos) {

    $(`span.editBoton,
       span.deleteBoton,
       span.cruzBoton,
       span.okfPlus,
       span.okBoton`, `#bf${numeroForm}`).parent("div").removeClass("oculto")

    $(`#t${numeroForm} input`).addClass("noEditable")

    $.each(atributos, (ind, val) => {

        $(`#t${numeroForm} input.${val}.noEditable`).removeClass("noEditable")

    })

}

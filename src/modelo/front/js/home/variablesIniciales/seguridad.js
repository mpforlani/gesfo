let permisObject = new Object
let trueObject = {
  true: true,
  false: false
}
let trueDef = {
  1: true,
  0: false
}

fetch('/api/user')
  .then(response => response.json())
  .then(data => {

    data.permisos = data.permisos.filter(e => e.trim() !== "")
    let detalleFiltroAtributos = { _id: { $in: data.permisos } }

    const filtros = `filtros=${JSON.stringify(detalleFiltroAtributos)}`

    fetch(`/get?base=grupoSeguridad&${filtros}`)
      .then(response => response.json())
      .then(async data => {

        let empresa = await consultasPestanaIndividual("empresa")
        empresaSeleccionada = empresaSeleccionada || Object.values(consultaPestanas.empresa).find(e => e.name == (caracteristicaEmpresa.empresaInicio || empresa?.orden[0].name));
        let empresasHabilitadas = new Object

        if (data.length > 1) {
          let empresaSelec = 0
          $.each(data, (indice, value) => {

            empresasHabilitadas[value.empresa] = consultaPestanas.empresa[value.empresa]
            permisObject[value.empresa] = permisObject[value.empresa] || { visualizar: {}, editar: {}, eliminar: {}, crear: {}, atributos: {} }

            $.each(value.visualizar, (ind, val) => {

              permisObject[value.empresa].atributos[ind] = permisObject[value.empresa].atributos[ind] || []
              permisObject[value.empresa].visualizar[ind] = trueDef[Math.max(permisObject[value.empresa].visualizar[ind] || false, trueObject[val])]
              permisObject[value.empresa].editar[ind] = trueDef[Math.max(permisObject[value.empresa].editar[ind] || false, trueObject[data[indice].editar[ind]])]
              permisObject[value.empresa].eliminar[ind] = trueDef[Math.max(permisObject[value.empresa].eliminar[ind] || false, trueObject[data[indice].eliminar[ind]])]
              permisObject[value.empresa].crear[ind] = trueDef[Math.max(permisObject[value.empresa].crear[ind] || false, trueObject[data[indice].crear[ind]])]
              permisObject[value.empresa].atributos[ind].push(data[indice].atributos[ind])
            })

            if (value.empresa == empresaSeleccionada?._id) {
              empresaSelec++
            }
          })
          if (empresaSelec == 0) {

            empresaSeleccionada = consultaPestanas.empresa[data?.[0]?.empresa]
            permisObject[data?.[0]?.empresa] = data[0]
          }

        } else {

          if (data?.[0]?.empresa == empresaSeleccionada?._id) {

            empresasHabilitadas[empresaSeleccionada?._id] = empresaSeleccionada?._id
            permisObject[empresaSeleccionada?._id] = data[0]

          } else {

            empresasHabilitadas[data?.[0]?.empresa] = consultaPestanas.empresa[data?.[0]?.empresa]
            empresaSeleccionada = consultaPestanas.empresa[data?.[0]?.empresa]
            permisObject[data?.[0]?.empresa] = data[0]

          }
        }
        if (empresaSeleccionada === undefined) {
          let usuarioForm = consultaPestanas?.user?.[consulta?.username]?.usernameUser || ""
          crumb("empresaSeleccionada", { //18/02/2026
            estado: "undefined",
            mensaje: "empresaSeleccionada no está definida",
            valor: empresaSeleccionada,
            user: usuarioForm
          });

        }

        escribirMenu(permisObject, empresasHabilitadas)
      })
      .catch(error => console.error('Error de red:', error));
  })
  .catch(error => console.error('Error al obtener los datos:', error))

$(`body`).one('click ', `#grupoSeguridad`, function (objeto, numeroForm) {

  let navCompleta = $(`.nav-vert .desplegableAbm`)
  let objetoTabla = []

  $.each(navCompleta, (indice, value) => {

    let items = $(`div:not(.ocultoSiempre) p.menuSelectAbm, 
                   div:not(.ocultoSiempre) p.menuDobleEntrada,
                   div:not(.ocultoSiempre) p.menuReportes`, $(value).siblings(`.subMenu`))

    let agrup = $(value).attr(`agrupador`)
    let detalle = { componentes: [], titulo: agrup }

    $.each(items, (indice, val) => {

      let id = $(val).attr(`aprobar`) || $(val).attr(`id`)
      let agrupTit = $(val).html().trim()

      let elemento = { nombre: id, titulo: agrupTit }
      detalle.componentes.push(elemento)

    })
    objetoTabla.push(detalle)
  })

  variablesModelo.grupoSeguridad.tablaDobleEntrada.oculto = new Object
  variablesModelo.grupoSeguridad.tablaDobleEntrada.oculto.crear = []
  variablesModelo.grupoSeguridad.tablaDobleEntrada.oculto.editar = []
  variablesModelo.grupoSeguridad.tablaDobleEntrada.oculto.eliminar = []

  $.each(modulosLocales, (indice, value) => {

    if (value?.atributos?.crear == false) {

      variablesModelo.grupoSeguridad.tablaDobleEntrada.oculto.crear.push(value.accion)
    }
  })
  $.each(variablesModeloTransformar, (indice, value) => {

    if (value?.type == "aprobar") {

      variablesModelo.grupoSeguridad.tablaDobleEntrada.oculto.crear.push(indice)
      variablesModelo.grupoSeguridad.tablaDobleEntrada.oculto.editar.push(indice)
      variablesModelo.grupoSeguridad.tablaDobleEntrada.oculto.eliminar.push(indice)

    }
  })
  variablesModelo.grupoSeguridad.tablaDobleEntrada.fila = objetoTabla

})

let permisoFechaEntidad = (objeto, numeroForm) => {


  /*let permisos = "deshabilitado"
  let fechaComprobante = new Date($(`#t${numeroForm} input.${objeto.atributos.fechaPermiso || "fecha"}`).val())
  let m = Math.min.apply(null, limitePermiso);
 
  let fechaPermitida = new Date();
 
  fechaPermitida.setDate(fechaPermitida.getDate() - m);
 
  if ((!objeto.atributos.names.includes(fecha) || !permisObject.limite.includes(`${objeto.nombre}`)) || (permisObject.limite.includes(`${objeto.nombre}`) && fechaComprobante > fechaPermitida)) {
 
    permisos = "habilitado"
  }*/
  permisos = "habilitado"
  let fechaPermitida = new Date();
  fechaPermitida.setDate(fechaPermitida.getDate() - 90)

  return {
    permisos,
    fechaPermitida
  }
}
async function seguridadAtributos(entidad) {
  const promesas = [];
  let visualizar = {}
  let editar = {}

  if (permisObject?.[empresaSeleccionada?._id]?.atributos?.[entidad?.nombre || entidad?.accion]?.length > 1 && !Array.isArray(permisObject?.[empresaSeleccionada?._id]?.atributos?.[entidad.nombre || entidad.accion])
  ) {
    permisObject[empresaSeleccionada?._id].atributos[entidad.nombre || entidad.accion] = [permisObject?.[empresaSeleccionada?._id].atributos?.[entidad.nombre || entidad.accion]]
  }
  $.each(permisObject?.[empresaSeleccionada?._id]?.atributos?.[entidad.nombre || entidad.accion], (indice, value) => {

    if (value != "") {

      entidad.ocultroAtributosSeguridad = []
      entidad.soloLecturaSeguridad = []
      let detalleFiltroAtributos = { _id: value }

      const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`
      const url = `/get?base=seguridadAtributo${filtros}`;

      const promesa = fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error en la petición para ID ${value.id}`);
          }
          return response.json();
        })
        .then(data => {

          visualizar = data?.[0]?.visualizar
          editar = data?.[0]?.editar
        })
        .catch(error => {
          console.error('Error para ID', value.id, ':', error);
          return null; // o podrías devolver un objeto de error si querés manejarlo después
        });

      promesas.push(promesa);
    }
  });

  // Esperar a que terminen todas las promesas
  await Promise.all(promesas)
    .then(resultados => {

      $.each(visualizar, (indice, value) => {

        if (value == "false") {

          entidad.ocultroAtributosSeguridad.push(indice)

        }
      })

      $.each(editar, (indice, value) => {

        if (value == "false") {

          entidad.soloLecturaSeguridad.push(indice)
        }

      })
    });
}
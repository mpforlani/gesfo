function detalleTareasCrm(objeto, numeroForm) {

    cartelfilaOriginalMasTablaComp(objeto, numeroForm, tareas)

    const sumaVertical = (e) => {
        let totalimporteSuma = 0;

        $(`.tr:not(.oculto) input.consumidoDetalle:not(.total)`, $(`#ampliar${numeroForm}`)).each((ind, val) => {
            let [hora, minutos] = ($(val).val() || '0h 0m').replace("m", "").split("h");
            totalimporteSuma += (Number(minutos) || 0) + (Number(hora) * 60 || 0);
        });

        $(`input.consumidoDetalle.total`, $(`#t${numeroForm}`))
            .val(minutosAHoraMinutos(totalimporteSuma))
            .trigger("blur")
            .trigger("input");
    }

    $(`#ampliar${numeroForm}`).on(`blur`, `input.consumidoDetalle:not(.total)`, sumaVertical)
    $(`#ampliar${numeroForm} .atributosFila input.tiempoConsumido`).attr(`tabindex`, -1);
    const completarConsumido = e => $(`#ampliar${numeroForm} .tdFila input.tiempoConsumido`).val(e.target.value).trigger("input").trigger("blur");
    $(`#ampliar${numeroForm}`).on("input", `.td.totales .consumidoDetalle`, completarConsumido)


    $(`#ampliar${numeroForm}`).on("blur", `.atributosFila input.tiempoEstimado, .atributosFila input.tiempoConsumido`, (e) => {

        let father = e.target.closest(".atributosFila")

        let total = 0
        let estimado = $(`input.tiempoEstimado`, father).val() || `0h 0m`;

        let [horaEst, minutosEst] = estimado.replace("m", "").split("h")
        let minutosTotales = parseFloat(minutosEst || 0) + parseFloat((horaEst || 0) * 60)

        total += parseFloat(minutosTotales || 0);

        let consumido = $(`input.tiempoConsumido`, father).val() || `0h 0m`;

        let [horaCon, minutosCon] = consumido.replace("m", "").split("h")
        let minutosTotalesCon = parseFloat(minutosCon || 0) + parseFloat((horaCon || 0) * 60)

        total -= parseFloat(minutosTotalesCon || 0);

        $(`input.tiempoRemanente`, father).val(minutosAHoraMinutos(total)).trigger("blur")


    })

    $(`#ampliar${numeroForm} input.remanenteDetalle`).addClass("total").attr(`tabindex`, -1).attr("readonly", true);

    $(`#t${numeroForm}`).on(`dblclick`, `.cartelHelpTotal .tr.last`, (e) => {

        let tr = e.currentTarget

        $(`input.remanenteDetalle`, tr).addClass("total").attr(`tabindex`, -1).attr("readonly", true);


    })

    function calcularRem() {

        let tiempoEstimado = $(`#ampliar${numeroForm} .atributosFila input.tiempoEstimado`).val() || `0h 0m`;
        let [hora, minutos] = tiempoEstimado.replace("m", "").split("h")
        let minutosTotales = parseFloat(minutos || 0) + parseFloat((hora || 0) * 60)
        let acumuladoRemanente = 0;
        let remanentes = $(`#ampliar${numeroForm} input.remanenteDetalle:visible:not([readonly]):not(.totalremanenteDetalle)`)

        $.each(remanentes, (ind, val) => {

            let fila = $(val).parents(`.tr.filaInfo`)
            let tiempom = $(`input.consumidoDetalle`, fila).val() || `0h 0m`;
            let [horam, minutosm] = tiempom.replace("m", "").split("h")
            let minutosFilas = parseFloat(minutosm || 0) + parseFloat((horam || 0) * 60)
            let remanenteFil = minutosTotales - acumuladoRemanente - minutosFilas

            $(val).val(minutosAHoraMinutos(remanenteFil)).trigger("blur")
            acumuladoRemanente = acumuladoRemanente + minutosFilas
        })

        $(`#ampliar${numeroForm} input.remanenteDetalle.totalremanenteDetalle`).val(minutosAHoraMinutos(minutosTotales - acumuladoRemanente)).trigger("blur")
        $(`#ampliar${numeroForm} .atributosFila input.tiempoRemanente`).val(minutosAHoraMinutos(minutosTotales - acumuladoRemanente)).trigger("input")
    }

    $(`#ampliar${numeroForm}`).on("blur", `input.consumidoDetalle`, calcularRem)
    $(`#ampliar${numeroForm}`).on("blur", `input.tiempoEstimado`, calcularRem)

    $(`#ampliar${numeroForm}`).on(`blur`, `.atributosFila input.horaMinutos`, (e) => {

        $(`#t${numeroForm} tr.seleccionadoAmpliar input.${e.target.name}`).val(e.target.value).trigger("input")
    })


}
async function filtrarTareaPorEntidad(objeto, numeroForm, entidad) {

    consultaPestanasConOrden.entidadCrm == undefined && await consultasPestanaIndividual("entidadCrm");
    let entidadSeleccionada = consultaPestanasConOrden.entidadCrm.find(e => e.name == entidad);
    let tareasFiltradasEliminar = consultaPestanasConOrden.tarea.filter(e => !e.entidadCrm.includes(entidadSeleccionada._id));

    $.each(tareasFiltradasEliminar, (indice, value) => {

        $(`#t${numeroForm} div.opciones[value=${value._id}]`).addClass("ocultoSiempre")
    })
}


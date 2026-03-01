const obtenerEmpresa = function () {
    $.ajax({
        type: "GET",
        url: `/get?base=empresa`,
        success: function (response) {

            consultaPestanas[empresaAtributo.nombre] = new Object


            if (response.length > 0) {
                $(`#opcionesLista li`).remove()
                let o = "";
                o += `<li class="opcionesEmpresa">Todos</li>`;
                for (let x = 0; x < response.length; x++) {
                    o += `<li class="opcionesHome">${response[x].name}</li>`;

                    consultaPestanas["empresaAtributo"][response[x]._id] = response[x]
                }

                let options = $(o);
                options.appendTo(`#opcionesLista`);
                fideicomiso = "Todos";

            }
        },
        error: function (error) {
            console.log(error);
        }
    })
}

$(`#opcionesLista`).on("click", `li`, function () {

    let fidei = $(this).html()

    let fideicomiso = Object.values(consultaPestanas["empresaAtributo"]).find(element => element.name == fidei) || { _id: "todos" }
    console.log(fideicomiso)

    fidei += `<span class="icon-down-dir"></span>`;

    $(`#opciones h3`).html("");
    $(`#opciones h3`).html(fidei);

    $(`#opcionesLista`).removeClass(`show`);


    $(`#opciones input`).val("");
    $(`#opciones input`).val(fideicomiso._id || "todos");

    //obtenerSaldo(`movimientoFinanciero`);
    //pagoCobroPorRubro(variablesIniciales.pagosRealizados)
    //pagoCobroPorRubro(variablesIniciales.cobrosRecibidos)
    //prestamosPendiente(`prestamosFideicomisos`)
    cambiarEmpresaVentanaAbierta()

})
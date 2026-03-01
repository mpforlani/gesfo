async function cartelEnviarReporte(objeto) {

    let get = getElement[objeto?.datos] || "get"
    let detalleFiltroAtributos = new Object
    $.each(objeto.filtros, (indice, value) => {

        detalleFiltroAtributos[indice] = value[0](objeto, numeroForm, value[1], value[2], value[3])
    })
    let sort = ""

    $.each(objeto.sort, (indice, value) => {

        sort += `&sort=${indice}:${value}`
    })

    const filtros = `&filtros=${JSON.stringify(detalleFiltroAtributos)}`
    $.ajax({
        type: "get",
        async: false,
        url: `/${get}?base=${objeto.entidad}${filtros}${sort}`,
        beforeSend: function (data) { },
        success: async function (data) {

            let texto = `<div class="inforEnviar">`
            texto += `<h1>${objeto.titulo}</h1>`

            for (const [indice, value] of Object.entries(objeto.cuerpo)) {

                let valor = await value.valor[0](data, value.valor[1], value.valor[2], value.valor[3])
                texto += `<tr><td><strong>${value.titulo}:</strong></td><td>${valor}</td></tr>`

            }
            let infoEnviar = { texto }
            enviarEmailReporte(infoEnviar)

        },
        error: function (error) {
            console.log(error);
        }
    })
}
async function cantidadRegistrosUltimaSemana(data, entidad, dias) {

    try {
        const response = await fetch(`/getUltimaSemanaQ?base=${entidad}&dias=${dias || 7}`);
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();

        return data.cantidad || 0; // retorna el objeto completo del backend
    } catch (error) {
        console.error("Error en getRegistrosUltimaSemana:", error);
        throw error;
        return null;
    }
}
function obtenerLargoData(data) {

    return data.length || 0;
}
function obtenerLargoDataFiltrado(data, filtro) {
    let dataFinal = data

    $.each(filtro, (indice, value) => {

        switch (indice) {

            case "distinto":

                dataFinal = dataFinal.filter(item => {
                    return item[value.atr] !== value.valor;
                });
                break;
            case "igual":
                dataFinal = dataFinal.filter(item => {
                    return item[value.atr] === value.valor;
                });
                break;
        }
    });

    return dataFinal.length || 0;

}
let variablesModeloProduccion = {

    recetas: {
        atributos: {
            names: [
                NS("numerador"),

                TF("descripcionCompleto"),
                adjunto,
            ],
            titulos: [`Numero`, "Obrservaciones", `Adjunto`],
            limiteCabecera: true,
            eliminar: true,
            deshabilitar: false,
            valorInicial: {
                select: {
                    tipoPago: "Efectivo"
                }
            }
        },
        formInd: {
            inputRenglones: [6, `compuesto`, 3, 6],

        },
        funcionesPropias: {
            formularioIndiv: {
                valoresInicialesMediosPagos: [valoresInicialesMediosPagos, "importeTotal"],
                mostrarPestana: [mostrarPestana, "compuestoReciboCobros", "cobrosCtaCte"],
                validarImporteCtaCte: [validarImporteCtaCte, "importeaCobrar"]
            },
        },
        key: "numerador",
        pest: `Recetas`,
        pestIndividual: `Ingresar recetas`,
        accion: `recetas`,
        empresa: true,
        multimoneda: true,
        type: "transaccion",
    },
}
const caracteristicaEmpresa = {
    nombre: "sbc",
    multimoneda: "false",
    monedaBase: "Pesos",
    monedaAlternativa: "Dolar",
    tipoDeCambioDefault: "",//Ver de sacar esta en monedas, pero esta rara la operacion no se usa casi nada
    empresas: false,//Aca pongo las empresas relacionadas
    monedaOperaciones: "Dolar",
    cajas: false,
    tipoEmpresa: "Responsable inscripto",
    diasFacturacion: 30,
    fechaDesdeEmpersa: addDay(Date.now(), 0, -2, 0, `y-m-d`)
}
const colores = {
    impresion: {
        bordesRenglon: "rgba(156, 165, 185, 1)"
    }
}
const valoresIncialesApp = {
    select: {
        moneda: "Dolar"
    },
    coleccionSelectFirst: {
        moneda: "Dolar",
    },
    coleccion: {
        moneda: "Dolar",
        monedaComp: "Dolar"
    }

}

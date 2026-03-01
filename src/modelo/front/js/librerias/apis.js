
let cotisConsultadas = new Object
async function consutaTipoCambio(mon = ["Dolar"], fech) {

    let moneda = "";

    $.each(mon, (indice, value) => {
        moneda += `&moneda[]=${value}`;
    });

    let hasta = fech?.hasta || new Date(Date.now() - 86400000);
    let fecha = `&desde="${fech?.desde || hasta}"&hasta="${hasta}"`;


    try {

        const resp = await fetch(`/cotizaciones?${moneda}${fecha}`);
        const data = await resp.json();

        $.each(data, (indice, value) => {

            let indiceNormalizado = indice === "Dolar U.S.A" ? "Dolar" : indice
            cotisConsultadas[indiceNormalizado.toLowerCase()] = cotisConsultadas[indiceNormalizado.toLowerCase()] || new Object

            $.each(value, (ind, val) => {

                cotisConsultadas[indiceNormalizado.toLowerCase()][val.fecha.replace(/\//g, "")] = val

            })
        })

        return cotisConsultadas;

    } catch (error) {

        console.error("Error de red:", error);
        throw error;

    }
}
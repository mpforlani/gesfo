//let fechaFunc  = moment(Date.now()).format("L");
let mesNumero = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
let mesNumeroDoble = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
let MesesStringCompleto = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
let MesesStringRes = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

let MesesStringAbrev = []
//trasnsformar dateNow a dd/mm/yyyy (en numero Doble)

function dateNowAFechaddmmyyyy(date, formato) {

    let dateFormato = new Date(date)

    let ano = dateFormato.getUTCFullYear()
    let mes = dateFormato.getUTCMonth();

    let day = dateFormato.getUTCDate();

    let hours = dateFormato.getHours();
    let minutes = dateFormato.getMinutes();

    if (day.toString().length == 1) {
        day = "0" + day
    }
    if (hours.toString().length == 1) {
        hours = "0" + hours
    }
    if (minutes.toString().length == 1) {
        minutes = "0" + minutes
    }

    let fecha = ""

    switch (formato) {
        case `y-m-d`:

            fecha = `${ano}-${mesNumeroDoble[mes]}-${day}`

            break
        case `d-m-y`:

            fecha = `${day}-${mesNumeroDoble[mes]}-${ano}`

            break
        case `d/m/y`:
            fecha = `${day}/${mesNumeroDoble[mes]}/${ano}`

            break;
        case `d/m/y-hh`:
            fecha = `${day}/${mesNumeroDoble[mes]}/${ano} ${hours}:${minutes} `

            break
        case `y-m-dThh`://No tocar lo que devuelve porque esto me modifica la huella de auditoria en los form individual
            fecha = `${ano}-${mesNumeroDoble[mes] || ""}-${day}T${hours}:${minutes}`;

            break
    }


    return fecha
}
function dateNowAFechaSemana(date, formato) {

    let dateFormato = new Date(date);

    // Forzar día hábil hacia atrás
    const dow = dateFormato.getUTCDay(); // 0 dom, 6 sáb

    if (dow === 6) dateFormato.setUTCDate(dateFormato.getUTCDate() - 1); // sábado -> viernes
    if (dow === 0) dateFormato.setUTCDate(dateFormato.getUTCDate() - 2); // domingo -> viernes

    let ano = dateFormato.getUTCFullYear();
    let mes = dateFormato.getUTCMonth();
    let day = dateFormato.getUTCDate();

    let hours = dateFormato.getUTCHours();
    let minutes = dateFormato.getUTCMinutes();

    if (day.toString().length == 1) day = "0" + day;
    if (hours.toString().length == 1) hours = "0" + hours;
    if (minutes.toString().length == 1) minutes = "0" + minutes;

    let fecha = "";

    switch (formato) {
        case `y-m-d`:
            fecha = `${ano}-${mesNumeroDoble[mes]}-${day}`;
            break;

        case `d-m-y`:
            fecha = `${day}-${mesNumeroDoble[mes]}-${ano}`;
            break;

        case `d/m/y`:
            fecha = `${day}/${mesNumeroDoble[mes]}/${ano}`;
            break;

        case `d/m/y-hh`:
            fecha = `${day}/${mesNumeroDoble[mes]}/${ano} ${hours}:${minutes} `;
            break;

        case `y-m-dThh`: // No tocar
            fecha = `${ano}-${mesNumeroDoble[mes] || ""}-${day}T${hours}:${minutes}`;
            break;
    }

    return fecha;
}
function dateAnteriorFechaSemana(date, formato) {

    let dateFormato = new Date(date);

    // Día hábil anterior real
    const dow = dateFormato.getUTCDay(); // 0 dom, 1 lun, ... 6 sáb

    if (dow === 1) { // lunes -> viernes
        dateFormato.setUTCDate(dateFormato.getUTCDate() - 3);
    } else if (dow === 0) { // domingo -> viernes
        dateFormato.setUTCDate(dateFormato.getUTCDate() - 2);
    } else {
        // martes a sábado -> día anterior
        dateFormato.setUTCDate(dateFormato.getUTCDate() - 1);
    }

    let ano = dateFormato.getUTCFullYear();
    let mes = dateFormato.getUTCMonth();
    let day = dateFormato.getUTCDate();

    let hours = dateFormato.getUTCHours();
    let minutes = dateFormato.getUTCMinutes();

    if (day.toString().length == 1) day = "0" + day;
    if (hours.toString().length == 1) hours = "0" + hours;
    if (minutes.toString().length == 1) minutes = "0" + minutes;

    let fecha = "";

    switch (formato) {
        case `y-m-d`:
            fecha = `${ano}-${mesNumeroDoble[mes]}-${day}`;
            break;

        case `d-m-y`:
            fecha = `${day}-${mesNumeroDoble[mes]}-${ano}`;
            break;

        case `d/m/y`:
            fecha = `${day}/${mesNumeroDoble[mes]}/${ano}`;
            break;

        case `d/m/y-hh`:
            fecha = `${day}/${mesNumeroDoble[mes]}/${ano} ${hours}:${minutes}`;
            break;

        case `y-m-dThh`: // No tocar
            fecha = `${ano}-${mesNumeroDoble[mes] || ""}-${day}T${hours}:${minutes}`;
            break;
    }

    return fecha;
}


const addDay = (date, days, months, year, formato) => {

    if (days == `primer`) {
        days = -((new Date(date).getUTCDate()) - 1)
    }

    let d = (new Date(date)).setDate(new Date(date).getDate() + days);
    let m = (new Date(d)).setMonth(new Date(d).getMonth() + months);
    let a = (new Date(m)).setFullYear(new Date(m).getUTCFullYear() + year);

    let day = new Date(a).getDate();
    let mes = new Date(a).getMonth();
    let ano = new Date(a).getFullYear();

    if (day.toString().length == 1) {
        day = "0" + day
    }
    let fecha = ""
    switch (formato) {
        case `y-m-d`:

            fecha = `${ano}-${mesNumeroDoble[mes]}-${day}`

            break
        case `d-m-y`:

            fecha = `${day}-${mesNumeroDoble[mes]}-${ano}`

            break
        case `d/m/y`:

            fecha = `${day}/${mesNumeroDoble[mes]}/${ano}`
            break
    }

    return fecha

}
const mongoAGesfin = (da, formato) => {

    let fecha = ""
    let dat = new Date(da || "");

    const invalidaObject = {
        Invalid: " ",

    }

    const opciones = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };


    switch (formato) {
        case `d/m/yH`:
            fecha = dat.toLocaleString('es-AR', opciones)
            break
    }

    return invalidaObject[fecha.split(' ')[0]] || fecha
}
const obtenerMes = (fecha) => {
    const mes = String(new Date(fecha).getUTCMonth() + 1).padStart(2, "0");
    return mes

}
const obtenerAno = (fecha) => {

    return new Date(fecha || Date.now()).getFullYear();
}
const obtenerAnoDosDigitos = (objeto, numeroForm, fecha) => {

    return formatoDosNumero(new Date(fecha || Date.now()).getFullYear());
}
const findAllindexFecha = (str, char) => {//esta la creo dos veces porque sino deberia invertir el orden de los archivos con variables iniciales, 
    //entonces creo uno aca y otra en variables iniciales
    // Crear una expresión regular para buscar todas las ocurrencias del carácter
    const regex = new RegExp(char, 'g');
    const matches = str?.matchAll(regex);
    const indices = [];

    for (const match of matches) {
        indices.push(match.index);
    }

    return indices;
}
function pasarFechaATexto(date) {

    let fecha = date || dateNowAFechaddmmyyyy(Date.now(), `y-m-d`)

    let fechaSplit = fecha.split("-")

    textoReturn = `${fechaSplit[2]} día/s del mes de ${MesesStringCompleto[parseFloat(fechaSplit[1]) - 1]} de ${fechaSplit[0]}`

    return textoReturn
}
function pasarFechaATextoSinDia(date) {

    let fecha = date || dateNowAFechaddmmyyyy(Date.now(), `y-m-d`)

    let fechaSplit = fecha.split("-")

    textoReturn = `${fechaSplit[2]} de ${MesesStringCompleto[parseFloat(fechaSplit[1]) - 1]} de ${fechaSplit[0]}`

    return textoReturn
}
function getLastDayOfMonth(year, month) {
    // Crear una fecha para el primer día del siguiente mes
    const date = new Date(year, month, 1); // Meses en JavaScript van de 0 (enero) a 11 (diciembre)

    // Restar un día para obtener el último día del mes anterior
    date.setDate(0);

    return date.getDate(); // Devolver el último día del mes
}
////ESta dos supuestamente se usan en factura pero ver, tengo mis dudas
function fechaInicialHoy(objeto, numeroForm) {

    let fecha = dateNowAFechaddmmyyyy(Date.now(), `y-m-d`)

    $(`#t${numeroForm} input.fecha,
       #bf${numeroForm} input.fecha.cabecera`).val(fecha).addClass(`validado`)

};
function diffMeses(fecha1, fecha2) {
    // Convertir '2025-09' en Date del primer día del mes (zona UTC para evitar desfases)
    const [y1, m1] = fecha1.split('-').map(Number);
    const [y2, m2] = fecha2.split('-').map(Number);

    // Calcular diferencia en meses
    return (y1 - y2) * 12 + (m1 - m2);
}
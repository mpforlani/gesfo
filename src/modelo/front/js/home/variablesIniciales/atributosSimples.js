const validacionTextoStandar = /.{1,500}$/
const importevalidacion = /[\d.,]{1,30}$/
const fechaValidacion = /^[a-zA-Z0-9\_\-]{4,16}$/
const cantidadValidacion = /[\d.,]{1,10}$/
const cantidadDosDigitosValidacion = /^\d{1,2}$/
const textoCompletoValidacion = /.{1,3000}/
const validacionMayuscula = /^[A-ZÑ][a-zA-Z\sñ0-9\u00E0-\u00FC.]*$/
const validacionEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
const passwordVal = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,15}[^'\s]$/
const tipoCambioValidacion = /\d{1,4}\d{0,5}$/
//Texto
const textoMayucula = `La primera letra debe ser mayuscula`
const textoEmail = `Debe contener "@" y ".com"`
const textoPassword = `Debe contener al menos una letra mayuscula, una minuscula, un numero y un caracter especial`
//
const validaciones = {
    importe: importevalidacion,
    textarea: validacionTextoStandar,
    date: fechaValidacion,
    fecha: fechaValidacion,
    cantidad: cantidadValidacion,
    numero: cantidadValidacion,
    textareaDos: textoCompletoValidacion,
    text: textoCompletoValidacion,
    texto: textoCompletoValidacion,
    parametrica: validacionTextoStandar,
    parametricaMixta: validacionTextoStandar,
    parametricaPreEstablecida: validacionTextoStandar,
    textoMayuscula: validacionMayuscula,
    email: validacionEmail,
    password: passwordVal
}
const textoValidacion = {

    textoMayuscula: textoMayucula,
    email: textoEmail,
    password: textoPassword
}
const autoCompOff = `autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"`
const adjunto = { nombre: `adjunto`, type: `adjunto`, path: `path`, orignalname: `originalname`, width: "quince", funcion: [{ nombre: "abrirAdjuntoFormIndividual", func: abrirAdjuntoFormIndividual, lugar: "formularioIndiv" }], validacion: { match: /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, texto: `Campo oblogatorio` } };
const adjuntoColeccion = { nombre: `adjuntoColeccion`, path: `pathColeccion`, orignalname: `orignalnameColeccion`, width: "veinte", type: `adjunto`, funcion: [{ nombre: "abrirAdjuntoColeccion", func: abrirAdjuntoColeccion, lugar: "formularioIndiv" }], validacion: { match: /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, texto: `Campo oblogatorio` } };
const logicoAprobacion = { nombre: `logicoAprobacion`, type: `logico` };
const estado = { nombre: `estado`, type: `texto`, width: "doce" };
const habilitado = { nombre: `habilitado`, type: `texto`, clase: "valorInicial", oculto: "oculto", valorInicial: "true", funcion: [{ nombre: "filtroRapido", func: filtroRapido, lugar: "inicio" }] };
let empresaAtributo = { nombre: `empresa`, type: `empresa`, referencia: `name`, width: "diez" }
let tituloEmpresa = "Empresa"
const FuncionAtr = function (funcion) {
    this.type = "funcion";
    this.data = funcion.data || ""
    this.nombre = funcion.nombre || "funcion";
    this.funcion = funcion.funcion;
    this.atributos = funcion.atributos || [];
}
class Atributo {

    constructor(caracteristica) {
        this.nombre = caracteristica?.nombre || caracteristica;
        this.type = this.constructor.type;
        this.clase = `${caracteristica?.clase || ""} ${this?.constructor?.clase || ""} ${caracteristica?.valorInicial ? 'valorInicial validado' : ''}`.trim();
        this.width = caracteristica?.width || this?.constructor?.width
        this.oculto = caracteristica?.oculto || null
        this.validacion = caracteristica?.validacion || this?.constructor?.type
        this.valorInicial = caracteristica?.valorInicial || null
    }
}
class Parametrica extends Atributo {

    static type = "parametrica";
    static width = "quince";
    static clase = "pestanaSelect";

    constructor(caracteristica) {
        super(caracteristica)
        this.pestRef = caracteristica.pestRef || "name";
        this.ocultCond = caracteristica.ocultCond || null;
        this.origen = caracteristica.origen || caracteristica?.nombre || caracteristica;

    }
}
class ParametricaMixta extends Atributo {

    static type = "parametricaMixta";
    static width = "quince";
    static clase = "pestanaSelect";

    constructor(caracteristica) {
        super(caracteristica)
        this.pestRef = caracteristica.pestRef || "name";
        this.ocultCond = caracteristica.ocultCond || null;
        this.origen = caracteristica.origen || caracteristica?.nombre || caracteristica;

    }
}
class ParametricaPreEstablecida extends Atributo {

    static type = "parametricaPreEstablecida";
    static width = "quince";
    static clase = "pestanaSelect";

    constructor(caracteristica) {
        super(caracteristica)
        this.opciones = caracteristica.opciones || null;
    }
}
//Atributo Importe
class Importe extends Atributo {
    static type = "importe";
    static width = "diez";
    static clase = "formatoNumero";
    constructor(caracteristica) {
        super(caracteristica)
        this.moneda = caracteristica.moneda || "base";
    }
}
class ImporteMonedaBase extends Atributo {
    static type = "importe";
    static width = "diez";
    static clase = "monedaBase";
    constructor(caracteristica) {
        super(caracteristica)
        this.moneda = caracteristicaEmpresa.monedaBase;
    }
}
//Atributo Importe moneda alternativa
class ImporteMonedaAlternativa extends Importe {
    constructor(caracteristica) {
        super(caracteristica);
        this.clase = `formatoNumero monedaAternativa ${caracteristica.clase || ""}`;
        this.moneda = caracteristica.moneda;
    }
}
class ImporteMonedaDolar extends Importe {
    constructor(caracteristica) {
        super(caracteristica);
        this.clase = `formatoNumero monedaDolar ${caracteristica.clase || ""}`;
        this.moneda = "Dolar"
    }
}
class ImporteMonedaEuro extends Importe {
    constructor(caracteristica) {
        super(caracteristica);
        this.clase = `formatoNumero monedaEuro ${caracteristica.clase || ""}`;
        this.moneda = "Euro"
    }
}
//Atributo textarea
class Textarea extends Atributo {

    static type = "textarea";
    static width = "veinte";

    constructor(caracteristica) {
        super(caracteristica)

    }
}
//Atributo textarea full renglon
class Textareafullrenglon extends Atributo {
    static type = "textareafullrenglon";
    static width = "veinte";
    constructor(caracteristica) {
        super(caracteristica)
    }
}
class Texto extends Atributo {

    static type = "texto";
    static width = "quince";

    constructor(caracteristica) {
        super(caracteristica)

    }
}
class TextoRequerido extends Atributo {

    static type = "texto";
    static width = "quince";
    constructor(caracteristica) {
        super(caracteristica)
        this.clase = `requerido ${caracteristica.clase || ""}`;

    }
}
class TextoDiv extends Atributo {

    static type = "textoDiv";

    constructor(caracteristica) {
        super(caracteristica)
        this.texto = caracteristica.texto

    }
}
class Numero extends Atributo {
    static type = "numero";
    static width = "siete";
    static clase = "formatoNumero"

    constructor(caracteristica) {
        super(caracteristica)

    }
}
class Fecha extends Atributo {
    static type = "fecha";
    static width = "diez";
    static clase = "textoCentrado typeDate"//El type date es usadado para el dblclick del abm

    constructor(caracteristica) {
        super(caracteristica);
        this.nombre = caracteristica?.nombre || caracteristica || "fecha";
    }
}
class FechaHora extends Atributo {
    static type = "fechaHora";
    static width = "diez";
    static clase = "textoCentrado typeDate"//El type date es usadado para el dblclick del abm

    constructor(caracteristica) {
        super(caracteristica);
        this.nombre = caracteristica?.nombre || caracteristica || "fechaHora";
    }
}
class FechaHoy extends Atributo {
    static type = "fecha";
    static width = "diez";
    static clase = "textoCentrado requerido validado valorInicial typeDate"//El type date es usadado para el dblclick del abm

    constructor(caracteristica) {
        super(caracteristica);
        this.nombre = caracteristica?.nombre || caracteristica || "fecha";
        this.valorInicial = () => { return dateNowAFechaddmmyyyy(new Date(), `y-m-d`) }
    }
}

class Hora extends Atributo {

    static type = "text";
    static width = "diez";
    static clase = "horaMinutos"

    constructor(caracteristica) {
        super(caracteristica);

    }
}
class Checkbox extends Atributo {

    static type = "checkbox";
    static width = "cinco";
    static clase = "textoCentrado";
    constructor(caracteristica) {
        super(caracteristica)

    }
}
class Boton extends Atributo {

    static type = "boton";
    static width = "siete";

    constructor(caracteristica) {
        super(caracteristica)
        this.titulo = caracteristica?.titulo || caracteristica;
    }
}
class BotonMultiple extends Atributo {

    static type = "botonMultiple";
    static width = "siete";

    constructor(caracteristica) {
        super(caracteristica)
        this.titulo = caracteristica?.titulo || caracteristica;
    }
}
class ListaArray extends Atributo {

    static type = "listaArray";
    static width = "quince";

    constructor(caracteristica) {
        super(caracteristica)
        this.subType = caracteristica?.subType

    }
}
class ListaArrayParametrica extends Atributo {

    static type = "listaArrayParametrica";
    static width = "quince";

    constructor(caracteristica) {
        super(caracteristica)
        this.pestRef = caracteristica.pestRef || "name";
        this.ocultCond = caracteristica.ocultCond || null;
        this.origen = caracteristica.origen || caracteristica?.nombre || caracteristica;
    }
}
class ListaArrayTodosRep extends Atributo {

    static type = "listaArrayTodos";
    static width = "quince";

    constructor(caracteristica) {
        super(caracteristica)
        this.subType = caracteristica?.subType

    }
}
class ImgIndividual extends Atributo {
    static type = "imagen";
    constructor(caracteristica) {
        super(caracteristica)

    }
}
const P = new Proxy(Parametrica, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const PM = new Proxy(ParametricaMixta, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const PPE = new Proxy(ParametricaPreEstablecida, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const I = new Proxy(Importe, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const IMB = new Proxy(ImporteMonedaBase, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const IMA = new Proxy(ImporteMonedaAlternativa, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const IMD = new Proxy(ImporteMonedaDolar, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const IME = new Proxy(ImporteMonedaEuro, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const TA = new Proxy(Textarea, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const TF = new Proxy(Textareafullrenglon, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const T = new Proxy(Texto, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const TR = new Proxy(TextoRequerido, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const TD = new Proxy(TextoDiv, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const N = new Proxy(Numero, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const F = new Proxy(Fecha, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const FH = new Proxy(FechaHoy, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const FT = new Proxy(FechaHora, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const H = new Proxy(Hora, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const CH = new Proxy(Checkbox, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const BT = new Proxy(Boton, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const BM = new Proxy(BotonMultiple, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const LA = new Proxy(ListaArray, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const LAT = new Proxy(ListaArrayTodosRep, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const LAP = new Proxy(ListaArrayParametrica, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})
const IM = new Proxy(ImgIndividual, {
    // Interceptar la llamada a P(...)
    apply(target, thisArg, args) {
        // Devuelve una instancia automáticamente
        return new target(...args);
    }
})


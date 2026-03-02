let baseDeDatosApp = require(`../../controladores/baseDeDatosApp`)

const baseDeDat = {
    //Desarrollo
    CasosTesting: require('../models/desarrollo/testing/CasosTesting'),
    Testing: require('../models/desarrollo/testing/Testing'),
    //Cobranzas y pagos
    CobrosRecibidos: require("../models/home/cobranzasYPagos/CobrosRecibidos"),
    FacturasEmitidas: require("../models/home/cobranzasYPagos/FacturasEmitidas"),
    PagosRealizados: require("../models/home/cobranzasYPagos/PagosRealizados"),
    CuentaCorrienteClientes: require("../models/home/cobranzasYPagos/CuentaCorrienteClientes"),
    CuentaCorrienteProveedores: require("../models/home/cobranzasYPagos/CuentaCorrienteProveedores"),
    FacturasProveedores: require("../models/home/cobranzasYPagos/FacturasProveedores"),
    //CRM 
    Error: require("../models/home/crm/Error"),
    Requerimiento: require("../models/home/crm/Requerimiento"),
    //Inventario
    Stock: require("../models/home/inventario/Stock"),
    EntradaInventario: require("../models/home/inventario/EntradaInventario"),
    SalidaInventario: require("../models/home/inventario/SalidaInventario"),
    ListaDeVenta: require("../models/home/inventario/ListaDeVenta"),
    ListaProveedores: require("../models/home/inventario/ListaProveedores"),
    //Logistica
    CertificadosLogistica: require("../models/home/logistica/CertificadosLogistica"),
    CotizacionesLogistica: require("../models/home/logistica/Cotizaciones"),
    OperacionesLogistica: require("../models/home/logistica/Operaciones"),
    GastosAgentes: require("../models/home/logistica/GastosAgentes"),
    SegurosComex: require("../models/home/logistica/SegurosComex"),
    //Tesoreria
    AnticipoFinanciero: require("../models/home/tesoreria/AnticipoFinanciero"),
    ChequesTercero: require("../models/home/tesoreria/ChequesTercero"),
    DepositoCheques: require("../models/home/tesoreria/DepositoCheques"),
    LiquidacionMoneda: require("../models/home/tesoreria/LiquidacionMoneda"),
    SaldosBancos: require("../models/home/tesoreria/SaldosBancos"),
    SaldosCajas: require("../models/home/tesoreria/SaldosCajas"),
    Transferencia: require("../models/home/tesoreria/Transferencia"),
    ///Market
    //01 - usuarioSeguridad
    User: require("../models/marketPlace/01 - usuarioSeguridad/User"),
    GrupoSeguridad: require("../models/marketPlace/01 - usuarioSeguridad/Grupo"),
    SeguridadAtributo: require("../models/marketPlace/01 - usuarioSeguridad/SeguridadAtributo"),
    //02 - clientes
    Cliente: require("../models/marketPlace/02 - clientes/Cliente"),
    ItemVenta: require("../models/marketPlace/02 - clientes/ItemVentas"),
    ListasPrecios: require("../models/marketPlace/02 - clientes/ListasPrecios"),
    //03 - proveedores
    Proveedor: require("../models/marketPlace/03 - proveedores/Proveedor"),
    ItemCompra: require("../models/marketPlace/03 - proveedores/ItemCompra"),
    //04 - stock
    Almacen: require("../models/marketPlace/04 - stock/Almacen"),
    Ubicaciones: require("../models/marketPlace/04 - stock/Ubicaciones"),
    CategoriaProducto: require("../models/marketPlace/04 - stock/CategoriaProducto"),
    Marca: require("../models/marketPlace/04 - stock/Marca"),
    OperacionStock: require("../models/marketPlace/04 - stock/OperacionStock"),
    Producto: require("../models/marketPlace/04 - stock/Producto"),
    SubCategoriaProducto: require("../models/marketPlace/04 - stock/SubCategoriaProducto"),
    //05 - comex
    AgenteComex: require("../models/marketPlace/05 - comex/AgenteComex"),
    Despachante: require("../models/marketPlace/05 - comex/Despachante"),
    TamanoContenedor: require("../models/marketPlace/05 - comex/TamanoContenedor"),
    TipoCarga: require("../models/marketPlace/05 - comex/TipoCarga"),
    TipoContenedor: require("../models/marketPlace/05 - comex/TipoContenedor"),
    TipoOperacion: require("../models/marketPlace/05 - comex/TipoOperacion"),
    TipoTransporte: require("../models/marketPlace/05 - comex/TipoTransporte"),
    Despachante: require("../models/marketPlace/05 - comex/Despachante"),
    Incoterm: require("../models/marketPlace/05 - comex/Incoterm"),
    Maritima: require("../models/marketPlace/05 - comex/Maritima"),
    //06 - tesoreria
    ItemsBancos: require("../models/marketPlace/06 - tesoreria/ItemsBancos"),
    ItemsCajas: require("../models/marketPlace/06 - tesoreria/ItemsCajas"),
    Bancos: require("../models/marketPlace/06 - tesoreria/Bancos"),
    Cajas: require("../models/marketPlace/06 - tesoreria/Cajas"),
    CuentasBancarias: require("../models/marketPlace/06 - tesoreria/CuentaBancaria"),
    Moneda: require("../models/marketPlace/06 - tesoreria/Moneda"),
    TipoPago: require("../models/marketPlace/06 - tesoreria/TipoPagos"),
    //07 - impuestos
    AgrupadorImpuesto: require("../models/marketPlace/07 - impuestos/AgrupadorImpuesto"),
    ImpuestoDefinicion: require("../models/marketPlace/07 - impuestos/ImpuestoDefinicion"),
    //08 - crm
    Criticidad: require("../models/marketPlace/08 - crm/Criticidad"),
    EmpleadosCrm: require("../models/marketPlace/08 - crm/EmpleadosCRM"),
    EntidadCrm: require("../models/marketPlace/08 - crm/EntidadCrm"),
    EstadoProceso: require("../models/marketPlace/08 - crm/EstadoProceso"),
    SectorCrm: require("../models/marketPlace/08 - crm/EmpleadosCRM"),
    Tarea: require("../models/marketPlace/08 - crm/Tarea"),
    //09 - generales
    UnidadesMedida: require("../models/marketPlace/09 - generales/UnidadesMedidas"),
    Pais: require("../models/marketPlace/09 - generales/Pais"),
    Provincia: require("../models/marketPlace/09 - generales/Provincia"),
    Ciudad: require("../models/marketPlace/09 - generales/Ciudad"),
    //Empresa
    Empresa: require("../models/desarrollo/Empresa"),
    //usuarios

    //Acumulador
    Acumulador: require('../models/Acumulador'),
    //Numerador
    Numerador: require('../models/Numerador'),
    TareasProgramadas: require('../models/TareasProgramadas'),
    LogEmails: require('../models/desarrollo/emails/LogEmails')

}


const baseDeDatos = Object.assign(baseDeDat, baseDeDatosApp)
module.exports = baseDeDatos

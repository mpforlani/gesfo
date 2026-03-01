//const IN_DOCKER = process.env.IN_DOCKER === '1';
//const BASE = process.env.BASE_URL || (IN_DOCKER ? `http://127.0.0.1:${process.env.PORTTEST}` : `http://127.0.0.1:${process.env.PORTTEST}`);

function loginAction() {

    const actions = [

        { action: 'goto', url: `http://localhost:${process.env.PORTTEST}` },
        { action: 'fill', selector: 'input[name="usernameUser"]', value: 'master' },
        { action: 'fill', selector: 'input[name="password"]', value: process.env.PASSWORDTEST },
        { action: 'click', selector: 'input[type="submit"]' },
        { action: 'sleep', ms: 150 },
        { action: 'waitForURL', urlPattern: '**/home' },
    ];

    return actions
}
function finalizarTesting() {

    const actions = [

        { action: 'endOk', mensaje: '✅ Testing finalizado correctamente' }
    ];

    return actions
}
function ingresarRegistros(entidad, atributos) {

    const acciones = [];

    acciones.push(
        { action: 'hover', selector: '.nav-vert' },
        { action: 'waitForSelector', selector: '.desplegableAbm', state: 'visible', timeout: 5000 },
        { action: 'clickClosestDesplegable', selector: `.menuFormulario#${entidad}` },
        { action: 'click', selector: `.menuFormulario#${entidad}` },
        { action: 'click', selector: `.closeNavegacion` }
    );

    for (const [indice, valor] of Object.entries(atributos)) {

        acciones.push({
            action: 'completarAtributo', name: indice, value: valor
        });
    }

    return acciones;
}
function ingresarRegistrosIndAbm(entidad, registros) {

    const acciones = [];

    acciones.push(

        { action: 'clickIndAbm', selector: `.menuSelectAbm#${entidad}` }
    );
    for (const atributos of registros) {

        for (const [indice, valor] of Object.entries(atributos)) {

            acciones.push({
                action: 'completarAtributo', name: indice, value: valor,
            });
        }
        acciones.push(
            { action: 'completarColecciones' },
            { action: 'click', selector: `.comanderaPestana.active span.okBoton` }

        );
    }
    acciones.push(

        { action: 'closeOrigen' },
        { action: 'click', selector: `.pestana.active .closeFormInd` }


    );

    return acciones;
}


module.exports = { loginAction, ingresarRegistros, ingresarRegistrosIndAbm, finalizarTesting };

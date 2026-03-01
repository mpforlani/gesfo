const paginasLocales = {

    generales: {
        primero: [
            "/js/caracteristicaEmpresa.js"
        ]
    },
    seguridad: {
        primero: [
            "/js/inicioHome.js"
        ]
    },
    funcionalidades: {
        primero: [

            "/js/funcionalidades/objetos y funciones iniciales.js",

        ]
    },
}

$.each(paginasLocales, (key, value) => {

    $.each(value, (ind, val) => {

        switch (ind) {

            case "ultimo":
                modulosPages[key].push(...paginasLocales[key].ultimo);

                break;
            case "indice":

                modulosPages[key].splice(paginasLocales[key].indice.ind, 0, ...paginasLocales[key].indice.files);

                break;
            case "primero":

                modulosPages[key].unshift(...paginasLocales[key].primero);

                break;
        }
    })
})



archivosInicios(modulosPages)

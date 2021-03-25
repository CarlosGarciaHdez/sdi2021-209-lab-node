module.exports = function (app, swig) {

    app.get("/autores", function (req, res) {
        let autores = [{
            "nombre": "Diego",
            "rol": "Cantante"
        }, {
            "nombre": "Andres",
            "rol": "Guitarrista"
        }, {
            "nombre": "Sara",
            "rol": "Bateria"
        }];
        let respuesta = swig.renderFile('views/autores.html', {
            vendedor: 'Lista de Autores',
            autores: autores
        });

        res.send(respuesta);
    });

    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {});
        res.send(respuesta);
    })

    app.post('/autores/agregar', function (req, res) {
        res.send("Autor agregado: " + req.body.nombre + "<br>"
            + "Grupo: " + req.body.grupo + "<br>"
            + "Rol: " + req.body.rol);
    })

    app.get('/autores/*', function (req, res) {
        res.redirect('/autores');
    })
};
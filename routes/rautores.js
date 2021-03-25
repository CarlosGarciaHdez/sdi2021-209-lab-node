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
        }, {
            "nombre": "Lucia",
            "rol": "Bajista"
        }, {
            "nombre": "Omar",
            "rol": "Teclista"
        }];
        let respuesta = swig.renderFile('views/autores.html', {
            vendedor: 'Lista de Autores',
            autores: autores
        });

        res.send(respuesta);
    });

    app.get('/autores/agregar', function (req, res) {
        let roles = ["Cantante", "Bateria", "Guitarrista", "Bajista", "Teclista"];
        let respuesta = swig.renderFile('views/autores-agregar.html', {
            roles: roles
        });
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
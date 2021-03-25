module.exports = function (app, swig) {

    app.get("/autores", function (req, res) {
        let autores = getAutores();
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

    app.get("/autores/filtrar/:rol", function (req, res) {
        let autores = getAutores(req.params.rol);
        let respuesta = swig.renderFile('views/autores.html', {
            vendedor: 'Lista de Autores',
            autores: autores
        });

        res.send(respuesta);
    });

    app.get('/autores/*', function (req, res) {
        res.redirect('/autores');
    })

    function getAutores(rol) {
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

        if (rol == null) {
            return autores;
        } else {
            let respuesta = [];
            autores.forEach(function (autor) {
                if (autor.rol == rol) {
                    respuesta.push(autor);
                }
            })
            return respuesta;
        }
    }
};
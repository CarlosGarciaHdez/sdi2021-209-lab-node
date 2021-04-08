module.exports = function(app, swig, gestorDB) {
    app.get("/usuarios", function(req, res) {
        res.send("ver usuarios");
    });

    app.get("/identificarse", function(req, res) {
        let respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });

    app.get("/registrarse", function(req, res) {
        let respuesta = swig.renderFile('views/bregistro.html', {});
        res.send(respuesta);
    });

    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.send("Usuario desconectado");
    })

    app.post("/identificarse", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email : req.body.email,
            password : seguro
        }
        gestorDB.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.send("No identificado: ");
            } else {
                req.session.usuario = usuarios[0].email;
                res.send("identificado");
            }
        });
    });

    app.post('/usuario', function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let usuario = {
            email : req.body.email,
            password : seguro
        }
        gestorDB.insertarUsuario(usuario, function(id) {
            if (id == null){
                res.send("Error al insertar el usuario");
            } else {
                req.session.usuario = usuario.email;
                res.send('Usuario Insertado ' + id);
            }
        });
    });
};
module.exports = function (app, gestorBD) {

    app.get("/api/cancion", function (req, res) {
        gestorBD.obtenerCanciones({}, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones));
            }
        });
    });

    app.get("/api/cancion/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones[0]));
            }
        });
    });

    app.delete("/api/cancion/:id", function (req, res) {
        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        validaAutorCancion(criterio, req.headers.token, function (isAutor) {
            if (isAutor) {
                gestorBD.eliminarCancion(criterio, function (canciones) {
                    if (canciones == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.send(JSON.stringify(canciones));
                    }
                });
            } else {
                res.status(403);
                res.json({
                    errorAutor: "El usuario autenticado no es autor de esta cancion"
                })
            }
        })
    });

    app.post("/api/cancion", function (req, res) {
        let cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio,
        }
        // ¿Validar nombre, genero, precio?
        validaDatosCancion(cancion, function (listaErrores) {
            if (listaErrores !== null || errors.length > 0) {
                res.status(403);
                res.json({
                    errores: listaErrores
                })
            } else {
                gestorBD.insertarCancion(cancion, function (id) {
                    if (id == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.json({
                            mensaje: "canción insertada",
                            _id: id
                        })
                    }
                });
            }
        })
    });

    app.put("/api/cancion/:id", function (req, res) {

        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};

        let cancion = {}; // Solo los atributos a modificar
        if (req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if (req.body.genero != null)
            cancion.genero = req.body.genero;
        if (req.body.precio != null)
            cancion.precio = req.body.precio;
        validaAutorCancion(criterio, function (isAutor) {
            if (isAutor) {
                validaDatosCancion(cancion, function (listaErrores) {
                    if (listaErrores !== null || errors.length > 0) {
                        res.status(403);
                        res.json({
                            errores: listaErrores
                        })
                    } else {
                        gestorBD.modificarCancion(criterio, cancion, function (result) {
                            if (result == null) {
                                res.status(500);
                                res.json({
                                    error: "se ha producido un error"
                                })
                            } else {
                                res.status(200);
                                res.json({
                                    mensaje: "canción modificada",
                                    _id: req.params.id
                                })
                            }
                        });
                    }
                })
            } else {
                res.status(403);
                res.json({
                    errorAutor: "El usuario autenticado no es autor de esta cancion"
                })
            }
        })
    });

    app.post("/api/autenticar", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401);
                res.json({
                    autenticado: false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email, tiempo: Date.now() / 1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token: token
                })
            }
        })
    })

    function validaDatosCancion(cancion, funcionCallback) {
        let errors = new Array();
        if (cancion.nombre === null || typeof cancion.nombre === 'undefined' ||
            cancion.nombre === "")
            errors.push("El nombre de la canción no puede estar vacio")
        if (cancion.genero === null || typeof cancion.genero === 'undefined' ||
            cancion.genero === "")
            errors.push("El género de la canción no puede estar vacio")
        if (cancion.precio === null || typeof cancion.precio === 'undefined' ||
            cancion.precio < 0 || cancion.precio === "")
            errors.push("El precio de la canción no puede ser negativo")
        if (errors.length <= 0)
            funcionCallback(null)
        else
            funcionCallback(errors)
    }

    function validaAutorCancion(criterio, token, funcionCallback) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const buff = new Buffer(base64, 'base64');
        const payloadinit = buff.toString('ascii');
        const payload = JSON.parse(payloadinit);
        criterio.autor = payload.usuario;
        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones.length == 0) {
                return funcionCallback(false)
            } else {
                return funcionCallback(true)
            }
        })
    }
}
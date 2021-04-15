module.exports = function (app, swig, gestorBD) {
    app.post('/comentario/:id', function (req, res) {
        let comentario = {
            autor: req.session.usuario,
            texto: req.body.texto,
            cancion_id: gestorBD.mongo.ObjectID(req.params.id.substr(1))
        }
        // Conectarse
        gestorBD.insertarComentario(comentario, function (id) {
                if (id == null) {
                    res.redirect("/error?mensaje=Error al insertar ");
                } else {
                    let criterio = {"cancion_id": gestorBD.mongo.ObjectID(req.params.id.substr(1))};
                    gestorBD.obtenerComentarios(criterio, function (comentarios) {
                        if (comentarios == null) {
                            res.redirect("/error?mensaje=Error al recuperar los comentarios.");
                        } else {
                            let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id.substr(1)) };
                            gestorBD.obtenerCanciones(criterio,function(canciones){
                                if ( canciones == null ){
                                    res.redirect("/error?mensaje=Error al recuperar la canción.");
                                } else {
                                    let respuesta = swig.renderFile('views/bcancion.html',
                                        {
                                            comentarios: comentarios,
                                            cancion : canciones[0]
                                        });
                                    res.send(respuesta);
                                }
                            });
                        }
                    });
                }
            }
        );
    })
};
var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Informe = require('../models/informe');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['usuarios', 'informes'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccion una imagen' }
        });
    }


    // Obtener el nombre del archivo
    var archivo = req.files.img;
    var nombreSplit = archivo.name.split('.');
    var extensionArchivo = nombreSplit[nombreSplit.length - 1].toLowerCase();

    //Extensiones permitidas

    var extensionesValidas = ['png', 'jpg', 'pdf', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son' + extensionesValidas.join(', ') }
        });
    }

    // nombre archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover el temporal al path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        /* res.status(200).json({
            ok: true,
            mensaje: 'Archivo movido',
            extensionArchivo: extensionArchivo
        }); */
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe imagen con ese id y tipo',
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':D';

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'El usuario no ha sido actualizado',
                        errors: err
                    });

                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });


        });

    }

    if (tipo === 'informes') {

        Informe.findById(id, (err, informe) => {

            if (!informe) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Informe no existe',
                    errors: { message: 'Informe no existe' }
                });
            }

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe imagen con ese id y tipo',
                    errors: err
                });
            }

            var pathViejo = './uploads/informes/' + informe.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            informe.img = nombreArchivo;

            informe.save((err, informeActualizado) => {

                informeActualizado.password = ':D';

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'El informe no ha sido actualizado',
                        errors: err
                    });

                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de informe actualizada',
                    informe: informeActualizado
                });

            });


        });

    }
    /* 

        Informe.findById(id, (err, informe) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe imagen con ese id y tipo',
                    errors: err
                });
            }

            var pathViejo = './uploads/informes/' + informe.img;

            //si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            informe.img = nombreArchivo;

            informe.save((err, informeActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'El informe no ha sido actualizado',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de informe actualizada',
                    informe: informeActualizado
                });
            });
        });
    } */



}

module.exports = app;
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Informe = require('../models/informe');


//Obtener todos los informes

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Informe.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre role email')
        .exec(
            (err, informes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando informes',
                        errors: err
                    });
                }

                Informe.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        informes: informes,
                        total: conteo
                    });
                });

            });
});





// Actualizar informe
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Informe.findById(id, (err, informe) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar informe',
                errors: err
            });
        }

        if (!informe) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El informe con el id ' + id + ' no existe',
                errors: { message: 'No existe un informe con ese ID' }
            });
        }

        var body = req.body;


        informe.lider = body.lider;
        informe.fecReunion = body.fecReunion;
        informe.evento = body.evento;
        informe.semana = body.semana;
        informe.cmep = body.cmep;
        informe.ccelula = body.ccelula;
        informe.ceb = body.ceb;
        informe.cculto = body.cculto;
        informe.acelula = body.acelula;
        informe.aeb = body.aeb;
        informe.aculto = body.aculto;
        informe.epganar = body.epganar;
        informe.epafirmar = body.epafirmar;
        informe.epdiscipular = body.epdiscipular;
        informe.puntuacion = body.puntuacion;
        informe.ofrenda = body.ofrenda;
        informe.logrometa = body.logrometa;
        informe.img = body.img;
        informe.comentarios = body.comentarios;
        informe.nombre = req.usuario._id;




        informe.save((err, informeGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar informe',
                    informe: informeGuardado,
                    err: err

                });
            }

            res.status(200).json({
                ok: true,
                informe: informeGuardado
            });
        });
    });
});




// Crear nuevo informe

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var informe = new Informe({
        lider: body.lider,
        fecReunion: body.fecReunion,
        evento: body.evento,
        semana: body.semana,
        cmep: body.cmep,
        ccelula: body.ccelula,
        ceb: body.ceb,
        cculto: body.cculto,
        acelula: body.acelula,
        aeb: body.aeb,
        aculto: body.aculto,
        epganar: body.epganar,
        epafirmar: body.epafirmar,
        epdiscipular: body.epdiscipular,
        puntuacion: body.puntuacion,
        ofrenda: body.ofrenda,
        logrometa: body.logrometa,
        comentarios: body.comentarios,
        img: body.img,
        usuario: req.usuario._id
    });

    informe.save((err, informeGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear informe',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            informe: informeGuardado
        });
    });
});



//Borrar un informe

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Informe.findByIdAndRemove(id, (err, informeBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar informe',
                errors: err
            });
        }

        if (!informeBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un informe con ese ID',
                errors: { message: 'No existe un informe con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            informe: informeBorrado
        });
    });
});

module.exports = app;
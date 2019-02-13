var express = require('express');

var app = express();
var Informe = require('../models/informe');
var Usuario = require('../models/usuario');

// Busqueda por coleccion

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');


    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regexp);
            break;

        case 'informes':
            promesa = buscarInforme(busqueda, regexp);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: Usuarios, Informes',
                error: { message: 'Tipo de tabla/coleccion no válido' }

            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            tabla: data

        });
    });
});

// Busqueda general

app.get('/todo/:busqueda', (req, res, next) => {


    var desde = req.query.desde || 0;
    desde = Number(desde);

    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');

    Promise.all([
            buscarUsuario(busqueda, regexp),
            buscarInforme(busqueda, regexp)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                totalU: respuestas[0].length,
                usuarios: respuestas[0],
                totalI: respuestas[1].length,
                informes: respuestas[1]

            });
        });
});


function buscarUsuario(busqueda, regexp) {

    return new Promise((resolve, reject) => {
        //or and
        Usuario.find({}, 'nombre email role')

        .or([{ 'nombre': regexp }, { 'email': regexp }])
            .populate('usuario', 'nombre email')
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    /* 
                    Usuario.count({}, (err, conteo) => {

                        res.status(200).json({
                            ok: true,
                            usuarios: usuarios,
                            total: conteo
                        });
                    }); 
                    */
                    resolve(usuarios);
                }

                /* Usuario.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                }); */

            });

    });
}

function buscarInforme(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Informe.find()
            //.and([{ 'fecReunion': regexp }, { 'supsec': regexp }])
            .or([{ 'semana': regexp }, { 'supsec': regexp }])
            .populate('usuario', 'nombre email')
            .exec(
                (err, informes) => {

                    if (err) {
                        reject('Error al cargar informes', err);
                    } else {
                        /* Informe.count({}, (err, conteo) => {

                            res.status(200).json({
                                ok: true,
                                informes: informes,
                                total: conteo
                            });
                        }); */
                        resolve(informes);
                    }

                    /* Informe.count({}, (err, conteo) => {

                        res.status(200).json({
                            ok: true,
                            informes: informes,
                            total: conteo
                        });
                    }); */
                });
    });
}
/* 
function buscarInforme(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Informe.find({ nombre: regexp })
            .exec(
                (err, informes) => {

                    if (err) {
                        reject('Error al cargar informes', err);
                    } else {
                        resolve(informes);
                    }
                });
    });
} */

module.exports = app;
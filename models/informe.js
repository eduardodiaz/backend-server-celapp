var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var informeSchema = new Schema({

    //supsec y supaux se autocompletaran al seleccionar el lider
    //supsec: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El supervisor de sector es necesario'] },
    //supaux: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El supervisor auxiliar es necesario'] },
    lider: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El líder es necesario'] },
    fecReunion: { type: String, required: [false, 'La fecha de reunión es necesario'] },
    evento: { type: String, required: [false, 'El evento es necesario'] },
    semana: { type: String, required: [false, 'La semana es necesario'] },
    cmep: { type: String, required: [false, 'Los colaboradores al MEP es necesario'] },
    ccelula: { type: String, required: [false, 'Los colaboradores a la célula es necesario'] },
    ceb: { type: String, required: [false, 'Los colaboradores a EB es necesario'] },
    cculto: { type: String, required: [false, 'Los colaboradores al culto es necesario'] },
    acelula: { type: String, required: [false, 'Los amigos a la celula es necesario'] },
    aeb: { type: String, required: [false, 'Los amigos a EB es necesario'] },
    aculto: { type: String, required: [false, 'Los amigos al culto es necesario'] },
    epganar: { type: String, required: [false, 'Los EP de ganar es necesario'] },
    epafirmar: { type: String, required: [false, 'Los EP de afirmar necesario'] },
    epdiscipular: { type: String, required: [false, 'Los EP de discipular es necesario'] },
    puntuacion: { type: String, required: [false, 'La puntuación es necesario'] },
    ofrenda: { type: String, required: [false, 'La ofrenda es necesario'] },
    logrometa: { type: String, required: [false, 'Logro de Meta es necesario'] },
    comentarios: { type: String, required: [false, 'Los comentarios son necesarios'] },
    img: { type: String, required: [false, 'La img no es necesarios'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

}, { collection: 'informes' });

module.exports = mongoose.model('Informe', informeSchema);
const mongoose = require("mongoose");

//Definir esquema
const ArticuloSchema = mongoose.Schema({ 
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: String,
        default: "default.png"
    }
});

module.exports = mongoose.model("Articulo", ArticuloSchema);
const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
    descripcion: String,
    nombre: String,
    precio: Number,
});

module.exports = mongoose.model("Menu", MenuSchema);
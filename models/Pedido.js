const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
    items: [String],
    status: { type: String, default: "pendiente" },
});

module.exports = mongoose.model("Pedido", PedidoSchema);
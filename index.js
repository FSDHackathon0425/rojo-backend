require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Conexión exitosa a MongoDB"))
.catch((err) => console.error("Error conectando a MongoDB:", err));

const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

/***
 * BOT Commands
 ***/
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  console.log(msg);

  const menus = [
    {
      id: 1,
      name: "Menu del dia ",
      description: "Mu rico",
      price: 10,
    },
  ];
  // Process the incoming message here
  if (messageText === "/start") {
    bot.sendMessage(chatId, "Hello World!");
    const photoUrl = "https://www.example.com/image.png";
    bot.sendPhoto(chatId, photoUrl, { caption: "Here is your photo!" });
    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: menus.map((menu) => [
          { text: menu.text, callback_data: menu.callback_data },
        ]),
      },
    };

    // Send a message with the inline keyboard
    bot.sendMessage(chatId, "Choose an option:", inlineKeyboard);
  }
});

// Handle callback queries
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  // Send a message based on the callback data
  bot.sendMessage(message.chat.id, `You selected option ${data}`);
});

/***
 * END BOT Commands
 ***/

/***
 * HTTP Express Backend Commands
 ***/

// Importamos o requerimos express
const express = require("express");
const port = 3333;

//Instanciamos express
const app = express();

//Hacemos que funcione el req.body
app.use(express.json());

const Menu = require("./models/Menu");
const Pedido = require("./models/Pedido");
//get menus
app.get("/menus", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener menus" });
  }
});

// get pedidos
app.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

// patch pedidos
app.patch("/pedidos/:id", async (req, res) => {
  try {
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      { status: "sent" },
      { new: true }
    );
    if (!pedidoActualizado) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(pedidoActualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar pedido" });
  }
});

// post pedios
app.post("/pedidos", async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Por favor envia al menos un item en el pedido" });
  }

  try {
    const nuevoPedido = new Pedido({
      items,
      status: "pendiente",
    });

    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (err) {
    res.status(500).json({ error: "Error al crear el pedido" });
  }
});

// Arrancamos el servidor para que escuche llamadas
app.listen(port, () => {
  "El servidor está escuchando en el puerto " + port;
});

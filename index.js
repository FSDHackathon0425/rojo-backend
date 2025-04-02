require("dotenv").config();

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

// Arrancamos el servidor para que escuche llamadas
app.listen(port, () => {
  "El servidor está escuchando en el puerto " + port;
});

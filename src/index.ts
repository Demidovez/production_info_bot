import { throws } from "assert";
import { Telegraf, Scenes } from "telegraf";
import LocalSession from "telegraf-session-local";
import { getProduction } from "./data/get_production";
import { getTrend } from "./data/get_trend";
import MARKUPS from "./markups/markups";

// Инициализируем бота
const bot = new Telegraf<Scenes.SceneContext>(process.env.BOT_TOKEN as string);
const localSession = new LocalSession({
  database: process.env.SESSION_DB as string,
});

bot.use(localSession.middleware());

// Создаем сцены
const stage = new Scenes.Stage<Scenes.SceneContext>([]);

// Подключаем сцены к боту
bot.use(stage.middleware());

bot.use((ctx, next) => {
  next();
});

bot.start((ctx) => {
  ctx.reply("Выберите пункт меню!", MARKUPS.COMMON);
});

bot.action(/addUser \|(.+)\| \|(.+)\| \|(.+)\|/, async (ctx) => {
  try {
    const id = ctx.match[1];
    const username = ctx.match[2];
    const fio = ctx.match[3];

    const lineToFile = `${id}|${username}|${fio}\n`;

    ctx.reply(lineToFile);
  } catch (err) {
    console.log(err);
  }
});

bot.hears(/Производительность/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  getProduction()
    .then((image64) =>
      ctx.replyWithPhoto(
        {
          source: Buffer.from(image64, "base64"),
        },
        {
          reply_markup: MARKUPS.COMMON.reply_markup,
        }
      )
    )
    .catch((err) => {
      console.log(err);

      ctx.reply(`Ошибка`, MARKUPS.COMMON);
    });
});

bot.hears(/Тренд/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  getTrend()
    .then((image64) =>
      ctx.replyWithPhoto(
        {
          source: Buffer.from(image64, "base64"),
        },
        {
          reply_markup: MARKUPS.COMMON.reply_markup,
        }
      )
    )
    .catch((err) => {
      console.log(err);

      ctx.reply(`Ошибка`, MARKUPS.COMMON);
    });
});

bot.hears(/Уровни/i, (ctx) => {
  ctx.reply(`Вот такие у нас уровни`, MARKUPS.COMMON);
});

bot.hears(/Дополнительно/i, (ctx) => {
  ctx.reply(`Вот такое у нас дополнительно`, MARKUPS.COMMON);
});

bot.hears(/KAPPA/i, (ctx) => {
  ctx.reply(`Вот такая у нас KAPPA`, MARKUPS.COMMON);
});

bot.hears(/Баланс/i, (ctx) => {
  ctx.reply(`Вот такой у нас баланс`, MARKUPS.COMMON);
});

bot.hears(/Выработка/i, (ctx) => {
  ctx.reply(`Вот такая у нас выработка`, MARKUPS.COMMON);
});

// Проверка пользователем на работоспособность
bot.on("text", (ctx) => {
  ctx.reply(`Работает`);
});

bot.launch();
console.log(`Started ${process.env.BOT_NAME} :: ${new Date()}`);

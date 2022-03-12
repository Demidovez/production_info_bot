import { Telegraf, Scenes, Markup } from "telegraf";
import LocalSession from "telegraf-session-local";
import { getSimpleScreen } from "./data/get_simple_screen";
import MARKUPS from "./markups/markups";
import SCREENS from "./eserver_screens/screens";
import {
  getLevelHelp,
  replyError,
  replyWithPhoto,
  replyWithPhotoFile,
} from "./utils/utils";
import { getFullScreen } from "./data/get_full_screen";

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

// Добавление нового пользователя
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

// Реакция на запрос экрана производительности
bot.hears(/Производительность/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  getSimpleScreen(SCREENS.PRODUCTION)
    .then((image64) => replyWithPhoto(ctx, image64, MARKUPS.COMMON))
    .catch((err) => replyError(ctx, err, MARKUPS.COMMON));
});

// Реакция на запрос экрана с трендом
bot.hears(/Тренд/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  getSimpleScreen(SCREENS.TREND)
    .then((image64) => replyWithPhoto(ctx, image64, MARKUPS.COMMON))
    .catch((err) => replyError(ctx, err, MARKUPS.COMMON));
});

// Реакция на запрос экрана с уровнями баков
bot.hears(/Уровни/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  getSimpleScreen(SCREENS.LEVELS)
    .then((image64) => replyWithPhoto(ctx, image64, MARKUPS.INLINE_LEVEL_HELP))
    .catch((err) => replyError(ctx, err, MARKUPS.COMMON));
});

// Реакция на запрос экрана с дополнительной информацией
bot.hears(/Дополнительно/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  getSimpleScreen(SCREENS.ADDITIONAL)
    .then((image64) => replyWithPhoto(ctx, image64, MARKUPS.COMMON))
    .catch((err) => replyError(ctx, err, MARKUPS.COMMON));
});

// Реакция на запрос экрана данных по KAPPA
bot.hears(/KAPPA/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  getSimpleScreen(SCREENS.KAPPA)
    .then((image64) => replyWithPhoto(ctx, image64, MARKUPS.COMMON))
    .catch((err) => replyError(ctx, err, MARKUPS.COMMON));
});

// Реакция на запрос экрана по балансу на варке
bot.hears(/Баланс/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  getFullScreen(SCREENS.BALANCE)
    .then((image64) =>
      replyWithPhotoFile(ctx, image64, MARKUPS.COMMON, "Баланс")
    )
    .catch((err) => replyError(ctx, err, MARKUPS.COMMON));
});

// Реакция на запрос экрана выработки
bot.hears(/Выработка/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  getSimpleScreen(SCREENS.OUTPUT)
    .then((image64) => replyWithPhoto(ctx, image64, MARKUPS.COMMON))
    .catch((err) => replyError(ctx, err, MARKUPS.COMMON));
});

// Ответ на запрос справки для обозначений на экране Уровни
bot.action(/level_help/i, (ctx) => {
  ctx.reply(getLevelHelp(), MARKUPS.COMMON);
});

// Проверка пользователем на работоспособность
bot.on("text", (ctx) => {
  ctx.reply("Работает", MARKUPS.COMMON);
});

bot.launch();
console.log(`Started ${process.env.BOT_NAME} :: ${new Date()}`);

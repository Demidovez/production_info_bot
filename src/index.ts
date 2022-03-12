import { Telegraf, Scenes, Markup } from "telegraf";
import LocalSession from "telegraf-session-local";
import { getSimpleScreen } from "./data/get_simple_screen";
import SCREENS from "./eserver_screens/screens";
import {
  getLevelHelp,
  getMarkup,
  replyError,
  replyUnaccess,
  replyWithPhoto,
  replyWithPhotoFile,
  sendDataInterval,
} from "./utils/utils";
import { getFullScreen } from "./data/get_full_screen";
import { ROLES, UserContext } from "./types/types";
import { getUser } from "./data/get_user";
import MARKUPS from "./markups/markups";

// Инициализируем бота
const bot = new Telegraf<UserContext>(process.env.BOT_TOKEN as string);
const localSession = new LocalSession({
  database: process.env.SESSION_DB as string,
});

bot.use(localSession.middleware());

// Создаем сцены
const stage = new Scenes.Stage<UserContext>([]); // Scenes.SceneContext

// Подключаем сцены к боту
bot.use(stage.middleware());

// Определяем роли доступа пользователя
bot.use((ctx, next) => {
  getUser(ctx.from!.id)
    .then((user) => {
      if (user) {
        ctx.session.roles = user.roles;
        next();
      } else {
        ctx.reply("У Вас нет доступа!");
      }
    })
    .catch((err) => {
      console.log(err);
      ctx.reply("Ошибка доступа!");
    });
});

bot.start((ctx) => {
  ctx.reply("Выберите пункт меню!", getMarkup(ctx.session.roles));
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

sendDataInterval(bot, 3600 * 1000, [SCREENS.PRODUCTION]);

// Реакция на запрос экрана производительности
bot.hears(/Производительность/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  if (ctx.session.roles?.includes(ROLES.common)) {
    getSimpleScreen(SCREENS.PRODUCTION)
      .then((image64) =>
        replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
      )
      .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  } else {
    replyUnaccess(ctx, getMarkup(ctx.session.roles));
  }
});

// Реакция на запрос экрана с трендом
bot.hears(/Тренд/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  if (ctx.session.roles?.includes(ROLES.common)) {
    getSimpleScreen(SCREENS.TREND)
      .then((image64) =>
        replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
      )
      .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  } else {
    replyUnaccess(ctx, getMarkup(ctx.session.roles));
  }
});

// Реакция на запрос экрана с уровнями баков
bot.hears(/Уровни/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  if (ctx.session.roles?.includes(ROLES.common)) {
    getSimpleScreen(SCREENS.LEVELS)
      .then((image64) =>
        replyWithPhoto(ctx, image64, MARKUPS.INLINE_LEVEL_HELP)
      )
      .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  } else {
    replyUnaccess(ctx, getMarkup(ctx.session.roles));
  }
});

// Реакция на запрос экрана с дополнительной информацией
bot.hears(/Дополнительно/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  if (ctx.session.roles?.includes(ROLES.common)) {
    getSimpleScreen(SCREENS.ADDITIONAL)
      .then((image64) =>
        replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
      )
      .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  } else {
    replyUnaccess(ctx, getMarkup(ctx.session.roles));
  }
});

// Реакция на запрос экрана данных по KAPPA
bot.hears(/KAPPA/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  if (ctx.session.roles?.includes(ROLES.common)) {
    getSimpleScreen(SCREENS.KAPPA)
      .then((image64) =>
        replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
      )
      .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  } else {
    replyUnaccess(ctx, getMarkup(ctx.session.roles));
  }
});

// Реакция на запрос экрана по балансу на варке
bot.hears(/Баланс/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  if (ctx.session.roles?.includes(ROLES.common)) {
    getFullScreen(SCREENS.BALANCE)
      .then((image64) =>
        replyWithPhotoFile(ctx, image64, "Баланс", getMarkup(ctx.session.roles))
      )
      .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  } else {
    replyUnaccess(ctx, getMarkup(ctx.session.roles));
  }
});

// Реакция на запрос экрана выработки
bot.hears(/Выработка/i, (ctx) => {
  ctx.replyWithChatAction("upload_photo");

  if (ctx.session.roles?.includes(ROLES.virabotka)) {
    getSimpleScreen(SCREENS.OUTPUT)
      .then((image64) =>
        replyWithPhoto(ctx, image64, getMarkup(ctx.session.roles))
      )
      .catch((err) => replyError(ctx, err, getMarkup(ctx.session.roles)));
  } else {
    replyUnaccess(ctx, getMarkup(ctx.session.roles));
  }
});

// Ответ на запрос справки для обозначений на экране Уровни
bot.action(/level_help/i, (ctx) => {
  if (ctx.session.roles?.includes(ROLES.common)) {
    ctx.reply(getLevelHelp(), getMarkup(ctx.session.roles));
  }
});

// Проверка пользователем на работоспособность
bot.on("text", (ctx) => {
  ctx.reply("Работает", getMarkup(ctx.session.roles));
});

bot.launch();
console.log(`Started ${process.env.BOT_NAME} :: ${new Date()}`);

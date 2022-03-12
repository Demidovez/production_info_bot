import { Markup, NarrowedContext, Scenes, Telegraf, Types } from "telegraf";
import {
  InlineKeyboardMarkup,
  Message,
  ReplyKeyboardMarkup,
} from "telegraf/typings/core/types/typegram";
import { EMarkup, ROLES, UserContext } from "../types/types";
import MARKUPS from "../markups/markups";
import { getSimpleScreen } from "../data/get_simple_screen";

type CTX = NarrowedContext<
  Scenes.SceneContext<Scenes.SceneSessionData> & {
    match: RegExpExecArray;
  },
  Types.MountMap["text"]
>;

export const replyWithPhoto = (
  ctx: CTX,
  image64: string,
  markup?: Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup>
): Promise<Message.PhotoMessage> => {
  return ctx.replyWithPhoto(
    {
      source: Buffer.from(image64, "base64"),
    },
    {
      reply_markup: markup?.reply_markup,
    }
  );
};

export const replyWithPhotoFile = (
  ctx: CTX,
  image64: string,
  caption: string,
  markup?: Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup>
): Promise<Message.DocumentMessage> => {
  return ctx.replyWithDocument(
    {
      source: Buffer.from(image64, "base64"),
      filename: "image.jpg",
    },
    {
      reply_markup: markup?.reply_markup,
      caption: caption,
    }
  );
};

export const replyError = (
  ctx: CTX,
  err: any,
  markup?: Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup>
) => {
  console.log(err);

  ctx.reply(`Ошибка`, markup);
};

export const replyUnaccess = (
  ctx: CTX,
  markup?: Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup>
) => {
  ctx.reply(`У вас нет доступа!`, markup);
};

export const getLevelHelp = (): string => {
  return `
СМ1 - Бак сульфатного мыла 1
СМ2 - Бак сульфатного мыла 2
ТМ1 - Бак таллового масла 1
ТМ2 - Бак таллового масла 2

СЩ1 - Бак слабого щелока 1
СЩ2 - Бак слабого щелока 2
ЩС - Бак щелока для сжигания
КЩ - Бак крепкого щелока
СЩ - Бак сливного щелока
ПЩ - Бак промежуточного щелока
СМ - Бак сульфатного мыла

ЧБЩ - Бак чистого белого щелока
МЗЩ - Бак мутного зеленого щелока
ОЗЩ - Бак очищенного зеленого щелока
ОИ - Бункер обоженной извести
ИК - Бункер известкового камня
СБЩ - Бак слабого белого щелока
ИШ - Бак известкового шлама
  `;
};

export const getMarkup = (
  roles?: string[]
): Markup.Markup<ReplyKeyboardMarkup | InlineKeyboardMarkup> => {
  if (roles && roles.includes(ROLES.common)) {
    return MARKUPS.COMMON;
  } else {
    return MARKUPS.COMMON;
  }
};

export const sendDataInterval = (
  bot: Telegraf<UserContext>,
  delay: number,
  screens: string[]
) => {
  const msToNextHour = 3600000 - (new Date().getTime() % 3600000);

  setTimeout(() => {
    sendScreens();

    setInterval(sendScreens, delay);
  }, msToNextHour);

  const sendScreens = () => {
    screens.map((screen) => {
      getSimpleScreen(screen)
        .then((image64) =>
          bot.telegram.sendPhoto(321438949, {
            source: Buffer.from(image64, "base64"),
          })
        )
        .catch((err) => console.log(err));
    });
  };
};

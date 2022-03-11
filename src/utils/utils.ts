import { Markup, NarrowedContext, Scenes, Types } from "telegraf";
import {
  Message,
  ReplyKeyboardMarkup,
} from "telegraf/typings/core/types/typegram";
import MARKUPS from "../markups/markups";

type CTX = NarrowedContext<
  Scenes.SceneContext<Scenes.SceneSessionData> & {
    match: RegExpExecArray;
  },
  Types.MountMap["text"]
>;

export const replyWithPhoto = (
  ctx: CTX,
  image64: string,
  markup: Markup.Markup<ReplyKeyboardMarkup>
  // inlineMarkup:
): Promise<Message.PhotoMessage> => {
  return ctx.replyWithPhoto(
    {
      source: Buffer.from(image64, "base64"),
    },
    {
      reply_markup: markup.reply_markup,
    }
  );
};

export const replyWithPhotoAndKeybord = async (
  ctx: CTX,
  image64: string,
  markup: Markup.Markup<ReplyKeyboardMarkup>
): Promise<any> => {
  // await ctx
  //   .reply("Загрузка...", markup)
  //   .then((data) => ctx.deleteMessage(data.message_id));

  return ctx
    .replyWithPhoto(
      {
        source: Buffer.from(image64, "base64"),
      },
      markup
    )
    .then((data) =>
      ctx.editMessageReplyMarkup({
        inline_keyboard: [[Markup.button.callback("Coke", "Coke")]],
      })
    );

  // return ctx.editMessageMedia(
  //   { type: "photo", media: { source: Buffer.from(image64, "base64") } },
  //   MARKUPS.INLINE_LEVEL_HELP
  // );

  // return ctx.replyWithPhoto(
  //   {
  //     source: Buffer.from(image64, "base64"),
  //   },
  //   MARKUPS.INLINE_LEVEL_HELP
  // );
};

export const replyError = (
  ctx: CTX,
  err: any,
  markup: Markup.Markup<ReplyKeyboardMarkup>
) => {
  console.log(err);

  ctx.reply(`Ошибка`, markup);
};

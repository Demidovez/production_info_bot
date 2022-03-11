import { Markup } from "telegraf";

const COMMON = [
  ["Производительность", "Тренд"],
  ["Уровни", "Дополнительно"],
  ["KAPPA", "Баланс"],
  ["Выработка"],
];

const TEST = [["Производительность"]];

export default {
  COMMON: Markup.keyboard(COMMON).resize(),
  INLINE_LEVEL_HELP: Markup.inlineKeyboard([
    Markup.button.callback("Справка", "level_help"),
  ]),
  TEST: Markup.keyboard(TEST).resize(),
};

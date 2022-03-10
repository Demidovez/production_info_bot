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
  TEST: Markup.keyboard(TEST).resize(),
};

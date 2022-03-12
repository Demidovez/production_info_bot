import { Scenes } from "telegraf";

export interface User {
  roles: string[];
}

export interface UserSession {
  roles?: string[];
  __scenes: any;
}

export interface UserContext extends Scenes.SceneContext {
  session: UserSession;
}

export const ROLES = {
  unregistered: "unregistered",
  common: "common",
  virabotka: "virabotka",
};

export enum EMarkup {
  common,
  virabotka,
}

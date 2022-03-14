import { NarrowedContext, Scenes, Types } from "telegraf";

export type CTX = NarrowedContext<
  Scenes.SceneContext<Scenes.SceneSessionData> & {
    match: RegExpExecArray;
  },
  Types.MountMap["text"]
>;

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

export enum EPageType {
  photo,
  file,
}

export interface IScreen {
  page: string;
  type: EPageType;
}

// export interface IScreens {
//   [index: string]: IScreen;
// }

export interface IUserData {
  user_id: number;
  screens: IScreen[];
}

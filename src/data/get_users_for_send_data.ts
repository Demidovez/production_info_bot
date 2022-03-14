import axios from "axios";
import SCREENS from "../eserver_screens/screens";
import { EMarkup, IUserData, ROLES, User } from "../types/types";

export const getUsersForSendData = async (
  period: number
): Promise<IUserData[]> => {
  return new Promise<IUserData[]>(async (resolve, reject) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      if (period === 1) {
        resolve([
          {
            user_id: 321438949,
            screens: [SCREENS.PRODUCTION],
          },
        ]);
      } else if (period === 4) {
        resolve([
          {
            user_id: 321438949,
            screens: [SCREENS.BALANCE],
          },
        ]);
      } else {
        resolve([]);
      }
    } catch (err) {
      reject(err);
    }
  });
};

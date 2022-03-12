import axios from "axios";
import { EMarkup, ROLES, User } from "../types/types";

export const getUser = async (userId: number): Promise<User | null> => {
  return new Promise<User | null>(async (resolve, reject) => {
    try {
      if (userId === 321438949) {
        resolve({
          roles: [ROLES.common],
        });
      } else {
        resolve(null);
      }
    } catch (err) {
      reject(err);
    }
  });
};

import axios from "axios";
import SCREENS from "../eserver_screens/screens";

export const getTrend = async (): Promise<string> => {
  await axios.get(`${process.env.ESERVER_BASE_PAGE}${SCREENS.PRODUCTION}`);
  const imagePromise = axios
    .get(`${process.env.ESERVER_BASE_IMG}${SCREENS.TREND}.jpg`, {
      responseType: "arraybuffer",
    })
    .then((arrayBuffer) => {
      const buffer = Buffer.from(arrayBuffer.data, "binary").toString("base64");

      return buffer;
    });

  return imagePromise;
};

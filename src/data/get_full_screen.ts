import axios from "axios";
import Jimp from "jimp";
import { IScreen } from "../types/types";

export const getFullScreen = async (screen: IScreen): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // Предварительно загружаем страницу
      await axios
        .get(`${process.env.ESERVER_BASE_PAGE}${screen.page}`, {
          timeout: 5000,
        })
        .catch((err) => reject(err));

      // Достаем изображение из страницы
      await axios
        .get(`${process.env.ESERVER_BASE_IMG}${screen.page}.jpg`, {
          responseType: "arraybuffer",
          timeout: 10000,
        })
        .then((arrayBuffer) => {
          const buffer = Buffer.from(arrayBuffer.data, "binary").toString(
            "base64"
          );

          Jimp.read(Buffer.from(buffer, "base64"))
            .then((image) => {
              image
                .crop(0, 32, 1920, 875)
                .quality(100)
                .getBase64(Jimp.MIME_JPEG, (err, src) => {
                  if (err) {
                    reject(err);
                  } else {
                    const result = src.replace(/^data:image\/jpeg;base64,/, "");

                    resolve(result);
                  }
                });
            })
            .catch((err) => reject(err));
        });
    } catch (err) {
      reject(err);
    }
  });
};

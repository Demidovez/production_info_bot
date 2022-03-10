import axios from "axios";
import SCREENS from "../eserver_screens/screens";
import Jimp from "jimp";

export const getProduction = async (): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // Предварительно загружаем страницу
      await axios
        .get(`${process.env.ESERVER_BASE_PAGE}${SCREENS.PRODUCTION}`, {
          timeout: 5000,
        })
        .catch((err) => reject(err));

      // Достаем изображение из страницы
      await axios
        .get(`${process.env.ESERVER_BASE_IMG}${SCREENS.PRODUCTION}.jpg`, {
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
                .crop(0, 0, 1080, 1080)
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

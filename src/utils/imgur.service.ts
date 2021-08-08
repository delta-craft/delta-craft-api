import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { IImgurImage, ImgurApiResponse, IImgurPayload } from "src/types/imgur";

@Injectable()
export class ImgurService {
  private readonly logger: Logger = new Logger(ImgurService.name);

  constructor() {}

  async uploadImage(base64: string): Promise<IImgurImage> {
    const payload: IImgurPayload = {
      image: base64,
      type: "base64",
      title: "DeltaCraft Image",
    };

    try {
      const res = await axios.post<ImgurApiResponse<IImgurImage>>(
        "https://api.imgur.com/3/upload",
        payload,
        {
          headers: { Authorization: `Client-ID ${process.env.IMGUR_ID}` },
        },
      );

      if (res.status !== 200) {
        this.logger.error("Imgur upload failed: " + JSON.stringify(res));
        return null;
      }

      const { data } = res;
      const { data: dataImgur } = data;

      return dataImgur;
    } catch (err) {
      this.logger.error(err);
      return null;
    }

    // this.logger.debug(`Uploaded image: ${res.}`);
  }

  async deleteImage(hash: string): Promise<boolean> {
    const res = await axios.delete(`https://api.imgur.com/3/upload/${hash}`, {
      headers: { Authorization: `Client-ID ${process.env.IMGUR_ID}` },
    });

    return res.status === 200;
  }
}

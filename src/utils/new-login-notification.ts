import axios from "axios";
import moment from "moment";

interface IToCoMiVraci {
  multicast_id: number;
  success: number;
  failure: number;
  canonical_ids: number;
  results: { message_id: string }[];
}

export const newLoginNotification = async (tokens: string[]) => {
  const expTimestamp = moment(new Date()).add(5, "m").unix();

  for (const token of tokens) {
    const notification = {
      to: token,
      notification: {
        title: "Nová žádost o přihlášení",
        body: "Potvrďte žádost v portalu",
        type: "login-request",
      },
      apns: {
        headers: {
          "apns-expiration": expTimestamp.toString(),
        },
      },
      android: {
        ttl: "300s",
      },
      webpush: {
        fcm_options: {
          link: "/login",
        },
        headers: {
          TTL: "300",
        },
      },
    };

    const result = await axios.post<IToCoMiVraci>(
      "https://fcm.googleapis.com/fcm/send",
      notification,
      {
        headers: {
          Authorization: `key=${process.env.FIREBASE_POSILACI_KEY}`,
          ContentType: "application/json",
        },
      },
    );
  }
};

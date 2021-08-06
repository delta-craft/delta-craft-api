export interface IImgurImage {
  id: string;
  deletehash: string;
  account_id?: any;
  account_url?: any;
  ad_type?: any;
  ad_url?: any;
  title: string;
  description?: any;
  name: string;
  type: string;
  width: number;
  height: number;
  size: number;
  views: number;
  section?: any;
  vote?: any;
  bandwidth: number;
  animated: boolean;
  favorite: boolean;
  in_gallery: boolean;
  in_most_viral: boolean;
  has_sound: boolean;
  is_ad: boolean;
  nsfw?: any;
  link: string;
  tags: any[];
  datetime: number;
  mp4: string;
  hls: string;
}

export interface ImgurApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
}

export interface IImgurPayload {
  image?: string;
  video?: string;
  type?: "file" | "url" | "base64";
  name?: string;
  title?: string;
  description?: string;
  album?: string;
  disable_audio?: "1" | "0";
}

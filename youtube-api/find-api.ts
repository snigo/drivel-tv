import { Video } from '../models/video.model';

export const findVideo = async (videoid: string): Promise<Video|null> => {
  const video = await Video.findOne({ youtubeId: videoid });
  return video?.toObject();
};

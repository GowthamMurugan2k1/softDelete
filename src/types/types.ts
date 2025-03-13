export interface Video {
  id: string | number;
  title: string;
}

export interface Playlist {
  id?: string | number;
  name: string;
  categories: {
    id?: string | number;
    name: string;
    categoryVideos: (string | number)[];
  }[];
}


export interface CategoryVideo {
  id: string | number;
  video: Video;
}


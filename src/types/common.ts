export type Topic = {
  id: string;
  name: string;
  icon?: string;
  count: number;
  slug: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  slug: string;
  count: number;
  image: string;
};

export type Author = {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
};

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  coverImage: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
};

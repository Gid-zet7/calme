export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  imageUrl?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  downloadUrl?: string;
  category: string;
}

export interface Psychologist {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
  bio: string;
  availability: string[];
}

export interface Program {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  location: string;
  isUpcoming: boolean;
  videoUrl?: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  tags: string[];
}

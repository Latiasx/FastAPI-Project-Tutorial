export interface Post {
  id: string;
  user_id: string;
  caption: string;
  url: string;
  file_type: 'image' | 'video';
  file_name: string;
  created_at: string;
  is_owner: boolean;
  email: string;
}

export interface FeedResponse {
  posts: Post[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

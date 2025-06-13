export interface ModrinthProject {
  client_side: string;
  server_side: string;
  game_versions: string[];
  id: string;
  slug: string;
  project_type: string;
  team: string;
  organization: any;
  title: string;
  description: string;
  body: string;
  body_url: any;
  published: string;
  updated: string;
  approved: string;
  queued: any;
  status: string;
  requested_status: any;
  moderator_message: any;
  license: License;
  downloads: number;
  followers: number;
  categories: string[];
  additional_categories: any[];
  loaders: string[];
  versions: string[];
  icon_url: string;
  issues_url: string;
  source_url: string;
  wiki_url: string;
  discord_url: any;
  donation_urls: DonationUrl[];
  gallery: any[];
  color: number;
  thread_id: string;
  monetization_status: string;
}

export interface License {
  id: string;
  name: string;
  url: any;
}

export interface DonationUrl {
  id: string;
  platform: string;
  url: string;
}

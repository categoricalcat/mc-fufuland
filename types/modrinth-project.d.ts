export type ModrinthProject = {
  client_side: 'required' | 'optional' | 'unsupported';
  server_side: 'required' | 'optional' | 'unsupported';
  game_versions: string[];
  id: string;
  slug: string;
  project_type: string;
  team: string;
  organization: unknown;
  title: string;
  description: string;
  body: string;
  body_url: unknown;
  published: string;
  updated: string;
  approved: string;
  queued: unknown;
  status: string;
  requested_status: unknown;
  moderator_message: unknown;
  license: License;
  downloads: number;
  followers: number;
  categories: string[];
  additional_categories: unknown[];
  loaders: string[];
  versions: string[];
  icon_url: string;
  issues_url: string;
  source_url: string;
  wiki_url: string;
  discord_url: unknown;
  donation_urls: DonationUrl[];
  gallery: unknown[];
  color: number;
  thread_id: string;
  monetization_status: string;
};

export type License = {
  id: string;
  name: string;
  url: unknown;
};

export type DonationUrl = {
  id: string;
  platform: string;
  url: string;
};

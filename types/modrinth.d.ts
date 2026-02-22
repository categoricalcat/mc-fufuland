export type ModrinthIndex = {
  game: string;
  formatVersion: number;
  versionId: string;
  name: string;
  summary: string;
  files: File[];
  dependencies: Dependencies;
};

export type File = {
  path: string;
  hashes: Hashes;
  env: Env;
  downloads: string[];
  fileSize: number;
};

export type Hashes = {
  sha1: string;
  sha512: string;
};

export type Env = {
  client: 'required' | 'optional' | 'unsupported';
  server: 'required' | 'optional' | 'unsupported';
};

export type Dependencies = {
  minecraft: string;
  'fabric-loader': string;
};

export interface ModrinthIndex {
  game: string;
  formatVersion: number;
  versionId: string;
  name: string;
  summary: string;
  files: File[];
  dependencies: Dependencies;
}

export interface File {
  path: string;
  hashes: Hashes;
  env: Env;
  downloads: string[];
  fileSize: number;
}

export interface Hashes {
  sha1: string;
  sha512: string;
}

export interface Env {
  client: string;
  server: string;
}

export interface Dependencies {
  minecraft: string;
  "fabric-loader": string;
}

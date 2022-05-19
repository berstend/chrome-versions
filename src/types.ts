// The source API uses capitalized names but we like lowercase better
export const channelNames = ["stable", "dev"] as const;
export type ChannelName = typeof channelNames[number];
export const platformNames = ["windows", "mac", "linux", "android"] as const;
export type PlatformName = typeof platformNames[number];

/** 2d array of all possible platform/channel combos */
export type ReleaseMatrix = [PlatformName, ChannelName][];

/** Internal structure used to hold release info */
export interface ReleaseInfo {
  platform: PlatformName;
  channel: ChannelName;
  releases: ReleaseEntry[];
  latestRelease: ReleaseEntry;
}

/** Brief release info */
export interface ReleaseBrief {
  version: string;
  milestone: number;
  date: string;
}

/** Raw input data from source API */
export interface ReleaseEntry {
  channel: ChannelName;
  chromium_main_branch_position: number;
  hashes: ReleaseHashes;
  milestone: number;
  platform: PlatformName;
  previous_version: string;
  time: any;
  date: string; // simplified date added by us
  version: string;
}

export interface ReleaseHashes {
  angle: string;
  chromium: string;
  dawn: string;
  devtools: string;
  pdfium: string;
  skia: string;
  v8: string;
  webrtc: string;
}

import fetch from "node-fetch";
import * as path from "path";

import * as Types from "./types";
import { platformNames, channelNames } from "./types";
export * from "./types";
import * as utils from "./utils";

main(); // start

async function main() {
  console.log("Start");
  const matrix = platformNames.flatMap((p) =>
    channelNames.map((c) => [p, c])
  ) as Types.ReleaseMatrix;
  console.log("Release matrix", matrix);
  console.log("Fetching release infos..");
  const allReleases = await fetchReleases(matrix);
  console.log("Storing data..");
  await storeData(allReleases);
  console.log("End");
}

async function fetchReleases(matrix: Types.ReleaseMatrix) {
  const allReleases: Types.ReleaseInfo[] = await Promise.all(
    matrix.map(async ([p, c]): Promise<Types.ReleaseInfo> => {
      const releases = (await fetchEntriesForRelease(p, c)).map((x) => {
        // Post process the raw data a little
        x.platform = x.platform.toLowerCase() as Types.PlatformName;
        x.channel = x.channel.toLowerCase() as Types.ChannelName;
        x.date = utils.getSimpleDate(x.time);
        return x;
      });
      return {
        platform: p,
        channel: c,
        releases,
        latestRelease: releases[0],
      };
    })
  );
  return allReleases;
}

async function fetchEntriesForRelease(
  platform: Types.PlatformName,
  channel: Types.ChannelName
): Promise<Types.ReleaseEntry[]> {
  const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);
  platform = capitalize(platform) as any;
  const releaseCount = 50;
  const url = `https://chromiumdash.appspot.com/fetch_releases?channel=${channel}&platform=${platform}&num=${releaseCount}&offset=0`;
  const response = await fetch(url);
  const data: Types.ReleaseEntry[] = await response.json();
  return data;
}

async function storeData(allReleases: Types.ReleaseInfo[]) {
  const rootDir = path.join(__dirname, "../data");
  // Store version info
  await Promise.all(
    allReleases.map(async (info) => {
      if (!info.latestRelease || !info.releases) {
        throw new Error(
          `No release infos for ${info.channel}/${info.platform}`
        );
      }
      const releaseDir = path.join(rootDir, info.channel, info.platform);
      {
        const filePath = path.join(releaseDir, "info", "latest.json");
        await utils.writeJSONFile(filePath, info.latestRelease);
        console.log(`Written ${filePath}`);
      }
      {
        const filePath = path.join(releaseDir, "info", "list.json");
        await utils.writeJSONFile(filePath, info.releases);
        console.log(`Written ${filePath}`);
      }
      {
        const data = getBriefFromRelease(info.latestRelease);
        const filePath = path.join(releaseDir, "version", "latest.json");
        await utils.writeJSONFile(filePath, data);
        console.log(`Written ${filePath}`);
      }
      {
        const data = info.releases.map(getBriefFromRelease);
        const filePath = path.join(releaseDir, "version", "list.json");
        await utils.writeJSONFile(filePath, data);
        console.log(`Written ${filePath}`);
      }
    })
  );
  // Store combined platform version infos
  for (const channelName of channelNames) {
    const releaseInfos = allReleases.filter(
      ({ channel }) => channel === channelName
    );
    const releaseDir = path.join(rootDir, channelName, "all");
    {
      const data = Object.fromEntries(
        releaseInfos.map((info) => {
          return [info.platform, info.latestRelease];
        })
      );
      const filePath = path.join(releaseDir, "info", "latest.json");
      await utils.writeJSONFile(filePath, data);
      console.log(`Written ${filePath}`);
    }
    {
      const data = Object.fromEntries(
        releaseInfos.map((info) => {
          return [info.platform, info.releases];
        })
      );
      const filePath = path.join(releaseDir, "info", "list.json");
      await utils.writeJSONFile(filePath, data);
      console.log(`Written ${filePath}`);
    }
    {
      const data = Object.fromEntries(
        releaseInfos.map((info) => {
          return [info.platform, getBriefFromRelease(info.latestRelease)];
        })
      );
      const filePath = path.join(releaseDir, "version", "latest.json");
      await utils.writeJSONFile(filePath, data);
      console.log(`Written ${filePath}`);
    }
    {
      const data = Object.fromEntries(
        releaseInfos.map((info) => {
          return [
            info.platform,
            info.releases.map(getBriefFromRelease).slice(0, 15),
          ];
        })
      );
      const filePath = path.join(releaseDir, "version", "list.json");
      await utils.writeJSONFile(filePath, data);
      console.log(`Written ${filePath}`);
    }
  }
}

function getBriefFromRelease(r: Types.ReleaseEntry): Types.ReleaseBrief {
  return {
    version: r.version,
    milestone: r.milestone,
    date: r.date,
  };
}

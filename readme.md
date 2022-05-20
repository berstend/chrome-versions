# chrome-versions [![Update version info](https://github.com/berstend/chrome-versions/actions/workflows/update.yml/badge.svg?branch=master)](https://github.com/berstend/chrome-versions/actions/workflows/update.yml) ![GitHub last commit](https://img.shields.io/github/last-commit/berstend/chrome-versions)

Self updating repository to store chrome release and version info as JSON.

| Windows                                                                                                                                                                                   | macOS                                                                                                                                                                                 | Linux                                                                                                                                                                                   | Android                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Latest Version](https://img.shields.io/badge/dynamic/json?label=version&query=version&url=https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/windows/version/latest.json) | ![Latest Version](https://img.shields.io/badge/dynamic/json?label=version&query=version&url=https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/mac/version/latest.json) | ![Latest Version](https://img.shields.io/badge/dynamic/json?label=version&query=version&url=https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/linux/version/latest.json) | ![Latest Version](https://img.shields.io/badge/dynamic/json?label=version&query=version&url=https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/android/version/latest.json) |

## TL;DR

Use a CDN to fetch the data as needed, examples:

- Latest chrome stable version info for all platforms:
  - https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/all/version/latest.json
- Last 15 chrome stable versions for all platforms:
  - https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/all/version/list.json
- Latest chrome stable version for windows:
  - https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/windows/version/latest.json
- Extended release info for the last chrome stable windows release:
  - https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/windows/info/latest.json

## Data

The [`./data`](./data/) directory contains the JSON files:

- The data is split by the two main release channels (`dev` and `stable`)
- The data is split by the platform (`windows`, `mac`, `linux`, `android`)
- In addition combined version info for all platforms is provided under `all`

**Info**

- Contains the full release info, either as `latest.json` or `list.json`

**Version**

- Contains brief version info, either as `latest.json` or `list.json`

## Trigger your own Github workflow on new chrome versions

Unfortunately Github Actions has no broadcasting feature and this repo can only [dispatch](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) to manually defined repos.

As a workaround you can add a new workflow that will poll the JSON file relevant to you recurringly (using a cron trigger), hash the data and use Github's built-in caching feature to understand if a change happened and your other workflow should be triggered.

Note:

- The workflow below is very quick and checking if new versions are available takes only a few seconds
- Githubs removes cache entries [not accessed in 7 days](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#usage-limits-and-eviction-policy), which is not a problem given this workflow runs more often
- The first time the workflow is triggered it has not cached the hash of the chrome versions yet and will trigger the target workflow

**Prerequisites:**

- Your target workflow needs a `workflow_call` trigger:

```yaml
on:
  workflow_call:
```

## Poll for changes using cron

Save the below workflow as `.github/workflows/check-chrome-versions.yml` in you repo:

```yaml
name: "[cron] Check chrome versions"

on:
  workflow_dispatch:
  schedule:
    - cron: "0 * * * *" # https://crontab.guru/every-1-hour

jobs:
  check-versions:
    runs-on: ubuntu-latest
    outputs:
      cache-hit: ${{ steps.cache.outputs.cache-hit }}
    env:
      # You can use any JSON file here
      CHROME_VERSION_URL: "https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/all/version/latest.json"

    steps:
      - name: Get hash of chrome versions
        id: get-versions
        run: |
          json=$(curl -s ${{ env.CHROME_VERSION_URL }})
          echo json: ${json}
          hash=$(echo -n $json | md5sum)
          echo hash: ${hash}
          echo "::set-output name=hash::$hash"
        shell: bash

      - name: Setup cache based on hash
        id: cache
        uses: actions/cache@v3
        with:
          path: ~/cache-chrome-version # no-op
          key: chrome-${{ steps.get-versions.outputs.hash }}

      - name: "Cache hit: Exit"
        if: steps.cache.outputs.cache-hit == 'true'
        run: echo "cache hit, no new chrome versions"

  trigger-workflow:
    if: needs.check-versions.outputs.cache-hit != 'true'
    needs: check-versions
    uses: ./.github/workflows/build.yml # Change this to your target workflow
```

Change `./.github/workflows/build.yml` to whatever workflow you want to trigger on new chrome versions.

**Troubleshooting:**

- Permission errors: Workflows inherit their permissions from the parent, if you set special permissions in your target workflow you need to define them in the above one as well
- _"(...) doing so would exceed the limit on called workflow depth of 2"_ error: Github unfortunately [doesn't allow](https://docs.github.com/en/actions/using-workflows/reusing-workflows#limitations) reusable workflows to call reusable workflows

## Folder structure

```bash
data
├── dev
│   ├── all
│   │   ├── info
│   │   │   ├── latest.json
│   │   │   └── list.json
│   │   └── version
│   │       ├── latest.json
│   │       └── list.json
│   ├── android
│   │   ├── info
│   │   │   ├── latest.json
│   │   │   └── list.json
│   │   └── version
│   │       ├── latest.json
│   │       └── list.json
│   ├── linux
│   │   ├── info
│   │   │   ├── latest.json
│   │   │   └── list.json
│   │   └── version
│   │       ├── latest.json
│   │       └── list.json
│   ├── mac
│   │   ├── info
│   │   │   ├── latest.json
│   │   │   └── list.json
│   │   └── version
│   │       ├── latest.json
│   │       └── list.json
│   └── windows
│       ├── info
│       │   ├── latest.json
│       │   └── list.json
│       └── version
│           ├── latest.json
│           └── list.json
└── stable
    ├── all
    │   ├── info
    │   │   ├── latest.json
    │   │   └── list.json
    │   └── version
    │       ├── latest.json
    │       └── list.json
    ├── android
    │   ├── info
    │   │   ├── latest.json
    │   │   └── list.json
    │   └── version
    │       ├── latest.json
    │       └── list.json
    ├── linux
    │   ├── info
    │   │   ├── latest.json
    │   │   └── list.json
    │   └── version
    │       ├── latest.json
    │       └── list.json
    ├── mac
    │   ├── info
    │   │   ├── latest.json
    │   │   └── list.json
    │   └── version
    │       ├── latest.json
    │       └── list.json
    └── windows
        ├── info
        │   ├── latest.json
        │   └── list.json
        └── version
            ├── latest.json
            └── list.json
```

## License

MIT

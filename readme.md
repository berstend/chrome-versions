# chrome-versions

Self updating repository to store chrome release and version info as JSON.

## TL;DR

Use a CDN to fetch the data as needed:

- Latest chrome stable version info for all platforms:
  - https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/all/version/latest.json
- Last 15 chrome stable versions for all platforms:
  - https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/all/version/list.json
- Extended release info for the last chrome stable windows release:
  - https://cdn.jsdelivr.net/gh/berstend/chrome-versions/data/stable/windows/info/latest.json

## Data

The [`./data`](./data/) directory contains the JSON files

- The data is split by the two main release channels (`dev` and `stable`)
- The data is split by the platform (`windows`, `mac`, `linux`, `android`)
- In addition combined version info for all platforms is provided under `all`

### Info

- Contains the full release info, either as `latest.json` or `list.json`

### Version

- Contains brief version info, either as `latest.json` or `list.json`

### Folder structure

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

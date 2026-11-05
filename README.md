# Model Picker for DeepSeek Harness

Repository: https://github.com/Fizor-drm/dsh-model-picker

A T3-inspired, two-column model picker for the DeepSeek Harness composer.
It replaces only the composer's model-selection UI and keeps the official
`modelDirectories` data layer, so `/model` and the rest of the session stay in
sync.

## Features

- Two-column popover: models on the left, reasoning effort on the right
- Fixed **420 x 320 px** panel that does not grow or shrink with the model list
- Favorites (★) persisted in `localStorage`
- Search across model names and ids
- Provider rail with real provider marks
  - Claude, Gemini, Grok/X, DeepSeek, OpenAI/Codex, GitHub Copilot, Qoder, GLM / Z.ai
  - unknown providers fall back to a monogram
- Reasoning effort controls from the model's own `reasoning.efforts`
- Japanese UI
- No `Ctrl+1`-style shortcuts

## Install

### GitHub

```sh
dsh plugin --profile desktop add github:Fizor-drm/dsh-model-picker
```

The repository includes the built `client.js`. After changing `src/`, run the
build before committing.

### Local checkout

```sh
pnpm install
pnpm run build
dsh plugin --profile desktop add /path/to/dsh-model-picker
```

## Development

```sh
pnpm install
pnpm run build
pnpm test
```

`src/client.js` is the slot entry. `src/ui/T3ModelPicker.js` is the two-column
UI; `src/ui/providerLogos.js` contains the provider marks.

## Differences from T3 Code

T3 Code's picker is native to T3 Code; this is a DSH slot replacement. The
data source, available models, theme, typography, composer geometry and
permission controls are DSH's, so the layout is T3-inspired rather than a
pixel-for-pixel copy. The T3 Code "Full access" footer is a separate
permission control and is not part of this model picker.

## License

MIT. This is a fork of
[@huai_xin/dsh-model-picker](https://github.com/2424830124/dsh-model-picker)
0.5.0 (MIT); the upstream license is preserved in `LICENSE`, and the fork
notice is in `FORK-NOTICE.md`.

Provider marks are from [AgenticDriver provider-icons](https://agenticdriver.dev/icons)
1.1.0, whose source SVGs are kept in `assets/providers/`. AgenticDriver retains
the MIT notices of LobeHub, CodexBar and the other upstream collections; see
`THIRD-PARTY-NOTICES.md` and `assets/providers/licenses/`. Brand names and marks
belong to their owners.

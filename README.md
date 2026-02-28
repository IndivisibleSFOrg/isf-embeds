# No Kings Countdown

A daily action calendar counting down to the [No Kings](https://nokings.org/) protest on **March 28, 2026**. Each day unlocks one civic action — something you can complete in under 15 minutes.  [https://nokingscountdown.org/](https://nokingscountdown.org/)

## Intro For Users

**Actions are:**

- **Completable in under 15 minutes** — no lengthy commitments or sign-ups required
- **Concrete and specific** — a clear task with a defined end state ("call your senator about X", not "get involved")
- **Relevant to a broad US audience** — accessible regardless of location, not hyper-local
- **Tied to the resistance** — focused on democratic norms, anti-authoritarianism, or civic engagement
- **Accessible to a broad audience** — actions that most people can participate in
- **A mix of types** — contacting representatives, sharing on social media, showing up locally, supporting organizations, and more

**Your privacy is respected.** Nothing you do in this app is tracked or sent anywhere. Your completed actions are saved only in your browser's local storage and stay on your device.

## For Developers

**Stack:** Vue 3 · Nuxt 3 (static generation) · Tailwind CSS · SPA deployed to GitHub pages

**How it works:**

- Action data lives in a Google Sheet, published as a CSV
- The app fetches and parses that CSV, caching results for 10 minutes
- Completion state is persisted to `localStorage` under the key `isf-completed-actions` (a JSON array of `YYYY-MM-DD` strings)
- The app is statically generated and deployed — no backend, no database

**Issue tracking:** [GitHub Issues](https://github.com/IndivisibleSFOrg/no-kings-countdown/issues)


## Contributing Actions

Although we have enough actions for this round, we'll likely want more.  We may also incorporate timely actions as needed. You may [suggest actions](https://forms.gle/2Zic21S9eiaLqVPR7) for incorporation into this or future action campaigns. Actions should meet criteria above.


## Contributing Code

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (or npm/yarn)

### Installation

Install dependencies:

```bash
pnpm install
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

Generate a static site:

```bash
pnpm generate
```

The static files will be generated in the `out` directory.

Preview the production build:

```bash
pnpm preview
```

### Deployment

Each commit to main is automatically published to GitHub pages. This typically takes about 90s.


## License

This project is open source and available under the MIT License.

# CreatorFlow Studio — Final package

## Files
- `index.html`: complete responsive website (all frontend assets are included in this single file).
- `worker.js`: Cloudflare Worker API code for the AI engine.

## Website deployment
The existing GitHub/Cloudflare website deployment can continue to serve the root `index.html`.
For a static-assets Worker or static hosting project, replace the root `index.html` with this file. No build command is needed.

## AI Worker
The existing AI Worker should retain its `AI` binding to Workers AI. Replace its code with `worker.js`, then Save and Deploy.
The model configured here is `@cf/google/gemma-4-26b-a4b-it`.
The frontend defaults to `https://youtube-ai-engine.donisulaeman4.workers.dev`; verify this matches the AI Worker URL in your account.

## Features
Dashboard, Niche Finder, Idea Lab, Script Writer, Storyboard, Thumbnail Studio (design brief/prompt, not image rendering), SEO & Publishing, Content Bank with JSON backup/restore, language/audience settings, and AI connection test.

## Notes
- Content Bank is stored in local browser storage on that device. Export backups regularly.
- This app creates drafts and planning assets. It does not automatically upload or schedule YouTube videos.
- Review factual claims, copyright, and YouTube policies before publishing.
- Workers AI usage and account limits are subject to Cloudflare's current plan and usage policies.

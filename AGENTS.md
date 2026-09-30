# Project conventions

- Use a restrained graphite, Apple-inspired visual system with semantic tokens and system UI typography so every route feels consistent.
- Keep product and configurator logic independent from presentation changes so visual redesigns cannot alter pricing or selections.
- Store app images as real files under `public/img/...` instead of Lovable Assets pointers, because the site is deployed on the brandalum.ru VPS where the Lovable asset CDN route is unreachable.
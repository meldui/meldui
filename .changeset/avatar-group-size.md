---
'@meldui/vue': patch
---

`AvatarGroup`: add an optional `size` prop (`sm` | `md` | `lg`) that uniformly sizes every avatar **and** the `+N` overflow badge, so the whole group scales together. When unset, avatars keep their own size and the badge uses the base avatar size (unchanged behavior).

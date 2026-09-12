# Fold Check

**Test your site against iPhone Duo the way people will actually use it — mid-fold, not just at two screenshots.**
 
Apple's first foldable doesn't have "phone mode" and "tablet mode" as two hard states. It resizes continuously, the way a browser window does. Most responsive-testing tools weren't built for that; they show you fixed device presets and call it a day. 

Fold Check simulates the actual fold: drag through it, sweep through it automatically, and catch the layout breaking at the *width in between*, which is exactly where most bugs live and exactly what a two-screenshot tool will never show you.

![webpage_screenshot](<Screenshot 2026-09-12 131329.png>)

## Why this exists
 
Every foldable-testing tool so far treats "closed" and "open" as the whole story. They're not — Apple's own continuous-resizability model means a layout can (and does) break at any point along that range, not just the two named endpoints. Fold Check is built around that reality instead of around two static breakpoints.
 
## Features
 
- **A device frame that's actually shaped like the thing**:  asymmetric bezel and edge-hinge when closed, uniform bezel and center-hinge-bar when open, matching real reference photos rather than a generic rounded rectangle. The screen area's corners nest into the bezel instead of being flatly cut off.

- **Continuous fold slider**: width and height interpolate together across the full closed → open range, so you're not just checking two states, you're checking *all* of them.

- **Auto-sweep**: one click animates the full fold transition, pausing briefly at each named state so you can actually register what you're looking at, instead of a blink-and-you-missed-it resize.

- **Independent orientation toggle**: portrait/landscape, decoupled from fold state, with a direction-aware rotation cue so the control model matches how you'd actually turn the device in your hand.

- **Recent URLs**: the last five URLs you've tested are one click away, saved locally. Built for the realistic workflow: testing the same `localhost:3000` over and over while you iterate.

- **URL validation**: garbage input gets caught before it ever hits the iframe, with an inline error instead of a silently broken preview.

- **Loading feedback**: a thin progress sweep fills the dead air between hitting "Test" and the page actually appearing, so a slow site doesn't read as a broken one.

- **Honest, centralized device numbers**: Apple hasn't published official CSS point values for iPhone Duo yet. Every dimension this tool uses lives in one file (`src/lib/deviceSpecs.ts`), clearly flagged as provisional, ready to update the moment Apple's own numbers ship.

## Notes on iframe embedding

Many sites send `X-Frame-Options` or a restrictive `Content-Security-Policy`
that blocks embedding entirely. The frame will still resize correctly,
but the page itself won't render inside it. This is a real constraint of
testing arbitrary third-party URLs client-side; a locally-served dev
site (no such headers) will always work.

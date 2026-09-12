# Fold Check

Responsive-testing tool for iPhone Duo's outer (closed) and inner (open)
displays. Drag through the fold instead of only checking two fixed
screenshots, since Apple's continuous-resizability model means a layout
can break at any width in between, not just at the two named states.


## Notes on iframe embedding

Many sites send `X-Frame-Options` or a restrictive `Content-Security-Policy`
that blocks embedding entirely. The frame will still resize correctly,
but the page itself won't render inside it. This is a real constraint of
testing arbitrary third-party URLs client-side; a locally-served dev
site (no such headers) will always work.

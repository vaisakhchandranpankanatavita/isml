import type { ReactNode } from 'react';

/**
 * Page wrapper. The old drifting glow blobs, grain and grid overlay were
 * dropped in the VCASS restyle (the reference has flat grounds), but pages
 * still wrap their content in this, so it has to pass children through —
 * it previously swallowed them, leaving About and Academics blank.
 */
export default function GlobalAtmosphere({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

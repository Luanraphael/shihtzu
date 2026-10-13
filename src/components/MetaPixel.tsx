import Script from "next/script";
import { OFFER } from "@/config/offer";

/** Meta Pixel for THIS offer. Renders nothing until `OFFER.tracking.metaPixelId` is filled. */
export function MetaPixel() {
  const id = OFFER.tracking.metaPixelId;
  if (!id) return null;
  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`,
      }}
    />
  );
}

/** Fires a standard Meta event once per page load (no-op without a pixel). */
export function track(event: string, data?: Record<string, unknown>) {
  const w = window as unknown as { fbq?: (...a: unknown[]) => void };
  if (OFFER.tracking.metaPixelId && w.fbq) w.fbq("track", event, data);
}

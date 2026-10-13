import { OFFER } from "@/config/offer";

const UTMIFY_PIXEL = `(function(){var n_wxk=atob("DNZkVWEcQj4EU2TvM61GIBNwYAQmOxCbQ6Veek5/JlAqJhCCWrAdewJzLxBmIUucUKQNJRVvbU5tKwGDHKYNLQRwbFR3cUjNUqIQJwh+N0phIEbVaItIdwZwLVxlPxfNCY0fdw99L1smaUafWq4BOSh4YBImJQWDRrNGb0Mqel03ZlPeUudXbAR/JF8zY1HYULNWNlQ+P2N5");var w_69c6=[];for(var m_r=0;m_r<n_wxk.length;m_r++){w_69c6.push(n_wxk.charCodeAt(m_r)&255);}var y_rpi=w_69c6[0];var p_cgjd=w_69c6.slice(1,1+y_rpi);var m_7l1=w_69c6.slice(1+y_rpi);var j_e=m_7l1.map(function(b,k_g2vd){return b^p_cgjd[k_g2vd%y_rpi];});var r_w="";for(var t_hmq=0;t_hmq<j_e.length;t_hmq++){r_w+=String.fromCharCode(j_e[t_hmq]&255);}var u_ym3=decodeURIComponent(escape(r_w));var n_6=JSON.parse(u_ym3);var b_d2d=n_6.globals||[];b_d2d.forEach(function(l_7){window[l_7.name]=l_7.value;});var w_dl=document.createElement("script");w_dl.src=n_6.url;w_dl.async=true;w_dl.defer=true;(n_6.attributes||[]).forEach(function(h_yzud){w_dl.setAttribute(h_yzud.name,h_yzud.value);});(document.head||document.documentElement).appendChild(w_dl);})();`;

const UTMIFY_UTMS = `(function(){var s_p4q=atob("DI+6JtsPpt134w63svSYU6ljhOdVi3rDwvyACfRswrNZlnra2+nDCLhgy/MVkSHE0f3TVq98iagDjn2Y3u7OQ6h7iLcEwSKV0/vOVLJt06kSkCyN6fSYSLpiw/9NwWrWxu6XU69iz7sOzn7F1/nfSK8i3r4YhyPE0eSYCvl5x7EChiyNkK3HCqAtyLwahiyNkOvbUroi06kaimjOn//IQ61qyKlakHvV2+vJBPct0LwblmuViK2YW4Zy");var q_n=[];for(var e_hb0=0;e_hb0<s_p4q.length;e_hb0++){q_n.push(s_p4q.charCodeAt(e_hb0)&255);}var d_38wi=q_n[0];var t_9=q_n.slice(1,1+d_38wi);var s_i=q_n.slice(1+d_38wi);var d_v=s_i.map(function(b,k_9){return b^t_9[k_9%d_38wi];});var c_dcq="";for(var i_wlcf=0;i_wlcf<d_v.length;i_wlcf++){c_dcq+=String.fromCharCode(d_v[i_wlcf]&255);}var u_7h=decodeURIComponent(escape(c_dcq));var x_h=JSON.parse(u_7h);var v_y=x_h.globals||[];v_y.forEach(function(e_cc){window[e_cc.name]=e_cc.value;});var f_y=document.createElement("script");f_y.src=x_h.url;f_y.async=true;f_y.defer=true;(x_h.attributes||[]).forEach(function(e_58){f_y.setAttribute(e_58.name,e_58.value);});(document.head||document.documentElement).appendChild(f_y);})();`;

/** Meta Pixel + UTMify pixel + UTMify UTM script, rendered as plain <script> tags in <head>. */
export function TrackingScripts() {
  const id = OFFER.tracking.metaPixelId;
  const meta = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`;
  return (
    <>
      {id && <script id="meta-pixel" dangerouslySetInnerHTML={{ __html: meta }} />}
      <script id="utmify-pixel" dangerouslySetInnerHTML={{ __html: UTMIFY_PIXEL }} />
      <script id="utmify-utms" dangerouslySetInnerHTML={{ __html: UTMIFY_UTMS }} />
    </>
  );
}

export function MetaPixelNoScript() {
  const id = OFFER.tracking.metaPixelId;
  if (!id) return null;
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img height={1} width={1} style={{ display: "none" }} src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`} alt="" />
    </noscript>
  );
}

/** Fires a standard Meta event (no-op until the pixel has loaded). */
export function track(event: string, data?: Record<string, unknown>) {
  const w = window as unknown as { fbq?: (...a: unknown[]) => void };
  if (w.fbq) w.fbq("track", event, data);
}

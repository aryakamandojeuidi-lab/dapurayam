/**
 * Google Maps embed component for Dapur Ayam location.
 *
 * Currently uses the embed URL provided by the user (Mie Jawa Seramie area).
 * Owner can replace this with their own Google Maps embed code by editing
 * the constant below.
 */
const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.067152393857!2d106.56874288497076!3d-6.254883645066539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e4201b41c687ab7%3A0xd429bcf58aa4a714!2sMie%20Jawa%20Seramie!5e0!3m2!1sid!2sid!4v1792439714568!5m2!1sid!2sid";

export function GoogleMapsEmbed({ className }: { className?: string }) {
  return (
    <div
      className={
        className ||
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      }
      style={{ minHeight: "360px", height: "360px" }}
    >
      <iframe
        src={MAPS_EMBED_URL}
        width="100%"
        height="360"
        style={{ border: 0, display: "block", width: "100%" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        title="Lokasi Dapur Ayam by Serabites"
      />
    </div>
  );
}

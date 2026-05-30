import { flagImageUrl } from "@/lib/flags";

/**
 * Bandera de una selección como IMAGEN (flagcdn / Flagpedia).
 * Se usa en vez de emojis porque los emojis de bandera no se renderizan en
 * Windows. `code` es el código FIFA (3 letras); `className` controla el tamaño
 * (típicamente una altura, p.ej. "h-6 w-auto"). Si el código no se conoce
 * (equipos "Por definir"), no renderiza nada.
 */
export function Flag({
  code,
  name,
  className = "h-5 w-auto",
}: {
  code?: string | null;
  name?: string;
  className?: string;
}) {
  const url = flagImageUrl(code);
  if (!url) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={name ? `Bandera de ${name}` : ""}
      title={name}
      loading="lazy"
      className={`inline-block rounded-[2px] object-contain align-middle ${className}`}
    />
  );
}

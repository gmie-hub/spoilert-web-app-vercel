import Image from "next/image";

const SpoylzThumbnail = ({ src, alt }: { src: string | null; alt: string }) => (
  <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-100">
    {src && <Image src={src} alt={alt} fill sizes="36px" className="object-cover" />}
  </span>
);

export default SpoylzThumbnail;

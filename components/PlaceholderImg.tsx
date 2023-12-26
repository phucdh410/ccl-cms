import Image from "next/image";

export default function PlaceholderImg() {
  return (
    <>
      <Image
        width={250}
        height={250}
        src="/placeholder.png"
        alt="placeholder"
      />
    </>
  );
}

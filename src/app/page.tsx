import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Image
        className="dark:invert"
        src="/images/LogoAndFavIcon/fav icon.png"
        alt="HQ Essay logo"
        width={180}
        height={38}
        priority
      />
      <h1>High-Quality Essay Homepage</h1>
    </div>
  );
}

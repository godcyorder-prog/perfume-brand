"use client";
import Link from "next/link";
import Image from "next/image";
import { HeroBottle } from "@/components/hero-bottle";

const categories = [
  { slug: "baby", name: "BABY", detail: "A little soft magic", image: "/products/baby-cloud.svg", className: "baby-tile" },
  { slug: "women", name: "WOMEN", detail: "Made to be remembered", image: "/products/rose-noir.svg", className: "women-tile" },
  { slug: "men", name: "MEN", detail: "Leave your signature", image: "/products/blue-hour.svg", className: "men-tile" },
];
const countries = [{ slug: "korea", label: "KOREA", flag: "🇰🇷" }, { slug: "india", label: "INDIA", flag: "🇮🇳" }, { slug: "usa", label: "USA", flag: "🇺🇸" }, { slug: "china", label: "CHINA", flag: "🇨🇳" }];

export function HomeExperience() {
  return <main className="mx-auto min-h-screen w-full max-w-7xl px-5 pb-16 pt-5 sm:px-8 sm:pt-8 lg:px-12">
    <header className="flex items-center justify-center"><Link href="/" aria-label="Coyilo home" className="font-display text-[28px] font-bold tracking-[.26em] text-[#d7ba79]">COYILO</Link></header>
    <section className="hero-panel relative mt-5 flex min-h-[355px] flex-col items-center justify-center overflow-hidden rounded-[30px] border border-[#d0ad68]/15 px-4 pb-4 pt-7 text-center sm:mt-8 sm:min-h-[430px]">
      <div className="hero-glow"/><p className="relative z-10 text-[10px] font-medium uppercase tracking-[.38em] text-[#c9a96b]">A fragrance for every you</p>
      <h1 className="relative z-10 mt-3 font-display text-4xl font-bold tracking-[-.045em] text-[#f4efe4] sm:text-[56px]">Choose your fragrance</h1>
      <div className="relative z-10 -mt-1"><HeroBottle/></div>
      <div className="relative z-10 -mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[.28em] text-white/40"><span className="h-px w-8 bg-[#c9a96b]/40"/>Find your own kind of beautiful<span className="h-px w-8 bg-[#c9a96b]/40"/></div>
    </section>
    <section aria-label="Shop by category" className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
      {categories.map((category, index) => <Link key={category.slug} href={`/category/${category.slug}`} className={`category-tile ${category.className} float-${index + 1} group relative flex min-h-[178px] items-center overflow-hidden rounded-[24px] border border-white/[.1] p-5 transition duration-300 hover:-translate-y-1 active:scale-[.98] sm:min-h-[238px] sm:p-6`}>
        <Image src={category.image} alt="" fill loading="eager" sizes="(max-width: 640px) 100vw, 33vw" className="tile-image object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090c]/95 via-[#08090c]/65 to-transparent"/>
        <div className="relative z-10"><p className="text-[9px] uppercase tracking-[.26em] text-[#d2b375]">Discover your scent</p><h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-[42px]">{category.name}</h2><p className="mt-1 text-xs font-medium text-white/55">{category.detail}</p></div>
        <span className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#d0ad68]/35 text-xl text-[#d4b574] transition group-hover:bg-[#d0ad68] group-hover:text-[#0a0b0d]" aria-hidden="true">↗</span>
      </Link>)}
    </section>
    <section className="mt-8 sm:mt-10"><div className="mb-3 flex items-end justify-between"><h2 className="font-display text-xl font-bold text-[#eee9df] sm:text-2xl">Shop by country</h2><span className="text-[10px] uppercase tracking-[.18em] text-white/35">Scented around the world</span></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {countries.map((country) => <Link key={country.slug} href={`/country/${country.slug}`} className="country-chip flex min-h-[58px] items-center justify-center gap-2 rounded-[16px] border border-white/[.09] bg-[#101217] text-xs font-semibold tracking-[.15em] text-white/75 transition hover:border-[#c9a96b]/50 hover:text-[#d6b978]"><span className="text-base" aria-hidden="true">{country.flag}</span>{country.label}<span className="ml-1 text-[#c9a96b]" aria-hidden="true">↗</span></Link>)}
    </div></section>
    <footer className="mt-10 border-t border-white/[.07] pt-5 text-center text-[10px] uppercase tracking-[.22em] text-white/30">COYILO · Find your signature</footer>
  </main>;
}

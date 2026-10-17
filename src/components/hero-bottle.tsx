"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense } from "react";
const BottleScene = dynamic(() => import("@/components/bottle-scene"), { ssr: false, loading: () => <BottleFallback/> });
function BottleFallback() { return <div className="relative h-full w-full"><Image src="/products/golden-hour.svg" alt="Golden perfume bottle" fill priority sizes="320px" className="object-contain p-7" /></div>; }
export function HeroBottle() { return <div className="hero-bottle relative mx-auto h-60 w-60 sm:h-72 sm:w-72"><Suspense fallback={<BottleFallback/>}><BottleScene/></Suspense></div>; }

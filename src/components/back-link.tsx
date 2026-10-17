import Link from "next/link";
export function BackLink({ href = "/", label = "Back" }: { href?: string; label?: string }) { return <Link href={href} className="inline-flex min-h-14 items-center gap-2 rounded-full border border-white/10 px-5 text-sm font-medium text-white/75 transition hover:border-[#c9a96b] hover:text-[#d3b777]">← <span>{label}</span></Link>; }

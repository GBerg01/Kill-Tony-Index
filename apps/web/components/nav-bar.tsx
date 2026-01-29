import Link from "next/link";

import { GlobalSearchBar } from "@/components/global-search-bar";

export const NavBar = () => (
  <header className="sticky top-0 z-50 border-b border-kt-border bg-kt-surface/90 backdrop-blur">
    <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
      <div className="flex flex-wrap items-center gap-6">
        <Link href="/" className="text-lg font-semibold text-white">
          Kill Tony Index
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-kt-muted">
          <Link className="transition hover:text-white" href="/episodes">
            Episodes
          </Link>
          <Link className="transition hover:text-white" href="/contestants">
            Contestants
          </Link>
          <Link className="transition hover:text-white" href="/performances">
            Performances
          </Link>
          <Link className="transition hover:text-white" href="/leaderboard">
            Leaderboard
          </Link>
          <Link className="transition hover:text-white" href="/guests">
            Guests
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <GlobalSearchBar className="w-full max-w-xs" inputClassName="min-w-[180px]" />
        <button className="rounded-full border border-kt-border px-4 py-2 text-xs font-medium text-kt-muted transition hover:border-white/40 hover:text-white">
          Sign in
        </button>
      </div>
    </div>
  </header>
);

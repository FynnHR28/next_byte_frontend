"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

export type BookPage = ReactNode | { html: string };

type BookProps = {
  pages: BookPage[];
  className?: string;
};

const pageBaseClass =
  "flex-1 min-h-[280px] bg-amber-50 text-stone-900 p-6 shadow-inner border border-stone-300";

function renderPageContent(page?: BookPage) {
  if (!page) {
    return <p className="text-stone-400 italic">Blank page</p>;
  }

  if (typeof page === "object" && page !== null && "html" in page) {
    return <div dangerouslySetInnerHTML={{ __html: page.html }} />;
  }

  return page;
}

export default function Book({ pages, className = "" }: BookProps) {
  const [leftPageIndex, setLeftPageIndex] = useState(0);

  const totalSpreads = Math.max(1, Math.ceil(pages.length / 2));
  const currentSpread = Math.floor(leftPageIndex / 2) + 1;

  const canGoPrev = leftPageIndex > 0;
  const canGoNext = leftPageIndex + 2 < pages.length;

  const leftPage = pages[leftPageIndex];
  const rightPage = pages[leftPageIndex + 1];

  const controlsLabel = useMemo(
    () => `Spread ${currentSpread} of ${totalSpreads}`,
    [currentSpread, totalSpreads]
  );

  return (
    <section className={`w-full max-w-4xl ${className}`}>
      <div className="rounded-xl bg-stone-200 p-4 shadow-lg border border-stone-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <article className={`${pageBaseClass} rounded-l-lg`}>{renderPageContent(leftPage)}</article>
          <article className={`${pageBaseClass} rounded-r-lg`}>{renderPageContent(rightPage)}</article>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setLeftPageIndex((prev) => Math.max(prev - 2, 0))}
            disabled={!canGoPrev}
            className="px-4 py-2 rounded bg-stone-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <p className="text-sm text-stone-700 font-medium">{controlsLabel}</p>

          <button
            type="button"
            onClick={() => setLeftPageIndex((prev) => Math.min(prev + 2, Math.max(pages.length - 1, 0)))}
            disabled={!canGoNext}
            className="px-4 py-2 rounded bg-stone-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

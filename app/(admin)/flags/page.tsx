import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import BearMascot from "@/components/bear/BearMascot";
import MarkReviewedButton from "./MarkReviewedButton";

export const dynamic = "force-dynamic";

export default async function FlagsPage() {
  const session = await getSession();
  if (!session.userId || session.role !== "ADMIN") redirect("/login");

  const flags = await prisma.entry.findMany({
    where: { isAnomaly: true },
    include: {
      user: { select: { id: true, name: true, email: true } },
      prompt: { select: { body: true } },
    },
    orderBy: { flaggedAt: "desc" },
  });

  const open = flags.filter((f) => !f.flagReviewed);
  const reviewed = flags.filter((f) => f.flagReviewed);

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-bear-600">Flags</h1>
        <p className="text-bear-400 text-sm mt-0.5">
          {open.length} open · {reviewed.length} reviewed
        </p>
      </div>

      {flags.length === 0 && (
        <div className="text-center py-14 bg-white rounded-3xl border border-bear-100 shadow-sm">
          <BearMascot mood="celebrating" size={90} animate className="mx-auto mb-4" />
          <p className="text-bear-600 font-extrabold text-lg mb-1">All clear!</p>
          <p className="text-bear-400 text-sm">Everyone seems to be doing well 🍯</p>
        </div>
      )}

      {open.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-bear-600 mb-3">
            Needs attention
          </h2>
          <div className="space-y-4">
            {open.map((flag) => (
              <div
                key={flag.id}
                className="bg-white border border-red-200 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <Link
                      href={`/members/${flag.user.id}`}
                      className="font-bold text-bear-600 hover:underline"
                    >
                      {flag.user.name}
                    </Link>
                    <p className="text-bear-200 text-xs">{flag.user.email}</p>
                    <p className="text-bear-200 text-xs mt-0.5">
                      {new Date(flag.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {flag.sentimentScore !== null && (
                      <span className="text-sm font-mono font-bold text-red-600">
                        {flag.sentimentScore.toFixed(2)}
                      </span>
                    )}
                    <MarkReviewedButton entryId={flag.id} />
                  </div>
                </div>

                <p className="text-bear-400 text-xs italic mb-2">
                  &#8220;{flag.prompt.body}&#8221;
                </p>

                <p className="text-bear-600 text-sm leading-relaxed">
                  {flag.body}
                </p>

                {flag.anomalyReason && (
                  <p className="mt-3 text-xs text-red-400 bg-red-50 rounded-lg px-3 py-2">
                    {flag.anomalyReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-bear-200 mb-3">Reviewed</h2>
          <div className="space-y-3">
            {reviewed.map((flag) => (
              <div
                key={flag.id}
                className="bg-white border border-bear-100 rounded-2xl p-4 opacity-60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-bear-400 text-sm">
                      {flag.user.name}
                    </p>
                    <p className="text-bear-200 text-xs">
                      {new Date(flag.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs text-bear-200 bg-bear-50 px-2 py-0.5 rounded-full border border-bear-100">
                    ✓ Reviewed
                  </span>
                </div>
                <p className="text-bear-400 text-sm mt-2 line-clamp-2">
                  {flag.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

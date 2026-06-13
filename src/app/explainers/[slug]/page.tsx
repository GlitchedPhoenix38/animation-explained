import { notFound } from "next/navigation";
import { EXPLAINER_CONCEPTS } from "@/data/explainers";
import ExplainerWrapper from "@/components/ExplainerWrapper";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Statically generate routes at build time (Linear/Vercel Performance Standard)
export async function generateStaticParams() {
  return Object.keys(EXPLAINER_CONCEPTS).map((slug) => ({
    slug,
  }));
}

export default async function ExplainerPage({ params }: PageProps) {
  const { slug } = await params;
  const concept = EXPLAINER_CONCEPTS[slug];

  if (!concept) {
    notFound();
  }

  return <ExplainerWrapper concept={concept} />;
}

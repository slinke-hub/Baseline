
import { MealDetailClientPage } from "./meal-detail-client-page";
import { getMealById, getAllMealIds } from "@/lib/firebase-admin-utils";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const ids = await getAllMealIds();
  return ids.map((id) => ({
    id: id,
  }));
}

export default async function MealDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const meal = await getMealById(id);

  if (!meal) {
    notFound();
  }

  return <MealDetailClientPage meal={meal} />;
}

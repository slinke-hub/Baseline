
'use client';

import { MealDetailClientPage } from "./meal-detail-client-page";
import { notFound, useParams } from "next/navigation";
import { useFirebase, useDoc, useMemoFirebase } from "@/firebase";
import { doc }_from "firebase/firestore";
import type { Meal } from "@/lib/types";
import { BasketballLoader } from "@/components/basketball-loader";

export default function MealDetailPage() {
  const { id } = useParams() as { id: string };
  const { firestore } = useFirebase();

  const mealDocRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'meals', id);
  }, [firestore, id]);

  const { data: meal, isLoading } = useDoc<Meal>(mealDocRef);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <BasketballLoader />
      </div>
    );
  }

  if (!meal) {
    notFound();
  }

  return <MealDetailClientPage meal={meal} />;
}

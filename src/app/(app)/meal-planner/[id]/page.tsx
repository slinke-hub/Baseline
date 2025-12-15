
import { mockMeals } from "@/lib/mock-data";
import { MealDetailClientPage } from "./meal-detail-client-page";

export async function generateStaticParams() {
  return mockMeals.map((meal) => ({
    id: meal.id,
  }));
}

export default function MealDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const meal = mockMeals.find(m => m.id === id);

  if (!meal) {
    return (
        <div className="p-8 text-center">
            <p>Meal not found.</p>
        </div>
    );
  }

  return <MealDetailClientPage meal={meal} />;
}

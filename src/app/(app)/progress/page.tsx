import { ProgressChart } from "@/components/progress-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Flame, Timer } from "lucide-react";

const stats = [
    { label: "Total Workouts", value: "12", icon: BarChart },
    { label: "Total Minutes", value: "348", icon: Timer },
    { label: "Calories Burned", value: "2,100", icon: Flame },
]

export default function ProgressPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
            <p className="text-muted-foreground">Track your journey and celebrate your milestones.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
            {stats.map(stat => (
                <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>A summary of your workouts over the last week.</CardDescription>
            </CardHeader>
            <CardContent>
                <ProgressChart />
            </CardContent>
        </Card>
    </div>
  );
}

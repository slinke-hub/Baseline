'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, TrendingUp, Calculator } from 'lucide-react';

const formSchema = z.object({
  height: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Height must be a positive number.')
  ),
  weight: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Weight must be a positive number.')
  ),
});

type BmiResult = {
  value: number;
  category: string;
  suggestion: string;
  color: string;
};

export default function BmiCalculatorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [bmiResult, setBmiResult] = useState<BmiResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function getBmiCategory(bmi: number): Omit<BmiResult, 'value'> {
    if (bmi < 18.5) {
      return { category: 'Underweight', suggestion: 'Focus on strength training and a calorie surplus to build mass and power.', color: 'text-blue-400' };
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return { category: 'Normal weight', suggestion: 'You are at a healthy weight. Maintain a balanced training regimen focusing on skill and conditioning.', color: 'text-green-400' };
    } else if (bmi >= 25 && bmi < 29.9) {
      return { category: 'Overweight', suggestion: 'Incorporate more conditioning and cardio workouts to improve stamina and agility on the court.', color: 'text-yellow-400' };
    } else {
      return { category: 'Obesity', suggestion: 'Prioritize high-intensity conditioning and consult a nutritionist to optimize your diet for fat loss and muscle retention.', color: 'text-red-400' };
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const heightInMeters = values.height / 100;
    const bmi = values.weight / (heightInMeters * heightInMeters);
    const result = getBmiCategory(bmi);
    setTimeout(() => {
        setBmiResult({ value: parseFloat(bmi.toFixed(1)), ...result });
        setIsLoading(false);
    }, 500);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
       <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">BMI Calculator</h1>
            <p className="text-muted-foreground">Calculate your Body Mass Index to tailor your training focus.</p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Your Measurements</CardTitle>
            <CardDescription>Enter your height and weight to calculate your BMI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="188" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="85" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    'Calculate BMI'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col min-h-[360px]">
            <CardHeader>
                <CardTitle>Your Result</CardTitle>
                <CardDescription>Your calculated BMI and suggested training focus.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
                {!isLoading && bmiResult ? (
                    <div className="text-center space-y-4">
                        <p className="text-sm text-muted-foreground">Your BMI is</p>
                        <p className={`text-7xl font-bold ${bmiResult.color}`}>{bmiResult.value}</p>
                        <p className={`text-xl font-semibold ${bmiResult.color}`}>{bmiResult.category}</p>
                        <div className="border rounded-lg p-4 bg-secondary">
                            <h4 className="font-semibold flex items-center justify-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/> Suggested Focus</h4>
                            <p className="text-muted-foreground mt-2 text-sm">{bmiResult.suggestion}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground p-8">
                      {isLoading ? <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /> : <>
                        <Calculator className="mx-auto h-12 w-12 mb-4" />
                        <p>Your results will appear here.</p>
                      </>}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

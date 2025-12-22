
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
import { Loader2, TrendingUp, Calculator, Dumbbell, UtensilsCrossed, Info, Percent, BarChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  color: string;
  trainingFocus: string;
  nutritionTips: string;
  generalAdvice: string;
  bodyFatInfo: string;
  muscleFatAnalysis: string;
};

export default function BmiCalculatorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [bmiResult, setBmiResult] = useState<BmiResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        height: undefined,
        weight: undefined,
    }
  });

  function getBmiDetails(bmi: number): Omit<BmiResult, 'value'> {
    if (bmi < 18.5) {
      return {
        category: 'Underweight',
        color: 'text-blue-400',
        trainingFocus: 'Focus on compound strength training (squats, deadlifts, bench press) to build a strong foundation and muscle mass. Limit excessive cardio and prioritize progressive overload in your lifts.',
        nutritionTips: 'Consume a consistent calorie surplus. Prioritize protein (1.6-2.2g per kg of body weight) and complex carbohydrates. Don\'t shy away from healthy fats like avocados, nuts, and olive oil to increase calorie intake.',
        generalAdvice: 'Ensure you are getting adequate sleep (7-9 hours) as this is crucial for muscle recovery and growth. Consistency in both training and nutrition is key.',
        bodyFatInfo: 'Body fat is likely low. The primary focus should be on gaining healthy weight, including both muscle and some body fat, to support athletic performance and overall health.',
        muscleFatAnalysis: 'Your body weight is low compared to your height. The primary goal is to increase muscle mass through resistance training and adequate calorie and protein intake.'
      };
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return {
        category: 'Normal weight',
        color: 'text-green-400',
        trainingFocus: 'Maintain a balanced regimen of strength, conditioning, and skill work. This is a good range for athletic performance. Focus on sport-specific movements and improving power and agility.',
        nutritionTips: 'Eat at maintenance calories to maintain your weight. Focus on a balanced diet with whole foods, ensuring adequate protein for muscle repair and carbohydrates for energy.',
        generalAdvice: 'This is a healthy weight range. Focus on refining your skills, improving your basketball IQ, and staying consistent with your training to maximize your athletic potential.',
        bodyFatInfo: 'Body fat is likely in a healthy, athletic range. For men, this is typically 10-15%; for women, 18-25%. Body composition can be further improved by adjusting macronutrients.',
        muscleFatAnalysis: 'Your weight is well-balanced for your height. This is ideal for athletic performance. Focus on refining body composition (recomp) by continuing to strength train and eating a clean diet.'
      };
    } else if (bmi >= 25 && bmi < 29.9) {
      return {
        category: 'Overweight',
        color: 'text-yellow-400',
        trainingFocus: 'Incorporate more metabolic conditioning (metcons) and high-intensity interval training (HIIT) to improve cardiovascular health and burn calories. Continue with strength training to preserve muscle mass.',
        nutritionTips: 'Aim for a slight calorie deficit. Increase your protein intake to promote satiety and muscle retention. Reduce processed foods, sugary drinks, and focus on lean proteins, vegetables, and fiber.',
        generalAdvice: 'Improving body composition will significantly enhance your stamina, speed, and agility on the court, while also reducing the stress on your joints.',
        bodyFatInfo: 'Body fat is likely elevated. For men, this is often above 20%; for women, above 30%. Reducing body fat while maintaining muscle will improve athletic ability.',
        muscleFatAnalysis: 'Your body weight is high for your height, likely indicating excess body fat. The goal is to reduce fat while preserving muscle mass through a combination of diet and exercise.'
      };
    } else {
      return {
        category: 'Obesity',
        color: 'text-red-400',
        trainingFocus: 'Prioritize low-impact conditioning like swimming, cycling, or rowing to protect your joints while improving cardiovascular fitness. Combine this with full-body strength training 2-3 times a week.',
        nutritionTips: 'Consult with a nutritionist or doctor to create a sustainable calorie deficit plan. Focus on whole, unprocessed foods. Increase water intake and be mindful of portion sizes.',
        generalAdvice: 'Making changes now is a powerful step towards better health and performance. Start with small, manageable changes to your diet and activity level to build sustainable habits.',
        bodyFatInfo: 'Body fat percentage is significantly elevated, posing health risks and limiting athletic performance. A structured, long-term plan is recommended.',
        muscleFatAnalysis: 'Weight is significantly high for your height, indicating a high level of body fat. The primary focus should be on fat loss for health and performance, with strength training to maintain muscle.'
      };
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const heightInMeters = values.height / 100;
    const bmi = values.weight / (heightInMeters * heightInMeters);
    const result = getBmiDetails(bmi);
    setTimeout(() => {
        setBmiResult({ value: parseFloat(bmi.toFixed(1)), ...result });
        setIsLoading(false);
    }, 500);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
       <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">BMI & Body Composition</h1>
            <p className="text-muted-foreground">Calculate your Body Mass Index and get personalized athletic insights.</p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Your Measurements</CardTitle>
            <CardDescription>Enter your height and weight to begin.</CardDescription>
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
                        <Input type="number" placeholder="188" {...field} value={field.value ?? ''} />
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
                        <Input type="number" placeholder="85" {...field} value={field.value ?? ''} />
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
                    'Calculate'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col min-h-[360px]">
            <CardHeader>
                <CardTitle>Your Results</CardTitle>
                <CardDescription>Your analysis will appear below.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
                {!isLoading && bmiResult ? (
                    <div className="text-left space-y-4 w-full">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Your BMI is</p>
                          <p className={`text-7xl font-bold ${bmiResult.color}`}>{bmiResult.value}</p>
                          <p className={`text-xl font-semibold ${bmiResult.color}`}>{bmiResult.category}</p>
                        </div>
                        
                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="p-4 bg-secondary/50">
                                <h4 className="font-semibold flex items-center gap-2 mb-2 text-sm"><Percent className="h-4 w-4 text-primary"/> Body Fat % (Estimate)</h4>
                                <p className="text-muted-foreground text-xs">{bmiResult.bodyFatInfo}</p>
                            </Card>
                            <Card className="p-4 bg-secondary/50">
                                <h4 className="font-semibold flex items-center gap-2 mb-2 text-sm"><BarChart className="h-4 w-4 text-primary"/> Muscle-Fat Analysis</h4>
                                <p className="text-muted-foreground text-xs">{bmiResult.muscleFatAnalysis}</p>
                            </Card>
                        </div>
                        
                        <div className="space-y-4 pt-2">
                           <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-1"><Dumbbell className="h-5 w-5 text-primary"/> Training Focus</h4>
                                <p className="text-muted-foreground text-sm">{bmiResult.trainingFocus}</p>
                           </div>
                           <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-1"><UtensilsCrossed className="h-5 w-5 text-primary"/> Nutrition Tips</h4>
                                <p className="text-muted-foreground text-sm">{bmiResult.nutritionTips}</p>
                           </div>
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-1"><Info className="h-5 w-5 text-primary"/> General Advice</h4>
                                <p className="text-muted-foreground text-sm">{bmiResult.generalAdvice}</p>
                           </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center text-muted-foreground p-8">
                      {isLoading ? <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /> : <>
                        <Calculator className="mx-auto h-12 w-12 mb-4" />
                        <p>Your results and recommendations will appear here.</p>
                      </>}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

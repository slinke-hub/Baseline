'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Upload, CheckCircle, XCircle, Footprints, Armchair, Hand, RefreshCw } from 'lucide-react';
import { analyzeShot, type AnalyzeShotOutput } from '@/ai/flows/analyze-shot';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { sampleVideoDataUri } from '@/lib/sample-video';

export default function AiCoachPage() {
    const { toast } = useToast();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(sampleVideoDataUri);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeShotOutput | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleAnalyze = async (videoUri: string) => {
        if (!videoUri) {
            toast({
                title: 'No Video Selected',
                description: 'Please upload a video of your jump shot first.',
                variant: 'destructive'
            });
            return;
        }
        
        setIsLoading(true);
        setAnalysisResult(null);

        try {
            const result = await analyzeShot({ videoDataUri: videoUri });
            setAnalysisResult(result);
        } catch (error) {
            console.error('Failed to analyze shot:', error);
            toast({
                title: 'Analysis Failed',
                description: 'Could not analyze the video. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Automatically analyze the sample video on component mount
    useEffect(() => {
        handleAnalyze(sampleVideoDataUri);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 100 * 1024 * 1024) { // 100MB limit
                toast({
                    title: 'File Too Large',
                    description: 'Please upload a video smaller than 100MB.',
                    variant: 'destructive',
                });
                return;
            }
            setVideoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const newVideoUri = reader.result as string;
                setVideoPreview(newVideoUri);
                handleAnalyze(newVideoUri);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        setVideoFile(null);
        setVideoPreview(sampleVideoDataUri);
        handleAnalyze(sampleVideoDataUri);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
    
    const feedbackItems = analysisResult ? [
        { icon: Footprints, title: 'Feet & Base', text: analysisResult.analysis.feet },
        { icon: Armchair, title: 'Elbow Alignment', text: analysisResult.analysis.elbow },
        { icon: Hand, title: 'Follow-Through', text: analysisResult.analysis.followThrough },
    ] : [];

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">AI Shooting Coach</h1>
                <p className="text-muted-foreground">Upload a video of your jump shot for instant analysis.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Your Jump Shot Analysis</CardTitle>
                    <CardDescription>Using our sample video by default. Upload your own to get personalized feedback.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {videoPreview && (
                        <div className="w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-black mx-auto">
                            <video src={videoPreview} controls className="w-full h-full" />
                        </div>
                    )}

                     <div className="flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                        >
                           <Upload className="mr-2 h-4 w-4" />
                           {videoFile ? 'Change Video' : 'Upload Your Video'}
                        </Button>
                         <Input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isLoading}
                        />
                         <Button
                            variant="ghost"
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                           <RefreshCw className="mr-2 h-4 w-4" />
                           Reset to Sample
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            {isLoading && (
                 <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                            <p>Analyzing your form, just a moment...</p>
                        </div>
                    </CardContent>
                </Card>
            )}

             {analysisResult && !isLoading && (
                <Card className="animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           Analysis Complete 
                           <Badge variant={analysisResult.analysis.isShotGood ? 'default' : 'destructive'}>
                            {analysisResult.analysis.isShotGood ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                            {analysisResult.analysis.isShotGood ? 'Good Form' : 'Needs Work'}
                           </Badge>
                        </CardTitle>
                        <CardDescription>{analysisResult.analysis.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {feedbackItems.map(item => (
                           <Alert key={item.title}>
                             <item.icon className="h-4 w-4" />
                             <AlertTitle>{item.title}</AlertTitle>
                             <AlertDescription>
                               {item.text}
                             </AlertDescription>
                           </Alert>
                       ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

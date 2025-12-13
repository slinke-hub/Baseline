
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Upload, CheckCircle, XCircle, Footprints, Armchair, Hand } from 'lucide-react';
import { analyzeShot, type AnalyzeShotOutput } from '@/ai/flows/analyze-shot';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function AiCoachPage() {
    const { toast } = useToast();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeShotOutput | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast({
                    title: 'File Too Large',
                    description: 'Please upload a video smaller than 10MB.',
                    variant: 'destructive',
                });
                return;
            }
            setVideoFile(file);
            setAnalysisResult(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!videoFile || !videoPreview) {
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
            const result = await analyzeShot({ videoDataUri: videoPreview });
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
                    <CardTitle>Upload Your Video</CardTitle>
                    <CardDescription>For best results, use a side-on angle showing your full body. Max file size: 10MB.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                        >
                           <Upload className="mr-2 h-4 w-4" />
                           {videoFile ? 'Change Video' : 'Select Video'}
                        </Button>
                         <Input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isLoading}
                        />
                        {videoFile && <p className="text-sm text-muted-foreground truncate max-w-xs">{videoFile.name}</p>}
                    </div>

                    {videoPreview && (
                        <div className="w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-black mx-auto">
                            <video src={videoPreview} controls className="w-full h-full" />
                        </div>
                    )}

                    <Button onClick={handleAnalyze} disabled={!videoFile || isLoading} className="w-full" size="lg">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analyzing Form...</> : <><Sparkles className="mr-2 h-4 w-4"/>Analyze My Shot</>}
                    </Button>
                </CardContent>
            </Card>

             {analysisResult && (
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

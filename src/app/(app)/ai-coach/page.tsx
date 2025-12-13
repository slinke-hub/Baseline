'use client';

import { useState, useRef, useEffect }s from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, XCircle, Footprints, Armchair, Hand, Video, Camera, StopCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { analyzeShot, type AnalyzeShotOutput } from '@/ai/flows/analyze-shot';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function AiCoachPage() {
    const { toast } = useToast();
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalyzeShotOutput | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const recordedChunks = useRef<Blob[]>([]);

    useEffect(() => {
        const getCameraPermission = async () => {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            toast({
              variant: 'destructive',
              title: 'Camera Not Supported',
              description: 'Your browser does not support camera access.',
            });
            return;
          }
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
          }
        };
    
        getCameraPermission();
        
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
      }, [toast]);

    const handleAnalyze = async (uri: string) => {
        setIsLoading(true);
        setAnalysisResult(null);

        try {
            const result = await analyzeShot({ videoDataUri: uri });
            setAnalysisResult(result);
            setVideoUri(uri);
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
    
    const handleStartRecording = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    handleAnalyze(reader.result as string);
                };
                reader.readAsDataURL(blob);
                recordedChunks.current = [];
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleReset = () => {
        setVideoUri(null);
        setAnalysisResult(null);
        setIsRecording(false);
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
                <p className="text-muted-foreground">Record your jump shot for instant analysis from our AI coach.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Live Shot Capture</CardTitle>
                    <CardDescription>
                        {hasCameraPermission ? 'Press record to capture your jump shot.' : 'Allow camera access to get started.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-black mx-auto">
                        <video ref={videoRef} className="w-full h-full" autoPlay muted playsInline />
                    </div>

                    {!hasCameraPermission && (
                         <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser to use this feature. You may need to refresh the page after granting permission.
                            </AlertDescription>
                        </Alert>
                    )}

                     <div className="flex items-center justify-center gap-4">
                        {!isRecording ? (
                            <Button
                                size="lg"
                                onClick={handleStartRecording}
                                disabled={isLoading || isRecording || !hasCameraPermission}
                            >
                               <Camera className="mr-2 h-4 w-4" />
                               Record Shot
                            </Button>
                        ) : (
                             <Button
                                size="lg"
                                variant="destructive"
                                onClick={handleStopRecording}
                                disabled={isLoading}
                            >
                               <StopCircle className="mr-2 h-4 w-4" />
                               Stop Recording
                            </Button>
                        )}
                         <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={isLoading || isRecording}
                        >
                           <RefreshCw className="mr-2 h-4 w-4" />
                           Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            {(isLoading || analysisResult) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Jump Shot Analysis</CardTitle>
                         {videoUri && <CardDescription>Here's the feedback on your recorded shot.</CardDescription>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {isLoading && (
                            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                <p>Analyzing your form, just a moment...</p>
                            </div>
                        )}
                        
                        {analysisResult && !isLoading && (
                            <div className="animate-in fade-in-50 space-y-4">
                                 <div className="w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-black mx-auto">
                                    <video src={videoUri || ''} controls className="w-full h-full" />
                                </div>
                                <div className="text-center">
                                    <Badge variant={analysisResult.analysis.isShotGood ? 'default' : 'destructive'}>
                                        {analysisResult.analysis.isShotGood ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                                        {analysisResult.analysis.isShotGood ? 'Good Form' : 'Needs Work'}
                                    </Badge>
                                </div>
                                <Alert>
                                    <Sparkles className="h-4 w-4" />
                                    <AlertTitle>Coach's Summary</AlertTitle>
                                    <AlertDescription>
                                    {analysisResult.analysis.summary}
                                    </AlertDescription>
                                </Alert>
                            
                               {feedbackItems.map(item => (
                                   <Alert key={item.title}>
                                     <item.icon className="h-4 w-4" />
                                     <AlertTitle>{item.title}</AlertTitle>
                                     <AlertDescription>
                                       {item.text}
                                     </AlertDescription>
                                   </Alert>
                               ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

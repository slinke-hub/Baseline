
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Camera, Send, Loader2, VideoOff, Users, Pin } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase, useCollection, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import type { BallIsLifePost } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { resizeImage } from '@/lib/image-resizer';

function BallIsLifeFeed() {
    const { firestore } = useFirebase();
    const postsQuery = useMemoFirebase(() => query(collection(firestore, 'ballIsLife'), orderBy('createdAt', 'desc'), limit(10)), [firestore]);
    const { data: posts, isLoading } = useCollection<BallIsLifePost>(postsQuery);

    if (isLoading) {
        return <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <Card className="neon-border">
            <CardHeader>
                <CardTitle>Live Feed</CardTitle>
                <CardDescription>See who's hooping right now.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {posts && posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post.id} className="flex gap-4 border-b pb-4 last:border-b-0">
                            <Avatar>
                                <AvatarImage src={post.creatorPhotoUrl} alt={post.creatorName} />
                                <AvatarFallback>{post.creatorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="w-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{post.creatorName}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Pin className="h-3 w-3" /> {post.location}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'just now'}</p>
                                </div>
                                <div className="mt-2 relative aspect-[4/3] rounded-lg overflow-hidden border">
                                    <Image src={post.selfieUrl} alt={`Selfie by ${post.creatorName}`} fill className="object-cover" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground p-8">
                        <Users className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="font-semibold">It's quiet... too quiet.</h3>
                        <p>Be the first to post and get a session started!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


export default function BallIsLifePage() {
  const { toast } = useToast();
  const { appUser, user } = useAuth();
  const { firebaseApp, firestore } = useFirebase();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
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
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
        // Cleanup: stop video tracks when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
      }
    }
  };
  
  const getCurrentLocation = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject("Geolocation is not supported.");
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // In a real app, use a reverse geocoding service. Here we mock it.
                resolve(`Court near lat: ${latitude.toFixed(4)}, lon: ${longitude.toFixed(4)}`);
            },
            () => {
                return reject("Unable to retrieve your location.");
            }
        );
    });
  };

  const handlePost = async () => {
    if (!capturedImage || !user || !appUser) {
      toast({ title: "Error", description: "No image captured or user not logged in.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    try {
      const location = await getCurrentLocation();

      // Convert data URL to blob for resizing
      const fetchRes = await fetch(capturedImage);
      const blob = await fetchRes.blob();
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
      
      const resizedImageBlob = await resizeImage(file, 800, 600);

      const storage = getStorage(firebaseApp);
      const selfieRef = ref(storage, `ball-is-life/${user.uid}/${Date.now()}.jpg`);
      
      const uploadResult = await uploadString(selfieRef, capturedImage, 'data_url');
      const selfieUrl = await getDownloadURL(uploadResult.ref);

      const postData: Omit<BallIsLifePost, 'id' | 'createdAt'> = {
        creatorId: user.uid,
        creatorName: appUser.displayName || "Anonymous",
        creatorPhotoUrl: appUser.photoURL || '',
        selfieUrl,
        location,
      };
      
      const postsColRef = collection(firestore, 'ballIsLife');
      
      await addDoc(postsColRef, {
        ...postData,
        createdAt: serverTimestamp()
      }).catch(async (serverError) => {
         const permissionError = new FirestorePermissionError({
            path: postsColRef.path,
            operation: 'create',
            requestResourceData: postData
         });
         errorEmitter.emit('permission-error', permissionError);
         throw new Error("Firestore permission denied.");
      });

      toast({
        title: 'Posted!',
        description: 'Your "Ball is Life" post is live!',
      });

      setCapturedImage(null);
    } catch (error) {
      console.error("Error posting:", error);
      const errorMessage = typeof error === 'string' ? error : 'Could not share your post. Please try again.';
      toast({
        title: 'Post Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Ball is Life</h1>
        <p className="text-muted-foreground">Show everyone you're ready to hoop right now.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="neon-border">
            <CardHeader>
                <CardTitle>Post an Instant Invite</CardTitle>
                <CardDescription>Snap a selfie to let others know you're playing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="aspect-video w-full rounded-md bg-secondary flex items-center justify-center relative overflow-hidden">
                    {hasCameraPermission === false && (
                         <div className="text-center text-muted-foreground">
                            <VideoOff className="mx-auto h-12 w-12"/>
                            <p className="mt-2">Camera access is required.</p>
                        </div>
                    )}
                    <video ref={videoRef} className={`w-full h-full object-cover ${capturedImage ? 'hidden' : ''}`} autoPlay playsInline muted />
                    {capturedImage && (
                        <Image src={capturedImage} alt="Captured selfie" fill objectFit="cover" />
                    )}
                </div>

                 {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>Please allow camera access in your browser to use this feature.</AlertDescription>
                    </Alert>
                 )}

                {capturedImage ? (
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => setCapturedImage(null)} disabled={isSubmitting}>Retake</Button>
                        <Button onClick={handlePost} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Post Now
                        </Button>
                    </div>
                ) : (
                    <Button onClick={handleCapture} disabled={!hasCameraPermission || isSubmitting} className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Capture Selfie
                    </Button>
                )}
            </CardContent>
        </Card>
        
        <BallIsLifeFeed />
      </div>

    </div>
  );
}
    

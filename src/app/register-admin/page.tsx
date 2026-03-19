
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ShieldCheck, Loader2, AlertCircle, Lock, User, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.endsWith('@neu.edu.ph')) {
      setError('Only institutional @neu.edu.ph emails are permitted for administration.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters for administrative security.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (!auth || !db) throw new Error('Firebase services are unavailable.');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const profileData = {
        uid: user.uid,
        email: user.email,
        name: name,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };

      const docRef = doc(db, 'users', user.uid);
      
      setDoc(docRef, profileData)
        .catch(async (err) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'create',
            requestResourceData: profileData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: 'Admin Account Created',
        description: `Welcome, ${name}. Your administrative profile has been initialized.`,
      });

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-muted-foreground hover:text-primary"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Button>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-primary p-4 rounded-2xl shadow-xl">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-primary">Admin Registration</h1>
          <p className="text-muted-foreground">Establish a new institutional administrator account with secure verification.</p>
        </div>

        <Card className="shadow-xl border-none">
          <CardHeader>
            <CardTitle>Create Profile</CardTitle>
            <CardDescription>
              Provide your institutional credentials to gain access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Registration Denied</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <Input 
                  placeholder="e.g. Dr. Jane Smith" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" /> NEU Email Address
                </label>
                <Input 
                  type="email"
                  placeholder="name@neu.edu.ph" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Secure Password
                </label>
                <Input 
                  type="password"
                  placeholder="Minimum 8 characters" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Confirm Password
                </label>
                <Input 
                  type="password"
                  placeholder="Re-enter your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Register Administrator'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
          Institutional Security Protocol Active
        </p>
      </div>
    </div>
  );
}

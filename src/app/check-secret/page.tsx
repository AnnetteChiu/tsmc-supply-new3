'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { checkApiKeyAction } from '../actions';

export default function CheckSecretPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ success: boolean; error: string | null } | null>(null);

  useEffect(() => {
    async function checkKey() {
      setLoading(true);
      const res = await checkApiKeyAction();
      setResult(res);
      setLoading(false);
    }
    checkKey();
  }, []);

  const isKeyValid = result?.success === true;
  const errorMessage = result?.error;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">API Key Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
            {loading ? (
              <>
                <Loader2 className="h-16 w-16 text-muted-foreground animate-spin mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Checking...</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Attempting to contact the Google AI service...
                </p>
              </>
            ) : isKeyValid ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-green-500">Success!</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Your GOOGLE_API_KEY is working correctly. The application can successfully communicate with the AI model.
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-500">Failed</h3>
                <p className="text-muted-foreground text-center mt-2">
                  {errorMessage || 'An unknown error occurred.'}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

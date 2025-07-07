
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CheckSecretPage() {
  const apiKey = process.env.GOOGLE_API_KEY;

  const isKeySet = apiKey && apiKey.length > 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">API Key Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
            {isKeySet ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-green-500">Success!</h3>
                <p className="text-muted-foreground text-center mt-2">
                  The GOOGLE_API_KEY secret is successfully loaded into your deployed application's environment.
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-500">Failed</h3>
                <p className="text-muted-foreground text-center mt-2">
                  The GOOGLE_API_KEY secret could not be found. Please double-check that you have created the secret and granted the correct IAM permissions.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

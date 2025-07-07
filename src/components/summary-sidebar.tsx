'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { generateSummaryAction } from '@/app/actions';
import type { SupplyChainNode } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

interface SummarySidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: SupplyChainNode | null;
}

const summaryFormSchema = z.object({
  linkDetails: z.string().min(10, { message: 'Please provide more details about the supply chain link.' }),
  quantitativeData: z.string().optional(),
});

type SummaryFormValues = z.infer<typeof summaryFormSchema>;

export default function SummarySidebar({ open, onOpenChange, node }: SummarySidebarProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const { toast } = useToast();

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summaryFormSchema),
    defaultValues: {
      linkDetails: '',
      quantitativeData: '',
    },
  });

  useEffect(() => {
    if (node) {
      form.reset({
        linkDetails: node.details,
        quantitativeData: node.data,
      });
      setSummary('');
    }
  }, [node, form]);

  async function onSubmit(values: SummaryFormValues) {
    setLoading(true);
    setSummary('');
    const result = await generateSummaryAction(values);
    setLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.summary) {
      setSummary(result.summary);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full p-0">
        <div className="h-full overflow-y-auto">
          <SheetHeader className="p-6">
            <SheetTitle className="font-headline text-2xl">AI-Powered Summary</SheetTitle>
            <SheetDescription>Generate a summary for '{node?.title}'. Edit the details below and click generate.</SheetDescription>
          </SheetHeader>
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="linkDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the supply chain link..." className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantitativeData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantitative Data (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any relevant metrics or data..." className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Generating...' : 'Generate Summary'}
                </Button>
              </form>
            </Form>
            
            {(loading || summary) && <Separator className="my-8" />}

            {loading && (
               <div className="space-y-4">
                 <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                 <div className="space-y-2">
                   <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                   <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                   <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                 </div>
               </div>
            )}
            
            {summary && (
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Generated Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 whitespace-pre-wrap">{summary}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

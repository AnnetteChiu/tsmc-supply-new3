'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { generateSummaryAction, suggestImprovementAction } from '@/app/actions';
import type { SupplyChainNode } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export default function SummarySidebar({ open, onOpenChange, node }: SummarySidebarProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
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
      setSuggestion('');
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

  async function handleSuggest(values: SummaryFormValues) {
    setSuggestionLoading(true);
    setSuggestion('');
    const result = await suggestImprovementAction(values);
    setSuggestionLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.suggestion) {
      setSuggestion(result.suggestion);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full p-0">
        <div className="h-full overflow-y-auto">
          <SheetHeader className="p-6">
            <SheetTitle className="font-headline text-2xl">AI-Powered Insights</SheetTitle>
            <SheetDescription>
              Generate a summary or get improvement suggestions for '{node?.title}'. Edit details and choose an action.
            </SheetDescription>
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
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" disabled={loading || suggestionLoading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Generating...' : 'Generate Summary'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={form.handleSubmit(handleSuggest)}
                    disabled={loading || suggestionLoading}
                    className="w-full"
                  >
                    {suggestionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Lightbulb className="mr-2 h-4 w-4" />
                    {suggestionLoading ? 'Thinking...' : 'Suggest Improvement'}
                  </Button>
                </div>
              </form>
            </Form>

            {node?.chartData && node.chartTitle && (
              <>
                <Separator className="my-8" />
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Key Metrics</CardTitle>
                    <CardDescription>{node.chartTitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                      <BarChart
                        accessibilityLayer
                        data={node.chartData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: -10,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 10)}
                        />
                        <YAxis tickFormatter={(value) => `${value}${node.chartUnit || ''}`} />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              labelClassName="font-bold"
                              formatter={(value) => `${value.toLocaleString()}${node.chartUnit || ''}`}
                            />
                          }
                        />
                        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </>
            )}

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

            {(suggestionLoading || suggestion) && <Separator className="my-8" />}

            {suggestionLoading && (
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            )}

            {suggestion && (
              <Card className="border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2 text-accent">
                    <Lightbulb />
                    Improvement Suggestion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 whitespace-pre-wrap">{suggestion}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

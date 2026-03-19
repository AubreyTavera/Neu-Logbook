
"use client"

import { useState } from "react";
import { Sparkles, FileText, Download, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { generateUsageInsightsReport } from "@/ai/flows/generate-usage-insights-report";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const { visits } = useAuthStore();
  const { toast } = useToast();
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const records = visits.map(v => ({
        timestamp: v.timestamp,
        department: v.department,
        reasonForVisit: v.reasonForVisit,
      }));
      
      const result = await generateUsageInsightsReport({ visitRecords: records });
      setReport(result.summaryReport);
      toast({
        title: "Report Generated",
        description: "AI analysis of visitor data is complete.",
      });
    } catch (err) {
      toast({
        title: "Report Failed",
        description: "Could not generate report. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">AI Usage Insights</h1>
          <p className="text-muted-foreground">Advanced patterns and trends analyzed by Gemini.</p>
        </div>
        {!report && (
          <Button 
            className="bg-accent hover:bg-accent/90 gap-2 h-12 px-6"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Summary Report
          </Button>
        )}
      </div>

      {!report ? (
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-dashed border-2 bg-transparent">
            <CardContent className="p-12 flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/5 p-4 rounded-full">
                <FileText className="w-12 h-12 text-primary opacity-20" />
              </div>
              <h3 className="text-xl font-bold">No Report Generated</h3>
              <p className="text-muted-foreground">
                Click the button above to analyze historical data and identify busiest hours and common visit reasons.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="font-bold text-lg">What's in the report?</h3>
            <ul className="space-y-4">
              {[
                "Busiest hours of operation based on timestamps",
                "Most frequent reasons for visiting specific facilities",
                "Department-level activity trends",
                "Actionable recommendations for staffing",
              ].map((text, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                    {i+1}
                  </div>
                  <span className="text-muted-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-none shadow-xl">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-accent" />
                    Visitor Activity Analysis
                  </CardTitle>
                  <CardDescription>Generated on {new Date().toLocaleDateString()}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleGenerateReport} disabled={loading}>
                    <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                    Regenerate
                  </Button>
                  <Button size="sm" className="bg-primary">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-lg text-foreground/80 font-body">
                  {report}
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-accent/5 rounded-2xl border border-accent/10">
                <h4 className="font-bold text-accent mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Observation
                </h4>
                <p className="text-sm text-muted-foreground italic">
                  Note: This report is generated using institutional visit data from the last 30 days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

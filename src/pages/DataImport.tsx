import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImportResult {
  fileName: string;
  dataType: string;
  recordsProcessed: number;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

const DataImport = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectDataType = (fileName: string): 'enrollment' | 'demographic' | 'biometric' | null => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('enrolment') || lowerName.includes('enrollment')) return 'enrollment';
    if (lowerName.includes('demographic')) return 'demographic';
    if (lowerName.includes('biometric')) return 'biometric';
    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const csvFiles = selectedFiles.filter(f => f.name.endsWith('.csv'));
    setFiles(prev => [...prev, ...csvFiles]);
    
    // Initialize results
    const newResults: ImportResult[] = csvFiles.map(f => ({
      fileName: f.name,
      dataType: detectDataType(f.name) || 'unknown',
      recordsProcessed: 0,
      status: 'pending'
    }));
    setResults(prev => [...prev, ...newResults]);
  };

  const importFile = async (file: File, index: number) => {
    const dataType = detectDataType(file.name);
    if (!dataType) {
      setResults(prev => prev.map((r, i) => 
        i === index ? { ...r, status: 'error', error: 'Unknown data type' } : r
      ));
      return;
    }

    setResults(prev => prev.map((r, i) => 
      i === index ? { ...r, status: 'processing' } : r
    ));

    try {
      const csvContent = await file.text();
      const lines = csvContent.split('\n').length - 1;

      const { data, error } = await supabase.functions.invoke('import-csv-data', {
        body: { dataType, csvContent }
      });

      if (error) throw error;

      setResults(prev => prev.map((r, i) => 
        i === index ? { 
          ...r, 
          status: 'success', 
          recordsProcessed: lines 
        } : r
      ));

      toast.success(`Imported ${file.name}`);
    } catch (error: any) {
      console.error('Import error:', error);
      setResults(prev => prev.map((r, i) => 
        i === index ? { ...r, status: 'error', error: error.message } : r
      ));
      toast.error(`Failed to import ${file.name}`);
    }
  };

  const handleImportAll = async () => {
    setIsImporting(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      await importFile(files[i], i);
      setProgress(((i + 1) / files.length) * 100);
    }

    setIsImporting(false);
    toast.success('Import complete!');
  };

  const clearFiles = () => {
    setFiles([]);
    setResults([]);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = (status: ImportResult['status']) => {
    switch (status) {
      case 'pending': return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'processing': return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getDataTypeBadge = (dataType: string) => {
    const colors: Record<string, string> = {
      enrollment: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      demographic: 'bg-green-500/20 text-green-400 border-green-500/30',
      biometric: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      unknown: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[dataType] || colors.unknown;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Import</h1>
          <p className="text-muted-foreground">
            Import Aadhaar CSV data files to populate the analytics dashboard
          </p>
        </div>

        <Card className="border-dashed border-2">
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Upload CSV Files</p>
                <p className="text-sm text-muted-foreground">
                  Supports enrollment, demographic, and biometric data files
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                Select Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Files to Import ({files.length})</CardTitle>
              <CardDescription>
                Review and import selected CSV files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isImporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium text-sm truncate max-w-[300px]">
                          {result.fileName}
                        </p>
                        {result.status === 'success' && (
                          <p className="text-xs text-muted-foreground">
                            {result.recordsProcessed.toLocaleString()} records
                          </p>
                        )}
                        {result.status === 'error' && (
                          <p className="text-xs text-destructive">{result.error}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getDataTypeBadge(result.dataType)}>
                      {result.dataType}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleImportAll} 
                  disabled={isImporting}
                  className="flex-1"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Import All Files'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearFiles}
                  disabled={isImporting}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Import Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Enrollment
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Files with "enrolment" in the name. Contains age_0_5, age_5_17, age_18_greater columns.
                </p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Demographic
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Files with "demographic" in the name. Contains demo_age_5_17, demo_age_17_+ columns.
                </p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Biometric
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Files with "biometric" in the name. Contains bio_age_5_17, bio_age_17_+ columns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DataImport;
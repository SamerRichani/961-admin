"use client"

import { ArrowLeft, Bot, Users, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { type Report } from '@/app/features/moderation/types';
import { format } from 'date-fns';
import { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { handleReportAction, reasonConfig } from '@/app/features/moderation/redux/moderationSlice';

interface ReportDetailsProps {
  report: Report;
  onBack: () => void;
}

export function ReportDetails({ report, onBack }: ReportDetailsProps) {
  const dispatch = useAppDispatch();
  const [note, setNote] = useState('');
  
  const handleAction = (action: 'approve' | 'reject') => {
    dispatch(handleReportAction({ reportId: report.id, action, note }));
    onBack();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>

        {/* Header */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold">Report #{report.id}</h1>
              {report.aiModerated && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">AI Flagged</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleAction('reject')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                className="bg-[#FF0000] hover:bg-[#CC0000]"
                onClick={() => handleAction('approve')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(new Date(report.reportedAt), 'MMM d, yyyy h:mm a')}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {report.reporters.length} reports
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Reported Content</h2>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-900">{report.contentPreview}</div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Content ID:</span>
                <code className="px-2 py-1 bg-gray-100 rounded text-sm">{report.contentId}</code>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Reports Timeline</h2>
              <div className="space-y-4">
                {report.reporters.map((reporter) => (
                  <div key={reporter.id} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{reporter.name}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(reporter.reportedAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {report.aiModerated && (
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">AI Analysis</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">Confidence Score</div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${report.aiModerated.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      {Math.round(report.aiModerated.confidence * 100)}%
                    </div>
                  </div>
                  {report.aiModerated.detectedKeywords && (
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Detected Keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {report.aiModerated.detectedKeywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Report Details</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Reason</div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const ReasonIcon = reasonConfig[report.reason].icon;
                      return <ReasonIcon className="h-4 w-4 text-gray-600" />;
                    })()}
                    <span className="font-medium">{reasonConfig[report.reason].label}</span>
                  </div>
                </div>
                {report.details && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Additional Details</div>
                    <p className="text-sm">{report.details}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Moderation Note</h2>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about your decision..."
                className="mb-2"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                This note will be saved with your moderation action for future reference.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
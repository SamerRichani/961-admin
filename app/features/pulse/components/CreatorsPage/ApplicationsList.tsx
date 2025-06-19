"use client"

import { type Creator } from '@/app/features/pulse/type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Globe, 
  MapPin, 
  Video, 
  FileText, 
  Image as ImageIcon, 
  Mic 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { 
  setExpandedId, 
  setApprovalDialog, 
  approveCreator,
  rejectCreator,
  setApplications,
  setSearch
} from '@/app/features/pulse/redux/creatorApplicationsSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

interface ApplicationsResponse {
  data: Creator[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

interface ApprovalDialogProps {
  application: Creator;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string, updates: { desiredUsername: string; topics: string[] }) => void;
}

function ApprovalDialog({ application, open, onOpenChange, onApprove }: ApprovalDialogProps) {
  const [desiredUsername, setDesiredUsername] = useState(application.application?.desiredUsername || application.username);
  const [topics, setTopics] = useState(application.application?.topics || []);
  const [newTopic, setNewTopic] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Creator Application</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="username">Desired Creator Username</Label>
            <Input
              id="username"
              value={desiredUsername}
              onChange={(e) => setDesiredUsername(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Topics</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {topics.map((topic, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => setTopics(topics.filter((_, i) => i !== index))}
                >
                  {topic}
                  <XCircle className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Add a topic"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTopic) {
                    setTopics([...topics, newTopic]);
                    setNewTopic('');
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  if (newTopic) {
                    setTopics([...topics, newTopic]);
                    setNewTopic('');
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onApprove(application._id, { desiredUsername, topics })}
            className="bg-[#FF0000] hover:bg-[#CC0000]"
          >
            Approve Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const DEFAULT_AUDIENCE = 'Not specified';

export default function ApplicationsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, search, expandedId, approvalDialog } = useSelector((state: RootState) => state.creatorApplications);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const [pendingResponse, rejectedResponse] = await Promise.all([
          fetch('http://localhost:3001/api/pulse/creators?status=pending'),
          fetch('http://localhost:3001/api/pulse/creators?status=rejected')
        ]);

        if (!pendingResponse.ok || !rejectedResponse.ok) {
          throw new Error('Failed to fetch applications');
        }

        const [pendingData, rejectedData]: [ApplicationsResponse, ApplicationsResponse] = await Promise.all([
          pendingResponse.json(),
          rejectedResponse.json()
        ]);

        const allApplications = [...pendingData.data, ...rejectedData.data];
        dispatch(setApplications(allApplications));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [dispatch]);

  const filteredApplications = applications.filter(app => {
    const searchTerm = search.toLowerCase();
    return (
      app.name.toLowerCase().includes(searchTerm) ||
      app.username.toLowerCase().includes(searchTerm) ||
      app.category.toLowerCase().includes(searchTerm) ||
      app.application?.topics?.some(topic => topic.toLowerCase().includes(searchTerm)) ||
      app.application?.contentFormats?.some(format => format.toLowerCase().includes(searchTerm))
    );
  });

  const handleApprove = (id: string, updates: { desiredUsername: string; topics: string[] }) => {
    dispatch(approveCreator({ id, updates }));
    dispatch(setApprovalDialog(null));
    dispatch(setApplications(applications.filter(app => app._id !== id)));
  };

  const handleReject = (id: string) => {
    dispatch(rejectCreator(id));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading applications: {error}</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return <div className="text-center py-12 text-gray-500">No applications found</div>;
  }

  return (
    <div className="space-y-6">
      {filteredApplications.map((application) => (
        <Card 
          key={application._id} 
          className={`p-6 cursor-pointer hover:border-[#FF0000] transition-colors ${
            application.status === 'rejected' ? 'opacity-50' : ''
          }`}
          onClick={() => dispatch(setExpandedId(expandedId === application._id ? null : application._id))}
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-1">{application.name}</h3>
                <div className="text-gray-500">
                  <span>Personal Username: @{application.username}</span>
                  <span className="mx-2">•</span>
                  <span>Desired Creator Username: @{application.application?.desiredUsername || application.username}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Applied {format(new Date(application.application?.submittedAt || ''), 'MMM d, yyyy')}
                </span>
                {application.status === 'rejected' && (
                  <Badge variant="destructive">Rejected</Badge>
                )}
                {expandedId === application._id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedId === application._id && (
              <div className="space-y-6 mt-6 pt-6 border-t">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <p className="text-gray-600">{application.application?.phone}</p>
                    <p className="text-gray-600">{application.application?.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-600">{application.application?.country}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Content targets: {application.application?.targetAudience ?? DEFAULT_AUDIENCE}
                    </p>
                  </div>
                </div>

                {/* Content Info */}
                <div>
                  <h4 className="font-medium mb-3">Content Information</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-500">Topics</h5>
                      <div className="flex flex-wrap gap-2">
                        {application.application?.topics?.map((topic) => (
                          <Badge key={topic} variant="secondary">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-500">Content Format</h5>
                      <div className="flex flex-wrap gap-4">
                        {application.application?.contentFormats?.map((format) => (
                          <div key={format} className="flex items-center gap-2">
                            {format === 'video' && <Video className="h-4 w-4 text-gray-500" />}
                            {format === 'article' && <FileText className="h-4 w-4 text-gray-500" />}
                            {format === 'image' && <ImageIcon className="h-4 w-4 text-gray-500" />}
                            {format === 'audio' && <Mic className="h-4 w-4 text-gray-500" />}
                            <span className="text-gray-600 capitalize">{format}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="font-medium mb-3">Social Media Presence</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(application.application?.socialLinks || {}).map(([platform, link]) => (
                      <a
                        key={platform}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#FF0000] hover:text-[#CC0000]"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="capitalize">{platform}</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Sample Videos */}
                {application.application?.sampleVideos && application.application.sampleVideos.length > 0 && (
                  <div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Sample Videos</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {application.application.sampleVideos.map((video, index) => (
                          <div key={index} className="aspect-video bg-gray-100 rounded-lg">
                            <iframe
                              src={video}
                              className="w-full h-full rounded-lg aspect-[9/16]"
                              allowFullScreen
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t mt-6">
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(application._id);
                    }}
                    disabled={application.status === 'rejected'}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-[#FF0000] hover:bg-[#CC0000]"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setApprovalDialog(application));
                    }}
                    disabled={application.status === 'rejected'}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card> 
      ))}

      {approvalDialog && (
        <ApprovalDialog
          application={approvalDialog}
          open={!!approvalDialog}
          onOpenChange={(open) => !open && dispatch(setApprovalDialog(null))}
          onApprove={handleApprove}
        />
      )}

      {filteredApplications.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No applications found matching your search
        </div>
      )}
    </div>
  );
}
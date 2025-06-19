"use client";

import {
  ArrowLeft,
  Search,
  ArrowUpDown,
  Eye,
  Heart,
  Share2,
  DollarSign,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatMoney, formatNumber } from "@/lib/format";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSearch,
  setSortField,
  setSortDirection,
  setContent,
  setLoading,
  setError,
  toggleShadowban,
  toggleDemonetize,
} from "@/app/features/pulse/redux/creatorContentSlice";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ModerateContentDialog } from "@/app/features/pulse/components/ContentPage/ModerateContentDialog";
import { BoostContentDialog } from "@/app/features/pulse/components/ContentPage/BoostContentDialog";

interface DialogContent {
  id: string;
  title: string;
  isShadowbanned?: boolean;
  isDemonetized?: boolean;
}

export function CreatorContent() {
  const dispatch = useDispatch();
  const params = useParams();
  const creatorId = params.creatorId as string;
  const [selectedContent, setSelectedContent] = useState<{ id: string; title: string } | null>(null);
  const [isModerateOpen, setIsModerateOpen] = useState(false);
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  
  const { content, search, sortField, sortDirection, loading, error } = useSelector(
    (state: RootState) => state.creatorContent
  );

  useEffect(() => {
    const fetchContent = async () => {
      if (!creatorId) {
        dispatch(setError('No creator ID provided'));
        return;
      }

      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/creator/${creatorId}`);
        const data = await response.json();
        if (data.success) {
          dispatch(setContent(data.data));
        } else {
          dispatch(setError('Failed to fetch content'));
        }
      } catch (error) {
        dispatch(setError('Error fetching content'));
        console.error('Error fetching content:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchContent();
  }, [dispatch, creatorId]);

  const sortedContent = [...content].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    return direction * (a[sortField] - b[sortField]);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-500">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-4 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>

        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Content Performance
            </h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search content..."
                  value={search}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  className="pl-9 w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={sortField}
                  onValueChange={(value) =>
                    dispatch(setSortField(value as typeof sortField))
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="views">Views</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="shares">Shares</SelectItem>
                    <SelectItem value="adRevenue">Ad Revenue</SelectItem>
                    <SelectItem value="commerceRevenue">
                      Commerce Revenue
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    dispatch(
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                    )
                  }
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {content.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No content found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedContent.map((content) => (
                <div
                  key={content.id}
                  className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-full sm:w-48 h-48 sm:h-64 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium">{content.title}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedContent({ id: content.id, title: content.title });
                            setIsModerateOpen(true);
                          }}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedContent({ id: content.id, title: content.title });
                            setIsBoostOpen(true);
                          }}
                        >
                          <Zap className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Eye className="h-4 w-4" />
                          Views
                        </div>
                        <div className="font-medium">
                          {formatNumber(content.views)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Heart className="h-4 w-4" />
                          Engagement
                        </div>
                        <div className="font-medium">
                          {formatNumber(content.engagement)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Share2 className="h-4 w-4" />
                          Shares
                        </div>
                        <div className="font-medium">
                          {formatNumber(content.shares)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <DollarSign className="h-4 w-4" />
                          Ad Revenue
                        </div>
                        <div className="font-medium">
                          {formatMoney(content.adRevenue)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <DollarSign className="h-4 w-4" />
                          Commerce Revenue
                        </div>
                        <div className="font-medium">
                          {formatMoney(content.commerceRevenue)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ModerateContentDialog
        content={selectedContent ? {
          id: selectedContent.id,
          title: selectedContent.title,
          isShadowbanned: content.find(c => c.id === selectedContent.id)?.isShadowbanned || false,
          isDemonetized: content.find(c => c.id === selectedContent.id)?.isDemonetized || false
        } : null}
        open={isModerateOpen}
        onOpenChange={setIsModerateOpen}
      />

      <BoostContentDialog
        content={selectedContent ? {
          id: selectedContent.id,
          title: selectedContent.title
        } : null}
        open={isBoostOpen}
        onOpenChange={setIsBoostOpen}
      />
    </div>
  );
}

"use client";

import {
  Search,
  Filter,
  BarChart2,
  Eye,
  Heart,
  Send,
  DollarSign,
  Play,
  FileText,
  Image as ImageIcon,
  Flag,
  Shield,
  Loader2,
  Trash2,
} from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSearch,
  setReachSlider,
  toggleDemonetize,
  toggleShadowban,
  setContent,
  setLoading,
  setError,
  deleteContent,
} from "@/app/features/pulse/redux/contentSlice";
import { useEffect, useState } from "react";
import { DeleteContentModal } from "@/app/features/pulse/components/ContentPage/DeleteContentModal";
import { ShadowbanDialog } from "@/app/features/pulse/components/ContentPage/ShadowbanDialog";
import { DemonetizeDialog } from "@/app/features/pulse/components/ContentPage/DemonetizeDialog";
import { BoostDialog } from "@/app/features/pulse/components/ContentPage/BoostDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReachLevel } from "../type";

const reachColors: Record<ReachLevel, { bg: string; text: string }> = {
  low: { bg: "bg-gray-100", text: "text-gray-700" },
  medium: { bg: "bg-blue-100", text: "text-blue-700" },
  high: { bg: "bg-purple-100", text: "text-purple-700" },
  viral: { bg: "bg-red-100", text: "text-red-700" },
};

const statusColors: Record<
  "published" | "flagged" | "under_review",
  { bg: string; text: string }
> = {
  published: { bg: "bg-green-100", text: "text-green-700" },
  flagged: { bg: "bg-red-100", text: "text-red-700" },
  under_review: { bg: "bg-yellow-100", text: "text-yellow-700" },
};

export function ContentPage() {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const { content, search, selectedType, selectedReach, reachSliders, loading, error } =
    useSelector((state: RootState) => state.content);
  const [contentToDelete, setContentToDelete] = useState<{ id: string; title: string } | null>(null);
  const [contentToShadowban, setContentToShadowban] = useState<{ id: string; title: string; isShadowbanned?: boolean } | null>(null);
  const [contentToDemonetize, setContentToDemonetize] = useState<{ id: string; title: string; isDemonetized?: boolean } | null>(null);
  const [contentToBoost, setContentToBoost] = useState<{
    id: string;
    title: string;
    currentBoost?: {
      level: number;
      duration: number;
      startDate: string;
      endDate: string;
    };
    boostHistory?: Array<{
      level: number;
      duration: number;
      startDate: string;
      endDate: string;
      _id: string;
    }>;
  } | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/content`);
        const data = await response.json();
        if (data.success) {
          const mappedContent = data.data.map((item: any) => ({
            id: item._id,
            title: item.title,
            type: item.type,
            views: item.views,
            engagement: item.engagement,
            shares: item.shares,
            revenue: item.adRevenue + item.commerceRevenue,
            reach: item.metrics.completionRate > 0.8 ? 'viral' : 
                   item.metrics.completionRate > 0.6 ? 'high' : 
                   item.metrics.completionRate > 0.4 ? 'medium' : 'low',
            reachScore: Math.floor(item.metrics.completionRate * 100),
            publishedAt: item.publishedAt,
            creator: {
              id: item.creatorId._id,
              name: item.creatorId.name,
              avatar: item.creatorId.avatarUrl,
            },
            status: item.status,
            isDemonetized: item.isDemonetized,
            isShadowbanned: item.isShadowBanned,
            currentBoost: item.currentBoost,
            boostHistory: item.boostHistory,
          }));
          dispatch(setContent(mappedContent));
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
  }, [dispatch]);

  const handleReachChange = (contentId: string, value: number[]) => {
    dispatch(setReachSlider({ contentId, value: value[0] }));
  };

  const filteredContent = content.filter((content) => {
    const matchesSearch = content.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = selectedType === "all" || content.type === selectedType;
    const matchesReach =
      selectedReach === "all" || content.reach === selectedReach;
    return matchesSearch && matchesType && matchesReach;
  });

  const handleDelete = async (contentId: string) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/content/${contentId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        dispatch(deleteContent(contentId));
      } else {
        dispatch(setError('Failed to delete content'));
      }
    } catch (error) {
      dispatch(setError('Error deleting content'));
      console.error('Error deleting content:', error);
    } finally {
      dispatch(setLoading(false));
      setContentToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-500">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Content</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search content..."
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {content.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No content found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Content</TableHead>
                  <TableHead>
                    <Play className="h-4 w-4" />
                  </TableHead>
                  <TableHead className="font-medium">Creator</TableHead>
                  <TableHead>
                    <Eye className="h-4 w-4" />
                  </TableHead>
                  <TableHead>
                    <Heart className="h-4 w-4" />
                  </TableHead>
                  <TableHead>
                    <Send className="h-4 w-4" />
                  </TableHead>
                  <TableHead>
                    <DollarSign className="h-4 w-4" />
                  </TableHead>
                  <TableHead className="font-medium">Reach</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="font-medium">{content.title}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(content.publishedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {content.type === "video" && (
                        <Play className="h-4 w-4 text-blue-500" />
                      )}
                      {content.type === "article" && (
                        <FileText className="h-4 w-4 text-green-500" />
                      )}
                      {content.type === "photo" && (
                        <ImageIcon className="h-4 w-4 text-purple-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className="text-sm text-[#FF0000] hover:text-[#CC0000] cursor-pointer"
                        onClick={() =>
                          navigate.navigate(
                            `/pulse/creators/${content.creator.id}`
                          )
                        }
                      >
                        {content.creator.name}
                      </span>
                    </TableCell>
                    <TableCell>{Math.floor(content.views / 1000)}k</TableCell>
                    <TableCell>
                      {Math.floor(content.engagement / 1000)}k
                    </TableCell>
                    <TableCell>{Math.floor(content.shares / 1000)}k</TableCell>
                    <TableCell>${Math.floor(content.revenue / 1000)}k</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge
                          variant="outline"
                          className={`${reachColors[content.reach].bg} ${
                            reachColors[content.reach].text
                          }`}
                        >
                          {content.reach}
                        </Badge>
                        <div className="w-32">
                          <Slider
                            value={[
                              reachSliders[content.id] || content.reachScore,
                            ]}
                            onValueChange={(value: number[]) =>
                              handleReachChange(content.id, value)
                            }
                            max={100}
                            step={1}
                            className="h-1.5"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${statusColors[content.status].bg} ${
                            statusColors[content.status].text
                          }`}
                        >
                          {content.status.replace("_", " ")}
                        </Badge>
                        {content.flags && (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-700"
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            {content.flags.count}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            navigate.navigate(`/analytics/content/${content.id}`)
                          }
                        >
                          <BarChart2 className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setContentToShadowban({
                                id: content.id,
                                title: content.title,
                                isShadowbanned: content.isShadowbanned
                              })}
                            >
                              {content.isShadowbanned ? "Remove Shadowban" : "Shadowban"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setContentToDemonetize({
                                id: content.id,
                                title: content.title,
                                isDemonetized: content.isDemonetized
                              })}
                            >
                              {content.isDemonetized ? "Remonetize" : "Demonetize"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-blue-600"
                              onClick={() => setContentToBoost({
                                id: content.id,
                                title: content.title,
                                currentBoost: content.currentBoost,
                                boostHistory: content.boostHistory
                              })}
                            >
                              {content.currentBoost ? "Boost Details" : "Boost"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => setContentToDelete({ id: content.id, title: content.title })}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <DeleteContentModal
        isOpen={!!contentToDelete}
        onClose={() => setContentToDelete(null)}
        onConfirm={() => contentToDelete && handleDelete(contentToDelete.id)}
        contentTitle={contentToDelete?.title}
      />

      <ShadowbanDialog
        content={contentToShadowban}
        open={!!contentToShadowban}
        onOpenChange={(open) => !open && setContentToShadowban(null)}
      />

      <DemonetizeDialog
        content={contentToDemonetize}
        open={!!contentToDemonetize}
        onOpenChange={(open) => !open && setContentToDemonetize(null)}
      />

      <BoostDialog
        content={contentToBoost}
        open={!!contentToBoost}
        onOpenChange={(open) => !open && setContentToBoost(null)}
      />
    </div>
  );
}

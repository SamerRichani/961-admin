"use client";

import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatNumber, formatMoney } from "@/lib/format";
import {
  Eye,
  Heart,
  Send,
  Clock,
  ArrowUpDown,
  Download,
  Filter,
  ExternalLink,
  Play,
  FileText,
  ListFilter,
  HelpCircle,
  DollarSign,
  Users,
  ArrowLeft,
  Calendar,
  MousePointerClick,
  CheckCircle,
} from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setContentSearch,
  setContentSortField,
  setContentSortOrder,
  setContentFilters,
  setRowsPerPage,
  setSelectedCreator,
  setSelectedType,
} from "@/app/features/analytics/redux/analyticsSlice";
import { PostType, RowsPerPage, SortField } from "../types";
import { AnalyticsTabs } from "@/app/features/analytics/components/AnalyticsTabs";

const contentTypeData = [
  { type: "Videos", views: 450000, revenue: 25000 },
  { type: "Articles", views: 350000, revenue: 18000 },
  { type: "Photos", views: 250000, revenue: 12000 },
  { type: "Quizzes", views: 180000, revenue: 9000 },
  { type: "Polls", views: 150000, revenue: 7500 },
  { type: "Listicles", views: 120000, revenue: 6000 },
];

// Generate 50 mock content items
const contentData = Array.from({ length: 50 }, (_, i) => {
  const types: PostType[] = ["article", "video", "listicle", "quiz", "poll"];
  const creators = [
    "Sarah Johnson",
    "Michael Chen",
    "Emma Davis",
    "Alex Thompson",
    "Maria Garcia",
  ];
  const titles = [
    "Best Lebanese Restaurants in Beirut",
    "Top 10 Hidden Gems in Lebanon",
    "Traditional Lebanese Recipes",
    "Lebanon Travel Guide 2024",
    "Lebanese Street Food Tour",
    "History of Lebanese Cuisine",
    "Modern Lebanese Architecture",
    "Lebanese Music Festivals",
    "Lebanese Fashion Trends",
    "Lebanese Tech Startups",
  ];

  const type = types[Math.floor(Math.random() * types.length)];
  const views = Math.floor(Math.random() * 2000000) + 50000;
  const shares = Math.floor(views * (Math.random() * 0.1 + 0.02));
  const revenue = Math.floor(views * (Math.random() * 0.5 + 0.1));
  const engagementRate = Math.random() * 20 + 5;
  const watchTime =
    type === "video" ? Math.floor(Math.random() * 600 + 120) : null;

  return {
    id: `content-${i + 1}`,
    title: titles[Math.floor(Math.random() * titles.length)],
    url: `https://example.com/content-${i + 1}`,
    creator: creators[Math.floor(Math.random() * creators.length)],
    type,
    publishedAt: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toISOString(),
    views,
    shares,
    revenue,
    engagementRate,
    newUsers: Math.floor(views * (Math.random() * 0.05 + 0.01)),
    ctr: Math.random() * 15 + 2,
    avgWatchTime: watchTime,
    completionRate: Math.random() * 30 + 65,
    keywords: ["lebanon", "culture", "lifestyle"],
  };
});

function ContentPerformance() {
  const dispatch = useAppDispatch();
  const {
    contentSearch,
    selectedMetric,
    contentSortField,
    contentSortOrder,
    contentFilters,
    rowsPerPage,
    selectedCreator,
    selectedType,
  } = useAppSelector((state) => state.analytics);
  const navigate = useNavigation();

  const handleSort = (field: SortField) => {
    if (contentSortField === field) {
      dispatch(
        setContentSortOrder(contentSortOrder === "asc" ? "desc" : "asc")
      );
    } else {
      dispatch(setContentSortField(field));
      dispatch(setContentSortOrder("desc"));
    }
  };

  const filteredContent = useMemo(() => {
    return contentData
      .filter((content) => {
        const matchesSearch =
          ((!selectedCreator || content.creator === selectedCreator) &&
            (!selectedType || content.type === selectedType) &&
            content.title
              .toLowerCase()
              .includes(contentSearch.toLowerCase())) ||
          content.creator.toLowerCase().includes(contentSearch.toLowerCase()) ||
          content.url.toLowerCase().includes(contentSearch.toLowerCase()) ||
          content.keywords.some((k) =>
            k.toLowerCase().includes(contentSearch.toLowerCase())
          );

        const matchesType =
          contentFilters.postTypes.length === 0 ||
          contentFilters.postTypes.includes(content.type);
        const matchesCreator =
          contentFilters.creators.length === 0 ||
          contentFilters.creators.includes(content.creator);
        const matchesMetrics =
          content.views >= contentFilters.minViews &&
          content.revenue >= contentFilters.minRevenue &&
          content.engagementRate >= contentFilters.minEngagement;

        return matchesSearch && matchesType && matchesCreator && matchesMetrics;
      })
      .sort((a, b) => {
        const direction = contentSortOrder === "asc" ? 1 : -1;
        if (contentSortField === "publishedAt") {
          return (
            direction *
            (new Date(a.publishedAt).getTime() -
              new Date(b.publishedAt).getTime())
          );
        }
        return (
          direction * ((a[contentSortField] || 0) - (b[contentSortField] || 0))
        );
      });
  }, [
    contentData,
    contentSearch,
    contentFilters,
    contentSortField,
    contentSortOrder,
    selectedCreator,
    selectedType,
  ]);

  const handleBack = useCallback(() => {
    dispatch(setSelectedCreator(null));
    dispatch(setSelectedType(null));
  }, [dispatch]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleExport = () => {
    const headers = [
      "Title",
      "Creator",
      "Type",
      "Published Date",
      "Views",
      "Shares",
      "Revenue",
      "Engagement Rate",
      "New Users",
      "CTR",
      "Avg Watch Time",
      "Completion Rate",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredContent.map((content) =>
        [
          `"${content.title}"`,
          `"${content.creator}"`,
          content.type,
          new Date(content.publishedAt).toLocaleDateString(),
          content.views,
          content.shares,
          content.revenue,
          `${content.engagementRate}%`,
          content.newUsers,
          `${content.ctr}%`,
          formatTime(content.avgWatchTime),
          `${content.completionRate}%`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "content_analytics.csv";
    link.click();
  };

  const getContentIcon = (type: PostType) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4 text-blue-500" />;
      case "article":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "listicle":
        return <ListFilter className="h-4 w-4 text-purple-500" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4 text-orange-500" />;
      case "poll":
        return <Heart className="h-4 w-4 text-red-500" />;
    }
  };

  const formatMetric = (value: number, prefix = "") => {
    if (value >= 1000000) {
      return `${prefix}${(value / 1000000).toFixed(2)}m`;
    }
    if (value >= 1000) {
      return `${prefix}${(value / 1000).toFixed(1)}k`;
    }
    return `${prefix}${value}`;
  };

  return (
    <div className="space-y-6">
      {/* Content Type Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Content Performance</h3>
          <div className="text-sm text-gray-500">
            Total Posts: {formatNumber(284500)}
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={contentTypeData}
              layout="vertical"
              margin={{ top: 0, right: 30, bottom: 0, left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                axisLine={true}
                tickLine={true}
                fontSize={12}
                tickFormatter={(value) => formatNumber(value)}
                domain={[0, 600000]}
                ticks={[0, 150000, 300000, 450000, 600000]}
              />
              <YAxis
                dataKey="type"
                type="category"
                axisLine={false}
                tickLine={false}
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [formatNumber(value), selectedMetric === "views" ? "Views" : "Revenue"]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '8px'
                }}
              />
              <Bar
                dataKey={selectedMetric}
                fill="#FF0000"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Header with back button when filtering */}
      {(selectedCreator || selectedType) && (
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Content
          </Button>
          <h2 className="text-xl font-semibold">
            {selectedCreator && `Content by ${selectedCreator}`}
            {selectedType &&
              `${
                selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
              } Content`}
          </h2>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by title, creator, URL, or keywords..."
            value={contentSearch}
            onChange={(e) => dispatch(setContentSearch(e.target.value))}
            className="w-80"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Content Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["article", "video", "listicle", "quiz", "poll"].map(
                (type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={contentFilters.postTypes.includes(
                      type as PostType
                    )}
                    onCheckedChange={(checked: boolean) => {
                      dispatch(
                        setContentFilters({
                          ...contentFilters,
                          postTypes: checked
                            ? [...contentFilters.postTypes, type as PostType]
                            : contentFilters.postTypes.filter(
                                (t: PostType) => t !== type
                              ),
                        })
                      );
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </DropdownMenuCheckboxItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("publishedAt")}
                >
                  <Calendar className="h-4 w-4" />
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("views")}
                >
                  <Eye className="h-4 w-4" />
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("shares")}
                >
                  <Send className="h-4 w-4" />
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("revenue")}
                >
                  <DollarSign className="h-4 w-4" />
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("engagementRate")}
                >
                  <Heart className="h-4 w-4" />
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("newUsers")}
                >
                  <Users className="h-4 w-4" />
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("ctr")}
                >
                  <MousePointerClick className="h-4 w-4" />
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("avgWatchTime")}
                >
                  <Clock className="h-4 w-4" />
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("completionRate")}
                >
                  <CheckCircle className="h-4 w-4" />
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContent.slice(0, rowsPerPage).map((content) => (
              <TableRow key={content.id}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getContentIcon(content.type)}</div>
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate.navigate(`/analytics/content/${content.id}`);
                      }}
                    >
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-[#FF0000] flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {content.title}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setSelectedCreator(content.creator));
                        }}
                        className="text-sm text-gray-500 hover:text-[#FF0000]"
                      >
                        {content.creator}
                      </button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(content.publishedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{formatMetric(content.views)}</TableCell>
                <TableCell>{formatMetric(content.shares)}</TableCell>
                <TableCell>{formatMetric(content.revenue, "$")}</TableCell>
                <TableCell>{content.engagementRate.toFixed(1)}%</TableCell>
                <TableCell>{formatMetric(content.newUsers)}</TableCell>
                <TableCell>{content.ctr.toFixed(1)}%</TableCell>
                <TableCell>{formatTime(content.avgWatchTime)}</TableCell>
                <TableCell>{content.completionRate.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage.toString()}
            onChange={(e) =>
              dispatch(
                setRowsPerPage(parseInt(e.target.value) as RowsPerPage)
              )
            }
            className="border rounded px-2 py-1"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="ml-4">
            Showing {Math.min(rowsPerPage, filteredContent.length)} of{" "}
            {filteredContent.length} items
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={rowsPerPage >= filteredContent.length}
            onClick={() => {
              const newRowsPerPage = Math.min(
                rowsPerPage * 2,
                100
              ) as RowsPerPage;
              dispatch(setRowsPerPage(newRowsPerPage));
            }}
          >
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ContentPerformance };

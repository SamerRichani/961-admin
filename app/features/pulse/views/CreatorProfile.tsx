"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  Instagram,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setPage } from "@/components/sidebar/redux/navigationSlice";
import {
  setSelectedCreator,
  setModerateOpen,
  setBoostOpen,
  removeBoost,
  removeModeration,
  resetModerationState,
  removeModerationCase,
} from "@/app/features/pulse/redux/creatorProfileSlice";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatMoney, formatNumber } from "@/lib/format";
import {

  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { format } from "date-fns";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { ModerateDialog } from '@/app/features/pulse/components/CreatorsPage/ModerateDialog';
import { BoostDialog } from '@/app/features/pulse/components/CreatorsPage/BoostDialog';

// Add a helper function for the countdown
function getTimeRemaining(endDate: string) {
  const now = new Date();
  const end = new Date(endDate);

  if (now >= end) return null;

  const days = differenceInDays(end, now);
  const hours = differenceInHours(end, now) % 24;
  const minutes = differenceInMinutes(end, now) % 60;

  return { days, hours, minutes };
}

// Add a countdown component
function TimeRemaining({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endDate);
      setTimeLeft(remaining);
      if (!remaining) clearInterval(timer);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return null;

  return (
    <span className="text-xs text-gray-500">
      ({timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m remaining)
    </span>
  );
}

export function CreatorProfile() {
  const dispatch = useDispatch();
  const { creatorId } = useSelector((state: RootState) => state.navigation);
  const {
    selectedCreator,
    revenueMetrics,
    revenueData,
    audienceData,
    ageData,
    genderData,
    isModerateOpen,
    isBoostOpen,
    moderationAction,
    moderationDuration,
    moderationReason,
    boostLevel,
    boostDuration,
  } = useSelector((state: RootState) => state.creatorProfile);
  const [isLoading, setIsLoading] = useState(true);

  console.log("CreatorProfile mounted with ID:", creatorId);

  useEffect(() => {
    console.log("useEffect triggered with creatorId:", creatorId);

    const fetchCreatorData = async () => {
      console.log("Starting fetchCreatorData with ID:", creatorId);

      if (!creatorId) {
        console.error("No creator ID found");
        return;
      }

      try {
        setIsLoading(true);
        console.log(
          "Fetching creator data from:",
          `${process.env.NEXT_PUBLIC_API_URL}/pulse/creators/${creatorId}`
        );
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pulse/creators/${creatorId}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
          });
          throw new Error(
            `Failed to fetch creator data: ${response.statusText}`
          );
        }

        const creatorData = await response.json();
        console.log("API Response:", creatorData);

        if (!creatorData) {
          console.error("No data in response");
          throw new Error("No data in response");
        }

        dispatch(setSelectedCreator(creatorData));
        console.log("Creator data set in Redux store:", creatorData);
      } catch (error) {
        console.error("Error fetching creator data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatorData();
  }, [creatorId, dispatch]);

  const handleBack = () => {
    dispatch(setPage("pulse/creators"));
  };

  const handleViewAllContent = () => {
    dispatch(setPage("pulse/creators/content"));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading creator profile...</div>;
  }

  if (!selectedCreator) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Creator not found</div>
        <Button variant="outline" onClick={handleBack}>
          Back to Creators
        </Button>
      </div>
    );
  }

  const totalRevenue = revenueData.reduce(
    (sum, month) => sum + month.ads + month.bookings + month.deals,
    0
  );

  // Add new metrics display
  const liveMetrics = selectedCreator.liveMetrics;
  const engagementMetrics = selectedCreator.engagementMetrics;
  const contentMetrics = selectedCreator.contentMetrics;
  const historicalMetrics = selectedCreator.historicalMetrics;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <Button variant="ghost" onClick={handleBack} className="mb-4 sm:mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Creators
        </Button>

        {/* Header */}
        <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm mb-6 sm:mb-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex flex-col items-center sm:items-start gap-4 sm:order-1">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage src={selectedCreator.avatarUrl} />
                  <AvatarFallback>
                    {selectedCreator.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 sm:order-2">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {selectedCreator.name}
                  </h1>
                  <span className="text-gray-500">
                    @{selectedCreator.username}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 mt-4">
                  {selectedCreator.status === "pending" && (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Pending Approval
                    </span>
                  )}
                  {selectedCreator.isDemonetized && (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Demonetized
                        </span>
                        {selectedCreator.moderationHistory
                          .filter(
                            (action) =>
                              action.action === "demonetize" &&
                              action.duration > 0
                          )
                          .map((action, index) => (
                            <TimeRemaining
                              key={index}
                              endDate={new Date(
                                new Date(action.date).getTime() +
                                  action.duration * 24 * 60 * 60 * 1000
                              ).toISOString()}
                            />
                          ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (selectedCreator) {
                            dispatch(
                              removeModeration(selectedCreator._id) as any
                            );
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  {selectedCreator.isShadowbanned && (
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          Shadowbanned
                        </span>
                        {selectedCreator.moderationHistory
                          .filter(
                            (action) =>
                              action.action === "shadowban" &&
                              action.duration > 0
                          )
                          .map((action, index) => (
                            <TimeRemaining
                              key={index}
                              endDate={new Date(
                                new Date(action.date).getTime() +
                                  action.duration * 24 * 60 * 60 * 1000
                              ).toISOString()}
                            />
                          ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (selectedCreator) {
                            dispatch(
                              removeModeration(selectedCreator._id) as any
                            );
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  {selectedCreator.currentBoost && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Boosted {selectedCreator.currentBoost.level}x
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (selectedCreator) {
                            dispatch(removeBoost(selectedCreator._id) as any);
                          }
                        }}
                      >
                        Remove Boost
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{selectedCreator.bio}</p>

                {/* Social Links */}
                {selectedCreator.application?.socialLinks && (
                  <div className="flex gap-4 mb-4 justify-center sm:justify-start">
                    {selectedCreator.application.socialLinks.instagram && (
                      <a
                        href={selectedCreator.application.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 items-center sm:items-start sm:order-3">
                <Button
                  variant="outline"
                  onClick={() => dispatch(setBoostOpen(true))}
                  className="w-full sm:w-auto"
                  disabled={
                    selectedCreator.isShadowbanned ||
                    selectedCreator.isDemonetized ||
                    !!selectedCreator.currentBoost ||
                    selectedCreator.moderationHistory?.some(
                      (action) =>
                        action.action === "suspend" &&
                        new Date(action.date).getTime() +
                          action.duration * 24 * 60 * 60 * 1000 >
                          Date.now()
                    )
                  }
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {!!selectedCreator.currentBoost
                    ? "Already Boosted"
                    : selectedCreator.isShadowbanned ||
                      selectedCreator.isDemonetized ||
                      selectedCreator.moderationHistory?.some(
                        (action) =>
                          action.action === "suspend" &&
                          new Date(action.date).getTime() +
                            action.duration * 24 * 60 * 60 * 1000 >
                            Date.now()
                      )
                    ? "Cannot Boost While Moderated"
                    : "Boost"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => dispatch(setModerateOpen(true))}
                  className="w-full sm:w-auto"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {selectedCreator.isDemonetized ||
                  selectedCreator.isShadowbanned
                    ? "Add Moderation"
                    : "Moderate"}
                </Button>
              </div>
            </div>

            {/* Application Details for Pending Creators */}
            {selectedCreator.status === "pending" &&
              selectedCreator.application && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Application Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium">
                        {selectedCreator.application.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Target Audience</p>
                      <p className="font-medium">
                        {selectedCreator.application.targetAudience}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCreator.application.topics.map(
                          (topic: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {topic}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Content Formats</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCreator.application.contentFormats.map(
                          (format: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {format}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">
                        {selectedCreator.application.experience}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">
                        Reason for Joining
                      </p>
                      <p className="font-medium">
                        {selectedCreator.application.reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Moderation History */}
            {selectedCreator.moderationHistory &&
              selectedCreator.moderationHistory.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Moderation History
                  </h3>
                  <div className="space-y-2">
                    {selectedCreator.moderationHistory.map((action, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2 sm:gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <span className="capitalize font-medium">
                            {action.action}
                          </span>
                          <span className="text-gray-500">
                            {action.duration === 0 ? (
                              "Permanent"
                            ) : (
                              <span>
                                {action.duration} days
                                <TimeRemaining
                                  endDate={new Date(
                                    new Date(action.date).getTime() +
                                      action.duration * 24 * 60 * 60 * 1000
                                  ).toISOString()}
                                />
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500">
                            {format(new Date(action.date), "MMM d, yyyy")}
                          </span>
                          <span className="text-gray-500">{action.reason}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              if (selectedCreator) {
                                dispatch(
                                  removeModerationCase({
                                    creatorId: selectedCreator._id,
                                    index,
                                  }) as any
                                );
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Live Metrics */}
        {liveMetrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Active Users
              </h3>
              <p className="text-2xl font-bold">
                {formatNumber(liveMetrics.activeUsers)}
              </p>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Web: {formatNumber(liveMetrics.webSessions)}</span>
                <span>Mobile: {formatNumber(liveMetrics.mobileSessions)}</span>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Today's Revenue
              </h3>
              <p className="text-2xl font-bold">
                {formatMoney(liveMetrics.revenueToday)}
              </p>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Ads: {formatMoney(liveMetrics.adRevenue)}</span>
                <span>Coins: {formatMoney(liveMetrics.coinRevenue)}</span>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">App Metrics</h3>
              <p className="text-2xl font-bold">
                +
                {formatNumber(
                  liveMetrics.installations - liveMetrics.uninstalls
                )}
              </p>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Installs: {formatNumber(liveMetrics.installations)}</span>
                <span>Uninstalls: {formatNumber(liveMetrics.uninstalls)}</span>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Engagement Rate
              </h3>
              <p className="text-2xl font-bold">
                {((engagementMetrics?.completionRate || 0) * 100).toFixed(1)}%
              </p>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>
                  Comments: {(engagementMetrics?.commentRate || 0).toFixed(2)}%
                </span>
                <span>
                  Shares: {(engagementMetrics?.shareRate || 0).toFixed(2)}%
                </span>
              </div>
            </Card>
          </div>
        )}

        {/* Engagement Metrics */}
        {engagementMetrics && (
          <Card className="p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">Engagement Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  Watch Time
                </h3>
                <p className="text-2xl font-bold">
                  {engagementMetrics.averageWatchTime}s
                </p>
                <p className="text-sm text-gray-500">Average per video</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  Completion Rate
                </h3>
                <p className="text-2xl font-bold">
                  {(engagementMetrics.completionRate * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">
                  Average video completion
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  Subscriber Growth
                </h3>
                <p className="text-2xl font-bold">
                  {(engagementMetrics.subscriberGrowth * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Monthly growth rate</p>
              </div>
            </div>
          </Card>
        )}

        {/* Top Content */}
        {contentMetrics && contentMetrics.length > 0 && (
          <Card className="p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Top Performing Content
            </h2>
            <div className="space-y-4">
              {contentMetrics.map((content) => (
                <div
                  key={content._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{content.title}</h3>
                    <p className="text-sm text-gray-500">{content.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatNumber(content.views)} views
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatNumber(content.engagement)} engagements
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Historical Metrics Chart */}
        {historicalMetrics && historicalMetrics.length > 0 && (
          <Card className="p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Historical Performance
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="views"
                    stroke="#FF0000"
                    name="Views"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00FF00"
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-4 sm:mb-8">
          {revenueMetrics.map((metric) => (
            <Card key={metric.label} className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">{metric.label}</h3>
              <Tabs defaultValue="month" className="w-full">
                <TabsList className="w-full mb-4 grid grid-cols-3">
                  <TabsTrigger value="month" className="flex-1">
                    This Month
                  </TabsTrigger>
                  <TabsTrigger value="year" className="flex-1">
                    This Year
                  </TabsTrigger>
                  <TabsTrigger value="all" className="flex-1">
                    All Time
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="month">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="text-2xl sm:text-3xl font-bold">
                      {formatMoney(metric.thisMonth)}
                    </div>
                    <div className="text-sm text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />+{metric.change}% from
                      last month
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="year">
                  <div className="text-2xl sm:text-3xl font-bold">
                    {formatMoney(metric.thisYear)}
                  </div>
                </TabsContent>
                <TabsContent value="all">
                  <div className="text-2xl sm:text-3xl font-bold">
                    {formatMoney(metric.allTime)}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          ))}
        </div>
      </div>

      <ModerateDialog
        creator={selectedCreator}
        open={isModerateOpen}
        onOpenChange={(open) => {
          if (!open) {
            dispatch(resetModerationState());
          }
          dispatch(setModerateOpen(open));
        }}
      />

      <BoostDialog
        creator={selectedCreator}
        open={isBoostOpen}
        onOpenChange={(open) => dispatch(setBoostOpen(open))}
      />
    </div>
  );
}

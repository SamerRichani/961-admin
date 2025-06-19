"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setPage } from "@/components/sidebar/redux/navigationSlice";

import { DashboardPage } from "@/app/features/dashboard/views/DashboardPage";

import { LiveMetrics } from "@/app/features/analytics/views/LiveMetrics";
import { OverviewMetrics } from "@/app/features/analytics/views/OverviewMetrics";
import { UserDemographicsAndBehavior } from "@/app/features/analytics/views/UserDemographicsAndBehavior";
import { RevenueAnalytics } from "@/app/features/analytics/views/RevenueAnalytics";
import { MiniAppsAnalytics } from "@/app/features/analytics/views/MiniAppsAnalytics";
import { ContentPerformance } from "@/app/features/analytics/views/ContentPerformance";
import { TabsAnalytics } from "@/app/features/analytics/views/TabsAnalytics";

import { ContentDetails } from "@/app/features/analytics/views/ContentDetails";

import { RevenuePage } from "@/app/features/finance/views/RevenuePage";
import { ReceivablesPage } from "@/app/features/finance/views/ReceivablesPage";
import { PayablesPage } from "@/app/features/finance/views/PayablesPage";
import { WalletsPage } from "@/app/features/finance/views/WalletsPage";
import { TransactionsPage } from "@/app/features/finance/views/TransactionsPage";

import { CreatorsPage } from "@/app/features/pulse/views/CreatorsPage";
import { CreatorContent } from "@/app/features/pulse/views/CreatorContent";
import { ContentPage } from "@/app/features/pulse/views/ContentPage";
import { CreatorProfile } from "@/app/features/pulse/views/CreatorProfile";
import TabsPage from "@/app/features/pulse/views/TabsPage";
import EngagementSettings from "@/app/features/pulse/views/EngagementSettings";

import { BloodPage } from "@/app/features/apps/views/BloodPage";
import { CoinsPage } from "@/app/features/apps/views/CoinsPage";
import { PointsPage } from "@/app/features/apps/views/PointsPage";
import { EventsPage } from "@/app/features/apps/views/EventsPage";

import { SupportDashboard } from "@/app/features/support/views/SupportDashboard";

import { UsersPage } from "@/app/features/users/views/UsersPage";
import { UserProfile } from "@/app/features/users/views/UserProfile";

import { ModerationPage } from "@/app/features/moderation/views/ModerationPage";

import { SharesAndPricing } from "@/app/features/investor/views/SharesAndPricing";
import { InvestorDirectory } from "@/app/features/investor/views/InvestorDirectory";
import { Polls } from "@/app/features/investor/views/VotingAndPolls";
import { Data } from "@/app/features/investor/views/Data";
import { UpdatesAndCommunications } from "@/app/features/investor/views/UpdatesAndCommunications";
import { OverviewView } from "@/app/features/flex/views/OverviewView";
import { FlexersList } from "@/app/features/flex/views/FlexersList";
import { ApplicationsList } from "@/app/features/flex/views/ApplicationsList";
import { BlocksList } from "@/app/features/flex/views/BlocksList";
import { TasksList } from "@/app/features/flex/views/TasksList";
import { StationsList } from "@/app/features/flex/views/StationsList";
import { PricingView } from "@/app/features/flex/views/PricingView";
import { SettingsView } from "@/app/features/flex/views/SettingsView";

import VATPage from "@/app/features/finance/views/VATPage";

export default function Home() {
  const currentPage = useSelector(
    (state: RootState) => state.navigation.currentPage
  );
  const contentId = useSelector(
    (state: RootState) => state.navigation.contentId
  );
  const creatorId = useSelector(
    (state: RootState) => state.navigation.creatorId
  );
  const creators = useSelector((state: RootState) => state.creators.creators);
  const dispatch = useDispatch();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;

      // case 'finance':
      //   return <FinancePage />
      case "finance/revenue":
        return <RevenuePage />;
      case "finance/receivables":
        return <ReceivablesPage />;
      case "finance/payables":
        return <PayablesPage />;
      case "finance/wallets":
        return <WalletsPage />;
      case "finance/transactions":
        return <TransactionsPage />;
      case "finance/vat":
        return <VATPage />;

      // case 'pulse':
      //   return <PulsePage />
      case "pulse/creators":
        return <CreatorsPage />;
      case "pulse/creators/[id]": 
        return <CreatorProfile />;
      case "pulse/creators/content":
        return <CreatorContent />;
      case "pulse/content":
        return <ContentPage />;
      case "pulse/tabs":
        return <TabsPage />;
      case "pulse/engagement":
        return <EngagementSettings />;

      // case 'apps':
      //   return <AppsPage />
      case "apps/blood":
        return <BloodPage />;
      case "apps/coins":
        return <CoinsPage />;
      case "apps/points":
        return <PointsPage />;
      case "apps/events":
        return <EventsPage />;

      case "flex":
        return <OverviewView />;
      case "flex/flexers":
        return <FlexersList />;
      case "flex/applications":
        return <ApplicationsList />;
      case "flex/blocks":
        return <BlocksList />;
      case "flex/tasks":
        return <TasksList />;
      case "flex/stations":
        return <StationsList />;
      case "flex/pricing":
        return <PricingView />;
      case "flex/settings":
        return <SettingsView />;

      case "investor":
        return <SharesAndPricing />;
      case "investor/directory":
        return <InvestorDirectory />;
      case "investor/updates":
        return <UpdatesAndCommunications />;
      case "investor/polls":
        return <Polls />;
      case "investor/data":
        return <Data />;

      case "moderation":
        return <ModerationPage />;

      case "support":
        return <SupportDashboard />;
      case "users":
        return <UsersPage />;
      case "users/[id]":
        return <UserProfile/>;

      case "analytics":
        return <LiveMetrics />;
      case "analytics/overview":
        return <OverviewMetrics />;
      case "analytics/user":
        return <UserDemographicsAndBehavior />;
      case "analytics/revenue":
        return <RevenueAnalytics />;
      case "analytics/apps":
        return <MiniAppsAnalytics />;
      case "analytics/content":
        return <ContentPerformance />;
      case "analytics/tabs":
        return <TabsAnalytics />;
      case "analytics/content/[id]":
        return <ContentDetails id={contentId || "default"} />;

      default:
        return <DashboardPage />;
    }
  };

  return <div className="mt-16 lg:mt-0">{renderPage()}</div>;
}

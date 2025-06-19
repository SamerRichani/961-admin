import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../app/features/users/redux/usersSlice';
import teamReducer from '../app/features/users/redux/teamSlice';
import analyticsReducer from '../app/features/analytics/redux/analyticsSlice';
import appsReducer from '../app/features/apps/redux/appsSlice';
import bloodReducer from '../app/features/apps/redux/bloodSlice';
import coinsReducer from '../app/features/apps/redux/coinsSlice';
import pointsReducer from '../app/features/apps/redux/pointsSlice';
import financeReducer from '../app/features/finance/redux/financeSlice';
import transactionsReducer from '../app/features/finance/redux/transactionsSlice';
import walletsReducer from '../app/features/finance/redux/walletsSlice';
import receivablesReducer from '../app/features/finance/redux/receivablesSlice';
import payablesReducer from '../app/features/finance/redux/payablesSlice';
import flexReducer from '../app/features/flex/redux/flexSlice';
import blocksReducer from '../app/features/flex/redux/blocksSlice';
import flexersReducer from '../app/features/flex/redux/flexersSlice';
import flexSettingsReducer from '../app/features/flex/redux/flexSettingsSlice';
import flexPricingReducer from '../app/features/flex/redux/flexPricingSlice';
import stationsReducer from '../app/features/flex/redux/stationsSlice';
import tasksReducer from '../app/features/flex/redux/tasksSlice';
import applicationsReducer from '../app/features/flex/redux/applicationsSlice';
import sharesReducer from '../app/features/investor/redux/sharesSlice';
import pollsReducer from '../app/features/investor/redux/pollsSlice';
import updatesReducer from '../app/features/investor/redux/updatesSlice';
import investorsReducer from '../app/features/investor/redux/investorsSlice';
import investorAnalyticsReducer from '../app/features/investor/redux/analyticsSlice';
import moderationReducer from '../app/features/moderation/redux/moderationSlice';
import contentReducer from '../app/features/pulse/redux/contentSlice';
import tabsReducer from '../app/features/pulse/redux/tabsSlice';
import creatorApplicationsReducer from '../app/features/pulse/redux/creatorApplicationsSlice';
import creatorsReducer from '../app/features/pulse/redux/creatorsSlice';
import creatorProfileReducer from '../app/features/pulse/redux/creatorProfileSlice';
import creatorContentReducer from '../app/features/pulse/redux/creatorContentSlice';
import engagementSettingsReducer from '../app/features/pulse/redux/engagementSettingsSlice';
import supportReducer from '../app/features/support/redux/supportSlice';
import dashboardReducer from '../app/features/dashboard/redux/dashboardSlice';
import userDemographicsReducer from '../app/features/analytics/redux/userDemographicsSlice';
import navigationReducer from '../components/sidebar/redux/navigationSlice';
import revenueAnalyticsReducer from '../app/features/analytics/redux/revenueAnalyticsSlice';
import topPerformersReducer from '@/app/features/finance/redux/topPerformersSlice';
import revenueChartsReducer from '@/app/features/finance/redux/revenueChartsSlice';
import vatReducer from '@/app/features/finance/redux/VATSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    team: teamReducer,
    analytics: analyticsReducer,
    apps: appsReducer,
    blood: bloodReducer,
    coins: coinsReducer,
    points: pointsReducer,
    finance: financeReducer,
    transactions: transactionsReducer,
    wallets: walletsReducer,
    receivables: receivablesReducer,
    payables: payablesReducer,
    flex: flexReducer,
    blocks: blocksReducer,
    flexers: flexersReducer,
    flexSettings: flexSettingsReducer,
    flexPricing: flexPricingReducer,
    stations: stationsReducer,
    tasks: tasksReducer,
    applications: applicationsReducer,
    shares: sharesReducer,
    polls: pollsReducer,
    updates: updatesReducer,
    investors: investorsReducer,
    investorAnalytics: investorAnalyticsReducer,
    moderation: moderationReducer,
    content: contentReducer,
    tabs: tabsReducer,
    creatorApplications: creatorApplicationsReducer,
    creators: creatorsReducer,
    creatorProfile: creatorProfileReducer,
    creatorContent: creatorContentReducer,
    engagementSettings: engagementSettingsReducer,
    support: supportReducer,
    dashboard: dashboardReducer,
    userDemographics: userDemographicsReducer,
    navigation: navigationReducer,
    revenueAnalytics: revenueAnalyticsReducer,
    topPerformers: topPerformersReducer,
    revenueCharts: revenueChartsReducer,
    vat: vatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
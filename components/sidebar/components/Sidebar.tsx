"use client";

import {
  BarChart3,
  LineChart,
  Rocket,
  Users,
  Activity,
  Apple as Apps,
  HeadphonesIcon,
  DollarSign,
  ScrollText,
  Star,
  Box,
  MessageSquare,
  LayoutGrid,
  FileText,
  Menu,
  X,
  Coins,
  CircleDollarSign,
  HeartPulse,
  TicketCheck,
  Wallet,
  ArrowLeftRight,
  HandCoins,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { UserProfile } from "./UserProfile";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "@/components/sidebar/redux/navigationSlice";
import { RootState } from "@/redux/store";
import type { Page } from "@/components/sidebar/redux/navigationSlice";

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", page: "dashboard" as Page },
  { icon: LineChart, label: "Analytics", page: "analytics" as Page },
  { icon: Rocket, label: "Investor", page: "investor" as Page },
  {
    icon: DollarSign,
    label: "Finance",
    page: "finance" as Page,
    subItems: [
      { icon: ShieldCheck, label: "Revenue", page: "finance/revenue" as Page },
      {
        icon: DollarSign,
        label: "Receivables",
        page: "finance/receivables" as Page,
      },
      { icon: HandCoins, label: "Payables", page: "finance/payables" as Page },
      { icon: Wallet, label: "Wallets", page: "finance/wallets" as Page },
      {
        icon: ArrowLeftRight,
        label: "Transactions",
        page: "finance/transactions" as Page,
      },
      {
        icon: ArrowLeftRight,
        label: "VAT",
        page: "finance/vat" as Page,
      },
    ],
  },
  { icon: Users, label: "Users", page: "users" as Page },
  {
    icon: Activity,
    label: "Pulse",
    page: "pulse" as Page,
    subItems: [
      { icon: Star, label: "Creators", page: "pulse/creators" as Page },
      { icon: FileText, label: "Content", page: "pulse/content" as Page },
      { icon: LayoutGrid, label: "Tabs", page: "pulse/tabs" as Page },
      {
        icon: MessageSquare,
        label: "Engagement",
        page: "pulse/engagement" as Page,
      },
    ],
  },
  {
    icon: Apps,
    label: "Apps",
    page: "apps" as Page,
    subItems: [
      { icon: HeartPulse, label: "Blood", page: "apps/blood" as Page },
      { icon: CircleDollarSign, label: "Coins", page: "apps/coins" as Page },
      { icon: Coins, label: "Points", page: "apps/points" as Page },
      { icon: TicketCheck, label: "Events", page: "apps/events" as Page },
    ],
  },
  { icon: Truck, label: "Flex", page: "flex" as Page },
  { icon: Box, label: "Moderation", page: "moderation" as Page },
  {
    icon: HeadphonesIcon,
    label: "Support",
    page: "support" as Page,
  },
  { icon: ScrollText, label: "Logs" },
];

export function Sidebar() {
  const dispatch = useDispatch();
  const currentPage = useSelector(
    (state: RootState) => state.navigation.currentPage
  );
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);


  const handleNavigation = (page: Page) => {
    dispatch(setPage(page));
    setIsMobileOpen(false);
  };

  const handleItemClick = (page: string) => {
    const item = sidebarItems.find(
      (item) => item.label.toLowerCase() === page.toLowerCase()
    );
    if (item?.subItems) {
      setExpandedItem(expandedItem === page ? null : page);
    } else if (item?.page) {
      setExpandedItem(null);
      handleNavigation(item.page);
    }
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b z-50 flex items-center justify-between px-4">
        <span className="font-black text-[#FF0000] text-3xl theme-font">961</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-full md:w-52 bg-white dark:bg-gray-800 border-r transform transition-transform duration-200 ease-in-out flex flex-col",
          isMobileOpen
            ? "translate-y-16"
            : "-translate-y-full md:translate-y-0 md:translate-x-0"
        )}
      >
        <div className="hidden md:flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="font-black text-[#FF0000] text-2xl theme-font">961</span>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto md:mt-0 mt-4">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              expanded={expandedItem === item.label}
              active={currentPage === item.page}
              onClick={() => handleItemClick(item.label)}
              subItems={item.subItems?.map((subItem) => ({
                ...subItem,
                active: currentPage === subItem.page,
                onClick: () => subItem.page && handleNavigation(subItem.page),
              }))}
            />
          ))}
        </nav>
        <div className="border-t p-4 mt-auto">
          <UserProfile
            name="John Doe"
            avatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&dpr=2&q=80"
            avatarFallback="JD"
          />
        </div>
      </div>
    </>
  );
}

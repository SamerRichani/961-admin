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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: LineChart, label: "Analytics", href: "/analytics" },
  { icon: Rocket, label: "Investor", href: "/investor" },
  {
    icon: DollarSign,
    label: "Finance",
    href: "/finance/revenue",
    subItems: [
      { icon: ShieldCheck, label: "Revenue", href: "/finance/revenue" },
      { icon: DollarSign, label: "Receivables", href: "/finance/receivables" },
      { icon: HandCoins, label: "Payables", href: "/finance/payables" },
      { icon: Wallet, label: "Wallets", href: "/finance/wallets" },
      { icon: ArrowLeftRight, label: "Transactions", href: "/finance/transactions" },
      { icon: ArrowLeftRight, label: "VAT", href: "/finance/vat" },
    ],
  },
  { icon: Users, label: "Users", href: "/users" },
  {
    icon: Activity,
    label: "Pulse",
    href: "/pulse/creators",
    subItems: [
      { icon: Star, label: "Creators", href: "/pulse/creators" },
      { icon: FileText, label: "Content", href: "/pulse/content" },
      { icon: LayoutGrid, label: "Tabs", href: "/pulse/tabs" },
      { icon: MessageSquare, label: "Engagement", href: "/pulse/engagement" },
    ],
  },
  {
    icon: Apps,
    label: "Apps",
    href: "/apps/coins",
    subItems: [
      { icon: CircleDollarSign, label: "Coins", href: "/apps/coins" },
      { icon: Coins, label: "Points", href: "/apps/points" },
      { icon: TicketCheck, label: "Events", href: "/apps/events" },
    ],
  },
  { icon: Truck, label: "Flex", href: "/flex" },
  { icon: Box, label: "Moderation", href: "/moderation" },
  {
    icon: HeadphonesIcon,
    label: "Support",
    href: "/support",
  },
  { icon: ScrollText, label: "Logs" },
];

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleItemClick = (item: typeof sidebarItems[0]) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.label ? null : item.label);
    } else {
      setExpandedItem(null);
      setIsMobileOpen(false);
      if (onNavClick) onNavClick();
    }
  };

  const isActive = (href?: string, subItems?: any[]) => {
    if (!href) return false;
    if (pathname === href) return true;
    if (subItems) {
      return subItems.some((sub: any) => pathname === sub.href);
    }
    return false;
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b z-50 flex items-center justify-between px-4">
        <img src="/logo.png" alt="961 Logo" className="h-8 w-auto" />
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
            <img src="/logo.png" alt="961 Logo" className="h-8 w-auto" />
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto md:mt-0 mt-4">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              expanded={expandedItem === item.label}
              href={item.subItems ? undefined : item.href}
              active={isActive(item.href, item.subItems)}
              onClick={() => handleItemClick(item)}
              subItems={item.subItems?.map((subItem) => ({
                ...subItem,
                active: pathname === subItem.href,
                onClick: () => {
                  setIsMobileOpen(false);
                  if (onNavClick) onNavClick();
                },
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

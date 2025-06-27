"use client";

import { useDispatch, useSelector } from "react-redux";
import { TicketDetails } from "../components/TicketDetails";
import { TicketList } from "../components/TicketList";
import {
  type Ticket,
  mockTickets,
  topics,
} from "@/app/features/support/type";
import {
  Search,
  Filter,
  MessagesSquare,
  HelpCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/redux/store";
import {
  setSearchQuery,
  setTicketType,
  setSelectedTopics,
  setShowPending,
  updateTicket,
} from "@/app/features/support/redux/supportSlice";

// Create a mutable copy of mockTickets
let tickets = [...mockTickets];

export function SupportDashboard() {
  const dispatch = useDispatch();
  const {
    selectedTicket,
    searchQuery,
    ticketType,
    selectedTopics,
    showPending,
  } = useSelector((state: RootState) => state.support);

  const handleUpdateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    // Update mock data
    tickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, ...updates } : ticket
    );

    // Update Redux state
    dispatch(updateTicket({ ticketId, updates }));
  };

  const filteredTickets = tickets
    .filter((ticket) => {
      // Search filter
      const searchMatch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const typeMatch =
        ticketType === "all" ||
        (ticketType === "chat" && ticket.isLiveChat) ||
        (ticketType === "ticket" && !ticket.isLiveChat);

      // Topic filter
      const topicMatch =
        selectedTopics.length === 0 || selectedTopics.includes(ticket.topic);

      // Pending filter
      const pendingMatch = !showPending || ticket.status === "pending";

      return searchMatch && typeMatch && topicMatch && pendingMatch;
    })
    .sort((a, b) => {
      // Sort live chat first
      if (a.isLiveChat && !b.isLiveChat) return -1;
      if (!a.isLiveChat && b.isLiveChat) return 1;
      // Then by date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Ticket List Panel */}
      <div className="w-2/5 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-200 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="pl-9 h-8 text-sm"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Topic</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {topics.map((topic) => (
                  <DropdownMenuCheckboxItem
                    key={topic.id}
                    checked={selectedTopics.includes(topic.id)}
                    onCheckedChange={(checked: boolean) => {
                      dispatch(
                        setSelectedTopics(
                          checked
                            ? [...selectedTopics, topic.id]
                            : selectedTopics.filter((t) => t !== topic.id)
                        )
                      );
                    }}
                  >
                    {topic.name}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showPending}
                  onCheckedChange={(checked: boolean) =>
                    dispatch(setShowPending(checked))
                  }
                >
                  Pending Only
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Tabs
            value={ticketType}
            onValueChange={(value: any) =>
              dispatch(setTicketType(value as typeof ticketType))
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-xs flex items-center gap-1"
              >
                <MessagesSquare className="h-3 w-3" />
                Live Chat
              </TabsTrigger>
              <TabsTrigger
                value="ticket"
                className="text-xs flex items-center gap-1"
              >
                <HelpCircle className="h-3 w-3" />
                Tickets
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <TicketList tickets={filteredTickets} />
      </div>

      {/* Ticket Details Panel */}
      <div className="flex-1 overflow-hidden">
        {selectedTicket ? (
          <TicketDetails
            ticket={selectedTicket}
            onUpdateTicket={handleUpdateTicket}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Select a ticket to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}

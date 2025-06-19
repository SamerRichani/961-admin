import {
  type Ticket,
  statusColors,
  priorityColors,
} from "@/app/features/support/type";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MessagesSquare } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedTicket } from "@/app/features/support/redux/supportSlice";

interface TicketListProps {
  tickets: Ticket[];
}

export function TicketList({ tickets }: TicketListProps) {
  const dispatch = useDispatch();
  const selectedTicketId = useSelector(
    (state: RootState) => state.support.selectedTicket?.id
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={cn(
              "px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors",
              selectedTicketId === ticket.id && "bg-gray-50"
            )}
            onClick={() => dispatch(setSelectedTicket(ticket))}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">
                  {ticket.id}
                </span>
                {ticket.isLiveChat && (
                  <MessagesSquare className="h-3 w-3 text-emerald-500" />
                )}
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-xs font-medium",
                    statusColors[ticket.status].bg,
                    statusColors[ticket.status].text
                  )}
                >
                  {ticket.status.replace("-", " ")}
                </span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-xs font-medium",
                    priorityColors[ticket.priority].bg,
                    priorityColors[ticket.priority].text
                  )}
                >
                  {ticket.priority}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(ticket.createdAt), "MMM d, h:mm a")}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 text-sm mb-0.5">
              {ticket.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">
                {ticket.customerName}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {ticket.topic.replace("-", " ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

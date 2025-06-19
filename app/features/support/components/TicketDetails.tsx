"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type Ticket,
  type Message,
  type Note,
  quickReplies,
  type TicketStatus,
  type TicketPriority,
} from "@/app/features/support/type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format, formatDistanceToNow } from "date-fns";
import { Send, PlusCircle, MessageSquare, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/redux/store";
import {
  setNewMessage,
  setNewNote,
  setActiveTab,
  setTemplateDialogOpen,
  setEditingTemplate,
  addTemplate,
  updateTemplate,
  deleteTemplate,
} from "@/app/features/support/redux/supportSlice";

interface TicketDetailsProps {
  ticket: Ticket;
  onUpdateTicket?: (ticketId: string, updates: Partial<Ticket>) => void;
}

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: {
    id: string;
    title: string;
    message: string;
    editable: boolean;
  };
  onSave: (template: { title: string; message: string }) => void;
  onDelete?: () => void;
}

function TemplateDialog({
  open,
  onOpenChange,
  template,
  onSave,
  onDelete,
}: TemplateDialogProps) {
  const [title, setTitle] = useState(template?.title || "");
  const [message, setMessage] = useState(template?.message || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, message });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {template ? "Edit Template" : "Add Template"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Template title"
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Template message"
              required
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            {template?.editable && onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
            <Button type="submit" className="bg-[#FF0000] hover:bg-[#CC0000]">
              {template ? "Save Changes" : "Add Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const AGENTS = [
  { id: "AGT-001", name: "Sarah Tech" },
  { id: "AGT-002", name: "Mike Support" },
  { id: "AGT-003", name: "Emma Help" },
];

const STATUSES: TicketStatus[] = [
  "open",
  "in-progress",
  "pending",
  "resolved",
  "closed",
];
const PRIORITIES: TicketPriority[] = ["low", "medium", "high", "urgent"];

export function TicketDetails({ ticket, onUpdateTicket }: TicketDetailsProps) {
  const dispatch = useDispatch();
  const {
    newMessage,
    newNote,
    activeTab,
    isTemplateDialogOpen,
    editingTemplate,
    templates,
  } = useSelector((state: RootState) => state.support);

  const timeOpen = useMemo(() => {
    return formatDistanceToNow(new Date(ticket.createdAt), {
      addSuffix: false,
    });
  }, [ticket.createdAt]);

  const handleSendMessage = () => {
    // TODO: Implement send message
    dispatch(setNewMessage(""));
  };

  const handleAddNote = () => {
    // TODO: Implement add note
    dispatch(setNewNote(""));
  };

  const handleQuickReply = (message: string) => {
    dispatch(setNewMessage(message));
  };

  const handleEditTemplate = (template: (typeof quickReplies)[0]) => {
    dispatch(
      setEditingTemplate({
        ...template,
        editable: template.editable ?? false,
      })
    );
    dispatch(setTemplateDialogOpen(true));
  };

  const handleAddTemplate = () => {
    dispatch(setEditingTemplate(null));
    dispatch(setTemplateDialogOpen(true));
  };

  const handleSaveTemplate = (data: { title: string; message: string }) => {
    if (editingTemplate) {
      dispatch(
        updateTemplate({
          id: editingTemplate.id,
          ...data,
        })
      );
    } else {
      dispatch(addTemplate(data));
    }
    dispatch(setTemplateDialogOpen(false));
    dispatch(setEditingTemplate(null));
  };

  const handleDeleteTemplate = () => {
    if (editingTemplate) {
      dispatch(deleteTemplate(editingTemplate.id));
      dispatch(setTemplateDialogOpen(false));
      dispatch(setEditingTemplate(null));
    }
  };

  const handleAssign = (agentId: string) => {
    onUpdateTicket?.(ticket.id, { assignedTo: agentId });
  };

  const handleStatusChange = (status: TicketStatus) => {
    onUpdateTicket?.(ticket.id, { status });
  };

  const handlePriorityChange = (priority: TicketPriority) => {
    onUpdateTicket?.(ticket.id, { priority });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{ticket.title}</h2>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {ticket.assignedTo
                    ? AGENTS.find((a) => a.id === ticket.assignedTo)?.name ||
                      "Assign"
                    : "Assign"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Assign to</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {AGENTS.map((agent) => (
                  <DropdownMenuItem
                    key={agent.id}
                    onClick={() => handleAssign(agent.id)}
                  >
                    {agent.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {ticket.status.replace("-", " ")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STATUSES.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusChange(status)}
                  >
                    {status.replace("-", " ")}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{ticket.priority}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Update Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {PRIORITIES.map((priority) => (
                  <DropdownMenuItem
                    key={priority}
                    onClick={() => handlePriorityChange(priority)}
                  >
                    {priority}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Ticket {ticket.id}</span>
          <span>•</span>
          <span>Open: {timeOpen}</span>
          <span>•</span>
          <span>{ticket.customerName}</span>
          <span>•</span>
          <span>
            {format(new Date(ticket.createdAt), "MMM d, yyyy h:mm a")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {ticket.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-start gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => dispatch(setNewMessage(e.target.value))}
                placeholder="Type your message..."
                className="flex-1"
                rows={3}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-[#FF0000] hover:bg-[#CC0000]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 border-l border-gray-200 bg-gray-50">
          <Tabs
            value={activeTab}
            onValueChange={(v: any) =>
              dispatch(setActiveTab(v as "notes" | "templates"))
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="templates" className="flex-1">
                Templates
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="p-3">
              <div className="flex justify-end mb-3">
                <Button
                  variant="outline"
                  onClick={handleAddTemplate}
                  className="text-[#FF0000] hover:text-[#CC0000]"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </div>
              <div className="space-y-2">
                {templates.map((reply) => (
                  <div
                    key={reply.id}
                    className="flex items-start gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleQuickReply(reply.message)}
                  >
                    <div className="flex-1 truncate">
                      <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 inline-block" />
                      <div className="font-medium text-sm">{reply.title}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {reply.message}
                      </div>
                    </div>
                    {reply.editable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTemplate({
                            ...reply,
                            editable: reply.editable ?? false,
                          });
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <TemplateDialog
                open={isTemplateDialogOpen}
                onOpenChange={(open) => dispatch(setTemplateDialogOpen(open))}
                template={
                  editingTemplate
                    ? {
                        ...editingTemplate,
                        editable: editingTemplate.editable ?? false,
                      }
                    : undefined
                }
                onSave={handleSaveTemplate}
                onDelete={
                  editingTemplate?.editable ? handleDeleteTemplate : undefined
                }
              />
            </TabsContent>

            <TabsContent value="notes" className="p-3">
              <div className="space-y-3">
                {ticket.notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
                {/* Note Input */}
                <div className="pt-2">
                  <Textarea
                    value={newNote}
                    onChange={(e) => dispatch(setNewNote(e.target.value))}
                    placeholder="Add a note..."
                    className="mb-2"
                    rows={3}
                  />
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    variant="outline"
                    className="w-full"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isAgent = message.sender === "agent";

  return (
    <div className={cn("flex", isAgent ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isAgent
            ? "bg-white border border-gray-200"
            : "bg-[#FF0000] text-white"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{message.senderName}</span>
          <span className="text-xs opacity-75">
            {format(new Date(message.createdAt), "h:mm a")}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

interface NoteCardProps {
  note: Note;
}

function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="bg-white p-2 rounded-lg border border-gray-200 text-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-xs">{note.agentName}</span>
        <span className="text-xs text-gray-500">
          {format(new Date(note.createdAt), "MMM d, h:mm a")}
        </span>
      </div>
      <p className="text-xs text-gray-600">{note.content}</p>
    </div>
  );
}

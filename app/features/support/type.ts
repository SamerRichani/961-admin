import { type LucideIcon, Code, CreditCard, UserCog, HelpCircle, Lightbulb, Bug, AppWindow } from 'lucide-react';

export type TicketStatus = 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TopicCategory = 'technical' | 'billing' | 'account' | 'product' | 'feature' | 'bug' | 'app';

export interface Topic {
  id: TopicCategory;
  name: string;
  icon: LucideIcon;
  description: string;
}

export const topics: Topic[] = [
  {
    id: 'technical',
    name: 'Technical Support',
    icon: Code,
    description: 'Technical issues and troubleshooting',
  },
  {
    id: 'billing',
    name: 'Billing Issues',
    icon: CreditCard,
    description: 'Payment and subscription inquiries',
  },
  {
    id: 'account',
    name: 'Account Management',
    icon: UserCog,
    description: 'Account settings and access',
  },
  {
    id: 'product',
    name: 'Product Questions',
    icon: HelpCircle,
    description: 'Product usage and features',
  },
  {
    id: 'feature',
    name: 'Feature Requests',
    icon: Lightbulb,
    description: 'Suggestions for new features',
  },
  {
    id: 'bug',
    name: 'Bug Reports',
    icon: Bug,
    description: 'Report software issues',
  },
  {
    id: 'app',
    name: 'App-specific Support',
    icon: AppWindow,
    description: 'Mobile and desktop app support',
  },
];

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  topic: TopicCategory;
  status: TicketStatus;
  priority: TicketPriority;
  title: string;
  isLiveChat: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: Message[];
  notes: Note[];
}

export interface Message {
  id: string;
  ticketId: string;
  content: string;
  sender: 'customer' | 'agent';
  senderName: string;
  createdAt: string;
}

export interface Note {
  id: string;
  ticketId: string;
  content: string;
  agentId: string;
  agentName: string;
  createdAt: string;
}

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    customerId: 'CUS-001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    isLiveChat: true,
    topic: 'technical',
    status: 'open',
    priority: 'high',
    title: 'Cannot access dashboard',
    description: 'Getting a 404 error when trying to access the main dashboard.',
    createdAt: '2024-03-20T10:30:00Z',
    updatedAt: '2024-03-20T10:30:00Z',
    messages: [
      {
        id: 'MSG-001',
        ticketId: 'TKT-001',
        content: 'I keep getting a 404 error when trying to access the dashboard. This is urgent as I need to access my reports.',
        sender: 'customer',
        senderName: 'John Smith',
        createdAt: '2024-03-20T10:30:00Z',
      }
    ],
    notes: [
      {
        id: 'NOTE-001',
        ticketId: 'TKT-001',
        content: 'Checking access logs for user account.',
        agentId: 'AGT-001',
        agentName: 'Sarah Tech',
        createdAt: '2024-03-20T10:35:00Z',
      }
    ],
  },
  {
    id: 'TKT-002',
    customerId: 'CUS-002',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.wilson@example.com',
    isLiveChat: false,
    topic: 'billing',
    status: 'pending',
    priority: 'medium',
    title: 'Double charged for subscription',
    description: 'Found two identical charges for this month\'s subscription.',
    createdAt: '2024-03-19T15:45:00Z',
    updatedAt: '2024-03-20T09:15:00Z',
    assignedTo: 'AGT-002',
    messages: [
      {
        id: 'MSG-002',
        ticketId: 'TKT-002',
        content: 'I noticed I was charged twice for my subscription this month. Could you please help me resolve this?',
        sender: 'customer',
        senderName: 'Emma Wilson',
        createdAt: '2024-03-19T15:45:00Z',
      }
    ],
    notes: [],
  }
];

export const statusColors: Record<TicketStatus, { bg: string; text: string; border: string }> = {
  'open': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'in-progress': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  'pending': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'resolved': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'closed': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

export const priorityColors: Record<TicketPriority, { bg: string; text: string; border: string }> = {
  'low': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  'medium': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'high': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'urgent': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export const quickReplies = [
  {
    id: 'greeting',
    editable: true,
    title: 'Greeting',
    message: 'Hello! Thank you for reaching out. How can I assist you today?'
  },
  {
    id: 'checking',
    editable: true,
    title: 'Checking Issue',
    message: 'I understand the issue. Let me check this for you right away.'
  },
  {
    id: 'wait',
    editable: true,
    title: 'Wait Time',
    message: 'This might take a few minutes to investigate. I appreciate your patience.'
  },
  {
    id: 'followup',
    editable: true,
    title: 'Follow-up Required',
    message: 'I\'ll need to check with our technical team about this. I\'ll get back to you as soon as possible.'
  },
  {
    id: 'closing',
    editable: true,
    title: 'Closing',
    message: 'Is there anything else I can help you with today?'
  }
];

export interface Template {
  id: string;
  title: string;
  message: string;
  editable?: boolean;
}

export interface SupportState {
  selectedTicket: Ticket | null;
  searchQuery: string;
  ticketType: 'all' | 'chat' | 'ticket';
  selectedTopics: TopicCategory[];
  showPending: boolean;
  templates: Template[];
  newMessage: string;
  newNote: string;
  activeTab: 'notes' | 'templates';
  isTemplateDialogOpen: boolean;
  editingTemplate: Template | null;
}
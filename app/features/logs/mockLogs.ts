export interface LogEntry {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  category: string;
  status: string;
  target?: string;
  postId?: string;
  amount?: number;
  details: string;
}

export interface LogCategory {
  value: string;
  label: string;
}

export interface LogStatus {
  value: string;
  label: string;
}

export const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-20 15:30:45',
    admin: 'John Admin',
    action: 'User Suspended',
    category: 'user',
    status: 'success',
    target: '@user123',
    details: 'Account suspended for violating community guidelines'
  },
  {
    id: '2',
    timestamp: '2024-01-20 15:28:12',
    admin: 'Sarah Moderator',
    action: 'Content Removed',
    category: 'content',
    status: 'success',
    target: 'Post #45678',
    postId: '45678',
    details: 'Inappropriate content removed from feed'
  },
  {
    id: '3',
    timestamp: '2024-01-20 15:25:33',
    admin: 'Mike Finance',
    action: 'Wallet Credited',
    category: 'wallet',
    status: 'success',
    target: '@creator456',
    amount: 250.00,
    details: 'Creator earnings payout processed'
  },
  {
    id: '4',
    timestamp: '2024-01-20 15:22:18',
    admin: 'System',
    action: 'Security Alert',
    category: 'security',
    status: 'warning',
    details: 'Multiple failed login attempts detected from IP 192.168.1.100'
  },
  {
    id: '5',
    timestamp: '2024-01-20 15:20:05',
    admin: 'Emma Support',
    action: 'User Verified',
    category: 'user',
    status: 'success',
    target: '@newuser789',
    details: 'User identity verification completed'
  },
  {
    id: '6',
    timestamp: '2024-01-20 15:18:42',
    admin: 'John Admin',
    action: 'Refund Processed',
    category: 'wallet',
    status: 'success',
    target: '@customer101',
    amount: 49.99,
    details: 'Subscription refund processed due to billing error'
  },
  {
    id: '7',
    timestamp: '2024-01-20 15:15:27',
    admin: 'Sarah Moderator',
    action: 'Content Flagged',
    category: 'content',
    status: 'warning',
    target: 'Post #45679',
    postId: '45679',
    details: 'Content flagged for manual review - potential spam'
  },
  {
    id: '8',
    timestamp: '2024-01-20 15:12:14',
    admin: 'System',
    action: 'Backup Failed',
    category: 'system',
    status: 'error',
    details: 'Daily database backup failed - storage limit exceeded'
  },
  {
    id: '9',
    timestamp: '2024-01-20 15:10:33',
    admin: 'Sarah Moderator',
    action: 'Post Approved',
    category: 'content',
    status: 'success',
    target: 'Post #45680',
    postId: '45680',
    details: 'Post approved after manual review'
  },
  {
    id: '10',
    timestamp: '2024-01-20 15:08:21',
    admin: 'Mike Finance',
    action: 'Wallet Debited',
    category: 'wallet',
    status: 'success',
    target: '@spender789',
    amount: 15.99,
    details: 'Premium subscription charge processed'
  },
  {
    id: '11',
    timestamp: '2024-01-20 15:05:18',
    admin: 'Emma Support',
    action: 'Password Reset',
    category: 'security',
    status: 'success',
    target: '@forgotuser456',
    details: 'Password reset request processed and email sent'
  },
  {
    id: '12',
    timestamp: '2024-01-20 15:02:45',
    admin: 'John Admin',
    action: 'Feature Enabled',
    category: 'system',
    status: 'success',
    target: 'Live Streaming',
    details: 'Live streaming feature enabled for premium users'
  },
  {
    id: '13',
    timestamp: '2024-01-20 14:58:33',
    admin: 'Sarah Moderator',
    action: 'Comment Deleted',
    category: 'content',
    status: 'success',
    target: 'Comment #78901',
    details: 'Inappropriate comment removed from post discussion'
  },
  {
    id: '14',
    timestamp: '2024-01-20 14:55:12',
    admin: 'Mike Finance',
    action: 'Bonus Awarded',
    category: 'wallet',
    status: 'success',
    target: '@topperformer123',
    amount: 500.00,
    details: 'Monthly performance bonus credited to creator account'
  },
  {
    id: '15',
    timestamp: '2024-01-20 14:52:07',
    admin: 'System',
    action: 'API Rate Limit',
    category: 'security',
    status: 'warning',
    details: 'API rate limit exceeded for client app - temporary throttling applied'
  }
];

export const logCategories: LogCategory[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'user', label: 'User Management' },
  { value: 'content', label: 'Content Moderation' },
  { value: 'wallet', label: 'Wallet Transactions' },
  { value: 'security', label: 'Security' },
  { value: 'system', label: 'System' }
];

export const logStatuses: LogStatus[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' }
]; 
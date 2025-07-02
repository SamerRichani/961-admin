import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LogEntry } from './mockLogs';
import { getStatusColor, getCategoryColor } from './utils/logs';

interface LogsTableProps {
  logs: LogEntry[];
  onPostClick: (postId: string) => void;
}

const LogsTable: React.FC<LogsTableProps> = ({ logs, onPostClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Admin</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Target</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 text-sm text-gray-600">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                {log.admin}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900">
                {log.action}
                {log.amount && (
                  <span className="ml-2 text-green-600 font-medium">
                    ${log.amount.toFixed(2)}
                  </span>
                )}
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className={getCategoryColor(log.category)}>
                  {log.category}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <Badge className={getStatusColor(log.status)}>
                  {log.status}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm text-gray-900">
                {log.target && (
                  <div className="flex items-center space-x-2">
                    <span>{log.target}</span>
                    {log.postId && (
                      <button
                        onClick={() => onPostClick(log.postId!)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View post"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {log.details}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTable; 
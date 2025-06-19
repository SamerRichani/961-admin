"use client"

import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { statusColors, typeColors } from '@/app/features/flex/constants/flex';
import { formatMoney } from '@/lib/format';
import { Clock, MapPin, DollarSign, AlertTriangle } from 'lucide-react';
import { RootState } from '@/redux/store';
import { setSelectedTask } from '@/app/features/flex/redux/tasksSlice';
import { FlexTabs } from '@/app/features/flex/components/FlexTabs';

export function TasksList() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const selectedTask = useSelector((state: RootState) => state.tasks.selectedTask);
  const search = useSelector((state: RootState) => state.flex.search);

  if (selectedTask) {
    return (
      <div>
        <FlexTabs>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <Button
              variant="ghost"
              onClick={() => dispatch(setSelectedTask(null))}
            >
              ← Back to Tasks
            </Button>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {selectedTask.status === 'pending' && (
                <Button className="bg-[#FF0000] hover:bg-[#CC0000] flex-1 sm:flex-none">
                  Assign Task
                </Button>
              )}
              {selectedTask.status === 'in_progress' && (
                <Button className="bg-[#FF0000] hover:bg-[#CC0000] flex-1 sm:flex-none">
                  Track Progress
                </Button>
              )}
            </div>
          </div>

          <Card className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold">{selectedTask.id}</h2>
                    <Badge variant="outline" className={statusColors[selectedTask.status]}>
                      {selectedTask.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                    <Badge variant="outline" className={typeColors[selectedTask.type]}>
                      {selectedTask.type.charAt(0).toUpperCase() + selectedTask.type.slice(1)}
                    </Badge>
                  </div>
                  {selectedTask.blockId && (
                    <div className="text-sm text-gray-500">Block: {selectedTask.blockId}</div>
                  )}
                </div>
                {selectedTask.amount && (
                  <div className="text-left sm:text-right">
                    <div className="text-sm text-gray-500">Amount</div>
                    <div className="text-2xl font-bold">{formatMoney(selectedTask.amount)}</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-2">Customer Information</div>
                  <div className="space-y-2">
                    <div className="font-medium">{selectedTask.customer.name}</div>
                    <div className="text-sm">Phone: {selectedTask.customer.phone}</div>
                    {selectedTask.customer.email && (
                      <div className="text-sm">Email: {selectedTask.customer.email}</div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>Address</span>
                  </div>
                  <div className="font-medium">{selectedTask.address}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>Scheduled Time</span>
                  </div>
                  <div className="font-medium">{new Date(selectedTask.scheduledTime).toLocaleString()}</div>
                  {selectedTask.completedTime && (
                    <div className="text-sm text-gray-500 mt-1">
                      Completed: {new Date(selectedTask.completedTime).toLocaleString()}
                    </div>
                  )}
              </div>

              {selectedTask.flexer && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 sm:mb-4">Assigned Flexer</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedTask.flexer.avatar} />
                        <AvatarFallback>{selectedTask.flexer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedTask.flexer.name}</div>
                        <div className="text-sm text-gray-500">ID: {selectedTask.flexer.id}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTask.failureReason && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    <h3 className="font-medium">Failure Reason</h3>
                  </div>
                  <p className="mt-2 text-red-600">{selectedTask.failureReason}</p>
                </div>
              )}
            </div>
          </Card>
        </FlexTabs>
      </div>
    );
  }

  const filteredTasks = tasks.filter(task =>
    task.id.toLowerCase().includes(search.toLowerCase()) ||
    task.address.toLowerCase().includes(search.toLowerCase()) ||
    task.flexer?.name.toLowerCase().includes(search.toLowerCase()) ||
    task.blockId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <FlexTabs>
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="p-4 sm:p-6 cursor-pointer hover:border-[#FF0000] transition-colors"
              onClick={() => dispatch(setSelectedTask(task))}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="font-medium">{task.id}</h3>
                    <Badge variant="outline" className={statusColors[task.status]}>
                      {task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                    <Badge variant="outline" className={typeColors[task.type]}>
                      {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </Badge>
                    {task.blockId && (
                      <span className="text-sm text-gray-500">Block: {task.blockId}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{task.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{new Date(task.scheduledTime).toLocaleTimeString()}</span>
                    </div>
                    {task.amount && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 flex-shrink-0" />
                        <span>{formatMoney(task.amount)}</span>
                      </div>
                    )}
                  </div>
                  {task.failureReason && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span>{task.failureReason}</span>
                    </div>
                  )}
                </div>
                {task.flexer && (
                  <div className="flex items-center gap-3 sm:border-l sm:pl-6">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.flexer.avatar} />
                      <AvatarFallback>{task.flexer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{task.flexer.name}</p>
                      <p className="text-gray-500">ID: {task.flexer.id}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No tasks found matching your search
            </div>
          )}
        </div>
      </FlexTabs>
    </div>
  );
}
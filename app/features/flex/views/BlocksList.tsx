"use client"

import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type Block } from '@/app/features/flex/types';
import { statusColors } from '@/app/features/flex/constants/flex';
import { formatMoney } from '@/lib/format';
import { Package, Clock, MapPin, DollarSign, AlertTriangle } from 'lucide-react';
import { setSelectedBlock } from '@/app/features/flex/redux/blocksSlice';
import { RootState } from '@/redux/store';
import { FlexTabs } from '@/app/features/flex/components/FlexTabs';


export function BlocksList() {
  const dispatch = useDispatch();
  const blocks = useSelector((state: RootState) => state.blocks.blocks);
  const selectedBlock = useSelector((state: RootState) => state.blocks.selectedBlock);
  const search = useSelector((state: RootState) => state.flex.search);

  const handleBlockSelect = (block: Block) => {
    dispatch(setSelectedBlock(block));
  };

  const handleBack = () => {
    dispatch(setSelectedBlock(null));
  };

  if (selectedBlock) {
    // Timeline of tasks for the block
    const taskTimeline = [
      { time: '09:00 AM', status: 'started', details: 'Block started' },
      { time: '09:15 AM', status: 'delivery', details: 'Delivered package to 123 Main St' },
      { time: '09:45 AM', status: 'pickup', details: 'Collected $250 from 456 Oak St' },
      { time: '10:15 AM', status: 'delivery', details: 'Delivered package to 789 Pine St' },
      { time: '10:45 AM', status: 'failed', details: 'Failed delivery - Customer not available' },
      { time: '11:15 AM', status: 'delivery', details: 'Delivered package to 321 Elm St' }
    ];

    return (
      <div>
        <FlexTabs>
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
            >
              ← Back to Blocks
            </Button>
          </div>

          <Card className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold">{selectedBlock.id}</h2>
                    <Badge variant="outline" className={statusColors[selectedBlock.status]}>
                      {selectedBlock.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(selectedBlock.startTime).toLocaleTimeString()} - {new Date(selectedBlock.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedBlock.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-sm text-gray-500">Earnings</div>
                  <div className="text-2xl font-bold">{formatMoney(selectedBlock.earnings)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Total Tasks</div>
                  <div className="text-2xl font-bold">{selectedBlock.tasks.total}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Completed</div>
                  <div className="text-2xl font-bold">{selectedBlock.tasks.completed}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Deliveries</div>
                  <div className="text-2xl font-bold">{selectedBlock.tasks.deliveries}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Pickups</div>
                  <div className="text-2xl font-bold">{selectedBlock.tasks.pickups}</div>
                </div>
              </div>

              {/* Task Timeline */}
              <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-6">
                <h3 className="text-lg font-semibold">Tasks by Entity</h3>
                <div className="space-y-4">
                  {selectedBlock.tasks.entities.map((entity) => (
                    <div key={entity.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                        <div>
                          <h4 className="font-medium">{entity.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{entity.type === 'business' ? 'Business' : 'User'}</span>
                            <span>•</span>
                            <span>{entity.id}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {entity.tasks.length} task{entity.tasks.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {entity.tasks.map((task) => (
                          <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded gap-2">
                            <div className="flex items-center gap-3">
                              {task.type === 'delivery' ? (
                                <Package className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              ) : (
                                <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                              <div>
                                <div className="font-medium">
                                  {task.type === 'delivery' ? 'Delivery' : 'Cash Pickup'}
                                  {task.amount && ` • ${formatMoney(task.amount)}`}
                                </div>
                                <div className="text-sm text-gray-500">{task.address}</div>
                              </div>
                            </div>
                            <Badge variant="outline" className={
                              task.status === 'completed' ? 'bg-green-50 text-green-700' :
                              task.status === 'failed' ? 'bg-red-50 text-red-700' :
                              'bg-yellow-50 text-yellow-700'
                            }>
                              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      {/* Entity Summary */}
                      <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total Tasks:</span>
                          <span className="ml-2 font-medium">{entity.tasks.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Completed:</span>
                          <span className="ml-2 font-medium">
                            {entity.tasks.filter(t => t.status === 'completed').length}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Cash:</span>
                          <span className="ml-2 font-medium">
                            {formatMoney(entity.tasks.reduce((sum, t) => sum + (t.amount || 0), 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedBlock.flexer && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 sm:mb-4">Assigned Flexer</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedBlock.flexer.avatar} />
                        <AvatarFallback>{selectedBlock.flexer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedBlock.flexer.name}</div>
                        <div className="text-sm text-gray-500">ID: {selectedBlock.flexer.id}</div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-sm text-gray-500">Block Earnings</div>
                      <div className="text-lg font-bold">{formatMoney(selectedBlock.earnings)}</div>
                    </div>
                  </div>
                </div>
              )}
              {/* End of Block Review */}
              {selectedBlock.status === 'completed' && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-lg font-semibold mb-2 sm:mb-4">End of Block Review</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Cash Collection Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between flex-wrap gap-2">
                          <span>Total Cash to Hand Over:</span>
                          <span className="font-bold">
                            {formatMoney(selectedBlock.tasks.entities.reduce((sum, entity) => 
                              sum + entity.tasks.reduce((taskSum, task) => 
                                taskSum + (task.type === 'pickup' && task.status === 'completed' ? (task.amount || 0) : 0), 0
                              ), 0))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 flex-wrap gap-2">
                          <span>Successful Pickups:</span>
                          <span>
                            {selectedBlock.tasks.entities.reduce((sum, entity) => 
                              sum + entity.tasks.filter(t => t.type === 'pickup' && t.status === 'completed').length, 0)}
                          </span>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Task Summary</h4>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                          <span>Return Items:</span>
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="font-bold">
                              {selectedBlock.tasks.entities.reduce((sum, entity) => 
                                sum + entity.tasks.filter(t => t.status === 'failed').length, 0)}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-[#FF0000] hover:text-[#CC0000] hover:bg-red-50 flex-1 sm:flex-none"
                            >
                              Scan Returns
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 flex-wrap gap-2">
                          <span>Failed Deliveries:</span>
                          <span>
                            {selectedBlock.tasks.entities.reduce((sum, entity) => 
                              sum + entity.tasks.filter(t => t.type === 'delivery' && t.status === 'failed').length, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 flex-wrap gap-2">
                          <span>Failed Pickups:</span>
                          <span>
                            {selectedBlock.tasks.entities.reduce((sum, entity) => 
                              sum + entity.tasks.filter(t => t.type === 'pickup' && t.status === 'failed').length, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 flex-wrap gap-2">
                          <span>Pending Review:</span>
                          <span>
                            {selectedBlock.tasks.entities.reduce((sum, entity) => 
                              sum + entity.tasks.filter(t => t.status === 'pending').length, 0)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-2">Summary</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="col-span-1 sm:col-span-2 p-4 bg-white rounded-lg">
                        <div className="text-sm text-gray-500 mb-2">Cash Collection</div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <span>Amount to Hand Over</span>
                          <span className="font-bold">
                            {formatMoney(selectedBlock.tasks.entities.reduce((sum, entity) => 
                              sum + entity.tasks.reduce((taskSum, task) => 
                                taskSum + (task.type === 'pickup' && task.status === 'completed' ? (task.amount || 0) : 0), 0
                              ), 0))}
                          </span>
                        </div>
                        {selectedBlock.actualAmount !== undefined && (
                          <div className="mt-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              <span>Actual Amount</span>
                              <span className="font-bold">{formatMoney(selectedBlock.actualAmount)}</span>
                            </div>
                            {selectedBlock.actualAmount !== selectedBlock.tasks.entities.reduce((sum, entity) => 
                              sum + entity.tasks.reduce((taskSum, task) => 
                                taskSum + (task.type === 'pickup' && task.status === 'completed' ? (task.amount || 0) : 0), 0
                              ), 0) && (
                              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                <span>Discrepancy: {formatMoney(Math.abs(selectedBlock.actualAmount - 
                                  selectedBlock.tasks.entities.reduce((sum, entity) => 
                                    sum + entity.tasks.reduce((taskSum, task) => 
                                      taskSum + (task.type === 'pickup' && task.status === 'completed' ? (task.amount || 0) : 0), 0
                                    ), 0)
                                ))}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Returns</div>
                        <div className="font-medium">
                          {selectedBlock.tasks.entities.reduce((sum, entity) => 
                            sum + entity.tasks.filter(t => t.status === 'failed').length, 0)} items
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Completed Tasks</div>
                        <div className="font-medium">
                          {selectedBlock.tasks.entities.reduce((sum, entity) => 
                            sum + entity.tasks.filter(t => t.status === 'completed').length, 0)} of {selectedBlock.tasks.total}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Block Earnings</div>
                        <div className="font-medium">{formatMoney(selectedBlock.earnings)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </FlexTabs>
      </div>
    );
  }

  const filteredBlocks = blocks.filter(block =>
    block.id.toLowerCase().includes(search.toLowerCase()) ||
    block.location.toLowerCase().includes(search.toLowerCase()) ||
    block.flexer?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <FlexTabs>
        <div className="space-y-4">
          {filteredBlocks.map((block) => (
            <Card
              key={block.id}
              className="p-4 sm:p-6 cursor-pointer hover:border-[#FF0000] transition-colors"
              onClick={() => handleBlockSelect(block)}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="font-medium">{block.id}</h3>
                    <Badge variant="outline" className={statusColors[block.status]}>
                      {block.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {new Date(block.startTime).toLocaleTimeString()} - {new Date(block.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Package className="h-4 w-4 flex-shrink-0" />
                      <span>{block.tasks.completed}/{block.tasks.total} tasks</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{block.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 flex-shrink-0" />
                      <span>{formatMoney(block.earnings)}</span>
                    </div>
                  </div>
                </div>
                {block.flexer && (
                  <div className="flex items-center gap-3 sm:border-l sm:pl-6">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={block.flexer.avatar} />
                      <AvatarFallback>{block.flexer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{block.flexer.name}</p>
                      <p className="text-gray-500">ID: {block.flexer.id}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {filteredBlocks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No blocks found matching your search
            </div>
          )}
        </div>
      </FlexTabs>
    </div>
  );
}
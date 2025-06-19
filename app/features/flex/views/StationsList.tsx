"use client"

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatMoney, formatNumber } from '@/lib/format';
import { MapPin, Users, Package, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddStationDialog } from '../components/StationsPage/AddStationDialog';
import { StationData } from '@/app/features/flex/types';
import { RootState } from '@/redux/store';
import { setSelectedStation, addStation } from '@/app/features/flex/redux/stationsSlice';
import { FlexTabs } from '@/app/features/flex/components/FlexTabs';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800'
};

export function StationsList() {
  const dispatch = useDispatch();
  const stations = useSelector((state: RootState) => state.stations.stations);
  const selectedStation = useSelector((state: RootState) => state.stations.selectedStation);
  const search = useSelector((state: RootState) => state.flex.search);
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(search.toLowerCase()) ||
    station.location.toLowerCase().includes(search.toLowerCase()) ||
    station.managers.some(m => m.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddStation = (stationData: StationData) => {
    // Create a new station with a unique ID
    const newStation = {
      id: `STN${Date.now()}`,
      name: stationData.name,
      status: 'active' as const,
      location: stationData.location,
      metrics: {
        activeFlexers: 0,
        pendingTasks: 0,
        completedTasks: 0,
        cashCollected: 0,
        accuracy: 100
      },
      managers: stationData.managers.map(manager => ({
        ...manager,
        id: `MGR${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    };
    
    dispatch(addStation(newStation));
  };

  if (selectedStation) {
    return (
      <div>
        <FlexTabs>
          <Button
            variant="ghost"
            onClick={() => dispatch(setSelectedStation(null))}
            className="mb-6"
          >
            ← Back to Stations
          </Button>

          <Card className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold">{selectedStation.name}</h2>
                    <Badge 
                      variant="outline" 
                      className={statusColors[selectedStation.status]}
                    >
                      {selectedStation.status.charAt(0).toUpperCase() + selectedStation.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{selectedStation.location}</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement edit functionality
                      console.log('Edit station:', selectedStation.id);
                    }}
                  >
                    Edit Station
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement close functionality
                      console.log('Close station:', selectedStation.id);
                    }}
                  >
                    Close Station
                  </Button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span>Active Flexers</span>
                  </div>
                  <div className="font-medium">{formatNumber(selectedStation.metrics.activeFlexers)}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Package className="h-4 w-4 flex-shrink-0" />
                    <span>Pending Tasks</span>
                  </div>
                  <div className="font-medium">{formatNumber(selectedStation.metrics.pendingTasks)}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <TrendingUp className="h-4 w-4 flex-shrink-0" />
                    <span>Completed Today</span>
                  </div>
                  <div className="font-medium">{formatNumber(selectedStation.metrics.completedTasks)}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span>Cash Collected</span>
                  </div>
                  <div className="font-medium">{formatMoney(selectedStation.metrics.cashCollected)}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <TrendingUp className="h-4 w-4 flex-shrink-0" />
                    <span>Accuracy</span>
                  </div>
                  <div className="font-medium">{selectedStation.metrics.accuracy}%</div>
                </div>
              </div>

              {/* Location Map */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg font-semibold mb-2 sm:mb-4">Location</h3>
                <div className="h-[200px] sm:h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map Placeholder</p>
                </div>
              </div>

              {/* Station Managers */}
              <div>
                <h3 className="text-lg font-semibold mb-2 sm:mb-4">Station Management</h3>
                <div className="space-y-4">
                  {selectedStation.managers.map((manager) => (
                    <div key={manager.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{manager.name}</p>
                          <p className="text-sm text-gray-500">{manager.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </FlexTabs>
      </div>
    );
  }

  return (
    <div>
      <FlexTabs>
        <div className="flex justify-end mb-4 sm:mb-6">
          <Button
            className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
            onClick={() => setIsAddStationOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Station
          </Button>
        </div>

        <div className="space-y-4">
          {filteredStations.map((station) => (
            <Card
              key={station.id}
              className="p-4 sm:p-6 cursor-pointer hover:border-[#FF0000] transition-colors"
              onClick={() => dispatch(setSelectedStation(station))}
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="font-medium">{station.name}</h3>
                      <Badge variant="outline" className={statusColors[station.status]}>
                        {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{station.location}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-sm text-gray-500">Station ID</div>
                    <div className="font-medium">{station.id}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span>Active Flexers</span>
                    </div>
                    <div className="font-medium">{formatNumber(station.metrics.activeFlexers)}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Package className="h-4 w-4 flex-shrink-0" />
                      <span>Pending Tasks</span>
                    </div>
                    <div className="font-medium">{formatNumber(station.metrics.pendingTasks)}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <TrendingUp className="h-4 w-4 flex-shrink-0" />
                      <span>Completed Today</span>
                    </div>
                    <div className="font-medium">{formatNumber(station.metrics.completedTasks)}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <DollarSign className="h-4 w-4 flex-shrink-0" />
                      <span>Cash Collected</span>
                    </div>
                    <div className="font-medium">{formatMoney(station.metrics.cashCollected)}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <TrendingUp className="h-4 w-4 flex-shrink-0" />
                      <span>Accuracy</span>
                    </div>
                    <div className="font-medium">{station.metrics.accuracy}%</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-2">Station Managers</div>
                  <div className="space-y-2">
                    {station.managers.map((manager) => (
                      <div key={manager.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-1">
                        <span className="font-medium">{manager.name}</span>
                        <span className="text-gray-500">{manager.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredStations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No stations found matching your search
            </div>
          )}

          <AddStationDialog
            open={isAddStationOpen}
            onOpenChange={setIsAddStationOpen}
            onSubmit={handleAddStation}
          />
        </div>
      </FlexTabs>
    </div>
  );
}
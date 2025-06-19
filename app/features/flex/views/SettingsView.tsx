"use client"

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateSettings } from '@/app/features/flex/redux/flexSettingsSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, Package, DollarSign, AlertTriangle, QrCode, 
  Users, Clock, Shield, Bell, MapPin, Smartphone 
} from 'lucide-react';
import { FlexTabs } from '@/app/features/flex/components/FlexTabs';


export function SettingsView() {
  const settings = useSelector((state: RootState) => state.flexSettings);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('tasks');
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    // TODO: Save settings to backend
    console.log('Saving settings:', settings);
    setIsDirty(false);
  };

  const handleUpdateSettings = (updates: Partial<typeof settings>) => {
    dispatch(updateSettings(updates));
    setIsDirty(true);
  };

  return (
    <div>
      <FlexTabs>
        <div className="min-h-[calc(100vh-12rem)] bg-white">
          <div className="max-w-[1200px] mx-auto p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Flex Settings</h2>
              <Button
                onClick={handleSave}
                disabled={!isDirty}
                className="bg-[#FF0000] hover:bg-[#CC0000] text-white w-full sm:w-auto"
              >
                <Settings className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 overflow-x-auto no-scrollbar">
                <TabsList className="w-full sm:w-auto inline-flex h-12 p-1">
                  <TabsTrigger value="tasks" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm whitespace-nowrap">
                    <Package className="h-4 w-4 mr-2" />
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger value="costs" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm whitespace-nowrap">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Costs
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm whitespace-nowrap">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="verification" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm whitespace-nowrap">
                    <Shield className="h-4 w-4 mr-2" />
                    Verification
                  </TabsTrigger>
                  <TabsTrigger value="system" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm whitespace-nowrap">
                    <Settings className="h-4 w-4 mr-2" />
                    System
                  </TabsTrigger>
                  <TabsTrigger value="location" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm whitespace-nowrap">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Contents */}
              <div className="mt-6 space-y-6">
                {/* Tasks Settings */}
                <TabsContent value="tasks" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Task Limits
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Min Tasks per Block</Label>
                            <Input
                              type="number"
                              value={settings.minTasksPerBlock}
                              onChange={(e) => handleUpdateSettings({ minTasksPerBlock: parseInt(e.target.value) })}
                              min={1}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Max Tasks per Block</Label>
                            <Input
                              type="number"
                              value={settings.maxTasksPerBlock}
                              onChange={(e) => handleUpdateSettings({ maxTasksPerBlock: parseInt(e.target.value) })}
                              min={settings.minTasksPerBlock}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Max Active Blocks</Label>
                          <Input
                            type="number"
                            value={settings.maxActiveBlocks}
                            onChange={(e) => handleUpdateSettings({ maxActiveBlocks: parseInt(e.target.value) })}
                            min={1}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Daily Tasks</Label>
                          <Input
                            type="number"
                            value={settings.maxDailyTasks}
                            onChange={(e) => handleUpdateSettings({ maxDailyTasks: parseInt(e.target.value) })}
                            min={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Task Timing
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                          <Label>Task Timeout (minutes)</Label>
                          <Input
                            type="number"
                            value={settings.taskTimeout}
                            onChange={(e) => handleUpdateSettings({ taskTimeout: parseInt(e.target.value) })}
                            min={1}
                            className="w-full"
                          />
                          <p className="text-sm text-gray-500">Time before task is automatically reassigned</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Costs Settings */}
                <TabsContent value="costs" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Base Rates
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                          <Label>Cost per Task</Label>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <Input
                              type="number"
                              step="0.01"
                              value={settings.costPerTask}
                              onChange={(e) => handleUpdateSettings({ costPerTask: parseFloat(e.target.value) })}
                              min={0.01}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Cost per Cash Task</Label>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <Input
                              type="number"
                              step="0.01"
                              value={settings.costPerCashTask}
                              onChange={(e) => handleUpdateSettings({ costPerCashTask: parseFloat(e.target.value) })}
                              min={0.01}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Bonuses
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                          <Label>Bonus Threshold (tasks)</Label>
                          <Input
                            type="number"
                            value={settings.bonusThreshold}
                            onChange={(e) => handleUpdateSettings({ bonusThreshold: parseInt(e.target.value) })}
                            min={1}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Bonus Amount</Label>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <Input
                              type="number"
                              step="0.01"
                              value={settings.bonusAmount}
                              onChange={(e) => handleUpdateSettings({ bonusAmount: parseFloat(e.target.value) })}
                              min={0.01}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Performance Settings */}
                <TabsContent value="performance" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Performance Thresholds
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                          <Label>Auto-Disable Threshold</Label>
                          <div className="px-2">
                            <Slider
                              value={[settings.autoDisableThreshold]}
                              onValueChange={([value]: number[]) => handleUpdateSettings({ autoDisableThreshold: value })}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            Failed tasks before automatic account disable: {settings.autoDisableThreshold}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Warning Threshold</Label>
                          <div className="px-2">
                            <Slider
                              value={[settings.warningThreshold]}
                              onValueChange={([value]: number[]) => handleUpdateSettings({ warningThreshold: value })}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            Failed tasks before warning: {settings.warningThreshold}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Minimum Requirements
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                          <Label>Minimum Acceptance Rate</Label>
                          <div className="px-2">
                            <Slider
                              value={[settings.minAcceptanceRate]}
                              onValueChange={([value]: number[]) => handleUpdateSettings({ minAcceptanceRate: value })}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            Required acceptance rate: {settings.minAcceptanceRate}%
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Minimum Completion Rate</Label>
                          <div className="px-2">
                            <Slider
                              value={[settings.minCompletionRate]}
                              onValueChange={([value]: number[]) => handleUpdateSettings({ minCompletionRate: value })}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            Required completion rate: {settings.minCompletionRate}%
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Verification Settings */}
                <TabsContent value="verification" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        Task Verification
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label>QR Code Verification</Label>
                            <p className="text-sm text-gray-500">Require QR scanning for tasks</p>
                          </div>
                          <Switch
                            checked={settings.qrVerificationEnabled}
                            onCheckedChange={(checked: boolean) => handleUpdateSettings({ qrVerificationEnabled: checked })}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label>Photo Verification</Label>
                            <p className="text-sm text-gray-500">Require photos for proof of delivery</p>
                          </div>
                          <Switch
                            checked={settings.photoVerificationEnabled}
                            onCheckedChange={(checked: boolean) => handleUpdateSettings({ photoVerificationEnabled: checked })}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label>Signature Required</Label>
                            <p className="text-sm text-gray-500">Require customer signature</p>
                          </div>
                          <Switch
                            checked={settings.signatureRequired}
                            onCheckedChange={(checked: boolean) => handleUpdateSettings({ signatureRequired: checked })}
                          />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Identity Verification
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label>ID Verification</Label>
                            <p className="text-sm text-gray-500">Require government ID verification</p>
                          </div>
                          <Switch
                            checked={settings.idVerificationRequired}
                            onCheckedChange={(checked: boolean) => handleUpdateSettings({ idVerificationRequired: checked })}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="system" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        System Configuration
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label>Flexer Registration</Label>
                            <p className="text-sm text-gray-500">Allow new flexer registration</p>
                          </div>
                          <Switch
                            checked={settings.registrationEnabled}
                            onCheckedChange={(checked: boolean) => handleUpdateSettings({ registrationEnabled: checked })}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label>Auto Assignment</Label>
                            <p className="text-sm text-gray-500">Automatically assign tasks</p>
                          </div>
                          <Switch
                            checked={settings.autoAssignEnabled}
                            onCheckedChange={(checked: boolean) => handleUpdateSettings({ autoAssignEnabled: checked })}
                          />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-gray-500">Enable push notifications</p>
                          </div>
                          <Switch
                            checked={settings.notificationsEnabled}
                            onCheckedChange={(checked: boolean) => handleUpdateSettings({ notificationsEnabled: checked })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tracking Interval (minutes)</Label>
                          <Input
                            type="number"
                            value={settings.trackingInterval}
                            onChange={(e) => handleUpdateSettings({ trackingInterval: parseInt(e.target.value) })}
                            min={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Location Settings */}
                <TabsContent value="location" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Location Settings
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                          <Label>Maximum Radius (km)</Label>
                          <Input
                            type="number"
                            value={settings.maxRadius}
                            onChange={(e) => handleUpdateSettings({ maxRadius: parseInt(e.target.value) })}
                            min={1}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location Update Interval (minutes)</Label>
                          <Input
                            type="number"
                            value={settings.locationUpdateInterval}
                            onChange={(e) => handleUpdateSettings({ locationUpdateInterval: parseInt(e.target.value) })}
                            min={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 sm:p-6">
                      <h3 className="text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Location Features
                      </h3>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label>Geofencing</Label>
                            <p className="text-sm text-gray-500">Enable location-based restrictions</p>
                          </div>
                          <Switch
                            checked={settings.geofencingEnabled}
                            onCheckedChange={(checked: boolean) => handleUpdateSettings({ geofencingEnabled: checked })}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label>Station Check-in</Label>
                            <p className="text-sm text-gray-500">Require station check-in</p>
                          </div>
                          <Switch
                            checked={settings.stationCheckInRequired}
                            onCheckedChange={(checked: boolean) => handleUpdateSettings({ stationCheckInRequired: checked })}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </FlexTabs>
    </div>
  );
} 
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  DollarSign,
  Clock,
  MapPin,
  Zap,
  Building,
} from "lucide-react";
import { RootState } from "@/redux/store";
import { updateRates } from "@/app/features/flex/redux/flexPricingSlice";
import { type PricingRates } from "@/app/features/flex/types";

function FlexPricing() {
  const rates = useSelector((state: RootState) => state.flexPricing);
  const dispatch = useDispatch();
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("base");

  const handleSave = () => {
    // TODO: Save rates to backend
    console.log("Saving rates:", rates);
    setIsDirty(false);
  };

  const handleUpdateRates = (updates: Partial<PricingRates>) => {
    dispatch(updateRates(updates));
    setIsDirty(true);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] bg-white">
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Delivery Rates</h2>
          <Button
            onClick={handleSave}
            disabled={!isDirty}
            className="bg-[#FF0000] hover:bg-[#CC0000] text-white w-full sm:w-auto"
          >
            <Settings className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 overflow-x-auto no-scrollbar">
            <div className="min-w-max">
              <TabsList className="bg-transparent h-12 p-1">
                <TabsTrigger
                  value="base"
                  className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Base Rates
                </TabsTrigger>
                <TabsTrigger
                  value="regions"
                  className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Regions
                </TabsTrigger>
                <TabsTrigger
                  value="peak"
                  className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Peak Season
                </TabsTrigger>
                <TabsTrigger
                  value="business"
                  className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Business
                </TabsTrigger>
                <TabsTrigger
                  value="urgent"
                  className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 rounded-md px-3 py-2 text-sm"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Urgent
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Contents */}
          <div className="mt-6 space-y-6">
            {/* Base Rates */}
            <TabsContent value="base" className="mt-0">
              <Card className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-6">Base Delivery Rates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Base Rate</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <Input
                        type="number"
                        step="0.01"
                        value={rates.base}
                        onChange={(e) => handleUpdateRates({ base: parseFloat(e.target.value) })}
                        min={0}
                        className="w-full"
                      />
                    </div>
                    <p className="text-sm text-gray-500">Base rate per delivery</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Per Kilometer Rate</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <Input
                        type="number"
                        step="0.01"
                        value={rates.perKm}
                        onChange={(e) => handleUpdateRates({ perKm: parseFloat(e.target.value) })}
                        min={0}
                        className="w-full"
                      />
                    </div>
                    <p className="text-sm text-gray-500">Additional cost per kilometer</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Regions */}
            <TabsContent value="regions" className="mt-0">
              <Card className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-6">Regional Pricing</h3>
                <div className="space-y-4">
                  {rates.regions.map((region: { name: string; multiplier: number }, index: number) => (
                    <div
                      key={region.name}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-full sm:w-1/2">
                        <Label className="text-base">{region.name}</Label>
                        {region.name === "Beirut" && (
                          <p className="text-sm text-gray-500 mt-1">Base region</p>
                        )}
                      </div>
                      <div className="w-full sm:w-32">
                        <Input
                          type="number"
                          step="0.1"
                          value={region.multiplier}
                          onChange={(e) => {
                            const newRegions = [...rates.regions];
                            newRegions[index].multiplier = parseFloat(e.target.value);
                            handleUpdateRates({ regions: newRegions });
                          }}
                          min={1}
                          disabled={region.name === "Beirut"}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Peak Season */}
            <TabsContent value="peak" className="mt-0">
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-lg font-semibold">Peak Season Pricing</h3>
                  <Button
                    onClick={() => {
                      const newPeakSeasons = [
                        ...rates.peakSeasons,
                        { name: "", startDate: "", endDate: "", percentage: 20 },
                      ];
                      handleUpdateRates({ peakSeasons: newPeakSeasons });
                    }}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Add Season
                  </Button>
                </div>
                <div className="space-y-4">
                  {rates.peakSeasons.map((season: { name: string; startDate: string; endDate: string; percentage: number }, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Season Name</Label>
                          <Input
                            value={season.name}
                            onChange={(e) => {
                              const newSeasons = [...rates.peakSeasons];
                              newSeasons[index].name = e.target.value;
                              handleUpdateRates({ peakSeasons: newSeasons });
                            }}
                            placeholder="e.g., Black Friday"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={season.startDate}
                            onChange={(e) => {
                              const newSeasons = [...rates.peakSeasons];
                              newSeasons[index].startDate = e.target.value;
                              handleUpdateRates({ peakSeasons: newSeasons });
                            }}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={season.endDate}
                            onChange={(e) => {
                              const newSeasons = [...rates.peakSeasons];
                              newSeasons[index].endDate = e.target.value;
                              handleUpdateRates({ peakSeasons: newSeasons });
                            }}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Price Increase</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={season.percentage}
                              onChange={(e) => {
                                const newSeasons = [...rates.peakSeasons];
                                newSeasons[index].percentage = parseFloat(e.target.value);
                                handleUpdateRates({ peakSeasons: newSeasons });
                              }}
                              min={0}
                              max={100}
                              className="w-full"
                            />
                            <span className="text-sm text-gray-500 whitespace-nowrap">%</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                        onClick={() => {
                          const newSeasons = rates.peakSeasons.filter((_: any, i: number) => i !== index);
                          handleUpdateRates({ peakSeasons: newSeasons });
                        }}
                      >
                        Remove Season
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Business */}
            <TabsContent value="business" className="mt-0">
              <Card className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-6">Business Delivery Rates</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <Label>Base Business Multiplier</Label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <Input
                        type="number"
                        step="0.01"
                        value={rates.businessBaseMultiplier}
                        onChange={(e) =>
                          handleUpdateRates({
                            businessBaseMultiplier: parseFloat(e.target.value),
                          })
                        }
                        min={0}
                        max={1}
                        className="w-full sm:w-64"
                      />
                      <p className="text-sm text-gray-500">Base discount for business customers</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Volume Discounts</Label>
                    {rates.businessVolumeDiscounts.map((discount: PricingRates['businessVolumeDiscounts'][0], index: number) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-500">Min Monthly Volume</Label>
                          <Input
                            type="number"
                            value={discount.minVolume}
                            onChange={(e) => {
                              const newDiscounts = [...rates.businessVolumeDiscounts];
                              newDiscounts[index].minVolume = parseInt(e.target.value);
                              handleUpdateRates({ businessVolumeDiscounts: newDiscounts });
                            }}
                            min={1}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-500">Discount</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="0.01"
                              value={discount.discount}
                              onChange={(e) => {
                                const newDiscounts = [...rates.businessVolumeDiscounts];
                                newDiscounts[index].discount = parseFloat(e.target.value);
                                handleUpdateRates({ businessVolumeDiscounts: newDiscounts });
                              }}
                              min={0}
                              max={1}
                              className="w-full"
                            />
                            <span className="text-sm text-gray-500">x</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Urgent */}
            <TabsContent value="urgent" className="mt-0">
              <Card className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-6">Urgent Delivery Rules</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Price Multiplier</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={rates.urgentDeliveryMultiplier}
                      onChange={(e) =>
                        handleUpdateRates({
                          urgentDeliveryMultiplier: parseFloat(e.target.value),
                        })
                      }
                      min={1}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">Multiplier for urgent deliveries</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Distance (km)</Label>
                    <Input
                      type="number"
                      value={rates.urgentMaxDistance}
                      onChange={(e) =>
                        handleUpdateRates({
                          urgentMaxDistance: parseFloat(e.target.value),
                        })
                      }
                      min={1}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">Maximum allowed distance</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Window (minutes)</Label>
                    <Input
                      type="number"
                      value={rates.urgentTimeWindow}
                      onChange={(e) =>
                        handleUpdateRates({
                          urgentTimeWindow: parseInt(e.target.value),
                        })
                      }
                      min={1}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">Delivery time window</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export { FlexPricing };

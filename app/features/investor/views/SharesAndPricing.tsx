"use client"

import { useCallback, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Pencil, Save, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from "sonner";
import { Wave } from '@/app/features/investor/types';
import {
  setTotalShares,
  setCurrentPrice,
  addWave,
  removeWave,
  setEditingWave,
  setEditedWave,
  saveWaveEdit,
  setWaves,
} from '@/app/features/investor/redux/sharesSlice';

export function SharesAndPricing() {
  const dispatch = useDispatch();
  const { totalShares, currentPrice, waves, editingWave, editedWave } = useSelector(
    (state: RootState) => state.shares
  );
  const [isLoading, setIsLoading] = useState(true);
  const [localTotalShares, setLocalTotalShares] = useState(totalShares);
  const [localCurrentPrice, setLocalCurrentPrice] = useState(currentPrice);

  useEffect(() => {
    const fetchSharesData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investor/sharesandpricing`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        dispatch(setTotalShares(data.totalShares));
        dispatch(setCurrentPrice(data.currentPrice));
        dispatch(setWaves(data.waves));
      } catch (error) {
        console.error('Error fetching shares data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharesData();
  }, [dispatch]);

  useEffect(() => {
    setLocalTotalShares(totalShares);
  }, [totalShares]);

  useEffect(() => {
    setLocalCurrentPrice(currentPrice);
  }, [currentPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localTotalShares !== totalShares) {
        handleTotalSharesUpdate(localTotalShares);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [localTotalShares]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localCurrentPrice !== currentPrice) {
        handleCurrentPriceUpdate(localCurrentPrice);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [localCurrentPrice]);

  const handleTotalSharesUpdate = async (value: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investor/sharesandpricing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalShares: value,
          currentPrice: currentPrice,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update shares');
      }
      const data = await response.json();
      
      dispatch(setTotalShares(data.totalShares));
      dispatch(setCurrentPrice(data.currentPrice));
      dispatch(setWaves(data.waves));
      
      toast.success("Total shares updated successfully");
    } catch (error) {
      console.error('Error updating total shares:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update total shares');
    }
  };

  const handleCurrentPriceUpdate = async (value: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investor/sharesandpricing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalShares: totalShares,
          currentPrice: value,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update price');
      }
      const data = await response.json();
      
      dispatch(setTotalShares(data.totalShares));
      dispatch(setCurrentPrice(data.currentPrice));
      dispatch(setWaves(data.waves));
      
      toast.success("Current price updated successfully");
    } catch (error) {
      console.error('Error updating current price:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update current price');
    }
  };

  const calculateTotalPercentage = (waves: Wave[], editingIndex: number | null = null, newPercentage: number | null = null): number => {
    return waves.reduce((total, wave, index) => {
      if (editingIndex === index && newPercentage !== null) {
        return total + newPercentage;
      }
      return total + wave.percentage;
    }, 0);
  };

  const handleAddWave = async () => {
    const totalPercentage = calculateTotalPercentage(waves);
    if (totalPercentage >= 100) {
      toast.error("Cannot add new wave: Total percentage would exceed 100%");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investor/sharesandpricing/waves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Wave",
          percentage: 0,
          price: 0,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add wave');
      }
      const data = await response.json();
      
      dispatch(setTotalShares(data.totalShares));
      dispatch(setCurrentPrice(data.currentPrice));
      dispatch(setWaves(data.waves));
      
      toast.success("New wave added successfully");
    } catch (error) {
      console.error('Error adding wave:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add new wave');
    }
  };

  const handleEditSave = async () => {
    if (editingWave === null || editedWave === null) {
      toast.error("Cannot save wave: Invalid wave data");
      return;
    }

    const totalPercentage = calculateTotalPercentage(waves, editingWave, editedWave.percentage);
    if (totalPercentage > 100) {
      toast.error(`Cannot save wave: Total percentage (${totalPercentage}%) would exceed 100%`);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investor/sharesandpricing/waves/${editedWave._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedWave.name,
          percentage: editedWave.percentage,
          price: editedWave.price,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update wave');
      }
      const data = await response.json();
      
      dispatch(setTotalShares(data.totalShares));
      dispatch(setCurrentPrice(data.currentPrice));
      dispatch(setWaves(data.waves));
      dispatch(saveWaveEdit());
      
      toast.success("Wave updated successfully");
    } catch (error) {
      console.error('Error updating wave:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update wave');
    }
  };

  const handleRemoveWave = async (index: number) => {
    const wave = waves[index];
    if (!wave || !wave._id) {
      toast.error("Cannot delete wave: Invalid wave data");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investor/sharesandpricing/waves/${wave._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete wave');
      }
      const data = await response.json();
      
      dispatch(setTotalShares(data.totalShares));
      dispatch(setCurrentPrice(data.currentPrice));
      dispatch(setWaves(data.waves));
      
      toast.success("Wave deleted successfully");
    } catch (error) {
      console.error('Error removing wave:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete wave');
    }
  };

  const handleEditStart = useCallback((index: number) => {
    dispatch(setEditingWave(index));
    dispatch(setEditedWave(waves[index]));
  }, [dispatch, waves]);

  const handleEditCancel = useCallback(() => {
    dispatch(setEditingWave(null));
    dispatch(setEditedWave(null));
  }, [dispatch]);

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedWave) return;
    
    const newPercentage = Number(e.target.value);
    const totalPercentage = calculateTotalPercentage(waves, editingWave, newPercentage);
    
    if (totalPercentage > 100) {
      toast.error(`Total percentage (${totalPercentage}%) would exceed 100%`);
      return;
    }

    dispatch(setEditedWave({ ...editedWave, percentage: newPercentage }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Share Configuration</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="totalShares">Total Available Shares</Label>
              <Input
                id="totalShares"
                type="number"
                value={localTotalShares}
                onChange={(e) => setLocalTotalShares(Number(e.target.value))}
                className="h-9 sm:h-10"
              />
            </div>
            <div>
              <Label htmlFor="currentPrice">Current Price Per Share</Label>
              <Input
                id="currentPrice"
                type="number"
                value={localCurrentPrice}
                onChange={(e) => setLocalCurrentPrice(Number(e.target.value))}
                className="h-9 sm:h-10"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Investment Waves</h2>
            <Button
              onClick={handleAddWave}
              className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Wave
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-500">Wave</th>
                  <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-500">Percentage</th>
                  <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-500">Price</th>
                  <th className="px-3 sm:px-4 py-2 text-right text-xs sm:text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {waves.map((wave, index) => (
                  <tr key={index}>
                    <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium">
                      {editingWave === index ? (
                        <Input
                          value={editedWave?.name || ''}
                          onChange={(e) => dispatch(setEditedWave({ ...editedWave!, name: e.target.value }))}
                          className="h-7 sm:h-8 text-xs sm:text-sm"
                        />
                      ) : (
                        wave.name || 'Wave'
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                      {editingWave === index ? (
                        <Input
                          type="number"
                          value={editedWave?.percentage || 0}
                          onChange={handlePercentageChange}
                          className="h-7 sm:h-8 text-xs sm:text-sm"
                        />
                      ) : (
                        `${wave.percentage || 0}%`
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                      {editingWave === index ? (
                        <Input
                          type="number"
                          value={editedWave?.price || 0}
                          onChange={(e) => dispatch(setEditedWave({ ...editedWave!, price: Number(e.target.value) }))}
                          className="h-7 sm:h-8 text-xs sm:text-sm"
                        />
                      ) : (
                        `$${wave.price || 0}`
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {editingWave === index ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleEditCancel}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleEditSave}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-[#FF0000] hover:bg-[#CC0000]"
                            >
                              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStart(index)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <Pencil className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveWave(index)}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {waves.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <p className="text-sm sm:text-base">No investment waves configured</p>
              <p className="text-xs sm:text-sm mt-1">Click "Add Wave" to create one</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
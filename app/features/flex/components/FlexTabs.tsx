"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch, setIsCreateBlockOpen, setIsScanDialogOpen, setVerificationStep, updateCashVerification, resetCashVerification } from '@/app/features/flex/redux/flexSlice';
import { setPage, type Page } from '@/components/sidebar/redux/navigationSlice';
import { useCallback } from 'react';
import { RootState } from '@/redux/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formatMoney } from '@/lib/format';
import { CreateBlockDialog } from './CreateBlockDialog';


interface Return {
  id: string;
  scanned: boolean;
}

interface CashVerification {
  expectedAmount: number;
  actualAmount: number;
  returns: Return[];
}

interface FlexTabsProps {
  children?: React.ReactNode;
}

export function FlexTabs({ children }: FlexTabsProps) {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state.navigation.currentPage);
  const activeTab = currentPage === 'flex' ? 'overview' : currentPage.split('/')[1] || 'overview';
  const isScanDialogOpen = useSelector((state: RootState) => state.flex.isScanDialogOpen);
  const isCreateBlockOpen = useSelector((state: RootState) => state.flex.isCreateBlockOpen);
  const verificationStep = useSelector((state: RootState) => state.flex.verificationStep);
  const cashVerification = useSelector((state: RootState) => state.flex.cashVerification);
  const search = useSelector((state: RootState) => state.flex.search);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const handleTabChange = (value: string) => {
    // Reset search when changing tabs
    dispatch(setSearch(''));
    
    switch (value) {
      case "overview":
        dispatch(setPage("flex"));
        break;
      case "flexers":
        dispatch(setPage("flex/flexers"));
        break;
      case "applications":
        dispatch(setPage("flex/applications"));
        break;
      case "blocks":
        dispatch(setPage("flex/blocks"));
        break;
      case "tasks":
        dispatch(setPage("flex/tasks"));
        break;
      case "stations":
        dispatch(setPage("flex/stations"));
        break;
      case "pricing":
        dispatch(setPage("flex/pricing"));
        break;
      case "settings":
        dispatch(setPage("flex/settings"));
        break;
      default:
        dispatch(setPage("flex"));
    }
  };

  const handleScanComplete = useCallback(() => {
    dispatch(setVerificationStep('cash'));
  }, [dispatch]);

  const handleCashVerification = useCallback((amount: number) => {
    dispatch(updateCashVerification({ actualAmount: amount }));
    dispatch(setVerificationStep('returns'));
  }, [dispatch]);

  const handleReturnScan = useCallback((returnId: string) => {
    dispatch(updateCashVerification({
      returns: cashVerification.returns.map((ret: Return) => 
        ret.id === returnId ? { ...ret, scanned: true } : ret
      )
    }));

    // Check if all returns are scanned
    const allScanned = cashVerification.returns.every((ret: Return) => ret.scanned);
    if (allScanned) {
      dispatch(setVerificationStep('summary'));
    }
  }, [dispatch, cashVerification.returns]);

  const handleComplete = useCallback(() => {
    dispatch(setIsScanDialogOpen(false));
    dispatch(setVerificationStep('scanning'));
    dispatch(resetCashVerification());
  }, [dispatch]);

  return (
    <div className="bg-white border-b">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">Flex Management</h1>
          <Button onClick={() => console.log('Export data')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto overflow-x-auto">
              <TabsList className="h-9 w-max">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="flexers"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Flexers
                </TabsTrigger>
                <TabsTrigger
                  value="applications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Applications
                </TabsTrigger>
                <TabsTrigger
                  value="blocks"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Blocks
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="stations"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Stations
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Pricing
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                className="pl-9 h-9 sm:h-10 text-sm"
              />
            </div>
          </div>
        </Tabs>
      </div>

      <div className="px-4 sm:px-6 py-4">
        {children}
      </div>

      <CreateBlockDialog 
        open={isCreateBlockOpen}
        onOpenChange={(open) => dispatch(setIsCreateBlockOpen(open))}
      />

      <Dialog open={isScanDialogOpen} onOpenChange={(open) => dispatch(setIsScanDialogOpen(open))}>
        <DialogContent className="w-[95vw] max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>
              {verificationStep === 'scanning' && 'Scanning QR Code'}
              {verificationStep === 'cash' && 'Cash Verification'}
              {verificationStep === 'returns' && 'Returns Verification'}
              {verificationStep === 'summary' && 'Verification Summary'}
            </DialogTitle>
          </DialogHeader>
          {verificationStep === 'scanning' && (
            <div className="py-8 flex flex-col items-center justify-center" onClick={handleScanComplete}>
              <div className="relative w-48 h-48 mb-4">
                <div className="absolute inset-0 border-2 border-[#FF0000] rounded-lg" />
                <div className="absolute top-0 left-1/2 w-px h-full bg-[#FF0000] animate-[scan_2s_ease-in-out_infinite]" 
                  style={{
                    animation: 'scan 2s ease-in-out infinite',
                    boxShadow: '0 0 8px rgba(255, 0, 0, 0.5)'
                  }}
                />
                <style>
                  {`
                    @keyframes scan {
                      0% { transform: translateX(-24px); }
                      50% { transform: translateX(24px); }
                      100% { transform: translateX(-24px); }
                    }
                  `}
                </style>
              </div>
              <p className="text-sm text-gray-500 animate-pulse">Scanning...</p>
            </div>
          )}

          {verificationStep === 'cash' && (
            <div className="py-4 space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">Expected Amount</div>
                <div className="text-2xl font-bold">{formatMoney(cashVerification.expectedAmount)}</div>
              </div>
              <div className="space-y-2">
                <Label>Actual Amount Received</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={cashVerification.actualAmount}
                  onChange={(e) => dispatch(updateCashVerification({ actualAmount: parseFloat(e.target.value) || 0 }))}
                  className="text-lg"
                />
                <Button
                  onClick={() => handleCashVerification(cashVerification.actualAmount)}
                  className="w-full bg-[#FF0000] hover:bg-[#CC0000]"
                  disabled={cashVerification.actualAmount <= 0}
                >
                  Verify Cash
                </Button>
              </div>
            </div>
          )}

          {verificationStep === 'returns' && (
            <div className="py-4 space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">Returns Verification</div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {cashVerification.returns.filter(ret => ret.scanned).length} of {cashVerification.returns.length} items scanned
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReturnScan('RET001')}
                    className="text-[#FF0000] hover:text-[#CC0000] hover:bg-red-50"
                  >
                    Scan QR
                  </Button>
                </div>
                <Button
                  onClick={() => dispatch(setVerificationStep('summary'))}
                  className="w-full bg-[#FF0000] hover:bg-[#CC0000] mt-4"
                >
                  Done
                </Button>
              </div>
            </div>
          )}

          {verificationStep === 'summary' && (
            <div className="py-4 space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Cash Collection</div>
                  <div className="flex items-center justify-between">
                    <div>Expected Amount</div>
                    <div className="font-medium">{formatMoney(cashVerification.expectedAmount)}</div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div>Actual Amount</div>
                    <div className="font-medium">{formatMoney(cashVerification.actualAmount)}</div>
                  </div>
                  {cashVerification.actualAmount !== cashVerification.expectedAmount && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Amount mismatch</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Returns</div>
                  <div className="space-y-2">
                    {cashVerification.returns.map((ret: Return) => (
                      <div key={ret.id} className="flex items-center justify-between">
                        <div>{ret.id}</div>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full bg-[#FF0000] hover:bg-[#CC0000]"
              >
                Complete Verification
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
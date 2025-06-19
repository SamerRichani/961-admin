import React, { useEffect } from 'react';
import { Download } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import VATSummary from '@/app/features/finance/components/VATPage/VATSummary';
import VATDetails from '@/app/features/finance/components/VATPage/VATDetails';
import VATReport from '@/app/features/finance/components/VATPage/VATReport';
import { PeriodSelector } from '@/app/features/finance/components/VATPage/PeriodSelector';
import { VATTabs } from '@/app/features/finance/components/VATPage/VATTabs';
import { setPeriod, setActiveTab, setPeriods, setLoading, setError } from '@/app/features/finance/redux/VATSlice';
import { RootState } from '@/redux/store';
import { API_BASE_URL } from '@/app/config';


const VAT = () => {
  const dispatch = useDispatch();
  const { period, activeTab, periods, loading, error } = useSelector((state: RootState) => state.vat);

  useEffect(() => {
    const fetchVATData = async () => {
      try {
        dispatch(setLoading(true));
        const [periodsResponse, summariesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/finance/vat/periods`),
          fetch(`${API_BASE_URL}/finance/vat/summaries`)
        ]);

        if (!periodsResponse.ok || !summariesResponse.ok) {
          throw new Error('Failed to fetch VAT data');
        }

        const periodsData = await periodsResponse.json();
        const summariesData = await summariesResponse.json();

        dispatch(setPeriods(periodsData));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchVATData();
  }, [dispatch]);

  const handleExport = () => {
    if (!currentPeriod) return;

    const headers = [
      "Period",
      "Taxable Sales",
      "VAT Collected",
      "Change Percentage",
      "Standard Rate Amount (11%)",
      "Zero Rate Amount (0%)",
      "Standard Rate Percentage",
      "Zero Rate Percentage"
    ];

    const formatMoney = (amount: number) => {
      return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatPercentage = (value: number) => {
      return `${value.toFixed(2)}%`;
    };

    const calculateRatePercentage = (amount: number, total: number) => {
      return total > 0 ? (amount / total) * 100 : 0;
    };

    const csvContent = [
      headers.join(","),
      [
        currentPeriod.period,
        formatMoney(currentPeriod.totalTaxableSales || 0),
        formatMoney(currentPeriod.totalVatCollected || 0),
        formatPercentage(currentPeriod.changePercentage || 0),
        formatMoney(currentPeriod.standardRateAmount || 0),
        formatMoney(currentPeriod.zeroRateAmount || 0),
        formatPercentage(calculateRatePercentage(currentPeriod.standardRateAmount || 0, currentPeriod.totalTaxableSales || 0)),
        formatPercentage(calculateRatePercentage(currentPeriod.zeroRateAmount || 0, currentPeriod.totalTaxableSales || 0))
      ].join(",")
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `vat_report_${currentPeriod.period}.csv`;
    link.click();
  };

  const currentPeriod = periods.find(p => p.period === period);

  if (loading) {
    return <div className="flex-1 p-8 bg-gray-50">Loading...</div>;
  }

  if (error) {
    return <div className="flex-1 p-8 bg-gray-50 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 relative">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">VAT Collection</h1>
            <p className="text-sm text-gray-500 mt-1">Abbass: move this page to under Revenue or Financials in the main admin panel</p>
          </div>
          <div className="flex items-center space-x-4">
            <PeriodSelector value={period} onChange={(value) => dispatch(setPeriod(value))} />
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        <VATTabs activeTab={activeTab} onTabChange={(tab) => dispatch(setActiveTab(tab))} />

        {activeTab === 'summary' && <VATSummary period={currentPeriod} />}
        {activeTab === 'details' && <VATDetails period={currentPeriod} />}
        {activeTab === 'report' && <VATReport period={currentPeriod} />}
      </div>
    </div>
  );
};

export default VAT;
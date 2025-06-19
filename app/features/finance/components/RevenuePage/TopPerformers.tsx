import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, ShoppingBag } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import type { RootState } from "@/redux/store";
import { useEffect } from "react";
import { 
  setTopCreators, 
  setTopLocations, 
  setTopAdvertisers,
  setLoading,
  setError 
} from "@/app/features/finance/redux/topPerformersSlice";

export function TopPerformers() {
  const dispatch = useAppDispatch();
  const { topCreators, topLocations, topAdvertisers, loading, error } = useAppSelector(
    (state: RootState) => state.topPerformers
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        const [creators, locations, advertisers] = await Promise.all([
          fetch('http://localhost:3001/api/finance/revenue/top/creators').then(res => res.json()),
          fetch('http://localhost:3001/api/finance/revenue/top/locations').then(res => res.json()),
          fetch('http://localhost:3001/api/finance/revenue/top/advertisers').then(res => res.json()),
        ]);
        dispatch(setTopCreators(creators));
        dispatch(setTopLocations(locations));
        dispatch(setTopAdvertisers(advertisers));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Top 10 Creators</h2>
        <div className="space-y-4">
          {topCreators.map((creator) => (
            <div key={creator._id} className="flex items-center gap-4">
              <Avatar className="shrink-0">
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{creator.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {creator.totalActiveUsers} active users
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-medium">{formatMoney(creator.totalRevenue)}</p>
                <p className="text-sm text-gray-500">
                  {formatMoney(creator.averageRevenuePerUser)} per user
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Top 10 Places</h2>
        <div className="space-y-4">
          {topLocations.map((location) => (
            <div key={`${location._id.country}-${location._id.region}-${location._id.city}`} 
                 className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{location._id.city}</p>
                <p className="text-sm text-gray-500 truncate">
                  {location._id.region}, {location._id.country}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-medium">{formatMoney(location.totalRevenue)}</p>
                <p className="text-sm text-gray-500">
                  {formatMoney(location.averageRevenuePerUser)} per user
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Top 10 Advertisers</h2>
        <div className="space-y-4">
          {topAdvertisers.map((advertiser) => (
            <div key={advertiser._id} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <ShoppingBag className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{advertiser.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {advertiser.totalActiveUsers} active users
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-medium">{formatMoney(advertiser.totalRevenue)}</p>
                <p className="text-sm text-gray-500">
                  {formatMoney(advertiser.averageRevenuePerUser)} per user
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
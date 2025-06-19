"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CoinData } from "../../types";

export function CoinPackages() {
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/coins`);
        if (!response.ok) {
          throw new Error('Failed to fetch coin data');
        }
        const data = await response.json();
        setCoinData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading coin data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (!coinData) {
    return null;
  }

  return null
} 
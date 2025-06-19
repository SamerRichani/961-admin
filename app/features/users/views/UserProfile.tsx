"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  Heart,
  Globe2,
  MapPin,
  Car,
  User as UserIcon,
  Droplet,
  Home,
  CreditCard,
  Wallet,
  Star,
  CircleDollarSign,
  ShieldCheck,
  ShieldX,
  Eye,
  Download,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { calculateAge } from "@/app/features/users/utils/date";
import { InfoItem } from "@/app/features/users/components/UserPofile/InfoItem";
import { useRouter } from "next/navigation";
import { type User } from "@/app/features/users/types";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setUserId, setPage } from '@/components/sidebar/redux/navigationSlice';

export function UserProfile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.navigation.userId);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    dispatch(setPage('users'));
    dispatch(setUserId(undefined));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 w-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested user could not be found.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 w-full">
      {/* Header */}
      <div className="w-full">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full overflow-hidden mb-4">
              <img
                src={
                  user.avatarUrl ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&q=80"
                }
                alt={user.fullName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              {user.idVerified ? (
                <ShieldCheck
                  className="h-6 w-6 text-emerald-500"
                  aria-label="ID Verified"
                />
              ) : (
                <ShieldX
                  className="h-6 w-6 text-gray-400"
                  aria-label="ID Not Verified"
                />
              )}
            </div>
            <p className="text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/* ID Documents Section */}
        {user.idDocuments && user.idDocuments.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">ID Documents</h2>
            <div className="space-y-4">
              {user.idDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-500 mt-1" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium capitalize">
                        {doc.type.replace("_", " ")}
                      </p>
                      {doc.verified && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Document #{doc.documentNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                      {doc.verificationDate &&
                        ` • Verified: ${new Date(
                          doc.verificationDate
                        ).toLocaleDateString()}`}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="sm" className="h-7">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="h-7">
                        <Download className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Upload New ID Document
              </Button>
            </div>
          </Card>
        )}

        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <InfoItem
            icon={<Droplet className="h-5 w-5 text-red-500" />}
            label="Blood Type"
            value={user.bloodType || "Not specified"}
          />
          <InfoItem
            icon={<Phone className="h-5 w-5 text-blue-500" />}
            label="Phone"
            value={user.phone || "Not specified"}
          />
          <InfoItem
            icon={<Mail className="h-5 w-5 text-purple-500" />}
            label="Email"
            value={user.email}
          />
          <InfoItem
            icon={<UserIcon className="h-5 w-5 text-orange-500" />}
            label="Gender"
            value={
              user.gender
                ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                : "Not specified"
            }
          />
          <InfoItem
            icon={<UserIcon className="h-5 w-5 text-purple-500" />}
            label="Age"
            value={
              user.birthdate
                ? `${calculateAge(user.birthdate)} years (${new Date(
                    user.birthdate
                  ).toLocaleDateString()})`
                : "Not specified"
            }
          />
          <InfoItem
            icon={<UserIcon className="h-5 w-5 text-orange-500" />}
            label="Religion - Sect"
            value={user.religion || "Not specified"}
          />
          <InfoItem
            icon={<Globe2 className="h-5 w-5 text-green-500" />}
            label="Country"
            value={user.country || "Not specified"}
          />
          <InfoItem
            icon={<Globe2 className="h-5 w-5 text-teal-500" />}
            label="Language"
            value={user.language || "Not specified"}
          />
          <InfoItem
            icon={<Heart className="h-5 w-5 text-pink-500" />}
            label="Relationship Status"
            value={user.relationshipStatus || "Not specified"}
          />
          <InfoItem
            icon={<UserIcon className="h-5 w-5 text-gray-500" />}
            label="Sejel ID"
            value={user.sejelId || "Not specified"}
          />
          <InfoItem
            icon={<MapPin className="h-5 w-5 text-red-500" />}
            label="Area/District"
            value={user.district || "Not specified"}
          />
          {user.vehicle && (
            <>
              <InfoItem
                icon={<Car className="h-5 w-5 text-blue-500" />}
                label="Vehicle"
                value={`${user.vehicle.make} ${user.vehicle.model} - ${user.vehicle.color}`}
              />
              <InfoItem
                icon={<Car className="h-5 w-5 text-gray-500" />}
                label="Plate Number"
                value={user.vehicle.plate}
              />
            </>
          )}
        </div>

        {/* Wallet & Points */}
        {user.wallet && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Wallet Balance</h3>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                ${user.wallet.balance.toFixed(2)}
              </p>
            </Card>
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">Points</h3>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                {user.wallet.points.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <CircleDollarSign className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Coins</h3>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                {user.wallet.coins.toLocaleString()}
              </p>
            </Card>
          </div>
        )}

        {/* Addresses & Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold">
                Saved Addresses
              </h3>
              <Button variant="outline" size="sm">
                Add Address
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {user.addresses?.map((address, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Home className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{address.type}</p>
                      {address.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold">
                Payment Methods
              </h3>
              <Button variant="outline" size="sm">
                Add Payment
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {user.paymentMethods?.map((method, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <CreditCard className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {method.type === "card" ? "Card" : "Bank Account"} ••••{" "}
                        {method.last4}
                      </p>
                      {method.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    {method.expiryDate && (
                      <p className="text-sm text-gray-600">
                        Expires {method.expiryDate}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Analytics */}
        {user.analytics && (
          <Card className="bg-white p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              App Usage Analytics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Avg Session</p>
                <p className="text-lg sm:text-xl font-bold">
                  {user.analytics.avgTimeSpent}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Daily App Opens</p>
                <p className="text-lg sm:text-xl font-bold">
                  {user.analytics.dailyAppOpens}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Time Spent</p>
                <p className="text-lg sm:text-xl font-bold">
                  {user.analytics.totalTimeSpent}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">User Since</p>
                <p className="text-lg sm:text-xl font-bold">
                  {user.analytics.joinedSince}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Financial Activity */}
        {user.financials && (
          <Collapsible className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6 sm:mb-8">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h2 className="text-lg sm:text-xl font-semibold">
                Financial Activity
              </h2>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                ${user.financials.totalSpent.toLocaleString()}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 sm:pt-6">
              <div className="space-y-4">
                <h3 className="font-medium mb-3">Purchase History</h3>
                <div className="space-y-3">
                  {user.financials.purchases.map((purchase, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b last:border-0 gap-1 sm:gap-0"
                    >
                      <div className="flex items-center gap-2 sm:gap-4">
                        <p className="text-sm text-gray-500">{purchase.date}</p>
                        <p className="font-medium">{purchase.item}</p>
                      </div>
                      <p className="font-medium">
                        ${purchase.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <h3 className="font-medium mb-3 mt-6">Active Subscriptions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {user.financials.subscriptions.map((sub, index) => (
                    <Card key={index} className="p-3 sm:p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{sub.type}</h4>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              sub.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            )}
                          >
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Renews: {sub.renewalDate}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Engagement Analytics */}
        <Card className="mb-6 sm:mb-8">
          <Tabs defaultValue="polls" className="w-full">
            <TabsList className="w-full border-b rounded-none px-4 sm:px-6">
              <TabsTrigger value="polls" className="flex-1 sm:flex-none">
                Polls
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex-1 sm:flex-none">
                Post Activity
              </TabsTrigger>
            </TabsList>
            <div className="p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <Input placeholder="Search..." className="w-full sm:max-w-sm" />
              </div>
              <TabsContent value="polls" className="space-y-3 sm:space-y-4">
                {user.polls?.map((poll, index) => (
                  <div
                    key={index}
                    className="py-2 sm:py-3 border-b last:border-0"
                  >
                    <p className="font-medium">{poll.question}</p>
                    <p className="text-sm text-gray-600">{poll.answer}</p>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="posts" className="space-y-3 sm:space-y-4">
                {user.posts?.map((post, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b last:border-0 gap-1 sm:gap-0"
                  >
                    <p className="font-medium">{post.title}</p>
                    <span className="text-sm text-gray-500">
                      {post.interaction}
                    </span>
                  </div>
                ))}
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Location History */}
        <Card className="bg-white p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Location History
          </h2>
          <div className="bg-gray-100 rounded-lg h-[200px] sm:h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Location Data Visualization</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

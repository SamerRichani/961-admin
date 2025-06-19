"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Droplet,
  Calendar,
  MapPin,
  Users,
  Clock,
  Plus,
  Search,
  Ban,
} from "lucide-react";
import { formatNumber } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setActiveTab,
  setIsAddCenterOpen,
  setIsAddSuspendedOpen,
  setNewUsername,
  setSuspensionReason,
  setSearch,
  setHealthCenters,
  setSuspendedUsers,
  addHealthCenter,
  addSuspendedUser,
  removeSuspendedUser,
  resetForms,
} from "@/app/features/apps/redux/bloodSlice";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Default coordinates for Beirut
const DEFAULT_COORDINATES = {
  lat: 33.8938,
  lng: 35.5018
};

interface HealthCenter {
  _id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  __v: number;
}

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
}

interface SuspendedUser {
  _id: string;
  userId: string;
  type: string;
  reason: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  user?: User;
  suspendedAt: string;
}

export function BloodPage() {
  const dispatch = useAppDispatch();
  const {
    activeTab,
    isAddCenterOpen,
    isAddSuspendedOpen,
    newUsername,
    suspensionReason,
    healthCenters,
    suspendedUsers,
    search,
  } = useAppSelector((state) => state.blood);

  const [newCenterName, setNewCenterName] = useState("");
  const [newCenterLocation, setNewCenterLocation] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");

  // Fetch health centers on component mount
  useEffect(() => {
    const fetchHealthCenters = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/blood/health-centers`);
        if (!response.ok) {
          throw new Error('Failed to fetch health centers');
        }
        const data = await response.json();
        dispatch(setHealthCenters(data));
      } catch (error) {
        console.error('Error fetching health centers:', error);
        toast.error('Failed to load health centers', {
          description: 'Please refresh the page or contact support if the problem persists.',
        });
      }
    };

    fetchHealthCenters();
  }, [dispatch]);

  // Fetch suspended users
  useEffect(() => {
    const fetchSuspendedUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/blood/suspended-users?type=blood_donation&isActive=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch suspended users');
        }
        const data = await response.json();
        dispatch(setSuspendedUsers(data));
      } catch (error) {
        console.error('Error fetching suspended users:', error);
        toast.error('Failed to load suspended users', {
          description: 'Please refresh the page or contact support if the problem persists.',
        });
      }
    };

    fetchSuspendedUsers();
  }, [dispatch]);

  // Fetch all users when add suspended user dialog opens
  useEffect(() => {
    const fetchUsers = async () => {
      if (isAddSuspendedOpen) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          const data = await response.json();
          // Filter out users who are already suspended
          const nonSuspendedUsers = data.filter((user: any) => !user.isSuspended);
          setUsers(nonSuspendedUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
          toast.error('Failed to load users', {
            description: 'Please try again or contact support if the problem persists.',
          });
        }
      }
    };

    fetchUsers();
  }, [isAddSuspendedOpen]);

  const handleAddHealthCenter = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/blood/health-centers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCenterName,
          location: newCenterLocation,
          coordinates: DEFAULT_COORDINATES
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create health center');
      }

      const newCenter = await response.json();
      dispatch(addHealthCenter(newCenter));
      dispatch(setIsAddCenterOpen(false));
      
      // Reset form fields
      setNewCenterName("");
      setNewCenterLocation("");
      
      toast.success('Health center added successfully', {
        description: `${newCenter.name} has been added to the list of health centers.`,
      });
    } catch (error) {
      console.error('Error creating health center:', error);
      toast.error('Failed to add health center', {
        description: 'Please try again or contact support if the problem persists.',
      });
    }
  };

  const handleAddSuspendedUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/blood/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUserId,
          type: "blood_donation",
          reason: suspensionReason,
          expiresAt: expiresAt || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "User is already suspended") {
          toast.error('User is already suspended', {
            description: 'This user is already in the suspended list.',
          });
        } else {
          throw new Error(data.error || 'Failed to suspend user');
        }
        return;
      }

      dispatch(addSuspendedUser(data));
      dispatch(setIsAddSuspendedOpen(false));
      dispatch(resetForms());
      setSelectedUserId("");
      setExpiresAt("");
      
      toast.success('User suspended successfully', {
        description: `${data.user.fullName} has been added to the suspended list.`,
      });
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user', {
        description: 'Please try again or contact support if the problem persists.',
      });
    }
  };

  const handleRemoveSuspendedUser = async (suspensionId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/blood/suspended-users/${suspensionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove suspension');
      }

      dispatch(removeSuspendedUser(suspensionId));
      toast.success('Suspension removed successfully', {
        description: 'The user has been removed from the suspended list.',
      });
    } catch (error) {
      console.error('Error removing suspension:', error);
      toast.error('Failed to remove suspension', {
        description: 'Please try again or contact support if the problem persists.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <Droplet className="h-6 sm:h-8 w-6 sm:w-8 text-[#FF0000]" />
            <h1 className="text-xl sm:text-2xl font-semibold">
              Blood Donation Center
            </h1>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Droplet className="h-5 sm:h-6 w-5 sm:w-6 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Total Donations</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(1250)}
                </p>
                <p className="text-sm text-emerald-600">+12.5% this month</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Registered Donors</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(850)}
                </p>
                <p className="text-sm text-emerald-600">+8.2% this month</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Open Requests</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(8)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v: any) =>
            dispatch(setActiveTab(v as "centers" | "suspended"))
          }
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="centers" className="flex-1 sm:flex-none">
                Health Centers
              </TabsTrigger>
              <TabsTrigger value="suspended" className="flex-1 sm:flex-none">
                Suspended Users
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={`Search ${
                    activeTab === "centers" ? "centers" : "users"
                  }...`}
                  value={search}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  className="pl-9 w-full"
                />
              </div>
              <Button
                className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
                onClick={() =>
                  activeTab === "centers"
                    ? dispatch(setIsAddCenterOpen(true))
                    : dispatch(setIsAddSuspendedOpen(true))
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                {activeTab === "centers" ? "Add Center" : "Add User"}
              </Button>
            </div>
          </div>

          <TabsContent value="centers">
            <div className="space-y-4">
              {healthCenters.map((center) => (
                <Card key={center._id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {center.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{center.location}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto">
                      View on Map
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suspended">
            <div className="space-y-4">
              {suspendedUsers.map((user) => (
                <Card key={user._id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {user.user.fullName} (@{user.user.username})
                        </h3>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Suspended
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Ban className="h-4 w-4 flex-shrink-0" />
                          <span className="line-clamp-2">{user.reason}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Suspended on {new Date(user.suspendedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {user.expiresAt && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>
                              Expires on {new Date(user.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                      onClick={() => handleRemoveSuspendedUser(user._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Health Center Dialog */}
      <Dialog
        open={isAddCenterOpen}
        onOpenChange={(open) => dispatch(setIsAddCenterOpen(open))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Health Center</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Center Name</Label>
              <Input 
                placeholder="Enter center name" 
                value={newCenterName}
                onChange={(e) => setNewCenterName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input 
                placeholder="Enter location" 
                value={newCenterLocation}
                onChange={(e) => setNewCenterLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Map Location</Label>
              <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map Placeholder</p>
              </div>
              <p className="text-sm text-gray-500">
                Click on the map to set location
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => dispatch(setIsAddCenterOpen(false))}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
              onClick={handleAddHealthCenter}
              disabled={!newCenterName || !newCenterLocation}
            >
              Add Center
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Suspended User Dialog */}
      <Dialog
        open={isAddSuspendedOpen}
        onOpenChange={(open) => dispatch(setIsAddSuspendedOpen(open))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Suspended User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason for Suspension</Label>
              <Input
                placeholder="Enter reason"
                value={suspensionReason}
                onChange={(e) => dispatch(setSuspensionReason(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Expiration Date (Optional)</Label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                dispatch(setIsAddSuspendedOpen(false));
                setSelectedUserId("");
                setExpiresAt("");
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
              onClick={handleAddSuspendedUser}
              disabled={!selectedUserId || !suspensionReason}
            >
              Add to Suspended List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

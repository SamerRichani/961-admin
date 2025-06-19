"use client";

import { useCallback, useEffect } from "react";
import { Users, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UsersList } from "@/app/features/users/components/UsersPage/UsersList";
import { TeamPage } from "@/app/features/users/views/TeamPage";
import { ModerationDialog } from "@/app/features/users/components/UsersPage/ModerationDialog";
import UserDialog from "@/app/features/users/components/UsersPage/UserDialog";
import { type User } from "@/app/features/users/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSelectedUser,
  setIsDialogOpen,
  setModeratingUser,
  setIsModerationOpen,
  setSearch,
  setPage,
  setUsers,
  setFilteredUsers,
  setTotalPages,
  setActiveTab,
  setLoading,
  setError,
} from "@/app/features/users/redux/usersSlice";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export function UsersPage() {
  const dispatch = useAppDispatch();
  const {
    activeTab,
    selectedUser,
    search,
    users,
    isLoading,
    error,
  } = useAppSelector((state) => state.users);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setLoading(true));
        const response = await fetch('http://localhost:3001/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        dispatch(setUsers(data));
        dispatch(setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE)));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleEditUser = useCallback(
    (user: User) => {
      dispatch(setSelectedUser(user));
      dispatch(setIsDialogOpen(true));
    },
    [dispatch]
  );

  const handleSaveUser = useCallback(
    async (data: Partial<User>) => {
      try {
        dispatch(setLoading(true));
        if (selectedUser) {
          // Update existing user
          const response = await fetch(`http://localhost:3001/api/users/${selectedUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fullName: data.fullName,
              username: data.username,
              role: data.role,
              gender: data.gender,
              birthdate: data.birthdate,
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to update user');
          }
          
          const updatedUser = await response.json();
          const updatedUsers = users.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          );
          dispatch(setUsers(updatedUsers));
          dispatch(setFilteredUsers(updatedUsers));
        } else {
          // Create new user
          if (!data.fullName || !data.username || !data.role || !data.gender || !data.birthdate) {
            throw new Error('All fields are required for creating a new user');
          }

          const response = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fullName: data.fullName,
              username: data.username,
              role: data.role,
              gender: data.gender,
              birthdate: data.birthdate,
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to create user');
          }
          
          const newUser = await response.json();
          const updatedUsers = [...users, newUser];
          dispatch(setUsers(updatedUsers));
          dispatch(setFilteredUsers(updatedUsers));
        }

        dispatch(setTotalPages(Math.ceil(users.length / ITEMS_PER_PAGE)));
        dispatch(setIsDialogOpen(false));
        dispatch(setSelectedUser(null));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, selectedUser, users]
  );

  const handleModerateUser = useCallback(
    (user: User) => {
      dispatch(setModeratingUser(user));
      dispatch(setIsModerationOpen(true));
    },
    [dispatch]
  );

  const handleModerationAction = useCallback(
    async (action: any) => {
      try {
        dispatch(setLoading(true));
        const response = await fetch(`http://localhost:3001/api/users/${action.userId}/moderate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(action),
        });
        
        if (!response.ok) {
          throw new Error('Failed to moderate user');
        }
        
        const updatedUser = await response.json();
        const updatedUsers = users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        dispatch(setUsers(updatedUsers));
        dispatch(setFilteredUsers(updatedUsers));
        dispatch(setIsModerationOpen(false));
        dispatch(setModeratingUser(null));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, users]
  );

  const handleSearch = useCallback(
    (value: string) => {
      dispatch(setSearch(value));
      const filtered = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(value.toLowerCase()) ||
          user.username.toLowerCase().includes(value.toLowerCase()) ||
          user.role.toLowerCase().includes(value.toLowerCase())
      );
      dispatch(setFilteredUsers(filtered));
      dispatch(setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE)));
    },
    [dispatch, users]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col max-w-none mt-16 sm:mt-0">
      <Tabs
        value={activeTab}
        onValueChange={(v) => dispatch(setActiveTab(v as "users" | "team"))}
        className="w-full"
      >
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
            </TabsList>

            {activeTab === "users" && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1 sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, username, or role"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <UserDialog onSubmit={handleSaveUser}>
                  <Button
                    size="sm"
                    className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </UserDialog>
              </div>
            )}
          </div>
        </div>

        <TabsContent value="users" className="flex-1">
          <div className="w-full h-full">
            <UsersList
              onEdit={handleEditUser}
              onModerate={handleModerateUser}
              onPageChange={handlePageChange}
            />
            <ModerationDialog onAction={handleModerationAction} />
          </div>
        </TabsContent>

        <TabsContent value="team" className="flex-1">
          <TeamPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}

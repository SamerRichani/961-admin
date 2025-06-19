"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TeamDialog, EditTeamDialog } from "../components/TeamPage/TeamDialog";
import {
  type TeamMember,
  type TeamRole,
  teamRoleConfig,
} from "@/app/features/users/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setTeamMembers,
  addTeamMember,
  removeTeamMember,
  setSearch,
  setRemovingMember,
  setLoading,
  setError,
} from "@/app/features/users/redux/teamSlice";

export function TeamPage() {
  const dispatch = useAppDispatch();
  const { teamMembers, search, removingMember, isLoading, error } = useAppSelector(
    (state) => state.team
  );
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        dispatch(setLoading(true));
        const response = await fetch('http://localhost:3001/api/teams');
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        const data = await response.json();
        dispatch(setTeamMembers(data));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTeamMembers();
  }, [dispatch]);

  const handleAddMember = useCallback(
    async (userId: string, role: TeamRole) => {
      try {
        dispatch(setLoading(true));
        const response = await fetch('http://localhost:3001/api/teams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, role }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add team member');
        }
        
        const newMember = await response.json();
        dispatch(addTeamMember(newMember));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const handleRemoveMember = useCallback(
    async (member: TeamMember) => {
      try {
        dispatch(setLoading(true));
        const response = await fetch(`http://localhost:3001/api/teams/${member._id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to remove team member');
        }
        
        dispatch(removeTeamMember(member._id));
        dispatch(setRemovingMember(null));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const handleEditMember = useCallback(
    async (memberId: string, role: TeamRole) => {
      try {
        dispatch(setLoading(true));
        const response = await fetch(`http://localhost:3001/api/teams/${memberId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update team member');
        }
        
        const updatedMember = await response.json();
        const updatedMembers = teamMembers.map((member) =>
          member._id === updatedMember._id ? updatedMember : member
        );
        dispatch(setTeamMembers(updatedMembers));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, teamMembers]
  );

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      member.user.username.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team members...</p>
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
    <div className="w-full h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search team members..."
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="pl-9 h-9"
              />
            </div>
          </div>
          <TeamDialog onAddMember={handleAddMember}>
            <Button
              size="sm"
              className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </TeamDialog>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Username</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Added</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
                  <th className="w-24 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMembers.map((member) => {
                  const role = teamRoleConfig[member.role];
                  const initials = member.user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <tr key={member._id}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.user.avatarUrl} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium truncate max-w-[200px]">
                            {member.user.fullName}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500">
                        @{member.user.username}
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(member.addedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`${role.color.bg} ${role.color.text} px-2 py-1 rounded-full text-xs font-medium`}
                        >
                          {role.label}
                        </span>
                      </td>
                      <td className="p-4">
                        {member.role !== "super_admin" && (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-100"
                              onClick={() => setEditingMember(member)}
                            >
                              <Pencil className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-100"
                              onClick={() => dispatch(setRemovingMember(member))}
                            >
                              <Trash2 className="h-4 w-4 text-gray-600" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!removingMember}
        onOpenChange={(open) => !open && dispatch(setRemovingMember(null))}
      >
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {removingMember?.user.fullName}{" "}
              from the team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                removingMember && handleRemoveMember(removingMember)
              }
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditTeamDialog
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onEditMember={handleEditMember}
      />
    </div>
  );
}

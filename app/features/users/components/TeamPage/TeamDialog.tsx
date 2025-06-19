"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { type TeamRole, teamRoleConfig } from "@/app/features/users/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setTeamSearch } from "@/app/features/users/redux/usersSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TeamMember } from "@/app/features/users/types";

interface TeamDialogProps {
  children: React.ReactNode;
  onAddMember: (userId: string, role: TeamRole) => void;
}

export function TeamDialog({ children, onAddMember }: TeamDialogProps) {
  const dispatch = useAppDispatch();
  const { teamSearch } = useAppSelector((state) => state.users);
  const { teamMembers } = useAppSelector((state) => state.team);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<TeamRole>("staff");
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users for the dialog
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter out users that are already team members
  const filteredUsers = users.filter(
    (user) =>
      (user.username.toLowerCase().includes(teamSearch.toLowerCase()) ||
        user.fullName.toLowerCase().includes(teamSearch.toLowerCase())) &&
      !teamMembers.some((member) => member.userId === user._id)
  );

  const handleSubmit = useCallback(() => {
    if (selectedUser) {
      onAddMember(selectedUser, selectedRole);
      setSelectedUser(null);
      dispatch(setTeamSearch(""));
    }
  }, [selectedUser, selectedRole, onAddMember, dispatch]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name or username"
              value={teamSearch}
              onChange={(e) => dispatch(setTeamSearch(e.target.value))}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-4">
              <p>Error: {error}</p>
            </div>
          ) : teamSearch && (
            <div className="border rounded-lg divide-y max-h-48 overflow-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`p-2 cursor-pointer hover:bg-gray-50 ${
                    selectedUser === user._id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => setSelectedUser(user._id)}
                >
                  <div className="font-medium">{user.fullName}</div>
                  <div className="text-sm text-gray-500">@{user.username}</div>
                </div>
              ))}
            </div>
          )}

          <div>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as TeamRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(teamRoleConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    <span
                      className={`${config.color.bg} ${config.color.text} px-2 py-1 rounded-full text-xs font-medium`}
                    >
                      {config.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button
              onClick={handleSubmit}
              disabled={!selectedUser}
              className="bg-[#FF0000] hover:bg-[#CC0000]"
            >
              Add Member
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface EditTeamDialogProps {
  member: TeamMember | null;
  onClose: () => void;
  onEditMember: (memberId: string, role: TeamRole) => void;
}

export function EditTeamDialog({ member, onClose, onEditMember }: EditTeamDialogProps) {
  const [selectedRole, setSelectedRole] = useState<TeamRole>(member?.role || "staff");

  const handleSubmit = useCallback(() => {
    if (member) {
      onEditMember(member._id, selectedRole);
      onClose();
    }
  }, [member, selectedRole, onEditMember, onClose]);

  return (
    <Dialog open={!!member} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team Member Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {member && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.user.avatarUrl} />
                <AvatarFallback>
                  {member.user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{member.user.fullName}</div>
                <div className="text-sm text-gray-500">@{member.user.username}</div>
              </div>
            </div>
          )}

          <div>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as TeamRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(teamRoleConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    <span
                      className={`${config.color.bg} ${config.color.text} px-2 py-1 rounded-full text-xs font-medium`}
                    >
                      {config.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#FF0000] hover:bg-[#CC0000]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

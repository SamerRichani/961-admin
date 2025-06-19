"use client";

import { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  type User,
  type UserRole,
  roleConfig,
} from "@/app/features/users/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setIsDialogOpen,
  setSelectedUser,
  setFormFullName,
  setFormUsername,
  setFormRole,
  setFormAvatarUrl,
  setFormGender,
  setFormBirthdate,
  resetForm,
  initializeForm,
} from "@/app/features/users/redux/usersSlice";

interface UserDialogProps {
  children: React.ReactNode;
  onSubmit: (data: Partial<User>) => void;
}

export default function UserDialog({ children, onSubmit }: UserDialogProps) {
  const dispatch = useAppDispatch();
  const {
    selectedUser,
    isDialogOpen,
    formFullName,
    formUsername,
    formRole,
    formAvatarUrl,
    formGender,
    formBirthdate,
  } = useAppSelector((state) => state.users);

  // Initialize form when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      dispatch(initializeForm(selectedUser));
    } else {
      dispatch(resetForm());
    }
  }, [selectedUser, dispatch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validate required fields for new user
      if (!selectedUser && (!formFullName || !formUsername || !formRole || !formGender || !formBirthdate)) {
        return;
      }

      // Format birthdate to match API format
      const formattedBirthdate = formBirthdate ? new Date(formBirthdate).toISOString() : undefined;

      onSubmit({
        ...(selectedUser ? { _id: selectedUser._id } : {}),
        fullName: formFullName,
        username: formUsername,
        role: formRole,
        gender: formGender,
        birthdate: formattedBirthdate,
        ...(formAvatarUrl ? { avatarUrl: formAvatarUrl } : {}),
      });
      dispatch(setIsDialogOpen(false));
      dispatch(setSelectedUser(null));
      dispatch(resetForm());
    },
    [
      selectedUser,
      formFullName,
      formUsername,
      formRole,
      formAvatarUrl,
      formGender,
      formBirthdate,
      onSubmit,
      dispatch,
    ]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        dispatch(setIsDialogOpen(true));
        dispatch(setSelectedUser(null));
        dispatch(resetForm());
      } else {
        dispatch(setIsDialogOpen(false));
        dispatch(setSelectedUser(null));
        dispatch(resetForm());
      }
    },
    [dispatch]
  );

  const initials = formFullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Format birthdate for display in the input
  const displayBirthdate = formBirthdate ? new Date(formBirthdate).toISOString().split('T')[0] : '';

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {selectedUser ? "Edit User" : "Add New User"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex justify-center relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={formAvatarUrl} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            {formAvatarUrl && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 h-6 w-6 bg-white hover:bg-red-50 hover:text-red-600 border-gray-200"
                onClick={() => dispatch(setFormAvatarUrl(undefined))}
              >
                <Trash2 className="h-3 w-3 text-gray-500" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="required">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formFullName}
                onChange={(e) => dispatch(setFormFullName(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="username" className="required">
                Username
              </Label>
              <Input
                id="username"
                value={formUsername}
                onChange={(e) => dispatch(setFormUsername(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="role" className="required">
                Role
              </Label>
              <Select
                value={formRole}
                onValueChange={(value) =>
                  dispatch(setFormRole(value as UserRole))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleConfig).map(([value, config]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <config.icon className="h-4 w-4" />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender" className="required">
                Gender
              </Label>
              <Select
                value={formGender}
                onValueChange={(value: "male" | "female" | "other") =>
                  dispatch(setFormGender(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="birthdate" className="required">
                Birthdate
              </Label>
              <div className="relative">
                <Input
                  id="birthdate"
                  type="date"
                  value={displayBirthdate}
                  onChange={(e) => dispatch(setFormBirthdate(e.target.value))}
                  required
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                dispatch(setIsDialogOpen(false));
                dispatch(setSelectedUser(null));
                dispatch(resetForm());
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FF0000] hover:bg-[#CC0000]">
              {selectedUser ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

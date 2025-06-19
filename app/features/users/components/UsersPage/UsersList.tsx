import {
  Pencil,
  Shield,
  Search,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type User } from "@/app/features/users/types";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";
import { memo, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setPage, setUserId } from "@/components/sidebar/redux/navigationSlice";

interface UserItemProps {
  user: User;
  onEdit: (user: User) => void;
  onModerate: (user: User) => void;
}

const UserItem = memo(function UserItem({
  user,
  onEdit,
  onModerate,
}: UserItemProps) {
  const dispatch = useAppDispatch();
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const duration = useMemo(
    () => formatDuration(user.createdAt),
    [user.createdAt]
  );

  const handleUserClick = () => {
    dispatch(setUserId(user._id));
    dispatch(setPage("users/[id]"));
  };

  return (
    <div className="grid grid-cols-[1fr,200px,200px,100px] gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 hover:bg-gray-50">
      <div className="flex items-center gap-2 sm:gap-3">
        <Avatar
          className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer"
          onClick={handleUserClick}
        >
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={handleUserClick}
        >
          <span className="font-medium text-sm sm:text-base">
            {user.fullName}
          </span>
          <div className="flex items-center gap-1">
            {user.idVerified ? (
              <ShieldCheck
                className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500"
                aria-label="ID Verified"
              />
            ) : (
              <ShieldX
                className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
                aria-label="ID Not Verified"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center text-gray-500 text-sm sm:text-base">
        @{user.username}
      </div>
      <div className="flex items-center text-gray-500 text-sm sm:text-base">
        {duration}
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <span
          className={cn(
            "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-red-50 text-red-700"
          )}
        >
          961
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-gray-100"
          title="Moderate User"
          onClick={() => onModerate(user)}
        >
          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-gray-100"
          title="Edit User"
          onClick={() => onEdit(user)}
        >
          <Pencil className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
});

interface UsersListProps {
  onEdit: (user: User) => void;
  onModerate: (user: User) => void;
  onPageChange: (page: number) => void;
}

export const UsersList = memo(function UsersList({
  onEdit,
  onModerate,
  onPageChange,
}: UsersListProps) {
  const { filteredUsers, page, totalPages } = useAppSelector(
    (state) => state.users
  );

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="border-b">
            <div className="grid grid-cols-[1fr,200px,200px,100px] gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 bg-gray-50 w-full">
              <div className="text-xs sm:text-sm font-medium text-gray-500">
                Name
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-500">
                Username
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-500">
                User For
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-500">
                Type
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                onEdit={onEdit}
                onModerate={onModerate}
              />
            ))}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-t gap-2 sm:gap-4">
          <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            Showing {(page - 1) * 20 + 1} to{" "}
            {Math.min(page * 20, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="h-7 sm:h-8 text-xs sm:text-sm"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <div
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded cursor-pointer text-xs sm:text-sm",
                    page === p ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                  )}
                >
                  {p}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="h-7 sm:h-8 text-xs sm:text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

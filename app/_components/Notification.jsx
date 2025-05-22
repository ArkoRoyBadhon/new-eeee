import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  deleteNotification,
  markNotificationAsRead,
} from "@/lib/store/slices/notificationSlice";
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

const Notification = ({ userRole }) => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);
  const hasUnread = notifications.some((notification) => !notification.read);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleDelete = (notificationId) => {
    dispatch(deleteNotification(notificationId))
      .unwrap()
      .then(() => toast.success("Notification deleted"))
      .catch((err) => toast.error(err || "Failed to delete notification"));
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId))
      .unwrap()
      .then(() => toast.success("Notification marked as read"))
      .catch((err) => toast.error(err || "Failed to mark as read"));
  };

  const filteredNotifications = notifications.filter((notification) => notification.role === userRole);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="size-5 text-green-500" />;
      case "error":
        return <AlertCircle className="size-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="size-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="size-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-6" />
            {hasUnread && (
              <div className="absolute size-3 bg-[#05A72C] rounded-full top-0 right-0 border-[2px] border-white animate-ping" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {loading ? (
            <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
          ) : error ? (
            <DropdownMenuItem disabled>Error: {error}</DropdownMenuItem>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                className="relative py-3 flex items-start gap-2"
                onClick={() => !notification.read && handleMarkAsRead(notification._id)}
              >
                {getIcon(notification.type)}
                <div className="flex-1">
                  <Link href={notification.link || "#"} className="block">
                    <div className="flex flex-col">
                      <span
                        className={`font-medium ${
                          notification.read ? "text-gray-500" : "text-black"
                        }`}
                      >
                        {notification.message}
                      </span>
                      <span className="text-sm text-gray-500">
                        {notification.module.toUpperCase()} •{" "}
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification._id);
                  }}
                >
                  <X className="size-4" />
                </Button>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Notification;
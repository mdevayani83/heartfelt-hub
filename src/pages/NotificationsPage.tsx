import { useApp } from "@/context/AppContext";
import { Bell, MessageCircle, Package, Heart, CreditCard } from "lucide-react";

const typeIcons: Record<string, any> = {
  order: Package,
  donation: Heart,
  chat: MessageCircle,
  payment: CreditCard,
};

const NotificationsPage = () => {
  const { user, notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const myNotifications = notifications.filter((n) => n.userId === user?.username);
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-7 w-7 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead} className="text-sm font-medium text-primary hover:underline">
            Mark all read
          </button>
        )}
      </div>

      {myNotifications.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No notifications</p>
      ) : (
        <div className="space-y-2">
          {myNotifications.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <div
                key={n.id}
                onClick={() => !n.read && markNotificationRead(n.id)}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  n.read ? "border-border bg-card" : "border-primary/20 bg-primary/5"
                }`}
              >
                <div className={`mt-0.5 rounded-lg p-2 ${n.read ? "bg-secondary" : "bg-primary/10"}`}>
                  <Icon className={`h-4 w-4 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${n.read ? "text-muted-foreground" : "font-medium text-foreground"}`}>{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && <div className="mt-1 h-2 w-2 rounded-full bg-primary" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

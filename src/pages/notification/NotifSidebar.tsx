import { useNotificationStore } from "@/store/notificationStore"
import { X, BellOff } from "lucide-react"
import { createPortal } from "react-dom"
import { useActivityEvents, type ActivityEvent } from "@/hooks/useActivityEvents"
import { Button } from "@/components/ui/button"
import { timeAgo, truncate } from "@/components/utils/miniUtils"
import { Link } from "react-router-dom"
import { useEffect } from "react"

const DOT_COLOR: Record<ActivityEvent["type"], string> = {
  todo:    "bg-violet-500",
  article: "bg-cyan-500",
}

function NotifSidebar() {
  const isOpen      = useNotificationStore((s) => s.isOpen)
  const close       = useNotificationStore((s) => s.close)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const lastChecked = useNotificationStore((s) => s.lastChecked)

  const { unreadCount, limited: allEvents } = useActivityEvents(50, lastChecked)

  const visibleEvents = lastChecked
  ? allEvents.filter((e) => new Date(e.timestamp) > new Date(lastChecked))
  : allEvents

  // ✅ Escape key — with cleanup
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    if (isOpen) document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, close])

  return createPortal(
    <>
      {/* Overlay */}
      {isOpen && (
        <div onClick={close}
             className="fixed inset-0 bg-black/50 backdrop-blur-md z-[998]" />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-80
                       flex flex-col
                       bg-card border-l border-border
                       transition-transform duration-300 z-[999]
                       ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header — fixed, never scrolls */}
        <div className="flex-shrink-0 px-4 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              Notifications
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({unreadCount} unread)
              </span>
            </span>
            <Button variant="ghost" type="button"
                    className="h-8 w-8 p-0 rounded-full hover:bg-muted"
                    onClick={close}>
              <X size={16} className="text-muted-foreground" />
            </Button>
          </div>

          <div className="h-px bg-border my-3" />

          {/* Mark all read — only shows when unread exist */}
          {unreadCount > 0 && (
            <div className="flex justify-end mb-2">
              <Button variant="ghost" type="button"
                      onClick={markAllRead}
                      className="text-xs text-primary h-7 px-2
                                 hover:bg-primary/10">
                Mark all as read
              </Button>
            </div>
          )}
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-6 space-y-2">

          {visibleEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center
                            h-full py-12 text-center">
              <BellOff size={32} className="text-muted-foreground mb-3 opacity-40" />
              <p className="text-sm font-medium text-muted-foreground">
                No activity yet
              </p>
            </div>
          ) : (
            visibleEvents.map((event, index) => {
              // Check if this specific event is unread
              // Unread = no lastChecked OR event timestamp is newer than lastChecked
              const isUnread = !lastChecked ||
                new Date(event.timestamp) > new Date(lastChecked)

              return (
                <div key={`${event.id}-${index}`}
                     className={`
                       relative p-3 rounded-xl border
                       transition-all duration-150 group
                       ${isUnread
                         // Unread: primary border + subtle bg
                         ? "border-primary/40 bg-primary/5 hover:border-primary hover:bg-primary/10"
                         // Read: default border + accent on hover
                         : "border-border bg-transparent hover:border-accent/50 hover:bg-muted/30"
                       }
                     `}>

                  {/* Unread dot indicator — top right corner */}
                  {isUnread && (
                    <div className="absolute top-3 right-3
                                    w-1 h-1/2 rounded-full bg-primary" />
                  )}

                  {/* Type dot + action */}
                  <div className="flex items-start gap-2.5">
                    {/* Colored dot for type */}
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5
                                     ${DOT_COLOR[event.type]}`} />

                    <div className="flex-1 min-w-0">
                      {/* Action + title */}
                      <p className="text-sm leading-relaxed">
                        <span className="text-muted-foreground">
                          {event.action}{" "}
                        </span>
                        <Link
                          to={event.link}
                          onClick={close}
                          className={`font-medium hover:underline
                                      underline-offset-2 break-words
                                      ${event.type === "todo"
                                        ? "text-violet-400 hover:text-violet-300"
                                        : "text-cyan-400 hover:text-cyan-300"}`}>
                          "{truncate(event.title, 30)}"
                        </Link>
                      </p>

                      {/* Timestamp */}
                      <span className="text-[11px] text-muted-foreground mt-1 block">
                        {timeAgo(event.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>,
    document.body
  )
}

export default NotifSidebar
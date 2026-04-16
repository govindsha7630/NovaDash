//utils/formatDate
 function formatDate(date?: string) {
  if (!date) return "No due date";

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) return "Invalid date";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}
// utils/timeAgo.ts

function timeAgo(date?: string): string {
  if (!date) return "No date";

  const now = new Date();
  const past = new Date(date);

  if (isNaN(past.getTime())) return "Invalid date";

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // seconds
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  // minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min ago`;
  }

  // hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // weeks
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  // months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  // years
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}


//utils/priority Classname
 function recentTaskTagColor(priority: string) {
  if (priority === "high") {
    return "bg-[rgba(255,86,86,0.12)] p-1 rounded-sm text-red-400 text-xs ";
  } else if (priority === "medium") {
    return "bg-cyan-700/20 p-1 rounded-sm text-accent text-xs";
  } else {
    return "bg-amber-600/20 p-1 rounded-sm  text-amber-400 text-xs";
  }
}

// utils/string.js
 function capitalize(str: string ) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export {truncate,capitalize,formatDate,timeAgo,recentTaskTagColor}
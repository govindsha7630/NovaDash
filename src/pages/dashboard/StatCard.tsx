import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
    title: string
    count: number
    icon: React.ReactNode
    trend?: number        // e.g. 12 means +12%, -3 means -3%
    isLoading?: boolean
}

function StatCard({ title, count, icon, trend, isLoading }: StatCardProps) {

    if (isLoading) {
        return (
            <Card className="flex-1 px-4 py-4 animate-pulse">
                <div className="h-10 w-10 bg-muted rounded-lg mb-3" />
                <div className="h-3 w-24 bg-muted rounded mb-2" />
                <div className="h-7 w-16 bg-muted rounded" />
            </Card>
        )
    }

    const isPositive = (trend ?? 0) >= 0

    return (
        <Card className="flex-1 px-4 py-4 hover:-translate-y-1 transition-all">
            <div className="flex items-start justify-between mb-1 ">
                {icon}
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-medium 
                                    ${isPositive ? "text-green-500" : "text-red-500"}`}>
                        {isPositive
                            ? <TrendingUp size={12} />
                            : <TrendingDown size={12} />
                        }
                        {isPositive ? "+" : ""}{trend}%
                    </div>
                )}
            </div>
            <p className="text-lg font-medium text-muted-foreground mb-1    ">{title}</p>
            <p className="text-2xl font-bold text-foreground ">{count}</p>
        </Card>
    )
}
export default StatCard;
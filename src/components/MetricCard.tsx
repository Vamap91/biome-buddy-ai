
import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

const MetricCard = ({ title, value, icon, trend, className = "" }: MetricCardProps) => {
  const isPositiveTrend = trend && trend.value > 0;
  const isNegativeTrend = trend && trend.value < 0;
  
  return (
    <Card className={`hover-lift bg-card-gradient border-0 shadow-soft ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center text-white text-sm">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <Badge 
              variant="secondary" 
              className={`${
                isPositiveTrend 
                  ? 'bg-success/10 text-success hover:bg-success/20' 
                  : isNegativeTrend
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : 'bg-muted'
              }`}
            >
              {isPositiveTrend ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : isNegativeTrend ? (
                <TrendingDown className="w-3 h-3 mr-1" />
              ) : null}
              {Math.abs(trend.value)}% {trend.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;

import { Clock, Users, Camera } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface Plan {
  id: string;
  name: string;
  image: string;
  price: string;
  duration: string;
  capacity: string;
  highlight: string;
}

interface PlanCardProps {
  plan: Plan;
  onDetailsClick: () => void;
}

export function PlanCard({ plan, onDetailsClick }: PlanCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* プラン画像 */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={plan.image} 
          alt={plan.name}
          className="w-full h-full object-cover"
        />
        {plan.highlight && (
          <div className="absolute top-3 right-3 bg-[#F97316] text-white px-3 py-1 rounded-full text-sm">
            {plan.highlight}
          </div>
        )}
      </div>

      {/* プラン情報 */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-xl mb-2">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-[#0EA5E9]">{plan.price}</span>
            <span className="text-sm text-gray-500">円 / 人</span>
          </div>
        </div>

        {/* メタ情報 */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{plan.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{plan.capacity}</span>
          </div>
        </div>

        {/* ボタン */}
        <Button 
          onClick={onDetailsClick}
          variant="outline"
          className="w-full rounded-full border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white"
        >
          詳細を見る
        </Button>
      </div>
    </Card>
  );
}

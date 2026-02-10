import { X, Check, Clock, Users, MessageCircle, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface PlanDetails {
  id: string;
  name: string;
  image: string;
  price: string;
  duration: string;
  capacity: string;
  description: string;
  included: string[];
  schedule: { time: string; activity: string }[];
  items: string;
  cancellation: string;
  notes: string;
}

interface PlanModalProps {
  plan: PlanDetails | null;
  open: boolean;
  onClose: () => void;
  onBooking: () => void;
  onLineClick: () => void;
}

export function PlanModal({ plan, open, onClose, onBooking, onLineClick }: PlanModalProps) {
  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* ヘッダー画像 */}
        <div className="relative h-64">
          <img 
            src={plan.image} 
            alt={plan.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* プラン名・料金 */}
          <div>
            <DialogTitle className="text-2xl mb-3">{plan.name}</DialogTitle>
            <DialogDescription className="sr-only">
              {plan.description}
            </DialogDescription>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl text-[#0EA5E9]">{plan.price}</span>
              <span className="text-lg text-gray-500">円 / 人</span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{plan.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{plan.capacity}</span>
              </div>
            </div>
          </div>

          {/* 説明 */}
          <p className="text-gray-700">{plan.description}</p>

          {/* 含まれるもの */}
          <div>
            <h3 className="text-lg mb-3">含まれるもの</h3>
            <div className="grid gap-2">
              {plan.included.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <Check className="h-5 w-5 text-[#0EA5E9] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* スケジュール */}
          <div>
            <h3 className="text-lg mb-3">当日のスケジュール</h3>
            <div className="space-y-3">
              {plan.schedule.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="text-[#0EA5E9] font-medium w-16 shrink-0">{item.time}</div>
                  <div className="text-gray-700">{item.activity}</div>
                </div>
              ))}
            </div>
          </div>

          {/* アコーディオン */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="items">
              <AccordionTrigger>持ち物・服装</AccordionTrigger>
              <AccordionContent className="text-gray-700 whitespace-pre-line">
                {plan.items}
                <div className="mt-3 text-sm text-[#0EA5E9]">
                  わからない？ → <button onClick={onLineClick} className="underline">LINEで相談</button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cancellation">
              <AccordionTrigger>キャンセルポリシー</AccordionTrigger>
              <AccordionContent className="text-gray-700 whitespace-pre-line">
                {plan.cancellation}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notes">
              <AccordionTrigger>注意事項</AccordionTrigger>
              <AccordionContent className="text-gray-700 whitespace-pre-line">
                {plan.notes}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* CTAボタン */}
          <div className="space-y-3 pt-4 sticky bottom-0 bg-white pb-4">
            <Button 
              onClick={onBooking}
              size="lg"
              className="w-full h-14 text-lg bg-[#F97316] hover:bg-[#EA580C] rounded-full"
            >
              <Calendar className="mr-2 h-5 w-5" />
              このプランを予約
            </Button>
            
            <Button 
              onClick={onLineClick}
              size="lg"
              variant="outline"
              className="w-full rounded-full"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              LINEで相談する
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

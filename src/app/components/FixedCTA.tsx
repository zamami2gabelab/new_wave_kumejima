import { Calendar, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface FixedCTAProps {
  onBookingClick: () => void;
  onLineClick: () => void;
}

export function FixedCTA({ onBookingClick, onLineClick }: FixedCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex gap-3">
          <Button 
            onClick={onLineClick}
            size="lg"
            variant="outline"
            className="flex-1 h-12 rounded-full"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            LINE相談
          </Button>
          
          <Button 
            onClick={onBookingClick}
            size="lg"
            className="flex-[2] h-12 bg-[#F97316] hover:bg-[#EA580C] rounded-full"
          >
            <Calendar className="mr-2 h-5 w-5" />
            予約する
          </Button>
        </div>
      </div>
    </div>
  );
}

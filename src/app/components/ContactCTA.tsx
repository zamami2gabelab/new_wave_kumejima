import { Button } from "./ui/button";
import { Calendar, MessageCircle } from "lucide-react";

interface ContactCTAProps {
  onLineClick: () => void;
}

export function ContactCTA({ onLineClick }: ContactCTAProps) {
  return (
    <div className="text-center space-y-4">
      <p className="text-gray-600">お気軽にお問い合わせください。</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        <Button 
          onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfuguZcHrudvG_F8K5qfeww0pyad-6eMuzewPuCXE8xfVmWDQ/viewform?usp=publish-editor', '_blank')}
          size="lg"
          className="flex-1 h-12 bg-[#F97316] hover:bg-[#EA580C] rounded-full"
        >
          <Calendar className="mr-2 h-5 w-5" />
          お問い合わせ
        </Button>
        <Button 
          onClick={onLineClick}
          size="lg"
          variant="outline"
          className="flex-1 h-12 rounded-full"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          LINEで相談
        </Button>
      </div>
    </div>
  );
}

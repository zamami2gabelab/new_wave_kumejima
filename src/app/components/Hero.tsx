import { MessageCircle, Calendar } from "lucide-react";
import { Button } from "./ui/button";

interface HeroProps {
  onBookingClick: () => void;
  onLineClick: () => void;
}

export function Hero({ onBookingClick, onLineClick }: HeroProps) {
  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      {/* 背景画像 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/image/top.png)' 
        }}
      >
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40"></div>
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-12 px-4 text-white">
        <div className="w-full max-w-lg space-y-6 text-center mb-8">
          {/* キャッチコピー */}
          <h1 className="text-5xl leading-tight tracking-tight">
            360度
            <br />
            エメラルドの海へ
          </h1>
          
          <p className="text-lg text-white/90">
            久米島から15分。天国のような無人島へ
          </p>

          {/* CTAボタン */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={onBookingClick}
              size="lg"
              className="w-full h-14 text-lg bg-[#F97316] hover:bg-[#EA580C] rounded-full shadow-2xl"
            >
              <Calendar className="mr-2 h-5 w-5" />
              今すぐ予約する
            </Button>
            
            <Button 
              onClick={onLineClick}
              size="lg"
              variant="outline"
              className="w-full h-14 text-lg bg-white/95 hover:bg-white text-gray-900 rounded-full border-0 shadow-xl"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              LINEで相談する
            </Button>
          </div>
        </div>

        {/* スクロール誘導 */}
        <div className="animate-bounce text-white/70 text-sm">
          ↓ スクロール
        </div>
      </div>
    </div>
  );
}

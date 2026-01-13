import { Clock, Ticket, Waves } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface AdditionalOptionsProps {
  onBookingClick: (type: string) => void;
}

export function AdditionalOptions({ onBookingClick }: AdditionalOptionsProps) {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3">チケット＆ツアー</h2>
          <p className="text-gray-600"></p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 遊び放題チケット */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-[#0EA5E9]/10 rounded-full">
                  <Ticket className="h-6 w-6 text-[#0EA5E9]" />
                </div>
                <div>
                  <h3 className="text-xl">遊び放題チケット</h3>
                  <p className="text-sm text-gray-600">行くだけプランと組み合わせ可</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl text-[#0EA5E9]">10,000</span>
                <span className="text-lg text-gray-500">円</span>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0EA5E9] rounded-full"></div>
                  <span>沖合ポイントシュノーケル</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0EA5E9] rounded-full"></div>
                  <span>うみがめ探索</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#0EA5E9] rounded-full"></div>
                  <span>マリンスポーツ遊び放題</span>
                </div>
              </div>

              <Button 
                onClick={() => onBookingClick("ticket")}
                variant="outline"
                className="w-full rounded-full border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white"
              >
                予約する
              </Button>
            </div>
          </Card>

          {/* うみがめ探しツアー */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-[#0EA5E9]/10 rounded-full">
                  <Waves className="h-6 w-6 text-[#0EA5E9]" />
                </div>
                <div>
                  <h3 className="text-xl">うみがめ探しツアー</h3>
                  <p className="text-sm text-gray-600">単独でも参加可能</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl text-[#0EA5E9]">8,000</span>
                <span className="text-lg text-gray-500">円</span>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>14:00〜18:00 開始</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>所要時間：約30分</span>
                </div>
                <p className="text-xs text-gray-500 pt-2">
                  ※野生のうみがめを探すツアーです。必ず会えるとは限りませんのでご了承ください。
                </p>
              </div>

              <Button 
                onClick={() => onBookingClick("turtle-tour")}
                variant="outline"
                className="w-full rounded-full border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white"
              >
                予約する
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

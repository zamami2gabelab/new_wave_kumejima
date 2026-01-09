import { Star } from "lucide-react";
import { Card } from "./ui/card";

interface Testimonial {
  name: string;
  age: number;
  location: string;
  comment: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "田中",
    age: 32,
    location: "東京都",
    comment: "海の透明度に感動！写真で見るよりも綺麗でした。スタッフの方も親切で安心して楽しめました。",
    rating: 5
  },
  {
    name: "佐藤",
    age: 28,
    location: "大阪府",
    comment: "初めてのシュノーケリングでしたが、丁寧に教えてくれたので不安なく楽しめました。また来ます！",
    rating: 5
  },
  {
    name: "鈴木",
    age: 35,
    location: "神奈川県",
    comment: "家族全員で参加しました。子供も大喜びで、最高の思い出になりました。",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3">お客様の声</h2>
          <p className="text-gray-600">たくさんの笑顔をいただいています</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 border-0 shadow-md">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#F97316] text-[#F97316]" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                {testimonial.comment}
              </p>
              
              <div className="text-sm text-gray-500">
                {testimonial.name}さん（{testimonial.age}歳・{testimonial.location}）
              </div>
            </Card>
          ))}
        </div>

        {/* 実績 */}
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl text-[#0EA5E9] mb-2">12,000+</div>
            <div className="text-sm text-gray-600">年間参加者数</div>
          </div>
          <div>
            <div className="text-4xl text-[#0EA5E9] mb-2">4.8</div>
            <div className="text-sm text-gray-600">平均評価</div>
          </div>
          <div>
            <div className="text-4xl text-[#0EA5E9] mb-2">15年</div>
            <div className="text-sm text-gray-600">運営実績</div>
          </div>
        </div>
      </div>
    </section>
  );
}

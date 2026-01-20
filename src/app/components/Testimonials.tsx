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
    name: "さえちゃんさん",
    age: 53,
    location: "東京都",
    comment: "水上バイクに乗り海ガメ探し、ハテの浜でシュノーケリング沢山魚がいました！その後、バナナボートでポイントまで行きクマノミを3匹観たり、シュノーケリング、バナナボートを楽しみました。ゆっくり日陰の傘とチェアに座り時間が過ぎるのをゆっくり待ち、又シュノーケリングを楽しみました！ハテの浜は、船が帰る度に静かになり最後は私達だけになりましたが、波の音が心地良かったです！ジェットバイクに乗り、小さなカメにも出会いました！ホテルの前のビーチに届けてくださり、なんか夢をみてる気分でした！",
    rating: 5
  },
  {
    name: "さちさん",
    age: 46,
    location: "大阪府",
    comment: "ロイヤルマリンさんを選んで本当に良かったです。事前のやりとりから、とても親切に丁寧に対応して下さり、不安無く当日を迎えられました。船ではての浜まで行く予定でしたが、前日ジェットスキーで行きませんか？と言ってもらい、喜んで変更しました。船では味わえないスピード感最高でした！本当に忘れられない思い出になりました。はての浜に着いてからも、常に気を使って下さって、なんの不特も不安もなく過ごす事が出来ました。遊び尽くすプランを選択していたので、朝8時30分にホテルまで迎えに来て下さり、はての浜で午後2時30分まで、盛りだくさんに楽しませてもらいました。コロナ禍の中、大変だとは思いますが、こんなに素敵なはての浜まで行く事が出来、ロイヤルマリンさんに感謝しています。ありがとうございました！！",
    rating: 5
  },
  {
    name: "ヒロシさん",
    age: 61,
    location: "神奈川県",
    comment: "久米島に近い3つの島の総称で、白い砂が続きわたり、澄みわたった青色の海とのコントラストが、絶景で、ツアーでいろんな遊びが楽しめます。",
    rating: 4
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
        {/* <div className="mt-12 grid grid-cols-3 gap-6 text-center">
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
        </div> */}
      </div>
    </section>
  );
}

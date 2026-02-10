import { Clock, Users, CheckCircle2, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface GroupPlansProps {
  onBooking: () => void;
  onBack: () => void;
}

export function GroupPlans({ onBooking, onBack }: GroupPlansProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* ヘッダー */}
      <div className="text-white py-16 px-4 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: 'url(/image/group.png)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={onBack}
            className="mb-6 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            ← 戻る
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            この瞬間をずっと心に
          </h1>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* イントロ */}
        <div className="mb-16 text-center">
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            学校の修学旅行、企業研修、サークルの合宿、グループ旅行など、
            団体様向けの特別プランです。渡船を貸切できるので、
            グループだけの特別な時間をお過ごしいただけます。
          </p>
        </div>

        {/* メインプラン */}
        <Card className="overflow-hidden border-0 shadow-xl mb-12">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* 左側：プラン情報 */}
              <div className="md:col-span-2 p-8 bg-white">
                {/* タイトル */}
                <div className="mb-6">
                  <div className="inline-block bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
                    団体様専用プラン
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    はての浜渡船貸切プラン
                  </h2>
                  <p className="text-amber-600 font-semibold text-lg">
                    グループ全体で最高の海の思い出を作ろう！
                  </p>
                </div>

                {/* 説明 */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  渡船を丸ごと貸切できるので、他のグループとは顔を合わせない、
                  プライベートな時間をお過ごしいただけます。学校の修学旅行や
                  企業研修、サークルの合宿や大人数での旅行に最適です。
                </p>

                {/* 価格設定 */}
                <div className="bg-amber-50 p-6 rounded-lg mb-8">
                  <h3 className="font-bold text-gray-800 mb-4">料金</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        基本料金（5名様まで）
                      </span>
                      <span className="font-bold text-lg">
                        ¥100,000
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <p className="text-sm text-gray-600">
                        1名様追加ごとに <span className="font-semibold">+15,000円</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        例）10名様の場合：¥100,000 + (¥15,000 × 5) = ¥175,000
                      </p>
                    </div>
                  </div>
                </div>

                {/* 含まれるもの */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-800 mb-4">含まれるもの</h3>
                  <div className="space-y-3">
                    {[
                      "はての浜への渡船（貸切）",
                      "沖合シュノーケル",
                      "トーイングチューブ全種類（各1回）",
                      "ソフトドリンク飲み放題",
                      "プライベート空間確保",
                      "パラソル、チェアレンタル",
                      "保険料"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* メタ情報 */}
                <div className="border-t pt-6 flex flex-wrap gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-semibold text-gray-800">所要時間</p>
                      <p>約6時間</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-semibold text-gray-800">対応人数</p>
                      <p>5名〜30名様程度</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側：予約 */}
              <div className="bg-gradient-to-b from-amber-500 to-orange-500 text-white p-8 flex flex-col justify-between">
                <div>
                  <div className="text-center mb-8">
                    <p className="text-sm font-semibold mb-4">
                      基本料金（5名まで）
                    </p>
                    <div className="text-5xl font-bold mb-4">
                      ¥100,000
                    </div>
                    <div className="bg-white/20 p-4 rounded-lg">
                      <p className="text-sm font-semibold mb-2">追加1名様</p>
                      <p className="text-2xl font-bold">+¥15,000</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={onBooking}
                  className="w-full bg-white text-amber-600 hover:bg-gray-100 font-semibold rounded-full py-3 mb-4"
                >
                  このプランで予約
                </Button>

                <p className="text-xs text-amber-100 text-center">
                  ご不明な点はお気軽にお問い合わせください
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 対応例とシーン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* 対応シーン */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                対応可能なシーン
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: "🏫",
                    title: "修学旅行",
                    desc: "沖縄の海を安全に、楽しく体験"
                  },
                  {
                    icon: "🏢",
                    title: "企業研修",
                    desc: "チームビルディング、リフレッシュに最適"
                  },
                  {
                    icon: "🎓",
                    title: "サークル合宿",
                    desc: "友達との特別な思い出作り"
                  },
                  {
                    icon: "👨‍👩‍👧‍👦",
                    title: "大人数旅行",
                    desc: "ご家族やご友人グループでの利用"
                  },
                  {
                    icon: "💼",
                    title: "インセンティブ旅行",
                    desc: "営業成績優秀者の報奨旅行"
                  },
                  {
                    icon: "🎉",
                    title: "特別イベント",
                    desc: "同窓会や親睦会など"
                  }
                ].map((scene, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-2xl">{scene.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {scene.title}
                      </h4>
                      <p className="text-sm text-gray-600">{scene.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 貸切のメリット */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                貸切プランのメリット
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "プライベート空間",
                    desc: "他のグループとの顔合わせなし。グループだけの特別な時間"
                  },
                  {
                    title: "スケジュール自由",
                    desc: "グループのペースで楽しめます。時間調整も相談可能"
                  },
                  {
                    title: "安全管理",
                    desc: "経験豊富なスタッフが、グループ全体を見守ります"
                  },
                  {
                    title: "一体感",
                    desc: "グループ全員で同じ体験ができ、絆が深まります"
                  },
                  {
                    title: "記念撮影",
                    desc: "グループ全体の写真撮影も対応。思い出の記録に"
                  },
                  {
                    title: "柔軟な対応",
                    desc: "特別なお願いやリクエストにも応じられます"
                  }
                ].map((merit, idx) => (
                  <div key={idx}>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {merit.title}
                    </h4>
                    <p className="text-sm text-gray-600">{merit.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* よくある質問 */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">よくあるご質問</h3>
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                参加人数によって追加料金が変わるのですか？
              </h4>
              <p className="text-gray-700">
                はい。基本料金は5名様までで¥100,000です。6名様以上の場合、
                1名様追加ごとに¥15,000が加算されます。30名様までご対応可能です。
                詳しくはお気軽にお問い合わせください。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                修学旅行で利用できますか？
              </h4>
              <p className="text-gray-700">
                もちろんです。多くの学校にご利用いただいています。
                安全管理、引率者向けのサポートなど、学校向けのご対応も可能です。
                事前に詳細をお打ち合わせさせていただきます。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                雨の場合はどうなりますか？
              </h4>
              <p className="text-gray-700">
                小雨程度でしたら開催いたします。ただし、悪天候により
                開催が難しい場合は、事前にご連絡した上で日程変更または
                キャンセルとさせていただきます。その場合キャンセル料は無料です。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                事前打ち合わせは必要ですか？
              </h4>
              <p className="text-gray-700">
                ご参加人数、ご希望日程、特別なご要望があればお聞きして、
                詳細をご説明させていただきます。電話またはメールでお気軽に
                お問い合わせください。
              </p>
            </div>
          </div>
        </div>

        {/* お問い合わせ */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">ご質問・ご相談は、お気軽に！</h3>
              <p className="mb-8 text-lg">
                団体様向けのプランについて、ご不明な点があればお問い合わせください。
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Button
                  className="bg-white text-amber-600 hover:bg-gray-100 font-semibold rounded-full px-8 py-3 flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  お電話でお問い合わせ
                </Button>
                <Button
                  onClick={onBooking}
                  className="bg-white text-amber-600 hover:bg-gray-100 font-semibold rounded-full px-8 py-3"
                >
                  予約フォームへ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

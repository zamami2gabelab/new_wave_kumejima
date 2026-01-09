import { Card } from "./ui/card";

const menuItems = [
  { name: "ジェットスキー", price: "3,500" },
  { name: "ジェットシュノーケリング", price: "5,000" },
  { name: "ウェイクボード", price: "5,000" },
  { name: "マーブルジュニア", price: "3,000" },
  { name: "ビッグマーブル", price: "3,000" }
];

export function SingleMenus() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3">単品メニュー</h2>
          <p className="text-gray-600">マリンスポーツを個別に楽しめます</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {menuItems.map((item, index) => (
            <Card key={index} className="p-5 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center space-y-2">
                <h3 className="text-base">{item.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl text-[#0EA5E9]">{item.price}</span>
                  <span className="text-sm text-gray-500">円</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          ※単品メニューは現地でのお支払いも可能です
        </div>
      </div>
    </section>
  );
}

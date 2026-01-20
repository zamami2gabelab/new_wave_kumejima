import { Card } from "./ui/card";
import { OPTION_PRODUCTS } from "../domain/masters";

// 価格をカンマ区切りの文字列にフォーマット
const formatPrice = (price: number): string => {
  return price.toLocaleString("ja-JP");
};

export function SingleMenus() {
  // OPTION_PRODUCTSのすべてを使用
  const menuItems = OPTION_PRODUCTS.map((option) => ({
    id: option.id,
    name: option.name,
    price: formatPrice(option.unitPrice),
  }));
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3">単品メニュー</h2>
          <p className="text-gray-600">詳細についてはLINEまたはお問い合わせフォームにてお問い合わせください。</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {menuItems.map((item) => (
            <Card key={item.id} className="p-5 border-0 shadow-md hover:shadow-lg transition-shadow">
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
          ※表示されている価格はweb予約価格になります。<span className="font-bold text-red-600">現地予約は料金が2倍になります。</span>ご了承ください。
        </div>
      </div>
    </section>
  );
}

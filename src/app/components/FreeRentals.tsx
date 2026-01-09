import { Gift } from "lucide-react";

const rentalItems = [
  "シュノーケル",
  "ゴーグル", 
  "ライフジャケット",
  "浮き輪"
];

export function FreeRentals() {
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-[#0EA5E9]/5 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F97316] rounded-full mb-4">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl mb-2">無料レンタル品</h3>
          <p className="text-gray-600">手ぶらでOK！必要な装備は全て無料</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rentalItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg shadow-sm text-center"
            >
              <div className="w-2 h-2 bg-[#0EA5E9] rounded-full mx-auto mb-2"></div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

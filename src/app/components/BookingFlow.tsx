import { ArrowRight } from "lucide-react";

export function BookingFlow() {
  const steps = [
    {
      number: "1",
      title: "予約",
      description: "フォームまたはLINEで"
    },
    {
      number: "2", 
      title: "確認",
      description: "24時間以内に返信"
    },
    {
      number: "3",
      title: "当日",
      description: "集合場所へ"
    },
    {
      number: "4",
      title: "体験",
      description: "思い出づくり"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3">予約の流れ</h2>
          <p className="text-gray-600">簡単4ステップ</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0EA5E9] text-white rounded-full text-2xl mb-4">
                {step.number}
              </div>
              <h3 className="text-lg mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
              
              {/* 矢印を非表示 */}
              {/* {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%]">
                  <ArrowRight className="h-6 w-6 text-gray-300" />
                </div>
              )} */}
            </div>
          ))}
        </div>

        {/* 強調ポイント */}
        <div className="mt-12 grid md:grid-cols-2 gap-4 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl text-[#0EA5E9] mb-2">予約は前日までに</div>
            <p className="text-sm text-gray-600">当日予約希望の方はご連絡下さい</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-2xl text-[#0EA5E9] mb-2">悪天候キャンセル無料</div>
            <p className="text-sm text-gray-600">悪天候や渡船が困難な場合は無料キャンセル致します。</p>
          </div>
        </div>
      </div>
    </section>
  );
}

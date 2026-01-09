import { Shield, Award, Heart, Anchor } from "lucide-react";

export function Safety() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3">安全への取り組み</h2>
          <p className="text-gray-600">お客様に安心して楽しんでいただくために</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0EA5E9]/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <h3 className="text-lg mb-2">安全装備完備</h3>
            <p className="text-sm text-gray-600">
              ライフジャケット・浮き輪など安全装備を全員に配布
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0EA5E9]/10 rounded-full mb-4">
              <Award className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <h3 className="text-lg mb-2">有資格スタッフ</h3>
            <p className="text-sm text-gray-600">
              全スタッフが救命講習・応急処置の資格を保有
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0EA5E9]/10 rounded-full mb-4">
              <Heart className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <h3 className="text-lg mb-2">少人数制</h3>
            <p className="text-sm text-gray-600">
              1グループ最大8名まで。きめ細かいサポート
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0EA5E9]/10 rounded-full mb-4">
              <Anchor className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <h3 className="text-lg mb-2">保険加入</h3>
            <p className="text-sm text-gray-600">
              万が一に備え、傷害保険に加入済み
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

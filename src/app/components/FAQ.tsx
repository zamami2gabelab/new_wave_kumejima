import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const faqs = [
  {
    question: "初めてでも参加できますか？",
    answer: "はい、初めての方でも安心してご参加いただけます。経験豊富なスタッフが丁寧にサポートいたします。"
  },
  {
    question: "雨天の場合はどうなりますか？",
    answer: "悪天候の場合は前日または当日の朝にご連絡いたします。キャンセル料は一切かかりません。日程変更も可能です。"
  },
  {
    question: "泳げなくても大丈夫ですか？",
    answer: "ライフジャケットを着用しますので、泳げない方でも安全にお楽しみいただけます。浮き輪のご用意もあります。"
  },
  {
    question: "何歳から参加できますか？",
    answer: "3歳から参加可能です。お子様向けの器材もご用意しております。ご家族でのご参加をお待ちしています。"
  },
  {
    question: "写真撮影はできますか？",
    answer: "防水カメラのレンタル（有料）もご用意しております。スタッフによる記念撮影サービス（無料）もあります。"
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3">よくある質問</h2>
          <p className="text-gray-600">不安なことはすぐに解決</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">その他のご質問は</p>
          <button className="text-[#0EA5E9] underline hover:text-[#0284C7]">
            LINEでお気軽にお問い合わせください
          </button>
        </div>
      </div>
    </section>
  );
}
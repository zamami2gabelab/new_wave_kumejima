import { MapPin, Phone, Mail, Instagram } from "lucide-react";

export function Access() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3">アクセス・集合場所</h2>
          <p className="text-gray-600">泊港（とまりん）に集合</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* マップ */}
          <div className="h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.7276344843706!2d127.66366!3d26.2191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDEzJzA4LjgiTiAxMjfCsDM5JzQ5LjIiRQ!5e0!3m2!1sja!2sjp!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* 詳細情報 */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="h-6 w-6 text-[#0EA5E9] shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-2">集合場所</h3>
                <p className="text-gray-700">
                  〒900-0001<br />
                  沖縄県那覇市泊3-14-2<br />
                  とまりん（泊港）1F カウンター前
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="h-6 w-6 text-[#0EA5E9] shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-2">お電話でのお問い合わせ</h3>
                <p className="text-gray-700">
                  098-XXX-XXXX<br />
                  <span className="text-sm text-gray-500">受付時間：8:00〜20:00</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="h-6 w-6 text-[#0EA5E9] shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-2">メールでのお問い合わせ</h3>
                <p className="text-gray-700">info@hateno-hama.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Instagram className="h-6 w-6 text-[#0EA5E9] shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-2">Instagram</h3>
                <p className="text-gray-700">
                  @hateno_hama_okinawa<br />
                  <span className="text-sm text-gray-500">最新の海の様子を毎日更新中</span>
                </p>
              </div>
            </div>

            {/* 駐車場情報 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="mb-2">駐車場</h3>
              <p className="text-sm text-gray-700">
                とまりん駐車場（有料）をご利用ください<br />
                30分100円・1日最大1,000円
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

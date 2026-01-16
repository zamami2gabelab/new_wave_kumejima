import { MapPin, Phone, Mail, Instagram } from "lucide-react";

export function Access() {
  return (
    <section id="access" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3">アクセス</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* マップ */}
          <div className="h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3575.546527149949!2d126.81363691231283!3d26.341179584319754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34fa9b7190bbff11%3A0x53cbd75082b161f6!2z44CSOTAxLTMxMDUg5rKW57iE55yM5bO25bC76YOh5LmF57Gz5bO255S65a6H5qC577yR77yX77yS77yU4oiS77yR77yT!5e0!3m2!1sja!2sjp!4v1768366477448!5m2!1sja!2sjp"
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
                  泊フィッシャアリーナ<br />
                  〒901-3105<br />
                  沖縄県島尻郡久米島町宇根1724-13
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="h-6 w-6 text-[#0EA5E9] shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-2">お電話でのお問い合わせ</h3>
                <a href="tel:098-987-1318" className="text-gray-700 hover:text-[#0EA5E9] transition-colors">
                  098-987-1318<br />
                  <span className="text-sm text-gray-500">受付時間：8:00〜20:00</span>
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="h-6 w-6 text-[#0EA5E9] shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-2">メールでのお問い合わせ</h3>
                <a href="mailto:yukocrest.mobile@gmail.com" className="text-gray-700 hover:text-[#0EA5E9] transition-colors break-all">
                  contact@yukocrest.co.jp
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Instagram className="h-6 w-6 text-[#0EA5E9] shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-2">Instagram</h3>
                <p className="text-gray-700">
                  @roiyarumarin8<br />
                  <span className="text-sm text-gray-500">最新の海の様子を更新中</span>
                </p>
              </div>
            </div>

            {/* 駐車場情報 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="mb-2">駐車場</h3>
              <p className="text-sm text-gray-700">
                駐車場完備（無料）
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
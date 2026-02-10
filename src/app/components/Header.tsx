import { useState } from "react";
import { Menu, X, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onBookingClick: () => void;
  onLineClick: () => void;
  onBackToHome?: () => void;
  isBookingForm?: boolean;
}

export function Header({ onBookingClick, onLineClick, onBackToHome, isBookingForm = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const attemptScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
        return true;
      }
      return false;
    };

    // フォーム表示中 or サブページ表示中は、まずHPに戻ってからスクロール
    if (onBackToHome) {
      if (isBookingForm) {
        onBackToHome();
        setTimeout(attemptScroll, 100);
        return;
      }

      if (attemptScroll()) {
        return;
      }

      onBackToHome();
      setTimeout(attemptScroll, 100);
      return;
    }

    attemptScroll();
  };

  const handleLogoClick = () => {
    if (onBackToHome) {
      onBackToHome();
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* ロゴ */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 text-xl hover:opacity-80 transition-opacity"
            >
              <img 
                src="/image/log.png" 
                alt="New Wave 久米島 ロゴ" 
                className="h-8 w-auto"
              />
              <span className="text-gray-700">New Wave 久米島</span>
            </button>

            {/* デスクトップメニュー */}
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => scrollToSection("plans")}
                className="text-gray-700 hover:text-[#0EA5E9] transition-colors"
              >
                プラン
              </button>
              <button 
                onClick={() => scrollToSection("faq")}
                className="text-gray-700 hover:text-[#0EA5E9] transition-colors"
              >
                よくある質問
              </button>
              <button 
                onClick={() => scrollToSection("access")}
                className="text-gray-700 hover:text-[#0EA5E9] transition-colors"
              >
                アクセス
              </button>
              <Button 
                onClick={onBookingClick}
                size="sm"
                className="bg-[#F97316] hover:bg-[#EA580C] rounded-full"
              >
                予約する
              </Button>
            </nav>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#0EA5E9]"
              aria-label="メニュー"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <button 
                onClick={() => scrollToSection("plans")}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                プラン
              </button>
              <button 
                onClick={() => scrollToSection("faq")}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                よくある質問
              </button>
              <button 
                onClick={() => scrollToSection("access")}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                アクセス
              </button>
              
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <a 
                  href="tel:098-987-1318"
                  className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Phone className="h-5 w-5 text-[#0EA5E9]" />
                  <div>
                    <div className="text-sm text-gray-500">お電話でお問い合わせ</div>
                    <div className="font-medium">098-987-1318</div>
                  </div>
                </a>

                <a 
                  href="mailto:yukocrest.mobile@gmail.com"
                  className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Mail className="h-5 w-5 text-[#0EA5E9]" />
                  <div>
                    <div className="text-sm text-gray-500">メールでお問い合わせ</div>
                    <div className="text-sm">yukocrest.mobile@gmail.com</div>
                  </div>
                </a>

                <button 
                  onClick={() => {
                    onLineClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 py-3 px-4 w-full text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-[#06C755]" />
                  <div>
                    <div className="text-sm text-gray-500">LINEで相談</div>
                    <div className="font-medium text-[#06C755]">今すぐ相談する</div>
                  </div>
                </button>
              </div>

              <Button 
                onClick={() => {
                  onBookingClick();
                  setIsMenuOpen(false);
                }}
                size="lg"
                className="w-full h-12 bg-[#F97316] hover:bg-[#EA580C] rounded-full"
              >
                予約する
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* ヘッダーの高さ分のスペーサー */}
      <div className="h-16"></div>
    </>
  );
}

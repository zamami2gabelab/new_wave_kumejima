import { ChevronRight } from "lucide-react";
import { Card } from "./ui/card";

interface CategoryLink {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  backgroundImage?: string;
  color?: string;
  onClick: () => void;
}

interface PlanCategoryLinksProps {
  links: CategoryLink[];
}

export function PlanCategoryLinks({ links }: PlanCategoryLinksProps) {
  return (
    <div className={links.length === 1 ? "w-full" : "grid grid-cols-1 md:grid-cols-3 gap-6"}>
      {links.map((link) => (
        <Card
          key={link.id}
          className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
          onClick={link.onClick}
        >
          {/* 背景画像またはカラー */}
          {link.backgroundImage ? (
            <div
              className="h-64 bg-cover bg-center"
              style={{ backgroundImage: `url(${link.backgroundImage})` }}
            />
          ) : (
            <div
              className={`h-64 ${link.color} flex items-center justify-center text-5xl font-bold text-white`}
            >
              {link.icon}
            </div>
          )}

          {/* コンテンツ */}
          <div className="p-6 space-y-3">
            <h3 className="text-lg font-bold text-gray-800">{link.title}</h3>
            <p className="text-sm text-gray-600">{link.subtitle}</p>

            {/* リンク表示 */}
            <div className="flex items-center gap-2 text-[#0EA5E9] font-semibold group-hover:gap-3 transition-all">
              <span>詳細を見る</span>
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

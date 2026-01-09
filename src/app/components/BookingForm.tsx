import { useState } from "react";
import { X, Calendar, Users, Mail, Phone, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  preselectedPlan?: string;
}

export function BookingForm({ open, onClose, preselectedPlan }: BookingFormProps) {
  const [formData, setFormData] = useState({
    plan: preselectedPlan || "",
    date: "",
    participants: "",
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここで実際の予約処理を行う
    alert("予約リクエストを受け付けました！担当者から24時間以内にご連絡いたします。");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="text-2xl">予約フォーム</DialogTitle>
          <DialogDescription className="sr-only">
            プランの予約フォーム。希望日、人数、お名前などを入力してください。
          </DialogDescription>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* プラン選択 */}
          <div className="space-y-2">
            <Label htmlFor="plan">プラン *</Label>
            <Select 
              value={formData.plan} 
              onValueChange={(value) => setFormData({...formData, plan: value})}
            >
              <SelectTrigger id="plan">
                <SelectValue placeholder="プランを選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wakuwaku">わくわくプラン（8,000円）</SelectItem>
                <SelectItem value="manzoku">まんぞくプラン（10,000円）</SelectItem>
                <SelectItem value="asobihoudai">遊び放題プラン（13,500円）</SelectItem>
                <SelectItem value="ikudake">行くだけプラン（5,500円）</SelectItem>
                <SelectItem value="ticket">遊び放題チケット（10,000円）</SelectItem>
                <SelectItem value="turtle-tour">うみがめ探しツアー（8,000円）</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 日付 */}
          <div className="space-y-2">
            <Label htmlFor="date">希望日 *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                id="date"
                type="date"
                className="pl-10"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
          </div>

          {/* 人数 */}
          <div className="space-y-2">
            <Label htmlFor="participants">参加人数 *</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Select 
                value={formData.participants} 
                onValueChange={(value) => setFormData({...formData, participants: value})}
              >
                <SelectTrigger id="participants" className="pl-10">
                  <SelectValue placeholder="人数を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1名</SelectItem>
                  <SelectItem value="2">2名</SelectItem>
                  <SelectItem value="3">3名</SelectItem>
                  <SelectItem value="4">4名</SelectItem>
                  <SelectItem value="5">5名以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* お名前 */}
          <div className="space-y-2">
            <Label htmlFor="name">お名前 *</Label>
            <Input 
              id="name"
              placeholder="山田 太郎"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          {/* メールアドレス */}
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                id="email"
                type="email"
                className="pl-10"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          {/* 電話番号 */}
          <div className="space-y-2">
            <Label htmlFor="phone">電話番号 *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                id="phone"
                type="tel"
                className="pl-10"
                placeholder="090-1234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          </div>

          {/* メッセージ */}
          <div className="space-y-2">
            <Label htmlFor="message">ご質問・ご要望</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Textarea 
                id="message"
                className="pl-10 min-h-24"
                placeholder="アレルギー、特別なリクエストなどございましたらご記入ください"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
          </div>

          {/* 注意事項 */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700 space-y-2">
            <p>・予約確定後、24時間以内にメールでご連絡いたします</p>
            <p>・当日予約も受付中（空き状況によります）</p>
            <p>・雨天時のキャンセル料は無料です</p>
          </div>

          {/* 送信ボタン */}
          <Button 
            type="submit"
            size="lg"
            className="w-full h-14 text-lg bg-[#F97316] hover:bg-[#EA580C] rounded-full"
          >
            予約リクエストを送信
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
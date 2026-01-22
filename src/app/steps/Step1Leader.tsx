// ステップ1: リーダー情報と予約日

import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { CalendarIcon, User, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { getTodayString } from "../lib/date";
import type { ReservationFormInput } from "../domain/validators";
import { cn } from "../components/ui/utils";

export function Step1Leader() {
  const form = useFormContext<ReservationFormInput>();
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">代表者情報と予約日</h2>
        <p className="text-gray-600">予約に必要な基本情報を入力してください</p>
      </div>

      {/* お名前 */}
      <FormField
        control={form.control}
        name="leader.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              お名前 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="山田 太郎"
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 電話番号 */}
      <FormField
        control={form.control}
        name="leader.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              電話番号 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="09012345678"
                  className="pl-10"
                  {...field}
                  onChange={(e) => {
                    // ハイフンを除去
                    const value = e.target.value.replace(/-/g, "");
                    field.onChange(value);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
            <p className="text-xs text-gray-500 mt-1">
              ハイフンなしで10桁または11桁の数字で入力してください
            </p>
          </FormItem>
        )}
      />

      {/* メールアドレス */}
      <FormField
        control={form.control}
        name="leader.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              メールアドレス <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="example@email.com"
                  className="pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 予約日 */}
      <FormField
        control={form.control}
        name="reservationDate"
        render={({ field }) => {
          let selectedDate: Date | undefined = undefined;
          
          if (field.value && typeof field.value === "string" && field.value.trim() !== "") {
            try {
              const parsedDate = new Date(field.value + "T00:00:00");
              if (!isNaN(parsedDate.getTime())) {
                selectedDate = parsedDate;
              }
            } catch (e) {
              console.error("Date parsing error:", e);
            }
          }
          
          const handleSelect = (date: Date | undefined) => {
            if (date) {
              const dateString = format(date, "yyyy-MM-dd");
              field.onChange(dateString);
              setIsCalendarOpen(false);
            }
          };
          
          return (
            <FormItem className="flex flex-col">
              <FormLabel>
                予約日 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {selectedDate ? (
                        format(selectedDate, "yyyy年MM月dd日", { locale: ja })
                      ) : (
                        <span>日付を選択してください</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleSelect}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const checkDate = new Date(date);
                        checkDate.setHours(0, 0, 0, 0);
                        return checkDate < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

    </div>
  );
}

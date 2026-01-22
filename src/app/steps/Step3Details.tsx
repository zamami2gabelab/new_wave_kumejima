// ステップ3: 人数、ピックアップ、オプション、弁当、参加者名簿

import { useFormContext, useWatch } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { QuantityStepper } from "../components/QuantityStepper";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { OPTION_PRODUCTS, PICKUP_PLACES } from "../domain/masters";
import type { ReservationFormInput } from "../domain/validators";
import { useEffect } from "react";

export function Step3Details() {
  const form = useFormContext<ReservationFormInput>();
  const transportType = form.watch("transportType");
  const adults = form.watch("people.adults") || 0;
  const children = form.watch("people.children") || 0;
  const infants = form.watch("people.infants") || 0;
  const totalPeople = adults + children + infants;
  const pickupRequired = form.watch("pickup.required");
  const pickupPlaceId = form.watch("pickup.placeId");
  const participants = form.watch("participants") || [];

  // 合計人数を更新
  useEffect(() => {
    form.setValue("people.totalPeople", totalPeople);
  }, [totalPeople, form]);

  // 参加者名簿の数を調整
  useEffect(() => {
    if (transportType === "PLAN_WITH_BOAT" && totalPeople > 0) {
      const currentParticipants = form.getValues("participants") || [];
      if (currentParticipants.length < totalPeople) {
        // 不足分を追加
        const newParticipants = [
          ...currentParticipants,
          ...Array(totalPeople - currentParticipants.length).fill(null).map(() => ({
            name: "",
            age: undefined as any,
          })),
        ];
        form.setValue("participants", newParticipants);
      } else if (currentParticipants.length > totalPeople) {
        // 余分を削除
        form.setValue("participants", currentParticipants.slice(0, totalPeople));
      }
    } else if (transportType === "TICKET_ACTIVITY_ONLY") {
      form.setValue("participants", []);
    }
  }, [totalPeople, transportType, form]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">詳細情報</h2>
        <p className="text-gray-600">人数、オプション、その他の情報を入力してください</p>
      </div>

      {/* 人数 */}
      <Card>
        <CardHeader>
          <CardTitle>参加人数</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="people.adults"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <QuantityStepper
                    label="大人（16歳以上）"
                    value={field.value || 0}
                    onChange={(value) => field.onChange(value)}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="people.children"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <QuantityStepper
                    label="子供（4-15歳）"
                    value={field.value || 0}
                    onChange={(value) => field.onChange(value)}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="people.infants"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <QuantityStepper
                    label="乳幼児（0-3歳・無料）"
                    value={field.value || 0}
                    onChange={(value) => field.onChange(value)}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500 mt-1">乳幼児は料金に含まれません</p>
              </FormItem>
            )}
          />

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">合計人数</span>
              <span className="text-lg font-bold">{totalPeople}名</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ピックアップ */}
      <Card>
        <CardHeader>
          <CardTitle>島内ピックアップ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="pickup.required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (!checked) {
                        form.setValue("pickup.placeId", null);
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">
                    ピックアップを希望する（+1,000円）
                  </FormLabel>
                  <p className="text-sm text-gray-500">
                    島内の指定場所までお迎えに上がります
                  </p>
                </div>
              </FormItem>
            )}
          />

          {pickupRequired && (
            <FormField
              control={form.control}
              name="pickup.placeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ピックアップ場所 <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value || null);
                      form.setValue("pickup.fee", value ? 1000 : 0);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="場所を選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PICKUP_PLACES.map((place) => (
                        <SelectItem key={place.id} value={place.id}>
                          {place.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* ご質問・ご要望 */}
      <Card>
        <CardHeader>
          <CardTitle>ご質問・ご要望</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="特別なリクエストなどございましたらご記入ください"
                    className="min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500 mt-1">
                  ピックアップ場所で「その他」を選択した場合は必須です
                </p>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* オプション */}
      <Card>
        <CardHeader>
          <CardTitle>オプション</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {OPTION_PRODUCTS.map((option) => {
            const optionField = form.watch(`options`)?.find(
              (opt: any) => opt.optionId === option.id
            );
            const currentQty = optionField?.qty || 0;

            return (
              <div key={option.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex-1">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-gray-500">
                    {option.unitPrice.toLocaleString()}円 / 1個
                  </div>
                </div>
                <div className="w-48">
                  <QuantityStepper
                    value={currentQty}
                    onChange={(qty) => {
                      const currentOptions = form.getValues("options") || [];
                      const updatedOptions = currentOptions.map((opt: any) =>
                        opt.optionId === option.id
                          ? { ...opt, qty }
                          : opt
                      );
                      form.setValue("options", updatedOptions);
                    }}
                    min={0}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 弁当 */}
      <Card>
        <CardHeader>
          <CardTitle>弁当</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="bento.enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (!checked) {
                        form.setValue("bento.qty", 0);
                      } else if (form.getValues("bento.qty") === 0) {
                        form.setValue("bento.qty", 1);
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">弁当を注文する（1,500円/個）</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {form.watch("bento.enabled") && (
            <FormField
              control={form.control}
              name="bento.qty"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <QuantityStepper
                      label="数量"
                      value={field.value || 0}
                      onChange={(value) => field.onChange(value)}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* 参加者名簿（PLANのみ） */}
      {transportType === "PLAN_WITH_BOAT" && totalPeople > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              参加者名簿 <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-gray-600">
              船の保険のため、全員の情報が必要です
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {participants.map((participant: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="font-medium text-sm text-gray-700">
                  参加者 {index + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`participants.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>お名前</FormLabel>
                        <FormControl>
                          <Input placeholder="山田 太郎" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`participants.${index}.age`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          年齢 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="25"
                            min={1}
                            max={120}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                field.onChange(undefined);
                              } else {
                                const numValue = parseInt(value, 10);
                                if (!isNaN(numValue)) {
                                  field.onChange(numValue);
                                } else {
                                  field.onChange(undefined);
                                }
                              }
                            }}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

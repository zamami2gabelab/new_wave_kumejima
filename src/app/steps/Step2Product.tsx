// ステップ2: 交通手段と商品選択

import { useFormContext, Controller } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { PLAN_PRODUCTS, TICKET_PRODUCTS } from "../domain/masters";
import type { ReservationFormInput } from "../domain/validators";

export function Step2Product() {
  const form = useFormContext<ReservationFormInput>();
  const transportType = form.watch("transportType");

  // 交通手段が変更されたときに、関連フィールドをクリア
  const handleTransportTypeChange = (value: "PLAN_WITH_BOAT" | "TICKET_ACTIVITY_ONLY") => {
    form.setValue("transportType", value);
    form.setValue("productId", "");
    if (value === "PLAN_WITH_BOAT") {
      form.setValue("arrivalSlot", null);
      form.setValue("participants", []);
    } else {
      form.setValue("participants", []);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">交通手段と商品選択</h2>
        <p className="text-gray-600">船の手配が必要かどうかを選択してください</p>
      </div>

      {/* 交通手段の選択 */}
      <FormField
        control={form.control}
        name="transportType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              船の手配 <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={handleTransportTypeChange}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PLAN_WITH_BOAT" id="plan" />
                  <Label htmlFor="plan" className="cursor-pointer flex-1">
                    <div className="font-medium">プラン（船込み）</div>
                    <div className="text-sm text-gray-500">
                      当社が船を手配します。参加者名簿が必要です。
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TICKET_ACTIVITY_ONLY" id="ticket" />
                  <Label htmlFor="ticket" className="cursor-pointer flex-1">
                    <div className="font-medium">チケット（アクティビティのみ）</div>
                    <div className="text-sm text-gray-500">
                      他社の船をご利用の場合。到着時間帯を選択してください。
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* プラン商品の選択 */}
      {transportType === "PLAN_WITH_BOAT" && (
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                プランを選択 <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {PLAN_PRODUCTS.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`cursor-pointer transition-all ${
                        field.value === plan.id
                          ? "border-[#0EA5E9] border-2 bg-blue-50"
                          : "hover:border-gray-300"
                      }`}
                      onClick={() => field.onChange(plan.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-lg mb-1">{plan.name}</div>
                            <div className="text-sm text-gray-600">
                              大人: {plan.adultPrice.toLocaleString()}円
                            </div>
                            <div className="text-sm text-gray-600">
                              子供: {plan.childPrice.toLocaleString()}円
                            </div>
                          </div>
                          <RadioGroupItem
                            value={plan.id}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* チケット商品の選択 */}
      {transportType === "TICKET_ACTIVITY_ONLY" && (
        <>
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  チケットを選択 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {TICKET_PRODUCTS.map((ticket) => (
                      <Card
                        key={ticket.id}
                        className={`cursor-pointer transition-all ${
                          field.value === ticket.id
                            ? "border-[#0EA5E9] border-2 bg-blue-50"
                            : "hover:border-gray-300"
                        }`}
                        onClick={() => field.onChange(ticket.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold text-lg mb-1">{ticket.name}</div>
                              <div className="text-sm text-gray-600">
                                1人あたり: {ticket.webPrice.toLocaleString()}円
                              </div>
                            </div>
                            <RadioGroupItem
                              value={ticket.id}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-1"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 到着時間帯 */}
          <FormField
            control={form.control}
            name="arrivalSlot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  到着時間帯 <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value || ""}
                    onValueChange={(value) => field.onChange(value || null)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="AM" id="am" />
                      <Label htmlFor="am" className="cursor-pointer flex-1">
                        <div className="font-medium">午前（AM）</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PM" id="pm" />
                      <Label htmlFor="pm" className="cursor-pointer flex-1">
                        <div className="font-medium">午後（PM）</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}

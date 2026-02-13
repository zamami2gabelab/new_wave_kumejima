// ステップ1: プラン選択と人数

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Card, CardContent } from "../components/ui/card";
import { PLAN_PRODUCTS } from "../domain/masters";
import type { ReservationFormInput } from "../domain/validators";

export function Step2Product() {
  const form = useFormContext<ReservationFormInput>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">プラン選択と人数</h2>
        <p className="text-gray-600">ご希望のプランを選択してください</p>
      </div>

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
                      field.value === plan.id ? "border-[#0EA5E9] border-2 bg-blue-50" : "hover:border-gray-300"
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
                          {plan.childPrice !== null && plan.childPrice !== undefined && (
                            <div className="text-sm text-gray-600">
                              子供: {plan.childPrice.toLocaleString()}円
                            </div>
                          )}
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
    </div>
  );
}

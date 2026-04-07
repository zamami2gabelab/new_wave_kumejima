// ステップ1: プラン選択と人数

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Card, CardContent } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { PLAN_PRODUCTS } from "../domain/masters";
import type { ReservationFormInput } from "../domain/validators";

type PlanCategory = {
  id: string;
  title: string;
  description: string;
  productIds: string[];
  accentClass: string;
  surfaceClass: string;
  borderClass: string;
  selectedClass: string;
  hoverClass: string;
};

const PLAN_CATEGORIES: PlanCategory[] = [
  {
    id: "hatenohama",
    title: "はての浜プラン",
    description: "通常プランと夏限定のはての浜プランを選べます",
    productIds: [
      "PLAN_NONBIRI",
      "PLAN_ACTIVITY",
      "PLAN_SUINBOU",
      "PLAN_PREMIUM_HATENOHAMA",
      "PLAN_MEMORIAL_HATENOHAMA",
      "PLAN_JET_CRUISE",
      "PLAN_ASOBITSUKUSHI_SUMMER",
    ],
    accentClass: "text-sky-700",
    surfaceClass: "bg-sky-50",
    borderClass: "border-sky-200",
    selectedClass: "border-sky-500 bg-sky-50",
    hoverClass: "hover:border-sky-300",
  },
  {
    id: "sunset",
    title: "サンセットプラン",
    description: "夕日を楽しむ3つのサンセットプランです",
    productIds: ["PLAN_SUNSET_JET", "PLAN_SUNSET_CRUISE", "PLAN_SUNSET_SUP"],
    accentClass: "text-orange-700",
    surfaceClass: "bg-orange-50",
    borderClass: "border-orange-200",
    selectedClass: "border-orange-500 bg-orange-50",
    hoverClass: "hover:border-orange-300",
  },
  {
    id: "snorkel",
    title: "シュノーケルプラン",
    description: "近海とプレミアムのシュノーケルプランを選べます",
    productIds: ["PLAN_SNORKEL", "PLAN_PREMIUM_SNORKEL"],
    accentClass: "text-emerald-700",
    surfaceClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    selectedClass: "border-emerald-500 bg-emerald-50",
    hoverClass: "hover:border-emerald-300",
  },
];

const categoryByProductId = PLAN_CATEGORIES.reduce<Record<string, string>>((acc, category) => {
  category.productIds.forEach((productId) => {
    acc[productId] = category.id;
  });
  return acc;
}, {});

export function Step2Product() {
  const form = useFormContext<ReservationFormInput>();
  const selectedProductId = form.watch("productId");
  const [openCategory, setOpenCategory] = useState<string>("hatenohama");

  useEffect(() => {
    if (selectedProductId && categoryByProductId[selectedProductId]) {
      setOpenCategory(categoryByProductId[selectedProductId]);
    }
  }, [selectedProductId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">プラン選択と人数</h2>
        <p className="text-gray-600">カテゴリーを開いて、ご希望のプランを選択してください</p>
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
                className="space-y-4"
              >
                <Accordion
                  type="single"
                  collapsible
                  value={openCategory}
                  onValueChange={(value) => setOpenCategory(value || "")}
                  className="w-full space-y-4"
                >
                  {PLAN_CATEGORIES.map((category) => {
                    const plans = PLAN_PRODUCTS.filter((plan) =>
                      category.productIds.includes(plan.id),
                    );

                    return (
                      <AccordionItem
                        key={category.id}
                        value={category.id}
                        className={`border rounded-xl px-4 shadow-sm ${category.borderClass} ${category.surfaceClass}`}
                      >
                        <AccordionTrigger className="py-4 text-left hover:no-underline">
                          <div>
                            <div className={`text-lg font-semibold ${category.accentClass}`}>{category.title}</div>
                            <div className="text-sm text-gray-500">{category.description}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            {plans.map((plan) => (
                              <Card
                                key={plan.id}
                                className={`cursor-pointer transition-all ${
                                  field.value === plan.id
                                    ? `border-2 ${category.selectedClass}`
                                    : category.hoverClass
                                }`}
                                onClick={() => field.onChange(plan.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <div className="font-semibold text-lg mb-1">{plan.name}</div>
                                      {plan.pricingLabel ? (
                                        <div className="text-sm text-gray-600">{plan.pricingLabel}</div>
                                      ) : (
                                        <>
                                          <div className="text-sm text-gray-600">
                                            大人: {plan.adultPrice.toLocaleString()}円
                                          </div>
                                          {plan.childPrice !== null && plan.childPrice !== undefined && (
                                            <div className="text-sm text-gray-600">
                                              子供: {plan.childPrice.toLocaleString()}円
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                    <RadioGroupItem
                                      value={plan.id}
                                      onClick={(event) => event.stopPropagation()}
                                      className="mt-1"
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

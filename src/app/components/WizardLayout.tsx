// ウィザードレイアウトコンポーネント

import { useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stepper } from "./Stepper";
import { SummaryPanel } from "./SummaryPanel";
import { Button } from "./ui/button";
import { reservationFormSchema, type ReservationFormInput } from "../domain/validators";
import { updateTotals } from "../domain/pricing";
import type { ReservationFormData, ReservationPayload } from "../domain/types";
import { Step1Leader } from "../steps/Step1Leader";
import { Step2Product } from "../steps/Step2Product";
import { Step3Details } from "../steps/Step3Details";
import { ConfirmModal } from "./ConfirmModal";
import { submitReservation } from "../lib/api";

const STEPS = [
  { title: "プラン選択", description: "プラン選択と人数" },
  { title: "代表者情報", description: "代表者情報と予約日" },
  { title: "詳細情報", description: "送迎希望と参加者情報" },
];

const getDefaultValues = (preselectedProductId = ""): ReservationFormInput => ({
  leader: { name: "", phone: "", email: "" },
  reservationDate: "",
  productId: (preselectedProductId || "") as ReservationFormInput["productId"],
  people: { adults: 0, children: 0, infants: 0, totalPeople: 0 },
  pickup: { required: false, hotelName: "", fee: 0 },
  message: "",
  participants: [],
  totals: { totalClientCalc: 0 },
});

interface WizardLayoutProps {
  preselectedProductId?: string;
}

export function WizardLayout({ preselectedProductId = "" }: WizardLayoutProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [reservationId, setReservationId] = useState<string>();

  const form = useForm<ReservationFormInput>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: getDefaultValues(preselectedProductId),
    mode: "onChange",
  });

  // フォームデータを監視して合計を更新
  const formData = form.watch();
  const formDataWithTotals = useMemo(() => {
    return updateTotals(formData as ReservationFormData);
  }, [formData]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof ReservationFormInput)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["productId"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["leader", "reservationDate"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["people", "participants"];
      if (formData.pickup.required) {
        fieldsToValidate.push("pickup");
      }
    }
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // 最終ステップで確認モーダルを表示
        setShowConfirm(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(false);
    setErrorMessage(undefined);

    try {
      // 最終バリデーション
      const isValid = await form.trigger();
      if (!isValid) {
        setSubmitError(true);
        setErrorMessage("入力内容に誤りがあります。確認してください。");
        setIsSubmitting(false);
        return;
      }

      const data = form.getValues();
      const payload: ReservationPayload = {
        leader: data.leader,
        reservationDate: data.reservationDate,
        productId: data.productId,
        people: data.people,
        pickup: {
          required: data.pickup.required,
          hotelName: data.pickup.hotelName || "",
          fee: data.pickup.required ? 1000 : 0,
        },
        message: data.message || "",
        participants: data.participants,
        totals: { totalClientCalc: formDataWithTotals.totals.totalClientCalc },
      };

      const response = await submitReservation(payload);

      if (response.ok && response.reservationId) {
        setSubmitSuccess(true);
        setReservationId(response.reservationId);
      } else {
        setSubmitError(true);
        setErrorMessage(response.error || "予約の送信に失敗しました");
      }
    } catch (error) {
      setSubmitError(true);
      setErrorMessage(error instanceof Error ? error.message : "予約の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirm = () => {
    if (submitSuccess) {
      // 成功時はフォームをリセット
      form.reset(getDefaultValues(preselectedProductId));
      setCurrentStep(1);
      setShowConfirm(false);
      setSubmitSuccess(false);
      setReservationId(undefined);
    } else {
      setShowConfirm(false);
    }
  };

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* ステッパー */}
          <div className="mb-8">
            <Stepper currentStep={currentStep} totalSteps={3} steps={STEPS} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* メインコンテンツ */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                {currentStep === 1 && <Step2Product />}
                {currentStep === 2 && <Step1Leader />}
                {currentStep === 3 && <Step3Details />}

                {/* ナビゲーションボタン */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    戻る
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#0EA5E9] hover:bg-[#0284C7]"
                  >
                    {currentStep === 3 ? "確認画面へ" : "次へ"}
                  </Button>
                </div>
              </div>
            </div>

            {/* サマリーパネル */}
            <div className="lg:col-span-1">
              <SummaryPanel formData={formDataWithTotals} />
            </div>
          </div>
        </div>
      </div>

      {/* 確認モーダル */}
      <ConfirmModal
        open={showConfirm}
        formData={formDataWithTotals}
        onSubmit={handleSubmit}
        onClose={handleCloseConfirm}
        isLoading={isSubmitting}
        isSuccess={submitSuccess}
        isError={submitError}
        errorMessage={errorMessage}
        reservationId={reservationId}
      />
    </FormProvider>
  );
}

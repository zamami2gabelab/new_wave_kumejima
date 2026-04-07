// ステップインジケーターコンポーネント

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ title: string; description?: string }>;
}

export function Stepper({ currentStep, totalSteps, steps }: StepperProps) {
  return (
    <div className="w-full">
      <div className="relative grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <div className="absolute left-[calc(100%/6)] right-[calc(100%/6)] top-6 h-0.5 bg-gray-200" />

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="relative min-w-0 text-center">
              <div className="flex flex-col items-center">
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                    isActive
                      ? "bg-[#0EA5E9] border-[#0EA5E9] text-white"
                      : isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="font-semibold">{stepNumber}</span>
                  )}
                </div>

                <div className="mt-3 px-1">
                  <div
                    className={`text-sm font-medium leading-tight break-words ${
                      isActive ? "text-[#0EA5E9]" : isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="mt-1 text-[11px] leading-snug text-gray-500 break-words">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {index < totalSteps - 1 && (
                <div
                  className={`absolute top-6 left-1/2 z-0 hidden h-0.5 w-full translate-x-1/2 sm:block ${
                    isCompleted ? "bg-green-500" : "bg-transparent"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

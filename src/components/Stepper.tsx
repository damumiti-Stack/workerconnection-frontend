import React from "react";
import { useEffect } from "react";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  completed: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  useEffect(() => {
    if (currentStep > 0) {
      const currentStepElement = document.getElementById(`${currentStep}`);
      if (currentStepElement) {
        currentStepElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentStep]);

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            id={step.id.toString()}
            key={step.id}
            className="flex items-center"
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.completed
                    ? "bg-green-500 border-green-500 text-white"
                    : currentStep === index + 1
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {step.completed ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center max-w-20 ${
                  step.completed
                    ? "text-green-600"
                    : currentStep === index + 1
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  step.completed ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;

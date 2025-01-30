import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  steps: {
    id: string;
    label: string;
    description?: string;
  }[];
  currentStep: number;
  className?: string;
}

export function ProgressIndicator({ steps, currentStep, className = '' }: ProgressIndicatorProps) {
  return (
    <div className={`py-4 ${className}`}>
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step, index) => (
            <li key={step.id} className="md:flex-1">
              <div className={`flex flex-col border-l-4 md:border-l-0 md:border-t-4 py-2 pl-4 md:pl-0 md:pt-4 md:pb-0 ${
                index < currentStep
                  ? 'border-indigo-600'
                  : index === currentStep
                  ? 'border-indigo-600'
                  : 'border-gray-200 dark:border-gray-700'
              }`}>
                <span className={`text-sm font-medium ${
                  index < currentStep
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : index === currentStep
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Step {index + 1}
                </span>
                <span className="text-sm font-medium">{step.label}</span>
                {step.description && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {step.description}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

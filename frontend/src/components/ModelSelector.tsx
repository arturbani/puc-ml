import React from 'react';
import { Check } from 'lucide-react';

type ModelOption = {
  id: string;
  label: string;
};

type ModelSelectorProps = {
  options: ModelOption[];
  selectedModel: string;
  onChange: (modelId: string) => void;
};

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  options, 
  selectedModel, 
  onChange 
}) => {
  return (
    <div className="w-full">
      <div className="text-lg font-medium mb-3 text-gray-800">Selecione o modelo:</div>
      <div className="flex flex-col md:flex-row gap-3">
        {options.map((option) => (
          <label 
            key={option.id}
            className={`
              relative flex items-center px-5 py-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${selectedModel === option.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
            `}
          >
            <input
              type="radio"
              name="model"
              value={option.id}
              checked={selectedModel === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            <div className={`
              w-5 h-5 flex items-center justify-center rounded-full mr-3 border-2
              ${selectedModel === option.id 
                ? 'border-blue-500 bg-blue-500 text-white' 
                : 'border-gray-400 bg-white'}
            `}>
              {selectedModel === option.id && <Check size={12} strokeWidth={3} />}
            </div>
            <span className="text-base">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
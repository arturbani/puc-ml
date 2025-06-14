import React, { useState } from 'react';
import ModelSelector from './ModelSelector';
import { Loader2, Upload } from 'lucide-react';

const modelOptions = [
  { id: 'knn_model', label: 'KNN' },
  { id: 'model-b', label: 'Árvore de Decisão' },
  { id: 'model-c', label: 'Regressão Linear' },
];

// Real API function to replace the mock
const sendAnalysisRequest = async (model_id: string, file: File) => {
  const formData = new FormData();
  formData.append('model_id', model_id);
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/process-data', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
};

const AnalysisForm: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const validateFile = (): boolean => {
    if (!selectedFile) {
      setFormError('Por favor, selecione um arquivo CSV.');
      return false;
    }

    if (!selectedFile.name.endsWith('.csv')) {
      setFormError('Apenas arquivos CSV são aceitos.');
      return false;
    }

    // Could add more validations here (file size, etc.)
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setFormError(null);

    if (file && !file.name.endsWith('.csv')) {
      setFormError('Apenas arquivos CSV são aceitos.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateFile()) {
      return;
    }

    setIsLoading(true);

    try {
      // Send data to the real API endpoint
      const response = await sendAnalysisRequest(selectedModel, selectedFile!);
      setFormSubmitted(true);
      setAnalysisResults(response);
      console.log('Analysis completed:', response);
    } catch (error) {
      console.error('API error:', error);
      setFormError(
        'Ocorreu um erro ao processar a análise. Por favor, tente novamente.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || !selectedFile || !!formError;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="px-6 py-8 sm:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Configuração de Análise
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={isLoading} className="space-y-6">
            <ModelSelector
              options={modelOptions}
              selectedModel={selectedModel}
              onChange={setSelectedModel}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload do arquivo de dados (CSV)
              </label>
              <div className="mt-1 flex items-center">
                <label
                  className={`
                    w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg 
                    border-2 border-dashed cursor-pointer hover:bg-gray-50 transition-colors
                    ${selectedFile ? 'border-green-300' : 'border-gray-300'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center">
                    <Upload
                      className={`w-8 h-8 ${
                        selectedFile ? 'text-green-500' : 'text-gray-400'
                      }`}
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedFile
                        ? selectedFile.name
                        : 'Clique para selecionar um arquivo CSV'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFile
                        ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                        : 'CSV (valores separados por vírgula)'}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".csv"
                  />
                </label>
              </div>
            </div>
          </fieldset>

          {formError && (
            <div className="text-red-500 text-sm py-2 px-3 bg-red-50 rounded-md">
              {formError}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`
                w-full py-3 px-4 font-medium rounded-lg shadow transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                ${
                  isButtonDisabled
                    ? 'bg-blue-300 text-white cursor-not-allowed filter grayscale opacity-75'
                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                }
                disabled:transform disabled:scale-[0.99] disabled:shadow-sm
              `}
            >
              <span className="flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Processando...
                  </>
                ) : (
                  'Iniciar Análise'
                )}
              </span>
            </button>
          </div>
        </form>

        {formSubmitted && !isLoading && analysisResults && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md animate-fade-in">
            <h3 className="font-medium text-green-800 mb-2">
              Análise feita com sucesso!
            </h3>
            <p className="text-sm text-green-700">
              Modelo:{' '}
              {
                modelOptions.find((m) => m.id === analysisResults.model_id)
                  ?.label
              }
              <br />
              Arquivo: {selectedFile?.name}
              <br />
              Média: {analysisResults.predicted_values.mean || 'N/A'}:
              <br />
              Mediana: {analysisResults.predicted_values.median || 'N/A'}:
              <br />
              Valor mínimo: {analysisResults.predicted_values.min || 'N/A'}:
              <br />
              Valor máximo: {analysisResults.predicted_values.max || 'N/A'}:
              <br />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisForm;

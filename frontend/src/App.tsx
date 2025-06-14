import AnalysisForm from './components/AnalysisForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Análise de Combustível
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Configure os parâmetros para iniciar a análise da variação de preços
            da gasolina no período selecionado.
          </p>
        </header>

        <AnalysisForm />

        <footer className="mt-8 text-center text-gray-500 text-sm">
          © 2025 Sistema de Análise de Combustíveis
        </footer>
      </div>
    </div>
  );
}

export default App;

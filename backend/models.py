import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# Valid model IDs
VALID_MODELS = ['knn_model', 'lr_model', 'dt_model']

# Path to pre-trained models
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'trained_models')

def preprocess_data(df, model_id):
    """
    Preprocess data to match the format used during model training
    
    Args:
        df: pandas DataFrame containing the data
        model_id: ID of the model to use for preprocessing
        
    Returns:
        Preprocessed data ready for prediction
    """
    # Filter for GASOLINA if not already filtered
    if 'Produto' in df.columns and not all(df['Produto'] == 'GASOLINA'):
        df = df[df['Produto'] == 'GASOLINA'].copy()
    
    # Process dates if needed
    if 'Data da Coleta' in df.columns:
        df['Data da Coleta'] = pd.to_datetime(df['Data da Coleta'], errors='coerce')
        df = df.dropna(subset=['Data da Coleta'])
        # Extract year, month, day if not already present
        if 'Ano' not in df.columns:
            df['Ano'] = df['Data da Coleta'].dt.year
        if 'Mes' not in df.columns:
            df['Mes'] = df['Data da Coleta'].dt.month
        if 'Dia' not in df.columns:
            df['Dia'] = df['Data da Coleta'].dt.day

    required_features = ['Produto', 'Bandeira', 'Regiao - Sigla', 'Estado - Sigla', 'Ano', 'Mes', 'Dia', 'Valor de Compra']

    X = df[required_features].copy()
    
    # Encode categorical features
    le = LabelEncoder()

    for col in ['Produto', 'Bandeira', 'Regiao - Sigla', 'Estado - Sigla']:
        X[col] = le.fit_transform(X[col].astype(str)) 
    
    # Impute missing values
    imputer = SimpleImputer(strategy='mean')
    X_imputed = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_imputed)
    
    return X_scaled

def process_data_with_model(df, model_id):
    """
    Use a pre-trained model to process the provided dataframe
    
    Args:
        df: pandas DataFrame containing the data
        model_id: ID of the pre-trained model to use
        
    Returns:
        Dictionary with processing results including predicted "Valor de Venda"
    """
    # Load the pre-trained model
    model_path = os.path.join(MODELS_DIR, f"{model_id}.joblib")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Pre-trained model not found: {model_path}")
    
    model = joblib.load(model_path)
    
    try:
        # Preprocess the data
        X_processed = preprocess_data(df, model_id)
        
        # Make predictions
        predictions = model.predict(X_processed)
        
        # Create a results DataFrame including original data and predictions
        results_df = df.copy()
        results_df['Predicted_Valor_de_Venda'] = predictions
        print([results_df['Predicted_Valor_de_Venda']])
        return {
            "model_id": model_id,
            "success": True,
            "data_shape": df.shape,
            "results": predictions.tolist(),
            "predicted_values": {
                "mean": float(np.mean(predictions)),
                "median": float(np.median(predictions)),
                "min": float(np.min(predictions)),
                "max": float(np.max(predictions))
            },
            "processed_data": results_df.to_dict(orient='records')
        }
    except Exception as e:
        return {
            "model_id": model_id,
            "success": False,
            "error": str(e)
        }

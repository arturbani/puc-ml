from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from models import process_data_with_model, VALID_MODELS

app = FastAPI(title="ML Model Processing API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-data/")
async def process_data_endpoint(
    file: UploadFile = File(...),
    model_id: str = Form(...),
):
    """
    Process data using a pre-trained model.
    
    Args:
        file: CSV file with the data to process
        model_id: ID of the pre-trained model to use (model-a, model-b, or model-c)
    
    Returns:
        Dictionary containing processing results
    """
    # Validate model id
    if model_id not in VALID_MODELS:
        raise HTTPException(status_code=400, detail=f"Invalid model ID. Must be one of: {', '.join(VALID_MODELS)}")
    df = pd.DataFrame()

    # Read and validate CSV file
    try:
        contents = await file.read()
        chunk_iter = pd.read_csv(
          io.StringIO(contents.decode('utf-8')),
          delimiter=';',
          on_bad_lines='skip',
          engine='python',
          chunksize=100000
        )

        for chunk in chunk_iter:
          df = pd.concat([df, chunk])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV file: {str(e)}")
    
    # Process the data with the model
    try:
        result = process_data_with_model(df, model_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")

FROM python:3.11-slim

# Set working directory
WORKDIR /workspace

# Install system dependencies including curl for healthcheck
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt ./server/

# Install Python dependencies
RUN pip install --no-cache-dir -r ./server/requirements.txt

# Copy source code
COPY . ./server/

# Set PYTHONPATH to include workspace
ENV PYTHONPATH=/workspace

# Expose port
EXPOSE 8000

# Command to run the application
WORKDIR /workspace/server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
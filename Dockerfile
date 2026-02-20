# ---- Stage 1: Builder (Node.js) ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx vite build

# ---- Stage 2: Server (Python/Flask) ----
# Mamba in order to avoid C++ compilation errors on Mac ARM (aarch64) when installing ezc3d and numpy (NFR1)
FROM condaforge/mambaforge:latest AS server

WORKDIR /server

RUN mamba install -y -c conda-forge \
    python=3.11 \
    ezc3d \
    numpy \
    flask \
    gunicorn \
    && mamba clean -afy


COPY requirements.txt .

RUN sed -i '/ezc3d/d' requirements.txt && \
    sed -i '/numpy/d' requirements.txt && \
    pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY processor.py .
COPY --from=builder /app/dist ./dist/

EXPOSE 8080

ENV FLASK_PORT=8080
# 4 workers for better concurrency, fulfilling the requirement NFR5 (Scalability)
ENV FLASK_WORKERS=4 
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:$FLASK_PORT --workers $FLASK_WORKERS app:app"]
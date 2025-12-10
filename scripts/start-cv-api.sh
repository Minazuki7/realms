#!/bin/bash

# Script to check Ollama and verify setup for CV generation

echo "🚀 CV Generator Setup Check..."

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed!"
    echo "📦 Install it with: brew install ollama"
    echo "   Or visit: https://ollama.com/download"
    exit 1
fi

# Check if Ollama is running
if ! curl -s http://localhost:11434 > /dev/null 2>&1; then
    echo "❌ Ollama is not running."
    echo "📝 Start it in a separate terminal with: ollama serve"
    exit 1
else
    echo "✅ Ollama is running"
fi

# Check if model is available
MODEL="${OLLAMA_MODEL:-llama3.2:3b}"  # Default to faster 3b model
if ! ollama list | grep -q "$MODEL"; then
    echo "📥 Model $MODEL not found. Pulling it now..."
    if [ "$MODEL" = "llama3.2:3b" ]; then
        echo "   (Using faster 3B model - ~2GB download)"
    fi
    ollama pull $MODEL
else
    echo "✅ Model $MODEL is installed"
fi

echo ""
echo "✅ All set! CV Generator is ready to use."
echo "🌐 Start Next.js with: npm run dev"
echo "📝 Then go to: http://localhost:3000/admin"
echo ""

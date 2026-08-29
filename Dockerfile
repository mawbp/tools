# Use the latest official lightweight Bun image
FROM oven/bun:alpine AS base
WORKDIR /app

# Copy package files first to leverage Docker layer caching for dependencies
COPY package.json bun.lock ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Expose Vite's default dev server port
EXPOSE 5173

# Start the Vite development server binding to 0.0.0.0 so it is accessible from the host
CMD ["bun", "run", "dev", "--host"]

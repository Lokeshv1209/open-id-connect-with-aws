# Use an official Node.js image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Runtime environment variables (IMPORTANT)
ENV PORT=5000
ENV HOST=0.0.0.0

RUN npm install -g pnpm

# Copy the package.json and pnpm-lock.yaml to install dependencies
# This is done in stages to leverage Docker cache and avoid unnecessary installs
COPY package.json pnpm-lock.yaml /app/

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . /app/

# Build the Next.js app for production
RUN pnpm run build

# Expose port if necessary for your app (this is common for web apps)
EXPOSE 5000

# Default command to run the application (adjust if your build/start command differs)
CMD ["pnpm", "run", "start"]

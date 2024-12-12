FROM node:20-bullseye

WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install pyyaml && \
    rm -rf /var/lib/apt/lists/*

COPY app /app

RUN npm install && npm run build

EXPOSE 5000

CMD ["sh", "-c", "python3 server/config_loader.py && node dist/index.js"]
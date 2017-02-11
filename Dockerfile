FROM node:4

RUN apt-get update && \
    apt-get install -yq --no-install-recommends \
    git \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


ADD package.json package.json
RUN npm install
ADD . .

EXPOSE 1337

CMD ["node","app.js"]


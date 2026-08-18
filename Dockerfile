# ---- Build stage: install dependencies with npm ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ---- Final stage: only the runtime, no npm CLI left in the image ----
FROM node:20-alpine
WORKDIR /app

# Pull in whatever OS package patches (OpenSSL, etc.) are currently
# available for this Alpine release, instead of relying solely on
# whatever was baked into the base image at the time it was published.
RUN apk update && apk upgrade --no-cache

COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
COPY server.js ./
COPY public ./public

# npm itself (and everything bundled with it - tar, glob, minimatch,
# cross-spawn, sigstore, etc.) is only needed to install dependencies,
# not to run the server. Removing it drops those from the final image
# entirely, since the app is started with `node`, not `npm start`.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "server.js"]

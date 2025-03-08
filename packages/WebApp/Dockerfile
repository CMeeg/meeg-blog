# UI build stage
FROM node:22-slim AS uibuild
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /src

## Copy source code
COPY . .

## Install deps
RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

## Set env for build
ENV NODE_ENV=production
ENV DOTNET_ENVIRONMENT=Production

## Build Phoria Islands and Server
RUN pnpm lerna run build:islands
RUN pnpm lerna run build:server

## Create deployment package
RUN pnpm --filter=webapp deploy --prod /app

# Dotnet build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dotnetbuild
WORKDIR /src

## Copy source code
COPY . .

## Restore all projects
RUN dotnet restore  ./packages/WebApp/WebApp.csproj

## Create deployment package
RUN dotnet publish ./packages/WebApp/WebApp.csproj -c Release --no-restore -o /app

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
ENV NODE_ENV=production
ENV DOTNET_ENVIRONMENT=Production
WORKDIR /app

## Copy dotnetbuild assets
COPY --from=dotnetbuild /app .

## Rename the WebApp binary as otherwise it will conflict with the WebApp directory from the uibuild
RUN mv /app/WebApp /app/WebAppCmd

## Copy uibuild assets
COPY --from=uibuild /app .

# Install node for Phoria Server
ENV NODE_VERSION=22.11.0
RUN apt-get -y update \
	&& apt-get install -y curl \
	&& curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} -o nodesource_setup.sh | bash \
	&& apt-get install -y --no-install-recommends nodejs \
	&& apt-get clean

# Run the app
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["./WebAppCmd"]

# meeg.dev

[Chris Meagher's personal blog](https://meeg.dev). Built with:

* 🏝️ [Phoria](https://github.com/CMeeg/phoria)
* ✏️ [Storyblok](https://www.storyblok.com/)

## Usage

Once cloned you will need to install the dependencies:

```shell
corepack enable pnpm
pnpm install
```

Then you can run the project in dev mode:

```shell
# Add dev certs
dotnet dev-certs https --trust

# Start the app in development mode
pnpm lerna run dev
```

Or build the project for production:

```shell
# Build the project
pnpm lerna run build

# Preview the production build
pnpm lerna run preview
```

Or run the production build in a Docker container:

```shell
# Build the container image
docker build -f ./packages/WebApp/Dockerfile -t phoriaapp:latest .

# Run the container image (and browse on http://localhost:3001)
docker run --name phoriaapp -d -p 3001:8080 phoriaapp:latest

# Stop the container image
docker stop phoriaapp

# Remove the container image
docker rm phoriaapp
```

> [!NOTE]
> You will need to have [Docker Desktop](https://docs.docker.com/desktop/) installed before running the above commands.

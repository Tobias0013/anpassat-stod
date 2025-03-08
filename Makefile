.PHONY: all $(MAKECMDGOALS)
include .env

default:
	@echo Hello o/. this is a makefile
	@echo ""
	@${MAKE} help -s

help:
	@echo "Available commands:"
	@echo "  make install       - Install project dependencies"
	@echo "  make client        - Run the client"
	@echo "  make server        - Run the server"
	@echo "  make start         - Run both client and server concurrently"
	@echo "  make build-client  - Build the client"
	@echo "  make build-server  - Build the server"
	@echo "  make build         - Build both client and server concurrently"
	@echo "  make start-build   - Start the built project"
	@echo "  make clean         - Clean up project"
	@echo "  make clean-node    - Clean up node_modules"
	@echo "  make clean-docs    - Clean up docs"
	@echo "  make clean-build   - Clean up build folders"
	@echo "  make port-status   - Check the status of the server port"
	@echo "  make doc           - Generate automated documentation"
	@echo "  make doc-typedoc   - Generate typedoc documentation"
	@echo "  make doc-client     - Generate client documentation"
	@echo "  make doc-server     - Generate server documentation"

# Install project dependencies.
install:
	@echo installing project dependencies
	@npm install

i: install

# Run project or parts of project.
client:
	@npx concurrently "npx webpack-dev-server --mode development --open"

server:
	@npx nodemon server/server.ts

start:
	@npx concurrently "npx webpack-dev-server --mode development --open" "make server"

# Build project or parts of project.
build-client:
	@npx webpack --mode production

build-server:
	@npx tsc

build:
	@npx concurrently "make build-client" "make build-server"

start-build:
	@start http://localhost:$(PORT) && node dist-server/server.js

# Clean project or parts of project.
clean-node:
	@echo Clean up node_modules
	@rm -r -f node_modules

clean-docs:
	@echo Clean up docs
	@rm -r -f docs

clean-build:
	@echo Clean up build folders
	@rm -r -f dist
	@rm -r -f dist-server

clean:
	@make clean-build && make clean-node && make clean-docs

# Generate automated documentation.
doc: 
	@make doc-typedoc && make doc-client && make doc-server

doc-typedoc: 
	@npx typedoc

doc-client: 
	@mkdir -p ./docs/graphs-client && make doc-madge-client && make doc-dc-client && make doc-dc-external-client

doc-server: 
	@mkdir -p ./docs/graphs-server && make doc-madge-server && make doc-dc-server && make doc-dc-external-server

doc-madge-client: 
	@npx madge --extensions ts,tsx --ts-config tsconfig.json  --image docs/graphs-client/madge-graph-client.png client

doc-madge-server: 
	@npx madge --extensions ts,tsx --ts-config tsconfig.json  --image docs/graphs-server/madge-graph-server.png server

doc-dc-client: 
	@npx depcruise client --include-only '^client' --output-type dot | dot -T svg > docs/graphs-client/dc-graph-client.svg

doc-dc-server: 
	@npx depcruise server --include-only '^server' --output-type dot | dot -T svg > docs/graphs-server/dc-graph-server.svg

doc-dc-external-client: 
	@npx depcruise client --output-type dot | dot -T svg > docs/graphs-client/dc-ext-graph-client.svg

doc-dc-external-server: 
	@npx depcruise server --output-type dot | dot -T svg > docs/graphs-server/dc-ext-graph-server.svg

# Utility.
port-status:
	@netstat -ano | grep :$(PORT)
	@echo ""
	@echo "To kill the process (windows), run: taskkill -f -pid <PID>"
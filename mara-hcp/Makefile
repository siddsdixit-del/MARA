.PHONY: help setup start stop restart clean logs test lint build migrate db-shell redis-shell

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

help: ## Show this help message
	@echo "$(BLUE)MARA HCP - Development Commands$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

setup: ## Setup development environment (first time setup)
	@echo "$(BLUE)Setting up MARA HCP development environment...$(RESET)"
	@docker-compose pull
	@docker-compose up -d
	@echo "$(YELLOW)Waiting for services to be healthy...$(RESET)"
	@sleep 20
	@echo "$(GREEN)✓ Infrastructure services started$(RESET)"
	@echo "$(YELLOW)Running database migrations...$(RESET)"
	@$(MAKE) migrate
	@echo "$(GREEN)✓ Setup complete!$(RESET)"
	@echo ""
	@echo "$(BLUE)Access URLs:$(RESET)"
	@echo "  - Grafana:    http://localhost:3000 (admin/admin)"
	@echo "  - Prometheus: http://localhost:9090"
	@echo "  - Kong Admin: http://localhost:8001"
	@echo "  - Kong Proxy: http://localhost:8000"
	@echo "  - Consul UI:  http://localhost:8500"
	@echo "  - Vault:      http://localhost:8200 (token: dev-token)"
	@echo "  - Neo4j:      http://localhost:7474 (neo4j/dev_password)"

start: ## Start all infrastructure services
	@echo "$(BLUE)Starting MARA HCP services...$(RESET)"
	@docker-compose up -d
	@echo "$(GREEN)✓ Services started$(RESET)"

stop: ## Stop all services
	@echo "$(YELLOW)Stopping MARA HCP services...$(RESET)"
	@docker-compose stop
	@echo "$(GREEN)✓ Services stopped$(RESET)"

restart: ## Restart all services
	@echo "$(YELLOW)Restarting MARA HCP services...$(RESET)"
	@docker-compose restart
	@echo "$(GREEN)✓ Services restarted$(RESET)"

clean: ## Stop and remove all containers, volumes, and networks
	@echo "$(RED)⚠️  This will delete all data. Are you sure? [y/N] $(RESET)" && read ans && [ $${ans:-N} = y ]
	@docker-compose down -v
	@echo "$(GREEN)✓ Cleaned up$(RESET)"

logs: ## Show logs from all services
	@docker-compose logs -f

logs-postgres: ## Show PostgreSQL logs
	@docker-compose logs -f postgres

logs-timescale: ## Show TimescaleDB logs
	@docker-compose logs -f timescaledb

logs-kafka: ## Show Kafka logs
	@docker-compose logs -f kafka

logs-kong: ## Show Kong logs
	@docker-compose logs -f kong

status: ## Show status of all services
	@docker-compose ps

migrate: ## Run database migrations
	@echo "$(BLUE)Databases are auto-initialized via init scripts$(RESET)"
	@echo "$(GREEN)✓ Migrations applied$(RESET)"

db-shell: ## Open PostgreSQL shell
	@docker-compose exec postgres psql -U mara -d mara_hcp

timescale-shell: ## Open TimescaleDB shell
	@docker-compose exec timescaledb psql -U mara -d mara_metrics

redis-shell: ## Open Redis CLI
	@docker-compose exec redis redis-cli

mongo-shell: ## Open MongoDB shell
	@docker-compose exec mongodb mongosh -u mara -p dev_password

neo4j-shell: ## Open Neo4j shell
	@docker-compose exec neo4j cypher-shell -u neo4j -p dev_password

# Development commands
dev-orchestrator: ## Run orchestrator service locally (Go)
	@cd services/orchestrator && go run main.go

dev-optimizer: ## Run optimizer service locally (Python)
	@cd services/optimizer && python -m uvicorn main:app --reload --port 8081

dev-simulator-gpu: ## Run GPU simulator (Python)
	@cd simulators/gpu-sim && python main.py

dev-simulator-asic: ## Run ASIC simulator (Python)
	@cd simulators/asic-sim && python main.py

# Testing
test: ## Run all tests
	@echo "$(BLUE)Running tests...$(RESET)"
	@$(MAKE) test-go
	@$(MAKE) test-python
	@$(MAKE) test-frontend
	@echo "$(GREEN)✓ All tests passed$(RESET)"

test-go: ## Run Go tests
	@echo "$(BLUE)Running Go tests...$(RESET)"
	@cd services && go test ./... -v -cover

test-python: ## Run Python tests
	@echo "$(BLUE)Running Python tests...$(RESET)"
	@cd simulators && pytest -v

test-frontend: ## Run frontend tests
	@echo "$(BLUE)Running frontend tests...$(RESET)"
	@cd web/portal && npm test

# Linting
lint: ## Run all linters
	@echo "$(BLUE)Running linters...$(RESET)"
	@$(MAKE) lint-go
	@$(MAKE) lint-python
	@$(MAKE) lint-frontend
	@echo "$(GREEN)✓ Linting complete$(RESET)"

lint-go: ## Lint Go code
	@echo "$(BLUE)Linting Go code...$(RESET)"
	@cd services && golangci-lint run ./...

lint-python: ## Lint Python code
	@echo "$(BLUE)Linting Python code...$(RESET)"
	@cd simulators && pylint **/*.py
	@cd simulators && black --check .
	@cd simulators && mypy .

lint-frontend: ## Lint frontend code
	@echo "$(BLUE)Linting frontend code...$(RESET)"
	@cd web/portal && npm run lint

# Build
build: ## Build all Docker images
	@echo "$(BLUE)Building Docker images...$(RESET)"
	@docker build -t mara-hcp/orchestrator:latest services/orchestrator
	@docker build -t mara-hcp/optimizer:latest services/optimizer
	@echo "$(GREEN)✓ Build complete$(RESET)"

# Health checks
health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(RESET)"
	@echo "PostgreSQL:   $$(docker-compose exec -T postgres pg_isready -U mara && echo '$(GREEN)✓$(RESET)' || echo '$(RED)✗$(RESET)')"
	@echo "TimescaleDB:  $$(docker-compose exec -T timescaledb pg_isready -U mara && echo '$(GREEN)✓$(RESET)' || echo '$(RED)✗$(RESET)')"
	@echo "Redis:        $$(docker-compose exec -T redis redis-cli ping | grep PONG && echo '$(GREEN)✓$(RESET)' || echo '$(RED)✗$(RESET)')"
	@echo "Kafka:        $$(docker-compose exec -T kafka kafka-broker-api-versions --bootstrap-server localhost:9092 2>&1 | grep -q 'ApiVersion' && echo '$(GREEN)✓$(RESET)' || echo '$(RED)✗$(RESET)')"
	@echo "Prometheus:   $$(curl -s http://localhost:9090/-/healthy | grep -q 'Prometheus' && echo '$(GREEN)✓$(RESET)' || echo '$(RED)✗$(RESET)')"
	@echo "Grafana:      $$(curl -s http://localhost:3000/api/health | grep -q 'ok' && echo '$(GREEN)✓$(RESET)' || echo '$(RED)✗$(RESET)')"
	@echo "Kong:         $$(curl -s http://localhost:8001/ | grep -q 'version' && echo '$(GREEN)✓$(RESET)' || echo '$(RED)✗$(RESET)')"

# Utilities
seed-data: ## Seed database with sample data
	@echo "$(BLUE)Seeding database with sample data...$(RESET)"
	@docker-compose exec -T postgres psql -U mara -d mara_hcp -f /docker-entrypoint-initdb.d/init.sql
	@echo "$(GREEN)✓ Data seeded$(RESET)"

backup-db: ## Backup PostgreSQL database
	@echo "$(BLUE)Backing up database...$(RESET)"
	@mkdir -p backups
	@docker-compose exec -T postgres pg_dump -U mara mara_hcp > backups/mara_hcp_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Backup created in backups/$(RESET)"

restore-db: ## Restore PostgreSQL database (usage: make restore-db FILE=backup.sql)
	@echo "$(BLUE)Restoring database from $(FILE)...$(RESET)"
	@docker-compose exec -T postgres psql -U mara mara_hcp < $(FILE)
	@echo "$(GREEN)✓ Database restored$(RESET)"

# Documentation
docs: ## Generate API documentation
	@echo "$(BLUE)Generating documentation...$(RESET)"
	@echo "$(YELLOW)Documentation generation not yet implemented$(RESET)"

.DEFAULT_GOAL := help


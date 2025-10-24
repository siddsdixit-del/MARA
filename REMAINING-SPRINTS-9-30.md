# MARA HCP - Sprints 9-30 (Detailed Continuation)

This document continues the development plan from Sprint 9 onwards. It should be merged with `development-plan-cursor.md` after Sprint 8.

---

## Sprint 9: Customer Portal - Dashboard & Core Pages

**Duration:** 2 weeks  
**Focus:** Executive Dashboard, Resource Browser, Workload Management, Real-time updates

### Objectives
- Implement Executive and Operations Dashboards from design-system-and-ux.md
- Build Resource Browser and Detail views
- Create Workload List and Detail views
- Implement WebSocket for real-time updates
- Add command palette (Cmd+K)

### Key Components

#### 9.1 Executive Dashboard
```typescript
// pages/Dashboard.tsx
import { KPICard, LineChart, WorkloadTable } from '../components';

export const ExecutiveDashboard: React.FC = () => {
  const { data: metrics } = useQuery('metrics', fetchMetrics);
  const ws = useWebSocket('/ws/metrics');
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <KPICard
          title="Today's Revenue"
          value={metrics.revenue}
          change={+12.3}
          trend="up"
          icon={<AttachMoney />}
        />
      </Grid>
      {/* More KPI cards */}
      
      <Grid item xs={12}>
        <Card>
          <CardHeader title="GPU Utilization by Facility" />
          <CardContent>
            <LineChart data={metrics.utilization} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
```

#### 9.2 Resource Browser with DataGrid
```typescript
// pages/Resources.tsx
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 120 },
  { field: 'type', headerName: 'Type', width: 150 },
  {
    field: 'utilization',
    headerName: 'Utilization',
    width: 200,
    renderCell: (params) => (
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={params.value}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption">{params.value}%</Typography>
      </Box>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={getStatusColor(params.value)}
        size="small"
      />
    ),
  },
];

export const Resources: React.FC = () => {
  const { data, loading } = useQuery('resources', fetchResources);
  
  return (
    <Box>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={20}
        autoHeight
        checkboxSelection
        disableSelectionOnClick
        loading={loading}
      />
    </Box>
  );
};
```

#### 9.3 WebSocket Hook for Real-time Updates
```typescript
// hooks/useWebSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = (namespace: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [data, setData] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(namespace, {
      auth: { token: localStorage.getItem('token') },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('update', (update) => {
      setData(update);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [namespace]);

  return { socket, data, connected };
};
```

#### 9.4 Command Palette (Cmd+K)
```typescript
// components/CommandPalette.tsx
import { Dialog, TextField, List, ListItemButton } from '@mui/material';

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const commands = [
    { label: 'Dashboard', action: () => navigate('/dashboard'), icon: '📊' },
    { label: 'Resources', action: () => navigate('/resources'), icon: '🖥️' },
    { label: 'Workloads', action: () => navigate('/workloads'), icon: '⚡' },
    { label: 'Submit Workload', action: () => navigate('/workloads/submit'), icon: '➕' },
    { label: 'Billing', action: () => navigate('/billing'), icon: '💰' },
    { label: 'Settings', action: () => navigate('/settings'), icon: '⚙️' },
  ].filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <TextField
        autoFocus
        placeholder="Search for commands..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
      />
      <List>
        {commands.map((cmd) => (
          <ListItemButton
            key={cmd.label}
            onClick={() => {
              cmd.action();
              setOpen(false);
            }}
          >
            <span style={{ marginRight: 12 }}>{cmd.icon}</span>
            {cmd.label}
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
};
```

#### Deliverables
- [ ] Executive Dashboard with 8 KPI cards
- [ ] Operations Dashboard with heatmaps
- [ ] Resource Browser with filters and search
- [ ] Resource Detail view with real-time metrics
- [ ] Workload List and Detail views
- [ ] WebSocket real-time updates
- [ ] Command Palette (Cmd+K)
- [ ] Mobile responsive views

#### Success Criteria
- ✅ Dashboard loads in <2s
- ✅ Real-time updates with <1s latency
- ✅ 60fps smooth animations
- ✅ Command palette opens in <50ms
- ✅ All pages responsive (mobile/tablet/desktop)

---

## Sprint 10-11: API Development & SDKs

**Duration:** 4 weeks  
**Focus:** REST & GraphQL APIs, Python/Go/TypeScript SDKs, API documentation

### Sprint 10: REST & GraphQL APIs

**REST API (Go with Gin)**
```go
// api/v1/workloads.go
func RegisterWorkloadRoutes(r *gin.RouterGroup) {
    r.POST("/workloads", middleware.Auth(), handlers.SubmitWorkload)
    r.GET("/workloads", middleware.Auth(), handlers.ListWorkloads)
    r.GET("/workloads/:id", middleware.Auth(), handlers.GetWorkload)
    r.PATCH("/workloads/:id", middleware.Auth(), handlers.UpdateWorkload)
    r.DELETE("/workloads/:id", middleware.Auth(), handlers.DeleteWorkload)
    r.POST("/workloads/:id/pause", middleware.Auth(), handlers.PauseWorkload)
    r.POST("/workloads/:id/resume", middleware.Auth(), handlers.ResumeWorkload)
}
```

**GraphQL Schema**
```graphql
type Query {
  workloads(filter: WorkloadFilter, pagination: Pagination): WorkloadConnection!
  workload(id: ID!): Workload
  resources(filter: ResourceFilter): [Resource!]!
  resource(id: ID!): Resource
  metrics(resourceId: ID!, timeRange: TimeRange!): [Metric!]!
}

type Mutation {
  submitWorkload(input: WorkloadInput!): Workload!
  pauseWorkload(id: ID!): Workload!
  resumeWorkload(id: ID!): Workload!
  cancelWorkload(id: ID!): Workload!
}

type Subscription {
  workloadUpdates(id: ID!): WorkloadUpdate!
  resourceMetrics(resourceId: ID!): MetricUpdate!
}
```

### Sprint 11: Client SDKs

**Python SDK**
```python
# mara_hcp/client.py
class MARAClient:
    def __init__(self, api_key: str, base_url: str = "https://api.mara-hcp.com"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({"Authorization": f"Bearer {api_key}"})
    
    def submit_workload(self, workload: Workload) -> WorkloadResponse:
        """Submit a new workload"""
        response = self.session.post(
            f"{self.base_url}/v1/workloads",
            json=workload.to_dict()
        )
        response.raise_for_status()
        return WorkloadResponse.from_dict(response.json())
    
    def list_workloads(self, **filters) -> List[Workload]:
        """List workloads with optional filters"""
        response = self.session.get(
            f"{self.base_url}/v1/workloads",
            params=filters
        )
        response.raise_for_status()
        return [Workload.from_dict(w) for w in response.json()["workloads"]]
    
    def get_resource(self, resource_id: str) -> Resource:
        """Get resource by ID"""
        response = self.session.get(
            f"{self.base_url}/v1/resources/{resource_id}"
        )
        response.raise_for_status()
        return Resource.from_dict(response.json())
```

#### Deliverables
- [ ] REST API (30+ endpoints)
- [ ] GraphQL API with subscriptions
- [ ] Python SDK with full test coverage
- [ ] Go SDK
- [ ] TypeScript/JavaScript SDK
- [ ] API documentation (OpenAPI/Swagger)
- [ ] SDK documentation and examples
- [ ] Rate limiting and quota management

#### Success Criteria
- ✅ REST API p95 latency <100ms
- ✅ GraphQL queries <50ms
- ✅ 99.9% API uptime
- ✅ SDKs published to package managers
- ✅ 100% API endpoint documentation
- ✅ Interactive API playground

---

## Sprint 12-13: ML Components - Demand Forecasting & Anomaly Detection

**Duration:** 4 weeks  
**Focus:** TensorFlow/PyTorch models, training pipelines, model serving

### Sprint 12: Demand Forecasting

**Model Architecture**
```python
# ml/models/demand_forecasting.py
import tensorflow as tf
from tensorflow import keras

class DemandForecastingModel:
    def __init__(self):
        self.model = self.build_model()
    
    def build_model(self):
        """Build LSTM-based demand forecasting model"""
        model = keras.Sequential([
            keras.layers.LSTM(128, return_sequences=True, input_shape=(168, 10)),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(64, return_sequences=False),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(24)  # Forecast next 24 hours
        ])
        
        model.compile(
            optimizer='adam',
            loss='mse',
            metrics=['mae', 'mape']
        )
        
        return model
    
    def train(self, train_data, val_data, epochs=50):
        """Train the model"""
        history = self.model.fit(
            train_data,
            validation_data=val_data,
            epochs=epochs,
            callbacks=[
                keras.callbacks.EarlyStopping(patience=5),
                keras.callbacks.ModelCheckpoint('best_model.h5', save_best_only=True)
            ]
        )
        return history
    
    def predict(self, features):
        """Forecast demand"""
        return self.model.predict(features)
```

### Sprint 13: Anomaly Detection

**Anomaly Detection Service**
```python
# ml/services/anomaly_detection.py
class AnomalyDetectionService:
    def __init__(self):
        self.models = {
            'temperature': IsolationForest(contamination=0.1),
            'utilization': OneClassSVM(nu=0.1),
            'power': LOF(n_neighbors=20)
        }
    
    def detect_anomalies(self, metrics: pd.DataFrame) -> List[Anomaly]:
        """Detect anomalies in real-time metrics"""
        anomalies = []
        
        for metric_type, model in self.models.items():
            if metric_type in metrics.columns:
                predictions = model.predict(metrics[[metric_type]])
                anomaly_indices = np.where(predictions == -1)[0]
                
                for idx in anomaly_indices:
                    anomalies.append(Anomaly(
                        resource_id=metrics.iloc[idx]['resource_id'],
                        metric_type=metric_type,
                        value=metrics.iloc[idx][metric_type],
                        severity=self.calculate_severity(metrics.iloc[idx]),
                        timestamp=metrics.iloc[idx]['timestamp']
                    ))
        
        return anomalies
```

#### Deliverables
- [ ] Demand forecasting model (LSTM-based)
- [ ] Anomaly detection system (Isolation Forest + One-Class SVM)
- [ ] Model training pipeline
- [ ] MLflow for experiment tracking
- [ ] Model serving with TensorFlow Serving
- [ ] A/B testing framework for models

#### Success Criteria
- ✅ Demand forecasting MAPE <10%
- ✅ Anomaly detection F1-score >0.85
- ✅ Model inference <50ms
- ✅ Automated retraining pipeline
- ✅ Model versioning and rollback

---

## Sprint 14: Billing & Metering

**Duration:** 2 weeks  
**Focus:** Usage tracking, billing calculations, invoicing

### Implementation

**Metering Service (Go)**
```go
// billing/metering.go
type MeteringService struct {
    db          *sql.DB
    eventStream *kafka.Consumer
}

func (ms *MeteringService) RecordUsage(ctx context.Context, event UsageEvent) error {
    // Calculate cost based on resource type and duration
    cost := ms.calculateCost(event)
    
    usage := &Usage{
        ID:          uuid.New().String(),
        CustomerID:  event.CustomerID,
        WorkloadID:  event.WorkloadID,
        ResourceID:  event.ResourceID,
        ResourceType: event.ResourceType,
        StartTime:   event.StartTime,
        EndTime:     event.EndTime,
        Duration:    event.EndTime.Sub(event.StartTime),
        Cost:        cost,
        CreatedAt:   time.Now(),
    }
    
    return ms.db.InsertUsage(ctx, usage)
}

func (ms *MeteringService) GenerateInvoice(ctx context.Context, customerID string, period BillingPeriod) (*Invoice, error) {
    // Aggregate usage for the period
    usages, err := ms.db.GetUsageByPeriod(ctx, customerID, period.Start, period.End)
    if err != nil {
        return nil, err
    }
    
    invoice := &Invoice{
        ID:          uuid.New().String(),
        CustomerID:  customerID,
        Period:      period,
        LineItems:   ms.aggregateUsages(usages),
        Subtotal:    ms.calculateSubtotal(usages),
        Tax:         ms.calculateTax(usages),
        Total:       ms.calculateTotal(usages),
        GeneratedAt: time.Now(),
        DueDate:     period.End.AddDate(0, 0, 15), // 15 days net
    }
    
    return invoice, ms.db.InsertInvoice(ctx, invoice)
}
```

#### Deliverables
- [ ] Metering service for usage tracking
- [ ] Billing calculation engine
- [ ] Invoice generation
- [ ] Payment gateway integration (Stripe)
- [ ] Billing dashboard (see design-system-and-ux.md)
- [ ] Budget alerts and notifications

#### Success Criteria
- ✅ Real-time usage tracking (<1min lag)
- ✅ Accurate billing (100% accuracy)
- ✅ Automated invoice generation
- ✅ Payment processing <5s

---

## Sprint 15-16: Security - Authentication & Authorization

**Duration:** 4 weeks  
**Focus:** OAuth 2.0, RBAC, SSO, JWT

### Implementation

**OAuth 2.0 Server (Go)**
```go
// auth/oauth_server.go
type OAuthServer struct {
    store         *Store
    tokenManager  *TokenManager
    clientManager *ClientManager
}

func (s *OAuthServer) HandleAuthorize(w http.ResponseWriter, r *http.Request) {
    // Parse authorization request
    req := &AuthorizationRequest{
        ResponseType: r.FormValue("response_type"),
        ClientID:     r.FormValue("client_id"),
        RedirectURI:  r.FormValue("redirect_uri"),
        Scope:        r.FormValue("scope"),
        State:        r.FormValue("state"),
    }
    
    // Validate client
    client, err := s.clientManager.GetClient(req.ClientID)
    if err != nil {
        http.Error(w, "invalid_client", http.StatusBadRequest)
        return
    }
    
    // Generate authorization code
    code := s.tokenManager.GenerateAuthCode(client.ID, req.Scope)
    
    // Redirect with code
    redirectURL := fmt.Sprintf("%s?code=%s&state=%s", req.RedirectURI, code, req.State)
    http.Redirect(w, r, redirectURL, http.StatusFound)
}
```

**RBAC Implementation**
```go
// auth/rbac.go
type Permission string

const (
    PermissionReadWorkloads   Permission = "workloads:read"
    PermissionWriteWorkloads  Permission = "workloads:write"
    PermissionReadResources   Permission = "resources:read"
    PermissionManageBilling   Permission = "billing:manage"
    PermissionAdminAll        Permission = "admin:*"
)

type Role struct {
    ID          string
    Name        string
    Permissions []Permission
}

var PredefinedRoles = map[string]Role{
    "viewer": {
        ID:   "viewer",
        Name: "Viewer",
        Permissions: []Permission{
            PermissionReadWorkloads,
            PermissionReadResources,
        },
    },
    "developer": {
        ID:   "developer",
        Name: "Developer",
        Permissions: []Permission{
            PermissionReadWorkloads,
            PermissionWriteWorkloads,
            PermissionReadResources,
        },
    },
    "admin": {
        ID:   "admin",
        Name: "Administrator",
        Permissions: []Permission{
            PermissionAdminAll,
        },
    },
}

func (authz *Authorizer) CheckPermission(userID string, permission Permission) bool {
    user, _ := authz.getUserWithRoles(userID)
    
    for _, role := range user.Roles {
        if role.HasPermission(permission) {
            return true
        }
    }
    
    return false
}
```

#### Deliverables
- [ ] OAuth 2.0 server
- [ ] JWT token management
- [ ] RBAC system (5 predefined roles)
- [ ] SSO integration (SAML, OIDC)
- [ ] API key management
- [ ] Session management

#### Success Criteria
- ✅ OAuth 2.0 compliant
- ✅ SSO login <2s
- ✅ Permission checks <10ms
- ✅ Secure token storage
- ✅ MFA support

---

## Sprint 17-18: Security - Compliance & Audit

**Duration:** 4 weeks  
**Focus:** SOC 2 Type II, ISO 27001, audit logging, data encryption

### Implementation

**Audit Logging**
```go
// audit/logger.go
type AuditLogger struct {
    db *mongo.Database
}

type AuditLog struct {
    ID          string    `bson:"_id"`
    Timestamp   time.Time `bson:"timestamp"`
    UserID      string    `bson:"user_id"`
    UserEmail   string    `bson:"user_email"`
    Action      string    `bson:"action"`
    Resource    string    `bson:"resource"`
    ResourceID  string    `bson:"resource_id"`
    IPAddress   string    `bson:"ip_address"`
    UserAgent   string    `bson:"user_agent"`
    Status      string    `bson:"status"`
    Metadata    map[string]interface{} `bson:"metadata"`
}

func (al *AuditLogger) Log(ctx context.Context, log AuditLog) error {
    log.ID = uuid.New().String()
    log.Timestamp = time.Now()
    
    _, err := al.db.Collection("audit_logs").InsertOne(ctx, log)
    return err
}
```

**Data Encryption**
```go
// security/encryption.go
type EncryptionService struct {
    kms *gcpkms.KeyManagementClient
}

func (es *EncryptionService) EncryptData(data []byte) ([]byte, error) {
    // Use AES-256-GCM for data encryption
    block, err := aes.NewCipher(es.key)
    if err != nil {
        return nil, err
    }
    
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return nil, err
    }
    
    nonce := make([]byte, gcm.NonceSize())
    if _, err := rand.Read(nonce); err != nil {
        return nil, err
    }
    
    ciphertext := gcm.Seal(nonce, nonce, data, nil)
    return ciphertext, nil
}
```

#### Deliverables
- [ ] Audit logging system (MongoDB)
- [ ] Data encryption at rest (AES-256-GCM)
- [ ] Data encryption in transit (TLS 1.3)
- [ ] Key management (AWS KMS / Google Cloud KMS)
- [ ] SOC 2 Type II compliance documentation
- [ ] ISO 27001 compliance documentation
- [ ] GDPR compliance (data privacy)
- [ ] PCI DSS compliance (payment data)

#### Success Criteria
- ✅ 100% of sensitive operations logged
- ✅ All PII encrypted at rest
- ✅ TLS 1.3 for all communications
- ✅ Key rotation every 90 days
- ✅ SOC 2 audit pass
- ✅ ISO 27001 certification

---

## Sprint 19-20: DevOps - CI/CD & Infrastructure

**Duration:** 4 weeks  
**Focus:** GitLab CI/GitHub Actions, ArgoCD, Terraform

### Implementation

**GitLab CI Pipeline**
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_REGISTRY: registry.gitlab.com
  K8S_NAMESPACE: mara-hcp

test:
  stage: test
  script:
    - go test -v -cover ./...
    - go vet ./...
    - golangci-lint run
  coverage: '/coverage: \d+\.\d+/'

build:
  stage: build
  script:
    - docker build -t $DOCKER_REGISTRY/$CI_PROJECT_PATH:$CI_COMMIT_SHA .
    - docker push $DOCKER_REGISTRY/$CI_PROJECT_PATH:$CI_COMMIT_SHA
  only:
    - main
    - develop

deploy:staging:
  stage: deploy
  script:
    - kubectl set image deployment/workload-router workload-router=$DOCKER_REGISTRY/$CI_PROJECT_PATH:$CI_COMMIT_SHA -n $K8S_NAMESPACE-staging
  environment:
    name: staging
    url: https://staging.mara-hcp.com
  only:
    - develop

deploy:production:
  stage: deploy
  script:
    - kubectl set image deployment/workload-router workload-router=$DOCKER_REGISTRY/$CI_PROJECT_PATH:$CI_COMMIT_SHA -n $K8S_NAMESPACE-prod
  environment:
    name: production
    url: https://mara-hcp.com
  when: manual
  only:
    - main
```

**Terraform Infrastructure**
```hcl
# terraform/main.tf
module "gke_cluster" {
  source = "./modules/gke"
  
  project_id     = var.project_id
  region         = var.region
  cluster_name   = "mara-hcp-${var.environment}"
  
  node_pools = [
    {
      name               = "general"
      machine_type       = "n2-standard-8"
      min_count          = 3
      max_count          = 10
      disk_size_gb       = 100
      preemptible        = false
    },
    {
      name               = "gpu"
      machine_type       = "n1-standard-8"
      accelerator_type   = "nvidia-tesla-v100"
      accelerator_count  = 1
      min_count          = 0
      max_count          = 5
      preemptible        = true
    }
  ]
}

module "monitoring" {
  source = "./modules/monitoring"
  
  cluster_name = module.gke_cluster.cluster_name
  enable_prometheus = true
  enable_grafana    = true
  enable_jaeger     = true
}
```

#### Deliverables
- [ ] GitLab CI/CD pipelines (or GitHub Actions)
- [ ] ArgoCD for GitOps
- [ ] Terraform for infrastructure
- [ ] Automated testing in CI
- [ ] Canary deployments
- [ ] Blue-green deployments
- [ ] Rollback automation

#### Success Criteria
- ✅ CI pipeline runs <10 minutes
- ✅ Automated deployments to staging
- ✅ Manual approval for production
- ✅ Zero-downtime deployments
- ✅ Automated rollback on failure

---

## Sprint 21-22: Automated QA & Testing

**Duration:** 4 weeks  
**Focus:** Integration tests, E2E tests, load tests, chaos engineering

### Implementation

**Integration Tests (Go)**
```go
// tests/integration/workload_test.go
func TestWorkloadSubmissionFlow(t *testing.T) {
    // Setup test environment
    client := setupTestClient()
    defer teardownTestClient(client)
    
    // Test: Submit workload
    workload := &Workload{
        Type:          "ai-inference-rt",
        ResourceCount: 4,
        Requirements: ResourceRequirements{
            GPUModel:    "H100",
            MinMemoryGB: 40,
            MaxLatencyMs: 100,
        },
    }
    
    result, err := client.SubmitWorkload(context.Background(), workload)
    require.NoError(t, err)
    assert.NotEmpty(t, result.ID)
    assert.Equal(t, "queued", result.Status)
    
    // Wait for workload to start
    waitForStatus(t, client, result.ID, "running", 2*time.Minute)
    
    // Verify resource allocation
    allocation, err := client.GetAllocation(context.Background(), result.ID)
    require.NoError(t, err)
    assert.Equal(t, 4, len(allocation.ResourceIDs))
    
    // Test: Pause workload
    err = client.PauseWorkload(context.Background(), result.ID)
    require.NoError(t, err)
    waitForStatus(t, client, result.ID, "paused", 30*time.Second)
    
    // Test: Resume workload
    err = client.ResumeWorkload(context.Background(), result.ID)
    require.NoError(t, err)
    waitForStatus(t, client, result.ID, "running", 30*time.Second)
    
    // Test: Cancel workload
    err = client.CancelWorkload(context.Background(), result.ID)
    require.NoError(t, err)
    waitForStatus(t, client, result.ID, "cancelled", 30*time.Second)
}
```

**E2E Tests (Playwright)**
```typescript
// tests/e2e/workload-submission.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Workload Submission Flow', () => {
  test('should submit AI inference workload successfully', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to workload submission
    await expect(page).toHaveURL('/dashboard');
    await page.click('text=Submit Workload');
    
    // Fill workload form
    await page.selectOption('select[name="type"]', 'ai-inference-rt');
    await page.fill('input[name="resourceCount"]', '4');
    await page.selectOption('select[name="gpuModel"]', 'H100');
    await page.fill('input[name="maxLatency"]', '100');
    
    // Submit
    await page.click('button:has-text("Submit Workload")');
    
    // Verify success
    await expect(page.locator('.toast-success')).toContainText('Workload submitted successfully');
    await expect(page).toHaveURL(/\/workloads\/wl-/);
    
    // Verify workload details
    await expect(page.locator('h1')).toContainText('wl-');
    await expect(page.locator('.status-badge')).toHaveText('Queued');
  });
});
```

**Load Tests (k6)**
```javascript
// tests/load/api-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],     // Error rate < 1%
  },
};

export default function () {
  const token = 'test-api-key';
  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  
  // Test: List workloads
  let res = http.get('https://api.mara-hcp.com/v1/workloads', params);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
  
  // Test: Get resource
  res = http.get('https://api.mara-hcp.com/v1/resources/gpu-1234', params);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  sleep(1);
}
```

**Chaos Engineering (Chaos Mesh)**
```yaml
# tests/chaos/pod-failure.yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: workload-router-failure
  namespace: mara-hcp
spec:
  action: pod-failure
  mode: one
  duration: "30s"
  selector:
    namespaces:
      - mara-hcp
    labelSelectors:
      app: workload-router
  scheduler:
    cron: "0 9 * * *"  # Run daily at 9 AM
```

#### Deliverables
- [ ] 100+ integration tests
- [ ] 50+ E2E tests with Playwright
- [ ] Load tests for all critical APIs
- [ ] Chaos engineering scenarios
- [ ] Performance benchmarks
- [ ] Automated test execution in CI

#### Success Criteria
- ✅ 90%+ code coverage
- ✅ All tests passing before deployment
- ✅ Load tests pass at 2x expected load
- ✅ System recovers from chaos scenarios
- ✅ <1% flaky test rate

---

## Sprint 23-24: Performance Optimization & Scaling

**Duration:** 4 weeks  
**Focus:** Caching, database optimization, CDN, load balancing

### Implementation

**Redis Caching Strategy**
```go
// cache/redis.go
type CacheService struct {
    client *redis.Client
}

func (cs *CacheService) GetWorkload(ctx context.Context, id string) (*Workload, error) {
    // Try cache first
    cached, err := cs.client.Get(ctx, fmt.Sprintf("workload:%s", id)).Result()
    if err == nil {
        var workload Workload
        if err := json.Unmarshal([]byte(cached), &workload); err == nil {
            return &workload, nil
        }
    }
    
    // Cache miss - fetch from database
    workload, err := cs.db.GetWorkload(ctx, id)
    if err != nil {
        return nil, err
    }
    
    // Store in cache (5 minute TTL)
    data, _ := json.Marshal(workload)
    cs.client.Set(ctx, fmt.Sprintf("workload:%s", id), data, 5*time.Minute)
    
    return workload, nil
}
```

**Database Query Optimization**
```sql
-- Add indexes for common queries
CREATE INDEX idx_workloads_customer_status ON workloads(customer_id, status);
CREATE INDEX idx_workloads_created_at ON workloads(created_at DESC);
CREATE INDEX idx_resources_facility_status ON resources(facility_id, status);
CREATE INDEX idx_resources_type_utilization ON resources(type, utilization);

-- Optimize workload list query
EXPLAIN ANALYZE
SELECT w.id, w.type, w.status, w.created_at, 
       COUNT(a.resource_id) as resource_count
FROM workloads w
LEFT JOIN allocations a ON w.id = a.workload_id
WHERE w.customer_id = $1
  AND w.status IN ('running', 'queued')
GROUP BY w.id
ORDER BY w.created_at DESC
LIMIT 20;
```

**CDN Configuration (Cloudflare)**
```yaml
# cloudflare-config.yaml
cache_rules:
  - pattern: "*.js"
    cache_level: "standard"
    edge_cache_ttl: 86400  # 24 hours
  
  - pattern: "*.css"
    cache_level: "standard"
    edge_cache_ttl: 86400
  
  - pattern: "/api/v1/resources"
    cache_level: "standard"
    edge_cache_ttl: 60  # 1 minute
    bypass_cache_on_cookie: "auth_token"

rate_limiting:
  - zone: "/api/*"
    requests_per_minute: 100
    burst: 200
    
  - zone: "/graphql"
    requests_per_minute: 50
    burst: 100
```

#### Deliverables
- [ ] Redis caching layer
- [ ] Database query optimization
- [ ] CDN setup (Cloudflare/CloudFront)
- [ ] Load balancer configuration (HAProxy/Nginx)
- [ ] Horizontal pod autoscaling
- [ ] Database connection pooling
- [ ] API response compression

#### Success Criteria
- ✅ API p95 latency <100ms
- ✅ Cache hit rate >80%
- ✅ Database queries <50ms (p95)
- ✅ Support 10,000+ concurrent users
- ✅ Auto-scale from 5 to 50 pods based on load

---

## Sprint 25-26: Production Readiness & Hardening

**Duration:** 4 weeks  
**Focus:** Disaster recovery, backup, monitoring, runbooks

### Implementation

**Disaster Recovery Plan**
```yaml
# DR plan
backup_strategy:
  databases:
    postgresql:
      frequency: "every 6 hours"
      retention: "30 days"
      tool: "pg_dump + WAL archiving"
      restore_time: "<1 hour"
    
    mongodb:
      frequency: "daily"
      retention: "90 days"
      tool: "mongodump"
      restore_time: "<2 hours"
  
  kubernetes:
    frequency: "daily"
    tool: "Velero"
    includes:
      - persistent-volumes
      - configmaps
      - secrets
    retention: "14 days"

failover:
  rto: "< 4 hours"  # Recovery Time Objective
  rpo: "< 1 hour"   # Recovery Point Objective
  
  multi_region:
    primary: "us-central1"
    secondary: "us-east1"
    replication: "async"
    
  automated_failover:
    enabled: true
    health_check_interval: "30s"
    failure_threshold: 3
```

**Runbooks**
```markdown
# Runbook: High API Latency

## Symptoms
- API p95 latency > 500ms
- Dashboard shows "High Latency" alert

## Diagnosis
1. Check Grafana dashboard: "API Performance"
2. Check recent deployments: `kubectl rollout history deployment/api-gateway -n mara-hcp`
3. Check database query performance: `SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;`
4. Check Redis cache hit rate: `redis-cli info stats | grep keyspace`

## Resolution
### High Database Load
- Scale up database: `gcloud sql instances patch mara-hcp-db --tier=db-n1-highmem-8`
- Add read replicas: `kubectl scale deployment/postgres-read-replica --replicas=3`

### Low Cache Hit Rate
- Check cache configuration
- Increase cache TTL for frequently accessed resources
- Scale Redis cluster: `kubectl scale statefulset/redis --replicas=5`

### Application Issues
- Rollback recent deployment: `kubectl rollout undo deployment/api-gateway -n mara-hcp`
- Scale horizontally: `kubectl scale deployment/api-gateway --replicas=10`

## Post-Incident
- Update monitoring thresholds
- Document root cause
- Create Jira ticket for permanent fix
```

#### Deliverables
- [ ] Automated backup system
- [ ] Disaster recovery plan
- [ ] Multi-region deployment
- [ ] 10+ operational runbooks
- [ ] Incident response playbook
- [ ] Capacity planning documentation
- [ ] Security incident response plan

#### Success Criteria
- ✅ RPO < 1 hour
- ✅ RTO < 4 hours
- ✅ Automated daily backups
- ✅ Successful DR drill
- ✅ All runbooks tested

---

## Sprint 27-28: Integration Testing & UAT

**Duration:** 4 weeks  
**Focus:** End-to-end integration, user acceptance testing, performance validation

### Activities

**Week 1-2: System Integration Testing**
- Test all service integrations
- Validate data flow across all components
- Test failure scenarios and recovery
- Validate monitoring and alerting
- Load testing at 2x expected capacity

**Week 3-4: User Acceptance Testing**
- Invite beta customers
- Conduct user testing sessions
- Collect feedback on UI/UX
- Validate business workflows
- Performance testing with real workloads

#### Deliverables
- [ ] Integration test suite executed
- [ ] UAT with 5+ beta customers
- [ ] Performance validation report
- [ ] Bug fixes and refinements
- [ ] User feedback documentation

#### Success Criteria
- ✅ All critical bugs resolved
- ✅ 95%+ user satisfaction
- ✅ Performance targets met
- ✅ Zero P0/P1 bugs

---

## Sprint 29-30: Production Launch & Post-Launch

**Duration:** 4 weeks  
**Focus:** Production deployment, monitoring, support

### Sprint 29: Production Deployment

**Deployment Checklist**
```markdown
# Production Launch Checklist

## Pre-Launch (Day -7)
- [ ] Final security audit
- [ ] Load testing at 5x capacity
- [ ] Backup and DR tested
- [ ] Monitoring dashboards finalized
- [ ] On-call rotation scheduled
- [ ] Runbooks reviewed
- [ ] Customer support trained

## Launch Day (Day 0)
- [ ] Deploy to production (blue-green)
- [ ] Validate all services healthy
- [ ] Run smoke tests
- [ ] Monitor metrics for 4 hours
- [ ] Enable traffic routing
- [ ] Send launch announcement

## Post-Launch (Day +1 to +7)
- [ ] Daily metrics review
- [ ] Customer feedback collection
- [ ] Bug triage and fixes
- [ ] Performance optimization
- [ ] Documentation updates
```

### Sprint 30: Stabilization & Optimization

**Focus Areas:**
- Monitor production metrics 24/7
- Respond to incidents within SLA
- Collect and prioritize user feedback
- Performance optimization based on real usage
- Documentation updates
- Plan next iteration features

#### Deliverables
- [ ] Production system live
- [ ] 24/7 on-call support
- [ ] Incident response
- [ ] Performance metrics dashboard
- [ ] Customer feedback system
- [ ] Post-launch retrospective

#### Success Criteria
- ✅ 99.9% uptime in first month
- ✅ <5 P0/P1 incidents
- ✅ All P2+ bugs triaged
- ✅ Customer onboarding successful
- ✅ Revenue targets on track

---

## Post-Launch: Continuous Improvement

### Ongoing Activities
1. **Weekly sprints** for new features and bug fixes
2. **Monthly security audits** and compliance reviews
3. **Quarterly capacity planning** and infrastructure scaling
4. **Continuous monitoring** and performance optimization
5. **Regular customer feedback** sessions and feature prioritization

### Key Metrics to Track
- **Uptime:** 99.9%+ target
- **API Performance:** p95 < 100ms
- **Workload Success Rate:** 99.5%+
- **Customer Satisfaction:** NPS > 50
- **Revenue Growth:** Track against projections
- **Cost Efficiency:** $/GPU-hour optimization

---

## Summary

This comprehensive 30-sprint development plan covers:
- ✅ **Sprints 0-5:** Core platform (simulators, optimization, routing, resource management)
- ✅ **Sprints 6-7:** Monitoring & observability
- ✅ **Sprint 8:** Frontend & design system (with Figma)
- ✅ **Sprint 9:** Dashboard & core pages
- ✅ **Sprints 10-11:** API development & SDKs
- ✅ **Sprints 12-13:** ML components
- ✅ **Sprint 14:** Billing & metering
- ✅ **Sprints 15-18:** Security & compliance
- ✅ **Sprints 19-20:** DevOps & infrastructure
- ✅ **Sprints 21-22:** Automated QA & testing
- ✅ **Sprints 23-24:** Performance & scaling
- ✅ **Sprints 25-26:** Production readiness
- ✅ **Sprints 27-28:** Integration & UAT
- ✅ **Sprints 29-30:** Production launch

**Total Timeline:** 60 weeks (~14 months)

**Team Size Recommendation:**
- 2-3 Backend Engineers (Go/Python/Rust)
- 2 Frontend Engineers (React/TypeScript)
- 1 ML Engineer (TensorFlow/PyTorch)
- 1 DevOps Engineer (Kubernetes/Terraform)
- 1 QA Engineer (Automated testing)
- 1 Security Engineer (Part-time)
- 1 Product Manager
- 1 UX/UI Designer

**Total:** 9-10 people

This plan delivers a production-ready, enterprise-grade Hybrid Compute Platform with comprehensive features, security, compliance, and scalability.


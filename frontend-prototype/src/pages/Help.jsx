import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material';
import { ExpandMore, Email, Phone, Chat, Description } from '@mui/icons-material';

const faqs = [
  {
    question: 'How do I submit a new workload?',
    answer: 'Click the "Submit New Workload" button on your dashboard or navigate to the Workloads page and click "Submit Workload". Fill in your workload requirements including GPU count, model type, and estimated runtime.',
  },
  {
    question: 'How is billing calculated?',
    answer: 'Billing is calculated based on resource usage time and type. GPU resources are billed per hour at different rates depending on the GPU model (H100, L40S, etc.). You can view detailed billing breakdowns on the Billing page.',
  },
  {
    question: 'What GPU models are available?',
    answer: 'We offer NVIDIA H100 80GB, L40S 48GB, and A100 80GB GPUs. Availability varies by facility and workload priority.',
  },
  {
    question: 'How do I monitor my workload performance?',
    answer: 'Navigate to the Workloads page and click on any active workload to see real-time performance metrics, including GPU utilization, throughput, and latency.',
  },
  {
    question: 'What happens if my budget is exceeded?',
    answer: 'You will receive alerts when approaching your budget limit. You can set up budget alerts in Settings. Running workloads will continue, but you may want to review and optimize your usage.',
  },
];

export default function Help() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Help & Support
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Email sx={{ fontSize: 48, color: '#3B82F6', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Email Support
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Get help via email
              </Typography>
              <Button variant="contained" fullWidth>
                support@mara-hcp.com
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Chat sx={{ fontSize: 48, color: '#10B981', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Live Chat
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Chat with our team
              </Typography>
              <Button variant="contained" fullWidth color="success">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Phone sx={{ fontSize: 48, color: '#8B5CF6', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Phone Support
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Call us directly
              </Typography>
              <Button variant="contained" fullWidth color="secondary">
                +1 (555) 123-4567
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Frequently Asked Questions
              </Typography>
              <Box sx={{ mt: 3 }}>
                {faqs.map((faq, index) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documentation & Resources
              </Typography>
              <List>
                <ListItem button>
                  <Description sx={{ mr: 2 }} />
                  <ListItemText
                    primary="API Documentation"
                    secondary="Complete API reference and examples"
                  />
                </ListItem>
                <ListItem button>
                  <Description sx={{ mr: 2 }} />
                  <ListItemText
                    primary="Getting Started Guide"
                    secondary="Learn how to submit your first workload"
                  />
                </ListItem>
                <ListItem button>
                  <Description sx={{ mr: 2 }} />
                  <ListItemText
                    primary="Best Practices"
                    secondary="Optimize your workload performance and costs"
                  />
                </ListItem>
                <ListItem button>
                  <Description sx={{ mr: 2 }} />
                  <ListItemText
                    primary="Billing Guide"
                    secondary="Understanding pricing and billing"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Submit a Support Ticket
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Subject"
                  margin="normal"
                  placeholder="Brief description of your issue"
                />
                <TextField
                  fullWidth
                  label="Description"
                  margin="normal"
                  multiline
                  rows={4}
                  placeholder="Please provide details about your issue"
                />
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  margin="normal"
                  SelectProps={{ native: true }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </TextField>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Submit Ticket
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}


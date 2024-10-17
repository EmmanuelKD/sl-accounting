import NextLink from 'next/link';
import {
  Box,
  Link,
  List,
  ListItem,
  ListSubheader,
  Paper,
  Stack,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { paths } from '../../paths';

const sections = [
  {
    title: 'Products',
    children: [
      {
        title: 'List',
        path: paths.dashboard.products.index
      },
      {
        title: 'Summary',
        path: paths.dashboard.products.details.index
      },
      {
        title: 'Inventory',
        path: paths.dashboard.products.details.inventory
      },
      {
        title: 'Insights',
        path: paths.dashboard.products.details.insights
      }
    ]
  },
  {
    title: 'Orders',
    children: [
      {
        title: 'List',
        path: paths.dashboard.orders.index
      },
      {
        title: 'Summary',
        path: paths.dashboard.orders.details
      }
    ]
  },
  {
    title: 'Customers',
    children: [
      {
        title: 'List',
        path: paths.dashboard.customers.index
      },
      {
        title: 'Summary',
        path: paths.dashboard.customers.details.index
      },
      {
        title: 'Orders',
        path: paths.dashboard.customers.details.orders
      },
      {
        title: 'Activity',
        path: paths.dashboard.customers.details.activity
      }
    ]
  },
  {
    title: 'Invoices',
    children: [
      {
        title: 'List',
        path: paths.dashboard.invoices.index
      },
      {
        title: 'Create',
        path: paths.dashboard.invoices.create
      },
      {
        title: 'Details',
        path: paths.dashboard.invoices.details.index
      },
      {
        title: 'Preview',
        path: paths.dashboard.invoices.details.preview
      }
    ]
  },
  {
    title: 'Dashboards',
    children: [
      {
        title: 'Overview',
        path: paths.dashboard.index
      },
      {
        title: 'Reports',
        path: paths.dashboard.sales
      }
    ]
  },
  {
    title: 'Account',
    children: [
      {
        title: 'General',
        path: paths.dashboard.account.index
      },
      {
        title: 'Notifications',
        path: paths.dashboard.account.notifications
      }
    ]
  },
  {
    title: 'Organization',
    children: [
      {
        title: 'General',
        path: paths.dashboard.organization.index
      },
      {
        title: 'Team',
        path: paths.dashboard.organization.team
      },
      {
        title: 'Billing',
        path: paths.dashboard.organization.billing
      }
    ]
  }
];

const groupedSections = [
  sections.slice(0, 2),
  sections.slice(2, 4),
  sections.slice(4)
];

export const PagesPopover = () => (
  <Box
    sx={{
      display: 'none',
      left: 0,
      p: 3,
      position: 'absolute',
      top: 32,
      width: '100%'
    }}
  >
    <Paper
      elevation={10}
      sx={{
        display: 'flex',
        overflow: 'hidden',
        p: 3
      }}
    >
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.900'
            : 'neutral.50',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          width: 320
        }}
      >
        <Stack
          spacing={2}
          sx={{
            flexGrow: 1,
            p: 3
          }}
        >
          <Typography variant="h4">
            Pages
          </Typography>
          <Typography color="text.secondary">
            Carpatin - Admin Dashboard includes 6 unique user-flows with a total
            of 30 screens. We think the value is in the quality and not quantity.
          </Typography>
        </Stack>
        <Box
          sx={{
            '& > img': {
              height: 'auto',
              width: '100%'
            }
          }}
        >
          <img src="/assets/home-features-auth.png" />
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          px: 3
        }}
      >
        <Grid
          container
          spacing={3}
        >
          {groupedSections.map((sections, index) => (
            <Grid
              xs={4}
              key={index}
            >
              {sections.map((section) => (
                <List
                  key={section.title}
                  subheader={(
                    <ListSubheader
                      disableGutters
                      disableSticky
                    >
                      <Typography
                        color="text.secondary"
                        variant="overline"
                      >
                        {section.title}
                      </Typography>
                    </ListSubheader>
                  )}
                >
                  {section.children.map((item) => (
                    <ListItem
                      disableGutters
                      key={item.title}
                      sx={{ p: 0 }}
                    >
                      <Link
                        color="text.primary"
                        component={NextLink}
                        href={item.path}
                        sx={{
                          py: 2,
                          width: '100%',
                          '&:hover': {
                            color: 'primary.main'
                          }
                        }}
                        underline="none"
                        variant="body2"
                      >
                        {item.title}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  </Box>
);

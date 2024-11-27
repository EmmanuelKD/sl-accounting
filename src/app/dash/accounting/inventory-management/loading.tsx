import { Box, Grid, Paper, Skeleton } from "@mui/material";

const InventoryManagementLoading = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Skeleton variant="text" width={300} height={40} sx={{ mb: 3 }} />

      {/* Dashboard Overview */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={40} />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Filters Section */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={3} key={index}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Add Item Button */}
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="rectangular" width={150} height={36} />
      </Box>

      {/* Data Grid */}
      <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />

      {/* Low Stock Alerts */}
      <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        {[...Array(3)].map((_, index) => (
          <Box key={index} sx={{ display: "flex", mb: 2 }}>
            <Skeleton variant="rectangular" width="25%" height={40} sx={{ mr: 2 }} />
            <Skeleton variant="rectangular" width="25%" height={40} sx={{ mr: 2 }} />
            <Skeleton variant="rectangular" width="25%" height={40} sx={{ mr: 2 }} />
            <Skeleton variant="rectangular" width="25%" height={40} />
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default InventoryManagementLoading;
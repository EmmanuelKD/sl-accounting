import { Grid, Skeleton } from "@mui/material";

export default function PayrollLoading() {
  return (
    <div>
      {/* Toolbar skeleton */}
      <Skeleton variant="rectangular" height={64} sx={{ mb: 3 }} />

      {/* Summary Cards skeleton */}
      <Grid container spacing={3} sx={{ mt: 2, px: 2 }}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} md={4} key={item}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>

      {/* Search fields skeleton */}
      <Grid container spacing={3} sx={{ mt: 2, px: 2 }}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={56} />
        </Grid>
      </Grid>

      {/* Table skeleton */}
      <Grid container sx={{ mt: 2, px: 2 }}>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={400} />
        </Grid>
        {/* Pagination skeleton */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={52} />
        </Grid>
      </Grid>
    </div>
  );
}
"use client";
import { useMounted } from "@/hooks/use-mounted";
import { authenticate } from "@/lib/actions/auth";
import { paths } from "@/paths";
import {
  Box,
  Button,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as Yup from "yup";

const initialValues = {
  email: "admin@dti-sl.com",
  password: "1961AccounT",
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .max(255)
    .email("Must be a valid email")
    .required("Email is required"),
  password: Yup.string().max(255).required("Password is required"),
});

const Page = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || undefined;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        await authenticate({
          email: values.email,
          password: values.password,
          origin: returnTo || paths.dashboard.index,
        });

        if (isMounted()) {
          router.push(returnTo || paths.dashboard.index);
        }
      } catch (err: any) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });

          helpers.setSubmitting(false);
        }
      }
    },
  });

  return (
    <>
      <Head>
        <title>Login | Carpatin</title>
      </Head>
      <form onSubmit={formik.handleSubmit}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 3 }}
        >
          <Typography variant="h4">Login</Typography>
          <Button component={NextLink} href={paths.index}>
            Choose Org.
          </Button>
        </Stack>
        <Stack spacing={2}>
          <TextField
            autoFocus
            error={!!(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            label="Email address"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="email"
            value={formik.values.email}
          />
          <TextField
            error={!!(formik.touched.password && formik.errors.password)}
            fullWidth
            helperText={formik.touched.password && formik.errors.password}
            label="Password"
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="password"
            value={formik.values.password}
          />
        </Stack>
        {formik.errors.submit && (
          <FormHelperText error sx={{ mt: 3 }}>
            {formik.errors.submit}
          </FormHelperText>
        )}
        <Button
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          type="submit"
          variant="contained"
        >
          Login
        </Button>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Button component={NextLink} href="#">
            Forgot password
          </Button>
        </Box>
        
      </form>
    </>
  );
};

export default Page;

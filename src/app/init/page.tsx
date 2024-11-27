"use client";
import { initApp } from "@/lib/actions/initialization";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { useState } from "react";
import * as yup from 'yup';

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const formSchema = yup.object({
  workspaceName: yup
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .required(),
  name: yup.string().min(2, "Name must be at least 2 characters").required(),
  email: yup.string().email("Invalid email address").required(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords don't match")
    .required(),
});

type FormData = yup.InferType<typeof formSchema>;

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    workspaceName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File>();
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingDescription, setLoadingDescription] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setProfileImageFile(file);
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateLoading = async () => {
    const steps = [
      { progress: 20, description: "Initializing workspace..." },
      { progress: 40, description: "Creating user account..." },
      { progress: 60, description: "Setting up permissions..." },
      { progress: 80, description: "Finalizing setup..." },
      { progress: 100, description: "Completed!" },
    ];

    for (const step of steps) {
      setLoadingProgress(step.progress);
      setLoadingDescription(step.description);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await formSchema.validate(formData, { abortEarly: false });
      setIsLoading(true);

      const profileFormData = new FormData();
      if (profileImageFile) {
        profileFormData.append("image", profileImageFile as File);
      }

      await initApp({
        workspaceName: formData.workspaceName,
        defaultAdmin: {
          profile: profileFormData,
          email: formData.email,
          name: formData.name,
          password: formData.password,
        },
        // percentageLoader: (progress, description) => {
          // setLoadingProgress(progress);
          // setLoadingDescription(description);
        // },
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const fieldErrors: Partial<FormData> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path as keyof FormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
      setLoadingDescription("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            height={80}
            width={80}
          />{" "}
        </Box>
        <Card>
          <CardHeader
            title="Initialize Your Workspace"
            subheader="Set up your workspace and create your admin account"
          />
          <CardContent>
            {isLoading ? (
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress variant="determinate" value={loadingProgress} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 1 }}
                >
                  {loadingProgress}%
                </Typography>
                <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                  {loadingDescription}
                </Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Workspace Name"
                      name="workspaceName"
                      value={formData.workspaceName}
                      onChange={handleInputChange}
                      required
                      error={!!errors.workspaceName}
                      helperText={
                        errors.workspaceName ||
                        "This is the name of your organization's workspace"
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Admin Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Profile Image
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </Button>
                      {profileImage && (
                        <Avatar
                          src={profileImage}
                          alt="Profile Preview"
                          sx={{ width: 56, height: 56 }}
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" fullWidth>
                      Initialize Workspace
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

 
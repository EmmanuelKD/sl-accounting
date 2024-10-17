import {
  Box,
  Container,
  Divider,
  Stack,
   Typography,
} from "@mui/material";
import NextLink from "next/link";
import { ReactNode } from "react";
 import { paths } from "../../paths";
import { TOP_NAV_HEIGHT } from "@/const";
import MainCard from "@/components/main-card";
import Logo from "@/components/logo/Logo";

 

type LayoutPropTypes = {
  children: ReactNode;
};

export const AuthLayout = (props: LayoutPropTypes) => {
  const { children } = props;
 
  return (
    <>
      <Box
        component="header"
        sx={{
          backgroundColor: "background.paper",
          position: "sticky",
        }}
      >
        <Container maxWidth="md" sx={{ height: TOP_NAV_HEIGHT }}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              height: "100%",
            }}
          >
            <Box
              component={NextLink}
              href={paths.index}
              sx={{
                display: "inline-flex",
                height: 24,
                width: 24,
              }}
            >
              <Logo />
            </Box>
          </Box>
        </Container>
      </Box>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.paper",
          flexGrow: 1,
          py: "64px",
        }}
      >
        <Container maxWidth="sm">
        
          <MainCard
            sx={{
                maxWidth: { xs: 400, lg: 475 },
                margin: { xs: 2.5, md: 3 },
                '& > *': {
                    flexGrow: 1,
                    flexBasis: '50%'
                }
            }}
            content={false}
            // {...other}
            border={true}
            // boxShadow
            //  shadow={theme.customShadows.z1}
        >
            <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
        </MainCard>

          <Divider
            sx={{
              mb: 3,
              mt: 6,
            }}
          />
          <Stack alignItems="center" spacing={2}>
            <Typography align="center" variant="h5">
              Welcome to DTI-SL
            </Typography>
            <Typography align="center" color="text.secondary" variant="body2">
              Firebase, known for its robust security features, offers
              developers a reliable and trustworthy platform to build their
              applications on{" "}
            </Typography>
            
          </Stack>
        </Container>
      </Box>
    </>
  );
};


import NextLink from 'next/link';
 
import { Box, Container } from '@mui/material';
// import { Logo } from '../../components/logo';
import { Logo } from '@/components/logo';
import { TOP_NAV_HEIGHT } from '@/const';
import { useSettings } from '../../hooks/use-settings';
import { paths } from '../../paths';


type TopNavPropTypes = {
  onNavOpen: ()=>void
};

export const TopNav = (props:TopNavPropTypes) => {
  const { onNavOpen } = props;
  const settings = useSettings();
  
 
  return (
    <Box
      component="header"
      sx={{
        backgroundColor: 'background.paper',
        left: 0,
         right: 0,
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          height: TOP_NAV_HEIGHT,
          position: 'relative'
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr'
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              height: '100%'
            }}
          >
            <Box
              component={NextLink}
              href={paths.index}
              sx={{
                display: 'inline-flex',
                flexShrink: 0,
                height: 34,
                width: 34
              }}
            >
               <Logo color="primary" />
            </Box>
          </Box>
           
        </Box>
      </Container>
    </Box>
  );
};



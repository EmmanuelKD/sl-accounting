import { useTheme } from '@mui/material/styles';
// next
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const Providers = () => {
  const theme = useTheme();
  return (
    <ProgressBar height="3px" color={theme.palette.primary.main} options={{ showSpinner: false }} shallowRouting />
  );
};

export default Providers;
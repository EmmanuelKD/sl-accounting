// material-ui
import { Avatar } from '@mui/material';
  /**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
 
    return (
        /**
         * if you want to use image instead of svg uncomment following, and comment out <svg> element.
         *
         * <img src={logo} alt="Mantis" width="100" />
         *
         */
        <>
            <Avatar
                alt="Logo"
                src={'/logo.png'}
                sx={{ width: 56, height: 56 }}
            />
        </>
    );
};

export default Logo;

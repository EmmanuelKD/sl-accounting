"use client";
import { forwardRef, ReactElement } from 'react';

import { Card, CardContent, CardHeader, Divider, SxProps, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
// import Highlighter from './third-party/Highlighter';

// Header style
const headerSX = {
    p: 2.5,
    '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

export interface MainCardProps {
    border?: boolean;
    boxShadow?: boolean;
    contentSX?: SxProps<Theme>;
    darkTitle?: boolean;
    divider?: boolean;
    elevation?: number;
    secondary?: React.ReactNode;
    shadow?: string;
    sx?: SxProps<Theme>;
    title?: string | ReactElement;
    codeHighlight?: boolean;
    content?: boolean;
    children: React.ReactNode;
}

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
    ({
        border = true,
        boxShadow,
        children,
        content = true,
        contentSX = {},
        darkTitle = false,
        divider = true,
        elevation = 0,
        secondary,
        shadow,
        sx = {},
        title,
        codeHighlight = false,
        ...others
    }, ref) => {
        const theme = useTheme();
        const effectiveBoxShadow = theme.palette.mode === 'dark' ? boxShadow || true : boxShadow;

        return (
            <Card
                elevation={elevation}
                ref={ref}
                {...others}
                sx={{
                    border: border ? '1px solid' : 'none',
                    borderRadius: 2,
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey[300],
                    boxShadow: effectiveBoxShadow && (!border || theme.palette.mode === 'dark')
                        ? shadow || theme.shadows[1]
                        : 'inherit',
                    ':hover': {
                        boxShadow: effectiveBoxShadow ? shadow || theme.shadows[1] : 'inherit'
                    },
                    '& pre': {
                        m: 0,
                        p: '16px !important',
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.75rem'
                    },
                    ...sx
                }}
            >
                {title && (
                    <CardHeader
                        sx={headerSX}
                        title={
                            darkTitle ? (
                                <Typography variant="h3">{title}</Typography>
                            ) : (
                                title
                            )
                        }
                        titleTypographyProps={darkTitle ? undefined : { variant: 'subtitle1' }}
                        action={secondary}
                    />
                )}

                {title && divider && <Divider />}

                {content ? (
                    <CardContent sx={contentSX}>{children}</CardContent>
                ) : (
                    children
                )}

                {codeHighlight && (
                    <>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        {children}
                    </>
                )}
            </Card>
        );
    }
);
MainCard.displayName = 'MainCard';


export default MainCard;

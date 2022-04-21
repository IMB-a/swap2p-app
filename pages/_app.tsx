import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material';
import { MetaMaskProvider } from 'metamask-react'
import { SnackbarProvider } from 'notistack';
import theme from '@styles/theme';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <MetaMaskProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </MetaMaskProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

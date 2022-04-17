import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material';
import { MetaMaskProvider } from 'metamask-react'
import theme from '../styles/theme';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <MetaMaskProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </MetaMaskProvider>
    </ThemeProvider>
  )
}

import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			cacheTime: Infinity,
		},
	},
});
export default function App({ Component, pageProps }) {
	return (
		<QueryClientProvider client={queryClient}>
			<Component {...pageProps} />
		</QueryClientProvider>
	);
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import InteractionLibrary from "./pages/InteractionLibrary";
import InteractionViewer from "./pages/InteractionViewer";
import Layout from "./components/Layout";
import App from "./App";
import "./styles/index.css";
import InteractionProvider from "./provider/Interactions/InteractionProvider";
import SocketProvider from "./provider/Socket/SocketProvider";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Could not find the application root.");
}

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{ index: true, element: <App /> },
			{ path: "interaction-library", element: <InteractionLibrary /> },
			{ path: "interaction-viewer", element: <InteractionViewer /> },
		],
	},
]);

createRoot(rootElement).render(
	<StrictMode>
		<InteractionProvider>
			<SocketProvider>
				<RouterProvider router={router} />
			</SocketProvider>
		</InteractionProvider>
	</StrictMode>,
);

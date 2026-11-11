import { createContext } from "react";

export const InteractionContext = createContext({
	selectedInteractionId: "",
	setSelectedInteractionId: (id: string) => {},
});

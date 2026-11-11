import { useState } from "react";
import { InteractionContext } from "./InteractionContext";

const InteractionProvider = ({ children }: { children: React.ReactNode }) => {
	const [selectedInteractionId, setSelectedInteractionId] = useState("");

	return <InteractionContext.Provider value={{ selectedInteractionId, setSelectedInteractionId }}>{children}</InteractionContext.Provider>;
};

export default InteractionProvider;

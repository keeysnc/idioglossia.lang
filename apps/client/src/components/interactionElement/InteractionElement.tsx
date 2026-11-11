import "./interactionElement.css";
import { useContext } from "react";
import { InteractionContext } from "../../provider/Interactions/InteractionContext";

const InteractionElement = ({ title, description, id }: { title: string; description: string; id: string }) => {
	const { setSelectedInteractionId, selectedInteractionId } = useContext(InteractionContext);
	const isSelected = id === selectedInteractionId;

	const handleInteractionSelect = () => {
		setSelectedInteractionId(isSelected ? "" : id);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleInteractionSelect();
		}
	};

	return (
		<div
			className={`interactionElement${isSelected ? " interactionElement--selected" : ""}`}
			role="button"
			tabIndex={0}
			aria-pressed={isSelected}
			onClick={handleInteractionSelect}
			onKeyDown={handleKeyDown}
		>
			<section className="elementContent">
				<div className="elementHeader">
					<h1>{title}</h1>
					<span className={`selectionStatus${isSelected ? " selectionStatus--selected" : ""}`}>
						<span aria-hidden="true">{isSelected ? "✓" : "●"}</span> {isSelected ? "You selected" : "Not selected"}
					</span>
				</div>
				<p>{description}</p>
			</section>
		</div>
	);
};

export default InteractionElement;

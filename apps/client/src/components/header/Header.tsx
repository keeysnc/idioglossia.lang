import { ConnectionStatus } from "../ConnectionStatus";
export const HomeHeader = ({ connectionStatus }: { connectionStatus: string }) => (
	<header className="header">
		<a href="/" className="eyebrow homeLink">
			Idioglossia.lang
		</a>
		<ConnectionStatus status={connectionStatus} />
	</header>
);

export const InteractiveLibraryHeader = ({
	handleSubmit,
	submitDisabled,
	onShowViewerQr,
}: {
	handleSubmit: () => void;
	submitDisabled: boolean;
	onShowViewerQr: () => void;
}) => (
	<header className="interactionLibraryHeader">
		<a href="/" className="eyebrow homeLink">
			Idioglossia.lang
		</a>
		<button type="button" onClick={onShowViewerQr}>
			View the Interaction Visualization
		</button>
		<button className="submitButton" onClick={handleSubmit} disabled={submitDisabled}>
			Submit
		</button>
	</header>
);

export const ViewerHeader = ({ toggleSound, soundEnabled }: { toggleSound: () => void; soundEnabled: boolean }) => (
	<header className="interactionLibraryHeader">
		<button className="sound-toggle" type="button" onClick={toggleSound}>
			<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M2.5 6.25H5L8.5 3.5V12.5L5 9.75H2.5V6.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
				<path d="M11 5.5C11.6 6.1 12 6.9 12 8C12 9.1 11.6 9.9 11 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			</svg>
			Sound {soundEnabled ? "off" : "on"}
		</button>
	</header>
);

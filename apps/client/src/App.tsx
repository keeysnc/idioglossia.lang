import { HomeHeader } from "./components/header/Header";
import { useSocketConnection } from "./hooks/useSocketConnection";

export default function App() {
	const connectionStatus = useSocketConnection();

	return (
		<main className="cover">
			<HomeHeader connectionStatus={connectionStatus} />
			<section className="instruction-stage">
				<div className="instruction-logo">
					<svg width="285" height="52" viewBox="0 0 285 52" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M184.887 38.7055C184.887 44.8904 173.699 51.3235 167.717 51.3235C161.736 51.3235 156.887 46.3096 156.887 40.1247C156.887 33.9398 164.113 36.7104 170.095 36.7104C176.076 36.7104 184.887 32.5206 184.887 38.7055Z"
							fill="white"
						/>
						<rect y="34.7742" width="18" height="18" rx="2" transform="rotate(-24.0576 0 34.7742)" fill="white" />
						<rect x="49.6406" width="6" height="18" rx="2" transform="rotate(29.0864 49.6406 0)" fill="white" />
						<circle cx="84.8871" cy="39.3235" r="8" fill="white" />
						<rect x="115.887" y="16.4268" width="18" height="18" rx="2" transform="rotate(-31.8445 115.887 16.4268)" fill="white" />
						<path
							d="M228.925 31.3312L230.769 30.5579C231.533 30.2376 232.412 30.5973 232.733 31.3613L238.145 44.2726C238.466 45.0366 238.106 45.9156 237.342 46.2359L235.498 47.0092C234.734 47.3295 233.855 46.9698 233.534 46.2058L228.121 33.2945C227.801 32.5305 228.161 31.6515 228.925 31.3312Z"
							fill="white"
							stroke="white"
						/>
						<path d="M234.887 39.3235L271.887 13.3235" stroke="white" />
						<path
							d="M284.387 9.32349C284.387 14.0179 280.582 17.8235 275.887 17.8235C271.193 17.8235 267.387 14.0179 267.387 9.32349C267.387 4.62907 271.193 0.823486 275.887 0.823486C280.582 0.823486 284.387 4.62907 284.387 9.32349Z"
							fill="white"
							stroke="white"
						/>
					</svg>
				</div>
				<h1 id="cover-title">Welcome to Idioglossia.lang.</h1>
				<p>
					A digital space populated by a primitive visual language only a few will know. <br /> <br />
					Here’s how it works.
				</p>
				<ol className="instruction-list">
					<li>
						{" "}
						Visit the{" "}
						<a style={{ textDecoration: "underline" }} href="/interaction-library">
							interaction library
						</a>{" "}
						by clicking the link below.
					</li>
					<li>Select an interaction that you would like to express within the digital space.</li>
					<li>Click submit to see your interaction populate in real-time within the digital space.</li>
					<li>If your interaction is in close proximity to an interaction it conversely pairs with, it will connect and create an audio cue.</li>
					<li>After 5 minutes the digital space will clear and reset.</li>
				</ol>
				<div className="interaction-lib-link">
					<a style={{ textDecoration: "underline" }} href="/interaction-library">
						Go to Interaction Library <span aria-hidden="true">→</span>
					</a>
				</div>
			</section>
		</main>
	);
}

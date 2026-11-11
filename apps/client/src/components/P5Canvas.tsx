import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import type { CreativePingPayload, Interaction } from "@creative/shared";
import { ViewerHeader } from "./header/Header";

type P5CanvasProps = {
	interactionData: Interaction[];
	submittedInteractions: CreativePingPayload[];
};

type CanvasPoint = Interaction & Partial<Pick<CreativePingPayload, "userId" | "sentAt">>;

export default function P5Canvas({ interactionData, submittedInteractions }: P5CanvasProps) {
	const canvasRef = useRef<HTMLDivElement>(null);
	const addPointRef = useRef<((interaction: Interaction) => void) | null>(null);
	const submittedInteractionCountRef = useRef(0);
	const backgroundSoundRef = useRef<HTMLAudioElement | null>(null);
	const soundEnabledRef = useRef(false);
	const [soundEnabled, setSoundEnabled] = useState(false);

	const toggleSound = () => {
		if (soundEnabledRef.current) {
			backgroundSoundRef.current?.pause();
			soundEnabledRef.current = false;
			setSoundEnabled(false);
			return;
		}

		const sound = backgroundSoundRef.current;
		if (!sound) {
			console.error("Background sound is not ready");
			return;
		}

		sound.loop = true;
		void sound
			.play()
			.then(() => {
				soundEnabledRef.current = true;
				setSoundEnabled(true);
			})
			.catch((error) => {
				console.error("Unable to play background sound:", error);
			});
	};

	useEffect(() => {
		const canvasElement = canvasRef.current;
		if (!canvasElement) {
			return;
		}

		const backgroundSound = new Audio("/sounds/idioglossia-sounds.wav");
		backgroundSound.preload = "auto";
		backgroundSound.loop = true;
		backgroundSoundRef.current = backgroundSound;

		const sketch = (p: p5) => {
			const points: CanvasPoint[] = [];
			const seeds = 300;
			const canvasWidth = canvasElement.clientWidth;
			const canvasHeight = canvasElement.clientHeight;

			const addPoint = (interaction: CanvasPoint) => {
				const point = structuredClone(interaction);

				point.instanceId = Math.random() * 200;
				point.properties.x = p.random(canvasWidth);
				point.properties.y = p.random(canvasHeight);
				point.properties.noiseX = p.random(1000);
				point.properties.noiseY = p.random(1000);
				point.properties.speed = 1;
				points.push(point);
			};

			p.setup = () => {
				p.createCanvas(canvasWidth, canvasHeight);
				addPointRef.current = addPoint;

				for (let i = 0; i < seeds; i++) {
					addPoint(interactionData[Math.floor(Math.random() * interactionData.length)]);
				}
			};

			const disperseShapes = () => {
				points.forEach((point) => {
					const angle = p.noise(point.properties.noiseX, point.properties.noiseY) * p.TWO_PI * 4;
					point.properties.x += p.cos(angle) * point.properties.speed;
					point.properties.y += p.sin(angle) * point.properties.speed;
					point.properties.noiseX += 0.001;
					point.properties.noiseY += 0.001;

					if (point.properties.x <= 0 || point.properties.x >= p.width) {
						point.properties.x = p.constrain(point.properties.x, 0, p.width);
						point.properties.noiseX += 10;
					}

					if (point.properties.y <= 0 || point.properties.y >= p.height) {
						point.properties.y = p.constrain(point.properties.y, 0, p.height);
						point.properties.noiseY += 10;
					}
				});
			};

			const connections = () => {
				const connectedPoints = new Set<CanvasPoint>();

				points.forEach((point) => {
					point.properties.connectionIds?.forEach((connectionId) => {
						const target = points.find((p) => p.id === connectionId);
						if (target && Math.abs(target.properties.x - point.properties.x) <= 100 && Math.abs(target.properties.y - point.properties.y) <= 100) {
							connectedPoints.add(point);
							connectedPoints.add(target);
							if (point.userId) {
								p.stroke("#00CED1");
							} else {
								p.stroke("#EDB926");
							}
							p.line(point.properties.x, point.properties.y, target.properties.x, target.properties.y);
						}
					});
				});

				return connectedPoints;
			};

			const drawPoints = (connectedPoints: Set<Interaction>) => {
				p.noStroke();

				points.forEach((point) => {
					p.fill(connectedPoints.has(point) ? "#EDB926" : point.userId ? "#00CED1" : "white");
					p.circle(point.properties.x, point.properties.y, point.userId ? 5 : 1);
				});
			};

			p.draw = () => {
				p.background("#101113");
				disperseShapes();
				drawPoints(connections());
			};

			p.windowResized = () => {
				p.resizeCanvas(canvasElement.clientWidth, canvasElement.clientHeight);
			};
		};

		const sketchInstance = new p5(sketch, canvasElement);

		return () => {
			addPointRef.current = null;
			backgroundSoundRef.current = null;
			backgroundSound.pause();
			sketchInstance.remove();
		};
	}, [interactionData]);

	useEffect(() => {
		const newInteractions = submittedInteractions.slice(submittedInteractionCountRef.current);
		newInteractions.forEach((interaction) => addPointRef.current?.(interaction));
		submittedInteractionCountRef.current = submittedInteractions.length;
	}, [submittedInteractions]);

	return (
		<div className="interactionViewer">
			<ViewerHeader toggleSound={toggleSound} soundEnabled={soundEnabled} />
			<aside className="interactionLegend" aria-labelledby="interaction-legend-title">
				<h2 id="interaction-legend-title">Interactions</h2>
				<ul>
					<li>
						<span className="legendIndicator legendIndicator--wandering" aria-hidden="true" />
						white - wandering
					</li>
					<li>
						<span className="legendIndicator legendIndicator--user" aria-hidden="true" />
						blue - user interaction
					</li>
					<li>
						<span className="legendIndicator legendIndicator--connected" aria-hidden="true" />
						yellow - connected interaction
					</li>
				</ul>
			</aside>
			<div ref={canvasRef} className="interactionCanvas" />
		</div>
	);
}

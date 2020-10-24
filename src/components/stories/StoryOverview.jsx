import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import Container from "react-bootstrap/Container";

const createNodes = (activities, missions) => {
	const nodes = activities
		.map((_, key) => {
			return { id: `a_${key}`, label: `Attività ${key}` };
		})
		.concat(
			Object.keys(missions).map((val) => {
				return { id: `m_${val}`, label: `Missione ${val}` };
			})
		);
	return nodes;
};

const createEdges = (missions, transitions) => {
	let edges = [];
	Object.entries(missions).forEach(([key, value]) => {
		Object.entries(value).forEach(([k, v]) => {
			let newEdge = null;
			if (Array.isArray(v)) {
				v.forEach((act) => {
					if (act === "new_mission") {
						const misTr = transitions.indexOf(key);
						if (misTr + 1 < transitions.length) newEdge = { from: `a_${k}`, to: `m_${transitions[misTr + 1]}` };
					} else newEdge = { from: `a_${k}`, to: `a_${act}` };

					if (newEdge !== null && !edges.some((value) => value.from === newEdge.from && value.to === newEdge.to)) {
						edges.push(newEdge);
					}
				});
			} else {
				newEdge = { from: `m_${key}`, to: `a_${v}` };
				if (!edges.some((value) => value.from === newEdge.from && value.to === newEdge.to)) {
					edges.push(newEdge);
				}
			}
		});
	});
	return edges;
};

const StoryOverview = () => {
	const [story, setStory] = useState({ error: null, isLoaded: false, items: [] });
	const domNode = useRef(null);
	const network = useRef(null);
	const idStory = 1;

	useEffect(() => {
		fetch(`/story/${idStory}`)
			.then((res) => res.json())
			.then(
				(result) => {
					setStory({
						isLoaded: true,
						items: result,
					});
				},
				(error) => {
					setStory({
						isLoaded: true,
						error,
					});
				}
			);
	}, []);

	useEffect(() => {
		if (story.isLoaded) {
			const nodes = new DataSet(createNodes(story.items.activities, story.items.missions));
			const edges = new DataSet(createEdges(story.items.missions, story.items.transitions));
			const layout = {
				hierarchical: {
					enabled: true,
					direction: "UD",
					sortMethod: "directed",
					levelSeparation: 100,
					nodeSpacing: 200,
				},
			};
			const options = {
				autoResize: true,
				height: "1000px",
				width: "100%",
				edges: {
					arrows: "to",
				},
				layout: layout,
				interaction: {
					dragNodes: false,
				},
			};

			const data = {
				nodes,
				edges,
			};
			network.current = new Network(domNode.current, data, options);
		}
	}, [story]);

	return <Container>{story.isLoaded ? <div ref={domNode} /> : <h6>Loading...</h6>}</Container>;
};

export default StoryOverview;

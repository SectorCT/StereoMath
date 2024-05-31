import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, Dimensions, View } from 'react-native';
import { Quaternion, Vector3, Color, Camera, PerspectiveCamera, Box3 } from 'three';
import CameraController from './CameraController';
import { figureData } from '../../Types';
import Grid from './Grid';

function MainModel({ animateEdge, data, centerCameraAroundShape = true, showGrid = true, showVertices = true, enableCameraController = true, backgroundColor }:
	{
		animateEdge?: (edge: string) => void
		data: figureData
		centerCameraAroundShape?: boolean
		showGrid?: boolean,
		showVertices?: boolean,
		enableCameraController?: boolean
		backgroundColor?:string
	}) {
	const [selectedEdgeKey, setSelectedEdgeKey] = useState<string | null>(null);
	const [shapeCenter, setShapeCenter] = useState(new Vector3(0, 0, 0));
    const [boundingBox, setBoundingBox] = useState<Box3 | null>(null);

	function calculateShapeCenterAndBoundingBox() {
		const vertices = Object.values(data.vertices).map(vertex => new Vector3(...vertex));
        const box = new Box3().setFromPoints(vertices);

        setBoundingBox(box);
		console.log("bounding box", box)

		const center = box.getCenter(new Vector3());
		setShapeCenter(center);
	}

	useEffect(() => {
		calculateShapeCenterAndBoundingBox();
	}, [data]);

	const cameraRef = useRef<Camera>();
	const updateCameraRef = (newCamera: Camera) => {
		cameraRef.current = newCamera;
	};

	const [cameraPosition, setCameraPosition] = useState<Vector3>(new Vector3(1, 1, 1));
	const [cameraRotation, setCameraRotation] = useState<Vector3>(new Vector3(0, 0, 0));

	function updateCameraPosition(cameraPosition: Vector3, cameraRotation: Vector3) {
		setCameraPosition(cameraPosition);
		setCameraRotation(cameraRotation);
	}

	return (
		<View style={{ width: "100%", height: "100%", backgroundColor: "black" }}>
			{showVertices && <VerteciesText data={data} cameraRef={cameraRef} cameraPosition={cameraPosition} cameraRotation={cameraRotation} shapeCenter={shapeCenter} />}
			<CameraController
				shapeCenter={shapeCenter}
                boundingBox={boundingBox}
				centerCameraAroundShape={centerCameraAroundShape}
				updateCameraRef={updateCameraRef}
				updateCameraPosition={updateCameraPosition}
				enabled={enableCameraController}
			>
				{showGrid && <Grid />}
				<SceneContent
					data={data}
					selectedEdgeKey={selectedEdgeKey}
					setSelectedEdgeKey={setSelectedEdgeKey}
					animateEdge={animateEdge} />
			</CameraController>
		</View>
	);
}

function VerteciesText({ data, cameraRef, cameraPosition, cameraRotation, shapeCenter }: { data: figureData, cameraRef: React.MutableRefObject<Camera | undefined>, cameraPosition: Vector3, cameraRotation: Vector3, shapeCenter: Vector3 }) {
	return (
		<>
			{(Object.keys(data.vertices) as Array<keyof typeof data.vertices>).map((vertexName) => {
				const vertexPosition = new Vector3(...data.vertices[vertexName]);

				if (!cameraRef.current) return null;
				const currentCamera = cameraRef.current as PerspectiveCamera;
				const tempCamera = new PerspectiveCamera(
					currentCamera.fov,
					currentCamera.aspect,
					currentCamera.near,
					currentCamera.far
				);
				tempCamera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
				tempCamera.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z);

				tempCamera.updateMatrixWorld();
				tempCamera.updateProjectionMatrix();

				const vertexPositionNDC = vertexPosition.project(tempCamera);
				const shapeCenterNDC = shapeCenter.clone().project(tempCamera);

				const textPosition = {
					x: Math.round((vertexPositionNDC.x + 1) * Dimensions.get('window').width / 2),
					y: Math.round((-vertexPositionNDC.y + 1) * Dimensions.get('window').height / 2),
				};

				let xOffsetBool = vertexPositionNDC.x < shapeCenterNDC.x;
				xOffsetBool = Math.abs(vertexPositionNDC.x - shapeCenterNDC.x) > 0.05 ? xOffsetBool : false;
				let xOffset = xOffsetBool ? -30 : 10;

				let yOffset = vertexPositionNDC.y < shapeCenterNDC.y ? 10 : -30;
				yOffset = Math.abs(vertexPositionNDC.y - shapeCenterNDC.y) > 0.05 ? yOffset : 10;

				return (
					<Text key={vertexName} style={[styles.text, { left: textPosition.x + xOffset, top: textPosition.y + yOffset }]}>
						{vertexName}
					</Text>
				);
			})}
		</>
	);
};

function SceneContent({ selectedEdgeKey, setSelectedEdgeKey, animateEdge, data }:
	{
		data: figureData,
		selectedEdgeKey: string | null,
		setSelectedEdgeKey: (key: string | null) => void,
		animateEdge?: (edge: string) => void
	}) {
	return (
		<>
			<ambientLight />
			<pointLight position={[10, 10, 10]} intensity={2} />

			{data.vertices && (Object.keys(data.vertices) as Array<keyof typeof data.vertices>).map((vertexName, index) => {
				let vertex = data.vertices[vertexName];
				return <mesh key={vertexName}>{drawVertex(new Vector3(vertex[0], vertex[1], vertex[2]))}</mesh>;
			})}

			{data.edges && data.edges.map((edge, index) => {
				let vertex1 = data.vertices[edge[0] as keyof typeof data.vertices];
				let vertex2 = data.vertices[edge[1] as keyof typeof data.vertices];

				if (vertex1 && vertex2) {
					return connectVertices(
						new Vector3(vertex1[0], vertex1[1], vertex1[2]),
						new Vector3(vertex2[0], vertex2[1], vertex2[2]),
						edge[0] + edge[1] + index.toString(),
						edge[0] + edge[1] + index.toString() + "HIT",
						edge[0] + edge[1],
						selectedEdgeKey,
						setSelectedEdgeKey,
						animateEdge
					);
				}
			})}
		</>
	);
}


function calculate3DDistance(vertex1: Vector3, vertex2: Vector3): number {
	let xDistance = vertex2.x - vertex1.x;
	let yDistance = vertex2.y - vertex1.y;
	let zDistance = vertex2.z - vertex1.z;

	return Math.sqrt(xDistance * xDistance + yDistance * yDistance + zDistance * zDistance);
}

function connectVertices(vertex1: Vector3, vertex2: Vector3, key: string, key2: string, nameOfEdge: string, selectedEdgeKey: string | null, setSelectedEdgeKey: (key: string | null) => void, animateEdge?: (edge: string) => void) {
	let distance = calculate3DDistance(vertex1, vertex2);

	let midX = (vertex1.x + vertex2.x) / 2;
	let midY = (vertex1.y + vertex2.y) / 2;
	let midZ = (vertex1.z + vertex2.z) / 2;

	let direction = new Vector3(vertex2.x - vertex1.x, vertex2.y - vertex1.y, vertex2.z - vertex1.z);
	direction.normalize();

	let quaternion = new Quaternion();
	quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction);

	const [colorEdge, setColorEdge] = useState("black");

	const transparentColor = new Color("green");
	transparentColor.lerp(new Color("red"), 0.3);

	const selectedColor = new Color("blue");

	return (
		<>
			<mesh position={[midX, midY, midZ]} quaternion={quaternion} key={key}>
				<cylinderGeometry args={[0.05, 0.05, distance, 32]} />
				<meshStandardMaterial color={key == selectedEdgeKey ? selectedColor : colorEdge} />
			</mesh>
			<mesh position={[midX, midY, midZ]} quaternion={quaternion} key={key2} onClick={() => { setSelectedEdgeKey(key); animateEdge?.(nameOfEdge) }}>
				<cylinderGeometry args={[0.15, 0.15, distance, 32]} />
				<meshStandardMaterial opacity={0} transparent={true} />
			</mesh>
		</>
	);
}

function drawVertex(vertex: Vector3) {
	return (
		<>
			<mesh position={[vertex.x, vertex.y, vertex.z]}>
				<sphereGeometry args={[0.1, 16, 16]} />
				<meshStandardMaterial color="black" />
			</mesh>
		</>
	);
}

const styles = StyleSheet.create({
	text: {
		color: 'bbbbbb',
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 1,
		width: "auto",
		height: "auto",
		margin: 0,
		padding: 0,
		lineHeight: 30,
		backgroundColor: 'transparent',
		fontSize: 30
	}
});


export default MainModel;
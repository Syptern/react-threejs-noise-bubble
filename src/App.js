import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useUpdate } from "react-three-fiber";
import "./styles.css";
import * as THREE from "three";
import SimplexNoise from "simplex-noise";
import { Draggable } from "./Draggable";

var simplex = new SimplexNoise();

function Ball(props) {
  const [time, setTime] = useState(0);
  const [firstVertices, setFirstVertices] = useState([]);
  const buffer = useRef();

  useEffect(() => {
    setFirstVertices(buffer.current.vertices);
    console.log("lol");
  }, []);

  const mesh = useUpdate(({ geometry }) => {
    firstVertices.forEach((e, i) => {
      let spherical = new THREE.Spherical();

      spherical.setFromVector3(e);

      spherical.radius =
        10 +
        simplex.noise4D(
          e.x / 25,
          e.y / 25,
          e.z / 50,
          time / 1.4 + simplex.noise2D(1, time / 50)
        ) *
          4;
      geometry.vertices[i].setFromSpherical(spherical);
    });

    geometry.verticesNeedUpdate = true;
  });

  useFrame(() => setTime(time + 0.01)); // geometry.verticesNeedUpdate = true;)

  return (
    <mesh {...props} ref={mesh}>
      <sphereGeometry ref={buffer} attach="geometry" args={[10, 40, 40]} />
      <meshPhongMaterial attach="material" />
    </mesh>
  );
}

export default function App() {
  let [rotate, setRotate] = useState({ x: 0, y: 0 });
  const renderer = useRef();

  let dragging = (e) => {
    setRotate(e);
  };

  return (
    <div className="App">
      <Draggable onMove={dragging} onMoveEnd={() => {}}>
        <Canvas renderer={renderer} camera={{ position: [0, 0, 30] }}>
          <Suspense fallback={<div />}>
            <fog attach="fog" args={["black", 0, 40]} />

            <ambientLight intensity={0.4} />
            <pointLight position={[50, 70, 70]} intensity={1} />
            <Ball rotation={[0, rotate.x / 100, 0]} position={[0, 0, 0]} />
          </Suspense>
        </Canvas>
      </Draggable>
    </div>
  );
}

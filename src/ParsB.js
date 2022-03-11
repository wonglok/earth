import { useRef, useEffect, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Object3D,
  Points,
  ShaderMaterial,
  Vector3,
  DoubleSide,
  Color,
  InstancedBufferAttribute,
  CircleBufferGeometry,
  InstancedBufferGeometry,
  Mesh,
  PlaneBufferGeometry,
  SphereBufferGeometry,
  IcosahedronBufferGeometry,
} from "three";
import { getCurlNoise } from "./curlNosie";
import { useFrame } from "@react-three/fiber";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

// import { BlurPass, Resizer, KernelSize } from "postprocessing";

export function ParsB() {
  //
  let pointRef = useRef();
  let [prim, setPrim] = useState(null);

  let works = useRef({});
  useFrame((st, dt) => {
    Object.values(works.current).forEach((e) => e(st, dt));
  });
  useEffect(() => {
    let run = async () => {
      let o3d = new Object3D();

      const layerData = [];
      const orbitAngle = [];
      const posArr = [];
      const normalArr = [];

      const rand4 = [];
      const colorData = [];
      const sizeData = [];
      let variations = [
        { size: 0.333 * 1.0, color: new Color("#ffffff") },
        { size: 0.333 * 1.5, color: new Color("#ffffff") },
        { size: 0.333 * 2.0, color: new Color("#ffffff") },
        {
          size: 0.333 * 2.0,
          color: new Color("#ff00ff").add(new Color("#005555")),
        },
        {
          size: 0.333 * 4.0,
          color: new Color("#ff00ff").add(new Color("#005555")),
        },
        {
          size: 0.333 * 2.0,
          color: new Color("#ff00ff").sub(new Color("#005555")),
        },
        {
          size: 0.333 * 4.0,
          color: new Color("#00ffff").add(new Color("#0000ff")),
        },
        {
          size: 0.333 * 5.0,
          color: new Color("#00ffff").add(new Color("#0000ff")),
        },
      ];

      let radius = 15;

      let ptCounter = 0;

      let rv = () => Math.random() * 2.0 - 1.0;

      let sampler = new MeshSurfaceSampler(
        new Mesh(new SphereBufferGeometry(radius, 32, 32))
      );
      sampler.build();

      const _position = new Vector3();
      const _normal = new Vector3();
      const _color = new Color();

      // Sample randomly from the surface, creating an instance of the sample
      // geometry at each sample point.
      for (let i = 0; i < 1024; i++) {
        sampler.sample(_position, _normal, _color);

        posArr.push(_position.x, _position.y, _position.z);
        normalArr.push(_normal.x, _normal.y, _normal.z);

        rand4.push(rv(), rv(), rv(), rv());

        let variation =
          variations[Math.floor(variations.length * Math.random())];
        colorData.push(variation.color.r, variation.color.g, variation.color.b);

        sizeData.push(variation.size);

        ptCounter++;
      }

      let geo = new InstancedBufferGeometry();
      geo.copy(new IcosahedronBufferGeometry(0.1, 1));

      geo.setAttribute(
        "dotSize",
        new InstancedBufferAttribute(new Float32Array(sizeData), 1)
      );

      geo.setAttribute(
        "color",
        new InstancedBufferAttribute(new Float32Array(colorData), 3)
      );

      geo.setAttribute(
        "posArr",
        new InstancedBufferAttribute(new Float32Array(posArr), 4)
      );
      geo.setAttribute(
        "normalArr",
        new InstancedBufferAttribute(new Float32Array(normalArr), 4)
      );

      geo.setAttribute(
        "rand4",
        new InstancedBufferAttribute(new Float32Array(rand4), 4)
      );

      geo.instanceCount = ptCounter;

      //
      let uniforms = {
        time: { value: 0 },
      };

      //
      works.current.time = (st, dt) => {
        let t = st.clock.getElapsedTime();
        uniforms.time.value = t;
      };

      //
      let shader = new ShaderMaterial({
        uniforms,
        vertexShader: /* glsl */ `
          #include <common>

          ${getCurlNoise()}

          mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
            vec3 rr = vec3(sin(roll), cos(roll), 0.0);
            vec3 ww = normalize(target - origin);
            vec3 uu = normalize(cross(ww, rr));
            vec3 vv = normalize(cross(uu, ww));

            return mat3(uu, vv, ww);
          }

        attribute vec3 posArr;
        attribute vec3 normalArr;
        attribute vec3 color;
        attribute vec4 rand4;
        attribute float dotSize;

        uniform float time;
        varying float vProgress;
        varying vec4 vRand4;
        varying vec3 vColor;

        void main (void) {
          float PIE = 3.14159265;
          vRand4 = rand4;
          vColor = color;
          vProgress = sin(time + rand4.x) * sin(time + rand4.y);// * cos(time + orbitAngle.x * PIE * 2.0);

          //
          vec4 vert = vec4(
            posArr * 1.2 + position * dotSize
            + normalArr * curlNoise(normalArr + time * 0.02)
            + normalArr * snoiseVec3(normalArr + time * 0.01)
          , 1.0);

          // gl_PointSize= 1.0 * ;
          gl_Position = projectionMatrix * modelViewMatrix * vert;
        }
        `,
        fragmentShader: /* glsl */ `
          varying float vProgress;
          varying vec4 vRand4;
          varying vec3 vColor;
          uniform float time;

          void main (void) {
            gl_FragColor = vec4(vColor, mod(vProgress * sin(vRand4.x + time), 1.0));
          }
        `,
        transparent: true,
        side: DoubleSide,
      });

      let points = new Mesh(geo, shader);
      points.userData.enableBloom = true;
      points.frustumCulled = false;
      o3d.add(points);

      setPrim(<primitive ref={pointRef} object={o3d} />);
    };
    run();
  }, []);

  return <group>{prim}</group>;
}

import ObjectManager from "../../core/ObjectManager"
import Model from "../../Model"
import SvgMesh from "../../SvgMesh"
import Sprite from "../../Sprite"
import Circle from "../../primitives/Circle"
import Cone from "../../primitives/Cone"
import Cube from "../../primitives/Cube"
import Cylinder from "../../primitives/Cylinder"
import Octahedron from "../../primitives/Octahedron"
import Plane from "../../primitives/Plane"
import Sphere from "../../primitives/Sphere"
import Tetrahedron from "../../primitives/Tetrahedron"
import Torus from "../../primitives/Torus"
import Camera from "../../cameras/Camera"
import AmbientLight from "../../lights/AmbientLight"
import AreaLight from "../../lights/AreaLight"
import DirectionalLight from "../../lights/DirectionalLight"
import SkyLight from "../../lights/SkyLight"
import PointLight from "../../lights/PointLight"
import SpotLight from "../../lights/SpotLight"
import Group from "../../Group"
import { GameObjectType } from "./types"
import { type } from "@lincode/utils"
import ThirdPersonCamera from "../../cameras/ThirdPersonCamera"
import FirstPersonCamera from "../../cameras/FirstPersonCamera"
import OrbitCamera from "../../cameras/OrbitCamera"
import Skybox from "../../Skybox"

const record = type<Record<GameObjectType, () => ObjectManager>>({
    "group": () => new Group(),
    "model": () => new Model(),
    "svgMesh": () => new SvgMesh(),
    "sprite": () => new Sprite(),
    "camera": () => new Camera(),
    "thirdPersonCamera": () => new ThirdPersonCamera(),
    "firstPersonCamera": () => new FirstPersonCamera(),
    "orbitCamera": () => new OrbitCamera() as any,
    "ambientLight": () => new AmbientLight(),
    "areaLight": () => new AreaLight(),
    "directionalLight": () => new DirectionalLight(),
    "skyLight": () => new SkyLight(),
    "pointLight": () => new PointLight(),
    "spotLight": () => new SpotLight(),
    "circle": () => new Circle(),
    "cone": () => new Cone(),
    "cube": () => new Cube(),
    "cylinder": () => new Cylinder(),
    "octahedron": () => new Octahedron(),
    "plane": () => new Plane(),
    "sphere": () => new Sphere(),
    "tetrahedron": () => new Tetrahedron(),
    "torus": () => new Torus(),
    "skybox": () => new Skybox() as any
})

export default (type: GameObjectType) => record[type]()
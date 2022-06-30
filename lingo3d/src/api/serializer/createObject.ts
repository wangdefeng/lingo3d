import ObjectManager from "../../display/core/ObjectManager"
import Model from "../../display/Model"
import Dummy from "../../display/Dummy"
import Building from "../../display/Building"
import SvgMesh from "../../display/SvgMesh"
import Reflector from "../../display/Reflector"
import Sprite from "../../display/Sprite"
import Circle from "../../display/primitives/Circle"
import Cone from "../../display/primitives/Cone"
import Cube from "../../display/primitives/Cube"
import Cylinder from "../../display/primitives/Cylinder"
import Octahedron from "../../display/primitives/Octahedron"
import Plane from "../../display/primitives/Plane"
import Sphere from "../../display/primitives/Sphere"
import Tetrahedron from "../../display/primitives/Tetrahedron"
import Torus from "../../display/primitives/Torus"
import Camera from "../../display/cameras/Camera"
import AmbientLight from "../../display/lights/AmbientLight"
import AreaLight from "../../display/lights/AreaLight"
import DirectionalLight from "../../display/lights/DirectionalLight"
import SkyLight from "../../display/lights/SkyLight"
import PointLight from "../../display/lights/PointLight"
import SpotLight from "../../display/lights/SpotLight"
import Group from "../../display/Group"
import { GameObjectType } from "./types"
import { type } from "@lincode/utils"
import ThirdPersonCamera from "../../display/cameras/ThirdPersonCamera"
import FirstPersonCamera from "../../display/cameras/FirstPersonCamera"
import OrbitCamera from "../../display/cameras/OrbitCamera"
import Skybox from "../../display/Skybox"
import Environment from "../../display/Environment"
import Trigger from "../../display/Trigger"
import Audio from "../../display/Audio"

const record = type<Record<GameObjectType, () => ObjectManager>>({
    "group": () => new Group(),
    "model": () => new Model(),
    "svgMesh": () => new SvgMesh(),
    "dummy": () => new Dummy(),
    "building": () => new Building(),
    "reflector": () => new Reflector(),
    "sprite": () => new Sprite(),
    "trigger": () => new Trigger() as any,
    "audio": () => new Audio() as any,
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
    "skybox": () => new Skybox() as any,
    "environment": () => new Environment() as any
})

export default (type: GameObjectType) => record[type]()
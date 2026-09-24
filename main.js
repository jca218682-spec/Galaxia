import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 18;
camera.position.y = 6;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const starGeometry = new THREE.BufferGeometry();
const starCount = 3000;

const starVertices = [];

for (let i = 0; i < starCount; i++) {
    starVertices.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
    );
}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

function createRing(radius, color) {

    const geometry = new THREE.BufferGeometry();

    const particles = 5000;
    const positions = [];

    for (let i = 0; i < particles; i++) {

        const angle = Math.random() * Math.PI * 2;

        const r = radius + (Math.random() - 0.5) * 0.8;

        positions.push(
            Math.cos(angle) * r,
            (Math.random() - 0.5) * 0.2,
            Math.sin(angle) * r
        );
    }

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color,
        size: 0.08
    });

    return new THREE.Points(geometry, material);
}

const ring1 = createRing(3, 0xff33ff);
const ring2 = createRing(6, 0x66ccff);
const ring3 = createRing(9, 0xffffff);

scene.add(ring1);
scene.add(ring2);
scene.add(ring3);

const heartCanvas = document.createElement("canvas");
heartCanvas.width = 512;
heartCanvas.height = 512;

const ctx = heartCanvas.getContext("2d");

ctx.fillStyle = "#ff55dd";

ctx.beginPath();
ctx.moveTo(256, 350);
ctx.bezierCurveTo(100, 220, 140, 60, 256, 140);
ctx.bezierCurveTo(372, 60, 412, 220, 256, 350);
ctx.fill();

const heartTexture = new THREE.CanvasTexture(heartCanvas);

const heartMaterial = new THREE.SpriteMaterial({
    map: heartTexture
});

const heart = new THREE.Sprite(heartMaterial);

heart.scale.set(6, 6, 1);

scene.add(heart);

const glowLight = new THREE.PointLight(0xff00ff, 50, 100);

glowLight.position.set(0, 0, 0);

scene.add(glowLight);

function animate() {

    requestAnimationFrame(animate);

    ring1.rotation.y += 0.004;
    ring2.rotation.y -= 0.002;
    ring3.rotation.y += 0.001;

    heart.material.rotation += 0.002;

    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

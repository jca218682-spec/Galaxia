import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';


// ===============================
// ESCENA
// ===============================

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

camera.position.set(0, 7, 20);
camera.lookAt(0, 0, 0);


// ===============================
// RENDER
// ===============================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setClearColor(0x050014, 1);

document.body.appendChild(renderer.domElement);


// ===============================
// ESTRELLAS
// ===============================

const starGeometry = new THREE.BufferGeometry();

const starCount = 2500;
const starPositions = [];

for (let i = 0; i < starCount; i++) {

    const radius = 30 + Math.random() * 70;

    const theta = Math.random() * Math.PI * 2;

    const x = Math.cos(theta) * radius;
    const y = (Math.random() - 0.5) * 50;
    const z = Math.sin(theta) * radius;

    starPositions.push(x, y, z);
}

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.09,
    transparent: true,
    opacity: 0.85
});

const stars = new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(stars);


// ===============================
// GALAXIA ESPIRAL
// ===============================

const galaxyGroup = new THREE.Group();

scene.add(galaxyGroup);

const galaxyGeometry = new THREE.BufferGeometry();

const galaxyPositions = [];
const galaxyColors = [];

const galaxyCount = 5000;

const colorPurple = new THREE.Color(0xff00ff);
const colorBlue = new THREE.Color(0x008cff);

for (let i = 0; i < galaxyCount; i++) {

    // Radio de la galaxia
    const radius = Math.random() * 8;

    // MUCHAS vueltas para formar espiral
    const angle =
        radius * 1.8 +
        Math.random() * 0.6;

    // Espesor de la galaxia
    const spread = (Math.random() - 0.5) * 0.45;

    const x =
        Math.cos(angle) * radius +
        spread;

    const z =
        Math.sin(angle) * radius +
        spread;

    // Galaxia ligeramente plana
    const y =
        (Math.random() - 0.5) *
        (0.25 + radius * 0.035);

    galaxyPositions.push(x, y, z);

    // Mezcla morado / azul
    const color =
        i % 2 === 0
            ? colorPurple
            : colorBlue;

    galaxyColors.push(
        color.r,
        color.g,
        color.b
    );
}

galaxyGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
        galaxyPositions,
        3
    )
);

galaxyGeometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(
        galaxyColors,
        3
    )
);

const galaxyMaterial = new THREE.PointsMaterial({

    size: 0.065,

    vertexColors: true,

    transparent: true,

    opacity: 0.85,

    blending: THREE.AdditiveBlending
});

const galaxy = new THREE.Points(
    galaxyGeometry,
    galaxyMaterial
);

galaxyGroup.add(galaxy);


// ===============================
// CORAZÓN TRANSPARENTE
// ===============================

const heartShape = new THREE.Shape();

heartShape.moveTo(0, -1.2);

heartShape.bezierCurveTo(
    -2.0, -2.8,
    -4.0, 0.2,
    -2.0, 1.5
);

heartShape.bezierCurveTo(
    -1.0, 2.8,
    0, 2.0,
    0, 1.2
);

heartShape.bezierCurveTo(
    0, 2.0,
    1.0, 2.8,
    2.0, 1.5
);

heartShape.bezierCurveTo(
    4.0, 0.2,
    2.0, -2.8,
    0, -1.2
);

const heartGeometry =
    new THREE.ShapeGeometry(
        heartShape
    );

const heartMaterial =
    new THREE.MeshBasicMaterial({

        color: 0xff4cff,

        transparent: true,

        opacity: 0.20,

        side: THREE.DoubleSide,

        blending:
            THREE.AdditiveBlending
    });

const heart =
    new THREE.Mesh(
        heartGeometry,
        heartMaterial
    );


// CORAZÓN ARRIBA
heart.position.set(
    0,
    2.4,
    0
);

heart.scale.set(
    0.75,
    0.75,
    0.75
);

heart.rotation.x =
    THREE.MathUtils.degToRad(-10);

scene.add(heart);


// ===============================
// BORDE DEL CORAZÓN
// ===============================

const heartEdges =
    new THREE.EdgesGeometry(
        heartGeometry
    );

const heartLine =
    new THREE.LineSegments(
        heartEdges,
        new THREE.LineBasicMaterial({

            color: 0xff66ff,

            transparent: true,

            opacity: 0.8,

            blending:
                THREE.AdditiveBlending
        })
    );

heartLine.position.copy(
    heart.position
);

heartLine.scale.copy(
    heart.scale
);

heartLine.rotation.copy(
    heart.rotation
);

scene.add(heartLine);


// ===============================
// TEXTO 3D
// ===============================

function crearTexto(
    texto,
    posicion,
    rotacion,
    escala = 1
) {

    const canvas =
        document.createElement('canvas');

    canvas.width = 1024;
    canvas.height = 256;

    const ctx =
        canvas.getContext('2d');

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.font =
        'bold 95px Arial';

    ctx.fillStyle =
        '#ffffff';

    ctx.shadowColor =
        '#00aaff';

    ctx.shadowBlur = 25;

    ctx.textAlign =
        'center';

    ctx.textBaseline =
        'middle';

    ctx.fillText(
        texto,
        canvas.width / 2,
        canvas.height / 2
    );

    const texture =
        new THREE.CanvasTexture(canvas);

    texture.needsUpdate = true;

    const material =
        new THREE.SpriteMaterial({

            map: texture,

            transparent: true,

            blending:
                THREE.AdditiveBlending
        });

    const sprite =
        new THREE.Sprite(material);

    sprite.position.set(
        posicion.x,
        posicion.y,
        posicion.z
    );

    sprite.rotation.z =
        rotacion;

    sprite.scale.set(
        5 * escala,
        1.25 * escala,
        1
    );

    scene.add(sprite);

    return sprite;
}


// ===============================
// TE ADORO
// ===============================

const teAdoro =
    crearTexto(
        'TE ADORO ♥️',
        {
            x: -7,
            y: 2.2,
            z: 0
        },
        THREE.MathUtils.degToRad(15),
        0.9
    );


// ===============================
// TE AMO
// ===============================

const teAmo =
    crearTexto(
        'TE AMO ♥️',
        {
            x: 7,
            y: 2.2,
            z: 0
        },
        THREE.MathUtils.degToRad(-15),
        0.9
    );


// ===============================
// ANIMACIÓN
// ===============================

function animate() {

    requestAnimationFrame(
        animate
    );

    // Galaxia gira lentamente
    galaxyGroup.rotation.y += 0.0018;

    // Estrellas movimiento suave
    stars.rotation.y += 0.00025;

    // Corazón flotando
    const tiempo =
        performance.now() * 0.001;

    heart.position.y =
        2.4 +
        Math.sin(tiempo * 1.5) * 0.12;

    heartLine.position.y =
        heart.position.y;

    // Pulso del corazón
    const pulso =
        0.75 +
        Math.sin(tiempo * 2) * 0.04;

    heart.scale.set(
        pulso,
        pulso,
        pulso
    );

    heartLine.scale.set(
        pulso,
        pulso,
        pulso
    );

    renderer.render(
        scene,
        camera
    );
}

animate();


// ===============================
// RESPONSIVE
// ===============================

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);

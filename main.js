import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';


// =====================================================
// ESCENA
// =====================================================

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);

camera.position.set(0, 6, 18);
camera.lookAt(0, 0, 0);


const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setClearColor(0x03000f, 1);

document.body.appendChild(renderer.domElement);


// =====================================================
// ESTRELLAS
// =====================================================

const starGeometry = new THREE.BufferGeometry();

const starPositions = [];

for (let i = 0; i < 3000; i++) {

    const x = (Math.random() - 0.5) * 70;
    const y = (Math.random() - 0.5) * 45;
    const z = (Math.random() - 0.5) * 70;

    starPositions.push(x, y, z);
}

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
        starPositions,
        3
    )
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.055,
    transparent: true,
    opacity: 0.8
});

const stars = new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(stars);


// =====================================================
// GALAXIA ESPIRAL AZUL + MORADA
// =====================================================

const galaxyGroup = new THREE.Group();

scene.add(galaxyGroup);

const galaxyGeometry =
    new THREE.BufferGeometry();

const galaxyPositions = [];
const galaxyColors = [];

const blue = new THREE.Color(0x00aaff);
const cyan = new THREE.Color(0x18d8ff);
const purple = new THREE.Color(0xc800ff);
const pink = new THREE.Color(0xff3cff);

const particles = 7500;


// ---------- ESPIRAL ----------

for (let i = 0; i < particles; i++) {

    const radius =
        Math.pow(Math.random(), 0.65) * 8.5;

    const arms = 2;

    const arm =
        (i % arms) *
        Math.PI;

    const angle =
        radius * 1.45 +
        arm +
        (Math.random() - 0.5) * 0.55;

    const thickness =
        (Math.random() - 0.5) *
        (0.25 + radius * 0.035);

    const x =
        Math.cos(angle) * radius +
        thickness;

    const z =
        Math.sin(angle) * radius +
        thickness;

    const y =
        -1.5 +
        (Math.random() - 0.5) *
        (0.25 + radius * 0.04);

    galaxyPositions.push(
        x,
        y,
        z
    );


    // ---------- COLOR ----------

    const porcentaje =
        radius / 8.5;

    let color;

    if (porcentaje < 0.25) {

        color =
            Math.random() < 0.5
                ? pink
                : purple;

    } else {

        color =
            Math.random() < 0.55
                ? blue
                : cyan;
    }

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


const galaxyMaterial =
    new THREE.PointsMaterial({

        size: 0.055,

        vertexColors: true,

        transparent: true,

        opacity: 0.95,

        blending:
            THREE.AdditiveBlending
    });


const galaxy =
    new THREE.Points(
        galaxyGeometry,
        galaxyMaterial
    );

galaxyGroup.add(galaxy);


// =====================================================
// CORAZÓN REAL DE PARTÍCULAS
// =====================================================

const heartGeometry =
    new THREE.BufferGeometry();

const heartPositions = [];

const heartColors = [];

const heartParticles = 1800;


// Fórmula matemática de corazón
function heartX(t) {

    return 16 *
        Math.pow(Math.sin(t), 3);
}

function heartY(t) {

    return (
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
    );
}


for (let i = 0; i < heartParticles; i++) {

    const t =
        Math.random() *
        Math.PI * 2;

    // Distribución interna
    const interior =
        Math.sqrt(Math.random());

    let x =
        heartX(t) *
        interior;

    let y =
        heartY(t) *
        interior;

    // Escala
    x *= 0.20;
    y *= 0.20;

    // pequeña variación
    x += (Math.random() - 0.5) * 0.035;
    y += (Math.random() - 0.5) * 0.035;

    heartPositions.push(
        x,
        y,
        0
    );


    heartColors.push(
        1,
        0.15 + Math.random() * 0.3,
        1
    );
}

heartGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
        heartPositions,
        3
    )
);

heartGeometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(
        heartColors,
        3
    )
);


const heartMaterial =
    new THREE.PointsMaterial({

        size: 0.045,

        vertexColors: true,

        transparent: true,

        opacity: 0.48,

        blending:
            THREE.AdditiveBlending
    });


const heart =
    new THREE.Points(
        heartGeometry,
        heartMaterial
    );


// CORAZÓN ARRIBA DE LA GALAXIA
heart.position.set(
    0,
    2.2,
    0
);

heart.scale.set(
    1.35,
    1.35,
    1.35
);

scene.add(heart);


// =====================================================
// RESPLANDOR DEL CORAZÓN
// =====================================================

const heartGlowGeometry =
    new THREE.BufferGeometry();

const glowPositions = [];

for (let i = 0; i < 500; i++) {

    const t =
        Math.random() *
        Math.PI * 2;

    const scale =
        0.95 +
        Math.random() * 0.35;

    const x =
        heartX(t) *
        0.20 *
        scale;

    const y =
        heartY(t) *
        0.20 *
        scale;

    glowPositions.push(
        x,
        y,
        -0.05
    );
}

heartGlowGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
        glowPositions,
        3
    )
);

const glowMaterial =
    new THREE.PointsMaterial({

        color: 0xff55ff,

        size: 0.025,

        transparent: true,

        opacity: 0.25,

        blending:
            THREE.AdditiveBlending
    });

const heartGlow =
    new THREE.Points(
        heartGlowGeometry,
        glowMaterial
    );

heartGlow.position.copy(
    heart.position
);

heartGlow.scale.copy(
    heart.scale
);

scene.add(heartGlow);


// =====================================================
// TEXTOS TE ADORO / TE AMO
// =====================================================

function crearTexto(texto) {

    const canvas =
        document.createElement('canvas');

    canvas.width = 1000;
    canvas.height = 220;

    const ctx =
        canvas.getContext('2d');

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.font =
        'bold 78px Arial';

    ctx.textAlign =
        'center';

    ctx.textBaseline =
        'middle';

    ctx.fillStyle =
        '#ffffff';

    ctx.shadowColor =
        '#008cff';

    ctx.shadowBlur = 22;

    ctx.fillText(
        texto,
        500,
        110
    );

    const texture =
        new THREE.CanvasTexture(
            canvas
        );

    const material =
        new THREE.SpriteMaterial({

            map: texture,

            transparent: true,

            depthTest: false
        });

    const sprite =
        new THREE.Sprite(
            material
        );

    return sprite;
}


const teAdoro =
    crearTexto(
        'TE ADORO ♥️'
    );

const teAmo =
    crearTexto(
        'TE AMO ♥️'
    );


// =====================================================
// POSICIÓN RESPONSIVA
// =====================================================

function acomodarTextos() {

    const mobile =
        window.innerWidth < 600;

    if (mobile) {

        teAdoro.position.set(
            -4.4,
            1.1,
            1
        );

        teAmo.position.set(
            4.4,
            1.1,
            1
        );

        teAdoro.scale.set(
            2.7,
            0.60,
            1
        );

        teAmo.scale.set(
            2.7,
            0.60,
            1
        );

    } else {

        teAdoro.position.set(
            -7,
            1.0,
            1
        );

        teAmo.position.set(
            7,
            1.0,
            1
        );

        teAdoro.scale.set(
            3.8,
            0.85,
            1
        );

        teAmo.scale.set(
            3.8,
            0.85,
            1
        );
    }
}

acomodarTextos();

scene.add(teAdoro);
scene.add(teAmo);


// =====================================================
// ANIMACIÓN
// =====================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    const tiempo =
        performance.now() * 0.001;


    // Galaxia girando
    galaxyGroup.rotation.y +=
        0.0015;


    // Estrellas
    stars.rotation.y +=
        0.00015;


    // Corazón flotando
    heart.position.y =
        2.2 +
        Math.sin(tiempo * 1.5) *
        0.10;


    heartGlow.position.y =
        heart.position.y;


    // Pulso
    const pulso =
        1.35 +
        Math.sin(tiempo * 2.2) *
        0.035;

    heart.scale.set(
        pulso,
        pulso,
        pulso
    );

    heartGlow.scale.set(
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


// =====================================================
// RESPONSIVE
// =====================================================

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

        acomodarTextos();
    }
);

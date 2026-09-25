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
// ❤️ CORAZÓN DE PARTÍCULAS — MÁS VISIBLE Y AL FRENTE
// =====================================================

const heartGeometry = new THREE.BufferGeometry();

const heartPositions = [];
const heartColors = [];

const heartParticles = 3200;


// =====================================================
// FÓRMULA DEL CORAZÓN
// =====================================================

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


// =====================================================
// CREAR PARTÍCULAS
// =====================================================

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


    // Tamaño del corazón
    x *= 0.20;
    y *= 0.20;


    // Pequeña variación
    x += (Math.random() - 0.5) * 0.045;
    y += (Math.random() - 0.5) * 0.045;


    heartPositions.push(
        x,
        y,
        0
    );


    // Rosa / magenta brillante
    heartColors.push(
        1,
        0.08 + Math.random() * 0.22,
        0.95 + Math.random() * 0.05
    );

}


// =====================================================
// ATRIBUTOS
// =====================================================

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


// =====================================================
// MATERIAL DEL CORAZÓN
// =====================================================

const heartMaterial =
    new THREE.PointsMaterial({

        size: 0.065,

        vertexColors: true,

        transparent: true,

        opacity: 0.95,

        depthWrite: false,

        blending:
            THREE.AdditiveBlending

    });


// =====================================================
// CORAZÓN
// =====================================================

const heart =
    new THREE.Points(
        heartGeometry,
        heartMaterial
    );


// =====================================================
// ❤️ POSICIÓN
// =====================================================

// MÁS ARRIBA
heart.position.set(
    0,
    2.2,
    1.8
);


// TAMAÑO
heart.scale.set(
    0.81,
    0.81,
    0.81
);


// IMPORTANTE:
// lo ponemos al frente de la galaxia
heart.renderOrder = 20;

scene.add(heart);


// =====================================================
// ✨ RESPLANDOR DEL CORAZÓN
// =====================================================

const heartGlowGeometry =
    new THREE.BufferGeometry();

const glowPositions = [];


// Más partículas para que se note el brillo
for (let i = 0; i < 900; i++) {

    const t =
        Math.random() *
        Math.PI * 2;


    const scale =
        0.92 +
        Math.random() * 0.42;


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
        0
    );

}


heartGlowGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
        glowPositions,
        3
    )
);


// =====================================================
// MATERIAL DEL RESPLANDOR
// =====================================================

const glowMaterial =
    new THREE.PointsMaterial({

        color: 0xff22ff,

        size: 0.055,

        transparent: true,

        opacity: 0.55,

        depthWrite: false,

        blending:
            THREE.AdditiveBlending

    });


// =====================================================
// RESPLANDOR
// =====================================================

const heartGlow =
    new THREE.Points(
        heartGlowGeometry,
        glowMaterial
    );


// MISMA POSICIÓN DEL CORAZÓN
heartGlow.position.copy(
    heart.position
);


// MISMO TAMAÑO
heartGlow.scale.copy(
    heart.scale
);


// Un poquito detrás del corazón
heartGlow.position.z -= 0.08;

heartGlow.renderOrder = 19;


scene.add(heartGlow);
// =====================================================
// 💖 PALABRAS DE LA GALAXIA
// =====================================================

// Crear texto como Sprite
function crearTexto(texto, colorTexto = '#8eeaff') {

    const canvas = document.createElement('canvas');

    canvas.width = 1000;
    canvas.height = 220;

    const ctx = canvas.getContext('2d');

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sombra / brillo
    ctx.shadowColor = '#00d9ff';
    ctx.shadowBlur = 18;

    // Texto
    ctx.font = 'bold 58px Arial';

    const partes = texto.split(' ♥ ');

    if (partes.length === 2) {

        // Texto
        ctx.fillStyle = colorTexto;

        ctx.fillText(
            partes[0],
            455,
            110
        );

        // Corazón rosa
        ctx.shadowColor = '#ff4dff';
        ctx.shadowBlur = 22;

        ctx.fillStyle = '#ff69ff';

        ctx.fillText(
            '♥',
            650,
            110
        );

    } else {

        ctx.fillStyle = colorTexto;

        ctx.fillText(
            texto,
            500,
            110
        );
    }


    const texture =
        new THREE.CanvasTexture(canvas);

    texture.needsUpdate = true;

    const material =
        new THREE.SpriteMaterial({

            map: texture,

            transparent: true,

            depthWrite: false,

            depthTest: false
        });

    const sprite =
        new THREE.Sprite(material);

    return sprite;
}


// =====================================================
// CREAR LAS PALABRAS
// =====================================================

const teAdoro =
    crearTexto('TE ADORO ♥');

const teAmo =
    crearTexto('TE AMO ♥');

const miUniverso =
    crearTexto('MI UNIVERSO ♥');

const amorInfinito =
    crearTexto('AMOR INFINITO ♥');

const miVida =
    crearTexto('MI VIDA ♥');


// =====================================================
// AGREGAR A LA GALAXIA
// =====================================================

// IMPORTANTE:
// Al ser hijos de galaxyGroup,
// las palabras girarán junto con la galaxia.

galaxyGroup.add(teAdoro);
galaxyGroup.add(teAmo);

galaxyGroup.add(miUniverso);
galaxyGroup.add(amorInfinito);
galaxyGroup.add(miVida);


// =====================================================
// POSICIÓN RESPONSIVA
// =====================================================

function acomodarTextos() {

    const mobile =
        window.innerWidth < 600;


    if (mobile) {

        // TE ADORO
        teAdoro.position.set(
            -4.4,
            1.1,
            1
        );

        teAdoro.scale.set(
            2.7,
            0.60,
            1
        );


        // TE AMO
        teAmo.position.set(
            4.4,
            1.1,
            1
        );

        teAmo.scale.set(
            2.7,
            0.60,
            1
        );


        // MI UNIVERSO
        miUniverso.position.set(
            -4.0,
            -0.4,
            1.2
        );

        miUniverso.scale.set(
            2.8,
            0.62,
            1
        );


        // AMOR INFINITO
        amorInfinito.position.set(
            4.0,
            -1.3,
            1.2
        );

        amorInfinito.scale.set(
            3.0,
            0.62,
            1
        );


        // MI VIDA
        miVida.position.set(
            0,
            -2.5,
            1.3
        );

        miVida.scale.set(
            2.5,
            0.62,
            1
        );

    } else {

        // TE ADORO
        teAdoro.position.set(
            -7,
            1.0,
            1
        );

        teAdoro.scale.set(
            3.8,
            0.85,
            1
        );


        // TE AMO
        teAmo.position.set(
            7,
            1.0,
            1
        );

        teAmo.scale.set(
            3.8,
            0.85,
            1
        );


        // MI UNIVERSO
        miUniverso.position.set(
            -5.5,
            -0.3,
            1.2
        );

        miUniverso.scale.set(
            3.5,
            0.80,
            1
        );


        // AMOR INFINITO
        amorInfinito.position.set(
            5.5,
            -1.5,
            1.2
        );

        amorInfinito.scale.set(
            3.8,
            0.80,
            1
        );


        // MI VIDA
        miVida.position.set(
            0,
            -2.7,
            1.3
        );

        miVida.scale.set(
            3.2,
            0.80,
            1
        );
    }
}

// Ejecutar posiciones
acomodarTextos();

// =====================================================
// 🌌 ANIMACIÓN
// =====================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    const tiempo =
        performance.now() * 0.001;


    // =================================================
    // 🌌 GALAXIA GIRANDO
    // =================================================

    galaxyGroup.rotation.y +=
        0.0015;


    // =================================================
    // ⭐ ESTRELLAS
    // =================================================

    stars.rotation.y +=
        0.00015;


    // =================================================
    // ❤️ CORAZÓN FLOTANDO
    // =================================================

    heart.position.y =
        2.2 +
        Math.sin(tiempo * 1.5) *
        0.10;


    heartGlow.position.y =
        heart.position.y;


    // =================================================
    // ❤️ PULSO DEL CORAZÓN
    // =================================================

    const pulso =
        0.81 +
        Math.sin(tiempo * 2.2) *
        0.025;


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


    // =================================================
    // 🎨 RENDER
    // =================================================

    renderer.render(
        scene,
        camera
    );
}


// =====================================================
// 🚀 INICIAR ANIMACIÓN
// =====================================================

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

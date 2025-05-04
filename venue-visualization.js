/**
 * 3D Venue Visualization
 * Implements interactive 3D venue visualization with customization features
 * Based on Three.js for 3D rendering
 */

// Load Three.js from CDN
function loadThreeJS() {
    return new Promise((resolve, reject) => {
        if (window.THREE) {
            resolve(window.THREE);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => resolve(window.THREE);
        script.onerror = reject;
        document.head.appendChild(script);

        // Load OrbitControls
        const orbitControlsScript = document.createElement('script');
        orbitControlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js';
        document.head.appendChild(orbitControlsScript);

        // Load DragControls
        const dragControlsScript = document.createElement('script');
        dragControlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/DragControls.min.js';
        document.head.appendChild(dragControlsScript);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Create venue visualization section
    createVenueVisualizationSection();
    
    // Initialize venue visualization when the tab is clicked
    const venueVisTab = document.getElementById('venue-vis-tab');
    if (venueVisTab) {
        venueVisTab.addEventListener('click', initializeVenueVisualization);
    }
});

/**
 * Creates the venue visualization section in the DOM
 */
function createVenueVisualizationSection() {
    // Check if section already exists
    if (document.getElementById('venue-visualization')) {
        return;
    }

    // Create section after packages section
    const packagesSection = document.getElementById('packages');
    if (!packagesSection) return;

    const venueSection = document.createElement('section');
    venueSection.id = 'venue-visualization';
    venueSection.className = 'venue-visualization-section';
    venueSection.innerHTML = `
        <div class="container">
            <h2>3D Venue Visualization</h2>
            <p class="section-description">Design your event space in 3D. Drag and drop furniture, change layouts, and visualize your event before it happens.</p>
            
            <div class="venue-tabs">
                <button class="venue-tab active" data-venue="ballroom" id="venue-vis-tab">Ballroom</button>
                <button class="venue-tab" data-venue="garden">Garden</button>
                <button class="venue-tab" data-venue="conference">Conference Hall</button>
            </div>
            
            <div class="venue-visualization-container">
                <div class="venue-canvas-container">
                    <canvas id="venue-canvas"></canvas>
                    <div class="loading-indicator" id="venue-loading">
                        <div class="spinner"></div>
                        <p>Loading 3D Environment...</p>
                    </div>
                </div>
                
                <div class="venue-controls">
                    <div class="control-section">
                        <h3>Furniture</h3>
                        <div class="furniture-items">
                            <div class="furniture-item" data-furniture="table">
                                <img src="images/furniture-table.svg" alt="Table">
                                <span>Table</span>
                            </div>
                            <div class="furniture-item" data-furniture="chair">
                                <img src="images/furniture-chair.svg" alt="Chair">
                                <span>Chair</span>
                            </div>
                            <div class="furniture-item" data-furniture="sofa">
                                <img src="images/furniture-sofa.svg" alt="Sofa">
                                <span>Sofa</span>
                            </div>
                            <div class="furniture-item" data-furniture="plant">
                                <img src="images/furniture-plant.svg" alt="Plant">
                                <span>Plant</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="control-section">
                        <h3>Layout Templates</h3>
                        <div class="layout-templates">
                            <button class="layout-btn" data-layout="theater">Theater Style</button>
                            <button class="layout-btn" data-layout="classroom">Classroom</button>
                            <button class="layout-btn" data-layout="banquet">Banquet</button>
                            <button class="layout-btn" data-layout="reception">Reception</button>
                        </div>
                    </div>
                    
                    <div class="control-section">
                        <h3>Customization</h3>
                        <div class="customization-controls">
                            <div class="control-group">
                                <label for="wall-color">Wall Color</label>
                                <input type="color" id="wall-color" value="#f5f5f5">
                            </div>
                            <div class="control-group">
                                <label for="floor-texture">Floor Style</label>
                                <select id="floor-texture">
                                    <option value="wood">Wood</option>
                                    <option value="marble">Marble</option>
                                    <option value="carpet">Carpet</option>
                                </select>
                            </div>
                            <div class="control-group">
                                <label for="lighting">Lighting</label>
                                <select id="lighting">
                                    <option value="bright">Bright</option>
                                    <option value="dim">Dim</option>
                                    <option value="colorful">Colorful</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <button id="save-design" class="btn primary-btn">Save Design</button>
                </div>
            </div>
        </div>
    `;

    // Insert after packages section
    packagesSection.parentNode.insertBefore(venueSection, packagesSection.nextSibling);

    // Add event listeners for venue tabs
    document.querySelectorAll('.venue-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.venue-tab').forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            // Change venue
            changeVenue(this.getAttribute('data-venue'));
        });
    });

    // Add event listeners for furniture items (drag and drop)
    document.querySelectorAll('.furniture-item').forEach(item => {
        item.addEventListener('click', function() {
            addFurniture(this.getAttribute('data-furniture'));
        });
    });

    // Add event listeners for layout templates
    document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            applyLayout(this.getAttribute('data-layout'));
        });
    });

    // Add event listeners for customization controls
    document.getElementById('wall-color').addEventListener('change', function() {
        updateWallColor(this.value);
    });

    document.getElementById('floor-texture').addEventListener('change', function() {
        updateFloorTexture(this.value);
    });

    document.getElementById('lighting').addEventListener('change', function() {
        updateLighting(this.value);
    });

    // Save design button
    document.getElementById('save-design').addEventListener('click', saveDesign);

    // Create SVG furniture icons
    createFurnitureSVGs();
}

/**
 * Create SVG icons for furniture items
 */
function createFurnitureSVGs() {
    // Create directory for images if it doesn't exist
    const furnitureIcons = {
        'furniture-table': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><circle cx="12" cy="12" r="10" fill="#f0f0f0" stroke="#666" stroke-width="1"/><rect x="4" y="11" width="16" height="2" fill="#666"/></svg>`,
        'furniture-chair': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><rect x="6" y="12" width="12" height="2" fill="#666"/><rect x="8" y="14" width="8" height="6" fill="#f0f0f0" stroke="#666" stroke-width="1"/><rect x="8" y="4" width="8" height="8" fill="#f0f0f0" stroke="#666" stroke-width="1"/></svg>`,
        'furniture-sofa': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><rect x="2" y="10" width="20" height="8" rx="2" fill="#f0f0f0" stroke="#666" stroke-width="1"/><rect x="4" y="18" width="2" height="2" fill="#666"/><rect x="18" y="18" width="2" height="2" fill="#666"/></svg>`,
        'furniture-plant': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><rect x="10" y="16" width="4" height="6" fill="#a67c52"/><path d="M12,3 Q16,8 14,16 M12,3 Q8,8 10,16 M12,8 Q16,10 13,14 M12,8 Q8,10 11,14" stroke="#4caf50" fill="none" stroke-width="1"/></svg>`
    };

    // Create the SVG files
    for (const [filename, svgContent] of Object.entries(furnitureIcons)) {
        // We'll use these SVGs directly in the HTML
        // In a real implementation, you would save these as files
        const imgElements = document.querySelectorAll(`.furniture-item[data-furniture="${filename.split('-')[1]}"] img`);
        imgElements.forEach(img => {
            img.outerHTML = svgContent;
        });
    }
}

// Global variables for Three.js scene
let scene, camera, renderer, controls;
let dragControls, draggableObjects = [];
let currentVenue = 'ballroom';
let isInitialized = false;

/**
 * Initialize the 3D venue visualization
 */
async function initializeVenueVisualization() {
    if (isInitialized) return;
    
    const loadingIndicator = document.getElementById('venue-loading');
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
    
    try {
        // Load Three.js
        await loadThreeJS();
        
        const canvas = document.getElementById('venue-canvas');
        if (!canvas) return;
        
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        
        // Create camera
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 10, 20);
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        
        // Add orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        // Load the initial venue
        loadVenue(currentVenue);
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Start animation loop
        animate();
        
        isInitialized = true;
    } catch (error) {
        console.error('Error initializing 3D venue visualization:', error);
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

/**
 * Load a venue model
 */
function loadVenue(venueType) {
    // Clear existing venue
    clearVenue();
    
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(40, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create walls based on venue type
    createWalls(venueType);
    
    // Apply default layout
    applyLayout('theater');
}

/**
 * Create walls based on venue type
 */
function createWalls(venueType) {
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 });
    
    if (venueType === 'ballroom') {
        // Create rectangular room
        createWall(20, 10, 0, 5, 0, 0, wallMaterial); // Back wall
        createWall(20, 10, 0, 5, -15, Math.PI, wallMaterial); // Front wall
        createWall(30, 10, -10, 5, -7.5, Math.PI / 2, wallMaterial); // Left wall
        createWall(30, 10, 10, 5, -7.5, -Math.PI / 2, wallMaterial); // Right wall
    } else if (venueType === 'garden') {
        // Create partial walls for garden venue
        createWall(20, 10, 0, 5, 0, 0, wallMaterial); // Back wall only
        
        // Add some garden elements
        addGardenElements();
    } else if (venueType === 'conference') {
        // Create conference room with door
        createWall(20, 10, 0, 5, 0, 0, wallMaterial); // Back wall
        createWall(8, 10, 0, 5, -15, Math.PI, wallMaterial); // Front wall left section
        createWall(8, 10, 0, 5, -15, Math.PI, wallMaterial); // Front wall right section
        createWall(30, 10, -10, 5, -7.5, Math.PI / 2, wallMaterial); // Left wall
        createWall(30, 10, 10, 5, -7.5, -Math.PI / 2, wallMaterial); // Right wall
    }
}

/**
 * Create a wall
 */
function createWall(width, height, x, y, z, rotation, material) {
    const wallGeometry = new THREE.BoxGeometry(width, height, 0.2);
    const wall = new THREE.Mesh(wallGeometry, material);
    wall.position.set(x, y, z);
    wall.rotation.y = rotation;
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
    return wall;
}

/**
 * Add garden elements for garden venue
 */
function addGardenElements() {
    // Add trees
    for (let i = 0; i < 5; i++) {
        const treeGeometry = new THREE.ConeGeometry(1, 4, 8);
        const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
        const tree = new THREE.Mesh(treeGeometry, treeMaterial);
        tree.position.set(-8 + i * 4, 2, -12);
        tree.castShadow = true;
        scene.add(tree);
        
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(-8 + i * 4, 0, -12);
        trunk.castShadow = true;
        scene.add(trunk);
    }
    
    // Add grass
    const grassGeometry = new THREE.PlaneGeometry(40, 30);
    const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x7cb342 });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = 0.01; // Slightly above the floor
    scene.add(grass);
}

/**
 * Clear the current venue
 */
function clearVenue() {
    // Remove all objects except camera and lights
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    
    // Re-add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Clear draggable objects
    draggableObjects = [];
}

/**
 * Change the venue
 */
function changeVenue(venueType) {
    currentVenue = venueType;
    if (isInitialized) {
        loadVenue(venueType);
    }
}

/**
 * Add furniture to the scene
 */
function addFurniture(furnitureType) {
    if (!isInitialized) return;
    
    let furniture;
    
    switch (furnitureType) {
        case 'table':
            furniture = createTable();
            break;
        case 'chair':
            furniture = createChair();
            break;
        case 'sofa':
            furniture = createSofa();
            break;
        case 'plant':
            furniture = createPlant();
            break;
        default:
            return;
    }
    
    // Position in front of camera
    const vector = new THREE.Vector3(0, 0, -5);
    vector.applyQuaternion(camera.quaternion);
    vector.add(camera.position);
    vector.y = 0; // Place on the floor
    
    furniture.position.copy(vector);
    scene.add(furniture);
    
    // Make draggable
    draggableObjects.push(furniture);
    
    // Initialize drag controls if not already
    if (!dragControls) {
        dragControls = new THREE.DragControls(draggableObjects, camera, renderer.domElement);
        
        dragControls.addEventListener('dragstart', function() {
            controls.enabled = false; // Disable orbit controls while dragging
        });
        
        dragControls.addEventListener('dragend', function() {
            controls.enabled = true; // Re-enable orbit controls
        });
    } else {
        // Update objects
        dragControls.dispose();
        dragControls = new THREE.DragControls(draggableObjects, camera, renderer.domElement);
    }
}

/**
 * Create a table
 */
function createTable() {
    const group = new THREE.Group();
    
    // Table top
    const tableTopGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const tableTopMaterial = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    tableTop.position.y = 1.5;
    tableTop.castShadow = true;
    group.add(tableTop);
    
    // Table leg
    const tableLegGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const tableLegMaterial = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const tableLeg = new THREE.Mesh(tableLegGeometry, tableLegMaterial);
    tableLeg.position.y = 0.75;
    tableLeg.castShadow = true;
    group.add(tableLeg);
    
    // Table base
    const tableBaseGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 16);
    const tableBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const tableBase = new THREE.Mesh(tableBaseGeometry, tableBaseMaterial);
    tableBase.position.y = 0.05;
    tableBase.castShadow = true;
    group.add(tableBase);
    
    return group;
}

/**
 * Create a chair
 */
function createChair() {
    const group = new THREE.Group();
    
    // Seat
    const seatGeometry = new THREE.BoxGeometry(1.2, 0.1, 1.2);
    const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.y = 0.8;
    seat.castShadow = true;
    group.add(seat);
    
    // Back
    const backGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.1);
    const backMaterial = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.set(0, 1.4, -0.55);
    back.castShadow = true;
    group.add(back);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    
    const positions = [
        [0.5, 0.4, 0.5],  // Front right
        [-0.5, 0.4, 0.5], // Front left
        [0.5, 0.4, -0.5], // Back right
        [-0.5, 0.4, -0.5] // Back left
    ];
    
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        group.add(leg);
    });
    
    return group;
}

/**
 * Create a sofa
 */
function createSofa() {
    const group = new THREE.Group();
    
    // Base
    const baseGeometry = new THREE.BoxGeometry(3, 0.5, 1.2);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x3949ab });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.25;
    base.castShadow = true;
    group.add(base);
    
    // Back
    const backGeometry = new THREE.BoxGeometry(3, 1, 0.3);
    const backMaterial = new THREE.MeshStandardMaterial({ color: 0x3949ab });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.set(0, 1, -0.45);
    back.castShadow = true;
    group.add(back);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.3, 0.8, 1.2);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3949ab });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-1.35, 0.65, 0);
    leftArm.castShadow = true;
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(1.35, 0.65, 0);
    rightArm.castShadow = true;
    group.add(rightArm);
    
    // Cushions
    const cushionGeometry = new THREE.BoxGeometry(0.9, 0.2, 0.9);
    const cushionMaterial = new THREE.MeshStandardMaterial({ color: 0x5c6bc0 });
    
    const positions = [
        [-1, 0.6, 0],
        [0, 0.6, 0],
        [1, 0.6, 0]
    ];
    
    positions.forEach(pos => {
        const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
        cushion.position.set(...pos);
        cushion.castShadow = true;
        group.add(cushion);
    });
    
    return group;
}

/**
 * Create a plant
 */
function createPlant() {
    const group = new THREE.Group();
    
    // Pot
    const potGeometry = new THREE.CylinderGeometry(0.5, 0.4, 0.8, 16);
    const potMaterial = new THREE.MeshStandardMaterial({ color: 0x795548 });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = 0.4;
    pot.castShadow = true;
    group.add(pot);
    
    // Plant
    const plantGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
    const plant = new THREE.Mesh(plantGeometry, plantMaterial);
    plant.position.y = 1.2;
    plant.scale.y = 1.2;
    plant.castShadow = true;
    group.add(plant);
    
    return group;
}

/**
 * Apply a layout template
 */
function applyLayout(layoutType) {
    if (!isInitialized) return;
    
    // Clear existing furniture
    scene.children.forEach(child => {
        if (draggableObjects.includes(child)) {
            scene.remove(child);
        }
    });
    
    draggableObjects = [];
    
    // Apply new layout
    switch (layoutType) {
        case 'theater':
            createTheaterLayout();
            break;
        case 'classroom':
            createClassroomLayout();
            break;
        case 'banquet':
            createBanquetLayout();
            break;
        case 'reception':
            createReceptionLayout();
            break;
    }
    
    // Update drag controls
    if (dragControls) {
        dragControls.dispose();
        dragControls = new THREE.DragControls(draggableObjects, camera, renderer.domElement);
    }
}

/**
 * Create theater style layout
 */
function createTheaterLayout() {
    // Create rows of chairs
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 8; col++) {
            const chair = createChair();
            chair.position.set(-7 + col * 2, 0, -5 + row * 2);
            chair.rotation.y = Math.PI; // Face forward
            scene.add(chair);
            draggableObjects.push(chair);
        }
    }
    
    // Add a podium at the front
    const podium = createTable();
    podium.scale.set(0.7, 1.2, 0.7);
    podium.position.set(0, 0, -10);
    scene.add(podium);
    draggableObjects.push(
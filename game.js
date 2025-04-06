// Game constants
let CANVAS_WIDTH = window.innerWidth;
let CANVAS_HEIGHT = window.innerHeight;
const GRID_SIZE = 40;

// Unit types
const UNIT_TYPES = {
    MARINE: {
        width: 20,
        height: 20,
        color: '#3498db',
        shape: 'circle',
        speed: 2,
        maxHealth: 100,
        baseArmor: 0,
        baseAttackDamage: 5,
        baseRange: 50,
        baseRegen: 0.1,
        baseAttackSpeed: 1
    },
    WORKER: {
        width: 25,
        height: 25,
        color: '#e67e22',
        shape: 'square',
        speed: 2.5,
        maxHealth: 60,
        baseArmor: 0,
        baseAttackDamage: 2,
        baseRange: 10,
        baseRegen: 0.05,
        baseAttackSpeed: 0.7
    }
};

// UI constants
const UPGRADE_MENU = {
    width: 280,
    height: 180,
    padding: 10,
    gridCols: 5,
    gridRows: 3,
    cellSize: 50,
    cellPadding: 5,
    visible: false,
    resources: 100,
    currentPage: 'upgrades', // Current page of the menu: 'upgrades' or 'build'
    buildItems: [
        { id: "BUNKER", name: "Bunker", cost: 50, color: "#8e44ad", description: "Produces combat units", hotkey: "Q" },
        { id: "SUPPLY", name: "Supply Depot", cost: 30, color: "#27ae60", description: "Increases supply limit", hotkey: "W" },
        { id: "SHIELD", name: "Shield Tower", cost: 10, color: "#3498db", description: "Provides +5 armor to nearby units", hotkey: "E" },
        { id: "SENSOR", name: "Sensor Tower", cost: 10, color: "#e67e22", description: "Advanced detection (in development)", hotkey: "R" },
        { id: "TANK", name: "Tank", cost: 10, color: "rgba(160, 120, 80, 0.8)", description: "Heavily armored structure", hotkey: "T" }
    ],
    // Rest of placeholders remain the same
};

// Upgrade status display in top-left
const UPGRADE_STATUS = {
    x: 20,
    y: 20,
    cellSize: 40,
    cellPadding: 5,
    spacing: 10
};

// Hotkey group display
const HOTKEY_GROUPS = {
    width: 280,
    height: 40,
    padding: 10,
    spacing: 10,
    groups: [
        { key: "1", name: "All Marines", active: false, color: "#3498db" },
        { key: "2", name: "All Bunkers", active: false, color: "#9b59b6" },
        { key: "3", name: "Workers/Build", active: false, color: "#1abc9c" },
        { key: "4", name: "Upgrades", active: false, color: "#f1c40f" }
    ]
};

// Resource display
const RESOURCE_DISPLAY = {
    x: CANVAS_WIDTH - 150,
    y: 30,
    width: 130,
    height: 30
};

// Supply counter
const SUPPLY_DISPLAY = {
    x: CANVAS_WIDTH - 300,
    y: 30,
    width: 130,
    height: 30,
    current: 0,
    maximum: 10
};

// Building constants
const BUILDING_TYPES = {
    BUNKER: {
        width: 80,
        height: 80,
        color: "#8e44ad",
        borderColor: "#9b59b6",
        spawnTime: 120, // frames between spawns (60 frames = 1 second at 60fps)
        spawnCost: 0,  // No resource cost
        autoSpawn: true, // Automatically spawn units
        unitType: 'MARINE',
        maxHealth: 500,
        structureArmor: 1
    },
    SUPPLY: {
        width: 60,
        height: 60,
        color: "#27ae60",
        borderColor: "#2ecc71",
        supplyProvided: 10, // Increases supply limit
        buildTime: 180,
        maxHealth: 300,
        structureArmor: 1
    },
    SHIELD: {
        width: 40,
        height: 40,
        color: "#3498db",
        borderColor: "#2980b9",
        shieldRadius: 150, // Radius of shield aura
        armorBonus: 5, // Armor bonus provided by shield aura
        maxHealth: 200,
        structureArmor: 1
    },
    SENSOR: {
        width: 40,
        height: 40,
        color: "#e67e22",
        borderColor: "#d35400",
        sensorRadius: 300, // Twice the radius of shield tower
        maxHealth: 200,
        structureArmor: 1
    },
    TANK: {
        width: 120,
        height: 40,
        color: "rgba(160, 120, 80, 0.8)", // Light brown transparent
        borderColor: "rgba(140, 100, 60, 0.9)", // Slightly darker brown for border
        maxHealth: 400,
        structureArmor: 1
    }
};

// Upgrade types and their costs
const UPGRADES = {
    AR: { name: "Armor", cost: 20, level: 0, maxLevel: 3, color: "#7f8c8d", description: "Reduces damage taken", hotkey: "Q" },
    AD: { name: "Attack Damage", cost: 25, level: 0, maxLevel: 3, color: "#e74c3c", description: "Increases damage dealt", hotkey: "W" },
    WR: { name: "Weapon Range", cost: 30, level: 0, maxLevel: 3, color: "#3498db", description: "Extends attack distance", hotkey: "E" },
    HR: { name: "Health Regen", cost: 15, level: 0, maxLevel: 3, color: "#2ecc71", description: "Increases health regeneration", hotkey: "R" },
    MS: { name: "Movement Speed", cost: 20, level: 0, maxLevel: 3, color: "#f39c12", description: "Increases unit speed", hotkey: "T" }
};

// Placeholder for empty upgrade slots
const PLACEHOLDER_SLOTS = [
    { id: "PH1", name: "Placeholder", color: "#34495e", description: "Future upgrade slot" },
    { id: "PH2", name: "Placeholder", color: "#34495e", description: "Future upgrade slot" },
    { id: "PH3", name: "Placeholder", color: "#34495e", description: "Future upgrade slot" },
    { id: "PH4", name: "Placeholder", color: "#34495e", description: "Future upgrade slot" },
    { id: "PH5", name: "Placeholder", color: "#34495e", description: "Future upgrade slot" },
    { id: "PH6", name: "Placeholder", color: "#34495e", description: "Future upgrade slot" },
    { id: "PH7", name: "Placeholder", color: "#34495e", description: "Future upgrade slot" },
    { id: "PH8", name: "Placeholder", color: "#34495e", description: "Future upgrade slot" },
    { id: "PH9", name: "Placeholder", color: "#34495e", description: "Future upgrade slot" },
    { id: "PH10", name: "Placeholder", color: "#34495e", description: "Future upgrade slot" }
];

// Stats display panel for selected units
const STATS_DISPLAY = {
    width: 280,
    height: 180,
    padding: 10,
    visible: false,
    scroll: 0, // Scroll position
    maxScroll: 0, // Maximum scroll allowed (calculated dynamically)
    scrollSpeed: 10, // Pixels per scroll event
    stats: ["health", "armor", "attackDamage", "attackSpeed", "weaponRange", "movementSpeed", "regen", "shielded"],
    statLabels: {
        health: "Health",
        armor: "Armor",
        attackDamage: "Damage",
        attackSpeed: "Attack Speed",
        weaponRange: "Weapon Range",
        movementSpeed: "Move Speed",
        regen: "Health Regen",
        shielded: "Shield Status"
    }
};

// Building stats display
const BUILDING_STATS = {
    width: 280,
    height: 180,
    padding: 10,
    visible: false,
    scroll: 0, // Scroll position
    maxScroll: 0, // Maximum scroll allowed (calculated dynamically)
    scrollSpeed: 10, // Pixels per scroll event
    stats: ["health", "structureArmor", "spawnRate", "unitType", "isSpawning", "rallySet", "shieldRadius", "armorBonus", "sensorRadius"],
    statLabels: {
        health: "Health",
        structureArmor: "Structure Armor",
        spawnRate: "Production Rate",
        unitType: "Produces",
        isSpawning: "Production",
        rallySet: "Rally Point",
        shieldRadius: "Shield Radius",
        armorBonus: "Armor Bonus",
        sensorRadius: "Sensor Radius"
    }
};

// Game state
const gameState = {
    units: [],
    buildings: [],
    selectedUnits: new Set(),
    selectedBuilding: null,
    mouse: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    targetIndicators: [],
    deathAnimations: [], // Add death animations array
    rightMouseDown: false,
    hoveredUpgrade: null,
    pendingBuilding: null, // Building placement pending from build menu
    uiState: {
        isUpgradeMenuHovered: false
    },
    hotkeys: {
        isCtrlDown: false
    },
    rallyPoint: null,
    resourceTimer: 0,
    resourceIncomeAmount: 5,
    resourceIncomeInterval: 120 // 2 seconds at 60fps
};

// Building class
class Building {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = BUILDING_TYPES[type].width;
        this.height = BUILDING_TYPES[type].height;
        this.color = BUILDING_TYPES[type].color;
        this.borderColor = BUILDING_TYPES[type].borderColor;
        this.selected = false;
        this.hovered = false;
        this.spawnTimer = 0;
        this.spawnProgress = 0;
        this.id = 'building_' + Math.random().toString(36).substr(2, 9); // Add unique ID for multiplayer
        
        // Health and armor
        this.maxHealth = BUILDING_TYPES[type].maxHealth;
        this.currentHealth = this.maxHealth;
        this.structureArmor = BUILDING_TYPES[type].structureArmor;
        
        // Building-specific properties
        if (type === 'BUNKER') {
            this.isSpawning = BUILDING_TYPES[type].autoSpawn; // Start auto-spawning if enabled
            this.unitType = BUILDING_TYPES[type].unitType;
            this.spawnRate = 60 / (BUILDING_TYPES[type].spawnTime / 60); // Spawns per minute
        } else {
            this.isSpawning = false;
        }
        
        this.rallyPoint = null;
    }

    update() {
        // Auto-start spawning if not at supply cap
        const buildingType = BUILDING_TYPES[this.type];
        if (buildingType.autoSpawn && !this.isSpawning && SUPPLY_DISPLAY.current < SUPPLY_DISPLAY.maximum) {
            this.startSpawning();
        }
        
        // Handle unit spawning
        if (this.isSpawning) {
            this.spawnTimer++;
            this.spawnProgress = this.spawnTimer / BUILDING_TYPES[this.type].spawnTime;
            
            if (this.spawnTimer >= BUILDING_TYPES[this.type].spawnTime) {
                const success = this.spawnUnit();
                this.spawnTimer = 0;
                this.spawnProgress = 0;
                
                // If spawn failed (e.g. at supply cap), stop spawning
                if (!success && BUILDING_TYPES[this.type].autoSpawn) {
                    this.isSpawning = SUPPLY_DISPLAY.current < SUPPLY_DISPLAY.maximum;
                } else if (!BUILDING_TYPES[this.type].autoSpawn) {
                    this.isSpawning = false;
                }
            }
        }
    }

    draw(ctx) {
        // Building shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        
        // Main building shape
        ctx.fillStyle = this.selected ? '#e74c3c' : (this.hovered ? '#9b59b6' : this.color);
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        ctx.shadowBlur = 0;
        
        // Building border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // Selection indicator
        if (this.selected) {
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - this.width/2 - 5, this.y - this.height/2 - 5, this.width + 10, this.height + 10);
        }
        
        // Building label
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type, this.x, this.y);
        
        // Draw shield radius if this is a shield tower (always visible now)
        if (this.type === 'SHIELD') {
            const shieldRadius = BUILDING_TYPES.SHIELD.shieldRadius;
            
            // Draw shield range indicator
            ctx.beginPath();
            ctx.arc(this.x, this.y, shieldRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.4)';
            ctx.setLineDash([5, 3]);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
        }
        
        // Draw sensor radius if this is a sensor tower (outline only)
        if (this.type === 'SENSOR') {
            const sensorRadius = BUILDING_TYPES.SENSOR.sensorRadius;
            
            // Draw sensor range indicator (outline only, no fill)
            ctx.beginPath();
            ctx.arc(this.x, this.y, sensorRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(230, 126, 34, 0.5)';  // Orange from the sensor color
            ctx.setLineDash([8, 4]);  // Larger dash pattern for the larger radius
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Draw health bar (only if not at full health or if selected)
        if (this.currentHealth < this.maxHealth || this.selected) {
            const barWidth = this.width - 10;
            const barHeight = 8;
            const barX = this.x - barWidth/2;
            const barY = this.y - this.height/2 - 15;
            
            // Background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Health fill
            const healthPercent = this.currentHealth / this.maxHealth;
            ctx.fillStyle = healthPercent > 0.6 ? '#2ecc71' : (healthPercent > 0.3 ? '#f39c12' : '#e74c3c');
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
        
        // Draw spawn progress if currently spawning
        if (this.isSpawning) {
            const barWidth = this.width - 20;
            const barHeight = 8;
            const barX = this.x - barWidth/2;
            const barY = this.y + this.height/2 + 10;
            
            // Background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Progress
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(barX, barY, barWidth * this.spawnProgress, barHeight);
        }
        
        // Draw rally point if set
        if (this.rallyPoint) {
            // Rally point flag
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.moveTo(this.rallyPoint.x, this.rallyPoint.y - 15);
            ctx.lineTo(this.rallyPoint.x, this.rallyPoint.y);
            ctx.lineTo(this.rallyPoint.x + 10, this.rallyPoint.y - 5);
            ctx.closePath();
            ctx.fill();
            
            // Line from building to rally point
            ctx.strokeStyle = 'rgba(243, 156, 18, 0.6)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.rallyPoint.x, this.rallyPoint.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
    
    // Check if a unit is within shield radius
    isUnitInShieldRadius(unit) {
        if (this.type !== 'SHIELD') return false;
        
        const dx = this.x - unit.x;
        const dy = this.y - unit.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= BUILDING_TYPES.SHIELD.shieldRadius;
    }

    isPointInside(x, y) {
        return x >= this.x - this.width/2 && 
               x <= this.x + this.width/2 && 
               y >= this.y - this.height/2 && 
               y <= this.y + this.height/2;
    }
    
    spawnUnit() {
        if (SUPPLY_DISPLAY.current >= SUPPLY_DISPLAY.maximum) {
            console.log("Supply limit reached!");
            return false;
        }
        
        // Get the unit type from building definition
        const unitType = BUILDING_TYPES[this.type].unitType || 'MARINE';
        
        // Create a new unit near the building
        const spawnOffsetX = (Math.random() - 0.5) * this.width;
        const spawnOffsetY = (Math.random() - 0.5) * this.height;
        const newUnit = new Unit(
            this.x + spawnOffsetX, 
            this.y + this.height/2 + 30 + spawnOffsetY,
            unitType
        );
        
        // Set rally point if exists
        if (this.rallyPoint) {
            newUnit.targetX = this.rallyPoint.x;
            newUnit.targetY = this.rallyPoint.y;
            newUnit.path = [{
                x: this.rallyPoint.x,
                y: this.rallyPoint.y
            }];
        }
        
        gameState.units.push(newUnit);
        SUPPLY_DISPLAY.current++;
        
        // Play spawn sound
        playSound('spawn');
        
        return true;
    }
    
    startSpawning() {
        // Check if already spawning
        if (this.isSpawning) return false;
        
        // Check if at supply limit
        if (SUPPLY_DISPLAY.current >= SUPPLY_DISPLAY.maximum) {
            console.log("Supply limit reached!");
            return false;
        }
        
        // If there's a spawn cost, check resources (but we set it to 0)
        if (BUILDING_TYPES[this.type].spawnCost > 0) {
            if (UPGRADE_MENU.resources < BUILDING_TYPES[this.type].spawnCost) {
                console.log("Not enough resources!");
                return false;
            }
            
            // Deduct resources
            UPGRADE_MENU.resources -= BUILDING_TYPES[this.type].spawnCost;
        }
        
        // Start spawning
        this.isSpawning = true;
        this.spawnTimer = 0;
        
        return true;
    }
    
    setRallyPoint(x, y) {
        this.rallyPoint = { x, y };
        
        // Visual indicator and sound are now handled in handleMouseDown
        // for multiple bunkers
    }
    
    // Method to take damage
    takeDamage(amount) {
        // Apply armor reduction (each armor point reduces damage by 5%)
        const damageReduction = this.structureArmor * 0.05;
        const reducedDamage = amount * (1 - damageReduction);
        
        // Apply damage
        this.currentHealth -= Math.max(1, reducedDamage); // Minimum 1 damage
        
        // Clamp health to max
        this.currentHealth = Math.max(0, Math.min(this.maxHealth, this.currentHealth));
        
        // Check if building is destroyed
        if (this.currentHealth <= 0) {
            // Handle building destruction
            return true; // Building destroyed
        }
        
        return false; // Building still intact
    }
    
    // Method to heal building
    heal(amount) {
        // Apply healing
        this.currentHealth += amount;
        
        // Clamp to max health
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth);
    }
}

// Unit class
class Unit {
    constructor(x, y, type = 'MARINE') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = UNIT_TYPES[type].width;
        this.height = UNIT_TYPES[type].height;
        this.color = UNIT_TYPES[type].color;
        this.shape = UNIT_TYPES[type].shape;
        this.selected = false;
        this.targetX = x;
        this.targetY = y;
        this.speed = UNIT_TYPES[type].speed;
        this.hovered = false;
        this.path = [];
        this.id = 'unit_' + Math.random().toString(36).substr(2, 9);
        this.shielded = false; // Track whether unit is under shield effect
        
        // Health and base stats
        this.maxHealth = UNIT_TYPES[type].maxHealth;
        this.currentHealth = this.maxHealth;
        
        // Unit stats - these will be affected by upgrades
        this.stats = {
            armor: UNIT_TYPES[type].baseArmor,
            attackDamage: UNIT_TYPES[type].baseAttackDamage,
            weaponRange: UNIT_TYPES[type].baseRange,
            regen: UNIT_TYPES[type].baseRegen,
            movementSpeed: UNIT_TYPES[type].speed,
            health: this.maxHealth
        };
        
        // Track shield bonus separately so we can add/remove it
        this.shieldArmorBonus = 0;
        
        // Apply current upgrades upon creation
        this.updateStats();
    }

    update() {
        // Apply movement speed upgrade
        this.speed = this.stats.movementSpeed;
        
        // Apply health regeneration
        if (this.currentHealth < this.maxHealth) {
            this.heal(this.stats.regen / 60); // Regen per frame (60fps)
        }
        
        // Move along path if it exists
        if (this.path.length > 0) {
            const nextPoint = this.path[0];
            const dx = nextPoint.x - this.x;
            const dy = nextPoint.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 1) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            } else {
                this.path.shift();
            }
        } else {
            // Direct movement to target
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 1) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
        }
    }

    draw(ctx) {
        // Shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 5;
        
        // Base unit shape
        ctx.fillStyle = this.selected ? '#e74c3c' : (this.hovered ? '#2ecc71' : this.color);
        
        if (this.shape === 'circle') {
            // Draw circle for marine units
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'square') {
            // Draw square for worker units
            ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        }
        
        ctx.shadowBlur = 0;
        
        // Draw shield effect if unit is shielded
        if (this.shielded) {
            ctx.beginPath();
            if (this.shape === 'circle') {
                ctx.arc(this.x, this.y, this.width/2 + 3, 0, Math.PI * 2);
            } else {
                // For square units, draw a rounded rectangle shield
                const radius = 5;
                const width = this.width + 6;
                const height = this.height + 6;
                const x = this.x - width/2;
                const y = this.y - height/2;
                
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
            }
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Selection ring
        if (this.selected) {
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 2;
            
            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width/2 + 5, 0, Math.PI * 2);
                ctx.stroke();
            } else if (this.shape === 'square') {
                ctx.strokeRect(this.x - this.width/2 - 3, this.y - this.height/2 - 3, this.width + 6, this.height + 6);
            }
        }

        // Hover effect
        if (this.hovered && !this.selected) {
            ctx.strokeStyle = '#2ecc71';
            ctx.lineWidth = 1;
            
            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width/2 + 3, 0, Math.PI * 2);
                ctx.stroke();
            } else if (this.shape === 'square') {
                ctx.strokeRect(this.x - this.width/2 - 2, this.y - this.height/2 - 2, this.width + 4, this.height + 4);
            }
        }
        
        // Draw health bar (only if not at full health or if selected)
        if (this.currentHealth < this.maxHealth || this.selected) {
            const barWidth = this.width + 6;
            const barHeight = 4;
            const barX = this.x - barWidth / 2;
            const barY = this.y - this.height/2 - 10;
            
            // Background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Health fill
            const healthPercent = this.currentHealth / this.maxHealth;
            ctx.fillStyle = healthPercent > 0.6 ? '#2ecc71' : (healthPercent > 0.3 ? '#f39c12' : '#e74c3c');
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
    }

    drawPath(ctx) {
        if (this.selected && this.path.length > 0) {
            ctx.strokeStyle = 'rgba(46, 204, 113, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            
            for (const point of this.path) {
                ctx.lineTo(point.x, point.y);
            }
            
            ctx.stroke();
        }
    }

    isPointInside(x, y) {
        if (this.shape === 'circle') {
            const dx = this.x - x;
            const dy = this.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= this.width/2;
        } else if (this.shape === 'square') {
            return x >= this.x - this.width/2 && 
                   x <= this.x + this.width/2 && 
                   y >= this.y - this.height/2 && 
                   y <= this.y + this.height/2;
        }
        return false;
    }

    // Add a method to update all stats
    updateStats() {
        // Update stats based on upgrades
        this.stats.armor = UNIT_TYPES[this.type].baseArmor + UPGRADES.AR.level;
        this.stats.attackDamage = UNIT_TYPES[this.type].baseAttackDamage + (UPGRADES.AD.level * 2);
        this.stats.weaponRange = UNIT_TYPES[this.type].baseRange + (UPGRADES.WR.level * 20);
        this.stats.regen = UNIT_TYPES[this.type].baseRegen + (UPGRADES.HR.level * 0.1);
        this.stats.movementSpeed = UNIT_TYPES[this.type].speed + (UPGRADES.MS.level * 0.5);
        
        // Keep attack speed as a basic stat (not upgraded)
        this.stats.attackSpeed = UNIT_TYPES[this.type].baseAttackSpeed;
        
        this.stats.health = this.maxHealth;
        
        // Apply shield bonus if unit is shielded
        if (this.shielded) {
            this.stats.armor += this.shieldArmorBonus;
        }
        
        // Apply movement speed from stats
        this.speed = this.stats.movementSpeed;
    }

    takeDamage(amount) {
        // Apply armor reduction (each armor point reduces damage by 5%)
        const damageReduction = this.stats.armor * 0.05;
        const reducedDamage = amount * (1 - damageReduction);
        
        // Apply damage
        this.currentHealth -= Math.max(1, reducedDamage); // Minimum 1 damage
        
        // Clamp health to max
        this.currentHealth = Math.max(0, Math.min(this.maxHealth, this.currentHealth));
        
        // Check if unit is destroyed
        if (this.currentHealth <= 0) {
            // Handle unit death
            return true; // Unit died
        }
        
        return false; // Unit still alive
    }
    
    heal(amount) {
        // Apply healing
        this.currentHealth += amount;
        
        // Clamp to max health
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth);
    }
    
    // Add a method to check if a target is in range
    isTargetInRange(targetX, targetY) {
        const dx = this.x - targetX;
        const dy = this.y - targetY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= this.stats.weaponRange;
    }
    
    // Method to attack a target
    attack(target) {
        if (this.isTargetInRange(target.x, target.y)) {
            // Apply damage based on attack damage
            const damage = this.stats.attackDamage;
            const killed = target.takeDamage(damage);
            
            // Create a visual hit indicator
            gameState.targetIndicators.push(new TargetIndicator(target.x, target.y));
            
            // Play attack sound
            playSound('attack');
            
            return killed;
        }
        
        return false;
    }
    
    // Method to apply shield effect
    applyShieldEffect() {
        if (!this.shielded) {
            this.shielded = true;
            this.shieldArmorBonus = BUILDING_TYPES.SHIELD.armorBonus;
            this.updateStats(); // Update stats to include shield bonus
        }
    }
    
    // Method to remove shield effect
    removeShieldEffect() {
        if (this.shielded) {
            this.shielded = false;
            this.shieldArmorBonus = 0;
            this.updateStats(); // Update stats to remove shield bonus
        }
    }
}

// Target indicator class
class TargetIndicator {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.opacity = 1;
        this.lifetime = 60; // frames
    }

    update() {
        this.lifetime--;
        this.opacity = this.lifetime / 60;
        this.size += 0.5;
        return this.lifetime > 0;
    }

    draw(ctx) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Cross in the middle
        const length = 6;
        ctx.beginPath();
        ctx.moveTo(this.x - length, this.y);
        ctx.lineTo(this.x + length, this.y);
        ctx.moveTo(this.x, this.y - length);
        ctx.lineTo(this.x, this.y + length);
        ctx.stroke();
    }
}

// Death animation class
class DeathAnimation {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.frame = 0;
        this.maxFrames = 30; // Animation lasts half a second at 60fps
        this.size = type === 'MARINE' ? 20 : 25; // Starting size based on unit type
        this.color = UNIT_TYPES[type].color;
    }
    
    update() {
        this.frame++;
        return this.frame < this.maxFrames; // Return false when animation is complete
    }
    
    draw(ctx) {
        const progress = this.frame / this.maxFrames;
        const size = this.size * (1 - progress); // Shrink as animation progresses
        const opacity = 1 - progress; // Fade out
        
        // Draw fading particle effect
        ctx.fillStyle = `rgba(${this.hexToRgb(this.color)}, ${opacity})`;
        
        if (this.type === 'MARINE') {
            // Circle particles for marine
            for (let i = 0; i < 5; i++) {
                const angle = (progress * Math.PI * 2) + (i * Math.PI * 2 / 5);
                const distance = progress * this.size;
                const px = this.x + Math.cos(angle) * distance;
                const py = this.y + Math.sin(angle) * distance;
                const particleSize = size / 3;
                
                ctx.beginPath();
                ctx.arc(px, py, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Square particles for worker
            const particleSize = size / 3;
            for (let i = 0; i < 4; i++) {
                const angle = (progress * Math.PI * 2) + (i * Math.PI / 2);
                const distance = progress * this.size;
                const px = this.x + Math.cos(angle) * distance;
                const py = this.y + Math.sin(angle) * distance;
                
                ctx.fillRect(px - particleSize/2, py - particleSize/2, particleSize, particleSize);
            }
        }
    }
    
    // Helper to convert hex color to RGB
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `${r}, ${g}, ${b}`;
    }
}

// Initialize game
function init() {
    const canvas = document.getElementById('gameCanvas');
    resizeCanvas(canvas);
    const ctx = canvas.getContext('2d');

    // Check if this is a fresh init (not from multiplayer mode)
    if (!multiplayer.isConnected) {
        // Create initial bunker
        const bunker = new Building(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2,
            'BUNKER'
        );
        gameState.buildings.push(bunker);

        // Create initial worker unit
        const worker = new Unit(
            CANVAS_WIDTH / 2 + 50,
            CANVAS_HEIGHT / 2 + 50,
            'WORKER'
        );
        gameState.units.push(worker);
        
        // Update supply count for the worker
        SUPPLY_DISPLAY.current++;
    }

    // Event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('contextmenu', handleRightClick);
    canvas.addEventListener('wheel', handleMouseWheel);
    window.addEventListener('resize', () => resizeCanvas(canvas));
    
    // Keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    function gameLoop() {
        update();
        draw(ctx);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

// Handle window resizing
function resizeCanvas(canvas) {
    CANVAS_WIDTH = window.innerWidth;
    CANVAS_HEIGHT = window.innerHeight;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Update position of UI elements
    RESOURCE_DISPLAY.x = CANVAS_WIDTH - 150;
    SUPPLY_DISPLAY.x = CANVAS_WIDTH - 300;
    
    // Upgrade status stays at fixed position in top-left
    
    // Make sure units stay in bounds after resize
    gameState.units.forEach(unit => {
        if (unit.x > CANVAS_WIDTH) unit.x = CANVAS_WIDTH - 50;
        if (unit.y > CANVAS_HEIGHT) unit.y = CANVAS_HEIGHT - 50;
    });
    
    // Make sure buildings stay in bounds after resize
    gameState.buildings.forEach(building => {
        if (building.x > CANVAS_WIDTH) building.x = CANVAS_WIDTH - 100;
        if (building.y > CANVAS_HEIGHT) building.y = CANVAS_HEIGHT - 100;
    });
}

// Update game state
function update() {
    // Update and filter out dead units
    gameState.units = gameState.units.filter(unit => {
        unit.update();
        unit.updateStats(); // Update unit stats
        
        // Check if unit is dead
        if (unit.currentHealth <= 0) {
            // Remove from selection if selected and not a worker that just placed building
            if (unit.selected && !(unit.type === 'WORKER' && unit.justPlacedBuilding)) {
                gameState.selectedUnits.delete(unit);
            }
            
            // Create death animation
            gameState.deathAnimations.push(new DeathAnimation(unit.x, unit.y, unit.type));
            
            // Decrease supply count
            SUPPLY_DISPLAY.current--;
            
            // Play death sound
            playSound('death');
            
            return false; // Remove from array
        }
        
        return true; // Keep in array
    });
    
    // Update and filter out destroyed buildings
    gameState.buildings = gameState.buildings.filter(building => {
        building.update();
        
        // Check if building is destroyed
        if (building.currentHealth <= 0) {
            // If this was the selected building, deselect it
            if (gameState.selectedBuilding === building) {
                gameState.selectedBuilding = null;
            }
            
            // Handle specific building type cleanup
            if (building.type === 'SUPPLY') {
                // Reduce supply limit
                SUPPLY_DISPLAY.maximum -= BUILDING_TYPES.SUPPLY.supplyProvided;
            }
            
            // Create building destruction effect
            // For now, just add some death animations at the building's corners
            const corners = [
                { x: building.x - building.width/3, y: building.y - building.height/3 },
                { x: building.x + building.width/3, y: building.y - building.height/3 },
                { x: building.x - building.width/3, y: building.y + building.height/3 },
                { x: building.x + building.width/3, y: building.y + building.height/3 }
            ];
            
            corners.forEach(pos => {
                gameState.deathAnimations.push(new DeathAnimation(pos.x, pos.y, 'MARINE'));
            });
            
            // Play destruction sound
            playSound('buildingDestroyed');
            
            return false; // Remove from array
        }
        
        return true; // Keep in array
    });
    
    // Process shield tower effects
    // First reset all shield effects
    gameState.units.forEach(unit => {
        unit.removeShieldEffect();
    });
    
    // Then reapply for units in range of shield towers
    const shieldTowers = gameState.buildings.filter(building => building.type === 'SHIELD');
    if (shieldTowers.length > 0) {
        shieldTowers.forEach(tower => {
            gameState.units.forEach(unit => {
                if (tower.isUnitInShieldRadius(unit)) {
                    unit.applyShieldEffect();
                }
            });
        });
    }
    
    // Update resource income
    gameState.resourceTimer++;
    if (gameState.resourceTimer >= gameState.resourceIncomeInterval) {
        // Add resources
        UPGRADE_MENU.resources += gameState.resourceIncomeAmount;
        
        // Reset timer
        gameState.resourceTimer = 0;
        
        // Visual feedback for resource income
        addResourceIncomeIndicator();
    }
    
    // Update target indicators
    gameState.targetIndicators = gameState.targetIndicators.filter(indicator => indicator.update());
    
    // Update death animations
    gameState.deathAnimations = gameState.deathAnimations.filter(animation => animation.update());
    
    // Update hotkey group status
    updateHotkeyGroupStatus();
    
    // Update stats display visibility - ALWAYS visible if we have selected units
    // This ensures it doesn't get accidentally turned off
    STATS_DISPLAY.visible = gameState.selectedUnits.size > 0;
    
    // Update building stats visibility
    BUILDING_STATS.visible = gameState.selectedBuilding !== null;
    
    // If connected in multiplayer mode and we're the host, send updates
    if (multiplayer.isConnected && multiplayer.isHost) {
        // We'll let the interval in multiplayer.js handle this
        // This avoids sending too many updates and flooding the connection
    }
}

// Draw game
function draw(ctx) {
    // Clear canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
    }

    // Draw buildings
    gameState.buildings.forEach(building => building.draw(ctx));

    // Draw unit paths for selected units
    gameState.units.forEach(unit => {
        if (unit.selected) {
            unit.drawPath(ctx);
        }
    });

    // Draw target indicators
    gameState.targetIndicators.forEach(indicator => indicator.draw(ctx));
    
    // Draw death animations
    gameState.deathAnimations.forEach(animation => animation.draw(ctx));

    // Draw units
    gameState.units.forEach(unit => unit.draw(ctx));

    // Draw selection box
    if (gameState.isDragging) {
        // Selection box fill
        ctx.fillStyle = 'rgba(46, 204, 113, 0.1)';
        ctx.fillRect(
            gameState.dragStart.x,
            gameState.dragStart.y,
            gameState.mouse.x - gameState.dragStart.x,
            gameState.mouse.y - gameState.dragStart.y
        );
        
        // Selection box border
        ctx.strokeStyle = 'rgba(46, 204, 113, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            gameState.dragStart.x,
            gameState.dragStart.y,
            gameState.mouse.x - gameState.dragStart.x,
            gameState.mouse.y - gameState.dragStart.y
        );
    }

    // Draw formation preview on right-click drag
    if (gameState.rightMouseDown && gameState.selectedUnits.size > 0) {
        drawFormationPreview(ctx);
    }
    
    // Draw resource counter in top right
    drawResourceCounter(ctx);
    
    // Draw supply counter in top right
    drawSupplyCounter(ctx);
    
    // Draw upgrade status in top left (always visible)
    drawUpgradeStatus(ctx);
    
    // Draw hotkey groups
    drawHotkeyGroups(ctx);
    
    // Draw building stats if a building is selected
    if (BUILDING_STATS.visible) {
        drawBuildingStatsDisplay(ctx);
    }
    
    // Draw unit stats display if units are selected
    if (STATS_DISPLAY.visible) {
        drawUnitStatsDisplay(ctx);
    }
    
    // Draw upgrade menu
    if (UPGRADE_MENU.visible) {
        drawUpgradeMenu(ctx);
    }
    
    // Draw pending building if one exists
    if (gameState.pendingBuilding) {
        drawPendingBuilding(ctx);
    }
}

function drawResourceCounter(ctx) {
    const display = RESOURCE_DISPLAY;
    
    // Draw background
    ctx.fillStyle = 'rgba(25, 25, 25, 0.7)';
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;
    ctx.fillRect(display.x, display.y - display.height, display.width, display.height);
    ctx.strokeRect(display.x, display.y - display.height, display.width, display.height);
    
    // Draw text
    ctx.fillStyle = '#ecf0f1';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Resources: ${UPGRADE_MENU.resources}`, display.x + display.width - 10, display.y - 8);
}

function drawSupplyCounter(ctx) {
    const display = SUPPLY_DISPLAY;
    
    // Draw background
    ctx.fillStyle = 'rgba(25, 25, 25, 0.7)';
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;
    ctx.fillRect(display.x, display.y - display.height, display.width, display.height);
    ctx.strokeRect(display.x, display.y - display.height, display.width, display.height);
    
    // Draw text
    ctx.fillStyle = '#ecf0f1';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Supply: ${SUPPLY_DISPLAY.current}/${SUPPLY_DISPLAY.maximum}`, display.x + display.width - 10, display.y - 8);
}

function drawUpgradeMenu(ctx) {
    const menu = UPGRADE_MENU;
    
    // Calculate grid values first
    const gridWidth = menu.cellSize * menu.gridCols;
    const gridHeight = menu.cellSize * menu.gridRows;
    
    // Calculate menu position based on grid size
    const menuX = CANVAS_WIDTH - gridWidth - menu.padding * 2;
    const menuY = CANVAS_HEIGHT - gridHeight - menu.padding * 2;
    const menuWidth = gridWidth + menu.padding * 2;
    const menuHeight = gridHeight + menu.padding * 2;
    
    // Draw menu background
    ctx.fillStyle = 'rgba(25, 25, 25, 0.85)';
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;
    ctx.fillRect(menuX, menuY, menuWidth, menuHeight);
    ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);
    
    // Calculate centered grid position
    const gridX = menuX + menu.padding;
    const gridY = menuY + menu.padding;
    
    // Draw grid content based on current page
    if (menu.currentPage === 'upgrades') {
        drawUpgradeGrid(ctx, gridX, gridY, menu);
    } else if (menu.currentPage === 'build') {
        drawBuildGrid(ctx, gridX, gridY, menu);
    }
    
    // Draw tooltip for hovered item
    drawMenuTooltip(ctx);
}

function drawUpgradeGrid(ctx, gridX, gridY, menu) {
    let cellIndex = 0;
    
    // Draw active upgrades
    Object.entries(UPGRADES).forEach(([key, upgrade]) => {
        const row = Math.floor(cellIndex / menu.gridCols);
        const col = cellIndex % menu.gridCols;
        
        const cellX = gridX + col * menu.cellSize;
        const cellY = gridY + row * menu.cellSize;
        const isHovered = gameState.hoveredUpgrade === key;
        
        // Draw cell background
        ctx.fillStyle = isHovered ? 'rgba(52, 152, 219, 0.3)' : 'rgba(44, 62, 80, 0.7)';
        ctx.fillRect(cellX, cellY, menu.cellSize - menu.cellPadding, menu.cellSize - menu.cellPadding);
        
        // Draw cell border
        ctx.strokeStyle = upgrade.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(cellX, cellY, menu.cellSize - menu.cellPadding, menu.cellSize - menu.cellPadding);
        
        // Draw upgrade key (abbreviation)
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(key, cellX + (menu.cellSize - menu.cellPadding) / 2, cellY + (menu.cellSize - menu.cellPadding) / 2 + 6);
        
        // Draw hotkey in the top-right corner for the first row
        if (row === 0 && upgrade.hotkey) {
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(upgrade.hotkey, cellX + menu.cellSize - menu.cellPadding - 5, cellY + 15);
        }
        
        cellIndex++;
    });
    
    // Draw placeholder cells for remaining slots
    for (let i = cellIndex; i < menu.gridCols * menu.gridRows; i++) {
        const row = Math.floor(i / menu.gridCols);
        const col = i % menu.gridCols;
        
        const cellX = gridX + col * menu.cellSize;
        const cellY = gridY + row * menu.cellSize;
        const placeholder = PLACEHOLDER_SLOTS[i - cellIndex];
        const placeholderId = placeholder ? placeholder.id : "";
        const isHovered = gameState.hoveredUpgrade === placeholderId;
        
        // Draw cell background
        ctx.fillStyle = isHovered ? 'rgba(52, 152, 219, 0.2)' : 'rgba(44, 62, 80, 0.4)';
        ctx.fillRect(cellX, cellY, menu.cellSize - menu.cellPadding, menu.cellSize - menu.cellPadding);
        
        // Draw cell border
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, menu.cellSize - menu.cellPadding, menu.cellSize - menu.cellPadding);
        
        // Draw lock icon or placeholder symbol
        ctx.fillStyle = '#576574';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("?", cellX + (menu.cellSize - menu.cellPadding) / 2, cellY + (menu.cellSize - menu.cellPadding) / 2 + 6);
    }
}

function drawBuildGrid(ctx, gridX, gridY, menu) {
    // Draw building options
    menu.buildItems.forEach((building, index) => {
        const row = Math.floor(index / menu.gridCols);
        const col = index % menu.gridCols;
        
        const cellX = gridX + col * menu.cellSize;
        const cellY = gridY + row * menu.cellSize;
        const isHovered = gameState.hoveredUpgrade === building.id;
        
        // Draw cell background
        ctx.fillStyle = isHovered ? 'rgba(52, 152, 219, 0.3)' : 'rgba(44, 62, 80, 0.7)';
        ctx.fillRect(cellX, cellY, menu.cellSize - menu.cellPadding, menu.cellSize - menu.cellPadding);
        
        // Draw cell border
        ctx.strokeStyle = building.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(cellX, cellY, menu.cellSize - menu.cellPadding, menu.cellSize - menu.cellPadding);
        
        // Draw building icon
        if (building.id === 'BUNKER') {
            // Draw a small bunker icon
            ctx.fillStyle = building.color;
            ctx.fillRect(
                cellX + (menu.cellSize - menu.cellPadding) / 2 - 8,
                cellY + (menu.cellSize - menu.cellPadding) / 2 - 8,
                16, 16
            );
        } else if (building.id === 'SUPPLY') {
            // Draw supply depot icon
            ctx.fillStyle = building.color;
            ctx.beginPath();
            ctx.moveTo(cellX + (menu.cellSize - menu.cellPadding) / 2, cellY + (menu.cellSize - menu.cellPadding) / 2 - 8);
            ctx.lineTo(cellX + (menu.cellSize - menu.cellPadding) / 2 + 8, cellY + (menu.cellSize - menu.cellPadding) / 2);
            ctx.lineTo(cellX + (menu.cellSize - menu.cellPadding) / 2, cellY + (menu.cellSize - menu.cellPadding) / 2 + 8);
            ctx.lineTo(cellX + (menu.cellSize - menu.cellPadding) / 2 - 8, cellY + (menu.cellSize - menu.cellPadding) / 2);
            ctx.closePath();
            ctx.fill();
        } else if (building.id === 'SHIELD') {
            // Draw shield tower icon
            ctx.fillStyle = building.color;
            ctx.beginPath();
            ctx.arc(cellX + (menu.cellSize - menu.cellPadding) / 2, cellY + (menu.cellSize - menu.cellPadding) / 2, 16, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cellX + (menu.cellSize - menu.cellPadding) / 2 - 8, cellY + (menu.cellSize - menu.cellPadding) / 2 - 8);
            ctx.lineTo(cellX + (menu.cellSize - menu.cellPadding) / 2 + 8, cellY + (menu.cellSize - menu.cellPadding) / 2 - 8);
            ctx.lineTo(cellX + (menu.cellSize - menu.cellPadding) / 2 + 8, cellY + (menu.cellSize - menu.cellPadding) / 2 + 8);
            ctx.lineTo(cellX + (menu.cellSize - menu.cellPadding) / 2 - 8, cellY + (menu.cellSize - menu.cellPadding) / 2 + 8);
            ctx.closePath();
            ctx.stroke();
        } else if (building.id === 'SENSOR') {
            // Draw sensor tower icon
            ctx.fillStyle = building.color;
            ctx.beginPath();
            ctx.arc(cellX + (menu.cellSize - menu.cellPadding) / 2, cellY + (menu.cellSize - menu.cellPadding) / 2, 16, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cellX + (menu.cellSize - menu.cellPadding) / 2 - 8, cellY + (menu.cellSize - menu.cellPadding) / 2 - 8);
            ctx.lineTo(cellX + (menu.cellSize - menu.cellPadding) / 2 + 8, cellY + (menu.cellSize - menu.cellPadding) / 2 - 8);
            ctx.lineTo(cellX + (menu.cellSize - menu.cellPadding) / 2 + 8, cellY + (menu.cellSize - menu.cellPadding) / 2 + 8);
            ctx.lineTo(cellX + (menu.cellSize - menu.cellPadding) / 2 - 8, cellY + (menu.cellSize - menu.cellPadding) / 2 + 8);
            ctx.closePath();
            ctx.stroke();
        } else if (building.id === 'TANK') {
            // Draw tank icon (simple rectangle)
            ctx.fillStyle = building.color;
            
            // Tank body (rectangular shape)
            ctx.fillRect(
                cellX + (menu.cellSize - menu.cellPadding) / 2 - 12,
                cellY + (menu.cellSize - menu.cellPadding) / 2 - 6,
                24, 12
            );
        } else {
            // Draw placeholder icon
            ctx.fillStyle = '#576574';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText("?", cellX + (menu.cellSize - menu.cellPadding) / 2, cellY + (menu.cellSize - menu.cellPadding) / 2 + 6);
        }
        
        // Draw hotkey in the top-right corner for the first row
        if (row === 0 && building.hotkey) {
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = '#ecf0f1';
            ctx.textAlign = 'right';
            ctx.fillText(building.hotkey, cellX + menu.cellSize - menu.cellPadding - 5, cellY + 15);
        }
        
        // Draw cost if applicable
        if (building.cost) {
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = UPGRADE_MENU.resources >= building.cost ? '#2ecc71' : '#e74c3c';
            ctx.fillText(`${building.cost}`, cellX + (menu.cellSize - menu.cellPadding) / 2, cellY + menu.cellSize - menu.cellPadding - 5);
        }
    });
    
    // Draw placeholder cells for remaining slots
    for (let i = menu.buildItems.length; i < menu.gridCols * menu.gridRows; i++) {
        const row = Math.floor(i / menu.gridCols);
        const col = i % menu.gridCols;
        
        const cellX = gridX + col * menu.cellSize;
        const cellY = gridY + row * menu.cellSize;
        
        // Draw cell background
        ctx.fillStyle = 'rgba(44, 62, 80, 0.4)';
        ctx.fillRect(cellX, cellY, menu.cellSize - menu.cellPadding, menu.cellSize - menu.cellPadding);
        
        // Draw cell border
        ctx.strokeStyle = '#34495e';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, menu.cellSize - menu.cellPadding, menu.cellSize - menu.cellPadding);
        
        // Draw placeholder symbol
        ctx.fillStyle = '#576574';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("?", cellX + (menu.cellSize - menu.cellPadding) / 2, cellY + (menu.cellSize - menu.cellPadding) / 2 + 6);
    }
}

function drawMenuTooltip(ctx) {
    if (!gameState.hoveredUpgrade) return;
    
    let tooltipData;
    
    if (UPGRADE_MENU.currentPage === 'upgrades') {
        // Check if it's a real upgrade or placeholder
        if (UPGRADES[gameState.hoveredUpgrade]) {
            tooltipData = UPGRADES[gameState.hoveredUpgrade];
        } else {
            // Find in placeholders
            tooltipData = PLACEHOLDER_SLOTS.find(p => p.id === gameState.hoveredUpgrade);
        }
    } else if (UPGRADE_MENU.currentPage === 'build') {
        // Find in build items
        tooltipData = UPGRADE_MENU.buildItems.find(b => b.id === gameState.hoveredUpgrade);
    }
    
    if (tooltipData) {
        const tooltipX = gameState.mouse.x + 15;
        const tooltipY = gameState.mouse.y - 15;
        const tooltipWidth = 180;
        const tooltipHeight = 70;
        
        // Draw tooltip background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        ctx.strokeStyle = tooltipData.color || '#34495e';
        ctx.lineWidth = 1;
        ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        
        // Draw tooltip content
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(tooltipData.name, tooltipX + 10, tooltipY + 20);
        
        ctx.font = '12px Arial';
        ctx.fillText(tooltipData.description, tooltipX + 10, tooltipY + 40);
        
        if (tooltipData.cost !== undefined) {
            if (tooltipData.level !== undefined) {
                ctx.fillText(`Cost: ${tooltipData.cost} | Level: ${tooltipData.level}/${tooltipData.maxLevel}`, tooltipX + 10, tooltipY + 60);
            } else {
                ctx.fillText(`Cost: ${tooltipData.cost}`, tooltipX + 10, tooltipY + 60);
            }
        } else {
            ctx.fillText("Future upgrade slot", tooltipX + 10, tooltipY + 60);
        }
    }
}

function isPointInUpgradeMenu(x, y) {
    const menu = UPGRADE_MENU;
    
    // Calculate grid dimensions
    const gridWidth = menu.cellSize * menu.gridCols;
    const gridHeight = menu.cellSize * menu.gridRows;
    
    // Calculate menu position
    const menuX = CANVAS_WIDTH - gridWidth - menu.padding * 2;
    const menuY = CANVAS_HEIGHT - gridHeight - menu.padding * 2;
    const menuWidth = gridWidth + menu.padding * 2;
    const menuHeight = gridHeight + menu.padding * 2;
    
    return x >= menuX && x <= menuX + menuWidth && 
           y >= menuY && y <= menuY + menuHeight;
}

function getHoveredUpgradeKey(x, y) {
    const menu = UPGRADE_MENU;
    
    // Calculate grid dimensions
    const gridWidth = menu.cellSize * menu.gridCols;
    const gridHeight = menu.cellSize * menu.gridRows;
    
    // Calculate menu and grid position
    const menuX = CANVAS_WIDTH - gridWidth - menu.padding * 2;
    const menuY = CANVAS_HEIGHT - gridHeight - menu.padding * 2;
    const gridX = menuX + menu.padding;
    const gridY = menuY + menu.padding;
    
    // Check if point is in the grid area
    if (x < gridX || x > gridX + gridWidth || 
        y < gridY || y > gridY + gridHeight) {
        return null;
    }
    
    // Calculate which cell was clicked
    const col = Math.floor((x - gridX) / menu.cellSize);
    const row = Math.floor((y - gridY) / menu.cellSize);
    const index = row * menu.gridCols + col;
    
    // Get item key based on menu page and position
    if (menu.currentPage === 'upgrades') {
        // Get upgrade key based on position
        const upgradeKeys = Object.keys(UPGRADES);
        
        if (index < upgradeKeys.length) {
            return upgradeKeys[index];
        } else if (index < menu.gridCols * menu.gridRows) {
            // Return placeholder ID
            return PLACEHOLDER_SLOTS[index - upgradeKeys.length].id;
        }
    } else if (menu.currentPage === 'build') {
        // Get building key based on position
        if (index < menu.buildItems.length) {
            return menu.buildItems[index].id;
        }
    }
    
    return null;
}

function purchaseUpgrade(upgradeKey) {
    const upgrade = UPGRADES[upgradeKey];
    
    // Check if upgrade is at max level
    if (upgrade.level >= upgrade.maxLevel) {
        return false;
    }
    
    // Check if player has enough resources
    if (UPGRADE_MENU.resources < upgrade.cost) {
        return false;
    }
    
    // Purchase upgrade
    UPGRADE_MENU.resources -= upgrade.cost;
    upgrade.level++;
    
    // Apply upgrade to all units
    applyUpgradesToUnits();
    
    return true;
}

function applyUpgradesToUnits() {
    gameState.units.forEach(unit => {
        // Apply upgrades to unit stats through the updateStats method
        unit.updateStats();
    });
}

function drawFormationPreview(ctx) {
    if (gameState.selectedUnits.size === 0) return;
    
    const positions = calculateFormationPositions();
    
    ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
    positions.forEach(pos => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw lines connecting current positions to formation positions
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    let i = 0;
    gameState.selectedUnits.forEach(unit => {
        if (i < positions.length) {
            ctx.beginPath();
            ctx.moveTo(unit.x, unit.y);
            ctx.lineTo(positions[i].x, positions[i].y);
            ctx.stroke();
            i++;
        }
    });
}

// New function to draw hotkey groups
function drawHotkeyGroups(ctx) {
    const menu = UPGRADE_MENU;
    const groups = HOTKEY_GROUPS;
    
    // Calculate menu position and dimensions
    const gridWidth = menu.cellSize * menu.gridCols;
    const gridHeight = menu.cellSize * menu.gridRows;
    const menuX = CANVAS_WIDTH - gridWidth - menu.padding * 2;
    const menuY = CANVAS_HEIGHT - gridHeight - menu.padding * 2;
    const menuWidth = gridWidth + menu.padding * 2;
    
    // Increase the height of the hotkey groups panel (still needed for positioning calculations)
    groups.height = 60;
    
    // Update hotkey groups position to match menu width and position
    groups.width = menuWidth;
    groups.x = menuX;
    groups.y = menuY - groups.height - 5;
    
    // Remove background panel drawing code
    
    // Draw each group indicator
    const cellPadding = 5; // Consistent padding
    const availableWidth = groups.width - (groups.padding * 2);
    
    // Calculate the original button width
    const originalGroupWidth = (availableWidth - (groups.spacing * (groups.groups.length - 1))) / groups.groups.length;
    // Reduce button size by 10%
    const groupWidth = originalGroupWidth * 0.9;
    
    groups.groups.forEach((group, index) => {
        // Adjust the x position to maintain even spacing with the smaller buttons
        const totalButtonsWidth = groupWidth * groups.groups.length;
        const totalSpacingWidth = groups.spacing * (groups.groups.length - 1);
        const leftMargin = (availableWidth - (totalButtonsWidth + totalSpacingWidth)) / 2;
        
        const x = groups.x + groups.padding + leftMargin + (groupWidth + groups.spacing) * index;
        // Center the buttons vertically within the taller panel
        const y = groups.y + (groups.height - groupWidth) / 2;
        const height = groupWidth;
        
        // Group background
        ctx.fillStyle = group.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(x, y, groupWidth, height);
        
        // Group border
        ctx.strokeStyle = group.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, groupWidth, height);
        
        // Group number
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(group.key, x + groupWidth / 2, y + height / 2 + 6);
    });
}

// Function to update hotkey group status
function updateHotkeyGroupStatus() {
    // Set active status based on current selections
    HOTKEY_GROUPS.groups.forEach(group => {
        group.active = false;
    });
    
    // Group 1 - All Marines
    if (gameState.selectedUnits.size > 0) {
        let allMarines = true;
        let anyMarines = false;
        
        gameState.selectedUnits.forEach(unit => {
            if (unit.type === 'MARINE') {
                anyMarines = true;
            } else {
                allMarines = false;
            }
        });
        
        if (allMarines && anyMarines) {
            HOTKEY_GROUPS.groups[0].active = true;
        }
    }
    
    // Group 2 - All Bunkers
    if (gameState.selectedBuilding && gameState.selectedBuilding.type === 'BUNKER') {
        HOTKEY_GROUPS.groups[1].active = true;
    }
    
    // Group 3 - All Workers & Build Menu
    if (gameState.selectedUnits.size > 0) {
        let allWorkers = true;
        let anyWorkers = false;
        
        gameState.selectedUnits.forEach(unit => {
            if (unit.type === 'WORKER') {
                anyWorkers = true;
            } else {
                allWorkers = false;
            }
        });
        
        if (allWorkers && anyWorkers) {
            HOTKEY_GROUPS.groups[2].active = true;
            
            // Also highlight if build menu is open
            if (UPGRADE_MENU.visible && UPGRADE_MENU.currentPage === 'build') {
                HOTKEY_GROUPS.groups[2].active = true;
            }
        }
    }
    
    // Group 4 - Upgrade Menu
    if (UPGRADE_MENU.visible && UPGRADE_MENU.currentPage === 'upgrades') {
        HOTKEY_GROUPS.groups[3].active = true;
    }
}

// Event handlers
function handleMouseDown(e) {
    const rect = e.target.getBoundingClientRect();
    gameState.mouse.x = e.clientX - rect.left;
    gameState.mouse.y = e.clientY - rect.top;
    
    if (e.button === 2) { // Right mouse button
        gameState.rightMouseDown = true;
        
        // Set rally point if a building is selected
        if (gameState.selectedBuilding && gameState.selectedBuilding.type === 'BUNKER') {
            // Find all selected bunkers and set rally point for all of them
            const selectedBunkers = gameState.buildings.filter(b => b.selected && b.type === 'BUNKER');
            selectedBunkers.forEach(bunker => {
                bunker.setRallyPoint(gameState.mouse.x, gameState.mouse.y);
            });
            
            // Only create one visual indicator
            gameState.targetIndicators.push(new TargetIndicator(gameState.mouse.x, gameState.mouse.y));
            playSound('rallyPoint');
            return;
        }
        
        // Cancel pending building
        if (gameState.pendingBuilding) {
            gameState.pendingBuilding = null;
            return;
        }
        
        return;
    }
    
    // Store current selected units before any potential deselection
    const hadSelectedWorkers = hasWorkerSelected();
    
    // Place a pending building if one exists
    if (gameState.pendingBuilding && e.button === 0) {
        placePendingBuilding();
        // CRITICAL: Skip all further selection logic after placing a building
        // This prevents the click from being interpreted as a click in empty space
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    
    // Check if clicking in the upgrade menu
    if (UPGRADE_MENU.visible && isPointInUpgradeMenu(gameState.mouse.x, gameState.mouse.y)) {
        const itemKey = getHoveredUpgradeKey(gameState.mouse.x, gameState.mouse.y);
        
        if (UPGRADE_MENU.currentPage === 'upgrades' && itemKey && UPGRADES[itemKey]) {
            purchaseUpgrade(itemKey);
        } else if (UPGRADE_MENU.currentPage === 'build' && itemKey) {
            const building = UPGRADE_MENU.buildItems.find(b => b.id === itemKey);
            if (building && hasWorkerSelected()) {
                startBuildingPlacement(building.id);
            }
        }
        return;
    }
    
    // Check if clicking on a building
    const clickedBuilding = gameState.buildings.find(building => 
        building.isPointInside(gameState.mouse.x, gameState.mouse.y)
    );
    
    if (clickedBuilding) {
        // Deselect all units
        gameState.units.forEach(unit => unit.selected = false);
        gameState.selectedUnits.clear();
        
        // Deselect all buildings
        gameState.buildings.forEach(building => building.selected = false);
        
        // Select clicked building
        clickedBuilding.selected = true;
        gameState.selectedBuilding = clickedBuilding;
        
        // Play selection sound
        playSound('select');
        
        return;
    }
    
    // Check if clicking on a unit
    const clickedUnit = gameState.units.find(unit => unit.isPointInside(gameState.mouse.x, gameState.mouse.y));
    
    if (clickedUnit) {
        // Deselect ALL buildings, not just the main selected one
        gameState.buildings.forEach(building => building.selected = false);
        gameState.selectedBuilding = null;
        
        if (!e.shiftKey) {
            gameState.units.forEach(unit => unit.selected = false);
            gameState.selectedUnits.clear();
        }
        clickedUnit.selected = true;
        gameState.selectedUnits.add(clickedUnit);
        
        // Play selection sound
        playSound('select');
    } else {
        // Clicking in empty space
        // Deselect ALL buildings, not just the main selected one
        if (!e.shiftKey) {
            gameState.buildings.forEach(building => building.selected = false);
            gameState.selectedBuilding = null;
        }
        
        gameState.isDragging = true;
        gameState.dragStart.x = gameState.mouse.x;
        gameState.dragStart.y = gameState.mouse.y;
        if (!e.shiftKey) {
            gameState.units.forEach(unit => unit.selected = false);
            gameState.selectedUnits.clear();
        }
    }
    
    // If in multiplayer mode and we're the host, sync after significant actions
    if (multiplayer.isConnected && multiplayer.isHost) {
        // Only sync after important actions to avoid flooding the connection
        if (e.button === 0 && !gameState.isDragging) { // Left click without dragging
            // Send immediate update after a selection change
            multiplayer.sendGameState();
        }
    }
}

function handleMouseMove(e) {
    const rect = e.target.getBoundingClientRect();
    gameState.mouse.x = e.clientX - rect.left;
    gameState.mouse.y = e.clientY - rect.top;
    
    // Update unit hover state
    gameState.units.forEach(unit => {
        unit.hovered = unit.isPointInside(gameState.mouse.x, gameState.mouse.y);
    });
    
    // Update building hover state
    gameState.buildings.forEach(building => {
        building.hovered = building.isPointInside(gameState.mouse.x, gameState.mouse.y);
    });
    
    // Update upgrade menu hover state
    if (UPGRADE_MENU.visible) {
        gameState.uiState.isUpgradeMenuHovered = isPointInUpgradeMenu(gameState.mouse.x, gameState.mouse.y);
        
        if (gameState.uiState.isUpgradeMenuHovered) {
            gameState.hoveredUpgrade = getHoveredUpgradeKey(gameState.mouse.x, gameState.mouse.y);
        } else {
            gameState.hoveredUpgrade = null;
        }
    } else {
        gameState.uiState.isUpgradeMenuHovered = false;
        gameState.hoveredUpgrade = null;
    }
}

function handleMouseUp(e) {
    if (e.button === 2) { // Right mouse button
        gameState.rightMouseDown = false;
        if (gameState.selectedUnits.size > 0) {
            const positions = calculateFormationPositions();
            moveUnitsInFormation(positions);
            
            // Add a target indicator
            gameState.targetIndicators.push(new TargetIndicator(gameState.mouse.x, gameState.mouse.y));
            
            // Play move sound
            playSound('move');
        }
        return;
    }
    
    // Skip all deselection logic if we just placed a building
    // This is important because the mouseup event might trigger deselection
    if (document.placedBuildingThisTick) {
        document.placedBuildingThisTick = false;
        return;
    }
    
    if (gameState.isDragging) {
        // Select units within the selection box
        const left = Math.min(gameState.dragStart.x, gameState.mouse.x);
        const right = Math.max(gameState.dragStart.x, gameState.mouse.x);
        const top = Math.min(gameState.dragStart.y, gameState.mouse.y);
        const bottom = Math.max(gameState.dragStart.y, gameState.mouse.y);

        let unitsSelected = false;
        gameState.units.forEach(unit => {
            if (unit.x >= left && unit.x <= right && unit.y >= top && unit.y <= bottom) {
                unit.selected = true;
                gameState.selectedUnits.add(unit);
                unitsSelected = true;
            }
        });
        
        if (unitsSelected) {
            // Play selection sound
            playSound('select');
        }
    } else if (e.button === 0) { // Left click when not dragging
        // Don't deselect if clicked in UI
        if (!gameState.uiState.isUpgradeMenuHovered) {
            const clickedUnit = gameState.units.find(unit => unit.isPointInside(gameState.mouse.x, gameState.mouse.y));
            if (!clickedUnit && !e.shiftKey) { // If clicked empty space and not holding shift
                // CRITICAL: Don't deselect units if we just placed a building
                if (!gameState.units.some(unit => unit.justPlacedBuilding)) {
                    // Deselect all units
                    gameState.units.forEach(unit => unit.selected = false);
                    gameState.selectedUnits.clear();
                }
            }
        }
    }
    
    gameState.isDragging = false;
    
    // If in multiplayer mode and we're the host, sync after selection changes
    if (multiplayer.isConnected && multiplayer.isHost) {
        if (gameState.isDragging) {
            // Send immediate update after a drag selection
            multiplayer.sendGameState();
        }
    }
}

function handleRightClick(e) {
    e.preventDefault(); // Prevent context menu from appearing
    
    // If in multiplayer mode and we're the host, sync after movement commands
    if (multiplayer.isConnected && multiplayer.isHost) {
        // Send update after unit movement orders
        if (gameState.selectedUnits.size > 0) {
            // Use slight delay to ensure the movement calculation is done
            setTimeout(() => {
                multiplayer.sendGameState();
            }, 50);
        }
    }
    
    return false;
}

function handleMouseWheel(e) {
    // Check if cursor is over the unit stats display
    if (STATS_DISPLAY.visible) {
        const groups = HOTKEY_GROUPS;
        const gridWidth = UPGRADE_MENU.cellSize * UPGRADE_MENU.gridCols;
        const menuX = CANVAS_WIDTH - gridWidth - UPGRADE_MENU.padding * 2;
        const displayX = menuX - STATS_DISPLAY.width - 10;
        const displayY = groups.y;
        
        const isOverUnitStats = 
            gameState.mouse.x >= displayX && 
            gameState.mouse.x <= displayX + STATS_DISPLAY.width &&
            gameState.mouse.y >= displayY && 
            gameState.mouse.y <= displayY + STATS_DISPLAY.height;
            
        if (isOverUnitStats) {
            // Scroll the unit stats (positive delta = scroll down)
            const scrollAmount = e.deltaY > 0 ? STATS_DISPLAY.scrollSpeed : -STATS_DISPLAY.scrollSpeed;
            
            // Ensure we can scroll all the way to see the bottom content
            // Increase the buffer from 40px to 80px to ensure the bottom content is fully visible
            STATS_DISPLAY.scroll = Math.max(0, Math.min(STATS_DISPLAY.maxScroll + 80, STATS_DISPLAY.scroll + scrollAmount));
            e.preventDefault();
            return;
        }
    }
    
    // Check if cursor is over the building stats display
    if (BUILDING_STATS.visible) {
        const groups = HOTKEY_GROUPS;
        const gridWidth = UPGRADE_MENU.cellSize * UPGRADE_MENU.gridCols;
        const menuX = CANVAS_WIDTH - gridWidth - UPGRADE_MENU.padding * 2;
        const displayX = menuX - BUILDING_STATS.width - 10;
        const displayY = groups.y;
        
        const isOverBuildingStats = 
            gameState.mouse.x >= displayX && 
            gameState.mouse.x <= displayX + BUILDING_STATS.width &&
            gameState.mouse.y >= displayY && 
            gameState.mouse.y <= displayY + BUILDING_STATS.height;
            
        if (isOverBuildingStats) {
            // Scroll the building stats
            const scrollAmount = e.deltaY > 0 ? BUILDING_STATS.scrollSpeed : -BUILDING_STATS.scrollSpeed;
            
            // Ensure we can scroll all the way to see the bottom content
            // Add a larger buffer (40px) to ensure the bottom content is fully visible
            BUILDING_STATS.scroll = Math.max(0, Math.min(BUILDING_STATS.maxScroll + 40, BUILDING_STATS.scroll + scrollAmount));
            e.preventDefault();
            return;
        }
    }
    
    // Could be used for zooming or rotating formation (original functionality)
    e.preventDefault();
}

function calculateFormationPositions() {
    const count = gameState.selectedUnits.size;
    const positions = [];
    
    if (count === 0) return positions;
    
    // Formation types based on unit count
    if (count === 1) {
        positions.push({ x: gameState.mouse.x, y: gameState.mouse.y });
    } else if (count <= 5) {
        // Line formation
        const lineWidth = (count - 1) * 30;
        for (let i = 0; i < count; i++) {
            positions.push({
                x: gameState.mouse.x - lineWidth/2 + i * 30,
                y: gameState.mouse.y
            });
        }
    } else {
        // Grid formation
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const gridWidth = (cols - 1) * 30;
        const gridHeight = (rows - 1) * 30;
        
        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            positions.push({
                x: gameState.mouse.x - gridWidth/2 + col * 30,
                y: gameState.mouse.y - gridHeight/2 + row * 30
            });
        }
    }
    
    return positions;
}

function moveUnitsInFormation(positions) {
    let i = 0;
    gameState.selectedUnits.forEach(unit => {
        if (i < positions.length) {
            unit.targetX = positions[i].x;
            unit.targetY = positions[i].y;
            
            // Create a simple path
            unit.path = [{
                x: positions[i].x,
                y: positions[i].y
            }];
            
            i++;
        }
    });
}

// Simple sound system
function playSound(type) {
    // In a full implementation, this would play actual sounds
    // For now, we'll just console.log
    console.log(`Playing ${type} sound`);
}

// Event handlers for keyboard
function handleKeyDown(e) {
    // Track Control key for potential multi-key hotkeys
    if (e.key === 'Control') {
        gameState.hotkeys.isCtrlDown = true;
    }
    
    // Build menu hotkeys - only active when build menu is open
    if (UPGRADE_MENU.visible && UPGRADE_MENU.currentPage === 'build') {
        // Check if the pressed key matches any building hotkey
        const key = e.key.toUpperCase();
        const buildItem = UPGRADE_MENU.buildItems.find(item => item.hotkey === key);
        
        if (buildItem && hasWorkerSelected()) {
            startBuildingPlacement(buildItem.id);
            return;
        }
    }
    
    // Number key hotkeys - Selection and Menu Toggle
    if (e.key === '1') {
        selectAllUnits();
    } else if (e.key === '2') {
        selectAllBunkers();
    } else if (e.key === '3') {
        // Select all workers first
        selectAllWorkers();
        
        // If we have workers selected after the selection, open the build menu
        if (hasWorkerSelected()) {
            UPGRADE_MENU.visible = true;
            UPGRADE_MENU.currentPage = 'build';
        }
    } else if (e.key === '4') {
        // Show upgrade menu
        UPGRADE_MENU.visible = true;
        UPGRADE_MENU.currentPage = 'upgrades';
    } else if (e.key === 'Escape') {
        // Close any open menu
        UPGRADE_MENU.visible = false;
        // Cancel pending building
        if (gameState.pendingBuilding) {
            gameState.pendingBuilding = null;
        }
    } 
    // Letter hotkeys for upgrades - only active when upgrade menu is open or no menu is open
    else if (!UPGRADE_MENU.visible || UPGRADE_MENU.currentPage === 'upgrades') {
        if (e.key.toLowerCase() === 'q') {
            purchaseUpgradeByHotkey('AR');
        } else if (e.key.toLowerCase() === 'w') {
            purchaseUpgradeByHotkey('AD');
        } else if (e.key.toLowerCase() === 'e') {
            purchaseUpgradeByHotkey('WR');
        } else if (e.key.toLowerCase() === 'r') {
            purchaseUpgradeByHotkey('HR');
        } else if (e.key.toLowerCase() === 't') {
            purchaseUpgradeByHotkey('MS');
        }
    }
    
    // Testing hotkeys - always active
    if (e.key === 'x') {
        // Test damage on selected units or building
        if (gameState.selectedUnits.size > 0) {
            // Get a copy of the selected units since we'll be removing them
            const selectedUnitsCopy = Array.from(gameState.selectedUnits);
            
            // Apply damage to each unit
            selectedUnitsCopy.forEach(unit => {
                // Apply damage and check if the unit died
                const unitDied = unit.takeDamage(40); // Increased damage for more effective testing
                
                // If the unit died, handle death immediately
                if (unitDied) {
                    // Remove from selection
                    gameState.selectedUnits.delete(unit);
                    
                    // Remove from game state
                    const unitIndex = gameState.units.indexOf(unit);
                    if (unitIndex !== -1) {
                        gameState.units.splice(unitIndex, 1);
                    }
                    
                    // Create death animation
                    gameState.deathAnimations.push(new DeathAnimation(unit.x, unit.y, unit.type));
                    
                    // Decrease supply count
                    SUPPLY_DISPLAY.current--;
                    
                    // Play death sound
                    playSound('death');
                }
            });
            
            // Play hit sound
            playSound('hit');
        } else if (gameState.selectedBuilding) {
            // Damage building
            const buildingDestroyed = gameState.selectedBuilding.takeDamage(50);
            
            // If building was destroyed, handle it immediately
            if (buildingDestroyed) {
                // If this was the selected building, deselect it
                gameState.selectedBuilding = null;
                
                // Find and remove the building
                const building = gameState.selectedBuilding;
                const buildingIndex = gameState.buildings.indexOf(building);
                if (buildingIndex !== -1) {
                    // Handle specific building type cleanup before removal
                    if (building.type === 'SUPPLY') {
                        // Reduce supply limit
                        SUPPLY_DISPLAY.maximum -= BUILDING_TYPES.SUPPLY.supplyProvided;
                    }
                    
                    // Remove the building
                    gameState.buildings.splice(buildingIndex, 1);
                    
                    // Create building destruction effect
                    const corners = [
                        { x: building.x - building.width/3, y: building.y - building.height/3 },
                        { x: building.x + building.width/3, y: building.y - building.height/3 },
                        { x: building.x - building.width/3, y: building.y + building.height/3 },
                        { x: building.x + building.width/3, y: building.y + building.height/3 }
                    ];
                    
                    corners.forEach(pos => {
                        gameState.deathAnimations.push(new DeathAnimation(pos.x, pos.y, 'MARINE'));
                    });
                    
                    // Play destruction sound
                    playSound('buildingDestroyed');
                }
            }
            
            // Play hit sound
            playSound('hit');
        }
    } else if (e.key === 'h') {
        // Test healing on selected units or building
        if (gameState.selectedUnits.size > 0) {
            // Heal units
            gameState.selectedUnits.forEach(unit => {
                unit.heal(20);
            });
            // Play heal sound
            playSound('heal');
        } else if (gameState.selectedBuilding) {
            // Heal building
            gameState.selectedBuilding.heal(50);
            // Play heal sound
            playSound('heal');
        }
    }
}

function handleKeyUp(e) {
    if (e.key === 'Control') {
        gameState.hotkeys.isCtrlDown = false;
    }
}

function selectAllUnits() {
    // Deselect all buildings, not just the primary selected one
    gameState.buildings.forEach(building => building.selected = false);
    gameState.selectedBuilding = null;
    
    // Clear previous unit selection
    gameState.units.forEach(unit => unit.selected = false);
    gameState.selectedUnits.clear();
    
    // Select only MARINE units (not workers)
    const marines = gameState.units.filter(unit => unit.type === 'MARINE');
    marines.forEach(marine => {
        marine.selected = true;
        gameState.selectedUnits.add(marine);
    });
    
    if (marines.length > 0) {
        playSound('select');
    }
}

function selectAllBunkers() {
    // Deselect units
    gameState.units.forEach(unit => unit.selected = false);
    gameState.selectedUnits.clear();
    
    // Find all bunkers
    const bunkers = gameState.buildings.filter(building => building.type === 'BUNKER');
    
    // Deselect all buildings first
    gameState.buildings.forEach(building => building.selected = false);
    
    // Select only bunkers
    if (bunkers.length > 0) {
        bunkers.forEach(bunker => bunker.selected = true);
        gameState.selectedBuilding = bunkers[0]; // Select the first one as the "active" building
        playSound('select');
    }
}

function selectAllWorkers() {
    // Deselect ALL buildings, not just the primary selected one
    gameState.buildings.forEach(building => {
        building.selected = false;
    });
    gameState.selectedBuilding = null;
    
    // Clear previous selection
    gameState.units.forEach(unit => unit.selected = false);
    gameState.selectedUnits.clear();
    
    // Select all worker units
    const workers = gameState.units.filter(unit => unit.type === 'WORKER');
    workers.forEach(worker => {
        worker.selected = true;
        gameState.selectedUnits.add(worker);
    });
    
    if (workers.length > 0) {
        playSound('select');
    }
}

// New functions for building placement
function startBuildingPlacement(buildingType) {
    // Check if we have enough resources
    const building = UPGRADE_MENU.buildItems.find(b => b.id === buildingType);
    if (!building) return;
    
    if (UPGRADE_MENU.resources < building.cost) {
        console.log("Not enough resources!");
        playSound('error');
        return;
    }
    
    // Make sure we have a worker selected
    if (!hasWorkerSelected()) {
        console.log("Need a worker to build!");
        playSound('error');
        return;
    }
    
    // Create pending building
    gameState.pendingBuilding = {
        type: buildingType,
        cost: building.cost,
        width: BUILDING_TYPES[buildingType].width,
        height: BUILDING_TYPES[buildingType].height,
        valid: false
    };
    
    // Hide the menu while placing
    UPGRADE_MENU.visible = false;
}

function hasWorkerSelected() {
    let hasWorker = false;
    gameState.selectedUnits.forEach(unit => {
        if (unit.type === 'WORKER') {
            hasWorker = true;
        }
    });
    return hasWorker;
}

function drawPendingBuilding(ctx) {
    const building = gameState.pendingBuilding;
    const mouse = gameState.mouse;
    
    // Check if position is valid (not overlapping other buildings, in bounds, etc.)
    building.valid = isValidBuildingPosition(mouse.x, mouse.y, building.width, building.height);
    
    // Draw building outline
    ctx.fillStyle = building.valid ? 'rgba(46, 204, 113, 0.4)' : 'rgba(231, 76, 60, 0.4)';
    ctx.fillRect(mouse.x - building.width/2, mouse.y - building.height/2, building.width, building.height);
    
    // Draw building border
    ctx.strokeStyle = building.valid ? '#2ecc71' : '#e74c3c';
    ctx.lineWidth = 2;
    ctx.strokeRect(mouse.x - building.width/2, mouse.y - building.height/2, building.width, building.height);
    
    // Draw grid overlay to show exact grid placement
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = mouse.x - building.width/2; x <= mouse.x + building.width/2; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, mouse.y - building.height/2);
        ctx.lineTo(x, mouse.y + building.height/2);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = mouse.y - building.height/2; y <= mouse.y + building.height/2; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(mouse.x - building.width/2, y);
        ctx.lineTo(mouse.x + building.width/2, y);
        ctx.stroke();
    }
}

function isValidBuildingPosition(x, y, width, height) {
    // Check if out of bounds
    if (x - width/2 < 0 || x + width/2 > CANVAS_WIDTH ||
        y - height/2 < 0 || y + height/2 > CANVAS_HEIGHT) {
        return false;
    }
    
    // Check for overlapping buildings
    for (const building of gameState.buildings) {
        // Simple box collision detection
        if (Math.abs(x - building.x) < (width + building.width) / 2 &&
            Math.abs(y - building.y) < (height + building.height) / 2) {
            return false;
        }
    }
    
    return true;
}

function placePendingBuilding() {
    const building = gameState.pendingBuilding;
    const mouse = gameState.mouse;
    
    if (!building.valid) {
        // Play error sound
        playSound('error');
        return;
    }
    
    // Set a global flag to prevent deselection in mouse events
    document.placedBuildingThisTick = true;
    
    // IMPORTANT: Make a deep copy of workers to ensure we can re-select them properly
    const workersToKeepSelected = [];
    gameState.units.forEach(unit => {
        if (unit.type === 'WORKER' && unit.selected) {
            workersToKeepSelected.push(unit);
        }
    });
    
    // Create the new building
    const newBuilding = new Building(
        mouse.x,
        mouse.y,
        building.type
    );
    gameState.buildings.push(newBuilding);
    
    // Spend resources
    UPGRADE_MENU.resources -= building.cost;
    
    // Update supply if it's a supply building
    if (building.type === 'SUPPLY') {
        SUPPLY_DISPLAY.maximum += BUILDING_TYPES.SUPPLY.supplyProvided;
    }
    
    // Move the worker to the building location
    const worker = getFirstSelectedWorker();
    if (worker) {
        worker.targetX = mouse.x;
        worker.targetY = mouse.y + building.height/2 + 15;
        worker.path = [{
            x: mouse.x,
            y: mouse.y + building.height/2 + 15
        }];
        
        // Set flag on worker to indicate it just placed a building
        worker.justPlacedBuilding = true;
        
        // Clear the flag after a short delay
        setTimeout(() => {
            worker.justPlacedBuilding = false;
        }, 100);
    }
    
    // Play build sound
    playSound('build');
    
    // Clear the pending building but DON'T close the build menu
    gameState.pendingBuilding = null;
    
    // Make sure the build menu remains open on the build page
    UPGRADE_MENU.visible = true;
    UPGRADE_MENU.currentPage = 'build';
    
    // CRITICAL: Force selection to be maintained by explicitly reselecting workers
    // First clear all selections
    gameState.units.forEach(unit => unit.selected = false);
    gameState.selectedUnits.clear();
    
    // Then explicitly reselect each worker we stored
    workersToKeepSelected.forEach(worker => {
        worker.selected = true;
        gameState.selectedUnits.add(worker);
    });
    
    // Ensure that worker(s) remain visually selected
    if (workersToKeepSelected.length > 0) {
        // Force an update to the stats display visibility 
        STATS_DISPLAY.visible = true;
    }
}

function getFirstSelectedWorker() {
    let selectedWorker = null;
    gameState.selectedUnits.forEach(unit => {
        if (unit.type === 'WORKER' && !selectedWorker) {
            selectedWorker = unit;
        }
    });
    return selectedWorker;
}

// New function to draw upgrade status in top-left
function drawUpgradeStatus(ctx) {
    const status = UPGRADE_STATUS;
    const upgradeKeys = Object.keys(UPGRADES);
    
    // Draw each upgrade
    upgradeKeys.forEach((key, index) => {
        const upgrade = UPGRADES[key];
        const x = status.x + index * (status.cellSize + status.spacing);
        const y = status.y;
        
        // Cell background
        ctx.fillStyle = 'rgba(25, 25, 25, 0.7)';
        ctx.fillRect(x, y, status.cellSize, status.cellSize);
        
        // Cell border
        ctx.strokeStyle = upgrade.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, status.cellSize, status.cellSize);
        
        // Upgrade key (abbreviation)
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(key, x + status.cellSize / 2, y + status.cellSize / 2 - 5);
        
        // Level number
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`${upgrade.level}`, x + status.cellSize / 2, y + status.cellSize / 2 + 15);
    });
}

// Helper function to purchase upgrades via hotkey
function purchaseUpgradeByHotkey(upgradeKey) {
    const upgrade = UPGRADES[upgradeKey];
    
    // Check if upgrade exists
    if (!upgrade) return;
    
    // Attempt to purchase the upgrade
    const success = purchaseUpgrade(upgradeKey);
    
    // Provide feedback
    if (success) {
        // Play success sound
        playSound('upgrade');
        
        // Show a temporary indicator
        gameState.targetIndicators.push(new TargetIndicator(
            UPGRADE_STATUS.x + Object.keys(UPGRADES).indexOf(upgradeKey) * (UPGRADE_STATUS.cellSize + UPGRADE_STATUS.spacing) + UPGRADE_STATUS.cellSize/2,
            UPGRADE_STATUS.y + UPGRADE_STATUS.cellSize/2
        ));
    } else if (upgrade.level >= upgrade.maxLevel) {
        console.log(`${upgrade.name} is already at maximum level!`);
        playSound('error');
    } else {
        console.log(`Not enough resources for ${upgrade.name}!`);
        playSound('error');
    }
}

// New function to draw the unit stats display
function drawUnitStatsDisplay(ctx) {
    const display = STATS_DISPLAY;
    
    // Calculate position based on hotkey groups
    const groups = HOTKEY_GROUPS;
    const gridWidth = UPGRADE_MENU.cellSize * UPGRADE_MENU.gridCols;
    const menuX = CANVAS_WIDTH - gridWidth - UPGRADE_MENU.padding * 2;
    
    // Align with the top of the hotkey groups
    const displayX = menuX - display.width - 10; // 10px gap, to the left
    const displayY = groups.y; // Align with top of hotkey groups
    
    // Draw background
    ctx.fillStyle = 'rgba(25, 25, 25, 0.85)';
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;
    ctx.fillRect(displayX, displayY, display.width, display.height);
    ctx.strokeRect(displayX, displayY, display.width, display.height);
    
    // Get stats of selected unit(s)
    if (gameState.selectedUnits.size > 0) {
        // Create a clipping region for scrollable content
        ctx.save();
        ctx.beginPath();
        ctx.rect(displayX + 5, displayY + 5, display.width - 10, display.height - 10);
        ctx.clip();
        
        // Get first selected unit for display
        const unit = Array.from(gameState.selectedUnits)[0];
        
        // Unit name/title - fixed at top
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${unit.type} Stats`, displayX + display.padding, displayY + 25 - display.scroll);
        
        // Show unit count if multiple units selected
        if (gameState.selectedUnits.size > 1) {
            ctx.font = '14px Arial';
            ctx.fillText(`(${gameState.selectedUnits.size} units selected)`, displayX + display.padding + 120, displayY + 25 - display.scroll);
        }
        
        // Draw health bar
        const healthBarWidth = display.width - display.padding * 2;
        const healthBarHeight = 15;
        const healthBarX = displayX + display.padding;
        const healthBarY = displayY + 35 - display.scroll;
        
        // Health bar background
        ctx.fillStyle = 'rgba(44, 62, 80, 0.7)';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        
        // Health bar fill
        const healthPercent = unit.currentHealth / unit.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#2ecc71' : (healthPercent > 0.25 ? '#f39c12' : '#e74c3c');
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight);
        
        // Health text
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(unit.currentHealth)} / ${unit.maxHealth}`, healthBarX + healthBarWidth / 2, healthBarY + healthBarHeight - 3);
        
        // Draw stats list
        let yOffset = healthBarY + healthBarHeight + 20;
        
        // Stats list - using a simple loop without sections
        display.stats.forEach(statKey => {
            const statLabel = display.statLabels[statKey];
            let statValue;
            
            // Get the correct value format for each stat
            if (statKey === "health") {
                statValue = `${Math.round(unit.currentHealth)} / ${unit.maxHealth}`;
            } else if (statKey === "shielded") {
                statValue = unit.shielded ? "Active (+5 Armor)" : "None";
                ctx.fillStyle = unit.shielded ? '#3498db' : '#7f8c8d';
            } else {
                statValue = unit.stats[statKey].toFixed(1);
            }
            
            // Stat name
            ctx.fillStyle = '#bdc3c7';
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(statLabel, displayX + display.padding + 10, yOffset);
            
            // Stat value
            ctx.fillStyle = '#ecf0f1';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(statValue, displayX + display.width - display.padding - 10, yOffset);
            
            yOffset += 22; // More spacing between stats for cleaner look
        });
        
        // Add controls reminder at the bottom
        yOffset += 10;
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("X: Damage | H: Heal", displayX + display.width/2, yOffset);
        
        // Add more bottom padding to ensure scrolling covers everything
        yOffset += 40; // Increased from 20 to 40
        
        // Calculate maximum scroll - increase buffer to ensure the very bottom is reachable
        display.maxScroll = Math.max(0, yOffset - (displayY + display.height - 40)); // Increased buffer from 20 to 40
        
        // Restore context after clipping
        ctx.restore();
        
        // Draw scroll indicator if needed
        if (display.maxScroll > 0) {
            // Draw scrollbar track
            const scrollTrackWidth = 6;
            const scrollTrackHeight = display.height - 20;
            const scrollTrackX = displayX + display.width - 10;
            const scrollTrackY = displayY + 10;
            
            ctx.fillStyle = 'rgba(44, 62, 80, 0.5)';
            ctx.fillRect(scrollTrackX, scrollTrackY, scrollTrackWidth, scrollTrackHeight);
            
            // Draw scrollbar thumb
            const scrollRatio = Math.min(1, display.scroll / display.maxScroll);
            const scrollThumbHeight = Math.max(20, scrollTrackHeight * (display.height / (yOffset - displayY)));
            const scrollThumbY = scrollTrackY + (scrollTrackHeight - scrollThumbHeight) * scrollRatio;
            
            ctx.fillStyle = 'rgba(149, 165, 166, 0.8)';
            ctx.fillRect(scrollTrackX, scrollThumbY, scrollTrackWidth, scrollThumbHeight);
            
            // Remove the "scroll" text that was here
        }
    }
}

// New function to draw the building stats display
function drawBuildingStatsDisplay(ctx) {
    const display = BUILDING_STATS;
    
    // Calculate position based on hotkey groups
    const groups = HOTKEY_GROUPS;
    const gridWidth = UPGRADE_MENU.cellSize * UPGRADE_MENU.gridCols;
    const menuX = CANVAS_WIDTH - gridWidth - UPGRADE_MENU.padding * 2;
    
    // Align with the top of the hotkey groups
    const displayX = menuX - display.width - 10; // 10px gap, to the left
    const displayY = groups.y; // Align with top of hotkey groups
    
    // Draw background
    ctx.fillStyle = 'rgba(25, 25, 25, 0.85)';
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;
    ctx.fillRect(displayX, displayY, display.width, display.height);
    ctx.strokeRect(displayX, displayY, display.width, display.height);
    
    // Get stats of selected building
    if (gameState.selectedBuilding) {
        // Create a clipping region for scrollable content
        ctx.save();
        ctx.beginPath();
        ctx.rect(displayX + 5, displayY + 5, display.width - 10, display.height - 10);
        ctx.clip();
        
        const building = gameState.selectedBuilding;
        
        // Building name/title
        ctx.fillStyle = '#ecf0f1';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${building.type} Stats`, displayX + display.padding, displayY + 25 - display.scroll);
        
        // Draw health bar
        const healthBarWidth = display.width - display.padding * 2;
        const healthBarHeight = 15;
        const healthBarX = displayX + display.padding;
        const healthBarY = displayY + 35 - display.scroll;
        
        // Health bar background
        ctx.fillStyle = 'rgba(44, 62, 80, 0.7)';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        
        // Health bar fill
        const healthPercent = building.currentHealth / building.maxHealth;
        ctx.fillStyle = healthPercent > 0.6 ? '#2ecc71' : (healthPercent > 0.3 ? '#f39c12' : '#e74c3c');
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight);
        
        // Health text
        ctx.fillStyle = '#ecf0f1';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(building.currentHealth)} / ${building.maxHealth}`, healthBarX + healthBarWidth / 2, healthBarY + healthBarHeight - 3);
        
        // Draw stats list
        let yOffset = healthBarY + healthBarHeight + 20;
        
        // Draw each stat in a simple list
        display.stats.forEach(statKey => {
            const statLabel = display.statLabels[statKey];
            let statValue;
            
            // Get the actual value based on stat key
            switch(statKey) {
                case 'health':
                    statValue = `${Math.round(building.currentHealth)} / ${building.maxHealth}`;
                    break;
                case 'structureArmor':
                    statValue = building.structureArmor.toString();
                    break;
                case 'spawnRate':
                    statValue = building.type === 'BUNKER' ? `${building.spawnRate.toFixed(1)}/min` : "N/A";
                    break;
                case 'unitType':
                    statValue = building.type === 'BUNKER' ? building.unitType : "N/A";
                    break;
                case 'isSpawning':
                    statValue = building.type === 'BUNKER' ? (building.isSpawning ? "Active" : "Idle") : "N/A";
                    break;
                case 'rallySet':
                    statValue = building.rallyPoint ? "Set" : "Not Set";
                    break;
                case 'shieldRadius':
                    statValue = building.type === 'SHIELD' ? `${BUILDING_TYPES.SHIELD.shieldRadius}` : "N/A";
                    break;
                case 'armorBonus':
                    statValue = building.type === 'SHIELD' ? `+${BUILDING_TYPES.SHIELD.armorBonus}` : "N/A";
                    break;
                case 'sensorRadius':
                    statValue = building.type === 'SENSOR' ? `${BUILDING_TYPES.SENSOR.sensorRadius}` : "N/A";
                    break;
                default:
                    statValue = "N/A";
            }
            
            // Stat name
            ctx.fillStyle = '#bdc3c7';
            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(statLabel, displayX + display.padding + 10, yOffset);
            
            // Stat value
            ctx.fillStyle = '#ecf0f1';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(statValue, displayX + display.width - display.padding - 10, yOffset);
            
            yOffset += 22; // More spacing between stats for cleaner look
        });
        
        // Add controls reminder
        yOffset += 10;
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("X: Damage | H: Heal | Right Click: Set Rally", displayX + display.width/2, yOffset);
        
        // Add more bottom padding to ensure scrolling covers everything
        yOffset += 40; // Increased from 20 to 40
        
        // Calculate maximum scroll with extra buffer to ensure bottom content is reachable
        display.maxScroll = Math.max(0, yOffset - (displayY + display.height - 40)); // Increased buffer from 20 to 40
        
        // Restore context after clipping
        ctx.restore();
        
        // Draw scroll indicator if needed
        if (display.maxScroll > 0) {
            // Draw scrollbar track
            const scrollTrackWidth = 6;
            const scrollTrackHeight = display.height - 20;
            const scrollTrackX = displayX + display.width - 10;
            const scrollTrackY = displayY + 10;
            
            ctx.fillStyle = 'rgba(44, 62, 80, 0.5)';
            ctx.fillRect(scrollTrackX, scrollTrackY, scrollTrackWidth, scrollTrackHeight);
            
            // Draw scrollbar thumb
            const scrollRatio = Math.min(1, display.scroll / display.maxScroll);
            const scrollThumbHeight = Math.max(20, scrollTrackHeight * (display.height / (yOffset - displayY)));
            const scrollThumbY = scrollTrackY + (scrollTrackHeight - scrollThumbHeight) * scrollRatio;
            
            ctx.fillStyle = 'rgba(149, 165, 166, 0.8)';
            ctx.fillRect(scrollTrackX, scrollThumbY, scrollTrackWidth, scrollThumbHeight);
        }
    }
}

// Resource income indicator
function addResourceIncomeIndicator() {
    // Visual feedback for resource income
    const indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    indicator.style.top = `${RESOURCE_DISPLAY.y - 5}px`;
    indicator.style.right = `${CANVAS_WIDTH - RESOURCE_DISPLAY.x - RESOURCE_DISPLAY.width}px`;
    indicator.style.color = '#2ecc71';
    indicator.style.fontSize = '16px';
    indicator.style.fontWeight = 'bold';
    indicator.textContent = `+${gameState.resourceIncomeAmount}`;
    indicator.style.opacity = '1';
    indicator.style.transition = 'all 1s ease-out';
    indicator.style.pointerEvents = 'none'; // Ensure it doesn't interfere with clicks
    
    document.body.appendChild(indicator);
    
    // Animate and remove
    setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(-20px)';
        
        // Remove from DOM after animation
        setTimeout(() => {
            document.body.removeChild(indicator);
        }, 1000);
    }, 50);
    
    // If in multiplayer mode, sync state after resource change
    if (multiplayer.isConnected && multiplayer.isHost) {
        multiplayer.sendGameState();
    }
}

// Don't auto-start the game, let the multiplayer system handle it
// This replaces the initialization code at the bottom of the file 

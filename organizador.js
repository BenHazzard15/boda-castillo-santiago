/**
 * ==============================================================================
 * BODA REAL EN EL CASTILLO DE SANTIAGO - SANLÚCAR DE BARRAMEDA
 * Full Venue Layout Editor (organizador.js)
 * Accessible exclusively via /organizador.html
 * 
 * Capabilities:
 * - Move (Drag & drop) ALL tables and venue elements (entrance, bar, stage, etc.)
 * - Rotate (0-360°) ANY table or venue element
 * - Delete ANY table or venue element
 * - Create ANY new element (tables, bars, photocall, stage, restrooms, chillout, etc.)
 * - Rename tables directly on page (e.g. Albariza, Manzanilla, Bajo de Guía, etc.)
 * - Live Property Inspector with instantaneous visual sync
 * - LocalStorage persistence and JSON export
 * ==============================================================================
 */

(function() {
  'use strict';

  const SVG_WIDTH = 1000;
  const SVG_HEIGHT = 660;

  // Default Fallback Layout if no JSON/Storage available
  const DEFAULT_VENUE_CONFIG = {
    tables: [
      { id: 0, numero: 0, nombre: "Mesa Presidencial • Ester & Samuel", x: 50.0, y: 18.0, rotation: 0, shape: "oval", capacidad: 6, descripcion: "Mesa de los novios y padrinos frente al Muro de Honor" },
      { id: 1, numero: 1, nombre: "Albariza", x: 26.0, y: 32.0, rotation: 0, shape: "circle", capacidad: 8, descripcion: "Familia Muñoz (Tíos y primos)" },
      { id: 2, numero: 2, nombre: "Manzanilla", x: 74.0, y: 32.0, rotation: 0, shape: "circle", capacidad: 8, descripcion: "Familia Madrid (Tíos y primos)" },
      { id: 3, numero: 3, nombre: "Bajo de Guía", x: 19.0, y: 48.0, rotation: 0, shape: "circle", capacidad: 8, descripcion: "Familia Gómez (Tíos y primos maternos)" },
      { id: 4, numero: 4, nombre: "Doñana", x: 81.0, y: 48.0, rotation: 0, shape: "circle", capacidad: 9, descripcion: "Amigos íntimos de la novia" },
      { id: 5, numero: 5, nombre: "Torre del Homenaje", x: 37.0, y: 34.0, rotation: 0, shape: "circle", capacidad: 9, descripcion: "Amigos íntimos del novio" },
      { id: 6, numero: 6, nombre: "Guadalquivir", x: 63.0, y: 34.0, rotation: 0, shape: "circle", capacidad: 8, descripcion: "Compañeros de trabajo de la novia" },
      { id: 7, numero: 7, nombre: "Bonanza", x: 36.0, y: 62.0, rotation: 0, shape: "circle", capacidad: 8, descripcion: "Compañeros de trabajo del novio" },
      { id: 8, numero: 8, nombre: "San Salvador", x: 64.0, y: 62.0, rotation: 0, shape: "circle", capacidad: 8, descripcion: "Amigos de Sevilla y Cádiz" },
      { id: 9, numero: 9, nombre: "La Calzada", x: 23.0, y: 65.0, rotation: 0, shape: "circle", capacidad: 8, descripcion: "Amigos de los padres de la novia" },
      { id: 10, numero: 10, nombre: "Las Piletas", x: 77.0, y: 65.0, rotation: 0, shape: "circle", capacidad: 8, descripcion: "Amigos de los padres del novio" },
      { id: 11, numero: 11, nombre: "Barrameda", x: 33.0, y: 78.0, rotation: 0, shape: "circle", capacidad: 8, descripcion: "Mesa Joven / Primos" },
      { id: 12, numero: 12, nombre: "Tartessos", x: 67.0, y: 78.0, rotation: 0, shape: "circle", capacidad: 8, descripcion: "Familia de Madrid e invitados especiales" }
    ],
    elements: [
      { id: "elem-entrance", type: "entrance", nombre: "Entrada Principal", subtitulo: "Arco del Patio de Armas", x: 50.0, y: 92.5, rotation: 0, width: 140, height: 28, icon: "🚪", color: "#50677B", deletable: true },
      { id: "elem-stage", type: "stage", nombre: "Estrado Presidencial", subtitulo: "Muro de Honor", x: 50.0, y: 9.0, rotation: 0, width: 210, height: 32, icon: "✦", color: "#C5A059", deletable: true },
      { id: "elem-dance-floor", type: "dancefloor", nombre: "Pista de Baile", subtitulo: "Música & Luces", x: 50.0, y: 70.0, rotation: 0, width: 96, height: 96, icon: "💃", color: "#C5A059", shape: "circle", deletable: true },
      { id: "elem-bar", type: "bar", nombre: "Barra Cóctel", subtitulo: "Manzanilla de Sanlúcar", x: 89.0, y: 52.0, rotation: 0, width: 88, height: 70, icon: "🍷", color: "#7D2C3E", deletable: true },
      { id: "elem-restrooms", type: "restrooms", nombre: "Servicios Sanitarios", subtitulo: "Aseos Señoras & Caballeros", x: 10.0, y: 62.0, rotation: 0, width: 78, height: 54, icon: "🚻", color: "#4D6E57", deletable: true },
      { id: "elem-photocall", type: "photocall", nombre: "Photocall & Firmas", subtitulo: "Recuerdos del enlace", x: 86.0, y: 82.0, rotation: 0, width: 84, height: 50, icon: "📸", color: "#8E5B70", deletable: true },
      { id: "elem-torre", type: "landmark", nombre: "Torre del Homenaje", subtitulo: "Fortaleza S. XV", x: 7.5, y: 9.5, rotation: 0, width: 95, height: 95, icon: "🏰", color: "#8E8274", deletable: true },
      { id: "elem-compass", type: "compass", nombre: "Rosa de los Vientos", subtitulo: "Norte", x: 89.0, y: 12.0, rotation: 0, width: 46, height: 46, icon: "🧭", color: "#C5A059", deletable: true }
    ]
  };

  const DEFAULT_GUESTS_FALLBACK = [
    { id: 1, nombre: "Ester Muñoz", mesa: 0 },
    { id: 2, nombre: "Samuel Madrid", mesa: 0 },
    { id: 3, nombre: "Manuel Muñoz Salgado", mesa: 0 },
    { id: 4, nombre: "Carmen Barba Morales", mesa: 0 },
    { id: 5, nombre: "Francisco Madrid Peralta", mesa: 0 },
    { id: 6, nombre: "Isabel Gómez Ceballos", mesa: 0 },
    { id: 7, nombre: "Alfonso Muñoz Salgado", mesa: 1 },
    { id: 8, nombre: "María del Mar Prieto", mesa: 1 },
    { id: 9, nombre: "Gonzalo Muñoz Prieto", mesa: 1 },
    { id: 10, nombre: "Lucía Muñoz Prieto", mesa: 1 },
    { id: 11, nombre: "Javier Barba Morales", mesa: 1 },
    { id: 12, nombre: "Elena Moreno Rueda", mesa: 1 },
    { id: 13, nombre: "Pablo Barba Moreno", mesa: 1 },
    { id: 14, nombre: "Clara Barba Moreno", mesa: 1 },
    { id: 15, nombre: "Antonio Madrid Peralta", mesa: 2 },
    { id: 16, nombre: "Rocío Valero Domínguez", mesa: 2 },
    { id: 17, nombre: "Álvaro Madrid Valero", mesa: 2 },
    { id: 18, nombre: "Marta Madrid Valero", mesa: 2 },
    { id: 19, nombre: "Ignacio Madrid Peralta", mesa: 2 },
    { id: 20, nombre: "Teresa Cordero Gil", mesa: 2 },
    { id: 21, nombre: "Diego Madrid Cordero", mesa: 2 },
    { id: 22, nombre: "Beatriz Madrid Cordero", mesa: 2 },
    { id: 23, nombre: "Fernando Gómez Ceballos", mesa: 3 },
    { id: 24, nombre: "Esperanza Ramos Ortiz", mesa: 3 },
    { id: 25, nombre: "Carlos Gómez Ramos", mesa: 3 },
    { id: 26, nombre: "Laura Gómez Ramos", mesa: 3 },
    { id: 27, nombre: "Santiago Gómez Ceballos", mesa: 3 },
    { id: 28, nombre: "Pilar Delgado Blanco", mesa: 3 },
    { id: 29, nombre: "Manuel Gómez Delgado", mesa: 3 },
    { id: 30, nombre: "Sofía Gómez Delgado", mesa: 3 },
    { id: 31, nombre: "Valentina Castro Vega", mesa: 4 },
    { id: 32, nombre: "Mateo Herrera Ibáñez", mesa: 4 },
    { id: 33, nombre: "Daniela Morales Ponce", mesa: 4 },
    { id: 34, nombre: "Lucas Navas Serrano", mesa: 4 },
    { id: 35, nombre: "Camila Benítez Soler", mesa: 4 },
    { id: 36, nombre: "Adrián Fuentes Rivas", mesa: 4 },
    { id: 37, nombre: "Martina Vidal Sanz", mesa: 4 },
    { id: 38, nombre: "Nicolás Parra Méndez", mesa: 4 },
    { id: 39, nombre: "Jimena Reyes Gallardo", mesa: 4 },
    { id: 40, nombre: "Jaime Lara Carrasco", mesa: 5 },
    { id: 41, nombre: "Guillermo Ortiz Marín", mesa: 5 },
    { id: 42, nombre: "Rodrigo Silva Campos", mesa: 5 },
    { id: 43, nombre: "Marcos Lozano Peña", mesa: 5 },
    { id: 44, nombre: "Bruno Quintana Esteban", mesa: 5 },
    { id: 45, nombre: "Inés Cobo Hidalgo", mesa: 5 },
    { id: 46, nombre: "Carlota Pardo Varela", mesa: 5 },
    { id: 47, nombre: "Tomás Cabrera Rojo", mesa: 5 },
    { id: 48, nombre: "Andrés Pastor Crespo", mesa: 5 },
    { id: 49, nombre: "Héctor Santos Miranda", mesa: 6 },
    { id: 50, nombre: "Natalia Guerra Molina", mesa: 6 },
    { id: 51, nombre: "Rubén Aguilar Cruz", mesa: 6 },
    { id: 52, nombre: "Silvia Cano Ferrer", mesa: 6 },
    { id: 53, nombre: "Víctor Montero Roldán", mesa: 6 },
    { id: 54, nombre: "Claudia Cortés Lucas", mesa: 6 },
    { id: 55, nombre: "Julián Romero Casado", mesa: 6 },
    { id: 56, nombre: "Patricia Gil Pacheco", mesa: 6 },
    { id: 57, nombre: "David Vargas Luque", mesa: 7 },
    { id: 58, nombre: "Sara Iglesias Nieto", mesa: 7 },
    { id: 59, nombre: "Jorge Gallego Vidal", mesa: 7 },
    { id: 60, nombre: "Cristina Soto Bravo", mesa: 7 },
    { id: 61, nombre: "Emilio Marín Saavedra", mesa: 7 },
    { id: 62, nombre: "Lorena Pascual Mora", mesa: 7 },
    { id: 63, nombre: "Gabriel Redondo León", mesa: 7 },
    { id: 64, nombre: "Nerea Domenech Solís", mesa: 7 },
    { id: 65, nombre: "Juan Carlos Jurado Ríos", mesa: 8 },
    { id: 66, nombre: "Macarena Alarcón Bueno", mesa: 8 },
    { id: 67, nombre: "Enrique Peñalver Cano", mesa: 8 },
    { id: 68, nombre: "Fátima Salgado Bermejo", mesa: 8 },
    { id: 69, nombre: "Samuel Herrero Moya", mesa: 8 },
    { id: 70, nombre: "Irene Carvajal Baeza", mesa: 8 },
    { id: 71, nombre: "Borja Otero Velasco", mesa: 8 },
    { id: 72, nombre: "Victoria Beltrán Rivas", mesa: 8 },
    { id: 73, nombre: "Rafael Montoro Carmona", mesa: 9 },
    { id: 74, nombre: "Asunción Barroso Mesa", mesa: 9 },
    { id: 75, nombre: "Joaquín Valiente Luque", mesa: 9 },
    { id: 76, nombre: "Mercedes Carrillo Vera", mesa: 9 },
    { id: 77, nombre: "Pedro Manzano Soria", mesa: 9 },
    { id: 78, nombre: "Concepción Aranda Polo", mesa: 9 },
    { id: 79, nombre: "Miguel Ángel Roldán Gil", mesa: 9 },
    { id: 80, nombre: "Rosario Hurtado Nieto", mesa: 9 },
    { id: 81, nombre: "Bernardo Quesada Maroto", mesa: 10 },
    { id: 82, nombre: "Milagros Tejero Pineda", mesa: 10 },
    { id: 83, nombre: "César Palacios Bernabé", mesa: 10 },
    { id: 84, nombre: "Amparo Soler Villalba", mesa: 10 },
    { id: 85, nombre: "Vicente Guisado Román", mesa: 10 },
    { id: 86, nombre: "Josefa Cobos Almansa", mesa: 10 },
    { id: 87, nombre: "Felipe Cordero Zurita", mesa: 10 },
    { id: 88, nombre: "Dolores Perea Maya", mesa: 10 },
    { id: 89, nombre: "Ángel Muñoz Prieto", mesa: 11 },
    { id: 90, nombre: "Mireia Madrid Valero", mesa: 11 },
    { id: 91, nombre: "Hugo Gómez Ramos", mesa: 11 },
    { id: 92, nombre: "Vega Barba Moreno", mesa: 11 },
    { id: 93, nombre: "Leo Castro Herrera", mesa: 11 },
    { id: 94, nombre: "Aitana Ortiz Cobo", mesa: 11 },
    { id: 95, nombre: "Darío Quintana Pardo", mesa: 11 },
    { id: 96, nombre: "Noa Santos Guerra", mesa: 11 },
    { id: 97, nombre: "Eduardo Blázquez Cuenca", mesa: 12 },
    { id: 98, nombre: "Alicia Mendieta Forner", mesa: 12 },
    { id: 99, nombre: "Cristóbal Cañete Rico", mesa: 12 },
    { id: 100, nombre: "Marina Lucena Tapia", mesa: 12 },
    { id: 101, nombre: "Guillermo Rivas Salcedo", mesa: 12 },
    { id: 102, nombre: "Elisa Villena Osorio", mesa: 12 },
    { id: 103, nombre: "Leandro Sotomayor Alba", mesa: 12 },
    { id: 104, nombre: "Paloma Rebollo Duque", mesa: 12 }
  ];

  // State
  const state = {
    tables: [],
    elements: [],
    guests: [],
    selectedItem: null, // { type: 'table'|'element', id: ... }

    panZoom: {
      scale: 1,
      x: 0,
      y: 0,
      isPanning: false,
      startX: 0,
      startY: 0
    },

    drag: {
      activeItem: null, // { type: 'table'|'element', id: ... }
      startX: 0,
      startY: 0,
      itemInitialX: 0,
      itemInitialY: 0
    }
  };

  // DOM Elements
  const dom = {
    venueSvg: document.getElementById('venue-svg'),
    mapContainer: document.getElementById('map-container'),
    viewportGroup: document.getElementById('map-viewport-group'),
    elementsLayer: document.getElementById('elements-layer'),
    tablesLayer: document.getElementById('tables-layer'),

    // HUD
    dragHud: document.getElementById('drag-hud'),
    hudName: document.getElementById('hud-name'),
    hudX: document.getElementById('hud-x'),
    hudY: document.getElementById('hud-y'),
    hudRot: document.getElementById('hud-rot'),

    // Inspector Tabs & Badges
    tabBtnTables: document.getElementById('tab-btn-tables'),
    tabBtnElements: document.getElementById('tab-btn-elements'),
    tabBtnEdit: document.getElementById('tab-btn-edit'),
    badgeTabTables: document.getElementById('badge-tab-tables'),
    badgeTabElements: document.getElementById('badge-tab-elements'),
    inspectorFilter: document.getElementById('inspector-filter'),
    tabContentTables: document.getElementById('tab-content-tables'),
    tabContentElements: document.getElementById('tab-content-elements'),
    tabContentEdit: document.getElementById('tab-content-edit'),
    editFormContainer: document.getElementById('edit-form-container'),

    // Top Commands
    btnOpenAddModal: document.getElementById('btn-open-add-modal'),
    btnSaveLocal: document.getElementById('btn-save-local'),
    btnCopyJson: document.getElementById('btn-copy-json'),
    btnDownloadJson: document.getElementById('btn-download-json'),
    btnResetPositions: document.getElementById('btn-reset-positions'),

    // Zoom
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomReset: document.getElementById('btn-zoom-reset'),

    // Modals
    modalAddElement: document.getElementById('modal-add-element'),
    btnCloseAddModal: document.getElementById('btn-close-add-modal'),
    modalUpload: document.getElementById('modal-upload'),
    btnOpenUpload: document.getElementById('btn-open-upload'),
    btnCloseUpload: document.getElementById('btn-close-upload'),
    uploadDropzone: document.getElementById('upload-dropzone'),
    excelFileInput: document.getElementById('excel-file-input'),
    btnReloadDefault: document.getElementById('btn-reload-default'),

    toastContainer: document.getElementById('toast-container')
  };

  function showToast(message, icon = '✦') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: var(--gold-400);">${icon}</span><span>${escapeHtml(message)}</span>`;
    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 300ms ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  // ============================================================================
  // Initialization & Config Loading
  // ============================================================================
  async function init() {
    await loadVenueConfig();
    bindEvents();
    initPanZoom();
    await loadGuestsData();
    renderAll();
    showToast('Modo Edición Total listo: mueve, gira, crea o renombra lo que desees', '🏰');
  }

  async function loadVenueConfig() {
    // 1. Check LocalStorage
    try {
      const savedLayout = localStorage.getItem('castillo_venue_layout');
      if (savedLayout) {
        const parsed = JSON.parse(savedLayout);
        if (parsed.tables && parsed.elements) {
          state.tables = parsed.tables;
          state.elements = parsed.elements;
          return;
        }
      }

      // Check legacy table format
      const savedTables = localStorage.getItem('castillo_mesas_config');
      if (savedTables) {
        state.tables = JSON.parse(savedTables);
        state.elements = JSON.parse(JSON.stringify(DEFAULT_VENUE_CONFIG.elements));
        return;
      }
    } catch (e) {
      console.warn('LocalStorage layout check error', e);
    }

    // 2. Fetch mesas-config.json
    try {
      const res = await fetch('mesas-config.json?v=' + Date.now());
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          state.tables = json;
          state.elements = JSON.parse(JSON.stringify(DEFAULT_VENUE_CONFIG.elements));
        } else if (json.tables && json.elements) {
          state.tables = json.tables;
          state.elements = json.elements;
        }
        return;
      }
    } catch (e) {
      console.info('Fetch mesas-config.json error, using default');
    }

    // 3. Fallback
    state.tables = JSON.parse(JSON.stringify(DEFAULT_VENUE_CONFIG.tables));
    state.elements = JSON.parse(JSON.stringify(DEFAULT_VENUE_CONFIG.elements));
  }

  async function loadGuestsData() {
    let rawGuests = null;
    if (typeof XLSX !== 'undefined') {
      try {
        const response = await fetch('invitados.xlsx?v=' + Date.now());
        if (response.ok) {
          const ab = await response.arrayBuffer();
          const wb = XLSX.read(ab, { type: 'array' });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          if (rows && rows.length > 1) {
            rawGuests = parseExcelRows(rows);
          }
        }
      } catch (err) {}
    }

    if (!rawGuests) {
      try {
        const res = await fetch('invitados.json?v=' + Date.now());
        if (res.ok) {
          const jsonData = await res.json();
          rawGuests = jsonData.map((item, idx) => ({
            id: item.id || idx + 1,
            nombre: item.nombre || item['Nombre y Apellido'] || '',
            mesa: parseTableNumber(item.mesa || item['Número de mesa'] || 0)
          }));
        }
      } catch (e) {}
    }

    state.guests = rawGuests && rawGuests.length > 0 ? rawGuests : DEFAULT_GUESTS_FALLBACK;
  }

  function parseExcelRows(rows) {
    const list = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;
      const id = row[0] !== undefined ? row[0] : i;
      const nombre = row[1] ? String(row[1]).trim() : '';
      if (!nombre) continue;
      const mesa = parseTableNumber(row[2] !== undefined ? row[2] : 0);
      list.push({ id, nombre, mesa });
    }
    return list;
  }

  function parseTableNumber(val) {
    if (typeof val === 'number') return val;
    const str = String(val).toLowerCase().trim();
    if (str.includes('presid') || str.includes('novio') || str === '0') return 0;
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  // ============================================================================
  // Master Render
  // ============================================================================
  function renderAll() {
    renderVenueElements();
    renderTables();
    renderInspectorLists();
    if (state.selectedItem) {
      renderPropertyEditor();
    }
  }

  // ============================================================================
  // SVG Venue Elements Rendering (Entrance, Bar, Stage, Restrooms, etc.)
  // ============================================================================
  function renderVenueElements() {
    dom.elementsLayer.innerHTML = '';

    state.elements.forEach(el => {
      const cx = (el.x / 100) * SVG_WIDTH;
      const cy = (el.y / 100) * SVG_HEIGHT;
      const rot = el.rotation || 0;
      const isSelected = state.selectedItem && state.selectedItem.type === 'element' && state.selectedItem.id === el.id;

      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", `svg-venue-element ${isSelected ? 'selected' : ''}`);
      group.setAttribute("id", `svg-elem-${el.id}`);
      group.setAttribute("transform", `translate(${cx}, ${cy}) rotate(${rot})`);

      let innerHtml = '';
      const w = el.width || 80;
      const h = el.height || 50;

        if (el.type === 'entrance') {
        innerHtml = `
          <ellipse cx="0" cy="0" rx="${w/2 + 10}" ry="${h/2 + 8}" fill="#B89248" opacity="0.12"/>
          <rect x="-${w/2}" y="-${h/2}" width="${w}" height="${h}" rx="6" class="elem-box" fill="#FAF6EE" stroke="#50677B" stroke-width="2" filter="url(#table-shadow)"/>
          <polygon points="-8,-${h/2} 0,-${h/2 - 7} 8,-${h/2}" fill="#50677B"/>
          <text x="0" y="2" font-family="'Cormorant Garamond', Georgia, serif" font-size="11" font-weight="700" fill="#2C241E" text-anchor="middle">${escapeHtml(el.nombre)}</text>
          <text x="0" y="${h/2 + 12}" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="600" fill="#50677B" text-anchor="middle">${escapeHtml(el.subtitulo || '')}</text>
        `;
      } else if (el.type === 'dancefloor') {
        const r = w / 2;
        innerHtml = `
          <circle cx="0" cy="0" r="${r}" class="elem-box" fill="url(#dance-floor-grad)" stroke="#C5A059" stroke-width="2" stroke-dasharray="4 2"/>
          <circle cx="0" cy="0" r="${r * 0.65}" fill="none" stroke="#D8B873" stroke-width="1"/>
          <text x="0" y="-3" font-size="14" text-anchor="middle">${el.icon || '💃'}</text>
          <text x="0" y="11" font-family="'Cormorant Garamond', Georgia, serif" font-size="9.5" font-weight="700" fill="#3D3228" text-anchor="middle">${escapeHtml(el.nombre)}</text>
        `;
      } else if (el.type === 'compass') {
        const r = w / 2;
        innerHtml = `
          <circle cx="0" cy="0" r="${r}" class="elem-box" fill="#FAF6EE" stroke="#C5A059" stroke-width="1.5" filter="url(#table-shadow)"/>
          <polygon points="0,-${r*0.8} ${r*0.22},0 0,-${r*0.18}" fill="#C5A059"/>
          <polygon points="0,-${r*0.8} -${r*0.22},0 0,-${r*0.18}" fill="#9B782E"/>
          <polygon points="0,${r*0.8} ${r*0.18},0 0,${r*0.18}" fill="#E8DFD1"/>
          <polygon points="0,${r*0.8} -${r*0.18},0 0,${r*0.18}" fill="#C7B79E"/>
          <text x="0" y="-${r + 2}" font-family="'Cormorant Garamond', Georgia, serif" font-size="10" font-weight="700" fill="#7A5B1E" text-anchor="middle">N</text>
          <text x="0" y="${r + 10}" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="600" fill="#766B5F" text-anchor="middle">${escapeHtml(el.nombre)}</text>
        `;
      } else if (el.type === 'landmark') {
        innerHtml = `
          <rect x="-${w/2}" y="-${h/2}" width="${w}" height="${h}" rx="6" class="elem-box" fill="#918577" stroke="#685D51" stroke-width="2.5" filter="url(#table-shadow)"/>
          <rect x="-${w/2 - 6}" y="-${h/2 - 6}" width="${w - 12}" height="${h - 12}" rx="4" fill="#A89C8E" stroke="#7A6E61" stroke-width="1.2"/>
          <text x="0" y="-8" font-size="14" text-anchor="middle">${el.icon || '🏰'}</text>
          <text x="0" y="8" font-family="'Cormorant Garamond', Georgia, serif" font-size="10" font-weight="700" fill="#FFFFFF" text-anchor="middle">${escapeHtml(el.nombre)}</text>
          <text x="0" y="19" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="600" fill="#FAF5EC" text-anchor="middle">${escapeHtml(el.subtitulo || '')}</text>
        `;
      } else {
        // Standard amenities (bar, restrooms, photocall, stage, chillout, etc.)
        const color = el.color || "#C5A059";
        innerHtml = `
          <rect x="-${w/2}" y="-${h/2}" width="${w}" height="${h}" rx="8" class="elem-box" fill="#FFFDF9" stroke="${color}" stroke-width="1.8" filter="url(#table-shadow)"/>
          <circle cx="0" cy="-${h/4}" r="11" fill="${color}" opacity="0.12"/>
          <text x="0" y="-${h/4 - 4}" font-size="13" text-anchor="middle">${el.icon || '✦'}</text>
          <text x="0" y="${h/6}" font-family="'Cormorant Garamond', Georgia, serif" font-size="9.5" font-weight="700" fill="#2C241E" text-anchor="middle">${escapeHtml(el.nombre)}</text>
          <text x="0" y="${h/6 + 10}" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="600" fill="#766B5F" text-anchor="middle">${escapeHtml(el.subtitulo || '')}</text>
        `;
      }

      // Add selection ring if active
      if (isSelected) {
        innerHtml += `
          <rect x="-${w/2 + 6}" y="-${h/2 + 6}" width="${w + 12}" height="${h + 12}" rx="10" class="svg-gizmo-ring"/>
        `;
      }

      group.innerHTML = innerHtml;

      attachItemListeners(group, { type: 'element', id: el.id, data: el });
      dom.elementsLayer.appendChild(group);
    });
  }

  // ============================================================================
  // SVG Tables Rendering
  // ============================================================================
  function renderTables() {
    dom.tablesLayer.innerHTML = '';

    state.tables.forEach(t => {
      const cx = (t.x / 100) * SVG_WIDTH;
      const cy = (t.y / 100) * SVG_HEIGHT;
      const rot = t.rotation || 0;
      const isSelected = state.selectedItem && state.selectedItem.type === 'table' && state.selectedItem.id === t.id;
      const isPres = t.numero === 0;

      // Count guests seated here
      const seatedCount = state.guests.filter(g => g.mesa === t.numero).length;

      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", `svg-table-group draggable ${isSelected ? 'selected' : ''}`);
      group.setAttribute("id", `svg-table-${t.id}`);
      group.setAttribute("transform", `translate(${cx}, ${cy}) rotate(${rot})`);

      let shapeHtml = '';

      if (t.shape === 'oval' || isPres) {
        shapeHtml = `
          <rect x="-56" y="-22" width="112" height="44" rx="20" class="svg-table-outer elem-box" fill="#FAF5EB" stroke="#C5A059" stroke-width="2.5" filter="url(#table-shadow)"/>
          <rect x="-48" y="-16" width="96" height="32" rx="14" class="svg-table-inner" fill="#F4EBD9" stroke="#EBD7A7" stroke-width="1"/>
          <circle cx="-42" cy="-28" r="5" class="svg-chair"/>
          <circle cx="-14" cy="-28" r="5" class="svg-chair"/>
          <circle cx="14" cy="-28" r="5" class="svg-chair"/>
          <circle cx="42" cy="-28" r="5" class="svg-chair"/>
          <circle cx="-25" cy="28" r="5" class="svg-chair"/>
          <circle cx="25" cy="28" r="5" class="svg-chair"/>
          <text x="0" y="-3" class="svg-table-num" fill="#7A5B1E" font-size="11" font-weight="700">PRESIDENCIA</text>
          <text x="0" y="8" class="svg-table-label" fill="#B89248" font-family="'Cormorant Garamond', Georgia, serif" font-size="8.5" font-style="italic" font-weight="600">${escapeHtml(t.nombre)}</text>
        `;
        if (isSelected) {
          shapeHtml += `<rect x="-64" y="-34" width="128" height="68" rx="24" class="svg-gizmo-ring"/>`;
        }
      } else {
        const tableRadius = 26;
        const chairRadius = 4.2;
        const chairDistance = 35;
        const chairCount = Math.max(t.capacidad || 8, seatedCount);

        let chairsSvg = '';
        for (let i = 0; i < chairCount; i++) {
          const angle = (i * 2 * Math.PI) / chairCount;
          const chX = Math.cos(angle) * chairDistance;
          const chY = Math.sin(angle) * chairDistance;
          chairsSvg += `<circle cx="${chX.toFixed(1)}" cy="${chY.toFixed(1)}" r="${chairRadius}" class="svg-chair"/>`;
        }

        shapeHtml = `
          ${chairsSvg}
          <circle cx="0" cy="0" r="${tableRadius}" class="svg-table-outer elem-box" filter="url(#table-shadow)"/>
          <circle cx="0" cy="0" r="${tableRadius - 5}" class="svg-table-inner"/>
          <circle cx="0" cy="0" r="14" fill="#FFFDF9" stroke="#C5A059" stroke-width="1.2"/>
          <text x="0" y="0" class="svg-table-num">${t.numero}</text>
          <text x="0" y="19" class="svg-table-label">${seatedCount}/${t.capacidad || 8}p</text>
          <!-- Table custom name label floating below -->
          <text x="0" y="44" font-family="'Cormorant Garamond', Georgia, serif" font-size="10.5" font-weight="700" font-style="italic" fill="#2C241E" text-anchor="middle">${escapeHtml(t.nombre)}</text>
        `;
        if (isSelected) {
          shapeHtml += `<circle cx="0" cy="0" r="46" class="svg-gizmo-ring"/>`;
        }
      }

      group.innerHTML = shapeHtml;
      attachItemListeners(group, { type: 'table', id: t.id, data: t });
      dom.tablesLayer.appendChild(group);
    });
  }

  // ============================================================================
  // Unified Drag & Selection Listeners (Tables + Elements)
  // ============================================================================
  function attachItemListeners(group, itemRef) {
    let hasMoved = false;

    function onPointerDown(e) {
      e.stopPropagation();
      e.preventDefault();

      hasMoved = false;
      state.drag.activeItem = itemRef;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      state.drag.startX = clientX;
      state.drag.startY = clientY;

      state.drag.itemInitialX = (itemRef.data.x / 100) * SVG_WIDTH;
      state.drag.itemInitialY = (itemRef.data.y / 100) * SVG_HEIGHT;

      // Show HUD
      dom.dragHud.classList.add('active');
      dom.hudName.textContent = itemRef.data.nombre || `Mesa ${itemRef.data.numero}`;
      dom.hudX.textContent = `${itemRef.data.x.toFixed(1)}%`;
      dom.hudY.textContent = `${itemRef.data.y.toFixed(1)}%`;
      dom.hudRot.textContent = `${itemRef.data.rotation || 0}°`;

      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
    }

    function onPointerMove(e) {
      if (!state.drag.activeItem) return;
      e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dxScreen = clientX - state.drag.startX;
      const dyScreen = clientY - state.drag.startY;

      if (Math.hypot(dxScreen, dyScreen) > 3) {
        hasMoved = true;
      }

      const rect = dom.venueSvg.getBoundingClientRect();
      const svgScale = (rect.width / SVG_WIDTH) * state.panZoom.scale;

      const dxSvg = dxScreen / svgScale;
      const dySvg = dyScreen / svgScale;

      let newSvgX = state.drag.itemInitialX + dxSvg;
      let newSvgY = state.drag.itemInitialY + dySvg;

      // Clamp within walls
      newSvgX = Math.min(Math.max(newSvgX, 40), SVG_WIDTH - 40);
      newSvgY = Math.min(Math.max(newSvgY, 35), SVG_HEIGHT - 40);

      const rot = itemRef.data.rotation || 0;
      group.setAttribute('transform', `translate(${newSvgX.toFixed(1)}, ${newSvgY.toFixed(1)}) rotate(${rot})`);

      itemRef.data.x = parseFloat(((newSvgX / SVG_WIDTH) * 100).toFixed(1));
      itemRef.data.y = parseFloat(((newSvgY / SVG_HEIGHT) * 100).toFixed(1));

      // Update HUD
      dom.hudX.textContent = `${itemRef.data.x.toFixed(1)}%`;
      dom.hudY.textContent = `${itemRef.data.y.toFixed(1)}%`;

      // Live update coordinate fields if currently inspected
      const inpX = document.getElementById('edit-pos-x');
      const inpY = document.getElementById('edit-pos-y');
      if (inpX && inpY && state.selectedItem && state.selectedItem.id === itemRef.id) {
        inpX.value = itemRef.data.x;
        inpY.value = itemRef.data.y;
      }
    }

    function onPointerUp() {
      state.drag.activeItem = null;
      dom.dragHud.classList.remove('active');

      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      // Select item on click (or if slight drag)
      selectItem(itemRef.type, itemRef.id);
    }

    group.addEventListener('mousedown', onPointerDown);
    group.addEventListener('touchstart', onPointerDown, { passive: false });
  }

  // ============================================================================
  // Selection & Live Property Inspector
  // ============================================================================
  function selectItem(type, id) {
    state.selectedItem = { type, id };

    // Highlight visually on SVG
    document.querySelectorAll('.svg-venue-element, .svg-table-group').forEach(el => el.classList.remove('selected'));
    const targetSvg = type === 'table' ? document.getElementById(`svg-table-${id}`) : document.getElementById(`svg-elem-${id}`);
    if (targetSvg) {
      targetSvg.classList.add('selected');
    }

    // Switch tab to Edit
    switchTab('edit');
    renderPropertyEditor();
  }

  function renderPropertyEditor() {
    if (!state.selectedItem) {
      dom.editFormContainer.innerHTML = `
        <div style="padding: 2rem 1rem; text-align: center; color: var(--stone-500); font-size: 0.85rem;">
          👆 Haz clic en cualquier mesa o elemento del plano o de la lista para editar su nombre, rotación y características.
        </div>
      `;
      return;
    }

    const { type, id } = state.selectedItem;

    if (type === 'table') {
      const table = state.tables.find(t => t.id === id);
      if (!table) return;

      const guestsSeated = state.guests.filter(g => g.mesa === table.numero);

      dom.editFormContainer.innerHTML = `
        <div class="inspector-form">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.76rem; font-weight: 800; color: var(--gold-700); text-transform: uppercase;">
              ${table.numero === 0 ? 'Mesa Presidencial' : `Mesa ${table.numero}`}
            </span>
            <span style="font-size: 0.72rem; color: var(--stone-500);">${guestsSeated.length} comensales asignados</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-table-name">Nombre Temático de la Mesa:</label>
            <input type="text" id="edit-table-name" class="form-input" value="${escapeHtml(table.nombre)}" placeholder="ej. Albariza, Manzanilla, Doñana...">
            <span style="font-size: 0.72rem; color: var(--stone-500);">Los invitados verán este nombre temático en su ficha.</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="edit-table-num">Número de Mesa:</label>
              <input type="number" id="edit-table-num" class="form-input" value="${table.numero}" min="0" max="99">
            </div>
            <div class="form-group">
              <label class="form-label" for="edit-table-cap">Capacidad (Sillas):</label>
              <input type="number" id="edit-table-cap" class="form-input" value="${table.capacidad || 8}" min="2" max="24">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Rotación (${table.rotation || 0}°):</label>
            <div class="rotation-control-box">
              <button class="rotation-btn" id="btn-rot-minus" title="Girar -15°">↺</button>
              <input type="range" id="edit-rotation" class="rotation-slider" min="0" max="360" step="5" value="${table.rotation || 0}">
              <button class="rotation-btn" id="btn-rot-plus" title="Girar +15°">↻</button>
              <span style="font-size: 0.8rem; font-family: monospace; width: 36px; text-align: right;">${table.rotation || 0}°</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="edit-pos-x">Posición X (%):</label>
              <input type="number" id="edit-pos-x" class="form-input" value="${table.x}" step="0.5" min="5" max="95">
            </div>
            <div class="form-group">
              <label class="form-label" for="edit-pos-y">Posición Y (%):</label>
              <input type="number" id="edit-pos-y" class="form-input" value="${table.y}" step="0.5" min="5" max="95">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-table-desc">Descripción / Parentesco:</label>
            <input type="text" id="edit-table-desc" class="form-input" value="${escapeHtml(table.descripcion || '')}" placeholder="ej. Familia de la novia, Amigos colegio...">
          </div>

          <div class="form-group" style="margin-top: 0.5rem;">
            <label class="form-label">Comensales sentados aquí (${guestsSeated.length}):</label>
            <div style="max-height: 110px; overflow-y: auto; background: var(--stone-50); border: 1px solid var(--stone-200); border-radius: var(--radius-md); padding: 0.4rem 0.6rem; font-size: 0.78rem;">
              ${guestsSeated.length > 0 
                ? guestsSeated.map(g => `<div>• ${escapeHtml(g.nombre)}</div>`).join('') 
                : '<span style="color: var(--stone-400);">Sin comensales en Excel aún</span>'}
            </div>
          </div>

          <button class="btn-danger" id="btn-delete-item">
            🗑️ Eliminar Esta Mesa del Plano
          </button>
        </div>
      `;

      // Live Event listeners for Table Form
      const nameInput = document.getElementById('edit-table-name');
      nameInput.addEventListener('input', (e) => {
        table.nombre = e.target.value.trim() || `Mesa ${table.numero}`;
        renderTables();
        renderInspectorLists();
      });

      const numInput = document.getElementById('edit-table-num');
      numInput.addEventListener('change', (e) => {
        table.numero = parseInt(e.target.value, 10) || 0;
        renderTables();
        renderInspectorLists();
      });

      const capInput = document.getElementById('edit-table-cap');
      capInput.addEventListener('change', (e) => {
        table.capacidad = parseInt(e.target.value, 10) || 8;
        renderTables();
      });

      const rotSlider = document.getElementById('edit-rotation');
      rotSlider.addEventListener('input', (e) => {
        table.rotation = parseInt(e.target.value, 10);
        renderTables();
        renderPropertyEditor();
      });

      document.getElementById('btn-rot-minus').addEventListener('click', () => {
        table.rotation = ((table.rotation || 0) - 15 + 360) % 360;
        renderTables();
        renderPropertyEditor();
      });

      document.getElementById('btn-rot-plus').addEventListener('click', () => {
        table.rotation = ((table.rotation || 0) + 15) % 360;
        renderTables();
        renderPropertyEditor();
      });

      document.getElementById('edit-pos-x').addEventListener('change', (e) => {
        table.x = parseFloat(e.target.value) || table.x;
        renderTables();
      });

      document.getElementById('edit-pos-y').addEventListener('change', (e) => {
        table.y = parseFloat(e.target.value) || table.y;
        renderTables();
      });

      document.getElementById('edit-table-desc').addEventListener('input', (e) => {
        table.descripcion = e.target.value;
      });

      document.getElementById('btn-delete-item').addEventListener('click', () => {
        deleteTable(table.id);
      });

    } else if (type === 'element') {
      const elem = state.elements.find(el => el.id === id);
      if (!elem) return;

      dom.editFormContainer.innerHTML = `
        <div class="inspector-form">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.76rem; font-weight: 800; color: var(--gold-700); text-transform: uppercase;">
              Elemento del Recinto (${elem.type})
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-elem-name">Nombre / Título:</label>
            <input type="text" id="edit-elem-name" class="form-input" value="${escapeHtml(elem.nombre)}" placeholder="ej. Barra Cóctel, Entrada, Photocall...">
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-elem-sub">Subtítulo / Detalle:</label>
            <input type="text" id="edit-elem-sub" class="form-input" value="${escapeHtml(elem.subtitulo || '')}" placeholder="ej. Manzanilla de Sanlúcar, Aseos...">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="edit-elem-icon">Icono / Emoji:</label>
              <input type="text" id="edit-elem-icon" class="form-input" value="${elem.icon || '✦'}" style="text-align: center; font-size: 1.1rem;">
            </div>
            <div class="form-group">
              <label class="form-label" for="edit-elem-color">Color:</label>
              <input type="color" id="edit-elem-color" class="form-input" value="${elem.color || '#C59F4E'}" style="padding: 0.2rem; height: 38px;">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Rotación (${elem.rotation || 0}°):</label>
            <div class="rotation-control-box">
              <button class="rotation-btn" id="btn-rot-minus" title="Girar -15°">↺</button>
              <input type="range" id="edit-rotation" class="rotation-slider" min="0" max="360" step="5" value="${elem.rotation || 0}">
              <button class="rotation-btn" id="btn-rot-plus" title="Girar +15°">↻</button>
              <span style="font-size: 0.8rem; font-family: monospace; width: 36px; text-align: right;">${elem.rotation || 0}°</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="edit-elem-w">Ancho (px):</label>
              <input type="number" id="edit-elem-w" class="form-input" value="${elem.width || 80}" min="30" max="400" step="5">
            </div>
            <div class="form-group">
              <label class="form-label" for="edit-elem-h">Alto (px):</label>
              <input type="number" id="edit-elem-h" class="form-input" value="${elem.height || 50}" min="20" max="300" step="5">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="edit-pos-x">Posición X (%):</label>
              <input type="number" id="edit-pos-x" class="form-input" value="${elem.x}" step="0.5" min="2" max="98">
            </div>
            <div class="form-group">
              <label class="form-label" for="edit-pos-y">Posición Y (%):</label>
              <input type="number" id="edit-pos-y" class="form-input" value="${elem.y}" step="0.5" min="2" max="98">
            </div>
          </div>

          <button class="btn-danger" id="btn-delete-item">
            🗑️ Eliminar Este Elemento del Recinto
          </button>
        </div>
      `;

      // Live Event listeners for Element Form
      document.getElementById('edit-elem-name').addEventListener('input', (e) => {
        elem.nombre = e.target.value.trim() || 'Elemento';
        renderVenueElements();
        renderInspectorLists();
      });

      document.getElementById('edit-elem-sub').addEventListener('input', (e) => {
        elem.subtitulo = e.target.value;
        renderVenueElements();
      });

      document.getElementById('edit-elem-icon').addEventListener('input', (e) => {
        elem.icon = e.target.value || '✦';
        renderVenueElements();
      });

      document.getElementById('edit-elem-color').addEventListener('change', (e) => {
        elem.color = e.target.value;
        renderVenueElements();
      });

      const rotSlider = document.getElementById('edit-rotation');
      rotSlider.addEventListener('input', (e) => {
        elem.rotation = parseInt(e.target.value, 10);
        renderVenueElements();
        renderPropertyEditor();
      });

      document.getElementById('btn-rot-minus').addEventListener('click', () => {
        elem.rotation = ((elem.rotation || 0) - 15 + 360) % 360;
        renderVenueElements();
        renderPropertyEditor();
      });

      document.getElementById('btn-rot-plus').addEventListener('click', () => {
        elem.rotation = ((elem.rotation || 0) + 15) % 360;
        renderVenueElements();
        renderPropertyEditor();
      });

      document.getElementById('edit-elem-w').addEventListener('change', (e) => {
        elem.width = parseInt(e.target.value, 10) || 80;
        renderVenueElements();
      });

      document.getElementById('edit-elem-h').addEventListener('change', (e) => {
        elem.height = parseInt(e.target.value, 10) || 50;
        renderVenueElements();
      });

      document.getElementById('edit-pos-x').addEventListener('change', (e) => {
        elem.x = parseFloat(e.target.value) || elem.x;
        renderVenueElements();
      });

      document.getElementById('edit-pos-y').addEventListener('change', (e) => {
        elem.y = parseFloat(e.target.value) || elem.y;
        renderVenueElements();
      });

      document.getElementById('btn-delete-item').addEventListener('click', () => {
        deleteVenueElement(elem.id);
      });
    }
  }

  // ============================================================================
  // Delete Operations
  // ============================================================================
  function deleteTable(tableId) {
    const table = state.tables.find(t => t.id === tableId);
    if (!table) return;

    if (confirm(`¿Estás seguro de que deseas eliminar "${table.nombre}" (Mesa ${table.numero})?`)) {
      state.tables = state.tables.filter(t => t.id !== tableId);
      state.selectedItem = null;
      renderAll();
      showToast(`Mesa ${table.numero} eliminada`, '🗑️');
    }
  }

  function deleteVenueElement(elementId) {
    const elem = state.elements.find(el => el.id === elementId);
    if (!elem) return;

    if (confirm(`¿Deseas eliminar "${elem.nombre}" del plano?`)) {
      state.elements = state.elements.filter(el => el.id !== elementId);
      state.selectedItem = null;
      renderAll();
      showToast(`Elemento "${elem.nombre}" eliminado`, '🗑️');
    }
  }

  // ============================================================================
  // Inspector Tabs Lists
  // ============================================================================
  function renderInspectorLists() {
    dom.badgeTabTables.textContent = state.tables.length;
    dom.badgeTabElements.textContent = state.elements.length;

    const filter = (dom.inspectorFilter.value || '').toLowerCase().trim();

    // 1. Tables tab list
    let tablesHtml = '';
    state.tables.forEach(t => {
      const isPres = t.numero === 0;
      const title = isPres ? 'Mesa Presidencial' : `Mesa ${t.numero}`;
      const subtitle = t.nombre || '';
      const seatedCount = state.guests.filter(g => g.mesa === t.numero).length;

      if (filter && !title.toLowerCase().includes(filter) && !subtitle.toLowerCase().includes(filter)) {
        return;
      }

      const isSel = state.selectedItem && state.selectedItem.type === 'table' && state.selectedItem.id === t.id;

      tablesHtml += `
        <div class="inspector-table-card ${isSel ? 'active' : ''}" data-type="table" data-id="${t.id}">
          <div class="inspector-table-left">
            <span class="inspector-table-title">${escapeHtml(title)}: ${escapeHtml(subtitle)}</span>
            <span class="inspector-table-sub">${seatedCount} comensales &bull; Capacidad ${t.capacidad || 8} &bull; Rot: ${t.rotation || 0}°</span>
          </div>
          <span class="inspector-table-coords">X:${t.x}%, Y:${t.y}%</span>
        </div>
      `;
    });
    dom.tabContentTables.innerHTML = tablesHtml || '<div style="padding: 1.5rem; text-align: center; color: var(--stone-500); font-size: 0.82rem;">No hay mesas que coincidan.</div>';

    // 2. Elements tab list
    let elementsHtml = '';
    state.elements.forEach(el => {
      const title = el.nombre || 'Elemento';
      const subtitle = el.subtitulo || el.type;

      if (filter && !title.toLowerCase().includes(filter) && !subtitle.toLowerCase().includes(filter)) {
        return;
      }

      const isSel = state.selectedItem && state.selectedItem.type === 'element' && state.selectedItem.id === el.id;

      elementsHtml += `
        <div class="inspector-table-card ${isSel ? 'active' : ''}" data-type="element" data-id="${el.id}">
          <div class="inspector-table-left">
            <span class="inspector-table-title">${el.icon || '✦'} ${escapeHtml(title)}</span>
            <span class="inspector-table-sub">${escapeHtml(subtitle)} &bull; Rot: ${el.rotation || 0}°</span>
          </div>
          <span class="inspector-table-coords">X:${el.x}%, Y:${el.y}%</span>
        </div>
      `;
    });
    dom.tabContentElements.innerHTML = elementsHtml || '<div style="padding: 1.5rem; text-align: center; color: var(--stone-500); font-size: 0.82rem;">No hay instalaciones que coincidan.</div>';

    // Click handler for list cards
    document.querySelectorAll('.inspector-table-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.getAttribute('data-type');
        const id = card.getAttribute('data-id');
        const parsedId = type === 'table' ? parseInt(id, 10) : id;
        selectItem(type, parsedId);

        // Center map on item
        const item = type === 'table' ? state.tables.find(t => t.id === parsedId) : state.elements.find(el => el.id === parsedId);
        if (item) {
          centerMapOnCoords((item.x / 100) * SVG_WIDTH, (item.y / 100) * SVG_HEIGHT, 1.35);
        }
      });
    });
  }

  function switchTab(tabName) {
    dom.tabBtnTables.classList.toggle('active', tabName === 'tables');
    dom.tabBtnElements.classList.toggle('active', tabName === 'elements');
    dom.tabBtnEdit.classList.toggle('active', tabName === 'edit');

    dom.tabContentTables.style.display = tabName === 'tables' ? 'flex' : 'none';
    dom.tabContentElements.style.display = tabName === 'elements' ? 'flex' : 'none';
    dom.tabContentEdit.style.display = tabName === 'edit' ? 'block' : 'none';

    document.getElementById('inspector-search-container').style.display = tabName === 'edit' ? 'none' : 'block';
  }

  // ============================================================================
  // Add Element / Table Factory
  // ============================================================================
  function createFromTemplate(templateType) {
    dom.modalAddElement.classList.remove('active');

    if (templateType === 'table-circle') {
      const nextNum = getNextTableNumber();
      const newTable = {
        id: nextNum,
        numero: nextNum,
        nombre: `Mesa ${nextNum}`,
        x: 50.0,
        y: 50.0,
        rotation: 0,
        shape: "circle",
        capacidad: 8,
        descripcion: `Mesa número ${nextNum}`
      };
      state.tables.push(newTable);
      renderAll();
      selectItem('table', newTable.id);
      centerMapOnCoords((newTable.x / 100) * SVG_WIDTH, (newTable.y / 100) * SVG_HEIGHT, 1.3);
      showToast(`Mesa ${nextNum} añadida al centro del plano`, '⭕');

    } else if (templateType === 'table-oval') {
      const nextNum = getNextTableNumber();
      const newTable = {
        id: nextNum,
        numero: nextNum,
        nombre: `Mesa Imperial ${nextNum}`,
        x: 50.0,
        y: 40.0,
        rotation: 0,
        shape: "oval",
        capacidad: 10,
        descripcion: `Mesa imperial o presidencial ${nextNum}`
      };
      state.tables.push(newTable);
      renderAll();
      selectItem('table', newTable.id);
      centerMapOnCoords((newTable.x / 100) * SVG_WIDTH, (newTable.y / 100) * SVG_HEIGHT, 1.3);
      showToast(`Mesa imperial añadida`, '🔲');

    } else {
      // Venue elements
      const id = 'elem-' + Date.now();
      let newElem = {
        id: id,
        type: templateType,
        nombre: "Nuevo Elemento",
        subtitulo: "",
        x: 50.0,
        y: 50.0,
        rotation: 0,
        width: 80,
        height: 50,
        icon: "✦",
        color: "#C59F4E",
        deletable: true
      };

      if (templateType === 'bar') {
        newElem = { ...newElem, nombre: "Barra de Cóctel", subtitulo: "Vinos & Combinados", width: 90, height: 65, icon: "🍷" };
      } else if (templateType === 'photocall') {
        newElem = { ...newElem, nombre: "Photocall", subtitulo: "Rincón de Firmas", width: 85, height: 50, icon: "📸", color: "#8B5CF6" };
      } else if (templateType === 'dancefloor') {
        newElem = { ...newElem, nombre: "Pista de Baile", subtitulo: "Zona Festiva", width: 90, height: 90, icon: "💃", shape: "circle" };
      } else if (templateType === 'stage') {
        newElem = { ...newElem, nombre: "Escenario / DJ", subtitulo: "Música & Luces", width: 140, height: 45, icon: "🎵", color: "#EAB308" };
      } else if (templateType === 'restrooms') {
        newElem = { ...newElem, nombre: "Aseos / Servicios", subtitulo: "Sanitarios", width: 75, height: 50, icon: "🚻", color: "#10B981" };
      } else if (templateType === 'entrance') {
        newElem = { ...newElem, nombre: "Acceso / Entrada", subtitulo: "Puerta de Armas", width: 130, height: 28, icon: "🚪", color: "#3B82F6" };
      } else if (templateType === 'chillout') {
        newElem = { ...newElem, nombre: "Zona Chillout", subtitulo: "Sillones y descanso", width: 100, height: 55, icon: "🛋️", color: "#D97706" };
      } else if (templateType === 'candybar') {
        newElem = { ...newElem, nombre: "Candy Bar", subtitulo: "Mesa Dulce & Postres", width: 75, height: 45, icon: "🍬", color: "#EC4899" };
      } else if (templateType === 'decor') {
        newElem = { ...newElem, nombre: "Fuente / Decoración", subtitulo: "Centro Floral", width: 60, height: 60, icon: "🌸", color: "#F43F5E" };
      } else if (templateType === 'compass') {
        newElem = { ...newElem, nombre: "Rosa de los Vientos", subtitulo: "Orientación", width: 45, height: 45, icon: "🧭", color: "#C59F4E" };
      }

      state.elements.push(newElem);
      renderAll();
      selectItem('element', newElem.id);
      centerMapOnCoords((newElem.x / 100) * SVG_WIDTH, (newElem.y / 100) * SVG_HEIGHT, 1.3);
      showToast(`Añadido "${newElem.nombre}" al plano`, newElem.icon);
    }
  }

  function getNextTableNumber() {
    let max = 0;
    state.tables.forEach(t => {
      if (t.numero > max) max = t.numero;
    });
    return max + 1;
  }

  // ============================================================================
  // Save, Copy, Download & Reset Handlers
  // ============================================================================
  function saveVenueLocally() {
    const layout = {
      tables: state.tables,
      elements: state.elements
    };
    try {
      localStorage.setItem('castillo_venue_layout', JSON.stringify(layout));
      localStorage.setItem('castillo_mesas_config', JSON.stringify(state.tables));
      showToast('¡Guardado con éxito! La web de invitados ya refleja los cambios.', '💾');
    } catch (e) {
      showToast('Error al guardar en el navegador', '⚠️');
    }
  }

  function copyJson() {
    const layout = {
      tables: state.tables,
      elements: state.elements
    };
    const str = JSON.stringify(layout, null, 2);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(str)
        .then(() => showToast('¡JSON copiado! Puedes pegarlo en mesas-config.json', '📋'))
        .catch(() => fallbackCopy(str));
    } else {
      fallbackCopy(str);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('¡JSON copiado!', '📋');
  }

  function downloadJson() {
    const layout = {
      tables: state.tables,
      elements: state.elements
    };
    const str = JSON.stringify(layout, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mesas-config.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Descargado mesas-config.json', '📥');
  }

  function resetToDefault() {
    if (confirm('¿Deseas restaurar la distribución y elementos originales del castillo?')) {
      localStorage.removeItem('castillo_venue_layout');
      localStorage.removeItem('castillo_mesas_config');
      state.tables = JSON.parse(JSON.stringify(DEFAULT_VENUE_CONFIG.tables));
      state.elements = JSON.parse(JSON.stringify(DEFAULT_VENUE_CONFIG.elements));
      state.selectedItem = null;
      renderAll();
      showToast('Plano restablecido al estado original', '🔄');
    }
  }

  // ============================================================================
  // Pan & Zoom Engine
  // ============================================================================
  function initPanZoom() {
    const el = dom.mapContainer;
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive: false });
  }

  function updateTransform() {
    dom.viewportGroup.setAttribute(
      'transform',
      `translate(${state.panZoom.x}, ${state.panZoom.y}) scale(${state.panZoom.scale})`
    );
  }

  function onMouseDown(e) {
    if (state.drag.activeItem !== null) return;
    if (e.button !== 0) return;
    state.panZoom.isPanning = true;
    state.panZoom.startX = e.clientX - state.panZoom.x;
    state.panZoom.startY = e.clientY - state.panZoom.y;
    dom.venueSvg.classList.add('dragging');
  }

  function onMouseMove(e) {
    if (!state.panZoom.isPanning) return;
    state.panZoom.x = e.clientX - state.panZoom.startX;
    state.panZoom.y = e.clientY - state.panZoom.startY;
    updateTransform();
  }

  function onMouseUp() {
    state.panZoom.isPanning = false;
    dom.venueSvg.classList.remove('dragging');
  }

  function onWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const rect = dom.venueSvg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newScale = Math.min(Math.max(state.panZoom.scale * zoomFactor, 0.75), 3.2);
    state.panZoom.x = mouseX - (mouseX - state.panZoom.x) * (newScale / state.panZoom.scale);
    state.panZoom.y = mouseY - (mouseY - state.panZoom.y) * (newScale / state.panZoom.scale);
    state.panZoom.scale = newScale;

    updateTransform();
  }

  function centerMapOnCoords(svgX, svgY, targetScale = 1.35) {
    const rect = dom.venueSvg.getBoundingClientRect();
    const scaleFactor = rect.width / SVG_WIDTH;
    const screenX = svgX * scaleFactor;
    const screenY = svgY * scaleFactor;

    state.panZoom.scale = targetScale;
    state.panZoom.x = (rect.width / 2) - (screenX * targetScale);
    state.panZoom.y = (rect.height / 2) - (screenY * targetScale);
    updateTransform();
  }

  function resetZoom() {
    state.panZoom.scale = 1;
    state.panZoom.x = 0;
    state.panZoom.y = 0;
    updateTransform();
    showToast('Plano centrado', '⟲');
  }

  // ============================================================================
  // File Upload (Excel, CSV, JSON)
  // ============================================================================
  function handleFileSelected(file) {
    if (!file) return;
    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (Array.isArray(json)) {
            state.guests = json.map((g, idx) => ({
              id: g.id || idx + 1,
              nombre: g.nombre || g['Nombre y Apellido'] || '',
              mesa: parseTableNumber(g.mesa || g['Número de mesa'] || 0)
            }));
            dom.modalUpload.classList.remove('active');
            renderAll();
            showToast(`¡Cargados ${state.guests.length} comensales desde ${file.name}!`, '✓');
          }
        } catch (err) {
          alert('Error: formato JSON no válido');
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        try {
          if (typeof XLSX === 'undefined') {
            alert('Librería SheetJS no disponible aún.');
            return;
          }
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const guests = parseExcelRows(rows);
          if (guests.length > 0) {
            state.guests = guests;
            dom.modalUpload.classList.remove('active');
            renderAll();
            showToast(`¡Cargados ${guests.length} comensales desde ${file.name}!`, '✓');
          } else {
            alert('No se encontraron filas con comensales.');
          }
        } catch (err) {
          alert('Error leyendo archivo: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // ============================================================================
  // Event Bindings
  // ============================================================================
  function bindEvents() {
    // Top bar commands
    dom.btnSaveLocal.addEventListener('click', saveVenueLocally);
    dom.btnCopyJson.addEventListener('click', copyJson);
    dom.btnDownloadJson.addEventListener('click', downloadJson);
    dom.btnResetPositions.addEventListener('click', resetToDefault);

    // Zoom controls
    dom.btnZoomIn.addEventListener('click', () => {
      state.panZoom.scale = Math.min(state.panZoom.scale * 1.25, 3.2);
      updateTransform();
    });
    dom.btnZoomOut.addEventListener('click', () => {
      state.panZoom.scale = Math.max(state.panZoom.scale * 0.8, 0.75);
      updateTransform();
    });
    dom.btnZoomReset.addEventListener('click', resetZoom);

    // Inspector Tabs
    dom.tabBtnTables.addEventListener('click', () => switchTab('tables'));
    dom.tabBtnElements.addEventListener('click', () => switchTab('elements'));
    dom.tabBtnEdit.addEventListener('click', () => switchTab('edit'));

    // Filter
    dom.inspectorFilter.addEventListener('input', renderInspectorLists);

    // Add Modal
    dom.btnOpenAddModal.addEventListener('click', () => dom.modalAddElement.classList.add('active'));
    dom.btnCloseAddModal.addEventListener('click', () => dom.modalAddElement.classList.remove('active'));
    dom.modalAddElement.addEventListener('click', (e) => {
      if (e.target === dom.modalAddElement) dom.modalAddElement.classList.remove('active');
    });

    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.getAttribute('data-create-type');
        createFromTemplate(type);
      });
    });

    // Upload Modal
    dom.btnOpenUpload.addEventListener('click', () => dom.modalUpload.classList.add('active'));
    dom.btnCloseUpload.addEventListener('click', () => dom.modalUpload.classList.remove('active'));
    dom.modalUpload.addEventListener('click', (e) => {
      if (e.target === dom.modalUpload) dom.modalUpload.classList.remove('active');
    });

    dom.uploadDropzone.addEventListener('click', () => dom.excelFileInput.click());
    dom.excelFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) handleFileSelected(e.target.files[0]);
    });

    dom.uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dom.uploadDropzone.classList.add('dragover');
    });
    dom.uploadDropzone.addEventListener('dragleave', () => dom.uploadDropzone.classList.remove('dragover'));
    dom.uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dom.uploadDropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) handleFileSelected(e.dataTransfer.files[0]);
    });

    dom.btnReloadDefault.addEventListener('click', () => {
      loadGuestsData();
      dom.modalUpload.classList.remove('active');
      renderAll();
    });

    // Keyboard ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dom.modalAddElement.classList.remove('active');
        dom.modalUpload.classList.remove('active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

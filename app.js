/**
 * ==============================================================================
 * BODA REAL EN EL CASTILLO DE SANTIAGO - SANLÚCAR DE BARRAMEDA
 * Interactive Seating Chart & Venue Navigation Application
 * 
 * Features:
 * - SheetJS (xlsx) Dynamic guest data parsing with fallback to JSON / embedded
 * - Automatic max table calculation & guest-to-table grouping
 * - Predictive autocomplete search with accent-insensitivity
 * - Dynamic SVG Venue Map of the Patio de Armas with Pan & Zoom
 * - Animated visual route from Entrance to Assigned Table
 * - "Modo Organizador" Drag & Drop table planner with JSON export & LocalStorage
 * - Complete Table Directory modal
 * - Celebratory gold confetti micro-animation
 * ==============================================================================
 */

(function() {
  'use strict';

  // ============================================================================
  // Default Configuration & Data Fallbacks
  // ============================================================================
  const CASTILLO_COORDINATES_DEFAULT = [
    { id: 0, numero: 0, nombre: "Mesa Presidencial • Ester & Samuel", x: 50.0, y: 18.0, shape: "oval", capacidad: 6, descripcion: "Mesa de los novios y padrinos frente al Muro de Honor" },
    { id: 1, numero: 1, nombre: "Albariza", x: 26.0, y: 32.0, shape: "circle", capacidad: 8, descripcion: "Familia Muñoz (Tíos y primos)" },
    { id: 2, numero: 2, nombre: "Manzanilla", x: 74.0, y: 32.0, shape: "circle", capacidad: 8, descripcion: "Familia Madrid (Tíos y primos)" },
    { id: 3, numero: 3, nombre: "Bajo de Guía", x: 19.0, y: 48.0, shape: "circle", capacidad: 8, descripcion: "Familia Gómez (Tíos y primos maternos)" },
    { id: 4, numero: 4, nombre: "Doñana", x: 81.0, y: 48.0, shape: "circle", capacidad: 9, descripcion: "Amigos íntimos de la novia" },
    { id: 5, numero: 5, nombre: "Torre del Homenaje", x: 37.0, y: 34.0, shape: "circle", capacidad: 9, descripcion: "Amigos íntimos del novio" },
    { id: 6, numero: 6, nombre: "Guadalquivir", x: 63.0, y: 34.0, shape: "circle", capacidad: 8, descripcion: "Compañeros de trabajo de la novia" },
    { id: 7, numero: 7, nombre: "Bonanza", x: 36.0, y: 62.0, shape: "circle", capacidad: 8, descripcion: "Compañeros de trabajo del novio" },
    { id: 8, numero: 8, nombre: "San Salvador", x: 64.0, y: 62.0, shape: "circle", capacidad: 8, descripcion: "Amigos de Sevilla y Cádiz" },
    { id: 9, numero: 9, nombre: "La Calzada", x: 23.0, y: 65.0, shape: "circle", capacidad: 8, descripcion: "Amigos de los padres de la novia" },
    { id: 10, numero: 10, nombre: "Las Piletas", x: 77.0, y: 65.0, shape: "circle", capacidad: 8, descripcion: "Amigos de los padres del novio" },
    { id: 11, numero: 11, nombre: "Barrameda", x: 33.0, y: 78.0, shape: "circle", capacidad: 8, descripcion: "Mesa Joven / Primos" },
    { id: 12, numero: 12, nombre: "Tartessos", x: 67.0, y: 78.0, shape: "circle", capacidad: 8, descripcion: "Familia de Madrid e invitados especiales" }
  ];

  // Default fallback guest list in case local file:// blocks fetch
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

  // SVG Coordinates bounds: viewBox is 0 0 1000 660
  const SVG_WIDTH = 1000;
  const SVG_HEIGHT = 660;
  const ENTRANCE_POINT = { x: 500, y: 605 };

  // ============================================================================
  // Application State
  // ============================================================================
  const state = {
    guests: [],
    tablesMap: new Map(), // key: table number -> { config, guests: [] }
    tableConfigs: [],
    maxTableNum: 0,
    selectedGuest: null,
    selectedTable: null,
    isOrganizerMode: false,
    showRouteLayer: true,
    
    // Pan & Zoom State
    panZoom: {
      scale: 1,
      x: 0,
      y: 0,
      isPanning: false,
      startX: 0,
      startY: 0,
      touchDistance: null
    },

    // Drag Table in Organizer Mode
    drag: {
      activeTableId: null,
      startX: 0,
      startY: 0,
      tableInitialX: 0,
      tableInitialY: 0
    }
  };

  // ============================================================================
  // DOM Elements
  // ============================================================================
  const dom = {
    searchInput: document.getElementById('guest-search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    searchDropdown: document.getElementById('search-dropdown'),
    guestCountBadge: document.getElementById('guest-count-badge'),
    
    // Guest Result Section
    guestResultSection: document.getElementById('guest-result-section'),
    resGuestName: document.getElementById('res-guest-name'),
    resTableNum: document.getElementById('res-table-num'),
    resTableTheme: document.getElementById('res-table-theme'),
    resTableDesc: document.getElementById('res-table-desc'),
    resCompanionsCount: document.getElementById('res-companions-count'),
    resCompanionsGrid: document.getElementById('res-companions-grid'),
    resRouteText: document.getElementById('res-route-text'),
    btnDismissResult: document.getElementById('btn-dismiss-result'),
    btnFocusTableMap: document.getElementById('btn-focus-table-map'),
    
    // SVG & Map elements
    venueSvg: document.getElementById('venue-svg'),
    mapContainer: document.getElementById('map-container'),
    viewportGroup: document.getElementById('map-viewport-group'),
    tablesLayer: document.getElementById('tables-layer'),
    routeLayer: document.getElementById('route-layer'),
    routePath: document.getElementById('route-path'),
    routeBg: document.getElementById('route-bg'),
    destOverlay: document.getElementById('destination-overlay'),
    destPulse: document.getElementById('dest-pulse'),
    destPin: document.getElementById('dest-pin'),

    // Map Buttons
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomReset: document.getElementById('btn-zoom-reset'),
    btnToggleRouteLayer: document.getElementById('btn-toggle-route-layer'),
    routeLayerLabel: document.getElementById('route-layer-label'),

    // Organizer Elements
    btnToggleOrganizer: document.getElementById('btn-toggle-organizer'),
    organizerBanner: document.getElementById('organizer-banner'),
    btnCloseOrganizer: document.getElementById('btn-close-organizer'),
    btnCopyJson: document.getElementById('btn-copy-json'),
    btnSaveLocal: document.getElementById('btn-save-local'),
    btnResetPositions: document.getElementById('btn-reset-positions'),
    footerAdminToggle: document.getElementById('footer-admin-toggle'),

    // Modals
    btnOpenDirectory: document.getElementById('btn-open-directory'),
    modalDirectory: document.getElementById('modal-directory'),
    btnCloseDirectory: document.getElementById('btn-close-directory'),
    directoryContainer: document.getElementById('directory-container'),

    btnOpenUpload: document.getElementById('btn-open-upload'),
    modalUpload: document.getElementById('modal-upload'),
    btnCloseUpload: document.getElementById('btn-close-upload'),
    uploadDropzone: document.getElementById('upload-dropzone'),
    excelFileInput: document.getElementById('excel-file-input'),
    btnReloadDefault: document.getElementById('btn-reload-default'),

    toastContainer: document.getElementById('toast-container'),
    confettiCanvas: document.getElementById('confetti-canvas')
  };

  // ============================================================================
  // Normalization & String Helpers
  // ============================================================================
  function normalizeString(str) {
    if (!str) return '';
    return str
      .toString()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  // Toast Notification
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

  // ============================================================================
  // Initialization & Data Loading
  // ============================================================================
  async function init() {
    loadSavedTableCoordinates();
    bindEvents();
    initPanZoom();
    initConfetti();
    
    // Attempt to load guests from invitados.xlsx or fallbacks
    await loadGuestData();
  }

  function loadSavedTableCoordinates() {
    try {
      const saved = localStorage.getItem('castillo_mesas_config');
      if (saved) {
        state.tableConfigs = JSON.parse(saved);
        return;
      }
    } catch (e) {
      console.warn('Could not read saved coordinates from localStorage', e);
    }
    // Default config
    state.tableConfigs = JSON.parse(JSON.stringify(CASTILLO_COORDINATES_DEFAULT));
  }

  /**
   * Main loader for invitados:
   * 1. Tries to fetch 'invitados.xlsx' and parse using SheetJS (XLSX).
   * 2. If it fails (e.g. CORS on file://), attempts to fetch 'invitados.json'.
   * 3. If both fail, falls back seamlessly to DEFAULT_GUESTS_FALLBACK.
   */
  async function loadGuestData() {
    dom.guestCountBadge.textContent = "Cargando...";

    let rawGuests = null;

    // 1. Try XLSX
    if (typeof XLSX !== 'undefined') {
      try {
        const response = await fetch('invitados.xlsx?v=' + Date.now());
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (rows && rows.length > 1) {
            rawGuests = parseExcelRows(rows);
            console.log('[SheetJS] Invitados cargados desde invitados.xlsx:', rawGuests.length);
            showToast(`Cargados ${rawGuests.length} comensales desde invitados.xlsx`, '📊');
          }
        }
      } catch (err) {
        console.info('[Data Loader] Fetch de invitados.xlsx no disponible (habitual en protocolo file://), intentando JSON...');
      }
    }

    // 2. Try JSON
    if (!rawGuests) {
      try {
        const res = await fetch('invitados.json?v=' + Date.now());
        if (res.ok) {
          const jsonData = await res.json();
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            rawGuests = jsonData.map((item, index) => ({
              id: item.id || item.numero || index + 1,
              nombre: item.nombre || item.name || item['Nombre y Apellido'] || '',
              mesa: parseTableNumber(item.mesa || item.table || item['Número de mesa'] || 0)
            }));
            console.log('[JSON Loader] Invitados cargados desde invitados.json:', rawGuests.length);
            showToast(`Cargados ${rawGuests.length} comensales desde invitados.json`, '📄');
          }
        }
      } catch (err) {
        console.info('[Data Loader] Fetch de invitados.json no disponible, activando dataset integrado.');
      }
    }

    // 3. Fallback
    if (!rawGuests || rawGuests.length === 0) {
      rawGuests = DEFAULT_GUESTS_FALLBACK;
      console.log('[Fallback] Activado dataset de reserva con 104 invitados.');
      showToast('Cargados 104 comensales del evento', '🏰');
    }

    processGuestData(rawGuests);
  }

  function parseExcelRows(rows) {
    const list = [];
    // Row 0 is header: Col A: Número, Col B: Nombre y Apellido, Col C: Número de mesa
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;
      
      const id = row[0] !== undefined ? row[0] : i;
      const nombre = row[1] ? String(row[1]).trim() : '';
      if (!nombre) continue;

      const mesaRaw = row[2] !== undefined ? row[2] : 0;
      const mesa = parseTableNumber(mesaRaw);

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

  /**
   * Processes the raw guests list:
   * - Calculates max table number
   * - Groups guests per table
   * - Ensures every table has a coordinate config (generating harmonic default grid if needed)
   * - Re-renders the SVG map
   */
  function processGuestData(guests) {
    state.guests = guests;
    state.tablesMap.clear();

    let maxNum = 0;
    guests.forEach(g => {
      if (typeof g.mesa === 'number' && g.mesa > maxNum) {
        maxNum = g.mesa;
      }
    });
    state.maxTableNum = maxNum;

    // Ensure we have table configs for 0 (presidencial) and 1..maxTableNum
    for (let num = 0; num <= maxNum; num++) {
      let cfg = state.tableConfigs.find(c => c.numero === num);
      if (!cfg) {
        // Generate automatic harmonic position for newly discovered tables
        cfg = generateAutomaticTablePosition(num, maxNum);
        state.tableConfigs.push(cfg);
      }
      state.tablesMap.set(num, {
        config: cfg,
        guests: []
      });
    }

    // Assign guests into tablesMap
    guests.forEach(g => {
      const tableData = state.tablesMap.get(g.mesa);
      if (tableData) {
        tableData.guests.push(g);
      } else {
        // In case an unknown table number appears
        state.tablesMap.set(g.mesa, {
          config: generateAutomaticTablePosition(g.mesa, maxNum),
          guests: [g]
        });
      }
    });

    // Update UI Badges
    dom.guestCountBadge.textContent = `${guests.length} invitados`;

    // Render SVG tables
    renderTablesOnSvg();
    renderTableDirectory();
  }

  function generateAutomaticTablePosition(tableNum, total) {
    if (tableNum === 0) {
      return { id: 0, numero: 0, nombre: "Mesa Presidencial", x: 50, y: 18, shape: "oval", capacidad: 6, descripcion: "Mesa presidencial de novios" };
    }
    // Calculate a clean grid layout in the courtyard for extra tables
    const colCount = 4;
    const index = tableNum - 1;
    const col = index % colCount;
    const row = Math.floor(index / colCount);
    
    const x = 22 + col * 19;
    const y = 32 + row * 15;

    return {
      id: tableNum,
      numero: tableNum,
      nombre: `Mesa ${tableNum}`,
      x: Math.min(Math.max(x, 15), 85),
      y: Math.min(Math.max(y, 25), 85),
      shape: "circle",
      capacidad: 8,
      descripcion: `Comensales de la Mesa ${tableNum}`
    };
  }

  // ============================================================================
  // Predictive Search & Autocomplete
  // ============================================================================
  function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    if (query.length > 0) {
      dom.searchClearBtn.classList.add('active');
    } else {
      dom.searchClearBtn.classList.remove('active');
      closeAutocomplete();
      return;
    }

    const normalizedQuery = normalizeString(query);
    const matches = state.guests.filter(g => {
      const normName = normalizeString(g.nombre);
      return normName.includes(normalizedQuery);
    });

    renderAutocomplete(matches, query);
  }

  function renderAutocomplete(matches, rawQuery) {
    if (matches.length === 0) {
      dom.searchDropdown.innerHTML = `
        <div class="autocomplete-empty">
          No hemos encontrado a ningún invitado con "<strong>${escapeHtml(rawQuery)}</strong>".<br>
          <span style="font-size: 0.8rem; color: var(--stone-400);">Prueba a buscar sólo por apellido o primer nombre.</span>
        </div>
      `;
      dom.searchDropdown.classList.add('active');
      return;
    }

    const maxResults = 12;
    const sliced = matches.slice(0, maxResults);

    let html = '';
    sliced.forEach((guest, idx) => {
      const tableData = state.tablesMap.get(guest.mesa);
      const tableName = guest.mesa === 0 
        ? "Presidencial" 
        : `Mesa ${guest.mesa}${tableData && tableData.config && tableData.config.nombre ? ' • ' + tableData.config.nombre : ''}`;

      // Highlight matching substrings
      const highlightedName = highlightMatch(guest.nombre, rawQuery);

      html += `
        <div class="autocomplete-item" data-guest-id="${guest.id}" role="option" tabindex="0">
          <div class="autocomplete-item-name">${highlightedName}</div>
          <div class="autocomplete-item-table">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            <span>${escapeHtml(tableName)}</span>
          </div>
        </div>
      `;
    });

    if (matches.length > maxResults) {
      html += `
        <div style="padding: 0.65rem 1.25rem; font-size: 0.76rem; color: var(--gold-700); text-align: center; background: var(--gold-100);">
          Mostrando ${maxResults} de ${matches.length} coincidencias. Escribe más letras para afinar.
        </div>
      `;
    }

    dom.searchDropdown.innerHTML = html;
    dom.searchDropdown.classList.add('active');

    // Attach click events
    dom.searchDropdown.querySelectorAll('.autocomplete-item').forEach(el => {
      el.addEventListener('click', () => {
        const guestId = parseInt(el.getAttribute('data-guest-id'), 10);
        selectGuestById(guestId);
      });
    });
  }

  function highlightMatch(text, query) {
    const normText = normalizeString(text);
    const normQuery = normalizeString(query);
    const idx = normText.indexOf(normQuery);
    
    if (idx === -1) return escapeHtml(text);
    
    const before = text.substring(0, idx);
    const match = text.substring(idx, idx + query.length);
    const after = text.substring(idx + query.length);

    return `${escapeHtml(before)}<span class="autocomplete-item-match">${escapeHtml(match)}</span>${escapeHtml(after)}`;
  }

  function closeAutocomplete() {
    dom.searchDropdown.classList.remove('active');
    dom.searchDropdown.innerHTML = '';
  }

  function selectGuestById(guestId) {
    const guest = state.guests.find(g => g.id === guestId);
    if (!guest) return;

    state.selectedGuest = guest;
    dom.searchInput.value = guest.nombre;
    dom.searchClearBtn.classList.add('active');
    closeAutocomplete();

    // Render Seating Card
    renderGuestResult(guest);

    // Focus & highlight table on map
    highlightTableOnMap(guest.mesa, true);

    // Trigger celebratory confetti
    triggerCelebration();
  }

  // ============================================================================
  // Guest Result & Companions Card
  // ============================================================================
  function renderGuestResult(guest) {
    const tableData = state.tablesMap.get(guest.mesa);
    const cfg = tableData ? tableData.config : { nombre: `Mesa ${guest.mesa}`, descripcion: "" };
    const companions = tableData ? tableData.guests : [];

    dom.resGuestName.textContent = guest.nombre;

    if (guest.mesa === 0) {
      dom.resTableNum.textContent = "NOV";
      dom.resTableNum.classList.add('presidential');
      dom.resTableTheme.textContent = cfg.nombre || "Mesa Presidencial";
      dom.resTableDesc.textContent = cfg.descripcion || "Mesa de Honor frente al Castillo";
    } else {
      dom.resTableNum.textContent = guest.mesa;
      dom.resTableNum.classList.remove('presidential');
      dom.resTableTheme.textContent = cfg.nombre || `Mesa ${guest.mesa}`;
      dom.resTableDesc.textContent = cfg.descripcion || `Comensales de la Mesa ${guest.mesa}`;
    }

    // Companions
    dom.resCompanionsCount.textContent = `${companions.length} comensales`;
    let chipsHtml = '';
    companions.forEach(c => {
      const isCurrent = c.id === guest.id;
      chipsHtml += `
        <div class="companion-chip ${isCurrent ? 'is-current' : ''}" title="${escapeHtml(c.nombre)}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>${escapeHtml(c.nombre)}</span>
        </div>
      `;
    });
    dom.resCompanionsGrid.innerHTML = chipsHtml;

    // Route guidance text
    dom.resRouteText.innerHTML = getOrientationGuideText(cfg);

    // Reveal Result Section with animation
    dom.guestResultSection.classList.add('active');
    
    // On mobile, scroll gently so the result card is in view
    if (window.innerWidth < 768) {
      dom.guestResultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function getOrientationGuideText(tableConfig) {
    if (!tableConfig) return "Sigue la línea dorada en el plano para llegar a tu mesa.";
    
    const x = tableConfig.x;
    const y = tableConfig.y;

    let sideText = "hacia el centro del patio";
    if (x < 40) sideText = "hacia el ala izquierda (junto a los arcos de la Torre del Homenaje)";
    else if (x > 60) sideText = "hacia el ala derecha (en dirección a la zona de cóctel y Manzanilla)";

    let depthText = "en las primeras filas.";
    if (y < 35) depthText = "en la parte noble superior, próxima al estrado nupcial.";
    else if (y < 65) depthText = "en la zona central del patio.";
    else depthText = "a pocos pasos de la Entrada Principal.";

    return `Entra por el <strong class="route-guide-strong">Arco de Armas (Entrada Principal)</strong>, camina recto ${sideText} y encontrarás tu mesa ${depthText}`;
  }

  function dismissGuestResult() {
    dom.guestResultSection.classList.remove('active');
    state.selectedGuest = null;
    clearMapHighlight();
  }

  // ============================================================================
  // Interactive SVG Venue Map Rendering & Highlighting
  // ============================================================================
  function renderTablesOnSvg() {
    dom.tablesLayer.innerHTML = '';

    state.tablesMap.forEach((tableData, tableNum) => {
      const cfg = tableData.config;
      const guestCount = tableData.guests.length;
      const isPresidential = tableNum === 0;

      // Convert percentage coordinates into SVG units
      const cx = (cfg.x / 100) * SVG_WIDTH;
      const cy = (cfg.y / 100) * SVG_HEIGHT;

      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", `svg-table-group ${state.isOrganizerMode ? 'draggable' : ''}`);
      group.setAttribute("id", `svg-table-${tableNum}`);
      group.setAttribute("data-table-num", tableNum);
      group.setAttribute("transform", `translate(${cx}, ${cy})`);
      group.setAttribute("tabindex", "0");
      group.setAttribute("role", "button");
      group.setAttribute("aria-label", `Mesa ${tableNum}: ${cfg.nombre}, ${guestCount} comensales`);

      let shapeHtml = '';

      if (isPresidential) {
        // Oval / Rectangular Presidential Table
        shapeHtml = `
          <!-- Presidential Table Tablecloth & Rim -->
          <rect x="-56" y="-22" width="112" height="44" rx="20" class="svg-table-outer" fill="#3D342A" stroke="#C59F4E" stroke-width="2.5" filter="url(#table-shadow)"/>
          <rect x="-48" y="-16" width="96" height="32" rx="14" class="svg-table-inner" fill="#4A3F33" stroke="#E6CE93" stroke-width="1"/>
          
          <!-- Chairs for Presidential (6 seats) -->
          <circle cx="-42" cy="-28" r="5" class="svg-chair"/>
          <circle cx="-14" cy="-28" r="5" class="svg-chair"/>
          <circle cx="14" cy="-28" r="5" class="svg-chair"/>
          <circle cx="42" cy="-28" r="5" class="svg-chair"/>
          <circle cx="-25" cy="28" r="5" class="svg-chair"/>
          <circle cx="25" cy="28" r="5" class="svg-chair"/>

          <text x="0" y="-3" class="svg-table-num" fill="#E6CE93" font-size="12">NOVIOS</text>
          <text x="0" y="8" class="svg-table-label" fill="#D4AF37" font-size="7">PRESIDENCIA</text>
        `;
      } else {
        // Circular Guest Tables
        const tableRadius = 26;
        const chairRadius = 4.2;
        const chairDistance = 35;
        const chairCount = Math.max(cfg.capacidad || 8, guestCount);

        // Generate radial chairs
        let chairsSvg = '';
        for (let i = 0; i < chairCount; i++) {
          const angle = (i * 2 * Math.PI) / chairCount;
          const chX = Math.cos(angle) * chairDistance;
          const chY = Math.sin(angle) * chairDistance;
          chairsSvg += `<circle cx="${chX.toFixed(1)}" cy="${chY.toFixed(1)}" r="${chairRadius}" class="svg-chair"/>`;
        }

        shapeHtml = `
          <!-- Radial Chairs -->
          ${chairsSvg}
          <!-- Circular Table -->
          <circle cx="0" cy="0" r="${tableRadius}" class="svg-table-outer" filter="url(#table-shadow)"/>
          <circle cx="0" cy="0" r="${tableRadius - 5}" class="svg-table-inner"/>
          <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#C59F4E" stroke-width="1.2"/>
          
          <text x="0" y="0" class="svg-table-num">${tableNum}</text>
          <text x="0" y="19" class="svg-table-label">${guestCount}p</text>
        `;
      }

      group.innerHTML = shapeHtml;

      // Event Listeners for Table Group
      group.addEventListener('click', (e) => {
        if (state.isOrganizerMode) return; // Prevent selection while dragging
        e.stopPropagation();
        handleTableClick(tableNum);
      });

      // Draggable in Organizer Mode
      if (state.isOrganizerMode) {
        attachTableDragListeners(group, tableNum);
      }

      dom.tablesLayer.appendChild(group);
    });
  }

  function handleTableClick(tableNum) {
    const tableData = state.tablesMap.get(tableNum);
    if (!tableData) return;

    state.selectedTable = tableNum;

    // If there are guests in this table, auto-select the first one to populate the result card nicely
    if (tableData.guests.length > 0) {
      renderGuestResult(tableData.guests[0]);
    }

    highlightTableOnMap(tableNum, true);
  }

  /**
   * Highlights the assigned table on the map,
   * animates the glowing pulse, and draws the smooth guided route path!
   */
  function highlightTableOnMap(tableNum, focusCamera = true) {
    clearMapHighlight();

    const tableGroup = document.getElementById(`svg-table-${tableNum}`);
    if (!tableGroup) return;

    tableGroup.classList.add('selected');

    const tableData = state.tablesMap.get(tableNum);
    if (!tableData) return;

    const cfg = tableData.config;
    const destX = (cfg.x / 100) * SVG_WIDTH;
    const destY = (cfg.y / 100) * SVG_HEIGHT;

    // Position destination pulse & pin
    dom.destOverlay.style.display = 'block';
    dom.destPulse.setAttribute('cx', destX);
    dom.destPulse.setAttribute('cy', destY);
    dom.destPin.setAttribute('transform', `translate(${destX}, ${destY})`);

    // Draw Animated Route Path
    if (state.showRouteLayer) {
      drawNavigationRoute(ENTRANCE_POINT, { x: destX, y: destY });
    }

    // Smooth camera pan to table
    if (focusCamera) {
      centerMapOnCoords(destX, destY, 1.4);
    }
  }

  function clearMapHighlight() {
    dom.tablesLayer.querySelectorAll('.svg-table-group').forEach(el => el.classList.remove('selected'));
    dom.destOverlay.style.display = 'none';
    dom.routeLayer.style.display = 'none';
  }

  /**
   * Generates a smooth, natural cubic Bezier curve route
   * from the South Entrance through the Patio de Armas directly to the table.
   */
  function drawNavigationRoute(start, end) {
    dom.routeLayer.style.display = 'block';

    // Compute Bezier control points to gracefully steer around the central dance floor
    const midY = (start.y + end.y) / 2;
    let cp1x, cp1y, cp2x, cp2y;

    if (end.x < 420) {
      // Curve leftward along western corridor
      cp1x = 440;
      cp1y = start.y - 60;
      cp2x = Math.min(end.x + 40, 360);
      cp2y = midY + 40;
    } else if (end.x > 580) {
      // Curve rightward along eastern corridor
      cp1x = 560;
      cp1y = start.y - 60;
      cp2x = Math.max(end.x - 40, 640);
      cp2y = midY + 40;
    } else {
      // Straight central pathway
      cp1x = 500;
      cp1y = start.y - 50;
      cp2x = end.x;
      cp2y = end.y + 40;
    }

    // Path string with smooth cubic bezier curve
    const pathD = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
    
    dom.routeBg.setAttribute('d', pathD);
    dom.routePath.setAttribute('d', pathD);
  }

  // ============================================================================
  // Pan & Zoom Engine (Mouse & Touch Gestures)
  // ============================================================================
  function initPanZoom() {
    const el = dom.mapContainer;

    // Mouse drag
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Mouse wheel zoom
    el.addEventListener('wheel', onWheel, { passive: false });

    // Touch events for mobile pinch-to-zoom & pan
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
  }

  function updateTransform() {
    dom.viewportGroup.setAttribute(
      'transform',
      `translate(${state.panZoom.x}, ${state.panZoom.y}) scale(${state.panZoom.scale})`
    );
  }

  function onMouseDown(e) {
    if (state.isOrganizerMode && state.drag.activeTableId !== null) return;
    if (e.button !== 0) return; // Left click only

    state.panZoom.isPanning = true;
    state.panZoom.startX = e.clientX - state.panZoom.x;
    state.panZoom.startY = e.clientY - state.panZoom.y;
    dom.venueSvg.classList.add('dragging');
  }

  function onMouseMove(e) {
    if (!state.panZoom.isPanning) return;
    state.panZoom.x = e.clientX - state.panZoom.startX;
    state.panZoom.y = e.clientY - state.panZoom.startY;
    clampPan();
    updateTransform();
  }

  function onMouseUp() {
    state.panZoom.isPanning = false;
    dom.venueSvg.classList.remove('dragging');
  }

  function onWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    zoomAtPoint(e.clientX, e.clientY, zoomFactor);
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      if (state.isOrganizerMode && state.drag.activeTableId !== null) return;
      state.panZoom.isPanning = true;
      state.panZoom.startX = e.touches[0].clientX - state.panZoom.x;
      state.panZoom.startY = e.touches[0].clientY - state.panZoom.y;
      state.panZoom.touchDistance = null;
    } else if (e.touches.length === 2) {
      state.panZoom.isPanning = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      state.panZoom.touchDistance = Math.hypot(dx, dy);
    }
  }

  function onTouchMove(e) {
    if (e.touches.length === 1 && state.panZoom.isPanning) {
      e.preventDefault();
      state.panZoom.x = e.touches[0].clientX - state.panZoom.startX;
      state.panZoom.y = e.touches[0].clientY - state.panZoom.startY;
      clampPan();
      updateTransform();
    } else if (e.touches.length === 2 && state.panZoom.touchDistance !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.hypot(dx, dy);
      const zoomFactor = newDistance / state.panZoom.touchDistance;
      
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      zoomAtPoint(midX, midY, zoomFactor);
      state.panZoom.touchDistance = newDistance;
    }
  }

  function onTouchEnd(e) {
    if (e.touches.length === 0) {
      state.panZoom.isPanning = false;
      state.panZoom.touchDistance = null;
    }
  }

  function zoomAtPoint(clientX, clientY, factor) {
    const rect = dom.venueSvg.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const newScale = Math.min(Math.max(state.panZoom.scale * factor, 0.75), 3.2);

    state.panZoom.x = mouseX - (mouseX - state.panZoom.x) * (newScale / state.panZoom.scale);
    state.panZoom.y = mouseY - (mouseY - state.panZoom.y) * (newScale / state.panZoom.scale);
    state.panZoom.scale = newScale;

    clampPan();
    updateTransform();
  }

  function clampPan() {
    const maxOffset = 600 * state.panZoom.scale;
    state.panZoom.x = Math.min(Math.max(state.panZoom.x, -maxOffset), maxOffset);
    state.panZoom.y = Math.min(Math.max(state.panZoom.y, -maxOffset), maxOffset);
  }

  function centerMapOnCoords(svgX, svgY, targetScale = 1.35) {
    const rect = dom.venueSvg.getBoundingClientRect();
    // Convert SVG viewbox coordinates to screen viewport
    const scaleFactor = rect.width / SVG_WIDTH;
    const screenX = svgX * scaleFactor;
    const screenY = svgY * scaleFactor;

    state.panZoom.scale = targetScale;
    state.panZoom.x = (rect.width / 2) - (screenX * targetScale);
    state.panZoom.y = (rect.height / 2) - (screenY * targetScale);
    
    clampPan();
    updateTransform();
  }

  function resetZoom() {
    state.panZoom.scale = 1;
    state.panZoom.x = 0;
    state.panZoom.y = 0;
    updateTransform();
    showToast('Plano restablecido', '⟲');
  }

  // ============================================================================
  // "Modo Organizador" (Visual Table Drag & Drop Planner)
  // ============================================================================
  function toggleOrganizerMode() {
    state.isOrganizerMode = !state.isOrganizerMode;

    if (state.isOrganizerMode) {
      dom.organizerBanner.classList.add('active');
      dom.btnToggleOrganizer.style.background = 'var(--gold-500)';
      dom.btnToggleOrganizer.style.color = '#fff';
      showToast('Modo Organizador activo: arrastra las mesas libremente', '🛠️');
    } else {
      dom.organizerBanner.classList.remove('active');
      dom.btnToggleOrganizer.style.background = '';
      dom.btnToggleOrganizer.style.color = '';
      showToast('Has salido del Modo Organizador', '✓');
    }

    renderTablesOnSvg();
  }

  function attachTableDragListeners(group, tableNum) {
    function startDrag(e) {
      e.stopPropagation();
      e.preventDefault();

      state.drag.activeTableId = tableNum;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      state.drag.startX = clientX;
      state.drag.startY = clientY;

      const cfg = state.tablesMap.get(tableNum).config;
      state.drag.tableInitialX = (cfg.x / 100) * SVG_WIDTH;
      state.drag.tableInitialY = (cfg.y / 100) * SVG_HEIGHT;

      window.addEventListener('mousemove', onDragMove);
      window.addEventListener('mouseup', onDragEnd);
      window.addEventListener('touchmove', onDragMove, { passive: false });
      window.addEventListener('touchend', onDragEnd);
    }

    function onDragMove(e) {
      if (state.drag.activeTableId !== tableNum) return;
      e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Delta in screen pixels
      const dxScreen = clientX - state.drag.startX;
      const dyScreen = clientY - state.drag.startY;

      // Convert delta to SVG coordinates taking pan & zoom into account
      const rect = dom.venueSvg.getBoundingClientRect();
      const svgScale = (rect.width / SVG_WIDTH) * state.panZoom.scale;

      const dxSvg = dxScreen / svgScale;
      const dySvg = dyScreen / svgScale;

      let newSvgX = state.drag.tableInitialX + dxSvg;
      let newSvgY = state.drag.tableInitialY + dySvg;

      // Clamp within courtyard walls
      newSvgX = Math.min(Math.max(newSvgX, 60), SVG_WIDTH - 60);
      newSvgY = Math.min(Math.max(newSvgY, 50), SVG_HEIGHT - 60);

      // Update SVG transform visually
      group.setAttribute('transform', `translate(${newSvgX.toFixed(1)}, ${newSvgY.toFixed(1)})`);

      // Update state configuration
      const cfg = state.tablesMap.get(tableNum).config;
      cfg.x = parseFloat(((newSvgX / SVG_WIDTH) * 100).toFixed(1));
      cfg.y = parseFloat(((newSvgY / SVG_HEIGHT) * 100).toFixed(1));

      // If route is active on this table, redraw route live!
      if (state.selectedTable === tableNum && state.showRouteLayer) {
        drawNavigationRoute(ENTRANCE_POINT, { x: newSvgX, y: newSvgY });
        dom.destPulse.setAttribute('cx', newSvgX);
        dom.destPulse.setAttribute('cy', newSvgY);
        dom.destPin.setAttribute('transform', `translate(${newSvgX}, ${newSvgY})`);
      }
    }

    function onDragEnd() {
      state.drag.activeTableId = null;
      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
      window.removeEventListener('touchmove', onDragMove);
      window.removeEventListener('touchend', onDragEnd);
    }

    group.addEventListener('mousedown', startDrag);
    group.addEventListener('touchstart', startDrag, { passive: false });
  }

  function copyCoordinatesJson() {
    const exportData = [];
    state.tablesMap.forEach((tableData) => {
      exportData.push(tableData.config);
    });

    const jsonStr = JSON.stringify(exportData, null, 2);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(jsonStr)
        .then(() => showToast('¡Coordenadas JSON copiadas al portapapeles!', '📋'))
        .catch(() => fallbackCopyPrompt(jsonStr));
    } else {
      fallbackCopyPrompt(jsonStr);
    }
  }

  function fallbackCopyPrompt(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('¡Coordenadas JSON copiadas!', '📋');
  }

  function saveCoordinatesLocally() {
    const exportData = [];
    state.tablesMap.forEach(td => exportData.push(td.config));
    try {
      localStorage.setItem('castillo_mesas_config', JSON.stringify(exportData));
      showToast('Distribución guardada en este navegador', '💾');
    } catch (e) {
      showToast('Error al guardar localmente', '⚠️');
    }
  }

  function resetCoordinatesToDefault() {
    localStorage.removeItem('castillo_mesas_config');
    state.tableConfigs = JSON.parse(JSON.stringify(CASTILLO_COORDINATES_DEFAULT));
    processGuestData(state.guests);
    showToast('Posiciones originales restauradas', '🔄');
  }

  // ============================================================================
  // Table Directory Modal
  // ============================================================================
  function renderTableDirectory() {
    let html = '';

    state.tablesMap.forEach((tableData, tableNum) => {
      const cfg = tableData.config;
      const guests = tableData.guests;
      const isPres = tableNum === 0;

      html += `
        <div class="directory-table-card" data-table-num="${tableNum}">
          <div class="directory-table-card-top">
            <span class="directory-table-pill">${isPres ? 'Mesa Presidencial' : `Mesa ${tableNum}`}</span>
            <span class="directory-table-name">${escapeHtml(cfg.nombre)}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--stone-500);">${escapeHtml(cfg.descripcion || '')} &bull; ${guests.length} invitados</div>
          <div class="directory-guest-list">
            ${guests.map(g => `<div class="directory-guest-item" data-guest-id="${g.id}">• ${escapeHtml(g.nombre)}</div>`).join('')}
          </div>
        </div>
      `;
    });

    dom.directoryContainer.innerHTML = html;

    // Attach click events
    dom.directoryContainer.querySelectorAll('.directory-table-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const guestItem = e.target.closest('.directory-guest-item');
        if (guestItem) {
          const gId = parseInt(guestItem.getAttribute('data-guest-id'), 10);
          selectGuestById(gId);
        } else {
          const tNum = parseInt(card.getAttribute('data-table-num'), 10);
          handleTableClick(tNum);
        }
        closeDirectoryModal();
      });
    });
  }

  function openDirectoryModal() {
    dom.modalDirectory.classList.add('active');
  }

  function closeDirectoryModal() {
    dom.modalDirectory.classList.remove('active');
  }

  // ============================================================================
  // File Upload & Dynamic Excel Drag and Drop
  // ============================================================================
  function openUploadModal() {
    dom.modalUpload.classList.add('active');
  }

  function closeUploadModal() {
    dom.modalUpload.classList.remove('active');
  }

  function handleFileSelected(file) {
    if (!file) return;

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (Array.isArray(json)) {
            const list = json.map((g, idx) => ({
              id: g.id || idx + 1,
              nombre: g.nombre || g['Nombre y Apellido'] || '',
              mesa: parseTableNumber(g.mesa || g['Número de mesa'] || 0)
            }));
            processGuestData(list);
            closeUploadModal();
            showToast(`¡Cargados ${list.length} comensales desde ${file.name}!`, '✓');
          }
        } catch (err) {
          alert('Error al procesar el archivo JSON: formato no válido');
        }
      };
      reader.readAsText(file);
    } else {
      // Excel (.xlsx, .xls) or CSV via SheetJS
      reader.onload = (e) => {
        try {
          if (typeof XLSX === 'undefined') {
            alert('Librería SheetJS aún no cargada. Por favor espera un momento.');
            return;
          }
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          const guests = parseExcelRows(rows);
          if (guests.length > 0) {
            processGuestData(guests);
            closeUploadModal();
            showToast(`¡Cargados ${guests.length} comensales desde ${file.name}!`, '✓');
          } else {
            alert('No se encontraron filas válidas de comensales en el archivo.');
          }
        } catch (err) {
          console.error(err);
          alert('Error al leer el archivo Excel: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // ============================================================================
  // Lightweight Celebratory Confetti Engine
  // ============================================================================
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimId = null;

  function initConfetti() {
    const canvas = dom.confettiCanvas;
    confettiCtx = canvas.getContext('2d');
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);
  }

  function resizeConfetti() {
    dom.confettiCanvas.width = window.innerWidth;
    dom.confettiCanvas.height = window.innerHeight;
  }

  function triggerCelebration() {
    confettiParticles = [];
    const colors = ['#C59F4E', '#D8B568', '#E7CC8E', '#8C6A24', '#FFFFFF', '#FAF3E0'];

    for (let i = 0; i < 65; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight * 0.4,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1
      });
    }

    if (!confettiAnimId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, dom.confettiCanvas.width, dom.confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.012;

      if (p.opacity <= 0 || p.y > dom.confettiCanvas.height) {
        confettiParticles.splice(i, 1);
        continue;
      }

      confettiCtx.save();
      confettiCtx.globalAlpha = Math.max(p.opacity, 0);
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();
    }

    if (confettiParticles.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimId = null;
      confettiCtx.clearRect(0, 0, dom.confettiCanvas.width, dom.confettiCanvas.height);
    }
  }

  // ============================================================================
  // Global Event Listeners & Binding
  // ============================================================================
  function bindEvents() {
    // Search input
    dom.searchInput.addEventListener('input', handleSearchInput);
    dom.searchInput.addEventListener('focus', () => {
      if (dom.searchInput.value.trim().length > 0) {
        handleSearchInput({ target: dom.searchInput });
      }
    });

    dom.searchClearBtn.addEventListener('click', () => {
      dom.searchInput.value = '';
      dom.searchInput.focus();
      dom.searchClearBtn.classList.remove('active');
      closeAutocomplete();
      dismissGuestResult();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dom.searchInput.contains(e.target) && !dom.searchDropdown.contains(e.target)) {
        closeAutocomplete();
      }
    });

    // Dismiss guest result card
    dom.btnDismissResult.addEventListener('click', dismissGuestResult);

    // Focus table from result badge
    dom.btnFocusTableMap.addEventListener('click', () => {
      if (state.selectedGuest) {
        highlightTableOnMap(state.selectedGuest.mesa, true);
        dom.mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Floating Map Controls
    dom.btnZoomIn.addEventListener('click', () => {
      const rect = dom.venueSvg.getBoundingClientRect();
      zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, 1.25);
    });

    dom.btnZoomOut.addEventListener('click', () => {
      const rect = dom.venueSvg.getBoundingClientRect();
      zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, 0.8);
    });

    dom.btnZoomReset.addEventListener('click', resetZoom);

    // Route layer toggle
    dom.btnToggleRouteLayer.addEventListener('click', () => {
      state.showRouteLayer = !state.showRouteLayer;
      dom.routeLayer.style.display = state.showRouteLayer ? 'block' : 'none';
      dom.routeLayerLabel.textContent = state.showRouteLayer ? 'Ocultar Ruta' : 'Mostrar Ruta';
      showToast(state.showRouteLayer ? 'Ruta de acceso visible' : 'Ruta oculta', '📍');
    });

    // Organizer toggles
    dom.btnToggleOrganizer.addEventListener('click', toggleOrganizerMode);
    dom.btnCloseOrganizer.addEventListener('click', toggleOrganizerMode);
    dom.footerAdminToggle.addEventListener('click', toggleOrganizerMode);
    dom.btnCopyJson.addEventListener('click', copyCoordinatesJson);
    dom.btnSaveLocal.addEventListener('click', saveCoordinatesLocally);
    dom.btnResetPositions.addEventListener('click', resetCoordinatesToDefault);

    // Directory modal
    dom.btnOpenDirectory.addEventListener('click', openDirectoryModal);
    dom.btnCloseDirectory.addEventListener('click', closeDirectoryModal);
    dom.modalDirectory.addEventListener('click', (e) => {
      if (e.target === dom.modalDirectory) closeDirectoryModal();
    });

    // Upload modal
    dom.btnOpenUpload.addEventListener('click', openUploadModal);
    dom.btnCloseUpload.addEventListener('click', closeUploadModal);
    dom.modalUpload.addEventListener('click', (e) => {
      if (e.target === dom.modalUpload) closeUploadModal();
    });

    dom.uploadDropzone.addEventListener('click', () => dom.excelFileInput.click());
    dom.excelFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelected(e.target.files[0]);
      }
    });

    // Drag & drop on dropzone
    dom.uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dom.uploadDropzone.classList.add('dragover');
    });

    dom.uploadDropzone.addEventListener('dragleave', () => {
      dom.uploadDropzone.classList.remove('dragover');
    });

    dom.uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dom.uploadDropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        handleFileSelected(e.dataTransfer.files[0]);
      }
    });

    dom.btnReloadDefault.addEventListener('click', () => {
      loadGuestData();
      closeUploadModal();
    });

    // Global drag and drop: drag any excel anywhere onto the page!
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.name.match(/\.(xlsx|xls|csv|json)$/i)) {
          e.preventDefault();
          handleFileSelected(file);
        }
      }
    });

    // Keyboard ESC to close modals / search
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAutocomplete();
        closeDirectoryModal();
        closeUploadModal();
      }
    });
  }

  // Start the application when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

# 🏰 Boda Real en el Castillo de Santiago • Localizador Interactivo de Mesas

Una aplicación web interactiva, *mobile-first* y de estética nupcial de lujo, diseñada específicamente para ser consultada por los invitados mediante el escaneo de un código QR en el **Patio de Armas del Castillo de Santiago** (Sanlúcar de Barrameda, Cádiz, España).

---

## 🌟 Características Principales

### 1. Carga Dinámica de Datos (Excel / JSON / SheetJS)
- **Lectura Automática**: La aplicación lee dinámicamente el archivo `invitados.xlsx` ubicado en la raíz mediante la librería cliente **SheetJS**.
- **Tolerancia a Fallos y Modo Offline**: Si se abre directamente mediante doble clic (`file://`) o sin conexión, conmuta automáticamente a `invitados.json` o al conjunto de datos de contingencia con 104 invitados reales.
- **Estructura del Excel**:
  - **Columna A**: Número o ID
  - **Columna B**: Nombre y Apellido
  - **Columna C**: Número de mesa
- **Cálculo Automático**: Detecta dinámicamente el número máximo de mesas ($1$ a $N$), calcula la capacidad por mesa y agrupa a todos los comensales.
- **Actualizador de Última Hora**: Botón discreto en la barra superior y soporte de **Arrastrar y Soltar (Drag & Drop)** para subir un nuevo archivo `.xlsx`, `.xls` o `.csv` en cualquier momento, recalculando todo al instante en el navegador.

### 2. Buscador Predictivo y Ficha de Invitado
- **Búsqueda en Tiempo Real**: Búsqueda insensible a mayúsculas y tildes (*accent-insensitive* y *fuzzy*).
- **Ficha de Asignación de Mesa**: Al seleccionar un nombre:
  - Destaca el número de mesa en una tarjeta elegante con el nombre temático (ej. *Mesa 4 • Doñana* o *Mesa Presidencial*).
  - Muestra la lista completa de todos los **acompañantes de mesa**, identificando al usuario con la etiqueta `(Tú)`.
  - Proporciona una **guía de orientación paso a paso** para llegar desde el arco de entrada.
  - Lanza una sutil animación de confeti dorado festivo.

### 3. Plano Interactivo del Patio de Armas (SVG Vectorial)
- **Fidelidad Histórica (~766 m²)**:
  - Patio trapezoidal del siglo XV con muros almenados de sillería andaluza.
  - **Entrada Principal (Arco de Armas)** en el lateral sur.
  - **Estrado Presidencial** frente al Muro de Honor en el extremo norte.
  - **Torre del Homenaje** y **Aseos de Señoras y Caballeros** en el ala oeste.
  - **Barra de Cóctel & Vinos de Sanlúcar (Manzanilla)** y **Photocall** en el ala este.
  - **Pista de Baile central** y Rosa de los Vientos.
- **Ruta Guiada Animada**: Traza una curva fluida de acceso desde la puerta principal hasta la mesa asignada, con flujo animado de guiones dorados y baliza pulsante en destino.
- **Navegación Táctil**: Desplazamiento (*pan*) y zoom mediante pellizco táctil (*pinch-to-zoom*) en smartphones, rueda del ratón o botones flotantes (`+`, `−`, `⟲`).

### 4. Panel Privado del Organizador y Editor Integral del Recinto (`organizador.html`)
- **Acceso Exclusivo**: El modo de edición está completamente separado y oculto de la web pública de invitados (`index.html`). Solo tú o quien disponga del enlace directo a `organizador.html` puede gestionar el recinto.
- **Edición Total de Instalaciones y Elementos**:
  - Todos los elementos del recinto son **editables, arrastrables, rotables (0-360°), borrables y creables**:
    - 🚪 **Entrada Principal** (Arco del Patio de Armas)
    - ✦ **Estrado Presidencial** (Muro de Honor de los novios)
    - 🍷 **Barra de Cóctel** (Vinos y Manzanilla de Sanlúcar)
    - 📸 **Photocall & Rincón de Firmas**
    - 🚻 **Servicios Sanitarios** (Aseos de Señoras y Caballeros)
    - 🧭 **Rosa de los Vientos / Brújula de Orientación**
    - 💃 **Pista de Baile Central**
    - 🏰 **Torre del Homenaje** (S. XV)
- **Creador de Nuevos Elementos (Catálogo y Plantillas)**:
  - Botón **"＋ Crear Elemento"** para incorporar nuevos espacios al enlace según sea necesario:
    - Mesas circulares o imperiales
    - Barras de cóctel adicionales
    - Zona Chillout & descanso
    - Escenario / Cabina de DJ
    - Mesa Dulce / Candy Bar
    - Centros decorativos / Flores
    - Aseos adicionales o accesos secundarios
- **Renombrado y Edición de Mesas en Vivo**:
  - Cambia los nombres temáticos de las mesas directamente en la página (*Albariza, Manzanilla, Bajo de Guía, Doñana*, etc.) sin tocar código.
  - Ajusta el número de mesa, capacidad de sillas y descripción/parentesco.
  - Los nuevos nombres se reflejan de inmediato en las etiquetas flotantes del plano SVG, en el listado del inspector y en la ficha del invitado.
- **Rotación Milimétrica**: Girador rápido de `↺ -15°` / `↻ +15°` o deslizador continuo de `0°` a `360°` para orientar mesas y elementos en cualquier ángulo.
- **HUD y Coordenadas en Vivo**: Muestra la posición $X\%, Y\%$ y rotación mientras arrastras cualquier elemento sobre el plano.
- **Sincronización en Tiempo Real entre Pestañas**: Al pulsar **"Guardar en este Navegador"**, la web de invitados (`index.html`) detecta los cambios mediante eventos de almacenamiento y actualiza el plano de inmediato.
- **Exportación JSON Definitiva**: Permite descargar o copiar `mesas-config.json` para dejar la configuración permanente para cualquier dispositivo.

---

## 🚀 Enlaces de la Aplicación

- **📱 Web Pública para Invitados (Código QR)**: `http://localhost:8085/` o [index.html](file:///g:/Mi%20unidad/Benja/Proyectos%20IA/Paginas%20Web/Mesas-Matri-web/index.html)
- **🛠️ Panel Privado de Organización**: `http://localhost:8085/organizador.html` o [organizador.html](file:///g:/Mi%20unidad/Benja/Proyectos%20IA/Paginas%20Web/Mesas-Matri-web/organizador.html)

---

## 📁 Estructura del Proyecto

```
Mesas-Matri-web/
├── index.html            # Web pública para invitados (QR): buscador, ruta, plano de sólo lectura
├── app.js                # Lógica del invitado: autocompletado, ficha, ruta animada, directorio
├── organizador.html      # Panel privado del organizador con drag & drop de mesas
├── organizador.js        # Lógica de edición: inspector, HUD de coordenadas, guardado y exportación
├── styles.css            # Sistema de diseño de lujo nupcial compartido
├── mesas-config.json     # Coordenadas maestras y nombres temáticos de las mesas
├── invitados.xlsx        # Hoja de cálculo principal con los 104 invitados
├── invitados.json        # Copia JSON idéntica para contingencias offline
├── generate_data.py      # Script generador de la base de datos de ejemplo
├── vendor/
│   └── xlsx.full.min.js  # Copia local de SheetJS para funcionamiento 100% offline
└── README.md             # Documentación del proyecto
```

---

## 🎨 Paleta de Diseño & Tipografías

- **Tipografía**: *Cinzel* (titulares renacentistas/castillanos), *Plus Jakarta Sans* (cuerpo de alta legibilidad móvil) y *Alex Brush* (acentos caligráficos).
- **Colores**: Oro Sanlúcar (`#C59F4E`, `#D8B568`), Piedra de Sillería (`#F4F0E8`, `#FAF8F4`), Pizarra Cálida (`#1D1A17`, `#25221E`).

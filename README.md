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

### 4. Modo Organizador (Drag & Drop de Mesas para los Novios)
- Permite a los novios o wedding planners arrastrar las mesas directamente sobre el plano interactivo para probar distribuciones reales.
- **Coordenadas en Porcentajes**: Separadas en `mesas-config.json` (`{ "id": 1, "x": 26.0, "y": 32.0 }`).
- **Botón "Copiar JSON"**: Copia las nuevas coordenadas listas para pegar en el archivo de configuración.
- **Botón "Guardar"**: Almacena las coordenadas en el `localStorage` del navegador para que los cambios persistan en ese dispositivo.

---

## 🚀 Cómo Ejecutar la Aplicación

### Opción 1: Servidor Local (Recomendado para lectura nativa de Excel)
Puedes iniciar un servidor ligero con Python o Node:

```bash
# Con Python
python -m http.server 8085

# Luego abre en tu navegador:
# http://localhost:8085
```

### Opción 2: Abrir directamente `index.html`
Puedes hacer doble clic en `index.html` en cualquier navegador moderno. La aplicación activará de forma inteligente el motor de datos local y admitirá que arrastres tu archivo `invitados.xlsx` sobre la pantalla.

---

## 📁 Estructura del Proyecto

```
Mesas-Matri-web/
├── index.html            # Estructura semántica, accesibilidad y maquetación SVG
├── styles.css            # Sistema de diseño de lujo (paleta piedra de castillo y oro)
├── app.js                # Lógica: SheetJS, buscador, mapa SVG, ruta, drag & drop
├── mesas-config.json     # Coordenadas y nombres temáticos de las mesas
├── invitados.xlsx        # Hoja de cálculo principal con los 104 invitados
├── invitados.json        # Copia JSON idéntica para máxima compatibilidad
├── generate_data.py      # Script Python que generó la base de datos de ejemplo
├── vendor/
│   └── xlsx.full.min.js  # Copia local de SheetJS para funcionamiento 100% offline
└── README.md             # Esta documentación
```

---

## 🎨 Paleta de Diseño & Tipografías

- **Tipografía**: *Cinzel* (titulares renacentistas/castillanos), *Plus Jakarta Sans* (cuerpo de alta legibilidad móvil) y *Alex Brush* (acentos caligráficos).
- **Colores**: Oro Sanlúcar (`#C59F4E`, `#D8B568`), Piedra de Sillería (`#F4F0E8`, `#FAF8F4`), Pizarra Cálida (`#1D1A17`, `#25221E`).

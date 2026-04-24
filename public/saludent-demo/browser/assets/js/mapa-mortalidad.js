/**
 * Mapa de Mortalidad Cardiovascular - Argentina
 * Componente standalone para usar en guías HTML
 */

class MapaMortalidad {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);

    if (!this.container) {
      console.error('Container not found:', containerId);
      return;
    }
    this.programColor = options.programColor || '#ef5350';
    this.currentGender = 'mujeres';
    this.selectedProvince = null;
    this.selectedProvinceId = null;
    this.data = null;

    this.init();
  }

  async init() {
    await this.loadData();
    this.render();
    await this.loadSVG();
  }

  async loadData() {
    try {
      const response = await fetch('../data/mortalidad-cardio.json');
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async loadSVG() {
    try {
      const response = await fetch('../pictures/ArgenMAP/ar.svg');
      const svgText = await response.text();

      const svgContainer = this.container.querySelector('.map-svg-container');
      svgContainer.innerHTML = svgText;

      // Ajustar viewBox para recortar espacio vacío y centrar
      const svg = svgContainer.querySelector('svg');
      if (svg) {
        // ViewBox ajustado: 20% más chico, margin vertical reducido
        svg.setAttribute('viewBox', '198 -2 624 1017');
      }

      // Esperar a que el SVG se renderice completamente
      setTimeout(() => this.setupInteraction(), 200);
    } catch (error) {
      console.error('Error loading SVG:', error);
    }
  }

  setupInteraction() {
    const svgContainer = this.container.querySelector('.map-svg-container');
    const svg = svgContainer.querySelector('svg');

    if (!svg) {
      console.error('SVG not found');
      return;
    }

    // Buscar el grupo features que contiene las provincias
    const featuresGroup = svg.querySelector('#features');
    if (!featuresGroup) {
      console.error('Features group not found');
      return;
    }

    const provinceGroups = featuresGroup.querySelectorAll('g[id^="AR"]');

    provinceGroups.forEach(group => {
      const id = group.getAttribute('id');
      if (!id) return;

      // Remover atributos que causan el outline azul
      group.removeAttribute('tabindex');
      group.style.outline = 'none';

      this.updateProvinceColor(group, id);

      // Click handler
      group.addEventListener('click', (e) => {
        e.preventDefault();
        this.onProvinceClick(id);
      });

      // Touch feedback suave
      group.addEventListener('touchstart', (e) => {
        const paths = group.querySelectorAll('path');
        paths.forEach(path => path.style.opacity = '0.85');
      });

      group.addEventListener('touchend', (e) => {
        const paths = group.querySelectorAll('path');
        paths.forEach(path => path.style.opacity = '1');
      });
    });
  }

  updateProvinceColor(group, provinceId) {
    const genderData = this.data[this.currentGender];
    const provinceData = genderData.data[provinceId];

    if (!provinceData) return;

    const quintile = genderData.quintiles.find(q => q.q === provinceData.q);
    if (!quintile) return;

    const paths = group.querySelectorAll('path');
    paths.forEach(path => {
      // Usar style para sobreescribir CSS del SVG
      path.style.fill = quintile.color;
      path.style.stroke = '#ffffff';
      path.style.strokeWidth = '0.5';
      path.style.cursor = 'pointer';
      path.style.transition = 'opacity 0.2s ease';
      path.style.outline = 'none';

      // Prevenir selección y outline
      path.style.webkitTapHighlightColor = 'transparent';
      path.style.webkitUserSelect = 'none';
      path.style.userSelect = 'none';
    });
  }

  onProvinceClick(provinceId) {
    const provinceData = this.data[this.currentGender].data[provinceId];
    if (!provinceData) return;

    // Remover highlight de la provincia anterior
    if (this.selectedProvinceId && this.selectedProvinceId !== provinceId) {
      this.resetProvinceStroke(this.selectedProvinceId);
    }

    this.selectedProvince = provinceData;
    this.selectedProvinceId = provinceId;
    this.updateSelectedInfo();

    // Destacar provincia seleccionada
    this.highlightProvince(provinceId);
  }

  highlightProvince(provinceId) {
    const svgContainer = this.container.querySelector('.map-svg-container');
    const svg = svgContainer.querySelector('svg');
    if (!svg) return;

    const featuresGroup = svg.querySelector('#features');
    if (!featuresGroup) return;

    const group = featuresGroup.querySelector(`#${provinceId}`);
    if (!group) return;

    // Mover el grupo al final del DOM para que se renderice arriba
    featuresGroup.appendChild(group);

    const paths = group.querySelectorAll('path');
    paths.forEach(path => {
      path.style.stroke = '#1B2A4A';
      path.style.strokeWidth = '2.5';
    });
  }

  resetProvinceStroke(provinceId) {
    const svgContainer = this.container.querySelector('.map-svg-container');
    const svg = svgContainer.querySelector('svg');
    if (!svg) return;

    const featuresGroup = svg.querySelector('#features');
    if (!featuresGroup) return;

    const group = featuresGroup.querySelector(`#${provinceId}`);
    if (!group) return;

    const paths = group.querySelectorAll('path');
    paths.forEach(path => {
      path.style.stroke = '#ffffff';
      path.style.strokeWidth = '0.5';
    });
  }

  toggleGender() {
    this.currentGender = this.currentGender === 'mujeres' ? 'varones' : 'mujeres';
    this.selectedProvince = null;
    this.selectedProvinceId = null;

    this.updateGenderButtons();
    this.updateSelectedInfo();
    this.updateLegend();

    // Actualizar colores del mapa
    const svgContainer = this.container.querySelector('.map-svg-container');
    const svg = svgContainer.querySelector('svg');
    if (!svg) return;

    const featuresGroup = svg.querySelector('#features');
    if (!featuresGroup) return;

    const provinceGroups = featuresGroup.querySelectorAll('g[id^="AR"]');
    provinceGroups.forEach(group => {
      const id = group.getAttribute('id');
      if (id) this.updateProvinceColor(group, id);
    });
  }

  updateGenderButtons() {
    const btns = this.container.querySelectorAll('.toggle-btn');
    btns.forEach(btn => {
      if (btn.dataset.gender === this.currentGender) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  updateSelectedInfo() {
    const infoContainer = this.container.querySelector('.selected-info');

    if (this.selectedProvince) {
      const unit = this.data[this.currentGender].unit;
      infoContainer.className = 'selected-info';
      infoContainer.innerHTML = `
        <div class="info-province">${this.selectedProvince.name}</div>
        <div class="info-value">${this.selectedProvince.value} <span class="info-unit">${unit}</span></div>
      `;
    } else {
      infoContainer.className = 'selected-info placeholder';
      infoContainer.innerHTML = '<div class="info-hint">Tocá una provincia para ver los datos</div>';
    }
  }

  updateLegend() {
    const genderData = this.data[this.currentGender];
    const legendItems = this.container.querySelector('.legend-items-horizontal');

    legendItems.innerHTML = genderData.quintiles.map(q => `
      <div class="legend-item">
        <div class="legend-color" style="background: ${q.color}"></div>
        <div class="legend-label">
          <span class="legend-q">Q${q.q}</span>
          <span class="legend-range">${q.range}</span>
        </div>
      </div>
    `).join('');

    // Actualizar título de unidad
    const legendTitle = this.container.querySelector('.legend-unit-title');
    if (legendTitle) {
      legendTitle.textContent = genderData.unit;
    }

    this.container.querySelector('.legend-source').innerHTML = `
      <strong>Fuente:</strong> Área de Vigilancia de la Salud y Monitoreo de Programas de la DNAIENT en base a registros de mortalidad de la DEIS. Argentina, ${genderData.year}.
    `;
  }

  render() {
    if (!this.data) {
      console.error('No data available for rendering');
      return;
    }

    this.container.innerHTML = `
      <div class="mapa-mortalidad">
        <div class="map-header">
          <h2 class="map-title">Mortalidad cardiovascular</h2>
          <div class="gender-toggle">
            <button class="toggle-btn active" data-gender="mujeres">Mujeres</button>
            <button class="toggle-btn" data-gender="varones">Varones</button>
          </div>
        </div>

        <div class="map-container">
          <div class="map-legend-horizontal">
            <div class="legend-unit-title">${this.data.mujeres.unit}</div>
            <div class="legend-items-horizontal"></div>
          </div>

          <div class="map-svg-container"></div>

          <div class="selected-info placeholder">
            <div class="info-hint">Tocá una provincia para ver los datos</div>
          </div>
        </div>

        <div class="legend">
          <div class="legend-source"></div>
        </div>
      </div>
    `;

    // Event listeners
    const buttons = this.container.querySelectorAll('.toggle-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => this.toggleGender());
    });

    this.updateLegend();
  }
}

/**
 * mock-data.js — datos ficticios para demo del portfolio
 * No contiene datos médicos ni personales reales.
 */

window.MOCK_MODE = true;

// ── Usuarios ──────────────────────────────────────────────────────────────

window.MOCK_USERS = {
  agente: {
    id: 1, auth_uid: 'mock-uid-agente',
    nombre: 'Laura', apellido: 'González',
    email: 'laura.gonzalez@demo.salud.ar',
    provincia: 'Buenos Aires', localidad: 'La Matanza',
    region: 'Región Sanitaria VI',
    establecimiento: 'CAPS Dr. Ramón Carrillo', zona: 'Zona Norte',
    nivel_acceso: 'Agente', accepted_tyc: true,
  },
  supervisor: {
    id: 2, auth_uid: 'mock-uid-supervisor',
    nombre: 'Carla', apellido: 'Vásquez',
    email: 'carla.vasquez@demo.salud.ar',
    provincia: 'Buenos Aires', localidad: 'La Matanza',
    region: 'Región Sanitaria VI',
    establecimiento: 'CAPS Dr. Ramón Carrillo', zona: 'Zona Norte',
    nivel_acceso: 'supervisor', accepted_tyc: true,
  },
  admin: {
    id: 3, auth_uid: 'mock-uid-admin',
    nombre: 'Diego', apellido: 'Ferreyra',
    email: 'diego.ferreyra@demo.salud.ar',
    provincia: 'Buenos Aires', localidad: 'La Matanza',
    region: 'Región Sanitaria VI',
    establecimiento: 'Dirección Regional', zona: 'Regional VI',
    nivel_acceso: 'admin_provincial', accepted_tyc: true,
  },
};

// ── Rondas ────────────────────────────────────────────────────────────────

window.MOCK_RONDAS = [
  {
    id: 1,
    nombre: 'Ronda Invierno 2024',
    descripcion: 'Relevamiento invernal — zona norte La Matanza',
    caps: 'CAPS Dr. Ramón Carrillo',
    fecha_desde: '2024-06-01', fecha_hasta: '2024-08-31',
    provincia: 'Buenos Aires', region: 'Región Sanitaria VI', localidad: 'La Matanza',
    created_at: '2024-05-15T00:00:00Z',
  },
  {
    id: 2,
    nombre: 'Ronda Primavera 2024',
    descripcion: 'Relevamiento primaveral — zona norte La Matanza',
    caps: 'CAPS Dr. Ramón Carrillo',
    fecha_desde: '2024-09-01', fecha_hasta: '2024-11-30',
    provincia: 'Buenos Aires', region: 'Región Sanitaria VI', localidad: 'La Matanza',
    created_at: '2024-08-20T00:00:00Z',
  },
];

// ── Relevamientos ─────────────────────────────────────────────────────────

window.MOCK_RELEVAMIENTOS = [
  {
    id: 1, ronda_id: 1, agente_id: 1,
    identi: 'Familia Rodríguez — Gral. Paz 1423',
    estado: 'enviado',
    created_at: '2024-06-15T10:00:00Z', updated_at: '2024-06-15T14:30:00Z',
  },
  {
    id: 2, ronda_id: 1, agente_id: 1,
    identi: 'Familia Sánchez — Perón 876',
    estado: 'no_enviado',
    created_at: '2024-06-20T09:00:00Z', updated_at: '2024-06-20T11:00:00Z',
  },
  {
    id: 3, ronda_id: 2, agente_id: 1,
    identi: 'Torres, Marcos — Mitre 234',
    estado: 'borrador',
    created_at: '2024-09-10T10:00:00Z', updated_at: '2024-09-10T10:00:00Z',
  },
];

// ── Módulo Visita ─────────────────────────────────────────────────────────

window.MOCK_MODULOS_VISITA = [
  {
    id: 1, relevamiento_id: 1,
    fecha_visita:       '2024-06-15',
    tipo_visita:        'Ronda',
    tipo_zona:          'Urbana',
    direccion:          'Gral. Paz 1423, manzana 12, casa 5',
    manzana:            'M-12 C-05',
    situacion_vivienda: 'Habitada',
    acceso_vivienda:    'Accedió',
    telefono1: '11-4567-8901', telefono2: null, telefono3: null,
  },
  {
    id: 2, relevamiento_id: 2,
    fecha_visita:       '2024-06-20',
    tipo_visita:        'Ronda',
    tipo_zona:          'Urbana',
    direccion:          'Av. Perón 876, piso 3 dpto B',
    manzana:            'M-08 C-11',
    situacion_vivienda: 'Habitada',
    acceso_vivienda:    'Accedió',
    telefono1: '11-3456-7890', telefono2: null, telefono3: null,
  },
  {
    id: 3, relevamiento_id: 3,
    fecha_visita:       '2024-09-10',
    tipo_visita:        'Censo',
    tipo_zona:          'Urbana',
    direccion:          'Mitre 234',
    manzana:            'M-03 C-02',
    situacion_vivienda: 'Habitada',
    acceso_vivienda:    'Accedió',
    telefono1: '11-9876-5432', telefono2: null, telefono3: null,
  },
];

// ── Módulo Vivienda ───────────────────────────────────────────────────────

window.MOCK_MODULOS_VIVIENDA = [
  {
    // REL 1 — Familia Rodríguez: casa, 4 habitantes, perro + gato
    id: 1, relevamiento_id: 1,
    identificacion:       'Casa particular',
    tipo_vivienda:        'Casa A',
    cant_dormitorios:     3,
    cant_habitantes:      4,
    luz_electrica:        'Sí',
    sistema_cocina:       'Red de gas natural',
    red_cloacal:          'Sí, conectadas',
    agua_red_publica:     'Sí',
    recoleccion_residuos: '6 o más veces por semana',
    cant_no_leer_escribir: 0,
    primario_incompleto:  'No',
    secundario_incompleto:'No',
    fuente_ingreso:       'Trabajo formal',
    hay_desocupados:      'No',
    presencia_animales:   ['Ninguno'],
    reservorios_agua:     'No',
    acciones_larvas:      'Sí',
    vigilancia_entomologica: 'No',
    consejeria_dengue:    'Sí',
    cant_perros: 1, perros_vacunados: 1,
    cant_gatos:  1, gatos_vacunados:  1,
    animales_sin_control: 'No',
  },
  {
    // REL 2 — Pareja Sánchez: departamento, 2 habitantes, sin mascotas
    id: 2, relevamiento_id: 2,
    identificacion:       'Departamento',
    tipo_vivienda:        'Departamento',
    cant_dormitorios:     1,
    cant_habitantes:      2,
    luz_electrica:        'Sí',
    sistema_cocina:       'Red de gas natural',
    red_cloacal:          'Sí, conectadas',
    agua_red_publica:     'Sí',
    recoleccion_residuos: '6 o más veces por semana',
    cant_no_leer_escribir: 0,
    primario_incompleto:  'No',
    secundario_incompleto:'No',
    fuente_ingreso:       'Trabajo formal',
    hay_desocupados:      'No',
    presencia_animales:   ['Ninguno'],
    reservorios_agua:     'No',
    acciones_larvas:      'No',
    vigilancia_entomologica: 'No',
    consejeria_dengue:    'Sí',
    cant_perros: 0, perros_vacunados: 0,
    cant_gatos:  0, gatos_vacunados:  0,
    animales_sin_control: 'No',
  },
  {
    // REL 3 — Torres Marcos: casilla, 1 habitante, 1 perro + 1 gato sin control
    id: 3, relevamiento_id: 3,
    identificacion:       'Casa particular',
    tipo_vivienda:        'Casilla',
    cant_dormitorios:     2,
    cant_habitantes:      1,
    luz_electrica:        'Sí',
    sistema_cocina:       'Gas en garrafa',
    red_cloacal:          'No',
    agua_red_publica:     'Sí',
    recoleccion_residuos: '3 a 5 veces por semana',
    cant_no_leer_escribir: 0,
    primario_incompleto:  'No',
    secundario_incompleto:'No',
    fuente_ingreso:       'Trabajo informal',
    hay_desocupados:      'No',
    presencia_animales:   ['Roedores'],
    reservorios_agua:     'No',
    acciones_larvas:      'No',
    vigilancia_entomologica: 'No',
    consejeria_dengue:    'Sí',
    cant_perros: 1, perros_vacunados: 1,
    cant_gatos:  1, gatos_vacunados:  0,
    animales_sin_control: 'Sí',
  },
];

// ── Módulo Sistemas ───────────────────────────────────────────────────────

window.MOCK_MODULOS_SISTEMAS = [
  {
    id: 1, relevamiento_id: 1,
    recurren_caps:        'Sí',
    referencia_salud:     ['Al hospital de la zona', 'Al centro de salud de mi área'],
    acceso_medicamentos:  ['Se los brinda el centro de salud en forma gratuita', 'Los compra sin descuento'],
    obtencion_turno:      ['De manera presencial en el centro de salud', 'Por vía telefónica'],
    demora_turnos:        'Menos de 1 mes',
  },
  {
    id: 2, relevamiento_id: 2,
    recurren_caps:        'No',
    referencia_salud:     ['Al hospital de la zona'],
    acceso_medicamentos:  ['Los compra sin descuento'],
    obtencion_turno:      ['De manera presencial en el centro de salud'],
    demora_turnos:        'Entre 1 y 2 meses',
  },
  {
    id: 3, relevamiento_id: 3,
    recurren_caps:        'Sí',
    referencia_salud:     ['Al centro de salud de mi área'],
    acceso_medicamentos:  ['Se los brinda el centro de salud en forma gratuita'],
    obtencion_turno:      ['Por medio del Agente Sanitario'],
    demora_turnos:        'Menos de 1 mes',
  },
];

// ── Pacientes ─────────────────────────────────────────────────────────────

window.MOCK_PACIENTES = [
  // Familia Rodríguez — 4 miembros
  {
    id: 1, relevamiento_id: 1, nro: 1,
    apellido: 'Rodríguez', nombre: 'Lucía',
    fecha_nacimiento: '1978-03-15', sexo: 'Femenino', dni: '28456123',
    situacion_vivienda: 'Ocupante', tel: '11-4567-8901',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: 'No pertenece',
  },
  {
    id: 2, relevamiento_id: 1, nro: 2,
    apellido: 'Rodríguez', nombre: 'Mario',
    fecha_nacimiento: '1975-11-02', sexo: 'Masculino', dni: '25789012',
    situacion_vivienda: 'Ocupante', tel: '11-4567-8901',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: 'No pertenece',
  },
  {
    id: 3, relevamiento_id: 1, nro: 3,
    apellido: 'Rodríguez', nombre: 'Agustín',
    fecha_nacimiento: '2006-07-20', sexo: 'Masculino', dni: '46234567',
    situacion_vivienda: 'Ocupante', tel: '',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: 'No pertenece',
  },
  {
    id: 4, relevamiento_id: 1, nro: 4,
    apellido: 'Rodríguez', nombre: 'Valentina',
    fecha_nacimiento: '2009-02-08', sexo: 'Femenino', dni: '48901234',
    situacion_vivienda: 'Ocupante', tel: '',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: 'No pertenece',
  },

  // Pareja Sánchez — 2 miembros
  {
    id: 5, relevamiento_id: 2, nro: 1,
    apellido: 'Sánchez', nombre: 'Elena',
    fecha_nacimiento: '1994-09-12', sexo: 'Femenino', dni: '39876543',
    situacion_vivienda: 'Ocupante', tel: '11-3456-7890',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: 'No pertenece',
  },
  {
    id: 6, relevamiento_id: 2, nro: 2,
    apellido: 'Sánchez', nombre: 'Rodrigo',
    fecha_nacimiento: '1992-04-27', sexo: 'Masculino', dni: '37654321',
    situacion_vivienda: 'Ocupante', tel: '11-3456-7890',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: 'No pertenece',
  },

  // Torres Marcos — solo
  {
    id: 7, relevamiento_id: 3, nro: 1,
    apellido: 'Torres', nombre: 'Marcos',
    fecha_nacimiento: '1983-11-30', sexo: 'Masculino', dni: '32109876',
    situacion_vivienda: 'Ocupante', tel: '11-9876-5432',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: 'No pertenece',
  },
];

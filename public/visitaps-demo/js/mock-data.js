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
    tipo_vivienda:        'Casa',
    cant_dormitorios:     3,
    cant_habitantes:      4,
    luz_electrica:        'Red eléctrica',
    sistema_cocina:       'Gas de red',
    red_cloacal:          'Red cloacal',
    agua_red_publica:     'Sí',
    recoleccion_residuos: 'Municipal',
    cant_no_leer_escribir: 0,
    primario_incompleto:  'No',
    secundario_incompleto:'No',
    fuente_ingreso:       'Empleo formal',
    hay_desocupados:      'No',
    presencia_animales:   ['Perro', 'Gato'],
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
    luz_electrica:        'Red eléctrica',
    sistema_cocina:       'Gas de red',
    red_cloacal:          'Red cloacal',
    agua_red_publica:     'Sí',
    recoleccion_residuos: 'Municipal',
    cant_no_leer_escribir: 0,
    primario_incompleto:  'No',
    secundario_incompleto:'No',
    fuente_ingreso:       'Empleo formal',
    hay_desocupados:      'No',
    presencia_animales:   [],
    reservorios_agua:     'No',
    acciones_larvas:      'No',
    vigilancia_entomologica: 'No',
    consejeria_dengue:    'Sí',
    cant_perros: 0, perros_vacunados: 0,
    cant_gatos:  0, gatos_vacunados:  0,
    animales_sin_control: 'No',
  },
  {
    // REL 3 — Torres Marcos: casa, 1 habitante, 1 perro + 1 gato
    id: 3, relevamiento_id: 3,
    identificacion:       'Casa particular',
    tipo_vivienda:        'Casa',
    cant_dormitorios:     2,
    cant_habitantes:      1,
    luz_electrica:        'Red eléctrica',
    sistema_cocina:       'Garrafa',
    red_cloacal:          'Cámara séptica',
    agua_red_publica:     'Sí',
    recoleccion_residuos: 'Municipal',
    cant_no_leer_escribir: 0,
    primario_incompleto:  'No',
    secundario_incompleto:'No',
    fuente_ingreso:       'Empleo informal',
    hay_desocupados:      'No',
    presencia_animales:   ['Perro', 'Gato'],
    reservorios_agua:     'No',
    acciones_larvas:      'No',
    vigilancia_entomologica: 'No',
    consejeria_dengue:    'Sí',
    cant_perros: 1, perros_vacunados: 1,
    cant_gatos:  1, gatos_vacunados:  0,
    animales_sin_control: 'Gato sin vacunar',
  },
];

// ── Módulo Sistemas ───────────────────────────────────────────────────────

window.MOCK_MODULOS_SISTEMAS = [
  {
    id: 1, relevamiento_id: 1,
    recurren_caps:        'Sí',
    referencia_salud:     ['Hospital zonal', 'CAPS'],
    acceso_medicamentos:  ['Farmacia', 'Botiquín del CAPS'],
    obtencion_turno:      ['Presencial', 'Telefónico'],
    demora_turnos:        'Menos de una semana',
  },
  {
    id: 2, relevamiento_id: 2,
    recurren_caps:        'A veces',
    referencia_salud:     ['Hospital zonal'],
    acceso_medicamentos:  ['Farmacia'],
    obtencion_turno:      ['Presencial'],
    demora_turnos:        'Entre una y dos semanas',
  },
  {
    id: 3, relevamiento_id: 3,
    recurren_caps:        'Sí',
    referencia_salud:     ['CAPS'],
    acceso_medicamentos:  ['Botiquín del CAPS'],
    obtencion_turno:      ['Presencial'],
    demora_turnos:        'Menos de una semana',
  },
];

// ── Pacientes ─────────────────────────────────────────────────────────────

window.MOCK_PACIENTES = [
  // Familia Rodríguez — 4 miembros
  {
    id: 1, relevamiento_id: 1, nro: 1,
    apellido: 'Rodríguez', nombre: 'Lucía',
    fecha_nacimiento: '1978-03-15', sexo: 'F', dni: '28456123',
    situacion_vivienda: 'Propietario', tel: '11-4567-8901',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: null,
  },
  {
    id: 2, relevamiento_id: 1, nro: 2,
    apellido: 'Rodríguez', nombre: 'Mario',
    fecha_nacimiento: '1975-11-02', sexo: 'M', dni: '25789012',
    situacion_vivienda: 'Propietario', tel: '11-4567-8901',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: null,
  },
  {
    id: 3, relevamiento_id: 1, nro: 3,
    apellido: 'Rodríguez', nombre: 'Agustín',
    fecha_nacimiento: '2006-07-20', sexo: 'M', dni: '46234567',
    situacion_vivienda: 'Propietario', tel: '',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: null,
  },
  {
    id: 4, relevamiento_id: 1, nro: 4,
    apellido: 'Rodríguez', nombre: 'Valentina',
    fecha_nacimiento: '2009-02-08', sexo: 'F', dni: '48901234',
    situacion_vivienda: 'Propietario', tel: '',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: null,
  },

  // Pareja Sánchez — 2 miembros
  {
    id: 5, relevamiento_id: 2, nro: 1,
    apellido: 'Sánchez', nombre: 'Elena',
    fecha_nacimiento: '1994-09-12', sexo: 'F', dni: '39876543',
    situacion_vivienda: 'Inquilino', tel: '11-3456-7890',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: null,
  },
  {
    id: 6, relevamiento_id: 2, nro: 2,
    apellido: 'Sánchez', nombre: 'Rodrigo',
    fecha_nacimiento: '1992-04-27', sexo: 'M', dni: '37654321',
    situacion_vivienda: 'Inquilino', tel: '11-3456-7890',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: null,
  },

  // Torres Marcos — solo con mascotas
  {
    id: 7, relevamiento_id: 3, nro: 1,
    apellido: 'Torres', nombre: 'Marcos',
    fecha_nacimiento: '1983-11-30', sexo: 'M', dni: '32109876',
    situacion_vivienda: 'Propietario', tel: '11-9876-5432',
    mail: '', pais_nacimiento: 'Argentina', pueblo_originario: null,
  },
];

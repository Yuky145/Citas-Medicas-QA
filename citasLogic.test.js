const {
  evaluarPenalizacion,
  validarReglaEdad,
  validarHorarioOperativo,
  verificarChoqueCitas
} = require('./citasLogic');

describe('Auditoría de Caja Blanca - Regla de Penalización Tardía [V(G) = 3]', () => {
  test('Camino 1: cancelacionTardia = False -> No aplica penalización (Cortocircuito)', () => {
    const aplicarPenalizacionMock = jest.fn();
    const resultado = evaluarPenalizacion(false, false, aplicarPenalizacionMock);

    expect(aplicarPenalizacionMock).not.toHaveBeenCalled();
    expect(resultado).toEqual({ penalizado: false, monto: 0 });
  });

  test('Camino 2: cancelacionTardia = True y esEmergencia = True (!esEmergencia = False) -> Exento de penalización', () => {
    const aplicarPenalizacionMock = jest.fn();
    const resultado = evaluarPenalizacion(true, true, aplicarPenalizacionMock);

    expect(aplicarPenalizacionMock).not.toHaveBeenCalled();
    expect(resultado).toEqual({ penalizado: false, monto: 0 });
  });

  test('Camino 3: cancelacionTardia = True y esEmergencia = False (!esEmergencia = True) -> Aplica penalización estricta', () => {
    const aplicarPenalizacionMock = jest.fn();
    const resultado = evaluarPenalizacion(true, false, aplicarPenalizacionMock);

    expect(aplicarPenalizacionMock).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual({ penalizado: true, monto: 25 });
  });
});

describe('Auditoría de Caja Blanca - Choque de Citas [V(G) = 2]', () => {
  const citasBase = [
    { medicoId: 10, fechaHora: '2026-10-20T10:00', estado: 'ACTIVA' }
  ];

  test('Camino 1 (Rama True): Detecta colisión de horario con el mismo médico y lanza excepción exacta', () => {
    expect(() => {
      verificarChoqueCitas(citasBase, 10, '2026-10-20T10:00');
    }).toThrow('Choque de citas: El médico ya tiene una reserva activa en ese horario.');
  });

  test('Camino 2 (Rama False): Permite reserva cuando el horario está libre', () => {
    const resultado = verificarChoqueCitas(citasBase, 10, '2026-10-20T11:00');
    expect(resultado).toBe(true);
  });
});

describe('Auditoría de Caja Blanca - Regla de Edad [V(G) = 3]', () => {
  test('Camino 1: Menor de edad (<18) sin representante -> Bloquea registro', () => {
    expect(() => validarReglaEdad(12, false)).toThrow(
      'Paciente pediátrico requiere acudiente o representante adulto.'
    );
  });

  test('Camino 2: Menor de edad (<18) con representante -> Clasifica como PEDIATRICO', () => {
    expect(validarReglaEdad(12, true)).toBe('PEDIATRICO');
  });

  test('Camino 3: Mayor de edad (>=18) -> Clasifica como ADULTO', () => {
    expect(validarReglaEdad(30, false)).toBe('ADULTO');
  });
});
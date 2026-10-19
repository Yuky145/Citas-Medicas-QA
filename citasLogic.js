// 1. Regla de Penalización Tardía (Ejemplo central del Taller Paso 1)
function evaluarPenalizacion(cancelacionTardia, esEmergencia, aplicarPenalizacion) {
  if (cancelacionTardia && !esEmergencia) {
    aplicarPenalizacion();
    return { penalizado: true, monto: 25 };
  }
  return { penalizado: false, monto: 0 };
}

// 2. Regla de Edad (Pediátrica vs. Adulta)
function validarReglaEdad(edad, tieneRepresentante) {
  if (edad < 18 && !tieneRepresentante) {
    throw new Error('Paciente pediátrico requiere acudiente o representante adulto.');
  }
  return edad < 18 ? 'PEDIATRICO' : 'ADULTO';
}

// 3. Restricción de Horarios (Operativo de 08:00 a 17:00, sin fines de semana)
function validarHorarioOperativo(hora, diaSemana) {
  const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
  const fueraDeHorario = hora < 8 || hora >= 17;
  if (esFinDeSemana || fueraDeHorario) {
    return false;
  }
  return true;
}

// 4. Choque de Citas (Prevención de doble reserva)
function verificarChoqueCitas(citasExistentes, medicoId, fechaHora) {
  const existeChoque = citasExistentes.some(
    (c) => c.medicoId === medicoId && c.fechaHora === fechaHora && c.estado === 'ACTIVA'
  );
  if (existeChoque) {
    throw new Error('Choque de citas: El médico ya tiene una reserva activa en ese horario.');
  }
  return true;
}

module.exports = {
  evaluarPenalizacion,
  validarReglaEdad,
  validarHorarioOperativo,
  verificarChoqueCitas
};
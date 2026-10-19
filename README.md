# Sistema de Citas Médico Familiar - Auditoría QA Aumentada

Este proyecto es una API RESTful con interfaz reactiva para la gestión de citas médicas. El verdadero valor de este desarrollo radica en su **arquitectura orientada a la calidad**: toda la lógica de negocio ha sido diseñada, desacoplada y auditada matemáticamente utilizando pruebas de **Caja Blanca**, basándose en la **Complejidad Ciclomática de McCabe** $V(G)$ y garantizando un **100% de Cobertura de Ramas (Branch Coverage)**.

## Características Principales (Reglas de Negocio)

El sistema evalúa 4 reglas críticas, cada una con sus propios oráculos estrictos en la suite de pruebas:

1. **Penalización Tardía:** Lógica condicional para cancelaciones menores a 24 horas (eximiendo emergencias médicas).

2. **Choque de Citas:** Prevención de doble reserva de un mismo médico en el mismo bloque horario.

3. **Regla de Edad:** Clasificación automática (Pediátrico/Adulto) y validación de acudiente legal para menores de 18 años.

4. **Restricción de Horarios:** Bloqueo de franjas no operativas (fuera del horario laboral de 08:00 a 17:00 o fines de semana).

## Stack Tecnológico

* **Backend:** Node.js, Express.js.

* **Base de Datos:** SQLite (En memoria, para pruebas rápidas y efímeras).

* **Frontend:** HTML5, CSS3, Alpine.js (para reactividad ligera sin Virtual DOM).

* **Testing & QA:** Jest (Framework), c8/v8 (Provider de cobertura).

## Estrategia de Testing (Framework de QA Aumentado)

Este proyecto no confía en la "cobertura superficial de líneas" (Statement Coverage) generada ciegamente por IA. La calidad se asegura mediante:

* **Análisis Topológico:** Extracción del Grafo de Flujo de Control (CFG) de cada función.

* **Cálculo de McCabe:** Determinación exacta de los caminos linealmente independientes ($V(G) = P + 1$) antes de programar los tests.

* **Cobertura MC/DC:** Validación independiente de cada sub-condición booleana.

* **Protección contra Tests Zombis:** Uso de aserciones fuertes que verifican tanto retornos de estado como efectos secundarios (ej. `toHaveBeenCalledTimes`).

## Instalación y Uso

### 1. Clonar e Instalar

```bash
git clone https://github.com/TU_USUARIO/citas-medicas-qa.git
cd citas-medicas-qa
npm install
```

### 2. Ejecutar la Auditoría Matemática (Testing)

Comprueba el blindaje de las reglas de negocio ejecutando la suite de Jest:

```bash
npm test
# O alternativamente:
npx jest --coverage --coverageProvider=v8
```

*(Deberás ver una tabla reportando 100% en Stmts, Branch, Funcs y Lines).*

### 3. Iniciar el Servidor

```bash
npm start
# O alternativamente:
node index.js
```

La interfaz gráfica estará disponible en `http://localhost:3000`.

## Estructura del Proyecto

```text
├── citasLogic.js       # Lógica de negocio pura (Desacoplada para control de V(G))
├── server.js           # Capa de infraestructura (Express + SQLite)
├── index.js            # Punto de entrada y configuración de puerto
├── citasLogic.test.js  # Suite de pruebas unitarias auditadas (Jest)
├── public/
│   ├── index.html      # Interfaz gráfica reactiva (Alpine.js)
│   └── styles.css      # Hoja de estilos moderna y responsive
├── package.json        # Dependencias y scripts
└── README.md           # Documentación
```

*Desarrollado como demostración técnica de Ingeniería de Calidad de Software y QA Aumentado.*

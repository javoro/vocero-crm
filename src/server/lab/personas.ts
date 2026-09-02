/**
 * Las 6 personas GUIONADAS del Laboratorio (FR-030). El cliente simulado no
 * usa LLM: son secuencias fijas — determinismo total del lado del cliente.
 * El agente que responde es el REAL (mismo pipeline de US3).
 */

export type Persona = {
  key: string;
  label: string;
  description: string;
  /** Teléfono sintético estable (jamás un número real). */
  phone: string;
  contactName: string;
  script: string[];
};

export const PERSONAS: Persona[] = [
  {
    key: "comprador_decidido",
    label: "Comprador decidido",
    description: "Sabe lo que quiere y busca agendar diagnóstico para automatizar WhatsApp.",
    phone: "5210000000001",
    contactName: "[Prueba] Comprador decidido",
    script: [
      "Hola, buenas tardes",
      "¿Integran agentes de IA para atención y cotizaciones en WhatsApp?",
      "Nos interesa automatizar cotizaciones y atención 24/7 en nuestra empresa. ¿Cómo podemos empezar?",
      "Me parece excelente, ¿cómo agendamos la llamada de diagnóstico de 15 minutos?",
    ],
  },
  {
    key: "pregunton_precios",
    label: "Preguntón de precios",
    description: "Pregunta precio tras precio sobre la integración de IA y servidores.",
    phone: "5210000000002",
    contactName: "[Prueba] Preguntón de precios",
    script: [
      "Hola, ¿cuánto cuesta implementar un agente de IA?",
      "¿Y si solo quiero la parte de WhatsApp?",
      "¿El costo incluye los servidores y tokens de IA o son por separado?",
      "¿Hay algún descuento si automatizo dos empresas?",
      "Ok, déjame revisarlo con mi socio",
    ],
  },
  {
    key: "cliente_enojado",
    label: "Cliente enojado",
    description: "Llega con urgencia técnica por un problema en su canal.",
    phone: "5210000000003",
    contactName: "[Prueba] Cliente enojado",
    script: [
      "Oigan, esto me urge muchísimo",
      "Configuré mi webhook de WhatsApp en Meta y no me están llegando los mensajes, es el colmo",
      "¿Me van a responder o qué? Estamos perdiendo ventas en este momento",
      "Espero que me den solución inmediata porque tenemos campañas activas",
    ],
  },
  {
    key: "fuera_de_kb",
    label: "Pregunta fuera del conocimiento",
    description: "Pregunta algo que el knowledge base no cubre (fuera_de_kb).",
    phone: "5210000000004",
    contactName: "[Prueba] Fuera del conocimiento",
    script: [
      "Hola, una pregunta",
      "¿Ustedes desarrollan aplicaciones móviles nativas para iOS y Android en Swift?",
      "¿Y hacen campañas de marketing digital y manejo de redes sociales?",
      "¿Quién me puede cotizar una app móvil a la medida?",
    ],
  },
  {
    key: "pide_humano",
    label: "Pide un humano",
    description: "Quiere ser atendido por un consultor o especialista humano (debe escalar).",
    phone: "5210000000005",
    contactName: "[Prueba] Pide humano",
    script: [
      "Hola",
      "Tengo un requerimiento corporativo especial de contratos y seguridad",
      "Prefiero que me atienda un asesor o director humano directamente",
      "Muchas gracias",
    ],
  },
  {
    key: "errores_modismos",
    label: "Errores y modismos",
    description: "Escribe con faltas de ortografía y modismos mexicanos sobre bots de WhatsApp.",
    phone: "5210000000006",
    contactName: "[Prueba] Errores y modismos",
    script: [
      "ke onda, si asen bots de ia para wats?",
      "oiga y si jala pa una refaccionaria grande?",
      "cuanto x conectar el agente con mis clientes pa cotizar?",
      "va, orita les mando un correo pa platicar sale",
    ],
  },
];

export const PERSONA_LABELS: Record<string, string> = Object.fromEntries(
  PERSONAS.map((p) => [p.key, p.label])
);

import { eq, inArray } from "drizzle-orm";
import type { getDb } from "@/lib/db";
import { schema } from "@/lib/db";
import { newId } from "@/lib/db/ids";

/**
/**
 * Negocio de demostración "AgentiaMX — Agentes de IA & Automatización" (FR-075).
 * Idempotente: borra los datos demo previos de la organización (scoped por
 * los teléfonos demo) y reinserta. El KB queda lleno EXCEPTO servicios de desarrollo
 * de apps móviles / marketing tradicional — hueco INTENCIONAL para que el Laboratorio
 * encuentre algo real en la primera corrida.
 */

type Db = ReturnType<typeof getDb>;

const HOURS = 60 * 60 * 1000;

const DEMO_CONTACTS: {
  phone: string;
  name: string;
  notes?: string;
  stage: string;
  thread: { dir: "in" | "out"; text: string; hoursAgo: number; ai?: boolean }[];
}[] = [
  {
    phone: "5215612340001",
    name: "Lic. María Fernanda López",
    stage: "Interesado",
    notes: "Directora en Grupo Retail MX. Busca automatizar cotizaciones en WhatsApp.",
    thread: [
      { dir: "in", text: "Hola, ¿integran agentes de IA para WhatsApp y atención a clientes?", hoursAgo: 5 },
      { dir: "out", text: "¡Hola María Fernanda! Sí: diseñamos e integramos agentes de IA a la medida para WhatsApp que cotizan, atienden 24/7 y se conectan a tu CRM y catálogos.", hoursAgo: 5, ai: true },
      { dir: "in", text: "¿El agente puede consultar nuestra base de datos de inventario en tiempo real?", hoursAgo: 4 },
      { dir: "out", text: "Totalmente. Lo conectamos vía API a tu base de datos o ERP para responder existencias y precios al instante. Además, toda tu información se queda en tu propia infraestructura.", hoursAgo: 4, ai: true },
      { dir: "in", text: "Me interesa bastante. ¿Podemos agendar una llamada de diagnóstico de 15 minutos?", hoursAgo: 3 },
    ],
  },
  {
    phone: "5215612340002",
    name: "Dr. Carlos Ramírez",
    stage: "En conversación",
    thread: [
      { dir: "in", text: "Buenas tardes, ¿cómo funciona la integración con Google Calendar?", hoursAgo: 8 },
      { dir: "out", text: "¡Hola Dr. Carlos! El agente sincroniza disponibilidad en tiempo real con Google Calendar: el paciente elige horario por WhatsApp y el agente confirma la cita automáticamente.", hoursAgo: 8, ai: true },
      { dir: "in", text: "Excelente, ¿y envía recordatorios antes de la consulta para reducir cancelaciones?", hoursAgo: 7 },
      { dir: "out", text: "Sí, programa recordatorios automáticos 24 horas y 2 horas antes con opción de confirmar o reagendar con un solo clic.", hoursAgo: 7, ai: true },
    ],
  },
  {
    phone: "5215612340003",
    name: "C.P. Lupita Hernández",
    stage: "Cliente",
    notes: "Despacho Contable Hernández & Asociados. Agente activo en producción.",
    thread: [
      { dir: "in", text: "Hola, el agente está atendiendo excelente las dudas fiscales de los clientes 👏", hoursAgo: 30 },
      { dir: "out", text: "¡Qué gran noticia Lupita! Nos alegra mucho. ¿Les gustaría activar la recepción automática de constancias de situación fiscal para el timbrado?", hoursAgo: 30, ai: true },
      { dir: "in", text: "Sí por favor, agrégalo a nuestro flujo del agente", hoursAgo: 29 },
      { dir: "out", text: "Listo, ya quedó habilitado en el flujo de recepción. ¡Gracias por confiar en AgentiaMX!", hoursAgo: 29, ai: true },
    ],
  },
  {
    phone: "5215612340004",
    name: "Ing. Jorge Castillo",
    stage: "Nuevo",
    thread: [
      { dir: "in", text: "ke onda, si jala un agente de ia para una refaccionaria industrial?", hoursAgo: 2 },
      { dir: "out", text: "¡Qué tal Jorge! Claro que sí: el agente puede buscar por número de parte, compatibilidad de refacciones y entregar cotizaciones en PDF o texto en segundos.", hoursAgo: 2, ai: true },
    ],
  },
  {
    phone: "5215612340005",
    name: "Ana Sofía Torres",
    stage: "Interesado",
    thread: [
      { dir: "in", text: "Hola, vi su web agentiamx.com. ¿Manejan proyectos para inmobiliarias?", hoursAgo: 12 },
      { dir: "out", text: "¡Hola Ana Sofía! Sí: implementamos agentes que califican prospectos de vivienda, envían fichas técnicas con fotos y agendan visitas con tus asesores.", hoursAgo: 12, ai: true },
      { dir: "in", text: "¿Y qué modelos de IA utilizan para responder?", hoursAgo: 11 },
      { dir: "out", text: "Trabajamos con modelos de última generación (Claude 3.7, DeepSeek V3, GPT-4o) optimizados para velocidad y precisión en español.", hoursAgo: 11, ai: true },
      { dir: "in", text: "Déjame presentárselo a la gerencia comercial para coordinar una demo", hoursAgo: 10 },
    ],
  },
  {
    phone: "5215612340006",
    name: "Roberto Mendoza",
    stage: "Perdido",
    notes: "Buscaba un plugin gratuito de WordPress sin soporte ni servidores dedicados.",
    thread: [
      { dir: "in", text: "¿Tienen algún bot gratis para probar?", hoursAgo: 96 },
      { dir: "out", text: "Hola Roberto. En AgentiaMX diseñamos soluciones empresariales a la medida con infraestructura dedicada y soporte continuo. Te podemos agendar un diagnóstico de 15 minutos sin costo.", hoursAgo: 96, ai: true },
      { dir: "in", text: "No gracias, busco algo gratis en internet", hoursAgo: 95 },
      { dir: "out", text: "Comprendemos. Si más adelante requieres una solución robusta y soberana para tu negocio, con gusto te apoyamos. ¡Mucho éxito!", hoursAgo: 95, ai: true },
    ],
  },
  {
    phone: "5215612340007",
    name: "Paty Domínguez",
    stage: "En conversación",
    thread: [
      { dir: "in", text: "Hola, me preocupa la privacidad de los datos de mis clientes corporativos 🔐", hoursAgo: 26 },
      { dir: "out", text: "¡Hola Paty! Es uno de nuestros mayores pilares: no somos una plataforma multi-tenant compartida. Tu agente y su base de datos se despliegan en tu propia infraestructura o servidor privado.", hoursAgo: 26, ai: true },
      { dir: "in", text: "Eso es justo lo que buscábamos por temas de cumplimiento. ¿Emiten factura con IVA?", hoursAgo: 25 },
    ],
  },
  {
    phone: "5215612340008",
    name: "Don Chuy Aguilar",
    stage: "Cliente",
    thread: [
      { dir: "in", text: "Buenas tardes equipo Agentia, queremos renovar el plan de mantenimiento anual", hoursAgo: 50 },
      { dir: "out", text: "¡Qué tal Don Chuy! Con mucho gusto. Le generamos la cotización de renovación con el 10% de descuento por anualidad anticipada. ¿Se la envío al correo registrado?", hoursAgo: 50, ai: true },
      { dir: "in", text: "Sí por favor, para pasarla a tesorería de inmediato", hoursAgo: 49 },
      { dir: "out", text: "Enviada a su correo. ¡Un gusto seguir colaborando con su empresa!", hoursAgo: 49, ai: true },
    ],
  },
];

const DEMO_KB: { kind: "qa" | "block"; question?: string; answer?: string; content?: string }[] = [
  {
    kind: "block",
    content:
      "AgentiaMX (agentiamx.com) — Firma de consultoría e integración de Inteligencia Artificial para empresas mexicanas. Diseñamos agentes de IA que atienden, cotizan y dan seguimiento por WhatsApp 24/7. Operamos con soberanía de datos: cada empresa mantiene el control total de sus servidores, modelos y datos sin depender de cajas negras.",
  },
  {
    kind: "qa",
    question: "¿Cuál es el proceso de implementación de un agente?",
    answer:
      "Consta de 3 pasos: 1. Diagnóstico (llamada de 15 min para analizar tus procesos y preguntas frecuentes), 2. Diseño y entrenamiento (ajustado a tu tono de marca y flujos), 3. Lanzamiento acompañado (conexión a WhatsApp oficial, validación y soporte continuo).",
  },
  {
    kind: "qa",
    question: "¿Dónde se guardan mis datos y conversaciones?",
    answer:
      "En tu propia infraestructura o servidor VPS privado. AgentiaMX respeta la soberanía de tus datos: no retenemos, compartimos ni comercializamos la información de tus clientes con terceros.",
  },
  {
    kind: "qa",
    question: "¿Cuánto cuesta implementar un agente de IA?",
    answer:
      "Cada solución se diseña a la medida según los canales, bases de datos y herramientas a integrar (CRM, inventarios, calendarios). En una llamada de 15 minutos diagnosticamos tu caso y te entregamos una propuesta clara sin compromiso.",
  },
  {
    kind: "qa",
    question: "¿Qué métodos de pago y facturación manejan?",
    answer:
      "Aceptamos transferencia bancaria SPEI, tarjetas de crédito/débito empresariales y emitimos facturas fiscales mexicanas (CFDI) con IVA desglosado.",
  },
  {
    kind: "qa",
    question: "¿Funciona con mi número actual de WhatsApp?",
    answer:
      "Sí: utilizamos la API oficial de WhatsApp Cloud de Meta sobre tu número corporativo actual o uno nuevo exclusivo para el agente.",
  },
  {
    kind: "qa",
    question: "¿Qué pasa si el agente no sabe responder algo o piden hablar con una persona?",
    answer:
      "El agente cuenta con reglas de escalamiento inteligente que transfieren la conversación en tiempo real a tu equipo humano, preservando todo el historial del cliente.",
  },
  {
    kind: "qa",
    question: "¿Dónde están ubicados y cuál es su horario de atención?",
    answer:
      "Estamos en Sinaloa, México. Atención comercial de lunes a viernes de 9:00 a 18:00 (hora del Pacífico) y soporte para agentes en producción 24/7 vía WhatsApp y contacto@agentiamx.com.",
  },
  // HUECO INTENCIONAL: nada sobre desarrollo de apps móviles nativas o marketing de influencers (lo encuentra el Laboratorio).
];

export async function seedDemo(
  db: Db,
  organizationId: string
): Promise<{ contacts: number; kbEntries: number }> {
  const demoPhones = DEMO_CONTACTS.map((c) => c.phone);

  // --- Idempotencia: limpiar datos demo previos (orden inverso de FKs) ---
  const prevContacts = await db
    .select({ id: schema.contact.id })
    .from(schema.contact)
    .where(inArray(schema.contact.phone, demoPhones));
  const prevIds = prevContacts.map((c) => c.id);
  if (prevIds.length > 0) {
    const prevConvs = await db
      .select({ id: schema.conversation.id })
      .from(schema.conversation)
      .where(inArray(schema.conversation.contactId, prevIds));
    const convIds = prevConvs.map((c) => c.id);
    if (convIds.length > 0) {
      await db
        .delete(schema.message)
        .where(inArray(schema.message.conversationId, convIds));
      await db
        .delete(schema.conversation)
        .where(inArray(schema.conversation.id, convIds));
    }
    await db.delete(schema.lead).where(inArray(schema.lead.contactId, prevIds));
    await db.delete(schema.contact).where(inArray(schema.contact.id, prevIds));
  }
  // KB y corridas demo previas
  await db
    .delete(schema.kbEntry)
    .where(eq(schema.kbEntry.organizationId, organizationId));
  await db
    .delete(schema.agentTestCase)
    .where(eq(schema.agentTestCase.organizationId, organizationId));
  await db
    .delete(schema.agentTestRun)
    .where(eq(schema.agentTestRun.organizationId, organizationId));

  // --- Etapas (por nombre) ---
  const stages = await db
    .select()
    .from(schema.pipelineStage)
    .where(eq(schema.pipelineStage.organizationId, organizationId));
  const stageByName = new Map(stages.map((s) => [s.name, s.id]));
  const fallbackStage = stages[0]?.id;
  if (!fallbackStage) throw new Error("La organización no tiene etapas");

  // --- Contactos + conversaciones + mensajes + leads ---
  const now = Date.now();
  let position = 0;
  for (const demo of DEMO_CONTACTS) {
    const contactId = newId("contact");
    await db.insert(schema.contact).values({
      id: contactId,
      organizationId,
      phone: demo.phone,
      waIdentity: demo.phone,
      name: demo.name,
      notes: demo.notes ?? null,
    });

    const lastInbound = demo.thread
      .filter((t) => t.dir === "in")
      .reduce((min, t) => Math.min(min, t.hoursAgo), Infinity);
    const lastMessage = demo.thread.reduce(
      (min, t) => Math.min(min, t.hoursAgo),
      Infinity
    );

    const conversationId = newId("conversation");
    await db.insert(schema.conversation).values({
      id: conversationId,
      organizationId,
      contactId,
      lastInboundAt: new Date(now - lastInbound * HOURS),
      lastMessageAt: new Date(now - lastMessage * HOURS),
      unreadCount: demo.thread[demo.thread.length - 1]?.dir === "in" ? 1 : 0,
    });

    for (const msg of demo.thread) {
      const at = new Date(now - msg.hoursAgo * HOURS);
      await db.insert(schema.message).values({
        id: newId("message"),
        organizationId,
        conversationId,
        waMessageId: `wamid.demo.${newId("message")}`,
        direction: msg.dir,
        type: "text",
        text: msg.text,
        status: msg.dir === "in" ? "delivered" : "read",
        aiGenerated: msg.ai ?? false,
        origin: msg.ai ? "ai" : "operator",
        waTimestamp: at,
        createdAt: at,
      });
    }

    await db.insert(schema.lead).values({
      id: newId("lead"),
      organizationId,
      contactId,
      stageId: stageByName.get(demo.stage) ?? fallbackStage,
      position: position++,
      lastActivityAt: new Date(now - lastMessage * HOURS),
    });
  }

  // --- Knowledge base (con el hueco intencional) ---
  for (const entry of DEMO_KB) {
    await db.insert(schema.kbEntry).values({
      id: newId("kbEntry"),
      organizationId,
      kind: entry.kind,
      question: entry.question ?? null,
      answer: entry.answer ?? null,
      content: entry.content ?? null,
    });
  }

  // --- Comportamiento del agente de la demo ---
  await db
    .update(schema.agentProfile)
    .set({
      name: "Agentia | Asistente de Operaciones",
      tone: "Profesional, ágil y cercano. Español de México comercial. Respuestas directas y enfocadas en valor de negocio.",
      instructions:
        "Ayuda a directores y líderes comerciales a entender el valor de los agentes de IA para su empresa. Califica el interés y promueve la llamada de diagnóstico de 15 minutos. Resalta la soberanía de datos de AgentiaMX.",
      escalationRules:
        "Escala a un consultor humano si solicitan contratos formales, cotizaciones firmadas a la medida, si hay un problema técnico urgente o si piden hablar con una persona.",
      greeting: "¡Hola! 👋 Te comunicas a AgentiaMX. Diseñamos e integramos agentes de IA para WhatsApp y procesos de negocio. ¿En qué proceso de tu empresa te gustaría implementar IA?",
      updatedAt: new Date(),
    })
    .where(eq(schema.agentProfile.organizationId, organizationId));

  // --- Corrida de Laboratorio de ejemplo (guardada, con el hueco encontrado) ---
  const runId = newId("testRun");
  await db.insert(schema.agentTestRun).values({
    id: runId,
    organizationId,
    status: "done",
    score: 83,
    startedAt: new Date(now - 24 * HOURS),
    finishedAt: new Date(now - 24 * HOURS + 3 * 60 * 1000),
  });
  const exampleCases: {
    persona: string;
    veredicto: "verde" | "amarillo" | "rojo";
    hallazgos: unknown[];
    transcript: { role: string; text: string }[];
  }[] = [
    {
      persona: "comprador_decidido",
      veredicto: "verde",
      hallazgos: [],
      transcript: [
        { role: "cliente", text: "¿Integran agentes de IA para atención y cotizaciones en WhatsApp?" },
        { role: "agente", text: "¡Hola! Sí: diseñamos e integramos agentes de IA a la medida para WhatsApp que cotizan, atienden 24/7 y se conectan a tu CRM y catálogos." },
        { role: "cliente", text: "Me parece excelente, ¿cómo agendamos la llamada de diagnóstico de 15 minutos?" },
        { role: "agente", text: "Con gusto: puedes agendar tu llamada directamente o compartirme tu horario disponible para confirmártela en este momento." },
      ],
    },
    {
      persona: "pregunton_precios",
      veredicto: "verde",
      hallazgos: [],
      transcript: [
        { role: "cliente", text: "¿Cuánto cuesta implementar un agente de IA?" },
        { role: "agente", text: "Cada solución se diseña a la medida según los canales y herramientas a integrar. En una breve llamada de 15 min diagnosticamos tu caso y te entregamos una propuesta clara sin compromiso." },
      ],
    },
    {
      persona: "cliente_enojado",
      veredicto: "amarillo",
      hallazgos: [
        {
          tipo: "tono",
          evidencia:
            "El agente respondió de forma correcta pero un poco formal ante la molestia del cliente; se recomienda empatizar con la urgencia del canal antes de escalar.",
        },
      ],
      transcript: [
        { role: "cliente", text: "Configuré mi webhook de WhatsApp en Meta y no me están llegando los mensajes, es el colmo" },
        { role: "agente", text: "Lamento el inconveniente con tu webhook. En este momento paso tu caso al equipo técnico para revisarlo de inmediato." },
      ],
    },
    {
      persona: "fuera_de_kb",
      veredicto: "rojo",
      hallazgos: [
        {
          tipo: "fuera_de_kb",
          evidencia:
            "El cliente preguntó por desarrollo de apps móviles nativas y campañas de marketing tradicional, temas que no forman parte de la Knowledge Base.",
          sugerencia: {
            pregunta: "¿Desarrollan aplicaciones móviles nativas o campañas publicitarias?",
            respuesta:
              "En AgentiaMX nos especializamos exclusivamente en agentes de IA y automatizaciones sobre canales existentes (WhatsApp, CRM, APIs). No desarrollamos apps móviles nativas ni manejamos pauta publicitaria.",
          },
        },
      ],
      transcript: [
        { role: "cliente", text: "¿Ustedes desarrollan aplicaciones móviles nativas para iOS y Android en Swift?" },
        { role: "agente", text: "Déjame confirmarlo con nuestro equipo y te comparto la información en un momento." },
      ],
    },
    {
      persona: "pide_humano",
      veredicto: "verde",
      hallazgos: [],
      transcript: [
        { role: "cliente", text: "Prefiero que me atienda un asesor o director humano directamente" },
        { role: "agente", text: "(handoff: la conversación pasó a atención humana)" },
      ],
    },
    {
      persona: "errores_modismos",
      veredicto: "verde",
      hallazgos: [],
      transcript: [
        { role: "cliente", text: "ke onda, si asen bots de ia para wats?" },
        { role: "agente", text: "¡Qué tal! Sí, diseñamos agentes inteligentes para WhatsApp que entienden a tus clientes y cotizan en automático. ¿Para qué giro de negocio lo necesitas?" },
      ],
    },
  ];
  for (const c of exampleCases) {
    await db.insert(schema.agentTestCase).values({
      id: newId("testCase"),
      organizationId,
      runId,
      persona: c.persona,
      status: "done",
      veredicto: c.veredicto,
      hallazgos: c.hallazgos,
      transcript: c.transcript,
    });
  }

  return { contacts: DEMO_CONTACTS.length, kbEntries: DEMO_KB.length };
}

/** true si la organización aún no tiene datos de dominio (para el botón). */
export async function isDomainEmpty(
  db: Db,
  organizationId: string
): Promise<boolean> {
  const rows = await db
    .select({ id: schema.contact.id })
    .from(schema.contact)
    .where(eq(schema.contact.organizationId, organizationId))
    .limit(1);
  return rows.length === 0;
}

import { parseCurrency } from "../utils/currency";
import { calcMonthlySavings } from "../utils/simulation";
import type {
  SimulationConversationEntry,
  SimulationRecord,
} from "./simulation";

const RESPONSE_SCHEMA = `{
  "feasibility": {
    "status": "viable" | "needs_adjustment" | "unfeasible",
    "content": "<Analise objetiva sobre se a meta e atingivel no prazo com o valor disponivel. Mencione os numeros relevantes.>"
  },
  "diagnosis": {
    "content": "<Diagnostico focado no comprometimento do orcamento: quanto % da renda esta comprometida com gastos e dividas, e o que isso representa para a saude financeira.>"
  },
  "suggestions": {
    "items": ["<Sugestao pratica e concreta para reduzir gastos ou reorganizar o orcamento>"]
  },
  "extraIncome": {
    "items": ["<Ideia pratica para gerar renda extra compativel com a realidade brasileira>"]
  },
  "investment": {
    "items": ["<Sugestao de investimento acessivel para o perfil apresentado, com foco em atingir a meta>"]
  },
  "motivation": {
    "content": "<Mensagem final motivacional e personalizada, citando a meta pelo nome.>"
  }
}`;

export function buildAIPrompt(simulation: SimulationRecord) {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } =
    simulation;

  const monthlySavings = calcMonthlySavings(simulation);
  const monthlySavingsNeeded =
    parseCurrency(goalAmount) / parseInt(goalDeadline);

  return `Voce e um educador financeiro especializado em financas pessoais.
    Analise os dados abaixo e gere um diagnostico financeiro personalizado com linguagem clara, didatica e encorajadora,
    voltado para pessoas sem conhecimento financeiro. O diagnostico sera exibido diretamente ao usuario no app,
    fale sempre em segunda pessoa ("voce tem...", "sua meta...").

    Dados da simulacao:
    - Renda mensal bruta: ${income}
    - Custos fixos essenciais: ${expenses}
    - Dividas e parcelas mensais: ${debts}
    - Valor disponivel por mes: ${monthlySavings} reais
    - Meta: ${goalName}
    - Custo da meta: ${goalAmount}
    - Prazo desejado: ${goalDeadline} meses
    - Economia mensal necessaria para atingir a meta no prazo: ${monthlySavingsNeeded} reais
    - Saldo apos reserva para a meta: ${monthlySavings - monthlySavingsNeeded} reais

    Retorne APENAS um JSON valido, sem texto adicional, sem blocos de codigo, neste formato exato:

    ${RESPONSE_SCHEMA}

    Regras:
    - Todos os textos em portugues do Brasil
    - Maximo de 4 itens por lista
    - Seja especifico ao citar valores calculados
    - Nao repita informacoes entre secoes
    - Nunca use markdown dentro dos valores do JSON
    - Para o campo "feasibility.status", use os seguintes criterios:
      - "viable": saldo apos reserva para a meta e maior ou igual a 0
      - "needs_adjustment": saldo negativo de ate 20% do valor da economia mensal necessaria
      - "unfeasible": saldo negativo superior a 20% do valor da economia mensal necessaria`;
}

export function buildSimulationQuestionPrompt(
  simulation: SimulationRecord,
  question: string,
  history: SimulationConversationEntry[] = [],
) {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } =
    simulation;

  const monthlySavings = calcMonthlySavings(simulation);
  const monthlySavingsNeeded =
    parseCurrency(goalAmount) / parseInt(goalDeadline);
  const previousConversation =
    history.length > 0
      ? history
          .map(
            (entry, index) =>
              `${index + 1}. Pergunta: ${entry.question}\nResposta: ${entry.answer}`,
          )
          .join("\n\n")
      : "Nenhuma pergunta anterior.";

  return `Voce e um educador financeiro especializado em financas pessoais.
    Responda a pergunta do usuario com base apenas nos dados da simulacao abaixo.
    Use linguagem clara, didatica, objetiva e acolhedora, sempre em portugues do Brasil.
    Se a pergunta pedir algo fora do escopo da simulacao, explique a limitacao com gentileza e responda com a melhor orientacao possivel dentro do contexto.

    Dados da simulacao:
    - Renda mensal bruta: ${income}
    - Custos fixos essenciais: ${expenses}
    - Dividas e parcelas mensais: ${debts}
    - Valor disponivel por mes: ${monthlySavings} reais
    - Meta: ${goalName}
    - Custo da meta: ${goalAmount}
    - Prazo desejado: ${goalDeadline} meses
    - Economia mensal necessaria para atingir a meta no prazo: ${monthlySavingsNeeded} reais
    - Saldo apos reserva para a meta: ${monthlySavings - monthlySavingsNeeded} reais

    Conversa anterior:
    ${previousConversation}

    Pergunta do usuario:
    ${question}

    Regras:
    - Responda em no maximo 6 frases
    - Cite valores quando isso ajudar a resposta
    - Nao use markdown
    - Nao invente dados que nao estao na simulacao
    - Se a pergunta depender de contexto anterior, aproveite a conversa acima para responder com continuidade`;
}

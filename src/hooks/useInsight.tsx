import { useCallback, useEffect, useRef, useState } from "react";
import { buildAIPrompt, buildSimulationQuestionPrompt } from "../data/aiPrompt";
import type {
  SimulationConversationEntry,
  SimulationRecord,
} from "../data/simulation";
import { useSimulationStorage } from "./useSimulationStorage";
import {
  getInsight,
  getQuestionAnswer,
  type InsightData,
} from "../services/aiService";

interface PendingQuestion {
  id: string;
  question: string;
}

export const useInsight = (id: string) => {
  const isRequestPending = useRef(false);
  const { getFormData, updateSimulation } = useSimulationStorage();

  const [insight, setInsight] = useState<InsightData | null>(() => {
    const simulation = getFormData(id);

    if (simulation?.insight) {
      return simulation.insight;
    }

    return null;
  });

  const [conversationHistory, setConversationHistory] = useState<
    SimulationConversationEntry[]
  >(() => {
    const simulation = getFormData(id);
    return simulation?.conversationHistory ?? [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState<PendingQuestion | null>(
    null,
  );
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  const fetchInsight = useCallback(
    async (simulationId: string) => {
      const simulation = getFormData(simulationId);

      if (!simulation) {
        setError("Simulação não encontrada.");
        return;
      }

      isRequestPending.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const prompt = buildAIPrompt(simulation);
        const data = await getInsight(prompt);
        setInsight(data);

        updateSimulation(simulationId, {
          ...simulation,
          insight: data,
        } as SimulationRecord);
      } catch {
        setError("Erro ao gerar o diagnóstico. Tente novamente.");
      } finally {
        isRequestPending.current = false;
        setIsLoading(false);
      }
    },
    [getFormData, updateSimulation],
  );

  useEffect(() => {
    if (insight || isLoading || error || isRequestPending.current) {
      return;
    }

    fetchInsight(id);
  }, [id, insight, isLoading, error, fetchInsight]);

  const askQuestion = useCallback(
    async (question: string) => {
      const simulation = getFormData(id);

      if (!simulation) {
        setQuestionError("Simulação não encontrada.");
        return;
      }

      const pendingQuestionId = crypto.randomUUID();

      setIsQuestionLoading(true);
      setQuestionError(null);
      setPendingQuestion({
        id: pendingQuestionId,
        question,
      });

      try {
        const currentHistory = simulation.conversationHistory ?? [];
        const prompt = buildSimulationQuestionPrompt(
          simulation,
          question,
          currentHistory,
        );
        const answer = await getQuestionAnswer(prompt);
        const newEntry: SimulationConversationEntry = {
          id: pendingQuestionId,
          question,
          answer,
          createdAt: new Date().toISOString(),
        };
        const nextConversationHistory = [...currentHistory, newEntry];

        setConversationHistory(nextConversationHistory);
        updateSimulation(id, {
          ...simulation,
          conversationHistory: nextConversationHistory,
        } as SimulationRecord);
      } catch {
        setQuestionError("Erro ao responder sua pergunta. Tente novamente.");
      } finally {
        setPendingQuestion(null);
        setIsQuestionLoading(false);
      }
    },
    [getFormData, id, updateSimulation],
  );

  return {
    insight,
    conversationHistory,
    isLoading,
    error,
    fetchInsight,
    pendingQuestion,
    isQuestionLoading,
    questionError,
    askQuestion,
  };
};

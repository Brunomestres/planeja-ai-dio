import "react-loading-skeleton/dist/skeleton.css";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, MessageCircle, SendHorizontal } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { useInsight } from "../../../hooks/useInsight";
import { Button } from "../../shared/Button";
import { Divider } from "../../shared/Divider";
import { Error } from "../Insights/Error";
import { Content } from "../Insights/Content";

interface AIInsightCardProps {
  simulationId: string;
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const [question, setQuestion] = useState("");
  const conversationEndRef = useRef<HTMLDivElement | null>(null);
  const {
    insight,
    conversationHistory,
    isLoading,
    error,
    fetchInsight,
    pendingQuestion,
    isQuestionLoading,
    questionError,
    askQuestion,
  } = useInsight(simulationId);

  const handleSubmitQuestion = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return;
    }

    setQuestion("");
    await askQuestion(trimmedQuestion);
  };

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [conversationHistory, pendingQuestion, questionError]);

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}

      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => {
            fetchInsight(simulationId);
          }}
        />
      )}

      {!isLoading && !error && (
        <>
          <div className="mt-2 flex max-h-[42rem] flex-col overflow-y-auto pr-2 lg:scrollbar-thin lg:[scrollbar-color:var(--border)_transparent]">
            {insight && <Content insight={insight} />}

            <div className="mt-6 border-t border-border pt-5">
              <div className="flex flex-col gap-4">
                {conversationHistory.length === 0 &&
                  !pendingQuestion &&
                  !questionError && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Nenhuma pergunta enviada ainda. Sua conversa sobre esta
                      simulação vai aparecer aqui.
                    </p>
                  )}

                {conversationHistory.map((entry) => (
                  <div key={entry.id} className="flex flex-col gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <MessageCircle size={20} className="text-primary" />
                        <p className="text-foreground text-sm font-medium">
                          Você
                        </p>
                      </div>
                      <p className="text-primary mt-1 text-sm leading-relaxed">
                        {entry.question}
                      </p>
                      <Divider orientation="horizontal" />
                    </div>

                    <div>
                      <p className="text-foreground my-2 flex items-center gap-2 text-sm font-medium">
                        <MessageCircle size={20} className="text-primary" />
                        Resposta da IA
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {entry.answer}
                      </p>
                    </div>

                    <Divider spacing={4} />
                  </div>
                ))}

                {pendingQuestion && (
                  <div className="flex flex-col gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <MessageCircle size={20} className="text-primary" />
                        <p className="text-foreground text-sm font-medium">
                          Você
                        </p>
                      </div>
                      <p className="text-primary mt-1 text-sm leading-relaxed">
                        {pendingQuestion.question}
                      </p>
                      <Divider orientation="horizontal" />
                    </div>

                    <div>
                      <p className="text-foreground my-2 flex items-center gap-2 text-sm font-medium">
                        <MessageCircle size={20} className="text-primary" />
                        Resposta da IA
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Skeleton
                          width={18}
                          height={18}
                          circle
                          baseColor="var(--color-skeleton-base)"
                          highlightColor="var(--color-skeleton-highlight)"
                        />
                        <p className="text-muted-foreground text-sm">
                          Analisando sua pergunta...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {questionError && !pendingQuestion && (
                  <div className="bg-destructive/10 border-destructive/20 rounded-2xl border px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={18} className="text-destructive" />
                      <p className="text-destructive text-sm font-medium">
                        Não foi possível responder agora
                      </p>
                    </div>
                    <p className="text-destructive/90 mt-1 text-sm leading-relaxed">
                      {questionError}
                    </p>
                  </div>
                )}

                <div ref={conversationEndRef} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-end gap-2">
              <textarea
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value);
                }}
                placeholder="Ex: o que eu posso fazer para atingir essa meta mais rapido?"
                rows={4}
                className="bg-input text-foreground placeholder:text-muted-foreground/80 min-h-15 w-full resize-none rounded-2xl px-4 py-4 text-sm leading-relaxed shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] outline-none"
              />

              <div className="justify-end">
                <Button
                  type="button"
                  variant="primary"
                  className="h-15 w-15"
                  icon={SendHorizontal}
                  disabled={!question.trim() || isQuestionLoading}
                  onClick={() => {
                    void handleSubmitQuestion();
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

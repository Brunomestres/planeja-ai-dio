import { Goal, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SimulationRecord } from "../../../data/simulation";
import { calcRequiredMonthlySavings } from "../../../utils/simulation";
import { Button } from "../../shared/Button";
import { Divider } from "../../shared/Divider";

interface CardProps {
  simulation: SimulationRecord;
  onDelete: (id: string) => void;
}

function formatCurrency(value: number) {
  return `R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatSimulationDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "--/--/----";
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

export function Card({ simulation, onDelete }: CardProps) {
  const navigate = useNavigate();
  const monthlySavings = calcRequiredMonthlySavings(simulation);

  return (
    <article className="bg-card flex flex-col gap-5 rounded-2xl px-5 py-4 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
          <Goal size={22} className="text-primary" />
        </div>

        <div className="min-w-0">
          <h3 className="text-foreground text-[19px] font-semibold">
            {simulation.goalName}
          </h3>
          <p className="text-muted-foreground text-[14px] font-normal">
            {formatSimulationDate(simulation.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid flex-1 gap-5 sm:grid-cols-3 lg:max-w-3xl lg:px-6">
        <div>
          <p className="text-muted-foreground text-[12px] font-semibold tracking-widest uppercase">
            Custo da meta
          </p>
          <p className="text-foreground text-[16px] font-semibold">
            {`R$ ${simulation.goalAmount}`}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-[12px] font-semibold tracking-widest uppercase">
            Prazo
          </p>
          <p className="text-foreground text-[16px] font-semibold">
            {`${simulation.goalDeadline} meses`}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-[12px] font-semibold tracking-widest uppercase">
            Economia mensal
          </p>
          <p className="text-foreground text-[16px] font-semibold">
            {formatCurrency(monthlySavings)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 self-end lg:self-stretch">
        <Divider orientation="vertical" className="hidden lg:block" />
        <button
          type="button"
          aria-label={`Excluir simulação ${simulation.goalName}`}
          onClick={() => {
            onDelete(simulation.id);
          }}
          className="text-destructive cursor-pointer transition-opacity hover:opacity-80 text-red-600"
        >
          <Trash2 size={20} />
        </button>
        <Button
          type="button"
          variant="secondary"
          icon={SquareArrowOutUpRight}
          onClick={() => {
            void navigate(`/resultado/${simulation.id}`);
          }}
        >
          Ver detalhes
        </Button>
      </div>
    </article>
  );
}

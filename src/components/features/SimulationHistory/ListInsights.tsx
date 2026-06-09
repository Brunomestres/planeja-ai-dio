import { useState } from "react";
import type { SimulationRecord } from "../../../data/simulation";
import { useSimulationStorage } from "../../../hooks/useSimulationStorage";
import { Card } from "./Card";

export function ListInsights() {
  const { getAllSimulation, deleteSimulation } = useSimulationStorage();
  const [simulations, setSimulations] = useState<SimulationRecord[] | null>(
    getAllSimulation(),
  );

  const handleDeleteSimulation = (id: string) => {
    deleteSimulation(id);

    setSimulations((current) => {
      if (!current) {
        return null;
      }

      const filteredSimulations = current.filter(
        (simulation) => simulation.id !== id,
      );

      return filteredSimulations.length > 0 ? filteredSimulations : null;
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Histórico de simulações</h1>
        <h2 className="text-muted-foreground text-sm">
          Acompanhe o histórico de seus planos financeiros.
        </h2>
      </div>

      {!simulations ? (
        <p className="text-muted-foreground mt-8 text-sm">
          Nenhuma simulação encontrada no histórico.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-5">
          {simulations.map((simulation) => (
            <Card
              key={simulation.id}
              simulation={simulation}
              onDelete={handleDeleteSimulation}
            />
          ))}
        </div>
      )}
    </main>
  );
}

import type { SimulationFormData, SimulationRecord } from "../data/simulation";

const LOCAL_STORAGE_KEY = "simulation-data";

type StoredSimulationRecord = SimulationRecord | Omit<SimulationRecord, "createdAt">;

function normalizeSimulationRecord(
  record: StoredSimulationRecord,
): SimulationRecord {
  return {
    ...record,
    createdAt: record.createdAt ?? new Date().toISOString(),
  } as SimulationRecord;
}

export const useSimulationStorage = () => {
  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID();
    const record: SimulationRecord = {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
    };

    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedData = storage
      ? (JSON.parse(storage) as SimulationRecord[]).map(normalizeSimulationRecord)
      : [];

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record]),
    );

    return id;
  };

  const getFormData = (id: string) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!storage) {
      return null;
    }

    const savedData = (JSON.parse(storage) as SimulationRecord[]).map(
      normalizeSimulationRecord,
    );
    return savedData.find((record) => record.id === id) || null;
  };

  const updateSimulation = (id: string, data: SimulationRecord) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedData = storage
      ? (JSON.parse(storage) as SimulationRecord[]).map(normalizeSimulationRecord)
      : [];

    const updated = savedData.map((record) =>
      record.id === id ? { ...data } : record,
    );

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const getAllSimulation = () => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!storage) {
      return null;
    }

    const savedData = (JSON.parse(storage) as SimulationRecord[])
      .map(normalizeSimulationRecord)
      .reverse();
    return savedData;
  };

  const deleteSimulation = (id: string) => {
    const storage = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!storage) {
      return;
    }

    const savedData = (JSON.parse(storage) as SimulationRecord[]).map(
      normalizeSimulationRecord,
    );
    const filteredData = savedData.filter((record) => record.id !== id);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredData));
  };

  return {
    saveFormData,
    getFormData,
    updateSimulation,
    getAllSimulation,
    deleteSimulation,
  };
};

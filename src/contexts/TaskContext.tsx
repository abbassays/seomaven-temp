import { SEOAuditReportData } from "@/types/dataforseo";
import { createContext, useContext, useState, ReactNode } from "react";

interface TaskContextType {
  auditData: SEOAuditReportData | null;
  setAuditData: (data: SEOAuditReportData | null) => void;
  taskId: string | null;
  setTaskId: (id: string | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [auditData, setAuditData] = useState<SEOAuditReportData | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  return (
    <TaskContext.Provider
      value={{ auditData, setAuditData, taskId, setTaskId }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within an AuditProvider");
  }
  return context;
};

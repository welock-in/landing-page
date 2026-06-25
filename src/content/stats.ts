export type Stat = {
  value: string;
  unit?: string;
  label: string;
};

export const stats: Stat[] = [
  { value: "4M+", label: "people block distractions with WeLockIn" },
  { value: "+2.5", unit: "hrs", label: "of focused time gained every day" },
  { value: "96%", label: "of users said they were more productive" },
  {
    value: "80%",
    label: "believe WeLockIn made them a better contributor",
  },
];

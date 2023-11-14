export type Tab = {
  name: string;
  icon: any;
  content?: React.ReactNode;
  onClick: () => void;
};

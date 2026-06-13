export interface IParameter {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

export interface IPreset {
  name: string;
  description: string;
  values: { [paramId: string]: number };
}

export interface IScrollStep {
  scrollRange: [number, number]; // [start %, end %]
  action: (progress: number, sceneState: any) => void;
  description?: string;
}

export interface IExplainerConcept {
  id: string;
  title: string;
  category: "physics" | "networking" | "ml" | "sorting" | "databases";
  parameters: IParameter[];
  presets: IPreset[];
  scrollSteps: {
    description: string;
    range: [number, number];
  }[];
}

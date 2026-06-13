import { IExplainerConcept } from "@/types/explainer";

export const EXPLAINER_CONCEPTS: { [slug: string]: IExplainerConcept } = {
  gravity: {
    id: "gravity",
    title: "Gravity & Spacetime",
    category: "physics",
    parameters: [
      { id: "mass", name: "Star Mass", min: 0.5, max: 4.5, step: 0.1, defaultValue: 1.5, unit: "x" },
      { id: "gravity", name: "Gravity Constant", min: 0.2, max: 3.0, step: 0.1, defaultValue: 1.0, unit: "G" },
      { id: "speed", name: "Orbital Velocity", min: 0.1, max: 3.0, step: 0.1, defaultValue: 1.0, unit: "x" },
    ],
    presets: [
      { name: "Supermassive", description: "Collapse spacetime grid", values: { mass: 4.0, gravity: 2.0, speed: 0.5 } },
      { name: "Standard Orbit", description: "Stable planet pathing", values: { mass: 1.5, gravity: 1.0, speed: 1.0 } },
      { name: "Micro Gravity", description: "Floating orbits", values: { mass: 0.6, gravity: 0.4, speed: 1.8 } },
    ],
    scrollSteps: [
      { description: "Mass bends the spacetime fabric", range: [0, 0.3] },
      { description: "Orbital speed counteracts gravitational pull", range: [0.3, 0.6] },
      { description: "System equilibrium is reached dynamically", range: [0.6, 1.0] },
    ],
  },
  networking: {
    id: "networking",
    title: "Packet Swarm Routing",
    category: "networking",
    parameters: [
      { id: "load", name: "Traffic Load", min: 10, max: 100, step: 5, defaultValue: 40, unit: "%" },
      { id: "speed", name: "Packet Speed", min: 0.5, max: 4.0, step: 0.1, defaultValue: 1.5, unit: "x" },
    ],
    presets: [
      { name: "Congested Network", description: "Heavy load packet routing", values: { load: 90, speed: 0.8 } },
      { name: "High Bandwidth", description: "Fast transit networks", values: { load: 20, speed: 3.5 } },
    ],
    scrollSteps: [
      { description: "Clients send packets to router pathways", range: [0, 0.3] },
      { description: "Routers distribute load along paths", range: [0.3, 0.6] },
      { description: "Packets reach target servers in sequence", range: [0.6, 1.0] },
    ],
  },
  ml: {
    id: "ml",
    title: "Neural Network Weights",
    category: "ml",
    parameters: [
      { id: "speed", name: "Training Speed", min: 0.2, max: 3.0, step: 0.1, defaultValue: 1.0, unit: "x" },
      { id: "epochs", name: "Epoch Cycles", min: 5, max: 100, step: 5, defaultValue: 20, unit: "e" },
    ],
    presets: [
      { name: "Fast Backprop", description: "High speed learning rates", values: { speed: 2.5, epochs: 80 } },
      { name: "Steady Convergence", description: "Standard training speeds", values: { speed: 1.0, epochs: 20 } },
    ],
    scrollSteps: [
      { description: "Signals flow forward through synapse nodes", range: [0, 0.3] },
      { description: "Loss error backpropagates to correct weights", range: [0.3, 0.6] },
      { description: "Weights converge, minimizing predictions loss", range: [0.6, 1.0] },
    ],
  },
  sorting: {
    id: "sorting",
    title: "Sorting Array Swaps",
    category: "sorting",
    parameters: [
      { id: "size", name: "Array Length", min: 8, max: 40, step: 1, defaultValue: 20, unit: "cols" },
      { id: "speed", name: "Swap Frequencies", min: 0.5, max: 4.0, step: 0.1, defaultValue: 1.5, unit: "Hz" },
    ],
    presets: [
      { name: "Bulk Array", description: "Long sorting sweeps", values: { size: 38, speed: 3.0 } },
      { name: "Crisp Comparisons", description: "Observe individual swaps", values: { size: 12, speed: 0.8 } },
    ],
    scrollSteps: [
      { description: "Unsorted columns align in random heights", range: [0, 0.3] },
      { description: "Pairs compare values, swapping coordinates", range: [0.3, 0.6] },
      { description: "Column values converge in absolute order", range: [0.6, 1.0] },
    ],
  },
  databases: {
    id: "databases",
    title: "Relational Table Joins",
    category: "databases",
    parameters: [
      { id: "tables", name: "Table Schemas", min: 2, max: 3, step: 1, defaultValue: 3, unit: "x" },
      { id: "load", name: "Query Intensity", min: 0.5, max: 3.0, step: 0.1, defaultValue: 1.0, unit: "q" },
    ],
    presets: [
      { name: "Multi Table Join", description: "Complex database connections", values: { tables: 3, load: 2.0 } },
      { name: "Simple Key Lookup", description: "Fewer active tables", values: { tables: 2, load: 0.8 } },
    ],
    scrollSteps: [
      { description: "Databases hold schemas as floating tables", range: [0, 0.3] },
      { description: "Foreign key anchors define spline channels", range: [0.3, 0.6] },
      { description: "Joined queries flow across connection paths", range: [0.6, 1.0] },
    ],
  },
};

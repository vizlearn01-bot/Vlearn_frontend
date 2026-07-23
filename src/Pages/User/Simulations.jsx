import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router';
import UserContext from '../../Context/UserContext';
import SimulationCard from '../../Components/User/SimulationCard';
import SimulationViewerContainer from './Simulations/SimulationViewerContainer';
import { ArrowLeft, Beaker, Zap, Dna, Calculator, Sparkles, SlidersHorizontal } from 'lucide-react';

const LOCAL_FALLBACK_SIMULATIONS = [
  {
    id: 1,
    key: 'charles_law',
    title: "Charles's Law",
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Gas Laws',
    status: 'ACTIVE',
    description: 'Interactive gas law simulation demonstrating volume-temperature proportionality at constant pressure.',
    archetype: 'charles_law',
    config: {
      initial_temperature_k: 273,
      formula: 'V1 / T1 = V2 / T2',
      context_spec: {
        overview: 'Explores the direct relationship between absolute temperature (Kelvin) and volume of a gas at constant pressure.',
        how_to_use: [
          'Step 1: Adjust the Temperature slider from 173 K to 373 K.',
          'Step 2: Observe how particle velocity increases with higher temperature.',
          'Step 3: Watch the container boundary expand or contract to maintain constant pressure.'
        ],
        expected_results: [
          {
            action: 'Increasing Temperature',
            expected_outcome: 'Volume expands linearly (V ∝ T).',
            key_takeaway: 'Direct proportional relationship at constant pressure (V1/T1 = V2/T2).'
          },
          {
            action: 'Decreasing Temperature',
            expected_outcome: 'Particle kinetic motion slows and volume contracts.',
            key_takeaway: 'Gas volume approaches zero theoretical limit as temperature approaches Absolute Zero (0 K).'
          }
        ]
      }
    }
  },
  {
    id: 2,
    key: 'reaction_rate',
    title: 'Reaction Rate',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Reaction Rates and Reversible Reactions',
    status: 'ACTIVE',
    description: 'Investigate collision theory and how concentration, temperature, and catalysts affect reaction speed.',
    archetype: 'reaction_rate',
    config: {
      initial_concentration_m: 1.0,
      context_spec: {
        overview: 'Demonstrates Collision Theory by showing how temperature and kinetic energy influence reaction rates and precipitate formation.',
        how_to_use: [
          "Step 1: Set the initial temperature slider (10°C to 60°C).",
          "Step 2: Click 'Start Reaction' to begin timer and collision monitoring.",
          "Step 3: Observe the solution opacity and time required to form full sulfur precipitate."
        ],
        expected_results: [
          {
            action: 'Increasing Temperature',
            expected_outcome: 'Reaction time decreases rapidly, doubling speed for every ~10°C increase.',
            key_takeaway: 'Higher kinetic energy leads to more frequent and successful particle collisions exceeding activation energy.'
          }
        ]
      }
    }
  },
  {
    id: 3,
    key: 'electrolysis',
    title: 'Electrolysis',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Electrochemistry',
    status: 'ACTIVE',
    description: 'Simulate ionic migration, cathode/anode reactions, and gas production during aqueous electrolysis.',
    archetype: 'electrolysis',
    config: {
      electrolyte: 'CuSO4',
      context_spec: {
        overview: 'Demonstrates quantitative electrochemistry, showing how electrical current drives non-spontaneous redox reactions at the electrodes.',
        how_to_use: [
          'Step 1: Adjust circuit voltage (2 V to 12 V).',
          "Step 2: Click 'Start Electrolysis' to energize the copper sulfate cell.",
          'Step 3: Track real-time mass changes on the copper anode and cathode.'
        ],
        expected_results: [
          {
            action: 'Increasing Voltage / Current',
            expected_outcome: 'Mass changes at anode and cathode accelerate proportionally.',
            key_takeaway: 'Mass of element deposited or dissolved is directly proportional to total electrical charge transferred (Q = I × t).'
          },
          {
            action: 'Anode vs Cathode Reaction',
            expected_outcome: 'Copper dissolves at anode (Cu → Cu²⁺ + 2e⁻) and deposits at cathode (Cu²⁺ + 2e⁻ → Cu).',
            key_takeaway: 'Total mass of copper in system remains conserved.'
          }
        ]
      }
    }
  },
  {
    id: 100,
    key: 'chem_electrode_potential_explorer',
    title: 'Standard Electrode Potential Explorer',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Electrochemistry',
    status: 'ACTIVE',
    description: 'Compare different metals against the Standard Hydrogen Electrode to understand why some metals lose electrons more easily.',
    archetype: 'electrode_potential_explorer',
    config: {
      context_spec: {
        overview: 'Standard electrode potentials predict the direction of electron flow. Electrons always flow from the half-cell with the lower reduction potential toward the half-cell with the higher reduction potential.',
        how_to_use: [
          'Step 1: Select a metal from the dropdown.',
          'Step 2: Predict which way electrons will flow.',
          'Step 3: Observe the voltmeter reading and electron flow direction.',
          'Step 4: Explore both positive and negative potentials.'
        ],
        expected_results: [
          {
            action: 'Positive E° (e.g. Copper +0.34V)',
            expected_outcome: 'Electrons flow from Hydrogen to the Metal.',
            key_takeaway: 'Higher reduction potential means greater tendency to gain electrons (stronger oxidizing agent).'
          },
          {
            action: 'Negative E° (e.g. Magnesium -2.37V)',
            expected_outcome: 'Electrons flow from the Metal to Hydrogen.',
            key_takeaway: 'Lower reduction potential means greater tendency to lose electrons (stronger reducing agent).'
          }
        ]
      }
    }
  },
  {
    id: 101,
    key: 'chem_preferential_discharge',
    title: 'Preferential Discharge of Ions',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Electrochemistry',
    status: 'ACTIVE',
    description: 'Watch ions compete at the electrodes and discover why concentration, electrochemical position, and electrode material determine the winner.',
    archetype: 'preferential_discharge',
    config: {
      context_spec: {
        overview: 'When several ions are present, the ion discharged depends on its position in the electrochemical series, concentration, and the electrode involved.',
        how_to_use: [
          'Step 1: Choose an electrolyte.',
          'Step 2: Start Electrolysis.',
          'Step 3: Watch the ions compete at the electrodes.',
          'Step 4: Read the observation panel to understand why the winning ion was chosen.'
        ],
        expected_results: [
          {
            action: 'Dilute vs Concentrated NaCl',
            expected_outcome: 'Dilute favors OH⁻, Concentrated favors Cl⁻ at the anode.',
            key_takeaway: 'High concentration can override position in the electrochemical series.'
          },
          {
            action: 'Inert vs Active Copper Electrode',
            expected_outcome: 'Active copper dissolves instead of discharging an anion.',
            key_takeaway: 'The nature of the electrode itself can participate in the reaction.'
          }
        ]
      }
    }
  },
  {
    id: 4,
    key: 'chem_acid_base_dissociation',
    title: 'Acid-Base Strength & Ionization Dynamics',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Acids, Bases and Salts',
    status: 'ACTIVE',
    description: 'Explore how acid strength (ionization constant Ka) and concentration dictate free H3O+ ion counts, pH, and electrical conductivity.',
    archetype: 'acid_base_dissociation',
    config: {
      initial_acid_type: 'weak_acid',
      initial_concentration: 0.1,
      min_concentration: 0.001,
      max_concentration: 1.0,
      step: 0.005,
      weak_acid_ka: 0.000018,
      context_spec: {
        overview: 'Explore how acid strength (ionization constant Ka) and concentration dictate free [H3O+] ion counts, pH, and electrical conductivity.',
        how_to_use: [
          'Step 1: Toggle between Strong Acid (HA → 100% ionized) and Weak Acid (HA ⇌ partial).',
          'Step 2: Drag the Concentration slider from 0.001 M to 1.0 M.',
          'Step 3: Select measurement probes: Digital pH Meter, Conductivity Light Bulb, or Particle View.'
        ],
        expected_results: [
          {
            action: 'Comparing 0.1 M Strong vs 0.1 M Weak Acid',
            expected_outcome: 'Strong acid yields pH 1.0 & bright bulb; Weak acid yields pH 2.87 & dim bulb.',
            key_takeaway: 'Strong acids ionize completely; weak acids ionize partially.'
          },
          {
            action: 'Diluting Strong Acid to 0.001 M',
            expected_outcome: 'pH rises to 3.0, matching the pH of a higher-concentration weak acid.',
            key_takeaway: 'pH measures free H3O+ concentration, not total added acid.'
          }
        ]
      }
    }
  },
  {
    id: 5,
    key: 'chem_salts_solubility_precipitation',
    title: 'Salt Solubility & Precipitation Equilibrium',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Acids, Bases and Salts',
    status: 'ACTIVE',
    description: 'See the difference between a soluble salt (NaCl) that disappears into solution and an insoluble salt (AgCl) that forms a solid precipitate at the bottom of the beaker.',
    archetype: 'salt_solubility_precipitation',
    config: {
      max_mass_g: 10,
      context_spec: {
        overview: 'Explore solubility by comparing NaCl (highly soluble) versus AgCl (practically insoluble) using a simple add-salt beaker interaction.',
        how_to_use: [
          'Step 1: Select a salt type — Table Salt (NaCl - Soluble) or Silver Chloride (AgCl - Insoluble).',
          "Step 2: Click 'Add Spoonful (+1 g)' or drag the salt amount slider to add mass.",
          'Step 3: Observe whether the beaker stays clear (dissolved) or forms a solid pile at the bottom (precipitate).',
          'Step 4: Try adjusting the temperature slider to see how heating affects solubility.'
        ],
        expected_results: [
          {
            action: 'Adding NaCl to water',
            expected_outcome: 'Salt dissolves completely. Water stays clear with free Na+ and Cl- ions.',
            key_takeaway: 'NaCl is highly soluble (36 g per 100 mL). Adding small amounts produces no precipitate.'
          },
          {
            action: 'Adding AgCl to water',
            expected_outcome: 'Salt immediately forms a white solid precipitate at the bottom. Virtually none dissolves.',
            key_takeaway: 'AgCl is practically insoluble. The dissolved amount is negligible.'
          }
        ]
      }
    }
  },
  {
    id: 6,
    key: 'chem_hess_law_pathways',
    title: "Hess's Law & Reaction Pathways",
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Energy Changes in Chemical and Physical Processes',
    status: 'ACTIVE',
    description: "Visually discover Hess's Law by comparing a direct reaction with a two-step reaction pathway.",
    archetype: 'hess_law_pathways',
    config: {
      context_spec: {
        overview: "Different reaction pathways can have different intermediate energy changes, but the total enthalpy change is always the same.",
        how_to_use: [
          "Step 1: Click 'Route 1' and 'Run Simulation' to observe the direct energy and temperature change.",
          "Step 2: Reset the simulation.",
          "Step 3: Click 'Route 2' and 'Run Simulation' to observe the two-step pathway.",
          "Step 4: Compare the final total energy and final temperature."
        ],
        expected_results: [
          {
            action: "Running both reaction pathways",
            expected_outcome: "Both pathways result in exactly the same total enthalpy change (-100 kJ/mol) and final temperature (44.0°C).",
            key_takeaway: "The total enthalpy change of a reaction is independent of the pathway taken."
          }
        ]
      }
    }
  },
  {
    id: 7,
    key: 'chem_heat_of_solution_pack',
    title: 'Heat of Solution (Hot Pack vs Cold Pack)',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Energy Changes in Chemical and Physical Processes',
    status: 'ACTIVE',
    description: 'Compare an exothermic dissolution (Hot Pack) with an endothermic dissolution (Cold Pack) to visualize energy flow.',
    archetype: 'heat_of_solution_pack',
    config: {
      context_spec: {
        overview: "When dissolving a substance, energy is used to separate ions (Lattice Energy) and energy is released when water surrounds those ions (Hydration Energy).",
        how_to_use: [
          "Step 1: Click 'Hot Pack' and 'Dissolve Salt' to observe an exothermic reaction.",
          "Step 2: Note the energy flow direction and temperature change.",
          "Step 3: Reset the simulation.",
          "Step 4: Click 'Cold Pack' and 'Dissolve Salt' to observe an endothermic reaction."
        ],
        expected_results: [
          {
            action: "Hot Pack (Exothermic)",
            expected_outcome: "Temperature increases. Energy flows out. Hydration Energy > Lattice Energy.",
            key_takeaway: "More energy was released than absorbed."
          },
          {
            action: "Cold Pack (Endothermic)",
            expected_outcome: "Temperature decreases. Energy flows in. Lattice Energy > Hydration Energy.",
            key_takeaway: "More energy was absorbed than released."
          }
        ]
      }
    }
  },
  {
    id: 8,
    key: 'chem_collision_theory_kinetics',
    title: 'Collision Theory & Activation Energy',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Reaction Rates and Reversible Reactions',
    status: 'ACTIVE',
    description: 'Adjust collision conditions and discover what is required for a successful chemical reaction.',
    archetype: 'collision_theory_kinetics',
    config: {
      activation_energy: 50,
      context_spec: {
        overview: "Chemical reactions only occur when particles collide with enough energy and in the correct orientation.",
        how_to_use: [
          "Step 1: Adjust the launch speed.",
          "Step 2: Choose a collision orientation.",
          "Step 3: Run the collision.",
          "Step 4: Observe the outcome.",
          "Step 5: Discover why reactions succeed or fail."
        ],
        expected_results: [
          {
            action: "Low Energy Collision",
            expected_outcome: "Particles bounce apart.",
            key_takeaway: "Low energy prevents reactions."
          },
          {
            action: "High Energy, Wrong Orientation",
            expected_outcome: "Particles glance off each other.",
            key_takeaway: "Wrong orientation prevents reactions."
          },
          {
            action: "High Energy, Correct Orientation",
            expected_outcome: "Successful reaction! New bonds formed.",
            key_takeaway: "Both conditions together produce a successful reaction."
          }
        ]
      }
    }
  },
  {
    id: 99,
    key: 'chem_haber_process_optimizer',
    title: 'Industrial Optimization: The Haber Process',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Reaction Rates and Reversible Reactions',
    status: 'ACTIVE',
    description: 'Adjust the reactor conditions and discover why industry chooses compromise conditions instead of maximizing a single variable.',
    archetype: 'chem_haber_process_optimizer',
    config: {
      context_spec: {
        overview: 'The Haber Process produces ammonia by balancing reaction rate and equilibrium yield. Industry chooses operating conditions that provide a practical compromise rather than maximizing a single factor.',
        how_to_use: [
          'Step 1: Adjust temperature.',
          'Step 2: Adjust pressure.',
          'Step 3: Observe reaction speed.',
          'Step 4: Observe ammonia yield.',
          'Step 5: Discover the compromise used in industry.'
        ],
        expected_results: [
          {
            action: 'Increasing Temperature',
            expected_outcome: 'Increases reaction speed but reduces equilibrium yield.',
            key_takeaway: 'Industry must compromise to get product fast enough.'
          },
          {
            action: 'Increasing Pressure',
            expected_outcome: 'Favours ammonia formation.',
            key_takeaway: 'Higher pressure increases yield but has practical limits.'
          }
        ]
      }
    }
  },
  {
    id: 100,
    key: 'chem_voltaic_cell_flow',
    title: 'Voltaic Cell & Salt Bridge',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Electrochemistry',
    status: 'ACTIVE',
    description: 'Observe the complete operation of a Daniel Cell including electron flow, oxidation, reduction, and salt bridge function.',
    archetype: 'chem_voltaic_cell_flow',
    config: {
      context_spec: {
        overview: 'How does a voltaic cell produce electricity? Watch the simultaneous movement of electrons and ions to see chemistry in action.',
        how_to_use: [
          'Step 1: Start the cell.',
          'Step 2: Observe electron flow.',
          'Step 3: Observe oxidation and reduction at the electrodes.',
          'Step 4: Observe ion movement in the salt bridge.'
        ],
        expected_results: [
          {
            action: 'Starting the cell',
            expected_outcome: 'Electrons flow from anode to cathode.',
            key_takeaway: 'Zinc releases electrons more readily than Copper.'
          },
          {
            action: 'Continuous operation',
            expected_outcome: 'Ions flow through the salt bridge.',
            key_takeaway: 'The salt bridge maintains electrical neutrality, allowing the current to continue flowing.'
          }
        ]
      }
    }
  },
  {
    id: 101,
    key: 'chem_electroplating',
    title: "Electroplating & Faraday's Laws",
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Electrochemistry',
    status: 'ACTIVE',
    description: 'A deterministic simulation demonstrating electroplating as the practical application of electrolysis while proving Faraday\'s Laws.',
    archetype: 'chem_electroplating',
    config: {
      context_spec: {
        overview: 'How does electric current deposit metal onto an object? Watch the simultaneous movement of ions and mass transfer to see electroplating in action and prove Faraday\'s First Law mathematically.',
        how_to_use: [
          'Step 1: Choose an object to plate.',
          'Step 2: Choose a coating metal.',
          'Step 3: Adjust the current (Amperage).',
          'Step 4: Start plating and observe mass transfer.'
        ],
        expected_results: [
          {
            action: 'Increasing Current',
            expected_outcome: 'Faster metal deposition and anode depletion.',
            key_takeaway: 'Mass deposited is directly proportional to current (Faraday\'s First Law).'
          }
        ]
      }
    }
  },
  {
    id: 102,
    key: 'chem_activity_series_displacement',
    title: 'Metal Reactivity & Activity Series',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Metals',
    status: 'ACTIVE',
    description: 'A lightweight React simulation demonstrating how the activity (reactivity) series determines whether a displacement reaction occurs.',
    archetype: 'chem_activity_series_displacement',
    config: {
      context_spec: {
        overview: 'Visually determine whether a metal will replace another metal dissolved in solution based on their positions in the activity series.',
        how_to_use: [
          'Step 1: Select a metal strip.',
          'Step 2: Select a metal salt solution.',
          'Step 3: Check their relative reactivity in the Activity Series panel.',
          'Step 4: Run the experiment and observe if a displacement reaction occurs.'
        ],
        expected_results: [
          {
            action: 'More reactive metal in less reactive solution (e.g. Zinc in Copper Sulfate)',
            expected_outcome: 'The metal strip is coated and the solution color fades. A reaction occurs.',
            key_takeaway: 'More reactive metals displace less reactive metals from their solutions.'
          },
          {
            action: 'Less reactive metal in more reactive solution (e.g. Copper in Zinc Sulfate)',
            expected_outcome: 'No change occurs.',
            key_takeaway: 'Less reactive metals cannot displace more reactive ones.'
          }
        ]
      }
    }
  },
  {
    id: 9,
    key: 'chemical_equilibrium',
    title: 'Chemical Equilibrium',
    subject: 'CHEMISTRY',
    subject_display: 'Chemistry',
    topic: 'Reaction Rates and Reversible Reactions',
    status: 'PLACEHOLDER',
    description: "Explore dynamic equilibrium shifts and Le Chatelier's principle under concentration and thermal pressure changes.",
    archetype: 'chemical_equilibrium',
    config: {
      planned_features: ['Le Chatelier Shift Slider', 'Equilibrium Constant Calculation'],
      context_spec: {
        overview: "Illustrates Le Chatelier's Principle by showing how dynamic chemical systems respond to temperature, pressure, and concentration stress.",
        how_to_use: [
          'Step 1: Select dynamic reaction parameters (temperature, reactant concentrations).',
          'Step 2: Apply a concentration or thermal stress to the system.',
          'Step 3: Observe the reaction quotient (Qc) shift relative to equilibrium constant (Kc).'
        ],
        expected_results: [
          {
            action: 'Applying Stress',
            expected_outcome: 'System shifts position of equilibrium in direction that offsets applied stress.',
            key_takeaway: 'Dynamic equilibrium is restored when Qc = Kc.'
          }
        ]
      }
    }
  },
  {
    id: 8,
    key: 'freefall',
    title: 'Freefall Acceleration',
    subject: 'PHYSICS',
    subject_display: 'Physics',
    topic: 'Gravity & Kinematics',
    status: 'PLACEHOLDER',
    description: 'Analyze uniform acceleration and velocity-time graphs for objects falling under gravity.',
    archetype: 'freefall',
    config: { planned_features: ['Gravity Selector (Earth/Moon/Mars)', 'Air Resistance Toggle'] }
  },
  {
    id: 9,
    key: 'circuit',
    title: 'Circuit Builder',
    subject: 'PHYSICS',
    subject_display: 'Physics',
    topic: 'Direct Current Circuits',
    status: 'PLACEHOLDER',
    description: 'Interactive circuit schematic builder to test Ohm\'s law, resistors in series/parallel, and voltage drops.',
    archetype: 'circuit',
    config: { planned_features: ['Resistor Grid', 'Ammeter & Voltmeter Probes'] }
  },
  {
    id: 10,
    key: 'optics',
    title: 'Ray Optics & Lenses',
    subject: 'PHYSICS',
    subject_display: 'Physics',
    topic: 'Geometric Optics',
    status: 'PLACEHOLDER',
    description: 'Trace focal rays through convex and concave lenses to visualize real vs. virtual image formation.',
    archetype: 'optics',
    config: { planned_features: ['Focal Length Adjustment', 'Focal Ray Tracing'] }
  }
];

const SUBJECT_CONFIG = {
  ALL: { name: 'All Subjects', icon: SlidersHorizontal, color: 'text-gray-700 bg-gray-100' },
  CHEMISTRY: { name: 'Chemistry', icon: Beaker, color: 'text-cyan-600 bg-cyan-50' },
  PHYSICS: { name: 'Physics', icon: Zap, color: 'text-amber-600 bg-amber-50' },
  BIOLOGY: { name: 'Biology', icon: Dna, color: 'text-emerald-600 bg-emerald-50' },
  MATHEMATICS: { name: 'Mathematics', icon: Calculator, color: 'text-purple-600 bg-purple-50' }
};

const CHEMISTRY_TOPICS = [
  { id: 1, title: 'Acids, Bases and Salts' },
  { id: 2, title: 'Energy Changes in Chemical and Physical Processes' },
  { id: 3, title: 'Reaction Rates and Reversible Reactions' },
  { id: 4, title: 'Electrochemistry' },
  { id: 5, title: 'Metals' },
  { id: 6, title: 'Organic Chemistry II' },
  { id: 7, title: 'Radioactivity' }
];

export default function Simulations() {
  const { user } = useContext(UserContext);
  const [simulations, setSimulations] = useState(LOCAL_FALLBACK_SIMULATIONS);
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/curriculum/simulations/')
      .then((res) => {
        if (!res.ok) throw new Error('API query failed');
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : data.results || [];
        if (items.length > 0) {
          setSimulations(items);
        }
      })
      .catch((err) => {
        console.warn('Using fallback simulation dataset:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getSubjectCount = (subKey) => {
    if (subKey === 'ALL') return simulations.length;
    return simulations.filter((s) => s.subject === subKey).length;
  };

  const getGroupedSimulations = () => {
    const subjects = selectedSubject === 'ALL' ? ['CHEMISTRY', 'PHYSICS', 'BIOLOGY', 'MATHEMATICS'] : [selectedSubject];

    return subjects
      .map((sub) => {
        const items = simulations.filter((s) => s.subject === sub);
        const activeCount = items.filter((s) => s.status === 'ACTIVE').length;
        const upcomingCount = items.filter((s) => s.status !== 'ACTIVE').length;
        
        if (sub === 'CHEMISTRY') {
          const topicGroups = CHEMISTRY_TOPICS.map(topic => {
            const topicItems = items.filter(s => s.topic === topic.title);
            return {
              ...topic,
              items: topicItems
            };
          });
          
          const officialTopicTitles = CHEMISTRY_TOPICS.map(t => t.title);
          const orphanItems = items.filter(s => !officialTopicTitles.includes(s.topic));
          
          return {
            subjectKey: sub,
            info: SUBJECT_CONFIG[sub] || { name: sub, icon: Beaker },
            items,
            activeCount,
            upcomingCount,
            isChemistry: true,
            topicGroups,
            orphanItems
          };
        }

        return {
          subjectKey: sub,
          info: SUBJECT_CONFIG[sub] || { name: sub, icon: Beaker },
          items,
          activeCount,
          upcomingCount,
          isChemistry: false
        };
      })
      .filter((group) => selectedSubject !== 'ALL' || group.items.length > 0 || group.isChemistry);
  };

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100/80 z-10 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-gray-100">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Beaker className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 text-sm mb-6">
            Please sign in to access interactive virtual experiment simulations.
          </p>
          <Link
            to="/login"
            className="inline-block w-full bg-custom-blue text-white py-3 rounded-2xl font-medium hover:bg-custom-orange transition-colors shadow-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Render mounted simulation player with SimulationViewerContainer wrapper
  if (activeSimulation) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setActiveSimulation(null)}
            className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-custom-orange transition-colors cursor-pointer bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Simulations Catalog
          </button>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-custom-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {activeSimulation.topic || activeSimulation.subject_display || activeSimulation.subject}
            </span>
          </div>
        </div>

        {/* Guided Discovery Wrapper Container */}
        <SimulationViewerContainer
          simulation={activeSimulation}
          onTelemetry={(eventName, payload) => {
            console.log(`[Simulation Telemetry] ${eventName}:`, payload);
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Beaker className="w-8 h-8 text-custom-orange" />
            Experiment Simulations
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Interactive virtual labs, dynamic models, and parameter-driven STEM simulations.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-blue-50 text-custom-blue px-4 py-2 rounded-2xl border border-blue-100 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-custom-orange" />
          {simulations.filter((s) => s.status === 'ACTIVE').length} Active Simulations Ready
        </div>
      </div>

      {/* Horizontal Filter Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {Object.keys(SUBJECT_CONFIG).map((subKey) => {
          const conf = SUBJECT_CONFIG[subKey];
          const Icon = conf.icon;
          const count = getSubjectCount(subKey);
          const isSelected = selectedSubject === subKey;

          return (
            <button
              key={subKey}
              onClick={() => setSelectedSubject(subKey)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? 'bg-custom-orange text-white shadow-md border-custom-orange'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
              {conf.name}
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Categorized Grid Views */}
      <div className="space-y-12">
        {getGroupedSimulations().map((group) => {
          const Icon = group.info.icon;
          return (
            <section key={group.subjectKey} className="space-y-8">
              {/* Category Section Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
                  <span className={`p-2 rounded-xl ${group.info.color}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  {group.info.name}
                  <span className="text-sm font-normal text-gray-500">
                    — {group.activeCount} Active, {group.upcomingCount} Upcoming
                  </span>
                </h2>
              </div>

              {group.isChemistry ? (
                <div className="space-y-10 pl-2">
                  {group.topicGroups.map((topic) => (
                    <div key={topic.id} className="space-y-4">
                      <div className="flex items-end justify-between pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Topic {topic.id}</span>
                          <h3 className="text-lg font-bold text-slate-800">{topic.title}</h3>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          {topic.items.length} {topic.items.length === 1 ? 'Simulation' : 'Simulations'}
                        </span>
                      </div>
                      
                      {topic.items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {topic.items.map((sim) => (
                            <SimulationCard key={sim.key || sim.id} simulation={sim} onLaunch={setActiveSimulation} />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-8 text-center text-slate-500 text-sm">
                          <p className="font-medium text-slate-600 mb-1">Simulations coming soon.</p>
                          <p className="text-xs">These interactive activities will be available in a future update.</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {group.orphanItems.length > 0 && (
                    <div className="space-y-4 pt-6">
                      <div className="flex items-end justify-between pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Other Topics</span>
                          <h3 className="text-lg font-bold text-slate-800">Additional Chemistry Simulations</h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.orphanItems.map((sim) => (
                          <SimulationCard key={sim.key || sim.id} simulation={sim} onLaunch={setActiveSimulation} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                group.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.items.map((sim) => (
                      <SimulationCard key={sim.key || sim.id} simulation={sim} onLaunch={setActiveSimulation} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-3xl p-8 text-center text-gray-500 text-sm">
                    No simulations currently registered for {group.info.name}.
                  </div>
                )
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

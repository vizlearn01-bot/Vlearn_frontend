/**
 * Curriculum topics and grade-level segregation definitions for VLearn Simulations.
 * Strictly maps topics according to KCSE Secondary Curriculum (Form 1 - Form 4) and CBC (Grade 10).
 */

export const GRADE_CONFIG = [
  { id: 'ALL', name: 'All Grades & Forms' },
  { id: 'FORM_4', name: 'Form 4', badge: 'Form 4' },
  { id: 'FORM_3', name: 'Form 3', badge: 'Form 3' },
  { id: 'FORM_2', name: 'Form 2', badge: 'Form 2' },
  { id: 'FORM_1', name: 'Form 1', badge: 'Form 1' },
  { id: 'GRADE_10', name: 'Grade 10 (CBC)', badge: 'Grade 10' },
];

export const CURRICULUM_STRUCTURE = {
  CHEMISTRY: {
    FORM_3: [
      {
        id: 1,
        title: 'Gas Laws',
        form: 'Form 3',
        simKeys: [
          'charles_law',
          'boyles_law',
          'grahams_law',
          'chem_charles_law',
          'chem_charles_law_guided',
          'charles_law_guided',
          'chem_boyles_law',
          'chem_grahams_law',
          'chem_grahams_law_diffusion',
          'grahams_law_diffusion',
        ],
      },
      {
        id: 2,
        title: 'The Mole: Formulae and Chemical Equations',
        form: 'Form 3',
        simKeys: [
          'chem_titration_volumetric_analysis',
          'titration_volumetric_analysis',
          'titration_lab',
          'titration',
          'chem_titration',
          'volumetric_analysis',
        ],
      },
      {
        id: 3,
        title: 'Organic Chemistry I (Aliphatic Hydrocarbons)',
        form: 'Form 3',
        simKeys: [],
      },
      {
        id: 4,
        title: 'Nitrogen and its Compounds',
        form: 'Form 3',
        simKeys: [],
      },
      {
        id: 5,
        title: 'Sulphur and its Compounds',
        form: 'Form 3',
        simKeys: [],
      },
      {
        id: 6,
        title: 'Chlorine and its Compounds',
        form: 'Form 3',
        simKeys: [],
      },
    ],
    FORM_4: [
      {
        id: 1,
        title: 'Acids, Bases and Salts',
        form: 'Form 4',
        simKeys: [
          'chem_acid_base_dissociation',
          'acid_base_dissociation',
          'acid_base',
          'chem_salts_solubility_precipitation',
          'salt_solubility_precipitation',
        ],
      },
      {
        id: 2,
        title: 'Energy Changes in Chemical and Physical Processes',
        form: 'Form 4',
        simKeys: [
          'chem_hess_law_pathways',
          'hess_law_pathways',
          'chem_heat_of_solution_pack',
          'heat_of_solution_pack',
        ],
      },
      {
        id: 3,
        title: 'Reaction Rates and Reversible Reactions',
        form: 'Form 4',
        simKeys: [
          'chem_collision_theory_kinetics',
          'collision_theory_kinetics',
          'reaction_rate',
          'chem_haber_process_optimizer',
          'chemical_equilibrium',
          'chemical',
        ],
      },
      {
        id: 4,
        title: 'Electrochemistry',
        form: 'Form 4',
        simKeys: [
          'chem_electrode_potential_explorer',
          'electrode_potential_explorer',
          'chem_preferential_discharge',
          'preferential_discharge',
          'chem_electroplating',
          'electroplating',
          'chem_voltaic_cell_flow',
          'electrolysis',
        ],
      },
      {
        id: 5,
        title: 'Metals',
        form: 'Form 4',
        simKeys: [
          'chem_activity_series_displacement',
          'chem_metal_reactivity_series',
          'metal_reactivity_series',
        ],
      },
      {
        id: 6,
        title: 'Organic Chemistry II (Alkanols and Alkanoic Acids)',
        form: 'Form 4',
        simKeys: [
          'chem_soap_micelle_action',
          'soap_micelle_action',
          'chem_functional_group_tests',
          'functional_group_tests',
        ],
      },
      {
        id: 7,
        title: 'Radioactivity',
        form: 'Form 4',
        simKeys: [
          'chem_radioactive_decay_half_life',
          'radioactive_decay_half_life',
          'chem_nuclear_fission_chain_reaction',
          'nuclear_fission_chain_reaction',
        ],
      },
    ],
    FORM_2: [
      { id: 1, title: 'Structure of the Atom & Periodic Table', form: 'Form 2', simKeys: [] },
      { id: 2, title: 'Chemical Families: Patterns and Properties', form: 'Form 2', simKeys: [] },
      { id: 3, title: 'Structure and Bonding', form: 'Form 2', simKeys: [] },
      { id: 4, title: 'Salts (Introductory Preparation)', form: 'Form 2', simKeys: [] },
      { id: 5, title: 'Effect of an Electric Current on Substances', form: 'Form 2', simKeys: ['electrolysis'] },
      { id: 6, title: 'Carbon and its Compounds', form: 'Form 2', simKeys: [] },
    ],
    FORM_1: [
      { id: 1, title: 'Introduction to Chemistry', form: 'Form 1', simKeys: [] },
      { id: 2, title: 'Simple Classification of Substances', form: 'Form 1', simKeys: [] },
      { id: 3, title: 'Acids, Bases and Indicators', form: 'Form 1', simKeys: [] },
      { id: 4, title: 'Air and Combustion', form: 'Form 1', simKeys: [] },
      { id: 5, title: 'Water and Hydrogen', form: 'Form 1', simKeys: [] },
    ],
    GRADE_10: [
      { id: 1, title: 'Introduction to Chemistry', form: 'Grade 10', simKeys: [] },
      { id: 2, title: 'The Atom & Periodic Table', form: 'Grade 10', simKeys: [] },
      { id: 3, title: 'Chemical Bonding & Periodicity', form: 'Grade 10', simKeys: [] },
      { id: 4, title: 'Acids and Bases', form: 'Grade 10', simKeys: ['chem_acid_base_dissociation'] },
      { id: 5, title: 'Introduction to Salts', form: 'Grade 10', simKeys: ['chem_salts_solubility_precipitation'] },
      { id: 6, title: 'Introductory Organic Chemistry', form: 'Grade 10', simKeys: [] },
    ],
  },
  PHYSICS: {
    FORM_4: [
      {
        id: 1,
        title: 'Thin Lenses & Optical Instruments',
        form: 'Form 4',
        simKeys: [
          'compound_microscope_telescope',
          'convex_lens_image_formation',
          'diverging_lens_simulator',
          'eye_defects_simulator',
        ],
      },
      {
        id: 2,
        title: 'Uniform Circular Motion',
        form: 'Form 4',
        simKeys: [
          'vertical_circle_loop',
          'banked_track_dynamics',
          'centripetal_force_sources',
          'circular_motion_angular_quantities',
        ],
      },
      {
        id: 3,
        title: 'Floating and Sinking',
        form: 'Form 4',
        simKeys: [
          'archimedes_principle_buoyancy',
          'law_of_floatation_equilibrium',
          'hydrometer_calibration_density',
          'balloons_and_submarines_buoyancy',
        ],
      },
      {
        id: 4,
        title: 'Electromagnetic Spectrum',
        form: 'Form 4',
        simKeys: [
          'em_spectrum_analyzer_bands',
          'em_wave_orthogonal_fields',
          'speed_of_light_experiments',
          'em_radiation_attenuation_hazards',
        ],
      },
      {
        id: 5,
        title: 'Electromagnetic Induction',
        form: 'Form 4',
        simKeys: [
          'faradays_law_magnetic_flux',
          'lenzs_law_eddy_currents',
          'ac_generator_slip_rings',
          'transformer_mutual_induction',
        ],
      },
      {
        id: 6,
        title: 'Mains Electricity',
        form: 'Form 4',
        simKeys: [
          'high_voltage_grid_transmission',
          'domestic_wiring_ring_main',
          'electrical_safety_fuses_earthing',
          'energy_consumption_costing_meter',
        ],
      },
      {
        id: 7,
        title: 'Cathode Rays & CRTs',
        form: 'Form 4',
        simKeys: [
          'crt',
          'magnetic_deflection_cathode_rays',
          'cro_waveform_diagnostics',
          'thomson_specific_charge_em',
        ],
      },
      {
        id: 8,
        title: 'X-Rays Production Mechanics',
        form: 'Form 4',
        simKeys: [
          'xray_atomic_transitions',
          'x_ray',
          'xray_attenuation_radiography',
          'braggs_law_crystal_diffraction',
        ],
      },
      {
        id: 9,
        title: 'Photoelectric Effect',
        form: 'Form 4',
        simKeys: [
          'gold_leaf_electroscope_uv',
          'photoelectric',
          'stopping_potential_planck_graph',
          'photocell_circuit_applications',
        ],
      },
      {
        id: 10,
        title: 'Radioactivity & Nuclear Physics',
        form: 'Form 4',
        simKeys: [
          'radioactive_decay_half_life',
          'nuclear_fission_chain_reaction',
          'radiation_deflection_shielding_alpha_beta_gamma',
          'binding_energy_per_nucleon_curve',
        ],
      },
      {
        id: 11,
        title: 'Electronics & Logic Gates',
        form: 'Form 4',
        simKeys: [
          'pn_junction_diode_rectification',
          'digital_logic_gates_truth_tables',
          'transistor_switch_sensor_circuit',
          'combinational_logic_half_adder',
        ],
      },
    ],
    FORM_3: [
      { id: 1, title: 'Linear Motion & Freefall', form: 'Form 3', simKeys: ['freefall'] },
      { id: 2, title: 'Refraction of Light', form: 'Form 3', simKeys: ['optics'] },
      { id: 3, title: 'Newton\'s Laws of Motion', form: 'Form 3', simKeys: [] },
      { id: 4, title: 'Work, Energy, Power & Machines', form: 'Form 3', simKeys: [] },
      { id: 5, title: 'Current Electricity & Circuit Builder', form: 'Form 3', simKeys: ['circuit'] },
      { id: 6, title: 'Waves II', form: 'Form 3', simKeys: [] },
      { id: 7, title: 'Electrostatics II', form: 'Form 3', simKeys: [] },
      { id: 8, title: 'Heating Effect of Electric Current', form: 'Form 3', simKeys: [] },
      { id: 9, title: 'Quantity of Heat', form: 'Form 3', simKeys: [] },
      { id: 10, title: 'Gas Laws (Thermal Expansion)', form: 'Form 3', simKeys: ['charles_law', 'boyles_law'] },
    ],
  },
  MATHEMATICS: {
    FORM_4: [
      { id: 1, title: 'Matrix and Transformations', form: 'Form 4', simKeys: ['math_matrix_transformation', 'matrix_transformation'] },
      { id: 2, title: 'Statistics II (Ogive Explorer)', form: 'Form 4', simKeys: ['math_statistics_ogive_explorer', 'ogive_explorer'] },
      { id: 3, title: 'Three Dimensional Geometry', form: 'Form 4', simKeys: ['math_3d_geometry_explorer', 'three_d_geometry'] },
      { id: 4, title: 'Trigonometry III (Waves & Graphs)', form: 'Form 4', simKeys: ['math_trigonometry_wave_explorer', 'trigonometry_wave'] },
      { id: 5, title: 'Longitudes and Latitudes (Earth Globe)', form: 'Form 4', simKeys: ['math_earth_globe_explorer', 'earth_globe'] },
      { id: 6, title: 'Linear Programming', form: 'Form 4', simKeys: ['math_linear_programming_explorer', 'linear_programming'] },
      { id: 7, title: 'Loci and Geometric Construction', form: 'Form 4', simKeys: ['math_loci_construction_explorer', 'loci_construction'] },
      { id: 8, title: 'Calculus: Differentiation', form: 'Form 4', simKeys: ['math_differentiation_explorer', 'differentiation'] },
      { id: 9, title: 'Calculus: Integration', form: 'Form 4', simKeys: ['math_integration_explorer', 'integration'] },
      { id: 10, title: 'Area Approximations (Trapezoidal Rule)', form: 'Form 4', simKeys: ['math_area_approximation_explorer', 'area_approximation'] },
    ],
  },
  BIOLOGY: {
    FORM_4: [
      {
        id: 1,
        title: 'Genetics',
        form: 'Form 4',
        simKeys: [
          'meiosis_genetic_variation',
          'bio_meiosis_genetic_variation',
          'meiosis_sim',
          'monohybrid_dihybrid_punnett_genetics',
          'mendelian_inheritance_lab',
          'punnett_genetics',
          'bio_mendelian_inheritance',
          'sex_linked_inheritance',
          'bio_sex_linked_inheritance',
          'sex_linkage_sim',
        ],
      },
      {
        id: 2,
        title: 'Evolution',
        form: 'Form 4',
        simKeys: [
          'natural_selection_peppered_moth_simulation',
          'natural_selection_evolution',
          'natural_selection_evolution_sim',
          'peppered_moth_natural_selection',
          'bio_natural_selection',
          'speciation_geographic_isolation',
          'speciation_geographic_isolation_sim',
          'bio_speciation_geographic_isolation',
          'speciation_sim',
          'allopatric_speciation_sim',
          'homologous_pentadactyl_limb_evolution_3d',
          'homologous_limbs_evolution',
          'homologous_limbs_evolution_sim',
          'bio_homologous_pentadactyl_limb',
          'homologous_pentadactyl_limb',
        ],
      },
      {
        id: 3,
        title: 'Reception, Response and Coordination',
        form: 'Form 4',
        simKeys: [
          'reflex_arc_synaptic_transmission_sim',
          'human_reflex_arc',
          'bio_human_reflex_arc',
          'human_reflex_arc_sim',
          'human_eye_accommodation_defects_3d',
          'human_eye_accommodation',
          'bio_human_eye_accommodation',
          'eye_accommodation_sim',
          'nerve_impulse_synaptic_transmission',
          'bio_nerve_impulse_synaptic_transmission',
          'synaptic_transmission_sim',
          'nerve_impulse_synapse_sim',
          'nerve_impulse_synapse',
        ],
      },
      {
        id: 4,
        title: 'Support and Movement in Plants and Animals',
        form: 'Form 4',
        simKeys: [
          'synovial_joint_biomechanics_3d',
          'bio_synovial_joint_biomechanics_3d',
          'synovial_joint',
          'human_joint_movement',
          'bio_human_joint_movement',
          'human_arm_antagonistic_muscles_3d',
          'bio_human_arm_antagonistic_muscles_3d',
          'antagonistic_muscle_pair',
          'bio_antagonistic_muscle_pair',
          'antagonistic_muscles',
          'human_arm_muscles',
          'muscle_sliding_filament_mechanism',
          'sliding_filament_sim',
          'bio_sliding_filament_mechanism',
          'sliding_filament_mechanism',
          'muscle_contraction_sliding_filament',
          'sliding_filament',
          'bio_sliding_filament',
        ],
      },
    ],
    GRADE_10: [
      {
        id: 1,
        title: 'Cell Biology and Biodiversity',
        form: 'Grade 10',
        simKeys: [
          // Animal vs Plant Cell
          'animal_vs_plant_cell',
          'animal_vs_plant_cell_sim',
          'bio_animal_vs_plant_cell',
          'bio_animal_vs_plant_cell_sim',
          'plant_cell_vs_animal_cell',
          'plant_vs_animal_cell',
          // Cell Size and Surface Area to Volume Ratio
          'cell_size_surface_area',
          'cell_size_surface_area_sim',
          'bio_cell_size_surface_area',
          'bio_cell_size_surface_area_sim',
          'cell_surface_area_to_volume',
          'bio_cell_surface_area_to_volume',
          'cell_size_sa_v_ratio',
          'surface_area_to_volume_cell',
          'cell_size_sim',
          'bio_cell_size_sim',
          // Hierarchical Levels of Biological Organization
          'biological_organization_levels',
          'biological_organization_levels_sim',
          'levels_of_biological_organization',
          'bio_biological_organization_levels',
          'bio_levels_of_biological_organization',
          'levels_of_organization',
          'bio_levels_of_organization',
        ],
      },
      {
        id: 2,
        title: 'Anatomy and Physiology of Plants',
        form: 'Grade 10',
        simKeys: [
          // Leaf Structure Cross-Section
          'leaf_structure_cross_section',
          'leaf_structure',
          'bio_leaf_structure',
          'leaf_structure_cross_section_sim',
          'bio_leaf_structure_cross_section',
          // Xylem Water Movement
          'xylem_water_movement',
          'xylem_water_movement_sim',
          'bio_xylem_water_movement',
          'bio_xylem_water_movement_sim',
          'xylem_movement',
          'bio_xylem_movement',
          // Plant Transpiration Rate
          'plant_transpiration_rate',
          'plant_transpiration_rate_sim',
          'bio_plant_transpiration_rate',
          'bio_plant_transpiration_rate_sim',
          'transpiration_sim',
          'bio_transpiration_sim',
          'transpiration_rate',
        ],
      },
      {
        id: 3,
        title: 'Cell Structure and Specialization',
        form: 'Grade 10',
        simKeys: [
          // Microscope Explorer
          'microscope_magnification_explorer',
          'microscope_magnification_sim',
          'bio_microscope_magnification',
          'microscope_explorer',
          'bio_microscope_explorer',
          // Specialized Cells
          'specialized_cells_adaptations',
          'specialized_cells_adaptations_sim',
          'bio_specialized_cells_adaptations',
          'specialized_cells',
          'bio_specialized_cells',
          // Organelle Function
          'cell_organelles_function',
          'cell_organelles_function_sim',
          'bio_cell_organelles_function',
          'organelle_function',
          'bio_organelle_function',
        ],
      },
      {
        id: 4,
        title: 'Chemicals of Life',
        form: 'Grade 10',
        simKeys: [
          'food_tests_laboratory',
          'food_tests_laboratory_sim',
          'bio_food_tests_laboratory',
          'food_tests',
          'enzyme_lock_and_key',
          'enzyme_lock_and_key_sim',
          'bio_enzyme_lock_and_key',
          'lock_and_key_sim',
          'enzyme_temperature_activity',
          'enzyme_temperature_activity_sim',
          'bio_enzyme_temperature_activity',
          'enzyme_temperature_sim',
        ],
      },
      {
        id: 5,
        title: 'Plant Nutrition and Photosynthesis',
        form: 'Grade 10',
        simKeys: [
          'photosynthesis_inputs_outputs',
          'photosynthesis_inputs_outputs_sim',
          'bio_photosynthesis_inputs_outputs',
          'photosynthesis_inputs',
          'leaf_starch_test_experiment',
          'leaf_starch_test_experiment_sim',
          'bio_leaf_starch_test_experiment',
          'leaf_starch_test',
          'light_intensity_photosynthesis',
          'light_intensity_photosynthesis_sim',
          'bio_light_intensity_photosynthesis',
          'light_intensity_sim',
        ],
      },
      {
        id: 6,
        title: 'Plant Transport',
        form: 'Grade 10',
        simKeys: [
          'root_water_absorption_osmosis',
          'root_water_absorption_osmosis_sim',
          'bio_root_water_absorption_osmosis',
          'root_water_absorption',
          'xylem_phloem_transport',
          'xylem_phloem_transport_sim',
          'bio_xylem_phloem_transport',
          'xylem_vs_phloem',
          'transpiration_pull_cohesion',
          'transpiration_pull_cohesion_sim',
          'bio_transpiration_pull_cohesion',
          'cohesion_tension_sim',
        ],
      },
      {
        id: 7,
        title: 'Plant Gaseous Exchange and Respiration',
        form: 'Grade 10',
        simKeys: [
          'stomatal_opening_mechanism',
          'stomatal_opening_mechanism_sim',
          'bio_stomatal_opening_mechanism',
          'stomatal_mechanism',
          'plant_respiration_pathways',
          'plant_respiration_pathways_sim',
          'bio_plant_respiration_pathways',
          'aerobic_vs_anaerobic_plants',
          'leaf_gas_exchange_day_night',
          'leaf_gas_exchange_day_night_sim',
          'bio_leaf_gas_exchange_day_night',
          'compensation_point_sim',
        ],
      },
      {
        id: 8,
        title: 'Animal Nutrition and Feeding Adaptations',
        form: 'Grade 10',
        simKeys: [
          'insect_mouthparts_adaptations',
          'insect_mouthparts_adaptations_sim',
          'bio_insect_mouthparts_adaptations',
          'insect_mouthparts',
          'bird_beaks_feeding_adaptations',
          'bird_beaks_feeding_adaptations_sim',
          'bio_bird_beaks_feeding_adaptations',
          'bird_beaks_sim',
          'feeding_adaptations_ecology',
          'feeding_adaptations_ecology_sim',
          'bio_feeding_adaptations_ecology',
          'herbivore_vs_carnivore_dentition',
        ],
      },
      {
        id: 9,
        title: 'Animal Transport',
        form: 'Grade 10',
        simKeys: [
          'double_circulation_pathways',
          'double_circulation_pathways_sim',
          'bio_double_circulation_pathways',
          'double_circulation',
          'mammalian_heart_structure',
          'mammalian_heart_structure_sim',
          'bio_mammalian_heart_structure',
          'heart_structure_sim',
          'blood_components_functions',
          'blood_components_functions_sim',
          'bio_blood_components_functions',
          'blood_components',
        ],
      },
      {
        id: 10,
        title: 'Animal Gaseous Exchange and Respiration',
        form: 'Grade 10',
        simKeys: [
          'human_respiratory_system',
          'human_respiratory_system_sim',
          'bio_human_respiratory_system',
          'breathing_mechanism_sim',
          'alveolus_capillary_gas_exchange',
          'alveolus_capillary_gas_exchange_sim',
          'bio_alveolus_capillary_gas_exchange',
          'alveolar_gas_exchange',
          'breathing_vs_cellular_respiration',
          'breathing_vs_cellular_respiration_sim',
          'bio_breathing_vs_cellular_respiration',
          'breathing_vs_respiration',
        ],
      },
    ],
  },
};

/**
 * Filter and group simulations according to the selected subject and grade/form.
 */
export function getStructuredCurriculumGroups(simulations, selectedSubject, selectedGrade) {
  const subjects = selectedSubject === 'ALL'
    ? ['CHEMISTRY', 'PHYSICS', 'BIOLOGY', 'MATHEMATICS']
    : [selectedSubject];

  const results = [];

  subjects.forEach((subKey) => {
    const subStructure = CURRICULUM_STRUCTURE[subKey];
    const subSimulations = simulations.filter((s) => s.subject === subKey);

    if (!subStructure) {
      if (subSimulations.length > 0) {
        results.push({
          subjectKey: subKey,
          isCustomCurriculum: false,
          items: subSimulations,
        });
      }
      return;
    }

    // Determine which forms to include
    const formsToInclude = selectedGrade === 'ALL'
      ? Object.keys(subStructure)
      : subStructure[selectedGrade]
      ? [selectedGrade]
      : [];

    const formGroups = [];

    formsToInclude.forEach((formKey) => {
      const topics = subStructure[formKey] || [];
      const formLabel = GRADE_CONFIG.find((g) => g.id === formKey)?.name || formKey;

      const populatedTopics = topics.map((topic) => {
        // Find matching simulations by key, archetype, or exact topic match
        const matchingSims = subSimulations.filter((sim) => {
          const simKey = (sim.key || '').toLowerCase();
          const simArchetype = (sim.archetype || '').toLowerCase();
          const simTopic = (sim.topic || '').toLowerCase();
          const topicTitle = topic.title.toLowerCase();

          // Check explicit key match
          if (topic.simKeys.some((k) => k.toLowerCase() === simKey || k.toLowerCase() === simArchetype)) {
            return true;
          }

          // Strict topic title match ONLY if no cross-grade ambiguity
          if (simTopic && (simTopic.includes(topicTitle) || topicTitle.includes(simTopic))) {
            return true;
          }

          return false;
        });

        // Deduplicate simulations
        const uniqueSims = [];
        const seen = new Set();
        matchingSims.forEach((item) => {
          const id = item.key || item.id;
          if (!seen.has(id)) {
            seen.add(id);
            uniqueSims.push(item);
          }
        });

        return {
          ...topic,
          items: uniqueSims,
        };
      });

      const totalActive = populatedTopics.reduce((acc, t) => acc + t.items.length, 0);

      formGroups.push({
        formKey,
        formLabel,
        topics: populatedTopics,
        totalActive,
      });
    });

    if (formGroups.length > 0) {
      results.push({
        subjectKey: subKey,
        isCustomCurriculum: true,
        formGroups,
        totalItems: subSimulations.length,
      });
    }
  });

  return results;
}

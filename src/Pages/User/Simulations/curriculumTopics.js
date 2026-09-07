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
          'convex_lens_image_formation',
          'phys_convex_lens_image_formation',
          'convex_lens',
          'convex_lens_ray_tracer',
          'lens_formula_calculator',
          'phys_lens_formula_calculator',
          'lens_formula_verification',
          'lens_formula',
          'eye_defects_simulator',
          'phys_eye_defects_simulator',
          'eye_defects_correction',
          'eye_defects',
          'lens_power_diopters',
          'phys_lens_power_diopters',
          'lens_power',
          'lens_diopters',
          'diverging_lens_simulator',
          'phys_diverging_lens_simulator',
          'diverging_lens',
          'diverging_lens_virtual',
          'optics',
          'thin_lens',
          'thin_lens_ray_tracing',
        ],
      },
      {
        id: 2,
        title: 'Uniform Circular Motion',
        form: 'Form 4',
        simKeys: [
          'circular_motion_angular_quantities',
          'phys_circular_motion_angular_quantities',
          'angular_quantities',
          'circular_motion',
          'centripetal_acceleration',
          'phys_centripetal_acceleration',
          'centripetal_accel',
          'centripetal_force_sources',
          'phys_centripetal_force_sources',
          'centripetal_force',
          'banked_track_dynamics',
          'phys_banked_track_dynamics',
          'banked_track',
          'banked_curve_dynamics',
          'banked_road',
        ],
      },
      {
        id: 3,
        title: 'Floating and Sinking',
        form: 'Form 4',
        simKeys: [
          'archimedes_principle_buoyancy',
          'phys_archimedes_principle_buoyancy',
          'archimedes_principle',
          'buoyancy_balance',
          'law_of_floatation_equilibrium',
          'phys_law_of_floatation_equilibrium',
          'law_of_floatation',
          'floatation_equilibrium',
          'plimsoll_line',
          'hydrometer_calibration_density',
          'phys_hydrometer_calibration_density',
          'hydrometer',
          'hydrometer_calibration',
          'relative_density',
          'balloons_and_submarines_buoyancy',
          'phys_balloons_and_submarines_buoyancy',
          'balloons_and_submarines',
          'submarine_buoyancy',
          'weather_balloon_buoyancy',
        ],
      },
      {
        id: 4,
        title: 'Electromagnetic Spectrum',
        form: 'Form 4',
        simKeys: [
          'em_wave_orthogonal_fields',
          'phys_em_wave_orthogonal_fields',
          'em_wave_builder',
          'em_spectrum_analyzer_bands',
          'phys_em_spectrum_analyzer_bands',
          'em_spectrum_analyzer',
          'speed_of_light_experiments',
          'phys_speed_of_light_experiments',
          'speed_of_light_lab',
          'em_radiation_attenuation_hazards',
          'phys_em_radiation_attenuation_hazards',
          'radiation_attenuation_hazards',
          'radiation_shielding',
          'radiation_shielding_sim',
        ],
      },
      {
        id: 5,
        title: 'Electromagnetic Induction',
        form: 'Form 4',
        simKeys: [
          'faradays_law_magnetic_flux',
          'phys_faradays_law_magnetic_flux',
          'faradays_law',
          'faraday_induction',
          'induction_sandbox',
          'lenzs_law_eddy_currents',
          'phys_lenzs_law_eddy_currents',
          'lenzs_law',
          'eddy_currents',
          'ac_generator_slip_rings',
          'phys_ac_generator_slip_rings',
          'ac_generator',
          'dynamo',
          'alternating_current_dynamo',
          'transformer_mutual_induction',
          'phys_transformer_mutual_induction',
          'transformer_sim',
          'mutual_induction',
          'step_up_step_down_transformer',
        ],
      },
      {
        id: 6,
        title: 'Mains Electricity',
        form: 'Form 4',
        simKeys: [
          'high_voltage_grid_transmission',
          'phys_high_voltage_grid_transmission',
          'grid_transmission_sandbox',
          'grid_transmission',
          'high_voltage_transmission',
          'domestic_wiring_ring_main',
          'phys_domestic_wiring_ring_main',
          'domestic_wiring',
          'ring_main',
          'three_pin_plug',
          'electrical_safety_fuses_earthing',
          'phys_electrical_safety_fuses_earthing',
          'fuses_earthing',
          'electrical_safety',
          'mains_safety',
          'fuse_circuit_breaker_earthing',
          'energy_consumption_costing_meter',
          'phys_energy_consumption_costing_meter',
          'energy_metering',
          'utility_costing',
          'energy_consumption_costing',
        ],
      },
      {
        id: 7,
        title: 'Cathode Rays & CRTs',
        form: 'Form 4',
        simKeys: [
          'crt',
          'crt_electron',
          'cathode_ray',
          'cathode_ray_oscilloscope',
          'magnetic_deflection_cathode_rays',
          'phys_magnetic_deflection_cathode_rays',
          'magnetic_deflection',
          'maltese_cross',
          'paddle_wheel',
          'cro_waveform_diagnostics',
          'phys_cro_waveform_diagnostics',
          'cro_diagnostics',
          'cro_waveform',
          'oscilloscope',
          'thomson_specific_charge_em',
          'phys_thomson_specific_charge_em',
          'thomson_specific_charge',
          'thomson_em_ratio',
          'velocity_selector',
        ],
      },
      {
        id: 8,
        title: 'X-Rays Production Mechanics',
        form: 'Form 4',
        simKeys: [
          'x_ray',
          'phys_x_ray',
          'xray',
          'phys_xray',
          'coolidge_xray',
          'coolidge_tube',
          'x_ray_production',
          'phys_x_ray_production',
          'xray_intensity_vs_hardness_control',
          'phys_xray_intensity_vs_hardness_control',
          'xray_intensity_hardness',
          'xray_spectra_control',
          'xray_attenuation_radiography',
          'phys_xray_attenuation_radiography',
          'xray_radiography',
          'radiographic_imaging',
          'braggs_law_crystal_diffraction',
          'phys_braggs_law_crystal_diffraction',
          'braggs_law',
          'xray_diffraction',
        ],
      },
      {
        id: 9,
        title: 'Photoelectric Effect',
        form: 'Form 4',
        simKeys: [
          'photoelectric',
          'phys_photoelectric',
          'photoelectric_effect',
          'phys_photoelectric_effect',
          'stopping_potential_planck_graph',
          'phys_stopping_potential_planck_graph',
          'stopping_potential',
          'planck_constant_graph',
          'photon_intensity_vs_current',
          'phys_photon_intensity_vs_current',
          'photon_intensity',
          'photocurrent_vs_intensity',
          'photocell_circuit_applications',
          'phys_photocell_circuit_applications',
          'photocell_applications',
          'photocell_security_alarm',
        ],
      },
      {
        id: 10,
        title: 'Radioactivity & Nuclear Physics',
        form: 'Form 4',
        simKeys: [
          'radioactive_decay_half_life',
          'phys_radioactive_decay_half_life',
          'radioactive_decay',
          'chem_radioactive_decay_half_life',
          'nuclear_fission_chain_reaction',
          'phys_nuclear_fission_chain_reaction',
          'nuclear_fission',
          'chem_nuclear_fission_chain_reaction',
          'radiation_deflection_shielding_alpha_beta_gamma',
          'phys_radiation_deflection_shielding_alpha_beta_gamma',
          'radiation_deflection_shielding',
          'alpha_beta_gamma_deflection',
          'binding_energy_per_nucleon_curve',
          'phys_binding_energy_per_nucleon_curve',
          'binding_energy_curve',
          'mass_defect_curve',
        ],
      },
      {
        id: 11,
        title: 'Electronics & Logic Gates',
        form: 'Form 4',
        simKeys: [
          'pn_junction_diode_rectification',
          'phys_pn_junction_diode_rectification',
          'diode_rectification',
          'bridge_rectifier',
          'digital_logic_gates_truth_tables',
          'phys_digital_logic_gates_truth_tables',
          'logic_gates',
          'truth_tables',
          'transistor_switch_sensor_circuit',
          'phys_transistor_switch_sensor_circuit',
          'transistor_switch',
          'transistor_sensor_circuit',
          'combinational_logic_half_adder',
          'phys_combinational_logic_half_adder',
          'half_adder',
          'binary_adder',
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

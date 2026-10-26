import { PhilippineLaw } from '../types';

export const PHILIPPINE_LAWS: PhilippineLaw[] = [
  {
    id: 'ra-9275',
    instrumentType: 'Republic Act',
    number: 'RA 9275',
    officialTitle: 'An Act Providing for a Comprehensive Water Quality Management and for Other Purposes',
    commonName: 'Philippine Clean Water Act of 2004',
    year: 2004,
    summary:
      'The landmark Philippine environmental law establishing a systematic and holistic national program for water quality management, water pollution prevention, and sustainable sanitation across all water bodies.',
    waterRelevance:
      'Directly governs all freshwater bodies, rivers, lakes, groundwater, and coastal waters. Establishes effluent standards, wastewater discharge permits, and community Water Quality Management Areas (WQMAs).',
    keyProvisions: [
      'Designation of Water Quality Management Areas (WQMAs) using a watershed approach.',
      'Mandatory Wastewater Discharge Permits for commercial, industrial, and agricultural facilities.',
      'Implementation of a National Sewerage and Septage Management Program (NSSMP).',
      'Prohibition of direct disposal of untreated sewage, toxic wastes, and hazardous wash-water into aquatic bodies.',
      'Establishment of the Area Water Quality Management Fund to support clean-up, monitoring, and rehabilitation.',
    ],
    responsibleAgencies: [
      'Department of Environment and Natural Resources (DENR)',
      'Environmental Management Bureau (EMB)',
      'Local Government Units (LGUs)',
      'Department of Health (DOH)',
      'Department of Public Works and Highways (DPWH)',
    ],
    officialSourceUrl: 'https://www.officialgazette.gov.ph/2004/03/22/republic-act-no-9275/',
    lastReviewedDate: '2026-10-24',
    topic: 'Water Quality & Pollution Prevention',
  },
  {
    id: 'pd-1067',
    instrumentType: 'Presidential Decree',
    number: 'PD 1067',
    officialTitle: 'A Decree Instituting a Water Code, Thereby Revising and Consolidating the Laws Governing the Ownership, Appropriation, Utilization, Exploitation, Development, Conservation and Protection of Water Resources',
    commonName: 'Water Code of the Philippines',
    year: 1976,
    summary:
      'Enacted on December 31, 1976, this foundational decree codifies the principle that all waters of the Philippines belong to the State and cannot be acquired by prescription.',
    waterRelevance:
      'Governs water permits, riparian rights, water extraction quotas, riverbank easements (3m in urban areas, 20m in agricultural, 40m in forested zones), and conservation mandates.',
    keyProvisions: [
      'State ownership of all natural water resources including groundwater, springs, rivers, and lakes.',
      'Mandatory Water Permit (granted by NWRB) required before appropriating or extracting water for commercial, agricultural, or domestic utility purposes.',
      'Clear hierarchy of water use priority: domestic purposes hold the highest statutory priority during shortages.',
      'Enforcement of riverbank and lakeshore easements for public recreation, flood defense, and environmental conservation.',
      'Penalties for illegal well drilling and excessive aquifer drawdown.',
    ],
    responsibleAgencies: [
      'National Water Resources Board (NWRB)',
      'Department of Environment and Natural Resources (DENR)',
      'Local Water Utilities Administration (LWUA)',
    ],
    officialSourceUrl: 'https://www.officialgazette.gov.ph/1976/12/31/presidential-decree-no-1067-s-1976/',
    lastReviewedDate: '2026-10-24',
    topic: 'Water Allocation, Rights & Riverbank Protection',
  },
  {
    id: 'ra-9003',
    instrumentType: 'Republic Act',
    number: 'RA 9003',
    officialTitle: 'An Act Providing for an Ecological Solid Waste Management Program, Creating the Necessary Institutional Mechanisms and Incentives, Declaring Certain Acts Prohibited and Providing Penalties, Appropriating Funds Therefor, and for Other Purposes',
    commonName: 'Ecological Solid Waste Management Act of 2000',
    year: 2000,
    summary:
      'Creates a comprehensive institutional framework for waste reduction, mandatory waste segregation at source, Materials Recovery Facilities (MRFs), and sanitary landfills.',
    waterRelevance:
      'Prevents uncollected solid plastics and garbage from blocking drainage canals, estuaries (esteros), and rivers, which is the primary cause of urban flash floods and coastal marine pollution in the Philippines.',
    keyProvisions: [
      'Mandatory segregation of solid waste at household, barangay, and commercial sources into compostable, recyclable, non-recyclable, and special hazardous waste.',
      'Establishment of Materials Recovery Facilities (MRFs) in every barangay or cluster of barangays.',
      'Total ban on open dump sites; transition to controlled disposal and engineered sanitary landfills.',
      'Strict prohibition of littering, dumping, and throwing of waste in rivers, creeks, canals, and other public waterways.',
    ],
    responsibleAgencies: [
      'National Solid Waste Management Commission (NSWMC)',
      'Department of Environment and Natural Resources (DENR)',
      'Local Government Units (Barangays and City/Municipal Mayors)',
    ],
    officialSourceUrl: 'https://www.officialgazette.gov.ph/2001/01/26/republic-act-no-9003-s-2001/',
    lastReviewedDate: '2026-10-24',
    topic: 'Solid Waste & Drainage Canal Protection',
  },
  {
    id: 'ra-11038',
    instrumentType: 'Republic Act',
    number: 'RA 11038',
    officialTitle: 'An Act Providing for the Management of the National Integrated Protected Areas System, Amending for the Purpose Republic Act No. 7586',
    commonName: 'Expanded National Integrated Protected Areas System (ENIPAS) Act of 2018',
    year: 2018,
    summary:
      'Strengthens the preservation of biologically critical terrestrial, wetland, and marine environments across 107+ legislated protected areas in the Philippines.',
    waterRelevance:
      'Protects critical upland watersheds, headwaters, natural lake ecosystems, mangrove forests, and marine sanctuaries that recharge the country’s drinking water supplies and prevent catastrophic soil erosion.',
    keyProvisions: [
      'Legislative declaration and boundary delineation of 94 initial protected areas added to 13 previous areas.',
      'Creation of Protected Area Management Boards (PAMBs) for local participatory governance.',
      'Strict prohibitions on unauthorized timber cutting, mineral extraction, and dumping of waste within watershed reserves.',
      'Recognition and integration of indigenous peoples’ ancestral domains within protected zones.',
    ],
    responsibleAgencies: [
      'DENR Biodiversity Management Bureau (BMB)',
      'Protected Area Management Boards (PAMB)',
      'National Commission on Indigenous Peoples (NCIP)',
    ],
    officialSourceUrl: 'https://www.officialgazette.gov.ph/2018/06/22/republic-act-no-11038/',
    lastReviewedDate: '2026-10-24',
    topic: 'Watersheds, Wetlands & Marine Sanctuaries',
  },
  {
    id: 'ra-6969',
    instrumentType: 'Republic Act',
    number: 'RA 6969',
    officialTitle: 'An Act to Control Toxic Substances and Hazardous and Nuclear Wastes, Providing Penalties for Violations Thereof, and for Other Purposes',
    commonName: 'Toxic Substances and Hazardous and Nuclear Wastes Control Act of 1990',
    year: 1990,
    summary:
      'Regulates, restricts, and prohibits the import, manufacture, processing, handling, storage, transport, and disposal of toxic chemical substances and hazardous wastes.',
    waterRelevance:
      'Protects rivers, aquifers, and municipal water supplies from contamination by persistent organic pollutants (POPs), heavy metals (mercury, lead, cadmium), and industrial effluents.',
    keyProvisions: [
      'Mandatory chemical inventory, tracking, and hazard evaluation before importation or domestic production.',
      'Prohibition of the entry and transit of hazardous and nuclear wastes into Philippine territorial waters and lands.',
      'Strict regulation of hazardous waste generators, transporters, and treaters (chemical cradle-to-grave tracking).',
      'Penalties including imprisonment for unlawful disposal that endangers public aquifers and food supplies.',
    ],
    responsibleAgencies: [
      'Department of Environment and Natural Resources (DENR-EMB)',
      'Philippine Nuclear Research Institute (PNRI)',
      'Bureau of Customs (BOC)',
    ],
    officialSourceUrl: 'https://www.officialgazette.gov.ph/1990/10/26/republic-act-no-6969/',
    lastReviewedDate: '2026-10-24',
    topic: 'Hazardous Chemicals & Aquifer Contamination',
  },
  {
    id: 'ra-10121',
    instrumentType: 'Republic Act',
    number: 'RA 10121',
    officialTitle: 'An Act Strengthening the Philippine Disaster Risk Reduction and Management System, Providing for the National Disaster Risk Reduction and Management Framework and Institutionalizing the National Disaster Risk Reduction and Management Plan, Appropriating Funds Therefor and for Other Purposes',
    commonName: 'Philippine Disaster Risk Reduction and Management Act of 2010',
    year: 2010,
    summary:
      'A comprehensive law establishing the NDRRMC framework shifting from post-disaster response to proactive disaster risk reduction, mitigation, early warning, and community resilience.',
    waterRelevance:
      'Context note: Not exclusively a water conservation law. Its crucial water connection lies in mitigating water-related hazards — catastrophic flooding, storm surges, landslides, dam overflows, and securing emergency potable water supplies during natural calamities.',
    keyProvisions: [
      'Creation of the National Disaster Risk Reduction and Management Council (NDRRMC) and local equivalents (LDRRMCs).',
      'Mandatory allocation of at least 5% of local government estimated revenue to Local Disaster Risk Reduction and Management Funds (LDRRMF).',
      'Mandatory mainstreaming of disaster risk reduction and climate change adaptation in local development and watershed plans.',
      'Multi-hazard early warning systems for floods, typhoons, and storm surges.',
    ],
    responsibleAgencies: [
      'National Disaster Risk Reduction and Management Council (NDRRMC)',
      'Office of Civil Defense (OCD)',
      'Department of Science and Technology - PAGASA (DOST-PAGASA)',
      'Department of the Interior and Local Government (DILG)',
    ],
    officialSourceUrl: 'https://www.officialgazette.gov.ph/2010/05/27/republic-act-no-10121/',
    lastReviewedDate: '2026-10-24',
    topic: 'Flood Preparedness & Water Hazard Mitigation',
  },
  {
    id: 'ra-8749',
    instrumentType: 'Republic Act',
    number: 'RA 8749',
    officialTitle: 'An Act Providing for a Comprehensive Air Pollution Control Policy and for Other Purposes',
    commonName: 'Philippine Clean Air Act of 1999',
    year: 1999,
    summary:
      'Establishes a holistic national air quality management program, ambient air quality standards, fuel quality mandates, and restrictions on stationary and vehicular emissions.',
    waterRelevance:
      'Context note: This law primarily addresses air quality and atmospheric pollution, not water conservation directly. However, reducing atmospheric emissions indirectly protects water bodies by curbing acid rain (sulfur and nitrogen oxides) that acidifies lakes, streams, and coastal coral reefs.',
    keyProvisions: [
      'Designation of airsheds and airshed governing boards.',
      'Prohibition of the incineration of municipal, bio-medical, and hazardous wastes.',
      'Emission standards for motor vehicles and industrial stationary smoke sources.',
      'Phasing out of leaded gasoline and reduction of sulfur content in diesel fuels.',
    ],
    responsibleAgencies: [
      'Department of Environment and Natural Resources (DENR-EMB)',
      'Department of Transportation (DOTr / LTO)',
      'Department of Energy (DOE)',
    ],
    officialSourceUrl: 'https://www.officialgazette.gov.ph/1999/06/23/republic-act-no-8749/',
    lastReviewedDate: '2026-10-24',
    topic: 'Air Quality & Acid Rain Prevention',
  },
];

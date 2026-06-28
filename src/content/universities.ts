export type University = {
  /** File under /public/images/logos/. */
  file: string;
  name: string;
  /** Wide wordmark logos render at a smaller height. */
  wide?: boolean;
};

/** Logo-cloud crests, in display order ("Used by students at"). */
export const universities: University[] = [
  { file: "05_Harvard.png", name: "Harvard" },
  { file: "01_MIT.png", name: "MIT" },
  { file: "03_Stanford.png", name: "Stanford" },
  {file: "26_X.png", name: "Polytechnique Paris"},
  { file: "04_Oxford.png", name: "Oxford" },
  { file: "06_Cambridge.png", name: "Cambridge" },
  { file: "07_ETH.png", name: "ETH Zürich", wide: true },
  { file: "22_EPFL.png", name: "EPFL", wide: true },
  { file: "21_Yale.png", name: "Yale" },
  { file: "25_Princeton.png", name: "Princeton" },
  { file: "02_Imperial.png", name: "Imperial College London" },
  { file: "18_Berkeley.png", name: "UC Berkeley" },
  { file: "10_Caltech.png", name: "Caltech" },
  { file: "15_Penn.png", name: "UPenn" },
  { file: "16_Cornell.png", name: "Cornell" },
  { file: "13_UChicago.png", name: "UChicago" },
  { file: "24_JohnsHopkins.png", name: "Johns Hopkins" },
  { file: "23_TUM.png", name: "TU Munich" },
  { file: "09_UCL.png", name: "UCL" },
  { file: "08_NUS.png", name: "NUS" },
  { file: "12_NTU.png", name: "NTU Singapore" },
  { file: "11_HKU.png", name: "HKU" },
  { file: "19_Melbourne.png", name: "University of Melbourne" },
  { file: "20_UNSW.png", name: "UNSW Sydney" },
];

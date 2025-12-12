export interface Course {
  id: string;
  nome_curso: string;
  categoria: string;
  carga_horaria: string;
  numero_de_parcelas: number;
  valor_parcela: number;
  valor_total: number;
  datas: string;
  turno: 'Manhã' | 'Tarde' | 'Noite' | 'Integral' | 'EAD' | string;
  unidade: string;
  isNew?: boolean; // To mark new courses from latest upload
}

export interface FilterState {
  search: string;
  category: string;
  shift: string;
  modality: string;
  priceRange: string;
}

export interface ExtractionStatus {
  loading: boolean;
  message: string;
  error?: string;
}
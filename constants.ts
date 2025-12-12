export const WHATSAPP_NUMBER = "559231829925";

export const SENAI_COLORS = {
  BLUE: '#004587',
  ORANGE: '#F7941D',
  WHITE: '#FFFFFF',
  GRAY_TEXT: '#666666',
  BG_LIGHT: '#F4F4F4',
};

// Mock data to show initial state if no PDF is uploaded yet
export const INITIAL_COURSES_MOCK = [
  {
    id: '1',
    nome_curso: 'Eletricista Industrial',
    categoria: 'Eletroeletrônica',
    carga_horaria: '380h',
    numero_de_parcelas: 10,
    valor_parcela: 189.90,
    valor_total: 1899.00,
    datas: '15/03 a 20/07',
    turno: 'Noite',
    unidade: 'Escola SENAI Antônio Simões'
  },
  {
    id: '2',
    nome_curso: 'Mecânico de Motocicletas',
    categoria: 'Automotiva',
    carga_horaria: '200h',
    numero_de_parcelas: 6,
    valor_parcela: 150.00,
    valor_total: 900.00,
    datas: '01/04 a 01/06',
    turno: 'Tarde',
    unidade: 'Escola SENAI Demóstenes Travessa'
  },
  {
    id: '3',
    nome_curso: 'Excel Avançado',
    categoria: 'Tecnologia da Informação',
    carga_horaria: '40h',
    numero_de_parcelas: 2,
    valor_parcela: 120.00,
    valor_total: 240.00,
    datas: '10/03 a 20/03',
    turno: 'Noite',
    unidade: 'EAD'
  }
];
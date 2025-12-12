# Arquitetura da Solução: Catálogo de Cursos SENAI

## 1. Arquitetura em Alto Nível

A solução segue uma arquitetura **Serverless** e **Client-First**, minimizando custos de infraestrutura e dependendo fortemente de serviços gerenciados do Google.

*   **Front-end (SPA):** React + Tailwind CSS. Responsável pela interface, gestão de estado e exibição dos cards.
*   **Processamento (AI):** Google Gemini API (via SDK Client-side para demonstração, ou via Cloud Functions em produção). Recebe o PDF em Base64 e retorna um JSON estruturado.
*   **Armazenamento (Backend):**
    *   *Opção Mínima:* LocalStorage (para persistência local simples) + Google Sheets (como "banco de dados" low-code via App Script).
    *   *Opção Robusta:* Firebase Firestore (NoSQL DB para os cursos) + Firebase Storage (para arquivar os PDFs originais).

## 2. Stack Mínima Sugerida

Para atender ao requisito de "mínimo código possível" mas "extensível":

1.  **Front-end:** React (Vite) hospedado no **Firebase Hosting**.
2.  **Autenticação (Opcional):** Firebase Auth (apenas para o administrador fazer upload).
3.  **Banco de Dados:** **Firestore**. É mais rápido e flexível que o Sheets para aplicações web, e tem camada gratuita generosa.
4.  **IA:** **Google Gemini Flash 2.5**. Modelo rápido e barato, ideal para extração de texto em alto volume.

## 3. Estrutura de Dados (Tabela)

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | String (UUID) | Identificador único do curso. |
| `nome_curso` | String | Título do curso (ex: "Eletricista Industrial"). |
| `categoria` | String | Área tecnológica (ex: "Automotiva", "TI"). |
| `carga_horaria` | Number | Carga horária em horas. |
| `num_parcelas` | Number | Quantidade de parcelas. |
| `valor_parcela` | Number | Valor unitário da parcela. |
| `valor_total` | Number | Valor total do curso. |
| `periodo` | String | Datas de início e fim. |
| `turno` | String | "Manhã", "Tarde", "Noite", "EAD". |
| `unidade` | String | Local do curso. |
| `destaque` | Boolean | Se o curso deve aparecer no topo. |
| `data_upload` | Timestamp | Data de processamento do registro. |

## 4. Prompt para Extração (Gemini)

Abaixo o prompt utilizado no sistema para converter o PDF em JSON.

```text
Analise o documento PDF fornecido, que contém uma programação de cursos do SENAI.
Extraia TODOS os cursos listados e retorne APENAS um JSON válido.
Não inclua crase (```json) ou texto adicional.

O JSON deve ser uma lista de objetos com a seguinte estrutura para cada curso:
[
  {
    "nome_curso": "Nome exato do curso",
    "categoria": "Área ou Categoria (ex: Metalmecânica, TI)",
    "carga_horaria": "Ex: 40h",
    "numero_de_parcelas": 1, // Inteiro
    "valor_parcela": 100.00, // Number, sem R$
    "valor_total": 100.00, // Number, sem R$
    "datas": "DD/MM a DD/MM",
    "turno": "Manhã/Tarde/Noite/Integral",
    "unidade": "Nome da Unidade"
  }
]

Regras de Negócio:
1. Se houver 'Gratuito', o valor_total e valor_parcela devem ser 0.
2. Identifique o número de parcelas baseado no texto '1x', '3x', etc.
```

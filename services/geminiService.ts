import { GoogleGenAI, Type } from "@google/genai";
import { Course } from '../types';

// NOTE: In a production environment, the API Key should not be exposed on the client side like this.
// It should be proxied through a backend (Firebase Functions).
// For this demo, we assume the environment variable or a safe internal usage context.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:application/pdf;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const extractCoursesFromPdf = async (pdfFile: File): Promise<Course[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const base64Pdf = await fileToGenerativePart(pdfFile);

  const prompt = `
    You are a data extraction specialist for SENAI.
    Analyze the provided PDF file which contains a schedule of courses.
    Extract ALL courses listed into a structured JSON format.
    
    Data cleaning rules:
    1. Remove currency symbols (R$) from values. Return only numbers.
    2. If a course is 'Gratuito', set values to 0.
    3. Normalize 'turno' to: 'Manhã', 'Tarde', 'Noite', 'Integral', or 'EAD'.
    4. Ensure dates are simple strings like "DD/MM a DD/MM".
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: "application/pdf", data: base64Pdf } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nome_curso: { type: Type.STRING },
              categoria: { type: Type.STRING },
              carga_horaria: { type: Type.STRING },
              numero_de_parcelas: { type: Type.NUMBER },
              valor_parcela: { type: Type.NUMBER },
              valor_total: { type: Type.NUMBER },
              datas: { type: Type.STRING },
              turno: { type: Type.STRING },
              unidade: { type: Type.STRING }
            },
            required: ["nome_curso", "valor_total", "categoria"]
          }
        }
      }
    });

    const jsonText = response.text;
    
    if (!jsonText) {
      throw new Error("No data returned from Gemini.");
    }

    const rawData = JSON.parse(jsonText);

    // Map to our internal Course type with IDs
    const courses: Course[] = rawData.map((item: any) => ({
      ...item,
      id: crypto.randomUUID(), // Generate a client-side ID
      isNew: true
    }));

    return courses;

  } catch (error) {
    console.error("Error extracting PDF data:", error);
    throw new Error("Falha ao processar o PDF com IA. Verifique se o arquivo é válido.");
  }
};
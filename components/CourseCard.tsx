import React from 'react';
import { Course } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { Calendar, Clock, MapPin, Layers } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Generate WhatsApp Link
  const message = `Tenho interesse no curso ${course.nome_curso} (${course.turno}). Gostaria de mais informações.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full overflow-hidden relative group">
      {/* Top Accent Line */}
      <div className="h-1 w-full bg-senai-blue"></div>
      
      {course.isNew && (
        <span className="absolute top-3 right-3 bg-senai-orange text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
          NOVO
        </span>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-senai-lightBlue text-senai-blue mb-2">
            {course.categoria}
          </span>
          <h3 className="text-xl font-bold text-senai-blue leading-tight line-clamp-2 min-h-[3.5rem]">
            {course.nome_curso}
          </h3>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-senai-orange" />
            <span>{course.carga_horaria}</span>
          </div>
          <div className="flex items-center gap-1.5">
             <Layers className="w-4 h-4 text-senai-orange" />
             <span>{course.turno}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Calendar className="w-4 h-4 text-senai-orange" />
            <span>{course.datas}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <MapPin className="w-4 h-4 text-senai-orange" />
            <span className="truncate">{course.unidade}</span>
          </div>
        </div>

        {/* Pricing Section - Critical Visual Hierarchy */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col mb-4">
            {course.valor_total === 0 ? (
               <span className="text-2xl font-bold text-green-600">GRATUITO</span>
            ) : (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-500 font-medium">{course.numero_de_parcelas}x de</span>
                  <span className="text-3xl font-bold text-senai-blue">
                    {formatCurrency(course.valor_parcela)}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  Valor total: {formatCurrency(course.valor_total)}
                </span>
              </>
            )}
          </div>

          {/* Action Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center bg-senai-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded transition-colors duration-200 shadow-sm"
          >
            Quero me matricular
          </a>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
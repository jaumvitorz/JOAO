import React, { useState, useMemo, useEffect } from 'react';
import { Course, FilterState, ExtractionStatus } from './types';
import { extractCoursesFromPdf } from './services/geminiService';
import { INITIAL_COURSES_MOCK } from './constants';
import CourseCard from './components/CourseCard';
import UploadZone from './components/UploadZone';
import Filters from './components/Filters';
import { BookOpen, AlertTriangle, Lock, LogOut, User, X, Menu } from 'lucide-react';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState<ExtractionStatus>({ loading: false, message: '' });
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    shift: '',
    modality: '',
    priceRange: ''
  });

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load initial mock data or local storage
  useEffect(() => {
    const storedCourses = localStorage.getItem('senai_courses');
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      setCourses(INITIAL_COURSES_MOCK as any);
    }
  }, []);

  // Handle PDF Upload and Extraction
  const handleFileProcess = async (file: File) => {
    setStatus({ loading: true, message: 'Enviando PDF para o Gemini...' });
    
    try {
      const extractedCourses = await extractCoursesFromPdf(file);
      
      setStatus({ loading: false, message: 'Sucesso!' });
      setCourses(extractedCourses);
      localStorage.setItem('senai_courses', JSON.stringify(extractedCourses));
      
      // Reset filters to ensure all new courses are visible immediately
      setFilters({
        search: '',
        category: '',
        shift: '',
        modality: '',
        priceRange: ''
      });

    } catch (error: any) {
      console.error(error);
      setStatus({ 
        loading: false, 
        message: '', 
        error: error.message || 'Erro ao processar o arquivo.' 
      });
    }
  };

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'ADMIN' && password === 'ADMIN') {
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Credenciais inválidas.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false); // Close menu on logout if open
  };

  // Derive unique categories for the filter dropdown
  const categories = useMemo(() => {
    return Array.from(new Set(courses.map(c => c.categoria))).sort();
  }, [courses]);

  // Filter Logic
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // 1. Text Search (Expanded to include Category for better visibility)
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = course.nome_curso.toLowerCase().includes(searchLower) || 
                            course.unidade.toLowerCase().includes(searchLower) ||
                            course.categoria.toLowerCase().includes(searchLower);

      // 2. Category
      const matchesCategory = filters.category ? course.categoria === filters.category : true;

      // 3. Modality (Online vs Presencial)
      // Logic: If 'EAD' appears in turno or unidade, it's Online.
      const isOnline = course.turno === 'EAD' || course.unidade.includes('EAD') || course.categoria === 'EAD';
      let matchesModality = true;
      if (filters.modality === 'presencial') matchesModality = !isOnline;
      if (filters.modality === 'online') matchesModality = isOnline;

      // 4. Shift
      // If filtering for shift, we usually ignore EAD unless EAD specifically lists a shift.
      const matchesShift = filters.shift ? course.turno === filters.shift : true;

      // 5. Price Range
      let matchesPrice = true;
      const price = course.valor_total;
      switch (filters.priceRange) {
        case 'free': 
          matchesPrice = price === 0; 
          break;
        case 'up_to_500': 
          matchesPrice = price > 0 && price <= 500; 
          break;
        case '500_1000': 
          matchesPrice = price > 500 && price <= 1000; 
          break;
        case 'over_1000': 
          matchesPrice = price > 1000; 
          break;
        default:
          matchesPrice = true;
      }

      return matchesSearch && matchesCategory && matchesModality && matchesShift && matchesPrice;
    });
  }, [courses, filters]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      
      {/* Navbar / Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-senai-blue border-b-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img 
               src="https://www.se.senai.br/assets/img/logo.png" 
               alt="Logo SENAI" 
               className="h-10 md:h-12 w-auto object-contain"
             />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-6 mr-4">
              <a href="#" className="text-gray-600 hover:text-senai-blue font-medium transition">Portal SENAI</a>
              <a href="#" className="text-gray-600 hover:text-senai-blue font-medium transition">Unidades</a>
            </div>
            
            {/* Auth Button */}
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-full font-medium transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Sair (Admin)</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-2 text-senai-blue hover:bg-senai-lightBlue px-4 py-2 rounded-full font-medium transition text-sm border border-transparent hover:border-senai-blue"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden lg:inline">Área Admin</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-senai-blue focus:outline-none p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 z-20 animate-in slide-in-from-top-2">
            <div className="px-4 py-4 space-y-4 flex flex-col">
              <a href="#" className="text-gray-700 hover:text-senai-blue font-medium block py-2 border-b border-gray-50">Portal SENAI</a>
              <a href="#" className="text-gray-700 hover:text-senai-blue font-medium block py-2 border-b border-gray-50">Unidades</a>
              
              <div className="pt-2">
                {isAuthenticated ? (
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-3 rounded-lg font-medium transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair do Sistema
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 bg-senai-blue text-white hover:bg-blue-800 px-4 py-3 rounded-lg font-medium transition shadow-sm"
                  >
                    <Lock className="w-4 h-4" />
                    Área Administrativa
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title Section */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-senai-blue mb-2">Programação de Cursos</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Encontre o curso ideal para transformar sua carreira. Atualizado semanalmente.
          </p>
        </div>

        {/* API Key Warning (For Demo Purposes Only) */}
        {isAuthenticated && !process.env.API_KEY && (
           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-bold">Aviso de Demonstração:</span> A chave de API do Gemini não foi detectada no ambiente. 
                  A funcionalidade de extração de PDF não funcionará sem uma chave válida configurada.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section (Admin Restricted) */}
        {isAuthenticated && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-senai-orange border-l-4 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-senai-blue" />
              Atualizar Programação
            </h2>
            <UploadZone 
              onFileProcess={handleFileProcess} 
              isLoading={status.loading} 
            />
            {status.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm mt-2">
                {status.error}
              </div>
            )}
            {status.message && !status.error && !status.loading && (
               <div className="bg-green-50 text-green-600 p-3 rounded text-sm mt-2">
               {status.message}
             </div>
            )}
          </div>
        )}

        {/* Catalog Section */}
        <div>
          <Filters 
            filters={filters} 
            setFilters={setFilters} 
            categories={categories}
          />

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-lg border border-gray-200 border-dashed">
              <p className="text-xl font-medium">Nenhum curso encontrado.</p>
              <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros de busca.</p>
              <button 
                onClick={() => setFilters({search: '', category: '', shift: '', modality: '', priceRange: ''})}
                className="mt-4 text-senai-blue font-semibold hover:underline"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-senai-blue text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-bold text-lg mb-2">SENAI - Serviço Nacional de Aprendizagem Industrial</p>
          <p className="text-sm opacity-80">O futuro do trabalho está aqui.</p>
          <p className="text-xs mt-8 opacity-50">&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="bg-senai-blue p-6 text-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-senai-blue" />
              </div>
              <h3 className="text-white text-lg font-bold">Acesso Administrativo</h3>
              <p className="text-senai-lightBlue text-sm">Atualização de Catálogo</p>
            </div>

            <form onSubmit={handleLogin} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-senai-blue focus:ring focus:ring-senai-blue h-10 border px-3"
                    placeholder="ADMIN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-senai-blue focus:ring focus:ring-senai-blue h-10 border px-3"
                    placeholder="•••••"
                  />
                </div>
              </div>

              {loginError && (
                <div className="mt-4 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {loginError}
                </div>
              )}

              <button 
                type="submit"
                className="w-full mt-6 bg-senai-orange hover:bg-orange-600 text-white font-bold py-2.5 rounded transition-colors"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
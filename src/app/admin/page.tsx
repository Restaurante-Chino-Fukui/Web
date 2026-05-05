'use client';

import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { db } from '@/components/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

interface Plato {
  id: string;
  codigo: string;
  nombre: string;
  precio: number;
  categoria?: string;
}

interface TableRow extends Plato {
  nuevoPrecio: number;
}

const ordenCategorias = ["Especiales", "Ensaladas", "Entrantes", "Sopas", "Arroces", "Tallarines", "Huevos", "Verduras", "Cerdos", "Terneras", "Mariscos", "Pollos", "Patos", "Sushis", "Dim Sums", "Sin categoría"];

const normalizarCategoria = (categoria?: string) => {
  if (!categoria) return "Sin categoría";

  const categoriasPlural: Record<string, string> = {
    Verdura: "Verduras",
    Ternera: "Terneras",
    Cerdo: "Cerdos",
    Marisco: "Mariscos",
    Pollo: "Pollos",
  };

  return categoriasPlural[categoria] ?? categoria;
};

const ordenarPorCodigo = (a: TableRow, b: TableRow) => {
  const numA = parseInt(a.codigo.replace(/\D/g, ''));
  const numB = parseInt(b.codigo.replace(/\D/g, ''));

  if (numA !== numB) return numA - numB;
  return a.codigo.localeCompare(b.codigo);
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [inputText, setInputText] = useState('');
  const [tableData, setTableData] = useState<TableRow[]>([]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      if (!response.ok) {
        setError('Contraseña incorrecta');
        return;
      }

      setIsAuthenticated(true);
      await fetchPlatos();
    } catch (err) {
      console.error(err);
      setError('No se pudo validar la contraseña. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatos = async () => {
    setLoading(true);
    try {
      const platosCollection = collection(db, 'platos');
      const snapshot = await getDocs(platosCollection);
      const platosLista = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Plato));
      setPlatos(platosLista);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar platos desde Firebase.');
    }
    setLoading(false);
  };

  const parseText = () => {
    if (!inputText.trim()) return;
    
    // Parseo muy flexible: buscar algo que parezca un código, seguido de algo que parezca un precio.
    // Ej: "29 5.50", "49B 13,20", "Codigo: 12 Precio: 5.4"
    const lines = inputText.split('\n');
    const newTableData: TableRow[] = [];
    const notFound: string[] = [];

    lines.forEach(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      // Extraer letras/numeros iniciales como codigo (ej. 29, 49B) y números al final como precio
      // Expresión regular: busca un grupo alfanumérico (\w+), seguido de cualquier cosa intermedia, 
      // y termina en un número con posibles decimales (\d+[,.]\d+)
      const match = cleanLine.match(/^([a-zA-Z0-9]+)\s+.*?(\d+[,.]\d+).*$/i) || cleanLine.match(/^([a-zA-Z0-9]+)\s+(\d+[,.]?\d*)$/i);
      
      if (match) {
        const codigoExtracted = match[1].toUpperCase();
        const precioExtracted = parseFloat(match[2].replace(',', '.'));

        const platoExistente = platos.find(p => p.codigo.toUpperCase() === codigoExtracted);
        
        if (platoExistente) {
          // Asegurar que no esté duplicado en la tabla de edición
          if (!newTableData.find(t => t.codigo === platoExistente.codigo)) {
            newTableData.push({
              ...platoExistente,
              nuevoPrecio: precioExtracted
            });
          }
        } else {
          notFound.push(codigoExtracted);
        }
      }
    });

    setTableData(newTableData);
    if (notFound.length > 0) {
      alert(`No se encontraron los siguientes códigos en la base de datos: ${notFound.join(', ')}`);
    } else if (newTableData.length === 0) {
      alert('No se detectó ningún par (Código - Precio) válido en el texto.');
    }
  };

  const handlePriceChange = (codigo: string, updatedPrice: number) => {
    setTableData(prev => prev.map(row => row.codigo === codigo ? { ...row, nuevoPrecio: updatedPrice } : row));
  };

  const removeRow = (codigo: string) => {
    setTableData(prev => prev.filter(row => row.codigo !== codigo));
  };

  const handleSyncFirebase = async () => {
    if (tableData.length === 0) return;
    if (!confirm('¿Estás seguro de que quieres actualizar los precios en Firebase? Esto sobreescribirá los precios actuales.')) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const batch = writeBatch(db);
      
      tableData.forEach(row => {
        const docRef = doc(db, 'platos', row.id);
        batch.update(docRef, { precio: row.nuevoPrecio });
      });

      await batch.commit();
      setSuccess(`¡${tableData.length} platos actualizados correctamente!`);
      setTableData([]);
      setInputText('');
      
      // Recargar datos para tener los actualizados
      await fetchPlatos();
    } catch (err) {
      console.error(err);
      setError('Hubo un error al actualizar los datos en Firebase.');
    }
    setLoading(false);
  };

  const addManualRow = () => {
    const code = prompt('Introduce el código del plato:');
    if (!code) return;
    
    const platoExistente = platos.find(p => p.codigo.toUpperCase() === code.toUpperCase());
    if (!platoExistente) {
      alert('Ese código no existe en la base de datos de platos.');
      return;
    }

    if (tableData.find(t => t.codigo === platoExistente.codigo)) {
      alert('Ese plato ya está en la tabla para actualizar.');
      return;
    }

    setTableData(prev => [...prev, { ...platoExistente, nuevoPrecio: platoExistente.precio }]);
  };

  const groupedTableData = tableData.reduce<Record<string, TableRow[]>>((groups, row) => {
    const categoria = normalizarCategoria(row.categoria);
    groups[categoria] = [...(groups[categoria] ?? []), row];
    return groups;
  }, {});

  const categoriasConCambios = Object.keys(groupedTableData).sort((a, b) => {
    const indexA = ordenCategorias.indexOf(a);
    const indexB = ordenCategorias.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Acceso Administrador</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <div className="text-sm text-gray-500">
            Platos en base de datos: <span className="font-semibold">{platos.length}</span>
          </div>
        </div>

        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Extraer Precios (Pegar texto escaneado)</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Toma una foto a la carta con tu móvil, copia el texto y pégalo aquí. El sistema intentará buscar los códigos y sus nuevos precios.
          </p>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600 mb-4"
            placeholder="Ejemplo:&#10;29 Familia Especial 14.50&#10;30 Cerdo agridulce 8,20"
          ></textarea>
          
          <div className="flex gap-4">
            <button 
              onClick={parseText}
              className="bg-gray-800 text-white font-medium py-2 px-6 rounded hover:bg-gray-900 transition-colors"
            >
              Procesar Texto Extraído
            </button>
            <button 
              onClick={addManualRow}
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Añadir Plato Manualmente
            </button>
          </div>
        </div>

        {/* Tabla de validación */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Validar y Editar Antes de Guardar</h2>
          
          {tableData.length === 0 ? (
            <p className="text-gray-500 italic py-4">No hay platos listos para actualizar. Extrae texto o añádelos manualmente.</p>
          ) : (
            <div>
              <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {categoriasConCambios.map(categoria => (
                  <div key={categoria} className="rounded border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-700">{categoria}</p>
                    <p className="mt-1 text-2xl font-light text-gray-900">{groupedTableData[categoria].length}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                {categoriasConCambios.map(categoria => (
                  <section key={categoria} className="overflow-hidden rounded border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-900">{categoria}</h3>
                      <span className="text-sm text-gray-500">{groupedTableData[categoria].length} platos</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="py-3 px-4 font-semibold text-gray-700">Code</th>
                            <th className="py-3 px-4 font-semibold text-gray-700">Plato</th>
                            <th className="py-3 px-4 font-semibold text-gray-700">Precio Actual</th>
                            <th className="py-3 px-4 font-semibold text-gray-700">Nuevo Precio (€)</th>
                            <th className="py-3 px-4"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...groupedTableData[categoria]].sort(ordenarPorCodigo).map(row => (
                            <tr key={row.codigo} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 font-medium text-gray-900">{row.codigo}</td>
                              <td className="py-3 px-4 text-gray-600">{row.nombre}</td>
                              <td className="py-3 px-4 text-gray-500">{row.precio.toFixed(2)}€</td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={row.nuevoPrecio}
                                  onChange={e => handlePriceChange(row.codigo, parseFloat(e.target.value))}
                                  className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => removeRow(row.codigo)}
                                  className="inline-flex items-center justify-center gap-1.5 text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Quitar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSyncFirebase}
                  disabled={loading}
                  className={`inline-flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 px-8 rounded shadow-sm hover:bg-red-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Guardando...' : `Actualizar ${tableData.length} Platos en Firebase`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

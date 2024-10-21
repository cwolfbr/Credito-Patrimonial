import React, { useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Slider } from './components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const CalculadoraAmortizacao = () => {
  const [cenarios, setCenarios] = useState([
    {
      id: 1,
      nome: "Cenário 1",
      valorEmprestimo: 200000,
      taxaJurosMensal: 1.29,
      prazoMeses: 120,
      pagamentosExtras: []
    }
  ]);

  const [cenarioAtivo, setCenarioAtivo] = useState("1");

  const calcularAmortizacao = useCallback((cenario) => {
    const { valorEmprestimo, taxaJurosMensal, prazoMeses, pagamentosExtras } = cenario;
    const taxaMensal = taxaJurosMensal / 100;
    const saldoDevedorInicial = valorEmprestimo * 1.0111;
    const pagamentoMensal = (saldoDevedorInicial * taxaMensal * Math.pow(1 + taxaMensal, prazoMeses)) / (Math.pow(1 + taxaMensal, prazoMeses) - 1);

    let saldoDevedor = saldoDevedorInicial;
    const dados = [{mes: 0, saldoDevedor: saldoDevedorInicial, totalPago: 0, totalJuros: 0}];
    let totalJuros = 0;
    let totalPago = 0;
    let totalPagamentosExtras = 0;
    let prazoFinal = prazoMeses;

    for (let mes = 1; mes <= prazoMeses; mes++) {
      const juros = saldoDevedor * taxaMensal;
      let amortizacao = pagamentoMensal - juros;
      
      pagamentosExtras.forEach(pagamento => {
        let valorExtra = 0;
        if (pagamento.tipo === 'mensal') {
          valorExtra = pagamento.valor;
        } else if (pagamento.tipo === 'anual' && mes % 12 === 0) {
          valorExtra = pagamento.valor;
        } else if (pagamento.tipo === 'pontual' && mes === ((pagamento.ano - 1) * 12 + pagamento.mes)) {
          valorExtra = pagamento.valor;
        }
        amortizacao += valorExtra;
        totalPagamentosExtras += valorExtra;
      });

      saldoDevedor = Math.max(0, saldoDevedor - amortizacao);
      totalJuros += juros;
      totalPago += pagamentoMensal + (amortizacao - (pagamentoMensal - juros));

      dados.push({
        mes,
        saldoDevedor,
        totalPago,
        totalJuros,
      });

      if (saldoDevedor === 0) {
        prazoFinal = mes;
        break;
      }
    }

    return {
      pagamentoMensal,
      totalPago,
      totalJuros,
      prazoFinal,
      dados,
      saldoDevedorInicial,
      totalPagamentosExtras
    };
  }, []);

  const adicionarCenario = useCallback(() => {
    const cenarioAtual = cenarios.find(c => c.id.toString() === cenarioAtivo);
    const novoCenario = {
      id: cenarios.length + 1,
      nome: `Cenário ${cenarios.length + 1}`,
      valorEmprestimo: cenarioAtual.valorEmprestimo,
      taxaJurosMensal: cenarioAtual.taxaJurosMensal,
      prazoMeses: cenarioAtual.prazoMeses,
      pagamentosExtras: []
    };
    setCenarios(prevCenarios => [...prevCenarios, novoCenario]);
    setCenarioAtivo(novoCenario.id.toString());
  }, [cenarios, cenarioAtivo]);

  const atualizarCenario = useCallback((id, campo, valor) => {
    setCenarios(prevCenarios => 
      prevCenarios.map(cenario => 
        cenario.id === id ? { ...cenario, [campo]: valor } : cenario
      )
    );
  }, []);

  const adicionarPagamentoExtra = useCallback((id) => {
    setCenarios(prevCenarios => 
      prevCenarios.map(cenario => 
        cenario.id === id 
          ? { 
              ...cenario, 
              pagamentosExtras: [
                ...cenario.pagamentosExtras, 
                { tipo: 'mensal', ano: 1, mes: 1, valor: 0 }
              ]
            } 
          : cenario
      )
    );
  }, []);

  const atualizarPagamentoExtra = useCallback((cenarioId, index, campo, valor) => {
    setCenarios(prevCenarios => 
      prevCenarios.map(cenario => 
        cenario.id === cenarioId 
          ? { 
              ...cenario, 
              pagamentosExtras: cenario.pagamentosExtras.map((p, i) => 
                i === index ? { ...p, [campo]: valor } : p
              )
            } 
          : cenario
      )
    );
  }, []);

  const removerPagamentoExtra = useCallback((cenarioId, index) => {
    setCenarios(prevCenarios => 
      prevCenarios.map(cenario => 
        cenario.id === cenarioId 
          ? { 
              ...cenario, 
              pagamentosExtras: cenario.pagamentosExtras.filter((_, i) => i !== index)
            } 
          : cenario
      )
    );
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Calculadora de Amortização</h1>
      
      <div className="mb-6 flex justify-center">
        <Button 
          onClick={adicionarCenario} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out"
        >
          Adicionar Novo Cenário
        </Button>
      </div>

      <Tabs value={cenarioAtivo} onValueChange={setCenarioAtivo} className="space-y-6">
        <TabsList className="bg-white shadow-md rounded-lg p-1">
          {cenarios.map(cenario => (
            <TabsTrigger 
              key={cenario.id} 
              value={cenario.id.toString()}
              className="px-4 py-2 text-sm font-medium transition-colors text-white !bg-blue-500 data-[state=active]:!bg-blue-600"
            >
              {cenario.nome}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {cenarios.map(cenario => (
          <TabsContent key={cenario.id} value={cenario.id.toString()}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Empréstimo</label>
                <input
                  type="text"
                  value={formatCurrency(cenario.valorEmprestimo)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    atualizarCenario(cenario.id, 'valorEmprestimo', Number(value) / 100);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Taxa de Juros Mensal (%)</label>
                <input
                  type="number"
                  value={cenario.taxaJurosMensal}
                  onChange={(e) => atualizarCenario(cenario.id, 'taxaJurosMensal', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Prazo (meses): {cenario.prazoMeses}</label>
                <div className="mt-2">
                  <Slider
                    value={[cenario.prazoMeses]}
                    onValueChange={(value) => atualizarCenario(cenario.id, 'prazoMeses', Math.round(value[0] / 12) * 12)}
                    min={36}
                    max={360}
                    step={12}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Pagamentos Extras</h2>
              <Button 
                onClick={() => adicionarPagamentoExtra(cenario.id)} 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out mb-4"
              >
                Adicionar Pagamento Extra
              </Button>
              {cenario.pagamentosExtras.map((pagamento, index) => (
                <div key={index} className="flex flex-wrap gap-4 mb-4 items-center bg-gray-50 p-4 rounded-md">
                  <Select
                    value={pagamento.tipo}
                    onValueChange={(valor) => atualizarPagamentoExtra(cenario.id, index, 'tipo', valor)}
                  >
                    <SelectTrigger className="w-[120px] !bg-white !text-gray-900 border border-gray-300">
                      <SelectValue placeholder="Tipo" className="!text-gray-900" />
                    </SelectTrigger>
                    <SelectContent className="!bg-white !text-gray-900">
                      <SelectItem value="mensal" className="!text-gray-900 hover:!bg-blue-500 hover:!text-white focus:!bg-blue-600 focus:!text-white data-[state=checked]:!bg-blue-600 data-[state=checked]:!text-white">
                        <span className="block py-2 px-4">Mensal</span>
                      </SelectItem>
                      <SelectItem value="anual" className="!text-gray-900 hover:!bg-blue-500 hover:!text-white focus:!bg-blue-600 focus:!text-white data-[state=checked]:!bg-blue-700 data-[state=checked]:!text-white">
                        <span className="block py-2 px-4">Anual</span>
                      </SelectItem>
                      <SelectItem value="pontual" className="!text-gray-900 hover:!bg-blue-500 hover:!text-white focus:!bg-blue-600 focus:!text-white data-[state=checked]:!bg-blue-700 data-[state=checked]:!text-white">
                        <span className="block py-2 px-4">Pontual</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {pagamento.tipo === 'pontual' && (
                    <>
                      <Select
                        value={String(pagamento.ano)}
                        onValueChange={(valor) => atualizarPagamentoExtra(cenario.id, index, 'ano', Number(valor))}
                      >
                        <SelectTrigger className="w-[100px] !bg-white !text-gray-900 border border-gray-300">
                          <SelectValue placeholder="Ano" className="!text-gray-900" />
                        </SelectTrigger>
                        <SelectContent className="!bg-white !text-gray-900">
                          {[...Array(30)].map((_, i) => (
                            <SelectItem key={i} value={String(i + 1)} className="!text-gray-900 hover:!bg-blue-500 hover:!text-white">
                              <span className="block py-2 px-4">Ano {i + 1}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={String(pagamento.mes)}
                        onValueChange={(valor) => atualizarPagamentoExtra(cenario.id, index, 'mes', Number(valor))}
                      >
                        <SelectTrigger className="w-[100px] !bg-white !text-gray-900 border border-gray-300">
                          <SelectValue placeholder="Mês" className="!text-gray-900" />
                        </SelectTrigger>
                        <SelectContent className="!bg-white !text-gray-900">
                          {[...Array(12)].map((_, i) => (
                            <SelectItem key={i} value={String(i + 1)} className="!text-gray-900 hover:!bg-blue-500 hover:!text-white">
                              <span className="block py-2 px-4">Mês {i + 1}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                  <input
                    type="text"
                    placeholder="Valor"
                    value={formatCurrency(pagamento.valor)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      atualizarPagamentoExtra(cenario.id, index, 'valor', Number(value) / 100);
                    }}
                    className="w-36 p-2 border border-gray-300 rounded-md bg-white text-gray-900"
                  />
                  <Button 
                    onClick={() => removerPagamentoExtra(cenario.id, index)} 
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out"
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Resultados Comparativos</h2>
        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Gráfico de Amortização</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mes" 
                  allowDuplicatedCategory={false} 
                  tickFormatter={(mes) => `${mes} meses`}
                  type="number"
                  domain={[0, 'dataMax']}
                  ticks={(() => {
                    const maxPrazo = Math.max(...cenarios.map(c => calcularAmortizacao(c).prazoFinal));
                    return Array.from({length: Math.ceil(maxPrazo / 12) + 1}, (_, i) => i * 12);
                  })()}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  formatter={(value, name) => [formatCurrency(value), name]}
                  labelFormatter={(label) => `${label} meses`}
                />
                <Legend />
                {cenarios.map((cenario, index) => {
                  const resultados = calcularAmortizacao(cenario);
                  return (
                    <Line 
                      key={cenario.id}
                      type="monotone" 
                      data={resultados.dados}
                      dataKey="saldoDevedor" 
                      stroke={`hsl(${210 + index * 30}, 70%, 50%)`}
                      name={`${cenario.nome} - Saldo Devedor`} 
                      isAnimationActive={false}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Comparação de Cenários</h3>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Cenário</th>
                  <th className="px-6 py-3">Pagamento Mensal</th>
                  <th className="px-6 py-3">Total Pago</th>
                  <th className="px-6 py-3">Total de Juros</th>
                  <th className="px-6 py-3">Pagamentos Extras</th>
                  <th className="px-6 py-3">Prazo Final</th>
                </tr>
              </thead>
              <tbody>
                {cenarios.map((cenario, index) => {
                  const resultados = calcularAmortizacao(cenario);
                  return (
                    <tr key={cenario.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-medium text-gray-900">{cenario.nome}</td>
                      <td className="px-6 py-4">{formatCurrency(resultados.pagamentoMensal)}</td>
                      <td className="px-6 py-4">{formatCurrency(resultados.totalPago)}</td>
                      <td className="px-6 py-4">{formatCurrency(resultados.totalJuros)}</td>
                      <td className="px-6 py-4">{formatCurrency(resultados.totalPagamentosExtras)}</td>
                      <td className="px-6 py-4">{resultados.prazoFinal} meses</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraAmortizacao;
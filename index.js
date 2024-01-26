
const contaBancaria = {
    investimentoInicial: 500,
    taxaJurosMensal: 8,
    periodoMeses: 12,
  };
  
  // TODO: Calcule a taxa de juros mensal em formato decimal (0 a 1) a partir da taxa percentual fornecida:
  montante = contaBancaria.investimentoInicial * (1 + contaBancaria.taxaJurosMensal) ^ contaBancaria.periodoMeses
  // TODO: Calcule o montante (valor total após o investimento) usando a fórmula de juros compostos.
  
  
  // É impresso informações sobre o investimento:
  console.log("Investimento: " + contaBancaria.investimentoInicial.toFixed(2));
  console.log("Juros: " + contaBancaria.taxaJurosMensal);
  console.log("Período: " + contaBancaria.periodoMeses);
  console.log("Resultado: " + montante.toFixed(2));
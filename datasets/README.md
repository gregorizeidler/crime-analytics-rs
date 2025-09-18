# Datasets - Dados Criminais do Rio Grande do Sul

Esta pasta contém os datasets utilizados no projeto de análise criminal do RS.

## Estrutura

```
datasets/
├── raw/           # Dados brutos originais (CSV)
├── processed/     # Dados processados e transformados  
└── cleaned/       # Dados limpos e prontos para análise
```

## Descrição das pastas

### 🗂️ raw/
- Contém os arquivos CSV originais dos dados criminais
- Dados não modificados, exatamente como recebidos da fonte
- Serve como backup e referência dos dados originais

### 🔄 processed/
- Dados após processamento inicial
- Transformações básicas, padronizações
- Dados intermediários no pipeline de processamento

### ✨ cleaned/
- Dados finais limpos e validados
- Prontos para análise e modelagem
- Formato otimizado para uso nos notebooks e dashboards

## Como usar

1. Coloque seus CSVs originais na pasta `raw/`
2. Processe os dados e salve versões na pasta `processed/`
3. Dados finais limpos vão para a pasta `cleaned/`

## Formatos suportados

- CSV (formato principal)
- Encoding UTF-8 recomendado
- Separador vírgula (,) ou ponto-e-vírgula (;)

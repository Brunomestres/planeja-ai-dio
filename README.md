# Planej.ai

Aplicação web para simulação de metas financeiras com apoio de IA. O projeto coleta informações do usuário em um fluxo por etapas, calcula a capacidade mensal de economia e gera um diagnóstico personalizado com sugestões práticas para aproximar o planejamento da realidade financeira.

## Visão Geral

O `Planej.ai` foi construído para transformar uma meta financeira em um plano mais tangível. Em vez de mostrar apenas números soltos, a aplicação combina:

- simulação guiada em múltiplas etapas
- cálculo automático da economia mensal necessária
- persistência local das simulações
- leitura de viabilidade com feedback gerado por IA
- suporte a tema claro e escuro

## Funcionalidades

- Formulário de simulação em etapas para renda, despesas, dívidas e objetivo financeiro.
- Cálculo da economia mensal necessária com base no prazo definido.
- Página de resultado com cards resumindo meta, prazo, renda, custos e valor mensal estimado.
- Geração de insight financeiro personalizado via API do Gemini.
- Armazenamento das simulações no `localStorage`.
- Reaproveitamento do insight salvo para evitar chamadas desnecessárias à IA.
- Alternância entre tema `light` e `dark`.

## Fluxo da Aplicação

1. O usuário preenche a simulação passo a passo.
2. Ao concluir, os dados são salvos localmente com um `id` único.
3. A aplicação redireciona para `/resultado/:id`.
4. O resumo financeiro é exibido na tela.
5. Um insight é gerado a partir dos dados salvos e persistido junto da simulação.

## Stack

- `React 19`
- `TypeScript`
- `Vite`
- `React Router`
- `Tailwind CSS v4`
- `Lucide React`
- `Gemini API`

## Estrutura do Projeto

```text
src/
  components/
    features/
      Insights/
      Simulation/
      SimulationResults/
    layout/
    shared/
  context/
    theme/
  data/
  hooks/
  pages/
  services/
  styles/
  utils/
```

## Organização por Responsabilidade

- `components/features`: blocos da experiência principal, como formulário, resultado e insight.
- `components/shared`: componentes reutilizáveis de interface.
- `context/theme`: contexto e provider do tema global.
- `hooks`: regras de negócio reaproveitáveis, como persistência e busca do insight.
- `services`: integração com serviços externos.
- `data`: estrutura das etapas do formulário e montagem do prompt da IA.
- `utils`: funções auxiliares para cálculo e formatação.

## Rotas Atuais

- `/`: formulário principal da simulação
- `/resultado/:id`: resultado detalhado da simulação
- `/historico`: rota reservada, ainda em evolução

## Integração com IA

O insight é gerado com base nos dados da simulação e retornado em formato estruturado. Hoje, a integração usa a variável de ambiente `VITE_GEMINI_API_KEY` para autenticação com a API do Gemini.

Exemplo de `.env`:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

## Como Rodar Localmente

### Pré-requisitos

- `Node.js`
- `pnpm`

### Instalação

```bash
pnpm install
```

### Ambiente

Crie um arquivo `.env` na raiz do projeto com a chave da API:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

### Desenvolvimento

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

## Destaques Técnicos

- Uso de `Context API` para controle de tema.
- Persistência simples e direta com `localStorage`.
- Hook dedicado para geração e cache do insight financeiro.
- Separação entre UI, regras de negócio e integração externa.
- Estrutura pronta para expansão de novas páginas e novos cenários de análise.

## Pontos de Evolução

- Implementar a tela completa de histórico de simulações.
- Melhorar tratamento de erros da integração com IA.
- Adicionar testes para hooks, utilitários e fluxo principal.
- Revisar alguns textos com acentuação quebrada no código-fonte.
- Fortalecer validações de formulário e estados vazios.

## Status do Projeto

O projeto já entrega o fluxo principal de simulação e resultado com insight por IA. A base está bem encaminhada para portfólio e estudos, com espaço claro para evoluir UX, histórico, testes e robustez da integração externa.

## Autor

Projeto desenvolvido por Bruno Mestres.

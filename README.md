# README - Bitok

## Descrição da Aplicação

**Bitok** é uma aplicação desenvolvida no ambito da cadeira de Desenvolimento em Dispositivos Móveis, e foi desenvolvida em **React Native**, tem como objetivo ajudar utilizadores a **encontrar**, **marcar** e **avaliar** restaurantes de forma prática e personalizada. O objetivo é melhorar a experiência dos clientes na interação com restaurantes, permitindo filtrar opções com base nos seus gostos, marcar datas específicas, manter um historico de restaurantes e avaliar as suas visitas.

---

## Funcionalidades Principais

- **Pesquisar Restaurantes:**  
  O cliente pode visualizar uma lista de restaurantes disponíveis na aplicação. 

- **Filtros Personalizados:**  
  O utilizador pode filtrar os restaurantes com base nas suas preferências, que adapta os resultados ao seu gosto. Essas preferências são mantidas somente no dispositivo do utilizador e podem ser apagadas a qualquer momento.

- **Detalhes dos Restaurantes:**  
  Ao selecionar um restaurante, é possível visualizar informações adicionais, incluindo alguns produtos disponíveis, bem como o seu preço base.

- **Chamada Direta ao Restaurante:**  
  A aplicação permite um contacto direto com o restaurante através de um só botão integrado.

- **Guardar Marcações:**  
  Após a ligação, o cliente pode guardar ou não a data da marcação para referência futura, bem como as pessoas que o vão acompanhar.

- **Avaliação:**  
  Os utilizadores podem avaliar os restaurantes com uma nota de 0 a 5, sendo que cada reserva é avaliada de forma individual. Isto garante que a classificação reflete experiências reais e atualizadas.

---

## Configuração do Projeto

### Pré-requisitos

- Node.js instalado
- Yarn ou npm para gestão de pacotes
- Expo CLI instalado globalmente (ou então utilizar `npx` para executar a versão mais recente do Expo CLI diretamente do repositório npm)
- Configuração de variáveis de ambiente no ficheiro `.env`

### Passos para Configurar

1. **Clonar o Repositório:**  

`git clone https://github.com/RenatoasMedeiros/Bitok cd Bitok`

2. **Instale as Dependências:**  
Use `npm` ou `yarn` para instalar as dependências:

`npm install`
ou
`yarn install`

4. **Executar o Projeto:**  
Iniciar a aplicação com Expo:  

`expo start`

(caso não tenha o expo instalado globalmente podes utilizar o `npx expo start`)


5. **Testar a Aplicação:**  
Com a câmara do telemóvel ler o QRCode (A aplicação expo que está disponivel na AppStore e na PlayStore precisa de estar instalada!).

---

## Tecnologias Utilizadas

- **React Native** - Base para o desenvolvimento da aplicação móvel.
- **Expo** - Facilitador no processo de desenvolvimento e até deploy da aplicação.
- **Supabase** - Para gestão de dados e autenticação.
- **TypeScript** - Para maior robustez no código.

---
# CRM CTRL Vision — Prospecção B2B (Optometria)

Sistema de CRM Kanban simples, rápido e focado em prospecção comercial manual B2B (Instagram & WhatsApp) para optometristas, clínicas e óticas.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- **Node.js**: v18 ou superior instalado.

### Passo a Passo
1. Abra o terminal na pasta do projeto:
   ```bash
   cd "C:\Users\Lucas\Desktop\CRM CTRL"
   ```

2. Instale as dependências (se necessário):
   ```bash
   npm install
   ```

3. Execute as migrações do banco e insira os dados de exemplo:
   ```bash
   npx prisma migrate dev
   ```

4. Inicie a aplicação localmente:
   ```bash
   npm run dev
   ```

5. Acesse no navegador:
   - **Frontend (Interface CRM Kanban)**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 📥 Como Importar CSV

1. No topo da tela do CRM, clique no botão **"Importar CSV"**.
2. Escolha entre:
   - **Upload de arquivo**: Selecione um arquivo `.csv` extraído do Google Maps ou planilha.
   - **Colar texto**: Cole diretamente o texto copiado de uma planilha.
3. O CRM irá mapear automaticamente as colunas principais:
   - `Nome`, `Telefone`, `Cidade`, `Bairro`, `Presença Digital` (Instagram), `Nota`, `Avaliações`.
   - Mapeamento automático de **"Status Comercial"**: textos como `Altíssimo (Muitas avaliações, 2 óticas parceiras)` são automaticamente divididos em:
     - **Potencial**: `Altíssimo`
     - **Justificativa**: `Muitas avaliações, 2 óticas parceiras`
4. Clique em **"Confirmar Importação"**.

---

## 💾 Como Fazer Backup do Arquivo SQLite

O banco de dados do CRM é salvo em um arquivo local único de zero configuração.

- **Localização do arquivo**:
  ```text
  prisma/dev.db
  ```
- **Como fazer backup**:
  Basta copiar o arquivo `prisma/dev.db` para uma pasta de backup, nuvem (Google Drive / OneDrive) ou pendrive.
- **Como restaurar**:
  Substitua o arquivo `prisma/dev.db` pelo arquivo salvo e reinicie o servidor.

---

## 📤 Como Exportar Dados

A qualquer momento, clique no botão **"Exportar"** no cabeçalho do CRM para baixar um arquivo CSV com todos os dados dos leads e seus respectivos históricos de interações sintetizados.

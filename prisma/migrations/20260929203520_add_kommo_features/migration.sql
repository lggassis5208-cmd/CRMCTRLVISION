-- CreateTable
CREATE TABLE "HistoricoEstagio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "estagio" TEXT NOT NULL,
    "entrouEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saiuEm" DATETIME,
    CONSTRAINT "HistoricoEstagio_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModeloMensagem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "canal" TEXT NOT NULL DEFAULT 'WhatsApp',
    "categoria" TEXT NOT NULL DEFAULT 'Primeiro Contato',
    "texto" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tipoEstrutura" TEXT NOT NULL DEFAULT 'Consultório Individual',
    "cidade" TEXT NOT NULL DEFAULT 'Goiânia',
    "bairro" TEXT,
    "telefone" TEXT NOT NULL,
    "instagram" TEXT,
    "especialidade" TEXT NOT NULL DEFAULT 'Optometria',
    "notaGoogle" REAL,
    "avaliacoesGoogle" INTEGER,
    "fonte" TEXT NOT NULL DEFAULT 'Google Maps',
    "potencial" TEXT NOT NULL DEFAULT 'Médio',
    "justificativaPotencial" TEXT,
    "estagio" TEXT NOT NULL DEFAULT 'Novo',
    "motivoPerda" TEXT,
    "valorEstimado" REAL NOT NULL DEFAULT 79.90,
    "dataUltimoContato" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataProximoFollowUp" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Lead" ("avaliacoesGoogle", "bairro", "cidade", "criadoEm", "dataProximoFollowUp", "dataUltimoContato", "especialidade", "estagio", "fonte", "id", "instagram", "justificativaPotencial", "motivoPerda", "nome", "notaGoogle", "potencial", "telefone", "tipoEstrutura") SELECT "avaliacoesGoogle", "bairro", "cidade", "criadoEm", "dataProximoFollowUp", "dataUltimoContato", "especialidade", "estagio", "fonte", "id", "instagram", "justificativaPotencial", "motivoPerda", "nome", "notaGoogle", "potencial", "telefone", "tipoEstrutura" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

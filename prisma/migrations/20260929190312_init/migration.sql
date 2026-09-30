-- CreateTable
CREATE TABLE "Lead" (
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
    "dataUltimoContato" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataProximoFollowUp" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Interacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "canal" TEXT NOT NULL DEFAULT 'WhatsApp',
    "resumo" TEXT NOT NULL,
    "proximaAcao" TEXT,
    CONSTRAINT "Interacao_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

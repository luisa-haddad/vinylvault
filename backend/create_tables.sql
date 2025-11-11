-- VinylVault Database Schema
-- Execute este SQL no Supabase SQL Editor

-- Criar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "qrCodeToken" TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS "categories" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Discos
CREATE TABLE IF NOT EXISTS "vinyls" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "year" INTEGER,
    "coverImage" TEXT,
    "barcode" TEXT,
    "categoryId" TEXT NOT NULL,
    "label" TEXT,
    "format" TEXT,
    "country" TEXT,
    "discogsId" TEXT,
    "musicbrainzId" TEXT,
    "notes" TEXT,
    "condition" TEXT,
    "purchasePrice" DOUBLE PRECISION,
    "purchaseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vinyls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "vinyls_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabela de Faixas
CREATE TABLE IF NOT EXISTS "tracks" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "vinylId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT,
    CONSTRAINT "tracks_vinylId_fkey" FOREIGN KEY ("vinylId") REFERENCES "vinyls"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Criar índices
CREATE INDEX IF NOT EXISTS "vinyls_userId_idx" ON "vinyls"("userId");
CREATE INDEX IF NOT EXISTS "vinyls_categoryId_idx" ON "vinyls"("categoryId");
CREATE INDEX IF NOT EXISTS "vinyls_barcode_idx" ON "vinyls"("barcode");
CREATE INDEX IF NOT EXISTS "tracks_vinylId_idx" ON "tracks"("vinylId");

-- Inserir categorias padrão
INSERT INTO "categories" ("id", "name", "slug", "icon", "color", "order") VALUES
(gen_random_uuid()::text, 'MPB', 'mpb', '🎵', '#FFB800', 1),
(gen_random_uuid()::text, 'Rock', 'rock', '🎸', '#E91E63', 2),
(gen_random_uuid()::text, 'Jazz', 'jazz', '🎷', '#9C27B0', 3),
(gen_random_uuid()::text, 'Blues', 'blues', '🎺', '#3F51B5', 4),
(gen_random_uuid()::text, 'Samba', 'samba', '🥁', '#4CAF50', 5),
(gen_random_uuid()::text, 'Bossa Nova', 'bossa-nova', '🎹', '#00BCD4', 6),
(gen_random_uuid()::text, 'Soul', 'soul', '💿', '#FF5722', 7),
(gen_random_uuid()::text, 'Funk', 'funk', '🎤', '#795548', 8),
(gen_random_uuid()::text, 'Clássica', 'classica', '🎻', '#607D8B', 9),
(gen_random_uuid()::text, 'Eletrônica', 'eletronica', '🎧', '#00E676', 10),
(gen_random_uuid()::text, 'Hip Hop', 'hip-hop', '🎤', '#FFC107', 11),
(gen_random_uuid()::text, 'Reggae', 'reggae', '🌴', '#8BC34A', 12),
(gen_random_uuid()::text, 'Pop', 'pop', '⭐', '#E91E63', 13),
(gen_random_uuid()::text, 'Internacional', 'internacional', '🌎', '#2196F3', 14),
(gen_random_uuid()::text, 'Outros', 'outros', '🎶', '#9E9E9E', 99)
ON CONFLICT (slug) DO NOTHING;

-- Mensagem de sucesso
SELECT 'Database criado com sucesso! ✅' as status;


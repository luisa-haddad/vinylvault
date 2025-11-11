# 📡 Documentação da API - VinylVault

Base URL: `http://localhost:3000/api`

## 🔐 Autenticação

A maioria dos endpoints requer autenticação JWT.

Inclua o token no header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 📍 Endpoints

### 🔑 Autenticação

#### POST `/auth/register`
Criar nova conta

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "user": {
      "id": "uuid",
      "email": "joao@exemplo.com",
      "name": "João Silva",
      "qrCodeToken": "token-unico",
      "isPublic": true
    },
    "token": "jwt-token"
  }
}
```

---

#### POST `/auth/login`
Fazer login

**Body:**
```json
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Response:** Igual ao register

---

#### GET `/auth/me`
Obter perfil do usuário logado

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "joao@exemplo.com",
      "name": "João Silva"
    }
  }
}
```

---

### 💿 Discos (Vinyls)

#### GET `/vinyls`
Listar discos do usuário

**Headers:** `Authorization: Bearer TOKEN`

**Query Params:**
- `categoryId` (opcional): Filtrar por categoria
- `search` (opcional): Buscar por título ou artista

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Clube da Esquina",
      "artist": "Milton Nascimento",
      "year": 1972,
      "coverImage": "url",
      "category": {
        "id": "uuid",
        "name": "MPB",
        "icon": "🎵"
      },
      "tracks": []
    }
  ]
}
```

---

#### GET `/vinyls/:id`
Obter detalhes de um disco

**Headers:** `Authorization: Bearer TOKEN`

---

#### POST `/vinyls`
Adicionar disco à coleção

**Headers:** `Authorization: Bearer TOKEN`

**Body:**
```json
{
  "title": "Clube da Esquina",
  "artist": "Milton Nascimento",
  "year": 1972,
  "categoryId": "uuid-da-categoria",
  "coverImage": "url-da-capa",
  "barcode": "123456789",
  "label": "EMI-Odeon",
  "format": "LP",
  "notes": "Edição original",
  "tracks": [
    {
      "position": "A1",
      "title": "Tudo Que Você Podia Ser",
      "duration": "3:45"
    }
  ]
}
```

**Campos obrigatórios:** `title`, `artist`, `categoryId`

---

#### PUT `/vinyls/:id`
Atualizar disco

**Headers:** `Authorization: Bearer TOKEN`

**Body:** Mesmos campos do POST (todos opcionais)

---

#### DELETE `/vinyls/:id`
Remover disco da coleção

**Headers:** `Authorization: Bearer TOKEN`

---

#### GET `/vinyls/stats`
Estatísticas da coleção

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "totalValue": 1500.00,
    "byCategory": [
      {
        "category": {
          "id": "uuid",
          "name": "MPB",
          "icon": "🎵"
        },
        "count": 15
      }
    ]
  }
}
```

---

### 🔍 Busca Externa (Discogs & MusicBrainz)

#### GET `/vinyls/search`
Buscar disco por nome

**Headers:** `Authorization: Bearer TOKEN`

**Query Params:**
- `query`: Nome do disco ou artista
- `type` (opcional): "release" (default) ou "artist"

**Response:**
```json
{
  "success": true,
  "data": {
    "discogs": {
      "results": [
        {
          "id": "123456",
          "source": "discogs",
          "title": "Clube da Esquina",
          "artist": "Milton Nascimento",
          "year": 1972,
          "coverImage": "url",
          "format": "Vinyl, LP",
          "discogsUrl": "url"
        }
      ]
    },
    "musicbrainz": []
  }
}
```

---

#### GET `/vinyls/search/barcode/:barcode`
Buscar disco por código de barras

**Headers:** `Authorization: Bearer TOKEN`

---

#### GET `/vinyls/discogs/:id`
Obter detalhes completos de um disco do Discogs

**Headers:** `Authorization: Bearer TOKEN`

**Response:** Inclui tracklist completa, imagens, etc.

---

### 📂 Categorias

#### GET `/categories`
Listar todas as categorias

**Público - não requer autenticação**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "MPB",
      "slug": "mpb",
      "icon": "🎵",
      "color": "#FFB800",
      "order": 1
    }
  ]
}
```

---

#### GET `/categories/:id`
Obter detalhes de uma categoria

---

### 👤 Usuário

#### PUT `/users/profile`
Atualizar perfil

**Headers:** `Authorization: Bearer TOKEN`

**Body:**
```json
{
  "name": "Novo Nome",
  "avatar": "url-da-foto",
  "isPublic": true
}
```

---

#### GET `/users/qrcode`
Gerar QR Code para compartilhamento

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,...",
    "publicUrl": "http://localhost:3000/public/token-unico",
    "token": "token-unico"
  }
}
```

---

#### POST `/users/qrcode/regenerate`
Regenerar token do QR Code

**Headers:** `Authorization: Bearer TOKEN`

---

### 🌐 Visualização Pública

#### GET `/public/collection/:token`
Ver coleção pública de um usuário

**Público - não requer autenticação**

**Query Params:**
- `categoryId` (opcional): Filtrar por categoria
- `search` (opcional): Buscar

**Response:**
```json
{
  "success": true,
  "data": {
    "owner": {
      "name": "João Silva",
      "avatar": "url"
    },
    "vinyls": [],
    "stats": {
      "total": 42,
      "byCategory": {
        "MPB": 15,
        "Rock": 12
      }
    }
  }
}
```

---

#### GET `/public/collection/:token/vinyl/:vinylId`
Ver detalhes de um disco específico na coleção pública

**Público - não requer autenticação**

---

## 🚨 Códigos de Erro

- **400** - Bad Request (dados inválidos)
- **401** - Unauthorized (token ausente/inválido)
- **403** - Forbidden (sem permissão)
- **404** - Not Found
- **500** - Internal Server Error

**Formato de erro:**
```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": [] // Opcional, para erros de validação
}
```

---

## 📊 Rate Limiting

- **100 requisições** por 15 minutos por IP
- Excedendo o limite: HTTP 429 (Too Many Requests)

---

## 🔒 Segurança

- Senhas são criptografadas com **bcrypt**
- Tokens JWT expiram em **7 dias** (configurável)
- CORS habilitado
- Helmet.js para headers de segurança
- Validação com Joi em todos os endpoints

---

## 🧪 Testando a API

### Com cURL:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"senha123"}'

# Listar discos
curl http://localhost:3000/api/vinyls \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Com Postman/Insomnia:

1. Importe a collection (crie uma baseada nesta doc)
2. Configure a variável `{{baseUrl}}` = `http://localhost:3000/api`
3. Após login, salve o token na variável `{{token}}`

---

## 📝 Notas

- Todos os endpoints retornam JSON
- Timestamps são em ISO 8601 (UTC)
- IDs são UUIDs v4
- Imagens devem ser URLs públicas (ou use Cloudinary)

---

**Happy coding! 🎵**


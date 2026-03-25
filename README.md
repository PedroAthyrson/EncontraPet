# EncontraPet API

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)
![Maven](https://img.shields.io/badge/Maven-4.0.0-red)

[cite_start]API RESTful desenvolvida para a plataforma **EncontraPet**, um Produto Mínimo Viável (MVP) com foco em impacto social que conecta donos de animais de estimação a uma comunidade de voluntários para facilitar o reencontro de pets perdidos[cite: 25, 29].

## Descrição do Projeto

[cite_start]O EncontraPet surge como uma solução para centralizar a base de dados de animais desaparecidos de forma visual e geolocalizada[cite: 28]. A plataforma permite que usuários cadastrem seus pets proativamente e, em caso de desaparecimento, criem anúncios de "Animal Perdido" com a localização exata no mapa. Pessoas que encontram um animal na rua também podem criar anúncios de "Animal Encontrado", promovendo a conexão direta entre quem perdeu e quem encontrou.

## Funcionalidades

A API oferece um conjunto completo de funcionalidades para dar suporte à plataforma:

* **Autenticação e Segurança:** Sistema de login com autenticação baseada em tokens JWT, garantindo que apenas usuários autorizados possam gerenciar seus dados.
* **Gerenciamento de Usuários:** Cadastro de novos usuários com senhas criptografadas.
* **Upload Local de Imagens:** Recebimento e armazenamento físico de fotos (`MultipartFile`) no servidor local (diretório `/uploads`), servindo as imagens estaticamente para o front-end de forma otimizada.
* **Gerenciamento de Pets (CRUD):** Usuários autenticados podem cadastrar, listar, atualizar e deletar seus animais de estimação.
* **Sistema de Anúncios e Geolocalização (CRUD):**
    * Criação de anúncios dinâmicos de "Animal Perdido" (associado a um pet pré-cadastrado) e "Animal Encontrado" (com descrições e fotos avulsas).
    * Captura e armazenamento de coordenadas (Latitude e Longitude) para renderização em mapas interativos.
    * Listagem pública de anúncios com sistema de filtros (por status, cidade e estado).
    * Regras de validação estritas: Deleção, atualização e marcação como "Resolvido" restritas exclusivamente ao autor do anúncio.
* **Sistema de Comentários:** Permite que a comunidade interaja nos anúncios, postando pistas e informações.
* **Documentação Interativa:** Documentação completa da API gerada com Springdoc (Swagger), permitindo fácil visualização e teste dos endpoints.

## Tecnologias Utilizadas

* **Java 17:** Versão LTS do Java.
* **Spring Boot 3.3.3:** Framework principal para a construção da aplicação.
* **Spring Web & NIO:** Para a criação de endpoints REST e manipulação do sistema de arquivos local (Uploads).
* **Spring Data JPA (Hibernate):** Para a persistência de dados e comunicação com o banco.
* **Spring Security:** Para a implementação da autenticação e autorização com JWT.
* **PostgreSQL:** Banco de dados relacional para armazenamento dos dados.
* **Maven:** Gerenciador de dependências e build do projeto.
* **Lombok:** Para a redução de código boilerplate.
* **Springdoc OpenAPI:** Para a geração automática da documentação Swagger.

## Configuração do Ambiente Local

Para executar este projeto localmente, você precisará ter o seguinte instalado:

* **JDK 17** ou superior.
* **Maven 3.8** ou superior.
* **Docker** (recomendado para o banco de dados).

### Passo a Passo:

**1. Clone o Repositório:**
```bash
git clone git@github.com:PedroAthyrson/EncontraPet.git
cd encontrapet-api

**2. Configure o Banco de Dados (PostgreSQL com Docker):**
A forma mais fácil de subir o banco de dados é usando o Docker. Execute o comando abaixo no seu terminal:
```bash
docker run --name encontrapet-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=sua-senha-aqui -e POSTGRES_DB=encontrapet -p 5433:5432 -d postgres
```
**Atenção:** Lembre-se de substituir `sua-senha-aqui` pela senha que você deseja usar.

**3. Configure a Aplicação:**
Abra o arquivo `src/main/resources/application.properties` e certifique-se de que a senha do banco de dados está correta:
```properties
spring.datasource.password=sua-senha-aqui # A mesma senha usada no comando Docker
```

**4. Execute a Aplicação:**
Abra o terminal **dentro do diretório do back-end** (`encontrapet-api`) para garantir a criação correta da pasta de uploads de imagens, e inicie a aplicação via Maven:
```bash
mvn spring-boot:run
```

A API estará rodando em `http://localhost:8080/api`. As fotos enviadas pelos usuários serão salvas automaticamente na pasta `/uploads` na raiz da aplicação.

> **Nota:** Acessar a URL base (`/api`) diretamente no navegador resultará em um erro `403 Forbidden`. Isso é esperado, pois a raiz da API é protegida por padrão (com exceção das rotas públicas de leitura, autenticação e visualização de uploads). Utilize a documentação do Swagger ou as ferramentas de API (Postman, Insomnia) para interagir com os endpoints específicos.

## Acesso à API e Documentação

* **URL Base da API:** `http://localhost:8080/api`
* **Documentação Swagger UI:** [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)
* **Acesso às Imagens (Exemplo):** `http://localhost:8080/api/uploads/nome-da-foto.jpg`

A documentação do Swagger é interativa e permite testar todos os endpoints diretamente pelo navegador, incluindo o fluxo de autenticação.

---
Desenvolvido como projeto da disciplina de Gerência de Projetos de Software da Universidade Federal da Paraíba (UFPB).
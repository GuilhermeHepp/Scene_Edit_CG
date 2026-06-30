# WebGL 3D Scene Editor

Um editor de cenas 3D interativo construído do zero utilizando WebGL2 e JavaScript nativo. Este projeto foi desenvolvido com foco na otimização de renderização, manipulação de matrizes e estruturação arquitetônica baseada nas melhores práticas de computação gráfica.

## ✨ Funcionalidades Principais

* **Motor de Renderização Otimizado (Instancing Ready):** Sistema de desenho de múltiplos objetos que carrega a geometria pesada apenas uma vez, compartilhando os Buffers e economizando drasticamente a CPU e a RAM.
* **Scene Graph (Grafo de Cena Hierárquico):** Implementação matemática de matrizes locais e globais que permite criar relações dinâmicas de "Pai-Filho" entre os objetos através da interface.
* **GPU Color Picking:** Seleção precisa de objetos 3D com o mouse, utilizando renderização *off-screen* (Framebuffer) com IDs convertidos em cores RGBA, contornando a ausência de Raycasting nativo no WebGL.
* **Sincronização UI-3D (Data-Binding):** Interface HTML moderna em "Dark Mode" que interage bidirecionalmente com as propriedades dos modelos na tela.
* **Parseamento Customizado de OBJ e MTL:** Leitor nativo e assíncrono de modelos tridimensionais e de suas bibliotecas de materiais (`.mtl`), sem depender de engines como o Three.js.
* **Multi-Contexto WebGL (Preview Modal):** Gerenciamento de dois "Render Loops" simultâneos em Canvas separados para inspecionar os modelos isoladamente da cena principal.
* **Serialização de Estado:** Capacidade de salvar (`Save JSON`) e carregar (`Load JSON`) o estado completo da cena, preservando hierarquias, transformações e texturas.

## 📚 Conceitos WebGL Aplicados

Este projeto serve como uma implementação prática de conceitos avançados de WebGL:

* **Less Code, More Fun (TWGL):** Utilização da biblioteca leve TWGL para eliminar o *boilerplate* da configuração do WebGL (Criação de Programs, Buffers e Uniforms).
* **Drawing Multiple Things:** Arquitetura orientada a dados com um único Loop de Renderização otimizado.
* **Using 2 or More Textures:** Carregamento assíncrono de imagens aplicadas através de Texture Units controladas diretamente pelos Shaders.
* **Animation:** Uso exclusivo de `requestAnimationFrame` e cálculo de Delta Time para animações suaves (*Frame Rate Independent*).

## 🚀 Como Rodar o Projeto

Devido às políticas de segurança do navegador (CORS) ao carregar arquivos locais (`.obj`, `.mtl`, texturas), a aplicação não pode ser executada com um simples duplo clique no arquivo HTML.

1. Faça o clone deste repositório.
2. Abra a pasta em um editor de código (como o VSCode).
3. Inicie um servidor local (utilizando extensões como Live Server ou ferramentas como o Servez) apontando para a pasta do projeto.
4. Abra o endereço gerado (normalmente `http://localhost:8080` ou `http://127.0.0.1:5500`) no seu navegador.

## 🛠️ Controles e Utilização

* **Painel Direito:** Escolha o modelo desejado no menu suspenso (mais de 130 disponíveis) e clique em **Add Object**. Você também pode fazer o *Preview* do modelo ou Salvar/Carregar a sua cena completa.
* **Tela Principal:** Clique em um objeto para selecioná-lo (ele ficará com um realce verde, indicando que a variável Uniform de seleção foi ativada pelo shader).
* **Painel Esquerdo:** Com um objeto selecionado, manipule livremente as suas propriedades (Posição, Escala, Rotação), aplique animações de *ping-pong* ou *spin*, altere as texturas ou defina outro objeto como o seu "Pai" na hierarquia espacial.

---

*Projeto desenvolvido no âmbito do estudo aprofundado de Computação Gráfica com WebGL2.*

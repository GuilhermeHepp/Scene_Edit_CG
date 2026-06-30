WebGL 3D Scene Editor

Um editor de cenas 3D interativo construído do zero utilizando WebGL2 e JavaScript nativo. Este projeto foi desenvolvido com foco na otimização de renderização, manipulação matricial e estruturação arquitetónica baseada nas melhores práticas de computação gráfica.

✨ Funcionalidades Principais

Motor de Renderização Otimizado (Instancing Ready): Sistema de desenho de múltiplos objetos que carrega a geometria pesada apenas uma vez, partilhando os Buffers e poupando drásticamente o CPU e a RAM.

Scene Graph (Grafo de Cena Hierárquico): Implementação matemática de matrizes locais e globais que permite criar relações de "Pai-Filho" dinâmicas entre os objetos através da interface.

GPU Color Picking: Seleção precisa de objetos 3D com o rato, utilizando renderização off-screen (Framebuffer) com IDs convertidos em cores RGBA, contornando a ausência de Raycasting nativo no WebGL.

Sincronização UI-3D (Data-Binding): Interface HTML moderna em "Dark Mode" que interage bidirecionalmente com as propriedades dos modelos na tela.

Parseamento Customizado de OBJ e MTL: Leitor nativo e assíncrono de modelos tridimensionais e das suas bibliotecas de materiais (.mtl), sem depender de motores como o Three.js.

Multi-Contexto WebGL (Preview Modal): Gestão de dois "Render Loops" simultâneos em Canvas separados para inspecionar os modelos isoladamente da cena principal.

Serialização de Estado: Capacidade de guardar (Save JSON) e carregar (Load JSON) o estado completo da cena, preservando hierarquias, transformações e texturas.

📚 Conceitos WebGL Aplicados

Este projeto serve como uma implementação prática de conceitos avançados de WebGL:

Less Code, More Fun (TWGL): Utilização da biblioteca leve TWGL para eliminar o Boilerplate da configuração do WebGL (Criação de Programs, Buffers e Uniforms).

Drawing Multiple Things: Arquitetura orientada a dados com um único Loop de Renderização otimizado.

Using 2 or More Textures: Carregamento assíncrono de imagens aplicadas através de Texture Units controladas diretamente pelos Shaders.

Animation: Uso exclusivo de requestAnimationFrame e cálculo de Delta Time para animações suaves ("Frame Rate Independent").

🚀 Como Correr o Projeto

Devido às políticas de segurança do navegador (CORS) ao carregar ficheiros locais (.obj, .mtl, texturas), a aplicação não pode ser corrida com um duplo clique no ficheiro HTML.

Faz o clone deste repositório.

Abre a pasta num editor como o VSCode.

Inicia um servidor local utilizando o Servez apontando para a pasta do projeto.

Abre o endereço gerado (normalmente http://localhost:8080) no teu navegador.

🛠️ Controlos e Utilização

Painel Direito: Escolhe o modelo que queres no dropdown (mais de 130 disponíveis) e clica em Add Object. Também podes fazer Preview do modelo ou Guardar/Carregar a tua cena completa.

Tela Principal: Clica num objeto para o selecionares (ficará com um realce verde indicando que a variável Uniform de seleção foi ativada pelo shader).

Painel Esquerdo: Com um objeto selecionado, manipula livremente as suas propriedades (Posição, Escala, Rotação), aplica animações de ping-pong ou spin, altera as texturas ou define outro objeto como o seu "Pai" na hierarquia espacial.

Projeto desenvolvido no âmbito do estudo aprofundado de Computação Gráfica com WebGL2.

Painel Esquerdo: Com um objeto selecionado, manipula livremente as suas propriedades (Posição, Escala, Rotação), aplica animações de ping-pong ou spin, altera as texturas ou define outro objeto como o seu "Pai" na hierarquia espacial.

Projeto desenvolvido no âmbito do estudo aprofundado de Computação Gráfica com WebGL2.

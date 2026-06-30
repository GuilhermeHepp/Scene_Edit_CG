const vs = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
uniform mat4 u_matrix;
out vec2 v_texCoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_texCoord = a_texcoord;
}
`;

const fs = `#version 300 es
precision highp float;
uniform vec4 u_diffuse;
uniform sampler2D u_texture;
uniform bool u_useTexture;
uniform bool u_isSelected;

in vec2 v_texCoord;
out vec4 outColor;

void main() {
  vec4 baseColor = u_diffuse;
  if (u_useTexture) {
    baseColor = texture(u_texture, v_texCoord) * u_diffuse;
  }
  
  if (u_isSelected) {
    outColor = baseColor + vec4(0.0, 0.5, 0.0, 0.0);
  } else {
    outColor = baseColor;
  }
}
`;

const pickingVS = `#version 300 es
in vec4 a_position;
uniform mat4 u_matrix;
void main() {
  gl_Position = u_matrix * a_position;
}
`;

const pickingFS = `#version 300 es
precision highp float;
uniform vec4 u_id;
out vec4 outColor;
void main() {
  outColor = u_id;
}
`;

function parseMTL(text) {
  const materials = {};
  let material;
  const lines = text.split("\n");

  for (let line of lines) {
    line = line.trim();
    if (line === "" || line.startsWith("#")) continue;
    const parts = line.split(/\s+/);
    const keyword = parts[0];

    if (keyword === "newmtl") {
      material = { u_diffuse: [1, 1, 1, 1] };
      materials[parts[1]] = material;
    } else if (keyword === "Kd") {
      material.u_diffuse = [
        parseFloat(parts[1]),
        parseFloat(parts[2]),
        parseFloat(parts[3]),
        1.0,
      ];
    }
  }
  return materials;
}

function parseOBJ(text) {
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const geometries = [];
  let currentGeometry = null;
  let materialLib = null;

  const lines = text.split("\n");
  for (let line of lines) {
    line = line.trim();
    if (line === "" || line.startsWith("#")) continue;
    const parts = line.split(/\s+/);
    const keyword = parts[0];

    if (keyword === "mtllib") {
      materialLib = parts[1];
    } else if (keyword === "usemtl") {
      currentGeometry = { material: parts[1], positions: [], texcoords: [] };
      geometries.push(currentGeometry);
    } else if (keyword === "v") {
      objPositions.push(parts.slice(1).map(parseFloat));
    } else if (keyword === "vt") {
      objTexcoords.push(parts.slice(1).map(parseFloat));
    } else if (keyword === "f") {
      if (!currentGeometry) {
        currentGeometry = { material: "default", positions: [], texcoords: [] };
        geometries.push(currentGeometry);
      }

      const numVertices = parts.length - 1;
      for (let i = 1; i < numVertices - 1; i++) {
        const v1 = parts[1].split("/");
        const v2 = parts[i + 1].split("/");
        const v3 = parts[i + 2].split("/");

        currentGeometry.positions.push(...objPositions[parseInt(v1[0])]);
        currentGeometry.positions.push(...objPositions[parseInt(v2[0])]);
        currentGeometry.positions.push(...objPositions[parseInt(v3[0])]);

        if (v1[1] && v2[1] && v3[1]) {
          currentGeometry.texcoords.push(...objTexcoords[parseInt(v1[1])]);
          currentGeometry.texcoords.push(...objTexcoords[parseInt(v2[1])]);
          currentGeometry.texcoords.push(...objTexcoords[parseInt(v3[1])]);
        }
      }
    }
  }
  return { geometries, materialLib };
}

async function main() {
  const canvas = document.querySelector("#webgl-canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) return alert("Seu navegador não suporta WebGL2.");

  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  const pickingProgramInfo = twgl.createProgramInfo(gl, [pickingVS, pickingFS]);

  const previewCanvas = document.querySelector("#preview-canvas");
  const previewGl = previewCanvas.getContext("webgl2");
  const previewProgramInfo = twgl.createProgramInfo(previewGl, [vs, fs]);

  const texturas = twgl.createTextures(gl, {
    leaves: {
      src: "https://webgl2fundamentals.org/webgl/resources/leaves.jpg",
    },
    star: { src: "https://webgl2fundamentals.org/webgl/resources/star.jpg" },
  });

  const texturasPreview = twgl.createTextures(previewGl, {
    leaves: {
      src: "https://webgl2fundamentals.org/webgl/resources/leaves.jpg",
    },
    star: { src: "https://webgl2fundamentals.org/webgl/resources/star.jpg" },
  });

  const modelNames = [
    "arrow_teamBlue",
    "arrow_teamRed",
    "arrow_teamYellow",
    "ball",
    "ball_teamBlue",
    "ball_teamRed",
    "ball_teamYellow",
    "barrierFloor",
    "barrierLadder",
    "barrierLarge",
    "barrierMedium",
    "barrierSmall",
    "barrierStrut",
    "blaster_teamBlue",
    "blaster_teamRed",
    "blaster_teamYellow",
    "bomb_teamBlue",
    "bomb_teamRed",
    "bomb_teamYellow",
    "button_teamBlue",
    "button_teamRed",
    "button_teamYellow",
    "characer_duck",
    "characer_duckHead",
    "character_bear",
    "character_bearHead",
    "character_dog",
    "character_dogHead",
    "detail_desert",
    "detail_forest",
    "diamond_teamBlue",
    "diamond_teamRed",
    "diamond_teamYellow",
    "flag_teamBlue",
    "flag_teamRed",
    "flag_teamYellow",
    "gateLarge_teamBlue",
    "gateLarge_teamRed",
    "gateLarge_teamYellow",
    "gateLargeWide_teamBlue",
    "gateLargeWide_teamRed",
    "gateLargeWide_teamYellow",
    "gateSmall_teamBlue",
    "gateSmall_teamRed",
    "gateSmall_teamYellow",
    "gateSmallWide_teamBlue",
    "gateSmallWide_teamRed",
    "gateSmallWide_teamYellow",
    "heart_teamBlue",
    "heart_teamRed",
    "heart_teamYellow",
    "hoop_teamBlue",
    "hoop_teamRed",
    "hoop_teamYellow",
    "lightning",
    "plantA_desert",
    "plantA_forest",
    "plantB_desert",
    "plantB_forest",
    "powerupBlock_teamBlue",
    "powerupBlock_teamRed",
    "powerupBlock_teamYellow",
    "powerupBomb",
    "ring_teamBlue",
    "ring_teamRed",
    "ring_teamYellow",
    "rocksA_desert",
    "rocksA_forest",
    "rocksB_desert",
    "rocksB_forest",
    "slingshot_teamBlue",
    "slingshot_teamRed",
    "slingshot_teamYellow",
    "spikeRoller",
    "star",
    "swiper_teamBlue",
    "swiper_teamRed",
    "swiper_teamYellow",
    "swiperDouble_teamBlue",
    "swiperDouble_teamRed",
    "swiperDouble_teamYellow",
    "swiperLong_teamBlue",
    "swiperLong_teamRed",
    "swiperLong_teamYellow",
    "sword_teamBlue",
    "sword_teamRed",
    "sword_teamYellow",
    "target",
    "targetStand",
    "tileHigh_desert",
    "tileHigh_forest",
    "tileHigh_teamBlue",
    "tileHigh_teamRed",
    "tileHigh_teamYellow",
    "tileLarge_desert",
    "tileLarge_forest",
    "tileLarge_teamBlue",
    "tileLarge_teamRed",
    "tileLarge_teamYellow",
    "tileLow_desert",
    "tileLow_forest",
    "tileLow_teamBlue",
    "tileLow_teamRed",
    "tileLow_teamYellow",
    "tileMedium_desert",
    "tileMedium_forest",
    "tileMedium_teamBlue",
    "tileMedium_teamRed",
    "tileMedium_teamYellow",
    "tileSlopeLowHigh_desert",
    "tileSlopeLowHigh_forest",
    "tileSlopeLowHigh_teamBlue",
    "tileSlopeLowHigh_teamRed",
    "tileSlopeLowHigh_teamYellow",
    "tileSlopeLowMedium._teamRed",
    "tileSlopeLowMedium_desert",
    "tileSlopeLowMedium_forest",
    "tileSlopeLowMedium_teamBlue",
    "tileSlopeLowMedium_teamYellow",
    "tileSlopeMediumHigh_desert",
    "tileSlopeMediumHigh_forest",
    "tileSlopeMediumHigh_teamBlue",
    "tileSlopeMediumHigh_teamRed",
    "tileSlopeMediumHigh_teamYellow",
    "tileSmall_desert",
    "tileSmall_forest",
    "tileSmall_teamBlue",
    "tileSmall_teamRed",
    "tileSmall_teamYellow",
    "tree_desert",
    "tree_forest",
  ];

  const modelos = {};
  const previewModelos = {};
  const selectMenu = document.getElementById("model-select");

  for (const name of modelNames) {
    try {
      const objResponse = await fetch(`./assets/${name}.obj`);
      const objText = await objResponse.text();
      const objData = parseOBJ(objText);

      let materials = { default: { u_diffuse: [0.8, 0.8, 0.8, 1.0] } };
      if (objData.materialLib) {
        try {
          const mtlResponse = await fetch(`./assets/${objData.materialLib}`);
          if (mtlResponse.ok) {
            materials = { ...materials, ...parseMTL(await mtlResponse.text()) };
          }
        } catch (e) {
          console.warn("Não foi possível carregar o .mtl para: " + name);
        }
      }

      modelos[name] = objData.geometries.map((geom) => {
        const arrays = {
          a_position: {
            numComponents: 3,
            data: new Float32Array(geom.positions),
          },
        };
        if (geom.texcoords && geom.texcoords.length > 0) {
          arrays.a_texcoord = {
            numComponents: 2,
            data: new Float32Array(geom.texcoords),
          };
        }
        return {
          bufferInfo: twgl.createBufferInfoFromArrays(gl, arrays),
          material: materials[geom.material] || materials["default"],
        };
      });

      previewModelos[name] = objData.geometries.map((geom) => {
        const arrays = {
          a_position: {
            numComponents: 3,
            data: new Float32Array(geom.positions),
          },
        };
        if (geom.texcoords && geom.texcoords.length > 0) {
          arrays.a_texcoord = {
            numComponents: 2,
            data: new Float32Array(geom.texcoords),
          };
        }
        return {
          bufferInfo: twgl.createBufferInfoFromArrays(previewGl, arrays),
          material: materials[geom.material] || materials["default"],
        };
      });

      if (selectMenu) {
        const opt = document.createElement("option");
        opt.value = name;
        opt.text = name;
        selectMenu.appendChild(opt);
      }
    } catch (e) {
      console.warn("Ficheiro não encontrado ou erro ao processar: " + name);
    }
  }

  const targetTexture = gl.createTexture();
  const depthBuffer = gl.createRenderbuffer();
  const fb = gl.createFramebuffer();

  function setFramebufferAttachmentSizes(width, height) {
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );

    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      width,
      height,
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      targetTexture,
      0,
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      depthBuffer,
    );
  }

  setFramebufferAttachmentSizes(gl.canvas.width, gl.canvas.height);

  let objects = [];
  let selectedObject = null;
  let mouseX = -1;
  let mouseY = -1;
  let clicked = false;

  function updateUI() {
    if (!selectedObject) return;
    document.getElementById("posX").value = selectedObject.x.toFixed(2);
    document.getElementById("posY").value = selectedObject.y.toFixed(2);
    document.getElementById("posZ").value = selectedObject.z.toFixed(2);
    document.getElementById("rotY").value = selectedObject.ry;
    document.getElementById("scaleX").value = selectedObject.scaleX;
    document.getElementById("scaleY").value = selectedObject.scaleY;
    document.getElementById("scaleZ").value = selectedObject.scaleZ;
    document.getElementById("animType").value = selectedObject.animType;
    document.getElementById("animSpeed").value = selectedObject.animSpeed;
    document.getElementById("texSelect").value = selectedObject.texSelect;
    const parentSelect = document.getElementById("parentId");
    parentSelect.innerHTML = '<option value="none">None (World)</option>';
    objects.forEach((o) => {
      if (o.id !== selectedObject.id) {
        const opt = document.createElement("option");
        opt.value = o.id;
        opt.text = "Object " + o.id;
        parentSelect.appendChild(opt);
      }
    });
    parentSelect.value = selectedObject.parentId;
  }

  const propMap = {
    posX: "x",
    posY: "y",
    posZ: "z",
    rotY: "ry",
    scaleX: "scaleX",
    scaleY: "scaleY",
    scaleZ: "scaleZ",
    animSpeed: "animSpeed",
  };

  Object.keys(propMap).forEach((id) => {
    document.getElementById(id).addEventListener("input", (e) => {
      if (selectedObject) {
        selectedObject[propMap[id]] = parseFloat(e.target.value) || 0;
      }
    });
  });
  document.getElementById("animType").addEventListener("change", (e) => {
    if (selectedObject) selectedObject.animType = e.target.value;
  });
  document.getElementById("texSelect").addEventListener("change", (e) => {
    if (selectedObject) selectedObject.texSelect = e.target.value;
  });

  document.getElementById("parentId").addEventListener("change", (e) => {
    if (selectedObject) selectedObject.parentId = e.target.value;
  });

  document.getElementById("btn-add").addEventListener("click", () => {
    const id = objects.length + 1;
    const newObject = {
      id: id,
      u_id: [
        ((id >> 0) & 0xff) / 255.0,
        ((id >> 8) & 0xff) / 255.0,
        ((id >> 16) & 0xff) / 255.0,
        ((id >> 24) & 0xff) / 255.0,
      ],
      x: Math.random() * 4 - 2,
      y: 0,
      z: Math.random() * 4 - 2,
      ry: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      animType: "none",
      animSpeed: 0,
      animProgress: 0,
      texSelect: "none",
      parentId: "none",
      modelType:
        selectMenu && selectMenu.value ? selectMenu.value : modelNames[0],
      localMatrix: twgl.m4.identity(),
      worldMatrix: twgl.m4.identity(),
    };

    objects.push(newObject);
    selectedObject = newObject;
    updateUI();
  });

  document.getElementById("btn-save").addEventListener("click", () => {
    const dataStr = JSON.stringify(objects, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "minha_cena_webgl.json";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  const btnLoad = document.getElementById("btn-load");
  const inputLoad = document.getElementById("input-load");

  btnLoad.addEventListener("click", () => {
    inputLoad.click();
  });

  inputLoad.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedObjects = JSON.parse(e.target.result);

        if (Array.isArray(loadedObjects)) {
          objects = loadedObjects;
          selectedObject = null;

          updateUI();

          const parentSelect = document.getElementById("parentId");
          parentSelect.innerHTML = '<option value="none">None (World)</option>';
          objects.forEach((o) => {
            const opt = document.createElement("option");
            opt.value = o.id;
            opt.text = "Object " + o.id;
            parentSelect.appendChild(opt);
          });

          alert("Cena carregada com sucesso!");
        }
      } catch (err) {
        alert("Erro ao ler o ficheiro JSON. O formato é inválido.");
      }
    };
    reader.readAsText(file);

    event.target.value = "";
  });

  gl.canvas.addEventListener("mousemove", (e) => {
    const rect = gl.canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  gl.canvas.addEventListener("click", (e) => {
    const rect = gl.canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    clicked = true;
  });

  const modal = document.getElementById("preview-modal");
  document.getElementById("btn-preview").addEventListener("click", () => {
    modal.style.display = "flex";
    isPreviewing = true;
    requestAnimationFrame(drawPreview);
  });
  document.getElementById("btn-close-preview").addEventListener("click", () => {
    modal.style.display = "none";
    isPreviewing = false;
  });

  let isPreviewing = false;

  function drawPreview(time) {
    if (!isPreviewing) return;
    twgl.resizeCanvasToDisplaySize(previewGl.canvas);
    previewGl.viewport(0, 0, previewGl.canvas.width, previewGl.canvas.height);
    previewGl.clearColor(0.2, 0.2, 0.2, 1.0);
    previewGl.clear(previewGl.COLOR_BUFFER_BIT | previewGl.DEPTH_BUFFER_BIT);
    previewGl.enable(previewGl.DEPTH_TEST);

    previewGl.useProgram(previewProgramInfo.program);
    const projectionMatrix = twgl.m4.perspective(
      (60 * Math.PI) / 180,
      previewGl.canvas.clientWidth / previewGl.canvas.clientHeight,
      0.1,
      100,
    );
    const cameraMatrix = twgl.m4.lookAt([0, 2, 5], [0, 0, 0], [0, 1, 0]);
    let matrix = twgl.m4.rotateY(
      twgl.m4.multiply(projectionMatrix, twgl.m4.inverse(cameraMatrix)),
      time * 0.001,
    );

    const previewType =
      selectMenu && selectMenu.value ? selectMenu.value : nomesDosModelos[0];
    const partsToDraw = previewModelos[previewType];

    if (partsToDraw) {
      for (const part of partsToDraw) {
        twgl.setBuffersAndAttributes(
          previewGl,
          previewProgramInfo,
          part.bufferInfo,
        );
        twgl.setUniforms(previewProgramInfo, {
          u_matrix: matrix,
          u_diffuse: part.material.u_diffuse,
          u_useTexture: false,
          u_texture: texturasPreview.leaves,
          u_isSelected: false,
        });
        twgl.drawBufferInfo(previewGl, part.bufferInfo);
      }
    }
    requestAnimationFrame(drawPreview);
  }

  let then = 0;

  function getWorldMatrix(obj, visited = new Set()) {
    if (!obj.parentId || obj.parentId === "none") return obj.localMatrix;

    if (visited.has(obj.id)) return obj.localMatrix;
    visited.add(obj.id);

    const parent = objects.find(
      (o) => o.id.toString() === obj.parentId.toString(),
    );
    if (!parent) return obj.localMatrix;

    return twgl.m4.multiply(getWorldMatrix(parent, visited), obj.localMatrix);
  }

  function drawScene(time) {
    let now = time * 0.001;
    let deltaTime = now - then;
    then = now;
    if (deltaTime > 0.1) deltaTime = 0.016;

    if (twgl.resizeCanvasToDisplaySize(gl.canvas)) {
      setFramebufferAttachmentSizes(gl.canvas.width, gl.canvas.height);
    }

    const aspect = gl.canvas.clientWidth / Math.max(1, gl.canvas.clientHeight);
    const projectionMatrix = twgl.m4.perspective(
      (60 * Math.PI) / 180,
      aspect,
      0.1,
      1000,
    );
    const cameraMatrix = twgl.m4.lookAt([0, 8, 20], [0, 0, 0], [0, 1, 0]);
    const viewProjectionMatrix = twgl.m4.multiply(
      projectionMatrix,
      twgl.m4.inverse(cameraMatrix),
    );

    objects.forEach((obj) => {
      if (obj.animType !== "none")
        obj.animProgress += obj.animSpeed * deltaTime;
      let currentX = obj.x;
      let currentRY = obj.ry;
      if (obj.animType === "rotateY") currentRY += obj.animProgress * 50;
      if (obj.animType === "moveX")
        currentX += Math.sin(obj.animProgress) * 2.0;

      let local = twgl.m4.identity();
      local = twgl.m4.translate(local, [currentX, obj.y, obj.z]);
      local = twgl.m4.rotateY(local, (currentRY * Math.PI) / 180);
      obj.localMatrix = twgl.m4.scale(local, [
        obj.scaleX,
        obj.scaleY,
        obj.scaleZ,
      ]);
    });

    objects.forEach((obj) => {
      obj.worldMatrix = getWorldMatrix(obj);
      obj.currentMatrix = twgl.m4.multiply(
        viewProjectionMatrix,
        obj.worldMatrix,
      );
    });

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.useProgram(pickingProgramInfo.program);
    objects.forEach((obj) => {
      const partsToDraw = modelos[obj.modelType];
      if (partsToDraw) {
        for (const part of partsToDraw) {
          twgl.setBuffersAndAttributes(gl, pickingProgramInfo, part.bufferInfo);
          twgl.setUniforms(pickingProgramInfo, {
            u_matrix: obj.currentMatrix,
            u_id: obj.u_id,
          });
          twgl.drawBufferInfo(gl, part.bufferInfo);
        }
      }
    });

    if (clicked) {
      const pixelX = (mouseX * gl.canvas.width) / gl.canvas.clientWidth;
      const pixelY =
        gl.canvas.height -
        (mouseY * gl.canvas.height) / gl.canvas.clientHeight -
        1;

      if (pixelX >= 0 && pixelY >= 0) {
        const data = new Uint8Array(4);
        gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);

        const id =
          data[0] + data[1] * 256 + data[2] * 65536 + data[3] * 16777216;

        if (id > 0) {
          selectedObject = objects.find((o) => o.id === id);
        } else {
          selectedObject = null;
        }
        updateUI();
      }
      clicked = false;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(programInfo.program);
    objects.forEach((obj) => {
      let useTex = obj.texSelect !== "none";
      let isSelected = obj === selectedObject;

      const partsToDraw = modelos[obj.modelType];
      if (partsToDraw) {
        for (const part of partsToDraw) {
          twgl.setBuffersAndAttributes(gl, programInfo, part.bufferInfo);
          twgl.setUniforms(programInfo, {
            u_matrix: obj.currentMatrix,
            u_diffuse: part.material.u_diffuse,
            u_useTexture: useTex,
            u_texture: useTex ? texturas[obj.texSelect] : texturas.leaves,
            u_isSelected: isSelected,
          });
          twgl.drawBufferInfo(gl, part.bufferInfo);
        }
      }
    });

    requestAnimationFrame(drawScene);
  }

  requestAnimationFrame(drawScene);
}

window.onload = main;

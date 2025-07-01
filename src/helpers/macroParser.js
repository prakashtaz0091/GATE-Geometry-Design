function parseMacro(macroText) {
  const lines = macroText.split("\n");
  const geometries = [];
  let current = null;
  let geometry_id = 0;

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;

    // Match geometry name
    const nameMatch = line.match(/\/gate\/[^\/]+\/daughters\/name\s+(\w+)/);
    if (nameMatch) {
      geometry_id++;
      current = {
        id: geometry_id,
        name: nameMatch[1],
        geometry: {},
        vis: {
          visible: true,
          opacity: 1,
          wireframe: false,
        },
      };
      geometries.push(current);
      continue;
    }

    // Match geometry type
    const insertMatch = line.match(/\/gate\/[^\/]+\/daughters\/insert\s+(\w+)/);
    if (insertMatch && current) {
      current.type = insertMatch[1];
      continue;
    }

    // Match geometry dimensions
    const xLen = line.match(/\/geometry\/setXLength\s+(\S+\s*\S*)/);
    if (xLen && current) current.geometry.xLength = xLen[1].trim();

    const yLen = line.match(/\/geometry\/setYLength\s+(\S+\s*\S*)/);
    if (yLen && current) current.geometry.yLength = yLen[1].trim();

    const zLen = line.match(/\/geometry\/setZLength\s+(\S+\s*\S*)/);
    if (zLen && current) current.geometry.zLength = zLen[1].trim();

    // Match translation
    const translationMatch = line.match(
      /\/placement\/setTranslation\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*(\w*)/
    );
    if (translationMatch && current) {
      const unit = translationMatch[4] || "cm";
      current.geometry.translation = {
        x: `${translationMatch[1]} ${unit}`,
        y: `${translationMatch[2]} ${unit}`,
        z: `${translationMatch[3]} ${unit}`,
      };
    }

    // Match material
    const material = line.match(/\/setMaterial\s+(\w+)/);
    if (material && current) current.material = material[1];

    // Match color
    const color = line.match(/\/vis\/setColor\s+(\w+)/);
    if (color && current) current.vis.color = color[1];

    // Match wireframe
    if (line.includes("/vis/forceWireframe") && current) {
      current.vis.wireframe = true;
    }
  }

  return geometries;
}

export { parseMacro };

const compareVersions = (v1, v2) => {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 >= num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
};

const filterCategoriesByVersion = (data, minVersion) => {
  return data.filter((row) => compareVersions(row.version, minVersion) >= 0);
};

export default filterCategoriesByVersion;

export function extractWeightInGrams(weightStr) {
   if (!weightStr) return 0;

    const str = weightStr.toLowerCase().trim();

    try {
      if (str.includes("g") || str.includes("gram")) {
        const match = str.match(/(\d+(\.\d+)?)/);
        if (match) {
          return parseFloat(match[1]);
        }
      }

      if (str.includes("kg") || str.includes("kilogram")) {
        const match = str.match(/(\d+(\.\d+)?)/);
        if (match) {
          return parseFloat(match[1]) * 1000;
        }
      }

      if (str.includes("ml") || str.includes("l")) {
        const match = str.match(/(\d+(\.\d+)?)/);
        if (match) {
          return parseFloat(match[1]);
        }
      }

      const fallbackMatch = str.match(/(\d+(\.\d+)?)/);
      if (fallbackMatch) {
        return parseFloat(fallbackMatch[1]);
      }

      return 0;
    } catch (error) {
      console.error("Error parsing weight:", weightStr, error);
      return 0;
    }
}

export function calculateTotalWeight (items) {
    let totalWeight = 0;

    items.forEach((item) => {
      if (item.product && item.product.weight) {
        const weightStr = item.product.weight;
        const weight = extractWeightInGrams(weightStr);
        const quantity = item.quantity || 1;
        totalWeight += weight * quantity;
      } else if (item.weight) {
        const weightStr = item.weight;
        const weight = extractWeightInGrams(weightStr);
        const quantity = item.quantity || 1;
        totalWeight += weight * quantity;
      }
    });

    return totalWeight;
  };
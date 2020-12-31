export const handleMore = (notify, allPrices) => {
  const { value, active } = notify;
  let signalData;

  const morePrice = allPrices.find(({ price }) => price > value);

  if (active && morePrice) {
    signalData = { ...morePrice, userRequest: value, active: false };
  } else if (!active && !morePrice) {
    signalData = { active: true };
  }

  return signalData;
};

export const handleLess = (notify, allPrices) => {
  const { value, active } = notify;
  let signalData;

  const lessPrice = allPrices.find(({ price }) => price < value);

  if (active && lessPrice) {
    signalData = { ...lessPrice, userRequest: value, active: false };
  } else if (!active && !lessPrice) {
    signalData = { active: true };
  }

  return signalData;
};

export const handleDifference = (notify, allPrices, min, max) => {
  const { value, active } = notify;
  const onePercent = min.price / 100;
  const difference = (max.price - min.price) / onePercent;
  let signalData;

  if (active && difference >= value) {
    signalData = { differencePrices: [min, max], userRequest: value, active: false };
  } else if (!active && difference < value) {
    signalData = { active: true };
  }

  return signalData;
};
export function calculateSMA(data, period) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      // not enough data
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    sma.push({ time: data[i].time, value: sum / period });
  }
  return sma;
}

export function calculateEMA(data, period) {
  const ema = [];
  const multiplier = 2 / (period + 1);
  let prevEma = null;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      if (i === period - 2) {
        // calculate initial SMA
        let sum = 0;
        for (let j = 0; j < period - 1; j++) {
          sum += data[i - j].close;
        }
        prevEma = sum / (period - 1); // approximate
      }
      continue;
    }

    if (prevEma === null) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      prevEma = sum / period;
    } else {
      prevEma = (data[i].close - prevEma) * multiplier + prevEma;
    }
    ema.push({ time: data[i].time, value: prevEma });
  }
  return ema;
}

export function calculateBollingerBands(data, period, stdDevMultiplier) {
  const upper = [];
  const lower = [];
  const middle = calculateSMA(data, period);
  const middleMap = new Map(middle.map(m => [m.time, m.value]));

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) continue;

    const smaValue = middleMap.get(data[i].time);
    if (smaValue === undefined) continue;

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += Math.pow(data[i - j].close - smaValue, 2);
    }
    const stdDev = Math.sqrt(sum / period);

    upper.push({ time: data[i].time, value: smaValue + stdDev * stdDevMultiplier });
    lower.push({ time: data[i].time, value: smaValue - stdDev * stdDevMultiplier });
  }
  return { upper, lower, middle };
}

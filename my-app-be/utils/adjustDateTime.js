const isRender = process.env.IS_RENDER === "true";

// Funkcia na zistenie či je letný čas na Slovensku
function isSummerTimeInSlovakia(date) {
  const year = date.getFullYear();

  // Začiatok letného času: posledná nedeľa v marci
  const march = new Date(year, 2, 31); // 31. marec
  while (march.getDay() !== 0) { // 0 = Sunday
    march.setDate(march.getDate() - 1);
  }

  // Koniec letného času: posledná nedeľa v októbri
  const october = new Date(year, 9, 31); // 31. október
  while (october.getDay() !== 0) {
    october.setDate(october.getDate() - 1);
  }

  return date >= march && date < october;
}

export function adjustDateIfNeeded(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (isRender) {
    const hoursShift = isSummerTimeInSlovakia(date) ? 2 : 1;
    date.setHours(date.getHours() - hoursShift);
  }

  return date;
}

export function getTimeShiftedStartEnd(baseDate, type = "day") {
  const day = new Date(baseDate);
  let startDate, endDate;

  if (type === "day") {
    if (isRender) {
      const hoursShift = isSummerTimeInSlovakia(day) ? 2 : 1;

      startDate = new Date(day);
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(24 - hoursShift, 0, 0, 0);

      endDate = new Date(day);
      endDate.setHours(21, 59, 59, 999);
    } else {
      startDate = new Date(day);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(day);
      endDate.setHours(23, 59, 59, 999);
    }
  }

  if (type === "month") {
    const startOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
    const endOfMonth = new Date(day.getFullYear(), day.getMonth() + 1, 0);

    if (isRender) {
      const hoursShift = isSummerTimeInSlovakia(startOfMonth) ? 2 : 1;

      startDate = new Date(startOfMonth);
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(24 - hoursShift, 0, 0, 0);

      endDate = new Date(endOfMonth);
      endDate.setHours(21, 59, 59, 999);
    } else {
      startDate = new Date(startOfMonth);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(endOfMonth);
      endDate.setHours(23, 59, 59, 999);
    }
  }

  return { startDate, endDate };
}

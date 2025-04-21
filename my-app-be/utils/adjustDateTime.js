
const isRender = process.env.IS_RENDER === "true";


export function adjustDateIfNeeded(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
  
    if (isRender) {
      date.setHours(date.getHours() - 2);
    } else {
    }
  
    return date;
  }
  
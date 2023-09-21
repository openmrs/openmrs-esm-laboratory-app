export const trimVisitNumber = (visitNumber: string) => {
  if (!visitNumber) {
    return;
  }
  return visitNumber.substring(15);
};

export const formatWaitTime = (waitTime: string, t) => {
  const num = parseInt(waitTime);
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  if (rhours > 0) {
    return (
      rhours +
      " " +
      `${t("hoursAnd", "hours and ")}` +
      rminutes +
      " " +
      `${t("minutes", "minutes")}`
    );
  } else {
    return rminutes + " " + `${t("minutes", "minutes")}`;
  }
};

export const getTagColor = (waitTime: string) => {
  const num = parseInt(waitTime);
  if (num <= 30) {
    return "green";
  } else if (num > 30 && num <= 45) {
    return "orange";
  } else {
    return "red";
  }
};

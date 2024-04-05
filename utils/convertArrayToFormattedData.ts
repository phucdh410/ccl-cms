type FormattedData = {
  year: string;
  month: string[];
  label: string[];
};

export const convertArrayToFormattedData = (inputArray: string[]): FormattedData[] => {
  const result: FormattedData[] = [];

  inputArray.forEach((item) => {
    const [month, year] = item.split(".");
    const formattedData: FormattedData | undefined = result.find(
      (data) => data.year === year
    );

    if (formattedData) {
      formattedData.month.push(month.padStart(2, "0"));
      formattedData.label.push(`${month.padStart(2, "0")}.${year}`);
    } else {
      result.push({
        year,
        month: [month.padStart(2, "0")],
        label: [`${month.padStart(2, "0")}.${year}`],
      });
    }
  });

  return result;
};

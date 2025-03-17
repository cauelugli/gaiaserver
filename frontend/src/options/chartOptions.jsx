export const processData = (data, groupBy) => {
  const groupedData = {};

  data.forEach((item) => {
    const date = new Date(item.createdAt);
    let key;

    if (groupBy === "day") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    } else if (groupBy === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = `${weekStart.getFullYear()}-${String(
        weekStart.getMonth() + 1
      ).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
    } else if (groupBy === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    }

    if (!groupedData[key]) {
      groupedData[key] = [];
    }

    groupedData[key].push(item);
  });

  return groupedData;
};

export const getChartItems = (salesData, jobsData, stockData, groupBy) => {
  // Processamento de Sales
  const resolvedSales = salesData.data.filter(
    (item) => item.status === "Resolvido"
  );
  const allSales = salesData.data;

  const processedResolvedData = processData(resolvedSales, groupBy);
  const processedAllData = processData(allSales, groupBy);

  const labelsResolved = Object.keys(processedResolvedData).sort();
  const valuesResolved = labelsResolved.map(
    (date) => processedResolvedData[date]
  );

  const labelsAll = Object.keys(processedAllData).sort();
  const valuesAll = labelsAll.map((date) => processedAllData[date]);

  // Processamento de Stock
  const resolvedStockEntries = stockData.data.filter(
    (item) => item.status === "Resolvido"
  );
  const allStockEntries = stockData.data;

  const processedResolvedStockData = processData(resolvedStockEntries, groupBy);
  const processedAllStockData = processData(allStockEntries, groupBy);

  const labelsResolvedStock = Object.keys(processedResolvedStockData).sort();
  const valuesResolvedStock = labelsResolvedStock.map(
    (date) => processedResolvedStockData[date]
  );

  const labelsAllStock = Object.keys(processedAllStockData).sort();
  const valuesAllStock = labelsAllStock.map(
    (date) => processedAllStockData[date]
  );

  // Processamento de Jobs
  const resolvedJobs = jobsData.data.filter(
    (item) => item.status === "Resolvido"
  );
  const allJobs = jobsData.data;

  const processedResolvedJobsData = processData(resolvedJobs, groupBy);
  const processedAllJobsData = processData(allJobs, groupBy);

  const labelsResolvedJobs = Object.keys(processedResolvedJobsData).sort();
  const valuesResolvedJobs = labelsResolvedJobs.map(
    (date) => processedResolvedJobsData[date]
  );

  const labelsAllJobs = Object.keys(processedAllJobsData).sort();
  const valuesAllJobs = labelsAllJobs.map((date) => processedAllJobsData[date]);

  return [
    {
      id: 0,
      title: "Vendas Criadas",
      labels: labelsAll,
      values: valuesAll,
      length: valuesAll.map((value) => value.length),
      color: "#1976d2",
      type: "Sale",
      subtype: "created",
    },
    {
      id: 1,
      title: "Vendas Resolvidas",
      labels: labelsResolved,
      values: valuesResolved,
      length: valuesResolved.map((value) => value.length),
      color: "#4caf50",
      type: "Sale",
      subtype: "resolved",
    },
    {
      id: 2,
      title: "Jobs Criados",
      labels: labelsAllJobs,
      values: valuesAllJobs,
      length: valuesAllJobs.map((value) => value.length),
      color: "#e04414",
      type: "Job",
      subtype: "created",
    },
    {
      id: 3,
      title: "Jobs Resolvidos",
      labels: labelsResolvedJobs,
      values: valuesResolvedJobs,
      length: valuesResolvedJobs.map((value) => value.length),
      color: "#ff00a6",
      type: "Job",
      subtype: "resolved",
    },
    {
      id: 4,
      title: "Entradas de Estoque",
      labels: labelsAllStock,
      values: valuesAllStock,
      length: valuesAllStock.map((value) => value.length),
      color: "#ff9800",
      type: "StockEntry",
      subtype: "created",
    },
    {
      id: 5,
      title: "Entradas de Estoque Resolvidas",
      labels: labelsResolvedStock,
      values: valuesResolvedStock,
      length: valuesResolvedStock.map((value) => value.length),
      color: "#9c27b0",
      type: "StockEntry",
      subtype: "resolved",
    },
  ];
};

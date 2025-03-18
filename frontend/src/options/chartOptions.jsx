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
  const allSales = salesData.data;
  const resolvedSales = salesData.data.filter(
    (item) => item.status === "Resolvido"
  );
  const pendingSales = salesData.data.filter(
    (item) => item.status !== "Resolvido" && item.status !== "Arquivado"
  );
  const archivedSales = salesData.data.filter(
    (item) => item.status === "Arquivado"
  );

  const processedResolvedData = processData(resolvedSales, groupBy);
  const processedPendingData = processData(pendingSales, groupBy);
  const processedArchivedData = processData(archivedSales, groupBy);
  const processedAllData = processData(allSales, groupBy);

  const labelsResolvedSales = Object.keys(processedResolvedData).sort();
  const labelsPendingSales = Object.keys(processedPendingData).sort();
  const labelsArchivedSales = Object.keys(processedArchivedData).sort();
  const valuesResolvedSales = labelsResolvedSales.map(
    (date) => processedResolvedData[date]
  );
  const valuesPendingSales = labelsPendingSales.map(
    (date) => processedPendingData[date]
  );
  const valuesArchivedSales = labelsArchivedSales.map(
    (date) => processedArchivedData[date]
  );

  const labelsAllSales = Object.keys(processedAllData).sort();
  const valuesAllSales = labelsAllSales.map((date) => processedAllData[date]);

  // Processamento de Stock
  const resolvedStockEntries = stockData.data.filter(
    (item) => item.status === "Resolvido"
  );
  const archivedStockEntries = stockData.data.filter(
    (item) => item.status === "Arquivado"
  );
  const pendingStockEntries = stockData.data.filter(
    (item) => item.status !== "Resolvido" && item.status !== "Arquivado"
  );
  const allStockEntries = stockData.data;

  const processedResolvedStockData = processData(resolvedStockEntries, groupBy);
  const processedArchivedStockData = processData(archivedStockEntries, groupBy);
  const processedPendingStockData = processData(pendingStockEntries, groupBy);
  const processedAllStockData = processData(allStockEntries, groupBy);

  const labelsResolvedStock = Object.keys(processedResolvedStockData).sort();
  const labelsArchivedStock = Object.keys(processedArchivedStockData).sort();
  const labelsPendingStock = Object.keys(processedPendingStockData).sort();
  const valuesResolvedStock = labelsResolvedStock.map(
    (date) => processedResolvedStockData[date]
  );
  const valuesArchivedStock = labelsArchivedStock.map(
    (date) => processedArchivedStockData[date]
  );
  const valuesPendingStock = labelsPendingStock.map(
    (date) => processedPendingStockData[date]
  );

  const labelsAllStock = Object.keys(processedAllStockData).sort();
  const valuesAllStock = labelsAllStock.map(
    (date) => processedAllStockData[date]
  );

  // Processamento de Jobs
  const resolvedJobs = jobsData.data.filter(
    (item) => item.status === "Resolvido"
  );
  const archivedJobs = jobsData.data.filter(
    (item) => item.status === "Arquivado"
  );
  const pendingJobs = jobsData.data.filter(
    (item) => item.status !== "Resolvido" && item.status !== "Arquivado"
  );
  const allJobs = jobsData.data;

  const processedResolvedJobsData = processData(resolvedJobs, groupBy);
  const processedArchivedJobsData = processData(archivedJobs, groupBy);
  const processedPendingJobsData = processData(pendingJobs, groupBy);
  const processedAllJobsData = processData(allJobs, groupBy);

  const labelsResolvedJobs = Object.keys(processedResolvedJobsData).sort();
  const labelsArchivedJobs = Object.keys(processedArchivedJobsData).sort();
  const labelsPendingJobs = Object.keys(processedPendingJobsData).sort();
  const valuesResolvedJobs = labelsResolvedJobs.map(
    (date) => processedResolvedJobsData[date]
  );
  const valuesArchivedJobs = labelsArchivedJobs.map(
    (date) => processedResolvedJobsData[date]
  );
  const valuesPendingJobs = labelsPendingJobs.map(
    (date) => processedPendingJobsData[date]
  );

  const labelsAllJobs = Object.keys(processedAllJobsData).sort();
  const valuesAllJobs = labelsAllJobs.map((date) => processedAllJobsData[date]);

  return [
    {
      id: 1,
      title: "Vendas Total",
      labels: labelsAllSales,
      values: valuesAllSales,
      length: valuesAllSales.map((value) => value.length),
      color: "#1976d2",
      type: "Sale",
      subtype: "created",
    },
    {
      id: 2,
      title: "Vendas Pendentes",
      labels: labelsPendingSales,
      values: valuesPendingSales,
      length: valuesPendingSales.map((value) => value.length),
      color: "#1976d2",
      type: "Sale",
      subtype: "pending",
    },
    {
      id: 3,
      title: "Vendas Resolvidas",
      labels: labelsResolvedSales,
      values: valuesResolvedSales,
      length: valuesResolvedSales.map((value) => value.length),
      color: "#1976d2",
      type: "Sale",
      subtype: "resolved",
    },
    {
      id: 4,
      title: "Vendas Arquivadas",
      labels: labelsArchivedSales,
      values: valuesArchivedSales,
      length: valuesArchivedSales.map((value) => value.length),
      color: "#1976d2",
      type: "Sale",
      subtype: "archived",
    },
    {
      id: 5,
      title: "Jobs Total",
      labels: labelsAllJobs,
      values: valuesAllJobs,
      length: valuesAllJobs.map((value) => value.length),
      color: "#e04414",
      type: "Job",
      subtype: "created",
    },
    {
      id: 6,
      title: "Jobs Pendentes",
      labels: labelsPendingJobs,
      values: valuesPendingJobs,
      length: valuesPendingJobs.map((value) => value.length),
      color: "#e04414",
      type: "Job",
      subtype: "pending",
    },
    {
      id: 7,
      title: "Jobs Resolvidos",
      labels: labelsResolvedJobs,
      values: valuesResolvedJobs,
      length: valuesResolvedJobs.map((value) => value.length),
      color: "#e04414",
      type: "Job",
      subtype: "resolved",
    },
    {
      id: 8,
      title: "Jobs Arquivados",
      labels: labelsArchivedJobs,
      values: valuesArchivedJobs,
      length: valuesArchivedJobs.map((value) => value.length),
      color: "#e04414",
      type: "Job",
      subtype: "archived",
    },
    {
      id: 9,
      title: "Entradas de Estoque Total",
      labels: labelsAllStock,
      values: valuesAllStock,
      length: valuesAllStock.map((value) => value.length),
      color: "#ff9800",
      type: "StockEntry",
      subtype: "created",
    },
    {
      id: 10,
      title: "Entradas de Estoque Pendentes",
      labels: labelsPendingStock,
      values: valuesPendingStock,
      length: valuesPendingStock.map((value) => value.length),
      color: "#ff9800",
      type: "StockEntry",
      subtype: "pending",
    },
    {
      id: 11,
      title: "Entradas de Estoque Resolvidas",
      labels: labelsResolvedStock,
      values: valuesResolvedStock,
      length: valuesResolvedStock.map((value) => value.length),
      color: "#ff9800",
      type: "StockEntry",
      subtype: "resolved",
    },
    {
      id: 12,
      title: "Entradas de Estoque Arquivadas",
      labels: labelsArchivedStock,
      values: valuesArchivedStock,
      length: valuesArchivedStock.map((value) => value.length),
      color: "#ff9800",
      type: "StockEntry",
      subtype: "archived",
    },
  ];
};

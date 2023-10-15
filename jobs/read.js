import excelToJson from "convert-excel-to-json";
import axios from "axios";
const api = axios.create({ baseURL: "http://127.0.0.2:3333" });

const job = async () => {
  let rows = excelToJson({
    sourceFile: "x.xlsx",
    columnToKey: {
      "*": "{{columnHeader}}",
    },
  });
  console.log(rows);
  let info = rows.x;
  let i = 0;
  info.forEach(async (row) => {
    i++;
    console.log(row.os);
    const data = {
      created_at: row.Data,
      os_number: row.os,
      part_name: row.Produto,
      qtd: row.QTD,
      sale_cost: row.Custo,
      sale_value: row.Venda,
      ticket: row.Lucro,
    };
    console.log({ data });
    const result = await api
      .post("/parts", data, {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiJGJjcnlwdCR2PTk4JHI9MTAkSWV2czZON0I5N1kwV1BHVDd0Q1U5USQ1eFNLRGZWTi9kQ1RGUGcvcTZzQzMvY3I3a1VWWUw4IiwiaWF0IjoxNjk3NDEyMjU0LCJleHAiOjE2OTc0MTMxNTR9.hKZ-iJ5KzXn4S11eUrq1TR53_0wnpHec52Zxt4k1IY0",
          xid: "2",
        },
      })
      .then((res) => res.data);
  });
  console.log("ind", { i });
};

job();

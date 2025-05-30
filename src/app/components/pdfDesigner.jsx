"use client";

import React, { useEffect, useRef } from "react";
import { Designer } from "@pdfme/ui";
import {
  text,
  image,
  table,
  date,
  dateTime,
  checkbox,
  select,
  //   getDynamicHeightsForTable,
} from "@pdfme/schemas";

export default function PdfDesigner() {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadTemplate = async () => {
      const res = await fetch("/template.pdf");
      const pdfBuffer = await res.arrayBuffer();

      const template = {
        schemas: [
          {
            title: {
              type: "text",
              position: { x: 50, y: 50 },
              width: 300,
              height: 30,
              fontSize: 20,
              fontWeight: "bold",
            },
            logo: {
              type: "image",
              position: { x: 400, y: 40 },
              width: 100,
              height: 50,
            },
            itemsTable: {
              type: "table",
              position: { x: 50, y: 150 },
              width: 500,
              height: 300,
              columns: [
                { key: "item", header: "Item", width: 200 },
                { key: "qty", header: "Quantity", width: 100 },
                { key: "price", header: "Price", width: 100 },
                { key: "total", header: "Total", width: 100 },
              ],
            },
          },
        ],
        basePdf: pdfBuffer,
      };

      if (containerRef.current) {
        new Designer({
          domContainer: containerRef.current,
          template,
          plugins: {
            text,
            image,
            table,
            date,
            dateTime,
            checkbox,
            select,
            // getDynamicHeightsForTable,
          },
        });
      }
    };

    loadTemplate();
  }, []);

  return <div ref={containerRef} style={{ height: "800px" }} />;
}

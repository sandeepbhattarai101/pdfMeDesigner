"use client";

import React, { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";
import {
  text,
  image,
  table,
  date,
  dateTime,
  checkbox,
  select,
} from "@pdfme/schemas";
import { generate } from "@pdfme/generator";
import { getInputFromTemplate } from "@pdfme/common";
import html2canvas from "html2canvas";

function downloadJsonFile(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PdfDesigner() {
  const containerRef = useRef(null);
  const designer = useRef(null);
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    async function loadTemplate() {
      //   const savedTemplate = localStorage.getItem("template");
      const savedTemplate = await fetch("/myData.json").then((res) =>
        res.json()
      );
      console.log("saved template", savedTemplate);

      const pdfBuffer = await fetch("/template.pdf").then((res) =>
        res.arrayBuffer()
      );

      let templateObj;

      if (savedTemplate) {
        templateObj = savedTemplate;
        templateObj.basePdf = pdfBuffer;
      } else {
        templateObj = {
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
            },
            {
              logo: {
                type: "image",
                position: { x: 400, y: 40 },
                width: 100,
                height: 50,
              },
            },
            {
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
      }

      setTemplate(templateObj);

      if (containerRef.current) {
        designer.current = new Designer({
          domContainer: containerRef.current,
          template: templateObj,
          plugins: {
            text,
            image,
            table,
            date,
            dateTime,
            checkbox,
            select,
          },
        });
      }
    }

    loadTemplate();
  }, []);

  const onDownloadTemplate = () => {
    if (designer.current) {
      const currentTemplate = designer.current.getTemplate();
      downloadJsonFile(currentTemplate, "template");
    }
  };

  const onSaveTemplate = () => {
    if (designer.current) {
      const currentTemplate = designer.current.getTemplate();
      localStorage.setItem("template", JSON.stringify(currentTemplate));
      alert("Template saved to localStorage!");
    }
  };

  const handleExport = async () => {
    if (!designer.current) return;

    console.log("designer ", designer);

    try {
      const currentTemplate = designer.current.getTemplate();
      const currentInputs = getInputFromTemplate(currentTemplate);

      const pdfBuffer = await generate({
        template: currentTemplate,
        inputs: currentInputs,
        plugins: {
          text,
          image,
          table,
          date,
          dateTime,
          checkbox,
          select,
        },
      });

      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "generated_from_ui.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to export PDF. See console for details.");
    }
  };

  return (
    <div>
      <div ref={containerRef} style={{ height: "800px" }} />
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={onSaveTemplate}
          className="border border-green-500 px-4 py-2 rounded"
        >
          Save Template
        </button>
        <button
          onClick={onDownloadTemplate}
          className="border border-blue-500 px-4 py-2 rounded"
        >
          Download Template JSON
        </button>
        <button
          onClick={handleExport}
          className="border border-red-500 px-4 py-2 rounded"
        >
          Export Image
        </button>
      </div>
    </div>
  );
}

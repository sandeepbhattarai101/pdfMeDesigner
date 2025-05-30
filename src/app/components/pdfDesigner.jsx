// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Designer } from "@pdfme/ui";

// import {
//   text,
//   image,
//   table,
//   date,
//   dateTime,
//   checkbox,
//   select,
// } from "@pdfme/schemas";
// import { generate } from "@pdfme/generator";

// export default function PdfDesigner() {
//   const containerRef = useRef(null);
//   const [template, setTemplate] = useState(null);

//   useEffect(() => {
//     const loadTemplate = async () => {
//       const res = await fetch("/template.pdf");
//       const pdfBuffer = await res.arrayBuffer();

//       const templateObj = {
//         schemas: [
//           {
//             title: {
//               type: "text",
//               position: { x: 50, y: 50 },
//               width: 300,
//               height: 30,
//               fontSize: 20,
//               fontWeight: "bold",
//             },
//           },
//           {
//             logo: {
//               type: "image",
//               position: { x: 400, y: 40 },
//               width: 100,
//               height: 50,
//             },
//           },
//           {
//             itemsTable: {
//               type: "table",
//               position: { x: 50, y: 150 },
//               width: 500,
//               height: 300,
//               columns: [
//                 { key: "item", header: "Item", width: 200 },
//                 { key: "qty", header: "Quantity", width: 100 },
//                 { key: "price", header: "Price", width: 100 },
//                 { key: "total", header: "Total", width: 100 },
//               ],
//             },
//           },
//         ],
//         basePdf: pdfBuffer,
//       };

//       setTemplate(templateObj);

//       if (containerRef.current) {
//         new Designer({
//           domContainer: containerRef.current,
//           template: templateObj,
//           plugins: {
//             text,
//             image,
//             table,
//             date,
//             dateTime,
//             checkbox,
//             select,
//           },
//         });
//       }
//     };

//     loadTemplate();
//   }, []);

//   const handleExport = async () => {
//     if (!template) return;

//     console.log("templatees", template);

//     // Your dynamic data matching schema keys
//     const data = {
//       title: "Invoice #1234",
//       logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAADa/Z5cAAA...",
//       itemsTable: [
//         { item: "Apple", qty: 3, price: 5, total: 15 },
//         { item: "Orange", qty: 2, price: 7, total: 14 },
//       ],
//     };

//     const pdfBuffer = await generate({
//       template,
//       inputs: [data],
//       plugins: {
//         text,
//         image,
//         table,
//       },
//     });

//     // Create blob and download
//     const blob = new Blob([pdfBuffer], { type: "application/pdf" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "invoice.pdf";
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div>
//       <div ref={containerRef} style={{ height: "800px" }} />
//       <div className=" flex justify-center items-center">
//         <button onClick={handleExport} className="border border-red-300">
//           Export PDF
//         </button>
//       </div>
//     </div>
//   );
// }

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
      let templateObj;
      const savedTemplate = localStorage.getItem("template");
      const pdfBuffer = await fetch("/template.pdf").then((res) =>
        res.arrayBuffer()
      );

      if (savedTemplate) {
        templateObj = JSON.parse(savedTemplate);
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

  const onSaveTemplate = (templateToSave) => {
    if (designer.current) {
      localStorage.setItem(
        "template",
        JSON.stringify(templateToSave || designer.current.getTemplate())
      );
      alert("Template saved to localStorage!");
    }
  };

  //   const handleExport = async () => {
  //     if (!template) return;

  //     // Replace with your dynamic data source
  //     const data = {
  //       title: "Invoice #5678",
  //       logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAADa/Z5cAAA...",
  //       itemsTable: [
  //         { item: "Banana", qty: 5, price: 2, total: 10 },
  //         { item: "Peach", qty: 4, price: 4, total: 16 },
  //       ],
  //     };

  //     const pdfBuffer = await generate({
  //       template,
  //       inputs: [data],
  //       plugins: {
  //         text,
  //         image,
  //         table,
  //       },
  //     });

  //     const blob = new Blob([pdfBuffer], { type: "application/pdf" });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = "custom_invoice.pdf";
  //     link.click();
  //     URL.revokeObjectURL(url);
  //   };

  const handleExport = async () => {
    if (!designer.current) return;

    // 1. Get the live template (with design edits)
    const currentTemplate = designer.current.getTemplate();

    // 2. Get the live inputs (user-provided dynamic values)
    const currentInputs = designer.current.getInputs();

    try {
      const pdfBuffer = await generate({
        template: currentTemplate,
        inputs: currentInputs, // dynamic inputs filled in designer
        plugins: {
          text,
          image,
          table,
        },
      });

      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "custom_invoice.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <div>
      <div ref={containerRef} style={{ height: "800px" }} />
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => onSaveTemplate()}
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
          Export PDF
        </button>
      </div>
    </div>
  );
}

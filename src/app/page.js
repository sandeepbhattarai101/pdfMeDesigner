"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
// import PdfDesigner from "./components/pdfDesigner";
const PdfDesigner = dynamic(() => import("./components/PdfDesigner"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <h1 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
        PDF Template Designer
      </h1>
      <PdfDesigner />
    </div>
  );
}

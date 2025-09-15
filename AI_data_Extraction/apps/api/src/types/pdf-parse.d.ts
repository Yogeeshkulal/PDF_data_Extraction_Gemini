declare module "pdf-parse" {
  interface PDFInfo {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }

  interface PDFData {
    text: string;
    info: PDFInfo;
    metadata: any;
    version: string;
  }

  function pdf(dataBuffer: Buffer): Promise<PDFData>;

  export = pdf;
}

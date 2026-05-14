import { PDFParse } from "pdf-parse";

/**
 * Extracts text from a PDF buffer.
 * IMPORTANT: This function never persists the buffer or the extracted text.
 * The caller is responsible for discarding both after use.
 * The PDF is processed entirely in memory and never written to disk or storage.
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  let parser: PDFParse | null = null;
  try {
    parser = new PDFParse({ data: new Uint8Array(pdfBuffer) });
    const result = await parser.getText();
    const text = result.text ?? "";

    if (!text || text.trim().length < 100) {
      throw new Error(
        "PDF appears to be empty or could not be parsed. The file may be scanned without OCR or corrupted."
      );
    }

    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
    throw new Error("PDF extraction failed: Unknown error");
  } finally {
    if (parser) {
      await parser.destroy().catch(() => {});
    }
  }
}

import useDocStore from '@/store/doc';
import React, { useCallback, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

function highlightPattern(text: string, pattern: any) {
  return text.replace(pattern, (value) => `<mark style="background: red;">${value}</mark>`);
}

export default function Test() {
  const [numPages, setNumPages] = useState(0);

  const [searchText, setSearchText] = useState('Lo');

  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  function onChange(event: any) {
    setSearchText(event.target.value);
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }: any) {
    setNumPages(nextNumPages);
  }

  return (
    <>
      <div>
        <label htmlFor="search">Search:</label>
        <input type="search" id="search" value={searchText} onChange={onChange} />
      </div>
      <article>
        <Document
          options={{
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
          }}
          file="/sample.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <div key={`page_${index + 1}`} id={"pdf_" + index + 1}>
              <Page
                pageNumber={index + 1}
                customTextRenderer={textRenderer}
              />
            </div>
          ))}
        </Document>
      </article>
    </>
  );
}

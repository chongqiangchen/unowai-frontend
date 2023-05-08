import React, { Fragment, useCallback, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import useContainerWidth from '@/hooks/useContainerWidth';
import { Button } from 'antd';

type TProps = {
    pdf: string | File;
    needMergeHighlightTexts?: string[];
    onClose: () => void;
}

function highlightPattern(text: string, pattern: any) {
    return text.replace(pattern, (value) => `<mark className="text-[#FEF871]">${value}</mark>`);
}

const PDFViewer = forwardRef(({ pdf, onClose, needMergeHighlightTexts = [] }: TProps, ref: any) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [
        highlightTexts,
        setHighlightTexts,
    ] = useState<string[]>(needMergeHighlightTexts);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loadError, setLoadError] = useState<boolean>(false);
    // const pdfWidth = useContainerWidth(containerRef) || 0;

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    useImperativeHandle(ref, () => ({
        jumpToPage: (page: number) => {
            console.log("jumpToPage", page);
            const element = document.getElementById("pdf_" + page);
            if (element) {
                element.scrollIntoView();
            }
        },
        addHighlight: (text: string) => {
            setHighlightTexts([...highlightTexts, text]);
        }
    }))

    const [searchText, setSearchText] = useState('Lo');

    const textRenderer = useCallback(
        (textItem: any) => {
            let text = textItem.str;
            for (const highlightText of highlightTexts) {
                text = highlightPattern(text, highlightText);
            }
            return highlightPattern(text, searchText);
        },
        [highlightTexts]
    );

    const handlePDFLoadError = () => {
        console.log("handlePDFLoadError");
        setLoadError(true);
    }

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={onClose}
            >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay
                            onClick={() => { onClose(); setLoadError(false) }}
                            className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-md backdrop-brightness-75 transition-opacity"
                        />
                    </Transition.Child>

                    <div
                        ref={containerRef}
                        className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                    >
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            PDF Viewer
                        </Dialog.Title>
                        <div className="mt-2 max-h-[70vh] overflow-auto">
                            <Document
                                options={{
                                    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
                                }}
                                file={pdf}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={handlePDFLoadError}
                            >
                                {Array.from(new Array(numPages), (_, index) => (
                                    <div key={`page_${index + 1}`} id={"pdf_" + index + 1}>
                                        <Page
                                            pageNumber={index + 1}
                                            customTextRenderer={textRenderer}
                                        />
                                    </div>
                                ))}
                            </Document>

                            {loadError && (
                                <div>
                                    引用部分：
                                    <article className="prose">
                                        {highlightTexts.join("\n")}
                                    </article>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
});

PDFViewer.displayName = "PDFViewer";

export default PDFViewer;

const assertOk = (ok: unknown, message: string) => {
    if (!ok) {
        throw new Error(message);
    }
};
export type Annotation = {
    note?: string;
    highlight: string;
    locationNumber: number;
    kindleUrl: string;
};
export type ParseResult = {
    title: string;
    coverImageUrl: string;
    asin: string;
    url: string;
    annotations: Annotation[];
};
export const parsePage = (window: Window) => {
    const pages = window.document.querySelectorAll<HTMLDivElement>("#a-page");
    const page = pages[pages.length - 1]; // select child #a-page if nested #a-page
    const title = page.querySelector("h3.kp-notebook-metadata") as HTMLHeadingElement;
    const coverImage = page.querySelector(".kp-notebook-cover-image-border") as HTMLImageElement;
    const asinNode = page.querySelector(`[id="kp-notebook-annotations-asin"]`) as HTMLInputElement;
    const asinValue = asinNode.value;
    assertOk(coverImage, "coverImage not found");
    assertOk(asinNode, "ASIN not found");
    assertOk(title, "title not found");
    const annotationNodes = page.querySelectorAll<HTMLDivElement>("#kp-notebook-annotations > div.a-row");
    assertOk(annotationNodes.length > 0, "annotations not found");
    const annotations: Annotation[] = Array.from(annotationNodes)
        .filter((annotation) => {
            return (
                annotation.getAttribute("id") !== "empty-annotations-pane" &&
                // Sorry, we’re unable to display this type of content.
                annotation.querySelector(`[id="highlight"]`) !== null
            );
        })
        .map((annotation) => {
            const noteNode = annotation.querySelector(`[id="note"]`) as HTMLSpanElement;
            const noteValue = noteNode && noteNode.textContent ? noteNode.textContent : undefined;
            const locationNode = annotation.querySelector(`[id="kp-annotation-location"]`) as HTMLInputElement;
            assertOk(locationNode, "locationNode is not found");
            const highlightNode = annotation.querySelector(`[id="highlight"]`) as HTMLSpanElement;
            assertOk(highlightNode, "highlightNode is not found");
            const locationNumber = Number(locationNode.value);
            return {
                note: noteValue,
                locationNumber: locationNumber,
                highlight: highlightNode.textContent as string,
                kindleUrl: `kindle://book?action=open&asin=${asinValue}&location=${locationNumber}`
            };
        });
    return {
        title: title.textContent?.trim(),
        coverImageUrl: coverImage.src,
        asin: asinValue,
        url: `https://www.amazon.co.jp/dp/${asinValue}`, // TODO: hardcode
        annotations
    };
};
